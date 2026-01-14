import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Bid } from "../models/bid.models.js";
import { Gig } from "../models/gig.models.js";
import mongoose from "mongoose";

const createBid = asyncHandler( async( req , res ) => {
    const { gigId , message , price } = req.body;

    if ( !gigId || gigId.trim() === "") {
        throw new ApiError( 400 , "Gig id is required.")
    }

    if ( !message || message.trim() === "") {
        throw new ApiError( 400 , "Message is required.")
    }

    if ( !price) {
        throw new ApiError( 400 , "Price is required.")
    }

    const userId = req.user?._id ;

    if ( !userId ) {
        throw new ApiError( 401 , "Unauthorized request")
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
        throw new ApiError(404, "Gig not found");
      }
    
      if (gig.status !== "open") {
        throw new ApiError(400, "Bidding is closed for this gig");
      }
    
      if (gig.ownerId.toString() === userId.toString()) {
        throw new ApiError(403, "You cannot bid on your own gig");
      }

    const createdBid = await Bid.create({
        gigId : gigId ,
        freelancerId : userId ,
        message ,
        price 
    })

    if (!createdBid) {
        throw new ApiError( 500 , "Something went wrong bid was not placed.")
    }

    return res
    .status(201)
    .json( new ApiResponse( 201 , createdBid , "Bid has been placed."))
})

const getAllBids = asyncHandler(async( req , res ) => {
    const { gigId } = req.params 

    if ( !gigId ) {
        throw new ApiError( 400 , "Gig Id is required.")
    }
    
    const userId = req.user?._id ;

    if ( !userId ) {
        throw new ApiError (401 , "Unauthorized request.")
    };

    const gig = await Gig.findById(gigId).select("ownerId");

    if (!gig) {
        throw new ApiError(404, "Gig not found.");
    }


    if (userId.toString() !== gig.ownerId.toString()) {
        throw new ApiError( 403 , "Forbidden.")
    }

    const bids = await Bid.find({
        gigId : gigId
    })

    if ( bids.length === 0 ) {
        return res
        .status(200)
        .json(
            new ApiResponse(200 , [] , "No bids found for this gig.")
        )
    }

    return res
    .status(200)
    .json( new ApiResponse( 200 , bids , "Fetched all the bids for the specified gig."))
})

const confirmBid = asyncHandler( async ( req , res ) => {
    const { bidId } = req.params;

    if ( !bidId ) {
        throw new ApiError( 400 , "Bid Id is required.")
        
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request.");
    }


    const session = await mongoose.startSession();

    try {
        await session.withTransaction( async () => {
            const bid = await Bid.findById(bidId).session(session);

            if (!bid) {
                throw new ApiError( 404 , "Bid not found." )
            }

            const gig = await Gig.findById(bid.gigId).session(session);

            if (!gig) {
                throw new ApiError(404, "Gig not found.");
            }

            if (gig.ownerId.toString() !== userId.toString()) {
                throw new ApiError(403, "Only the gig owner can hire a freelancer.");
            }

            if (gig.status === "assigned") {
                throw new ApiError(400, "This gig has already been assigned.");
            }

            const updatedGig = await Gig.findByIdAndUpdate(bid.gigId , {
                $set : {
                    status : "assigned"
                }
            }, {session});

            if (!updatedGig) {
                throw new ApiError( 404 , "Gig was not found.")
            }

            const updateConfirmBid = await Bid.findByIdAndUpdate(bid._id , {
                $set : {
                    status : "hired"
                }
            }, {session})


            if (!updateConfirmBid) {
                throw new ApiError( 404 , "Bid was not found.")
            }

            await Bid.updateMany({
                gigId : gig._id ,
                _id : { $ne : bid._id }
            } , 
            { status : "rejected"} ,
            {session}
         )
        }) ;

        return res
            .status(200)
            .json( new ApiResponse(200 , null , "Freelancer hired successfully."))
    } finally {
        await session.endSession();
    }

})

export {
    createBid ,
    getAllBids ,
    confirmBid
}


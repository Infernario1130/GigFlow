import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Bid } from "../models/bid.models.js";
import { Gig } from "../models/gig.models.js";

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

})

export {
    createBid ,
    getAllBids
}
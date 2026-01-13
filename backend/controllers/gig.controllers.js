import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Gig } from "../models/gig.models.js";

const createGig = asyncHandler( async (req , res) => {
    const { title , description , budget } = req.body;

    if ([title , description , budget].some((field) => {
         return !field 
    })) {
        throw new ApiError( 400 , "Required fields are missing.")
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError( 401 , "Unauthorized request.")
    }

    const gig = await Gig.create({
        title ,
        description ,
        budget ,
        ownerId : userId
    })

    if ( !gig ) {
        throw new ApiError( 500 , "Something went wrong while creating the gig.")
    }

    return res
    .status(201)
    .json( new ApiResponse(201 , gig , "Gig created successfully."))
})


const getOpenGigs = asyncHandler(async (req, res) => {
    const { search } = req.query;

    const filter = { status : "open" };

    if ( search && search.trim() !== "") {
        filter.$text = { $search : search}
    }

    const gigs = await Gig.find(filter);

    if (gigs.length === 0) {
        throw new ApiError( 404 , "No open gigs are found at the moment.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, gigs, "Fetched open gigs successfully."));

});



export {
    createGig ,
    getOpenGigs
}
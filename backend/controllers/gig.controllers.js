import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Gig } from "../models/gig.models.js";

const createGig = asyncHandler( async (req , res) => {
    const { title , description , budget } = req.body;

    if ([title , description , budget].some((field) => {
        !field 
    })) {
        throw new ApiError( 404 , "Required fields are missing.")
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
        throw new ApiResponse( 500 , "Something went wrong while creating the gig.")
    }

    return res
    .status(201)
    .json( new ApiResponse(201 , gig , "Gig created successfully."))
})

export {
    createGig
}
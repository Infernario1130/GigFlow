import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler( async ( req , res ) => {
    const { name , email , password } = req.body;

    if ([ name , email , password].some((field) => {
        return !field || field?.trim() === ""
    })) {
        throw new ApiError( 400 , "Required fields are missing.")
    };

    const existingUser = await User.findOne({
        email : email
    })

    if (existingUser) {
        throw new ApiError( 400 , "User already exists." )
    }

    const user = await User.create({
        name ,
        email ,
        password
    })

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError( 500 , "Something went wrong while creating the user.")
    }

    return res
    .status(201)
    .json( new ApiResponse( 201 , createdUser , "User registerd successfully."))

})

export {
    registerUser
}
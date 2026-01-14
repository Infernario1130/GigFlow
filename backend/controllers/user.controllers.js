import "dotenv/config"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave : false});
    return { accessToken , refreshToken }
    } catch (error) {
        console.log(error)
       throw new ApiError( 500 , "Something went wrong while generating access and refresh token.")
 
    }
}

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

});

const loginUser = asyncHandler( async ( req , res ) => {
    const { email , password } = req.body;

    if ([ email , password ].some((field) => {
        return !field || field.trim() === ""
    })) {
        throw new ApiError( 400 , "Required fields are missing")
    }

    const user = await User.findOne({email});

    if ( !user ) {
        throw new ApiError( 400 , "User does not exist.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if ( !isPasswordValid ) {
        throw new ApiError( 401 , "Invalid user credentials")
    }

    const { accessToken , refreshToken } = await generateAccessTokenAndRefreshToken(user?._id);

    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken");

    if (!loggedInUser) {
        throw new ApiError( 404 , "User not found.")
    }

    const options = {
        httpOnly : true ,
        secure : process.env.NODE_ENV === "production"

    }

    return res
    .status(200)
    .cookie( "accessToken" , accessToken , options)
    .cookie( "refreshToken" , refreshToken , options)
    .json(
         new ApiResponse(
              200 ,
              {
                   user : loggedInUser 
              } , 
              "User logged in successfully."
         )
    )
})

export {
    registerUser ,
    loginUser
}
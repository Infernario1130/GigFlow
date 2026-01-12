import mongoose , { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import "dotenv/config";

const userSchema = new Schema ({
    name : {
        type : String ,
        required : true ,
        trim : true
    } , 
    email : {
        type : String ,
        required : true ,
        lowercase : true ,
        trim : true ,
        index : true ,
        unique : true
    } ,
    password : {
        type : String ,
        required : true 
    } , 
    refreshToken : {
        type : String 
    }
} ,
{ timestamps : true}
)

userSchema.pre("save" , async function() {
    if (!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password , 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = async function() {
    return await jwt.sign(
        {
            _id : this._id
        } , process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn : ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function() {
    return await jwt.sign(
        {
            _id : this._id
        } , process.env.REFRESH_TOKEN_SECRET , 
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        } 
    )
}

export const User = mongoose.model("User" , userSchema)
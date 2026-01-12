import mongoose , { Schema } from "mongoose";

const gigSchema = new Schema({
    title : {
        type : String ,
        required : true ,
        trim : true
    } , 
    description : {
        type : String ,
        required : true ,
        trim : true
    } ,
    budget : {
        type : Number ,
        required : true ,
        min : 0
    } ,
    ownerId : {
        type : Schema.Types.ObjectId ,
        ref : "User" ,
        required : true
    } ,
    status : {
        type : String ,
        enum : [ "open" , "assigned" ] ,
        default : "open"
    }
} ,
{ timestamps : true}
)

gigSchema.index({ ownerId : 1 , status : 1 , createdAt : -1})

export const Gig = mongoose.model("Gig" , gigSchema)
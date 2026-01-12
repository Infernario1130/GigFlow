import mongoose , { Schema } from "mongoose";

const bidSchema = new Schema({
    gigId : {
        type : Schema.Types.ObjectId ,
        ref : "Gig" , 
        required : true
    } ,
    freelancerId : {
        type : Schema.Types.ObjectId ,
        ref : "User" ,
        required : true 
    } ,
    status : {
        type : String ,
        enum : [ "pending" , "hired" , "rejected" ] ,
        default : "pending"
    } ,
    message : {
        type : String ,
        required : true
    } ,
    price : {
        type : Number ,
        required : true ,
        min : 0
    }
} , 
{
    timestamps : true
})

bidSchema.index({ gigId: 1, status: 1, createdAt: -1 });
bidSchema.index({ freelancerId: 1, status: 1 });


export const Bid = mongoose.model("Bid" , bidSchema)
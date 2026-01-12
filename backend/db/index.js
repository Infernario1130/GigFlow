import "dotenv/config";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectToDb() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`Connection to database established.`)
    } catch (error) {
        console.log(`MongoDB connection error ${error}`)
        process.exit(1)
    }
}

export default connectToDb;
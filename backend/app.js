import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthcheckRouter from "./routes/healthcheck.routes.js";

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended : true , limit : "16kb" }));
app.use(cookieParser());
app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true
}))

app.use("/api/v1/healthcheck" , healthcheckRouter)

export default app;
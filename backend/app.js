import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import gigRouter from "./routes/gig.routes.js";
import bidRouter from "./routes/bid.routes.js";

const app = express();

app.use(express.json({ limit : "16kb"}))
app.use(express.urlencoded({ extended : true , limit : "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true
}))

app.use("/api/v1/healthcheck" , healthcheckRouter);
app.use("/api/auth" , userRouter);
app.use("/api/gigs" , gigRouter);
app.use("/api/bids" , bidRouter);

export default app;
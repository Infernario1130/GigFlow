import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createGig,
        getOpenGigs
 } from "../controllers/gig.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, createGig).get(getOpenGigs)

export default router;

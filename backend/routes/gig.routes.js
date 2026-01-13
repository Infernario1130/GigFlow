import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createGig } from "../controllers/gig.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createGig)

export default router;

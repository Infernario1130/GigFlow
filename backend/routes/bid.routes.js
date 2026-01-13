import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
    createBid ,
    getAllBids
} from "../controllers/bid.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createBid);
router.route("/:gigId").get(getAllBids);

export default router;
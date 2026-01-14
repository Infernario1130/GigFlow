import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
    createBid ,
    getAllBids ,
    confirmBid
} from "../controllers/bid.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createBid);
router.route("/:gigId").get(getAllBids);
router.route("/:bidId/hire").patch(confirmBid)

export default router;
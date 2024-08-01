import express  from "express";
import { protectRoute } from "../middleware/proctectRoute.js";
import { followUnfollowUser, getUserProfile, getSuggestedUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile )
router.post("/suggested", protectRoute, getSuggestedUser )
router.post("/follow/:id", protectRoute, followUnfollowUser )
router.post("/update", protectRoute, updateUser )


export default router;
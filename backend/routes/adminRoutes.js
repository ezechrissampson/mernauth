import express from "express"
import { adminLogin, adminProfile, adminUpdateProfile, adminUpdatePin } from "../controllers/adminController.js";
import { protect } from "../middlewares/adminMiddleware.js";



const router = express.Router();

router.post("/login", adminLogin)
router.get("/profile", protect, adminProfile)
router.put("/profile", protect, adminUpdateProfile )
router.put("/profile/pin", protect, adminUpdatePin)


export default router
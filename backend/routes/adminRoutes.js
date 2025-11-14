import express from "express"
import { adminLogin, adminProfile } from "../controllers/adminController.js";
import { protect } from "../middlewares/adminMiddleware.js";



const router = express.Router();

router.post("/login", adminLogin)
router.get("/adminprofile", protect, adminProfile)

export default router
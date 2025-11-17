import express from "express";
import { signup, login, profile, verifyEmail, resendCode } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, profile);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode)



export default router;

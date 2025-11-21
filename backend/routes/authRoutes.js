import express from "express";
import { signup, 
         login, 
         profile, 
         verifyEmail, 
         resendCode,   
         forgotPassword, 
         resetPassword, 
         logout, googleAuth } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/profile", protect, profile);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);



export default router;

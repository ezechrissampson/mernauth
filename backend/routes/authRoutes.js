import express from "express";
import rateLimit from "express-rate-limit";
import { signup, 
         login, 
         profile, 
         verifyEmail, 
         resendCode,   
         forgotPassword, 
         resetPassword, 
         logout, googleAuth } from "../controllers/authController.js";
import { protect, } from "../middlewares/authMiddleware.js";


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10,
  message: { message: "Too many login attempts. Try again later." },
});

const router = express.Router();

router.post("/signup", loginLimiter, signup);
router.post("/login", loginLimiter ,login);
router.post("/google", loginLimiter, googleAuth);
router.get("/profile", protect, profile);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode)
router.post("/forgot-password", loginLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);



export default router;

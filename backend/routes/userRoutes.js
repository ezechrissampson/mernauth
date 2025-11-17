import express from "express";
import { updateUserProfile, updateUserPassword, getProfile, updateUserImage } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateUserProfile)
router.put("/profile/password", protect, updateUserPassword);
router.put(
  "/profile/image",
  protect,
  upload.single("profilePic"),
  updateUserImage
);

export default router;

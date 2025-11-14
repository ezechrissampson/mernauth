import express from "express"
import { updateUser, getAllUser, getUserById } from "../controllers/userController.js"


const router = express.Router()

router.get("/", getAllUser)
router.put("/:id", updateUser)
router.get("/:id", getUserById)

export default router
import express from "express"
import { getAllUser, deleteUser, updateUser } from "../../controllers/admin/userController.js"

const router = express.Router();

router.get("/", getAllUser)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)

export default router
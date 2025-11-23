import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminusersRoutes from "./routes/admin/userRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
     }));
     
app.use(express.json());

app.use("/api/auth", authRoutes, userRoutes);
app.use("/api/users", adminusersRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

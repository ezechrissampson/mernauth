import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-pin");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

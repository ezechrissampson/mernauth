// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateSessionToken } from "../services/sessionService.js";

export const protect = async (req, res, next) => {
  let token;

  // 1) Prefer HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2) Fallback: Authorization header (optional)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 🔍 Debug if needed
    // console.log("protect → incoming token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // we are using the TOKEN itself as session key:
    await validateSessionToken(token);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth protect error:", err.message);
    return res
      .status(401)
      .json({ message: "Session expired or invalid. Please log in again." });
  }
};

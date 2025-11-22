// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateSessionToken } from "../services/sessionService.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⛔ if you still have this check, remove it:
    // if (!decoded.sessionId) { ... }

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

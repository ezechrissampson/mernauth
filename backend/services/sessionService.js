// services/sessionService.js
import jwt from "jsonwebtoken";
import Session from "../models/session.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// ❌ delete all existing sessions for this user (single active session)
export const invalidateUserSessions = async (userId) => {
  await Session.deleteMany({ user: userId });
};

// ✅ create a new session record
export const createSession = async ({ userId, token, userAgent }) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await Session.create({
    user: userId,
    token,
    userAgent,
    expiresAt,
  });

  return session;
};

// ✅ validate token + session (used in protect middleware)
export const validateSessionToken = async (token) => {
  // 1) Verify JWT signature
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Not authorized, token invalid");
  }

  // 2) Check if session exists and not expired
  const session = await Session.findOne({ token });
  if (!session) {
    throw new Error("Session expired or invalid. Please log in again.");
  }

  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw new Error("Session has expired. Please log in again.");
  }

  // 3) Load user
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  return { user, session };
};

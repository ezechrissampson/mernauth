import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const invalidateUserSessions = async (userId) => {
  await Session.deleteMany({ user: userId });
};

export const createSession = async ({ userId, token, userAgent }) => {
  if (!userId || !token) {
    throw new Error("UserId and token are required to create a session");
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    user: userId,
    token,
    userAgent,
    expiresAt,
  });

  return session;
};

export const validateSessionToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Not authorized, token invalid");
  }

  const session = await Session.findOne({ token });
  if (!session) {
    throw new Error("Session expired or invalid. Please log in again.");
  }

  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw new Error("Session has expired. Please log in again.");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  return { user, session };
};

export const destroySessionByToken = async (token) => {
  if (!token) return;
  await Session.deleteOne({ token });
};

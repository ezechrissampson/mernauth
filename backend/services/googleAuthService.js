// services/googleAuthService.js
import axios from "axios";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js"; 
import {
  invalidateUserSessions,
  createSession,
} from "./sessionService.js";

const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const generateUsernameFromGoogle = async (name, email) => {
  let base =
    (name && name.split(" ")[0]) ||
    (email && email.split("@")[0]) ||
    "user";

  base = base.toLowerCase().replace(/[^a-z0-9]/g, "");

  let username = base;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
};

export const googleAuthService = async (accessToken, userAgent = "") => {
  if (!accessToken) {
    throw new Error("Missing Google access token");
  }

  // 1) get user info from Google
  const googleRes = await axios.get(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = googleRes.data;
  const googleEmail = payload.email;
  const googleName = payload.name;
  const googleSub = payload.sub; // unique Google ID

  if (!googleEmail) {
    throw new Error("Google account has no email");
  }

  // 2) find or create user
  let user = await User.findOne({ email: googleEmail });

  if (!user) {
    const username = await generateUsernameFromGoogle(
      googleName,
      googleEmail
    );

    user = await User.create({
      name: googleName || username,
      username,
      email: googleEmail,
      password: "", // they log in with Google
      isVerified: true,
      // googleId: googleSub, // if you later add this field
    });
  } else if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  // 3) create JWT + session (single session)
  const token = generateToken(user._id); // this should sign { id: user._id }

  await invalidateUserSessions(user._id);

  await createSession({
    userId: user._id,
    token,
    userAgent,
  });

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    token,
    provider: "google",
  };
};

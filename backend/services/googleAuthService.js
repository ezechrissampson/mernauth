// services/googleAuthService.js
import axios from "axios";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// helper to generate unique username for Google users
const generateUsernameFromGoogle = async (name, email) => {
  let base =
    (name && name.split(" ")[0]) ||
    (email && email.split("@")[0]) ||
    "user";

  base = base.toLowerCase().replace(/[^a-z0-9]/g, "");

  let username = base;
  let counter = 1;

  // ensure it’s unique
  while (await User.findOne({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
};

export const googleAuthService = async (accessToken) => {
  if (!accessToken) {
    throw new Error("Missing Google access token");
  }

  // 1) get user info from Google
  const { data: profile } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const googleEmail = profile.email;
  const googleName = profile.name;
  const googleSub = profile.sub; // unique Google id

  if (!googleEmail) {
    throw new Error("Google account has no email");
  }

  // 2) check if user exists
  let user = await User.findOne({ email: googleEmail });

  if (!user) {
    // 3) create new user
    const username = await generateUsernameFromGoogle(googleName, googleEmail);

    user = await User.create({
      name: googleName || username,
      username,
      email: googleEmail,
      password: "", // no local password (Google auth only)
      isVerified: true, // trust Google email
      // googleId: googleSub, // optional if you add it to schema
    });
  } else {
    // mark as verified if not already
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
  }

  // 4) return token + user data
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    token: generateToken(user._id),
    provider: "google",
  };
};

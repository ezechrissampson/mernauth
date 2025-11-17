// services/authService.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/sendEailer.js";
import { generateToken } from "../utils/generateToken.js";

const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// SIGNUP / REGISTER
export const registerUser = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new Error("Username already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const code = generateVerificationCode();
  const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationCode: code,
    verificationCodeExpires: codeExpiry,
  });

  // send verification mail
  await sendVerificationEmail(newUser.email, code);

  // you can return token or not at signup – here I’ll include it like you asked
  return {
    _id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
    isVerified: newUser.isVerified,
    token: generateToken(newUser._id),
    message:
      "Signup successful. Please check your email for the verification code.",
  };
};

// RESEND CODE
export const resendVerificationCode = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("Email already verified");

  const code = generateVerificationCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  user.verificationCode = code;
  user.verificationCodeExpires = expires;
  await user.save();

  await sendVerificationEmail(user.email, code);

  return { message: "Verification code resent to your email" };
};

// LOGIN
export const loginUser = async ({ emailOrUsername, password }) => {
  // you said your login uses either email or username
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isVerified) {
    const err = new Error("Please verify your email to login");
    err.code = "NOT_VERIFIED";
    throw err;
  }

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  };
};

// PROFILE
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

// VERIFY EMAIL
export const verifyUserEmail = async ({ email, code }) => {
  if (!email || !code) throw new Error("Email and code are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email");

  if (user.isVerified) throw new Error("Email already verified");

  if (!user.verificationCode || !user.verificationCodeExpires) {
    throw new Error("No verification code found");
  }

  if (user.verificationCode !== code) {
    throw new Error("Invalid verification code");
  }

  if (user.verificationCodeExpires < new Date()) {
    throw new Error("Verification code has expired");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;

  await user.save();

  // you can return token here too if you want auto-login after verify
  return {
    message: "Email verified successfully. You can now log in.",
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEailer.js";
import { generateToken } from "../utils/generateToken.js";
import {
  createSession,
  invalidateUserSessions,
} from "../services/sessionService.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 3); // first 3 chars
  return `${visible}***@${domain}`;
};

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
  await sendEmail(newUser.email,   
  "Verify your email",
  `Your verification code is: ${code}`,
  `<p>Your verification code is:</p><h2>${code}</h2>`);

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

  await sendEmail(user.email,   
  "Verify your email",
  `Your verification code is: ${code}`,
  `<p>Your verification code is:</p><h2>${code}</h2>`);

  return { message: "Verification code resent to your email" };
};


export const loginUser = async (emailOrUsername, password, userAgent) => {
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // if not verified → send code
  if (!user.isVerified) {
    const code = generateVerificationCode(); // or your inline function

    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendEmail(
      user.email,
      "Verify your email",
      `Your verification code is: ${code}`,
      `<p>Your verification code is:</p><h2>${code}</h2>`
    );

    return {
      needsVerification: true,
      email: user.email, // REAL email
      maskedEmail: maskEmail(user.email),
      message: "Email not verified. Verification code sent.",
    };
  }

  // ✅ VERIFIED → single active session logic

  // 1) Kill previous sessions for this user
  await invalidateUserSessions(user._id);

  // 2) Create a fresh JWT
  const token = generateToken(user._id);

  // 3) Store session in DB
  await createSession({
    userId: user._id,
    token,
    userAgent: userAgent || "unknown",
  });

  // 4) Return to frontend
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    token,
    needsVerification: false,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};


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

  return {
    message: "Email verified successfully. You can now log in.",
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};


export const forgotPasswordService = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) {
    // For security, we pretend it worked
    return;
  }

  // 1) generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2) hash token to store in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3) set fields on user
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // 4) create reset URL for frontend
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // 5) send email
  const html = `
    <p>You requested to reset your password.</p>
    <p>Click the link below to set a new password (valid for 1 hour):</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>If you did not request this, just ignore this email.</p>
  `;

  await sendEmail(user.email, "Password Reset Request", html);
};

export const resetPasswordService = async (token, password, confirmPassword) => {
  if (!password || !confirmPassword) {
    throw new Error("All fields are required");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // hash token from URL (same as we stored)
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find user with valid, non-expired token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  // hash new password and save
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

// helper to generate a fallback username from Google name/email
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

export const googleAuthService = async (idToken) => {
  if (!idToken) {
    throw new Error("Missing Google ID token");
  }

  // 1) verify token with Google
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleEmail = payload.email;
  const googleName = payload.name;
  const googleSub = payload.sub; // Google unique user ID

  if (!googleEmail) {
    throw new Error("Google account has no email");
  }

  // 2) check if user already exists
  let user = await User.findOne({ email: googleEmail });

  if (!user) {
    // 3) create new user from Google data
    const username = await generateUsernameFromGoogle(googleName, googleEmail);

    // you can store googleSub in a `googleId` field if you add it to your model
    user = await User.create({
      name: googleName || username,
      username,
      email: googleEmail,
      password: "", // password empty because they use Google login
      isVerified: true, // Google email is trusted
      // googleId: googleSub, // if you add this to schema
    });
  } else {
    // if existing, ensure they are marked verified
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
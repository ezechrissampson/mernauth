import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// Signup user
export const registerUser = async (data) => {
  const { name, username, email, password } = data;

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) throw new Error("Email or username already taken");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  return {
    _id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
    token: generateToken(newUser._id),
  };
};

// Login user
export const loginUser = async (emailOrUsername, password) => {
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  };
};

// Get user profile
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};



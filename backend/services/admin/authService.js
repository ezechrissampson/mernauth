import Admin from "../../models/Admin.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/admin/generateToken.js";

export const loginAdmin = async (emailOrUsername, pin) => {
  const admin = await Admin.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!admin) throw new Error("Admin not found");

  const isMatch = await bcrypt.compare(pin, admin.pin);
  if (!isMatch) throw new Error("Invalid credentials");

  return {
    _id: admin._id,
    username: admin.username,
    email: admin.email,
    token: generateToken(admin._id),
  };
}


export const getAdminProfile = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-pin");
  if (!admin) throw new Error("User not found");
  return admin;
};


export const updateAdminProfile = async (adminId, data) => {
  const { username, email } = data;

  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("Admin not found");

  if (username) admin.username = username;
  if (email) admin.email = email;

  await admin.save();

  return {
    _id: admin._id,
    username: admin.username,
    email: admin.email,
  };
};

export const updateAdminPin = async (adminId, oldPin, newPin) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("Admin not found");

  const isMatch = await bcrypt.compare(oldPin, admin.pin);
  if (!isMatch) throw new Error("Old PIN is incorrect");

  const hashedNewPin = await bcrypt.hash(newPin, 10);
  admin.pin = hashedNewPin;
  await admin.save();

  return { message: "PIN updated successfully" };
};
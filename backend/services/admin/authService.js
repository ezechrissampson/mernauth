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

import jwt from "jsonwebtoken";

export const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "7d",
  });
};

import { loginAdmin, getAdminProfile } from "../services/admin/authService.js";

export const adminLogin = async (req, res) => {
  try {
    const { emailOrUsername, pin } = req.body;
    const admin = await loginAdmin(emailOrUsername, pin);
    res.json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const adminProfile = async (req, res) => {
  try {
    const admin = await getAdminProfile(req.admin.id);
    res.json(admin);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

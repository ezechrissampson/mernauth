import { loginAdmin, getAdminProfile, updateAdminProfile, updateAdminPin } from "../services/admin/authService.js";

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

export const adminUpdateProfile = async (req, res) => {
  try {
    const updated = await updateAdminProfile(req.admin.id, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminUpdatePin = async (req, res) => {
  try {
    const { oldPin, newPin, confirmPin } = req.body;

    if (!oldPin || !newPin || !confirmPin) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPin !== confirmPin) {
      return res
        .status(400)
        .json({ message: "New PIN and Confirm PIN do not match" });
    }

    const result = await updateAdminPin(req.admin.id, oldPin, newPin);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
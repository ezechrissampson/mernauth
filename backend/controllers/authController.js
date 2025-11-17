import { registerUser, loginUser, getUserProfile } from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await loginUser(emailOrUsername, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



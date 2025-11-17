import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyUserEmail,
  resendVerificationCode,
} from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const data = await registerUser(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: err.message || "Server error during signup" });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await resendVerificationCode(email);
    res.json(data);
  } catch (err) {
    console.error("Resend code error:", err);
    res.status(400).json({ message: err.message || "Server error resending code" });
  }
};

export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.json(data);
  } catch (err) {
    console.error("Login error:", err);

    if (err.code === "NOT_VERIFIED") {
      return res.status(401).json({ message: err.message });
    }

    res.status(400).json({ message: err.message || "Server error during login" });
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

export const verifyEmail = async (req, res) => {
  try {
    const data = await verifyUserEmail(req.body);
    res.json(data);
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(400).json({ message: err.message || "Server error verifying email" });
  }
};

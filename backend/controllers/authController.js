import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyUserEmail,
  resendVerificationCode,
  forgotPasswordService,
  resetPasswordService
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await forgotPasswordService(email);

    // Always generic for security
    res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res
      .status(500)
      .json({ message: err.message || "Server error sending reset link" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    await resetPasswordService(token, password, confirmPassword);

    res.json({
      message: "Password has been reset successfully. You can log in now.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res
      .status(400)
      .json({ message: err.message || "Server error resetting password" });
  }
};
import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyUserEmail,
  resendVerificationCode,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";
import { googleAuthService } from "../services/googleAuthService.js";
import {createSession ,invalidateUserSessions ,destroySessionByToken } from "../services/sessionService.js";



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
    const { emailOrUsername, password } = req.body;

    const data = await loginUser(emailOrUsername, password);

    // If needs verification -> NO session, just return
    if (data.needsVerification) {
      return res.status(200).json(data);
    }

    // ✅ Verified → create session
    const userId = data._id;
    const token = data.token;
    const userAgent = req.headers["user-agent"] || "unknown";

    // single-active-session: clear old ones
    await invalidateUserSessions(userId);

    // create new session in DB with this token
    await createSession({ userId, token, userAgent });

    // respond to frontend
    return res.json({
      _id: data._id,
      name: data.name,
      username: data.username,
      email: data.email,
      isVerified: data.isVerified,
      token: data.token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(400)
      .json({ message: err.message || "Server error during login" });
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
    const data = await verifyUserEmail(req.body); // { email, code }
    res.json(data);
  } catch (err) {
    console.error("Verify email error:", err);
    res
      .status(400)
      .json({ message: err.message || "Server error verifying email" });
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

export const logout = async (req, res) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // remove this session only
    await destroySessionByToken(token);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
};


export const googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const data = await googleAuthService(accessToken);

    const userId = data._id;
    const token = data.token;
    const userAgent = req.headers["user-agent"] || "unknown";

    await invalidateUserSessions(userId);
    await createSession({ userId, token, userAgent });

    return res.json(data);
  } catch (err) {
    console.error("Google auth error:", err);
    return res
      .status(400)
      .json({ message: err.message || "Google authentication failed" });
  }
};
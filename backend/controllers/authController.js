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

 
    if (data.needsVerification) {
      return res.status(200).json(data);
    }

    const userId = data._id;
    const token = data.token;
    const userAgent = req.headers["user-agent"] || "unknown";

 
    await invalidateUserSessions(userId);

 
    await createSession({ userId, token, userAgent });

  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

 
    return res.json({
      _id: data._id,
      name: data.name,
      username: data.username,
      email: data.email,
      isVerified: data.isVerified,
      provider: data.provider || "local",

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
    const data = await verifyUserEmail(req.body);
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

  
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

  
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (token) {
      await destroySessionByToken(token);
    }

  
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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

    n
    await createSession({ userId, token, userAgent });

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

   
    return res.json({
      _id: data._id,
      name: data.name,
      username: data.username,
      email: data.email,
      isVerified: data.isVerified,
      provider: "google",

    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res
      .status(400)
      .json({ message: err.message || "Google authentication failed" });
  }
};
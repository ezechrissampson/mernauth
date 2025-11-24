import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEailer.js";
import { generateToken } from "../utils/generateToken.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 3);
  return `${visible}***@${domain}`;
};

export const registerUser = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new Error("Username already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const code = generateVerificationCode();
  const codeExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationCode: code,
    verificationCodeExpires: codeExpiry,
  });
  
const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px 24px 16px 24px;text-align:center;">
                <h1 style="margin:0;font-size:24px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                  Verify Your Email
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;line-height:1.6;">
                <p style="margin:0 0 12px 0;">
                  Thanks for signing up for <strong>Mernauth</strong>.
                </p>
                <p style="margin:0 0 16px 0;">
                  Use the code below to verify your email address.
                </p>
                <p style="font-size:24px;font-weight:bold;color:#111827;margin:0 0 16px 0;letter-spacing:4px;">
                  ${code}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;border-top:1px solid #e5e7eb;">
                <p style="margin:12px 0 0 0;">
                  If you didn’t create an account with Mernauth, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


await sendEmail(newUser.email, "Verify your email", html);

  return {
    _id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
    isVerified: newUser.isVerified,
    token: generateToken(newUser._id),
    message:
      "Signup successful. Please check your email for the verification code.",
  };
};


export const resendVerificationCode = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("Email already verified");

  const code = generateVerificationCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  user.verificationCode = code;
  user.verificationCodeExpires = expires;
  await user.save();

  await sendEmail(user.email,   
  "Verify your email",
  `Your verification code is: ${code}`,
  `<p>Your verification code is:</p><h2>${code}</h2>`);

  return { message: "Verification code resent to your email" };
};

export const loginUser = async (emailOrUsername, password) => {
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isVerified) {
    const code = generateVerificationCode();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();


const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px 24px 16px 24px;text-align:center;">
                <h1 style="margin:0;font-size:24px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                  Verify Your Email
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;line-height:1.6;">
                <p style="margin:0 0 12px 0;">
                  Thanks for signing up for <strong>Mernauth</strong>.
                </p>
                <p style="margin:0 0 16px 0;">
                  Use the code below to verify your email address.
                </p>
                <p style="font-size:24px;font-weight:bold;color:#111827;margin:0 0 16px 0;letter-spacing:4px;">
                  ${code}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;border-top:1px solid #e5e7eb;">
                <p style="margin:12px 0 0 0;">
                  If you didn’t create an account with Mernauth, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


    await sendEmail(user.email, "Verify your email", html);

    return {
      needsVerification: true,
      email: user.email,
      maskedEmail: maskEmail(user.email),
      message: "Email not verified. Verification code sent.",
    };
  }

  const token = generateToken(user._id); // standard JWT with { id: user._id }

  return {
    needsVerification: false,
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    token,
  };
};


export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};


export const verifyUserEmail = async ({ email, code }) => {
  if (!email || !code) throw new Error("Email and code are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email");

  if (user.isVerified) throw new Error("Email already verified");

  if (!user.verificationCode || !user.verificationCodeExpires) {
    throw new Error("No verification code found");
  }

  if (user.verificationCode !== code) {
    throw new Error("Invalid verification code");
  }

  if (user.verificationCodeExpires < new Date()) {
    throw new Error("Verification code has expired");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;

  await user.save();

  return {
    message: "Email verified successfully. You can now log in.",
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
  };
};


export const forgotPasswordService = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");


  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
  await user.save();


  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;


const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px 24px 16px 24px;text-align:center;">
                <h1 style="margin:0;font-size:24px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                  Password Reset Request
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;line-height:1.6;">
                <p style="margin:0 0 12px 0;">
                  You requested to reset your password for your <strong>Mernauth</strong> account.
                </p>
                <p style="margin:0 0 16px 0;">
                  Click the button below to set a new password. This link is valid for
                  <strong>1 hour</strong>.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 24px 24px 24px;">
                <!-- Button -->
                <a href="${resetUrl}"
                   target="_blank"
                   style="
                     display:inline-block;
                     background-color:#2563eb;
                     color:#ffffff;
                     text-decoration:none;
                     padding:12px 24px;
                     border-radius:6px;
                     font-family:Arial,Helvetica,sans-serif;
                     font-size:14px;
                     font-weight:bold;
                   ">
                  Reset Password
                </a>
              </td>
            </tr>

            <!-- Fallback raw link -->
            <tr>
              <td style="padding:0 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;">
                <p style="margin:0 0 8px 0;">
                  If the button above doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="word-break:break-all;margin:0;">
                  <a href="${resetUrl}" target="_blank" style="color:#2563eb;">
                    ${resetUrl}
                  </a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;border-top:1px solid #e5e7eb;">
                <p style="margin:12px 0 0 0;">
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


  await sendEmail(user.email, "Password Reset Request", html);
};

export const resetPasswordService = async (token, password, confirmPassword) => {
  if (!password || !confirmPassword) {
    throw new Error("All fields are required");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // hash token from URL (same as we stored)
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find user with valid, non-expired token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  // hash new password and save
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};


const generateUsernameFromGoogle = async (name, email) => {
  let base =
    (name && name.split(" ")[0]) ||
    (email && email.split("@")[0]) ||
    "user";

  base = base.toLowerCase().replace(/[^a-z0-9]/g, "");

  let username = base;
  let counter = 1;

  // ensure it’s unique
  while (await User.findOne({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
};

export const googleAuthService = async (idToken) => {
  if (!idToken) {
    throw new Error("Missing Google ID token");
  }


  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleEmail = payload.email;
  const googleName = payload.name;
  const googleSub = payload.sub;

  if (!googleEmail) {
    throw new Error("Google account has no email");
  }


  let user = await User.findOne({ email: googleEmail });

  if (!user) {
   
    const username = await generateUsernameFromGoogle(googleName, googleEmail);

    
    user = await User.create({
      name: googleName || username,
      username,
      email: googleEmail,
      password: "",
      isVerified: true,
    });
  } else {

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
  }

  
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    token: generateToken(user._id),
    provider: "google",
  };
};
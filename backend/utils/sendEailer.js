import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_APP_PASSWORD, 
  },
});

export const sendVerificationEmail = async (toEmail, code) => {
  const mailOptions = {
    from: `"Mernauth" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your email",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is:</p><h2>${code}</h2>`,
  };

  await transporter.sendMail(mailOptions);
};

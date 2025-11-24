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

export const sendEmail = async (toEmail, subject, html) => {
  const mailOptions = {
    from: `"Mernauth" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};


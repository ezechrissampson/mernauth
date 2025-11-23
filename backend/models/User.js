import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, },
    profilePic: {type: String, default: ""},

    isVerified: { type: Boolean, default: false },

    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema)
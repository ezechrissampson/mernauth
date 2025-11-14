import mongoose from "mongoose";

const adminScheme = new mongoose.Schema(
    {
      username: {type: String, required: true},
      email: {type: String, required: true},
      pin: {type: String, required: true}
    },
    {timestamps: true}
);

export default mongoose.model("Admin", adminScheme)

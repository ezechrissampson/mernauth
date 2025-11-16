import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const exists = await Admin.findOne();

    if (!exists) {
      const hashedPin = await bcrypt.hash("1234", 10);

      await Admin.create({
        username: "Ezechris",
        email: "ezechrissampson@gmail.com",
        pin: hashedPin,
      });

      console.log("✅ Default admin created.");
    } else {
      console.log(" ");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
};

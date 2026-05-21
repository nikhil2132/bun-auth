import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MogoDB connected ✅");
  } catch (err) {
    console.error("DB error:", err.message);
    process.exit();
  }
};

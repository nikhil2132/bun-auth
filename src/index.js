import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
app.use(express.json());

//DB Connect
connectDB();

//routes
app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running 🚀");
});

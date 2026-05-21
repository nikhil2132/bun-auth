import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";

export const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized - No token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("tokenVersion");
    if (!user) throw new ApiError(401, "User not found");

    // Support token invalidation via tokenVersion (used by logout & password changes)
    const tokenVersion = decoded.tokenVersion ?? 0;
    if (tokenVersion !== user.tokenVersion) {
      throw new ApiError(401, "Token has been invalidated, please login again");
    }

    req.user = decoded;

    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

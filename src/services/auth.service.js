import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exits");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return { user };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid password");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token, user };
};

export const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { deletedUserId: userId };
};

export const updateUserService = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //update email
  if (data.email) {
    user.email = data.email;
  }

  //update password
  if (data.password) {
    user.password = await bcrypt.hash(data.password, 10);
  }

  await user.save();

  return {
    user: {
      _id: user._id,
      email: user.email,
    },
  };
};

// ── Profile ──────────────────────────────────────────────────────────────────

export const getMeService = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -resetPasswordToken -resetPasswordExpires -tokenVersion",
  );
  if (!user) throw new ApiError(404, "User not found");
  return { user };
};

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -resetPasswordToken -resetPasswordExpires -tokenVersion",
  );
  if (!user) throw new ApiError(404, "User not found");
  return { user };
};

// ── Session Management ────────────────────────────────────────────────────────

export const logoutService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.tokenVersion += 1;
  await user.save();

  return { message: "Logged out successfully" };
};

export const refreshTokenService = async (userId) => {
  const user = await User.findById(userId).select("tokenVersion email");
  if (!user) throw new ApiError(404, "User not found");

  const token = jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token };
};

// ── Password Management ───────────────────────────────────────────────────────

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  // In production send this token via email instead of returning it
  return { resetToken };
};

export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new ApiError(400, "Invalid or expired reset token");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.tokenVersion += 1; // invalidate all existing sessions
  await user.save();

  return { message: "Password reset successfully" };
};

export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  user.tokenVersion += 1; // invalidate other sessions after password change
  await user.save();

  return { message: "Password changed successfully" };
};

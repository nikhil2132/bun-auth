import {
  registerUser,
  loginUser,
  updateUserService,
  deleteUserService,
  getMeService,
  getUserByIdService,
  logoutService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
} from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.json(new ApiResponse(201, result, "User registered successfully"));
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.json(new ApiResponse(200, result, "User login successfully"));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);

    res.json(new ApiResponse(200, result, "User deleted successfully"));
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const result = await updateUserService(req.params.id, req.body);
    res.json(new ApiResponse(200, result, "User updated successfully"));
  } catch (err) {
    next(err);
  }
};

// ── Profile ───────────────────────────────────────────────────────────────────

export const getMe = async (req, res, next) => {
  try {
    const result = await getMeService(req.user.userId);
    res.json(new ApiResponse(200, result, "User profile fetched successfully"));
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const result = await getUserByIdService(req.params.id);
    res.json(new ApiResponse(200, result, "User fetched successfully"));
  } catch (err) {
    next(err);
  }
};

// ── Session Management ────────────────────────────────────────────────────────

export const logout = async (req, res, next) => {
  try {
    const result = await logoutService(req.user.userId);
    res.json(new ApiResponse(200, result, "Logged out successfully"));
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const result = await refreshTokenService(req.user.userId);
    res.json(new ApiResponse(200, result, "Token refreshed successfully"));
  } catch (err) {
    next(err);
  }
};

// ── Password Management ───────────────────────────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    res.json(new ApiResponse(200, result, "Password reset token generated"));
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await resetPasswordService(
      req.body.token,
      req.body.newPassword,
    );
    res.json(new ApiResponse(200, result, "Password reset successfully"));
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const result = await changePasswordService(
      req.user.userId,
      req.body.currentPassword,
      req.body.newPassword,
    );
    res.json(new ApiResponse(200, result, "Password changed successfully"));
  } catch (err) {
    next(err);
  }
};

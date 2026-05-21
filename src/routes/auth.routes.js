import Router from "express";
import {
  register,
  login,
  updateUser,
  deleteUser,
  getMe,
  getUserById,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controller/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get("/me", authMiddleware, getMe);
router.get("/:id", authMiddleware, getUserById);

// ── Session Management ────────────────────────────────────────────────────────
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", authMiddleware, refreshToken);

// ── Password Management ───────────────────────────────────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);

// ── User CRUD ─────────────────────────────────────────────────────────────────
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;

import express from "express";
import { getUserProfile, getAllUsers } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Get logged-in user profile (Protected Route)
router.get("/profile", protect, getUserProfile);

// 🔹 Get all users (Admin Only)
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

export default router;

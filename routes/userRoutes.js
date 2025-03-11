import express from "express";
import { getUserProfile, getAllUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Get logged-in user profile (Protected Route)
router.get("/profile", protect, getUserProfile);

// 🔹 Get all users (Admin Only)
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

// Update User Route
router.put("/:id", protect, authorizeRoles("admin"), updateUser);

// Delete User Route
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);


export default router;

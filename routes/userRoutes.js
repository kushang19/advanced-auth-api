import express from "express";
import { getUserProfile, getAllUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Get logged-in user profile (Protected Route)
router.get("/profile", protect, getUserProfile);

// 🔹 Super Admin: Get all users
router.get("/", protect, authorizeRoles("superadmin"), getAllUsers);

// 🔹 Admin: Can update only their assigned users
router.put("/:id", protect, authorizeRoles("superadmin", "admin"), updateUser);

// 🔹 Super Admin: Can delete any user
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteUser);


export default router;

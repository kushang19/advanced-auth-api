import express from "express";
import passport from "passport";
import { registerUser, loginUser, refreshToken } from "../controllers/authController.js";

const router = express.Router();

// 🔹 Local Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

// 🔹 Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  res.json({ message: "Google Login Successful", user: req.user });
});

// 🔹 GitHub OAuth Routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false }), (req, res) => {
  res.json({ message: "GitHub Login Successful", user: req.user });
});

export default router;

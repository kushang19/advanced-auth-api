import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect Routes (JWT Authentication)
export const protect = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      console.error("❌ No token provided");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1].trim(); // ✅ Trim to remove extra spaces
    }

    console.log("🔹 Token Received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded); // ✅ Log decoded token

    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      console.error("❌ User not found for this token");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token", error: error.message });
  }
};



export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🔹 User Role from Token:", req.user.role); // ✅ Debug log
    console.log("🔹 Allowed Roles for this route:", allowedRoles); // ✅ Debug log

    if (!req.user || !req.user.role) {
      console.error("❌ Access Denied: No user role found in req.user");
      return res.status(403).json({ message: "Access Denied: No user role" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.error("❌ Access Denied for role:", req.user.role);
      return res.status(403).json({ message: `Access Denied for role: ${req.user.role}` });
    }

    console.log("✅ User role authorized, proceeding...");
    next();
  };
};



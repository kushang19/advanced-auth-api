import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// ✅ Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role, createdBy } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if it's the first registered user, set as "admin"
    const isFirstUser = (await User.countDocuments()) === 0;
    const assignedRole = isFirstUser ? "superadmin" : role || "user";

    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: assignedRole,
      createdBy, // ✅ Track creator (only Admins can create Users)
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password

    await user.save();
    res.status(201).json({ message: `User registered as ${assignedRole}`, userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Refresh Token
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateAccessToken({
      _id: decoded.userId,
      role: decoded.role,
    });

    res.json({ accessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid refresh token" });
  }
};

// ✅ Logout User
export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

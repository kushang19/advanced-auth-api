import User from "../models/User.js";
import bcrypt from "bcryptjs"; // ✅ Ensure bcrypt is imported

// ✅ Get User Profile (Logged-in User)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password from response
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Users (Super Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    let users;
    if(req.user.role === "superadmin"){
      users = await User.find().select("-password"); // ✅ Super Admin gets all users
    }
    if(req.user.role === "admin"){
      users = await User.find({createdBy: req.user._id}).select("-password"); // ✅ Admins only see their users
    }
    else{
      return res.status(403).json({ message: "Access Denied" });
    }
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // ✅ Log request data
    console.log("User ID:", req.params.id); // ✅ Log user ID

    // ✅ Extract password separately and keep other fields in `updateData`
    const { password, ...updateData } = req.body;

    // ✅ Find the user first
    let user = await User.findById(req.params.id);
    if (!user) {
      console.error("❌ User Not Found"); // ✅ Log error
      return res.status(404).json({ message: "User Not Found" });
    }

    // ✅ If a new password is provided, hash it
    if (password) {
      console.log("Hashing new password..."); // ✅ Debugging log
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // ✅ Update user with new data (including hashed password if applicable)
    user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true, // Ensures validation is applied
    });

    if (!user) {
      console.error("❌ User Update Failed"); // ✅ Log error
      return res.status(500).json({ message: "User update failed" });
    }

    // ✅ Remove password before sending response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    console.log("✅ User updated successfully:", user); // ✅ Log success
    res.status(200).json({ message: "User updated successfully", userWithoutPassword  });
  } catch (error) {
    console.error("❌ Error in updateUser:", error.message); // ✅ Log full error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

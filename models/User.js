import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true,  sparse: true },
    password: { type: String },
    googleId: { type: String },
    githubId: { type: String },
    role: { 
      type: String, 
      enum: ["superadmin", "admin", "user"], 
      default: "user" 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }, // ✅ Track who created the user
  },
  
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

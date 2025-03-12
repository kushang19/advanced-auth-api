import jwt from "jsonwebtoken";

export const protect = async(req, res, next) => {
  try {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  if(token.startsWith("Bearer ")){
    token = token.split(" ")[1];
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) return res.status(401).json({ message: "Unauthorized: User not found" });

  next();
  } 
  catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access Denied" });
    }
    next();
  };
};

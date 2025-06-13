import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  console.log("The token from middlewareis :", token);

  if (!token) return res.status(401).json({ message: "Not authenticated" });
  console.log(process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "this is the decoded point");

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../config/emailService.js";

dotenv.config();
const saltRound = process.env.SALT;

export const signup = async (req, res) => {
  try {
    const { email, name, password, gender, courseofstudy } = req.body;
    console.log(req.body);

    //check if email already exists
    const existingUser = await User.findOne({ where: { email: email.trim() } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exist" });
    console.log("The esiting user details", existingUser);

    //Hash password
    const hashedPassword = await bcrypt.hash(password, saltRound);
    console.log("The hashed password is", hashedPassword);

    //Generate Verification Code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log(verificationCode);

    //Create new user
    const newUser = await User.create({
      email: email.trim(),
      password: hashedPassword,
      name: name.trim(),
      gender: gender.trim(),
      verificationCode,
      courseofstudy,
    });
    console.log(newUser);

    // Send Verification email
    const userId = newUser.id;
    console.log(userId);

    await sendVerificationEmail(email, verificationCode, userId);

    res.status(201).json({ message: "Verification Code Sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: " Error signing up", error: error.message });
  }
};

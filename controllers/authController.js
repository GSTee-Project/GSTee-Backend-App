// controllers/auth.controller.js
import jwt from "jsonwebtoken";
import { User, sequelize } from "../config/database.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../config/emailService.js";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT) || 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const VERIF_CODE_TTL_MIN = Number(process.env.VERIF_CODE_TTL_MIN) || 5;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

// ---------- Helpers ----------
const normalizeEmail = (email) => email.trim().toLowerCase();

const safeUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  gender: u.gender,
  courseofstudy: u.courseofstudy,
  isVerified: u.isVerified,
  createdAt: u.createdAt,
});

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const hashCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const signAccessToken = (user) =>
  jwt.sign({ sub: String(user.id) }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
};

// ---------- Controllers ----------

// REGISTER
export const signup = async (req, res) => {
  const { email, name, password, gender, courseofstudy } = req.body ?? {};

  if (
    !email ||
    !name ||
    !password ||
    !gender ||
    !courseofstudy ||
    !isEmail(email) ||
    password.length < 8
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid input. Ensure email is valid and password is at least 8 characters.",
    });
  }

  const normEmail = normalizeEmail(email);

  // Generate 6-digit verification code
  const rawCode = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashCode(rawCode);
  const expiresAt = new Date(Date.now() + VERIF_CODE_TTL_MIN * 60 * 1000);

  const t = await sequelize.transaction();
  try {
    const exists = await User.findOne({
      where: { email: normEmail },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (exists) {
      await t.rollback();
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create(
      {
        email: normEmail,
        password: passwordHash,
        name: name.trim(),
        gender: gender.trim(),
        courseofstudy,
        isVerified: false,
        verificationCodeHash: codeHash,
        verificationCodeExpiresAt: expiresAt,
        verificationAttempts: 0,
      },
      { transaction: t }
    );

    await t.commit();

    // Send verification email
    await sendVerificationEmail(normEmail, rawCode, newUser.id);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Check your inbox to verify your email.",
      data: { user: safeUser(newUser) },
    });
  } catch (err) {
    if (!t.finished) await t.rollback();
    return res.status(500).json({
      success: false,
      message: "Error signing up",
      errorCode: "SIGNUP_FAILED",
    });
  }
};

// VERIFY EMAIL (using email instead of userId)
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    // Check expiry
    if (user.verificationCodeExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    // Check attempts
    if (user.verificationAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please request a new code.",
      });
    }

    // Hash input and compare
    const inputHash = hashCode(verificationCode.trim());
    if (inputHash !== user.verificationCodeHash) {
      await user.update({
        verificationAttempts: user.verificationAttempts + 1,
      });
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Mark verified
    await user.update({
      isVerified: true,
      verificationCodeHash: null,
      verificationCodeExpiresAt: null,
      verificationAttempts: 0,
    });

    res.json({
      success: true,
      message: "Email verified successfully",
      data: { user: safeUser(user) },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// RESEND CODE
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      where: { email: normalizeEmail(email) },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    // throttle resend requests (2 min)
    if (
      user.verificationCodeExpiresAt &&
      user.verificationCodeExpiresAt > new Date(Date.now() - 2 * 60 * 1000)
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code",
      });
    }

    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    const newCodeHash = hashCode(newCode);

    await user.update({
      verificationCodeHash: newCodeHash,
      verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      verificationAttempts: 0,
    });

    await sendVerificationEmail(user.email, newCode, user.id);

    res.json({
      success: true,
      message: "Verification code resent successfully",
      data: { user: safeUser(user) },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const normEmail = normalizeEmail(email);

  try {
    const user = await User.findOne({ where: { email: normEmail } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message:
          "Account temporarily locked due to too many failed login attempts. Try again later.",
      });
    }

    // Verify password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const attempts = user.failedLoginAttempts + 1;
      const updates = { failedLoginAttempts: attempts };

      // Lock account after 5 bad attempts
      if (attempts >= 5) {
        updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 min
        updates.failedLoginAttempts = 0; // reset counter after lock
      }

      await user.update(updates);

      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Prevent login if not verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email to continue.",
      });
    }

    // Reset counters on success
    await user.update({ failedLoginAttempts: 0, lockedUntil: null });

    // Issue JWT
    const token = signAccessToken(user);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Login successful",
      data: { user: safeUser(user) },
      token, // can remove if only using cookie
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: "LOGIN_FAILED",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in prod
      sameSite: "strict",
    });

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
      errorCode: "LOGOUT_FAILED",
    });
  }
};

/**
 * @desc    OAuth success handler (Google, etc.)
 */
export const oauthSuccess = (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "OAuth login failed" });
  }

  res.json({
    success: true,
    message: "Login successful via Google OAuth",
    token: req.user.token, // make sure your strategy attaches a token to req.user
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
};

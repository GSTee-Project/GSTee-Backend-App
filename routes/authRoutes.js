// routes/auth.routes.js
import express from "express";
import passport from "passport"; // ← ADD THIS
import {
  signup,
  login,
  verifyEmail,
  resendVerificationCode,
  logout,
  oauthSuccess,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with code
 */
router.post("/verify-email", verifyEmail);

/**
 * @route   POST /api/auth/resend-code
 * @desc    Resend email verification code
 */
router.post("/resend-code", resendVerificationCode);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout the current user
 */
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  oauthSuccess
);

export default router;

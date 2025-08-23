import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const myApp = "http://localhost:5000";

// Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App password
  },
});

export const sendVerificationEmail = async (email, code, userId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email (must match auth.user)
      to: email,
      subject: "Your Verification Code",
      text: `Your verification link is: ${myApp}/api/auth/verify?id=${userId}&code=${code}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}`);
    return { success: true, message: `Verification code sent successfully` };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};

// Debug log
console.log("The sender email is:", process.env.EMAIL_USER);

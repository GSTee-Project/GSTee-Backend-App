import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const myApp = "http://localhost:5000";
const transporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email, code, userId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification link is ${myApp}/api/auth/verify?id=${userId}&code=${code}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    return { success: true, message: `Verification code sent successfully` };
  } catch (error) {
    console.error("Error sending email", error.message);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};
const email = process.env.EMAIL;
console.log("The sender email is:", email);

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

// Regex helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+{}[\]:;<>,.?/~`-]){2,}).{1,8}$/;

// -------------------- SIGNUP --------------------
export const signup = async (req, res) => {
  const { fullName, contact, password } = req.body;

  if (!fullName || !contact || !password)
    return res.status(400).json({ message: "Full name, Email/Phone and password are required" });

  if (!emailRegex.test(contact) && !phoneRegex.test(contact))
    return res.status(400).json({ message: "Enter a valid email or 10-digit phone number" });

  if (!passwordRegex.test(password))
    return res.status(400).json({
      message: "Password must have 1 uppercase, 2 digits, 2 special chars, max 8 characters",
    });

  try {
    const existingUser = await User.findOne({
      $or: [{ email: contact.toLowerCase() }, { phone: contact }],
    });

    if (existingUser)
      return res.status(400).json({ message: "User already registered. Please login." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = emailRegex.test(contact)
      ? { fullName, email: contact.toLowerCase(), password: hashedPassword }
      : { fullName, phone: contact, password: hashedPassword };

    const user = new User(userData);
    await user.save();

    res.json({ message: "Account created successfully", fullName: user.fullName });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { contact, password } = req.body;

  if (!contact || !password)
    return res.status(400).json({ message: "Email/Phone and password are required" });

  try {
    const user = await User.findOne({
      $or: [{ email: contact.toLowerCase() }, { phone: contact }],
    });

    if (!user) return res.status(404).json({ message: "User not found. Please signup." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // SEND fullName WITH TOKEN
    res.json({ message: "Login successful", token, fullName: user.fullName });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
  const { contact } = req.body;

  if (!contact) return res.status(400).json({ message: "Email/Phone is required" });

  if (!emailRegex.test(contact) && !phoneRegex.test(contact))
    return res.status(400).json({ message: "Enter a valid email or 10-digit phone number" });

  try {
    const user = await User.findOne({
      $or: [{ email: contact.toLowerCase() }, { phone: contact }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    if (emailRegex.test(contact)) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click below to reset password:</p><a href="${resetLink}">Reset Password</a>`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  const { contact, newPassword } = req.body;

  if (!contact || !newPassword)
    return res.status(400).json({ message: "Email/Phone and new password are required" });

  if (!emailRegex.test(contact) && !phoneRegex.test(contact))
    return res.status(400).json({ message: "Enter a valid email or 10-digit phone number" });

  if (!passwordRegex.test(newPassword))
    return res.status(400).json({
      message: "Password must have 1 uppercase, 2 digits, 2 special chars, max 8 characters",
    });

  try {
    const user = await User.findOne({
      $or: [{ email: contact.toLowerCase() }, { phone: contact }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

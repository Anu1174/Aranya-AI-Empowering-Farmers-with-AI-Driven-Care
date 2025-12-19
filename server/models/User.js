import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true, // ✅ allows multiple null emails
    required: function () {
      return !this.phone;
    },
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // ✅ allows multiple null phones
    required: function () {
      return !this.email;
    },
  },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpire: Date,
});

const User = mongoose.model("User", userSchema);
export default User;

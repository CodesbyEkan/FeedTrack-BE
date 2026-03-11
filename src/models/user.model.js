import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [25, 'Invalid, too long, name should not be more than 25 characters'],
    minLength: [2, 'Name should contain more than 2 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    lowercase: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Password should be more than 6'],
    select: false
  },
  role: {
    type: String,
    enum: ["user", "staff", "owner", "manager", "admin"],
    default: "user"
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({id:this._id}, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRE
  });
};

const User = mongoose.model("User", userSchema);

export default User;
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { findUserById } from "../services/auth.service.js";





export const checkAuth = async (req, res, next) => {
  try {
    let accessToken;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2) {
        accessToken = parts[1];
      }
    }
  

  // 2. Fall back to cookie (used by browser clients)
    if (!accessToken && req.cookies?.accessToken) {
      accessToken = req.cookies.accessToken;
    }


    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Authentication is missing! Please login to access resource"});
    }


    const decoded = jwt.verify(accessToken, ENV.JWT_SECRET);

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    }

    req.user = user;
    
    next();
  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });

  }
};

//Role based control

export const roleBasedPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({message: "Forbidden: You don't have access to the resource"});
    }
    next();
  }
};
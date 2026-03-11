import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { findUserById } from "../services/auth.service.js";

export const checkAuth = async (req, res, next) => {
  try {
    let accessToken;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.split(" ")[1];
    }
  
    if (!acccessToken) {
      return res.status(401).json({ success: false, message: "Authentication is missing! Please login to access resource"});
    }
  
    const verifyAccessToken = jwt.verify(accessToken, ENV.JWT_SECRET);
  
    const user = await findUserById(verifyAccessToken.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found"});
    }
    req.user = user;
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: `Error in the checkAuth - ${error.message}` })
  }
};

export const roleBasedPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({message: "Forbidden: You don't have access to the resource"});
    }
    next();
  }
};
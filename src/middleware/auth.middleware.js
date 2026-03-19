import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { findUserById } from "../services/auth.service.js";

// export const checkAuth = async (req, res, next) => {
//   try {
//     let accessToken;
//     if (req.headers.authorization?.startsWith("Bearer ")) {
//       accessToken = req.headers.authorization.split(" ")[1];
//     }

//     if (!accessToken && req.cookies?.accessToken) {
//       accessToken = req.cookies.accessToken;
//     }

//     if (!accessToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication is missing! Please login to access resource",
//       });
//     }

//     const verifyAccessToken = jwt.verify(accessToken, ENV.JWT_SECRET);

//     const user = await findUserById(verifyAccessToken.id);
//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not found" });
//     }
//     req.user = user;

//     next();
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `Error in the checkAuth - ${error.message}`,
//     });
//   }
// };



export const checkAuth = async (req, res, next) => {
  try {
    let accessToken;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2) {
        accessToken = parts[1];
      }
    }
  
    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Authentication is missing! Please login to access resource"});
    }
<<<<<<< Updated upstream
  
    const verifyAccessToken = jwt.verify(accessToken, ENV.JWT_SECRET);
  
    const user = await findUserById(verifyAccessToken.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found"});
=======

    const decoded = jwt.verify(accessToken, ENV.JWT_SECRET);

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
>>>>>>> Stashed changes
    }

    req.user = user;
    
    next();
  } catch (error) {
<<<<<<< Updated upstream
    res.status(500).json({ success: false, message: `Error in the checkAuth - ${error.message}` })
=======
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
>>>>>>> Stashed changes
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
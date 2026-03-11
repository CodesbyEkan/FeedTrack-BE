import { ENV } from '../config/env.js';

export const generateAndSetCookie = (user, statusCode, res) => {
  // get the token from the user schema
  const accessToken = user.generateToken();

  const options = {
    maxAge: ENV.EXPIRE_COOKIE*24*60*60*1000, // set in milliseconds
    httpOnly: true, // prevent xss attacks
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: ENV.NODE_ENV !== "development",
  }

  user.password = undefined;

  res.status(statusCode).cookie('accessToken', accessToken, options).json({
    success: true,
    user,
    accessToken
  });
}
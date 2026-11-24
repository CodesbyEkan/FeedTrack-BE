import { ENV } from "../config/env.js";

export const generateAndSetCookie = (user, res) => {
  // get the token from the user schema
  const accessToken = user.generateToken();

  //new added
  const isProd = ENV.NODE_ENV !== "development";

  const options = {
    maxAge: ENV.EXPIRE_COOKIE * 24 * 60 * 60 * 1000, // set in milliseconds
    httpOnly: true, // prevent xss attacks
    sameSite: isProd ? "none" : "strict", // CSRF attacks cross-site request forgery attacks
    secure: isProd,
  };

  res.cookie("accessToken", accessToken, options);
  return accessToken;
};

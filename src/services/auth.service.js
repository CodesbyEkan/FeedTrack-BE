import User from "../models/user.model.js";

// find user by Id
export const findUserById = async (id) => {
  return await User.findById(id);
};

// find user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// create new user
export const createUser = async (userData) => {
  return await User.create(userData);
};

// find user by email with password
export const findUserWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

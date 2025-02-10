import userModel from "../database/models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = catchAsync(async (req, res, next) => {
  // Check if username already exists
  let existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new AppError("Username already exists", 400));
  }

  // Create new user
  const user = new userModel(req.body);
  await user.save();

  res.status(201).json({
    status: "success",
    data: { user },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  res.json({
    status: "success",
    token,
  });
});

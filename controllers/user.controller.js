import userModel from "../database/models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createUser = catchAsync(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError("User already exists", 400));
  }
  let result = new userModel(req.body);
  await result.save();
  res.status(201).json({
    status: "success",
    data: { result },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  let user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getUsers = catchAsync(async (req, res, next) => {
  let users = await userModel.find();
  res.status(200).json({
    status: "success",
    data: { users },
  });
});

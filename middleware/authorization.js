import userModel from "../database/models/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import catchAsync from "../utils/catchAsync.js";

export const protectedRoutes = catchAsync(async (req, res, next) => {
  let { authorization } = req.headers;
  if (!authorization) {
    throw new AppError("You are not authenticated", 401);
  }
  const decoded = await promisify(jwt.verify)(
    authorization,
    process.env.JWT_SECRET
  );
  const user = await userModel.findById(decoded.id);

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }
  req.user = user;
  next();
});

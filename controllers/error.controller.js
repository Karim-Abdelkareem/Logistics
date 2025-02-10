import AppError from "../utils/AppError.js";

// Handle MongoDB CastError (invalid ID)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle MongoDB duplicate key error
const handleDuplicateError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field: '${field}' with value '${value}'. Please use another value.`;
  return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Send detailed error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// Send minimal error response in production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// Global error handler middleware
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    // Handle specific MongoDB errors
    if (err.name === "CastError") error = handleCastError(err);
    if (err.code === 11000) error = handleDuplicateError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);

    sendErrorProd(error, res);
  }
};

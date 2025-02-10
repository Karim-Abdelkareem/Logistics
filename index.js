import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./controllers/error.controller.js";
import userRoutes from "./router/user.router.js";
import authRouter from "./router/auth.router.js";
import dbconnection from "./database/dbConnection.js";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Routes

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Limetless Logistic API!",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

dbconnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./controllers/error.controller.js";
import userRoutes from "./router/user.router.js";
import dbconnection from "./database/dbConnection.js";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
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

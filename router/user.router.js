import express from "express";

const router = express.Router();

// Import controllers

import * as userController from "../controllers/user.controller.js";

// Define routes

router.route("/").post(userController.createUser).get(userController.getUsers);

router.route("/:id").get(userController.getUser);

router.route("/:id").patch(userController.updateUser);

router.route("/:id").delete(userController.deleteUser);

export default router;

import express from "express";
import * as shippingController from "../controllers/shipping.controller.js";
import { protectedRoutes } from "../middleware/authorization.js";

const router = express.Router();

router
  .route("/")
  .get(shippingController.getAllShipments)
  .post(protectedRoutes, shippingController.createShipment);

router.route("/:id").get(shippingController.getShipmentById);
router
  .route("/u/user")
  .get(protectedRoutes, shippingController.getAllUserShippings);

router
  .route("/t/:trackingNumber")
  .get(shippingController.getShippingByTrackingNumber);

export default router;

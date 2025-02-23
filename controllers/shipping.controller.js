import shippingModel from "../database/models/shipping.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllShipments = catchAsync(async (req, res, next) => {
  let shipments = await shippingModel.find();
  res.status(200).json({
    status: "success",
    data: { shipments },
  });
});

export const getShipmentById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const shipment = await shippingModel.findById(id);
  if (!shipment) {
    return next(new AppError("Shipment not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { shipment },
  });
});

export const createShipment = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;

  const timestamps = Date.now();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  req.body.trackingNumber = `${
    timestamps.toString() + randomNumber.toString()
  }`;

  switch (req.body.shippingType) {
    case "aerial": {
      req.body.totalPrice = req.body.weight * 80;
      break;
    }
    case "nautical": {
      req.body.totalPrice = req.body.weight * 100;
      break;
    }
    case "overland": {
      req.body.totalPrice = req.body.weight * 150;
      break;
    }
    case "inside": {
      req.body.totalPrice = req.body.weight * 50;
      break;
    }
    default:
      return next(new AppError("Invalid shipping type", 400));
  }

  const result = new shippingModel(req.body);
  await result.save();
  res.status(201).json({
    status: "success",
    data: result,
  });
});

export const getAllUserShippings = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const shipments = await shippingModel.find({ user: req.user.id });
  res.status(200).json({
    status: "success",
    data: shipments,
  });
});

export const getShippingByTrackingNumber = catchAsync(
  async (req, res, next) => {
    const trackingNumber = req.params.trackingNumber;
    const shipment = await shippingModel.findOne({ trackingNumber });
    if (!shipment) {
      return next(new AppError("Shipment not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: shipment,
    });
  }
);

export const updateShipmentStatus = catchAsync(async (req, res, next) => {
  const shipment = await shippingModel.findOneAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!shipment) {
    return next(new AppError("Shipment not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: shipment,
  });
});

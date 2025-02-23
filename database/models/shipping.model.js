import mongoose from "mongoose";

const shippingScheme = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    shippingType: {
      type: String,
      enum: ["aerial", "nautical", "overland", "inside"],
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverAddress: {
      type: String,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      unique: true,
      required: true,
    },
    breakable: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      required: true,
    },
    dimensions: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "in transit", "delivered", "canceled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipping", shippingScheme);

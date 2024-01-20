const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
    cost: {
      type: String,
      required: true,
    },
    orderSl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "completed", "cancel", "refund"],
      default: "pending",
    },
    deliveryDate: {
      type: Date,
    },
    products: [ProductSchema],
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;

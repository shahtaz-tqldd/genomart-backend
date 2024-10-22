const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  variations: [
    {
      color: {
        type: String,
        required: true,
      },
      totalCount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Your Name"],
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    category: {
      type: String,
    },
    sizes: [sizeSchema],
    specialOffer: {
      type: String,
    },
    brand: {
      type: String,
    },
    description: {
      type: String,
    },
    specs: {
      type: String,
    },
    numSold: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        enum: ["hero", "specialDeal", "bestDeal"],
      },
    ],
    images: [imageSchema],
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

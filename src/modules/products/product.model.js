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
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
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

    images: [imageSchema],
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

const mongoose = require("mongoose");
const validator = require("validator");

const bannerSchema = mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const InfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    logo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    location: {
      type: String,
    },
    contact: {
      type: Number,
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    brandColor: {
      type: String,
    },
    description: {
      type: String,
    },
    terms: {
      type: String,
    },
    privacyPolicy: {
      type: String,
    },

    banners: [bannerSchema],
  },
  { timestamps: true, versionKey: false }
);

const Info = mongoose.model("Info", InfoSchema);

module.exports = Info;

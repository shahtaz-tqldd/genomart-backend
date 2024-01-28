const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please enter Your Name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: false,
    },
    house: {
      type: String,
    },
    street: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["super admin", "admin", "user", "seller"],
      default: "user",
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

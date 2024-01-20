const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const config = require("../../../config");

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
      required: true,
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
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
  // Check if the password field is modified or if it's a new user
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

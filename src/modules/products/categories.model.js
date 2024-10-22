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

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category name"],
    },
    description: {
      type: String,
    },
    image: imageSchema,
  },
  { timestamps: true, versionKey: false }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

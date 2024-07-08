const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId },
  likes: {
    type: { type: mongoose.Schema.Types.ObjectId },
    default: [],
  },
  createdAt: { type: Date, default: Date.now, required: false },
});

module.exports = mongoose.model("item", clothingItemSchema);

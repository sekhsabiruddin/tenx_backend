const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  username: {
    type: String,
    default: null,
  },
  productName: {
    type: String,
  },
  price: {
    type: String,
  },
  discount: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  images: [String], // Assuming images are stored as URLs or file paths
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

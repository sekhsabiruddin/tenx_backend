const express = require("express");
const router = express.Router();
const isAuthenticatedUser = require("../middleware/auth");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../model/Product");
const { upload } = require("../multer");
// Create Product
const isAuthenticatedAdmin = require("../middleware/adminAuth");
router.post(
  "/create-product",
  isAuthenticatedAdmin,
  upload.array("images"),
  async (req, res, next) => {
    console.log(req.body);
    try {
      const files = req.files;
      const imageUrls = files.map((file) => file.filename);

      const productData = {
        username: req.Admin.username, // Handle optional username
        productName: req.body.productName,
        price: req.body.price,
        discount: req.body.discount,
        productDescription: req.body.productDescription,
        images: imageUrls,
      };

      const product = await Product.create(productData);

      res.status(201).json({ success: true, product });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Read All Products
router.get(
  "/all-products",

  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find();
      res.send(products);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update Product
router.put(
  "/update-product/:id",
  upload.array("images"), // To handle image updates
  catchAsyncErrors(async (req, res, next) => {
    console.log("Hi update");
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const files = req.files;
      if (files && files.length > 0) {
        const imageUrls = files.map((file) => file.filename);
        product.images = imageUrls;
      }

      // Update product fields
      product.productName = req.body.productName || product.productName;
      product.price = req.body.price || product.price;
      product.discount = req.body.discount || product.discount;
      product.productDescription =
        req.body.productDescription || product.productDescription;

      const updatedProduct = await product.save();

      res.status(200).json({ success: true, updatedProduct });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete Product
router.delete(
  "/delete-product/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      res.status(200).json({ product }); // Respond with the deleted product
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;

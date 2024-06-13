const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./db/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./controller/userController");
const Product = require("./controller/productController");
const errorMiddleware = require("./middleware/error");

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); // JSON parsing with limit
app.use(express.urlencoded({ extended: true })); // Form data parsing
app.use("/", express.static("uploads")); // Serving static files

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials
  })
);

// All the routers
app.use("/api/user", User);
app.use("/api/product", Product);
app.use(errorMiddleware);

// Database connection
dbConnect();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const jwt = require("jsonwebtoken");
const User = require("../model/user");

const isAuthenticatedAdmin = async (req, res, next) => {
  try {
    const { AdminToken } = req.cookies;
    console.log(AdminToken);
    if (!AdminToken) {
      return res
        .status(401)
        .json({ message: "Please Login to access this resource" });
    }

    const decodedData = jwt.verify(AdminToken, process.env.ADMIN_JWT_SECRET);

    req.Admin = await User.findById(decodedData.userId);

    if (!req.Admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isAuthenticatedAdmin;

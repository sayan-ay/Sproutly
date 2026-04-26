const jwt = require("jsonwebtoken");
const User = require("../Models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      req.user = null;
      next();
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password");
    if (user) {
      req.user = user;
    }

    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

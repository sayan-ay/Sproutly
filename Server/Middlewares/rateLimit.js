const rateLimit = require("express-rate-limit");

module.exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(409).json({
      message: "Too many login attempts.Try again in 15 minutes.",
      tryAgain: windowMs / 1000,
    });
  },
});

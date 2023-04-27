const ErrorHandler = require("../utility/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb Id error handselling
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // mongodb duplicate key error handler
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // Wrong JWT Token
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid Try Again`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Invalid Try Again`;
    err = new ErrorHandler(message, 400);
  };
  
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

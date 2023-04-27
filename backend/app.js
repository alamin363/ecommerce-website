const express = require("express");
const ErrorHandler = require("./middleware/Error");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
// root import
const product = require("./routes/ProductRoute.js");
const user = require("./routes/UserRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
// use the middleware error handler
app.use(ErrorHandler);
module.exports = app;

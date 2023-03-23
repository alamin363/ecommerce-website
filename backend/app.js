const express = require("express");
const ErrorHandler = require("./middleware/Error");
const app = express();
app.use(express.json());
// root import
const product = require("./routes/ProductRoute.js");

app.use("/api/v1/", product);
// use the middleware error handler
app.use(ErrorHandler);
module.exports = app;

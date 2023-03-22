const express = require("express");
const app = express();
app.use(express.json()); 

// root import
const product = require("./routes/ProductRoute.js");

app.use("/api/v1/", product);

module.exports = app;

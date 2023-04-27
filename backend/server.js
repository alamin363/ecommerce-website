const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
// handelling uncaught Exception Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server due to uncaught Exception Rejection");
  process.exit(1);
});
// dotenv Config
dotenv.config({ path: "backend/config/config.env" });
// connect database
connectDatabase();


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`server is running http://localhost${PORT}`);
});

// unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server due to unhandle Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});

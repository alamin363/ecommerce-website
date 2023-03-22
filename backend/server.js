const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")
// dotenv Config
dotenv.config({ path: "backend/config/config.env" });
// connect database
connectDatabase();
 
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server is running http://localhost${PORT}`);
});

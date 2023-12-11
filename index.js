const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const getNavigationEntriesRoute = require("./routes/getNavigationEntriesRoute");
const getPageRoute = require("./routes/getPageRoute");
const getHomePageRoute = require("./routes/getHomePageRoute");
const getProductRoute = require("./routes/getProductRoute");
const getProductsByCategory = require("./routes/getProductsByCategoryRoute");
const getProductsByCategoriesRoute = require("./routes/getProductsByCategoriesRoute");
const createCartRoute = require("./routes/createCartRoute");

dotenv.config();

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.get("/getNavigationEntries", getNavigationEntriesRoute);
app.get("/getHomePage", getHomePageRoute);
app.get("/getPage", getPageRoute);

app.get("/getProductsByCategory", getProductsByCategory);
app.get("/getProductsByCategories", getProductsByCategoriesRoute);
app.get("/getProduct", getProductRoute);

app.post("/createCart", createCartRoute);

app.listen(port, () => {
  console.log(`Product service on port: ${port}`);
});

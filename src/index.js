const cors = require("cors");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const accountRoute = require("./routes/account");
const departmentRoute = require("./routes/department");
const positionRoute = require("./routes/position");
const productRoute = require("./routes/product");
const productCategoryRoute = require("./routes/productCategory");
const shippingOrderRoute = require("./routes/shippingOrder");
const productReviewRoute = require("./routes/productReview");
const shippingBranchRoute = require("./routes/shippingBranch");
const orderRoute = require("./routes/order");
const { swaggerDocs } = require("./services/swaggerService");
var path = require("path");

require("dotenv").config();
const uploadMiddleware = require("./middleware/upload");
const { CORS_URLS } = require("./constants/schema");
const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_URLS,
    methods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(morgan("combined"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/accounts", accountRoute);
app.use("/departments", departmentRoute);
app.use("/positions", positionRoute);
app.use("/products", uploadMiddleware("productImage"), productRoute);
app.use("/product-categories", productCategoryRoute);
app.use("/shipping-orders", shippingOrderRoute);
app.use("/product-review", productReviewRoute);
app.use("/shipping-branchs", shippingBranchRoute);
app.use("/orders", orderRoute);
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).send({
    message: "Something went wrong!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  swaggerDocs(app, port);
});

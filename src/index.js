const cors = require("cors");
const express = require("express");
const multer = require("multer");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const accountRoute = require("./routes/account");
const departmentRoute = require("./routes/department");
const positionRoute = require("./routes/position");
const productRoute = require("./routes/product");
const { swaggerDocs } = require("./services/swaggerService");

require("dotenv").config();
var path = require("path");
const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
const upload = multer(); // Initialize multer
app.use(upload.none());

// parse application/json
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index");
});
app.use("/test", (req, res) => {
  console.log(req.body);
  res.status(400).send({ text: "abc" });
});

app.use(morgan("combined"));
app.use("/accounts", accountRoute);
app.use("/departments", departmentRoute);
app.use("/positions", positionRoute);
app.use("/products", productRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  swaggerDocs(app, port);
});

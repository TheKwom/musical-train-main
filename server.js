/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities");
const session = require("express-session");
const pool = require("./database/");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(cookieParser());
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine & Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
//index route
app.get("/", baseController.buildHome);
// Inventory routes
app.use("/inv", inventoryRoute);
// Account routes
app.use("/account", accountRoute);

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

// Express Error Handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let status = err.status || 500;
  let message = err.message;
  if (req.originalUrl === "/myError") {
    status = 500;
    message = "This is my HTTP Error, I added it on purpose.";
  }

  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

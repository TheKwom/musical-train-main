const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="card-info">';
      grid +=
        '<a href="../../detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img class="img-inventory" src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        '<span class="car-price" >$' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the inventory view HTML
 * ************************************ */
Util.BuildInvInfo = async function (data) {
  let info;
  if (data.length > 0) {
    info = '<ul id="inv-info">';
    data.forEach((vehicle) => {
      info += "<li>";
      info +=
        vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model;
      info += "</li>";
      info += "<li>";
      info +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      info += "</li>";
      info += "<li>";
      info += vehicle.inv_make + " " + vehicle.inv_model + " Details";
      info += "</li>";
      info += "<li>";
      info += "Price: $" + vehicle.inv_price;
      info += "</li>";
      info += "<li>";
      info += "Description: " + vehicle.inv_description;
      info += "</li>";
      info += "<li>";
      info += "Color: " + vehicle.inv_color;
      info += "</li>";
      info += "<li>";
      info += "Miles: " + vehicle.inv_miles;
      info += "</li>";
    });
    info += "</ul>";
  } else {
    info += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return info;
};

/* **************************************
 * build form inventory
 * ************************************ */
Util.addInventoryForm = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let form = '<select id="newClass" name="classification_id" required >';
  form += '<option value =""> Please select a classification </option>';
  data.rows.forEach((row) => {
    form +=
      '<option value="' +
      row.classification_id +
      '">' +
      row.classification_name +
      "</option>";
  });
  form += "</select>";
  return form;
};

/* **************************************
 * build classification list
 * ************************************ */
Util.buildClassificationList = async function (selected_id = "") {
  let block;
  let data = await invModel.getClassifications();
  if (data.rowCount > 0) {
    block = '<select id="classificationList" name="classification_id">';
    block += '<option value="">Select..</option>';
    data.rows.forEach((row) => {
      selected = row.classification_id == selected_id ? "selected" : "";
      block +=
        '<option value="' + row.classification_id + '" ' + selected + ">";
      block += row.classification_name;
      block += "</option>";
    });
    block += "</select>";
  } else {
    block =
      '<p class="notice">Sorry, we are unable to retrieve a list of classifications at this time, please check the connection to the database.</p>';
  }
  return block;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check if they are allowed or not on a page by account type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.accountData.account_type === "Admin" ||
    res.locals.accountData.account_type === "Employee"
  ) {
    next();
  } else {
    req.flash("notice", "You do not have permission to view this page.");
    return res.redirect("/");
  }
};

/* **************************************
 *  Deletes the cookies and jwt
 * **************************************/
Util.deleteJwt = (req, res, next) => {
  if (req.cookies.jwt) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(403).redirect("/");
  } else {
    next();
  }
};

Util.checkLogin = (req, res, next) => {
  if (res.locals.accountData) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;

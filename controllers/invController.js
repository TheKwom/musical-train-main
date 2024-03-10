// invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by individual id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInventoryId(inv_id);
  const info = await utilities.BuildInvInfo(data);
  let nav = await utilities.getNav();
  const invName =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/singleInventory", {
    title: invName,
    nav,
    info,
    errors: null,
  });
};

invCont.buildInvManagement = async function (req, res) {
  let nav = await utilities.getNav();
  req.flash("tag", "Link 1");
  req.flash("tag", "Link 2");
  console.log(`Here is the flash: ${req.flash("link")}`);
  res.render("./inventory/management", { title: "Management", nav });
};

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
  });
};

/* ****************************************
 *  Process Add Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  console.log(`Req.body = ${req.body}`);
  const addClassResult = await invModel.addClassification(classification_name);

  if (addClassResult) {
    req.flash(
      "notice",
      `${classification_name} successfully added to classifications.`
    );
    res.status(201).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the something went wrong.");
    res.status(501).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
    });
  }
};

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/addInventory", {
    title: "Add Inventory",
    nav,
  });
};

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  const invResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );
  if (invResult) {
    req.flash("notice", "Vehicle added to inventory.");
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    });
  }
};

module.exports = invCont;

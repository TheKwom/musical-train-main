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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.addInventoryForm();
  console.log(`Here is the flash: ${req.flash("link")}`);
  res.render("./inventory/management", {
    title: "Management",
    message: null,
    nav,
    errors: null,
    classificationSelect,
  });
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
  let form = await utilities.addInventoryForm();
  let nav = await utilities.getNav();
  res.render("./inventory/addInventory", {
    title: "Add Inventory",
    nav,
    error: null,
    form,
  });
};

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invCont.addInv = async function (req, res) {
  let form = await utilities.addInventoryForm();
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const regResults = await invModel.addInv(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (regResults) {
    req.flash("notice", `${inv_make} ${inv_model} added to the inventory.`);
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      form,
    });
  } else {
    req.flash("notice", "Sorry, the new vehicle failed to add.");
    res.status(501).render("./inventory/addInventory", {
      title: "New Vehicle",
      nav,
      errors: null,
      form,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;

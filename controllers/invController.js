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
  const className = data[0]?.classification_name;
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

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
  });
};

/* ***************************
 *  Build delete classification view
 * ************************** */
invCont.buildDeleteClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render(`./inventory/deleteClassification`, {
    title: "Delete",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ***************************
 *  Get classifications
 * ************************** */
invCont.getClassifications = async function (req, res, next) {
  const data = await invModel.getClassifications();
  let nav = await utilities.getNav();
  res.render("./inventory/addInventory", {
    title: "Add Car Inventory",
    nav,
    classification_name: data.rows,
    errors: null,
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

/* ***************************
 *  Build add inv view
 * ************************** */
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
invCont.addInv = async function addInventory(req, res, next) {
  let nav = await utilities.getNav();
  let classification_id = req.body.classification_id;
  let inv_make = req.body.inv_make;
  let inv_model = req.body.inv_model;
  let inv_description = req.body.inv_description;
  let inv_image = req.body.inv_image;
  let inv_thumbnail = req.body.inv_thumbnail;
  let inv_price = req.body.inv_price;
  let inv_year = req.body.inv_year;
  let inv_miles = req.body.inv_miles;
  let inv_color = req.body.inv_color;
  let result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  console.log(result);
  const classificationSelect = await utilities.buildClassificationList();

  if (result && result.rowCount > 0) {
    req.flash(`notice`, `The ${inv_make} ${inv_model} was successfully added.`);
    res.status(201).render("./inventory/management", {
      title: "Add Car Inventory",
      nav,
      errors: [],
      classificationSelect,
    });
  } else {
    req.flash("notice", "Error adding inventory");
    res.status(501).render("./inventory/addInventory", {
      title: "Add Car Inventory",
      nav,
      errors: "Error adding inventory",
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

/* ****************************
 * Build edit-inventory view
 * *************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.addInventoryForm(
    itemData.classification_id
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
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

  const updateResult = await invModel.updateInventory(
    inv_id,
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

  if (updateResult) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.addInventoryForm(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();

  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.addInventoryForm();

  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;

  res.render("./inventory/deleteConfirmation", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    classification_id: itemData[0].classification_id,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);
  if (deleteResult) {
    req.flash("notice", `The delted was successfully .`);
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(501)(`/inv/delete/${inv_id}`);
  }
};

/* ***************************
 *  Delete Classification Data
 * ************************** */
invCont.deleteClassification = async function (req, res, next) {
  const classification_id = parseInt(req.body.classification_id);
  const deleteResult = await invModel.deleteClassification(classification_id);
  if (deleteResult) {
    req.flash("notice", `The classification was successfully deleted.`);
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/inv");
  }
};

module.exports = invCont;

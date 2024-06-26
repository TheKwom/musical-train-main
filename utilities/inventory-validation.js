const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const managementModel = require("../models/management-model");

validate.inventoryRules = () => {
  return [
    // classification_id is required
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please select a classification."),

    // inv_make is required
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),

    // inv_model is required
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),

    // inv_description is required
    body("inv_description")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a description."),

    // inv_image is required
    body("inv_image")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide an image."),

    // inv_thumball is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a thumbnail."),

    // inv_price is required
    body("inv_price")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a price."),

    // inv_year is required
    body("inv_year")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Please provide a year."),

    // inv_miles is required
    body("inv_miles")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide mileage."),

    // inv_color is required
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a color."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classification_name = await managementModel.getClassifications();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Car Inventory",
      nav,
      classification_name: classification_name.rows,
    });
    return;
  }
  next();
};

validate.classificationRules = () => {
  return [
    // classification_name is required
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const classificationExists =
          await managementModel.checkExistingClassification(
            classification_name
          );
        if (classificationExists) {
          throw new Error(
            "Classification exists. Please use different classification"
          );
        }
      })
      // validar que la clasificación no tenga espacios
      .custom(async (classification_name) => {
        if (classification_name.includes(" ")) {
          throw new Error("Classification name cannot contain spaces.");
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors", errors.array());
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: `Add Classification`,
      nav,
    });
    return;
  }
  next();
};

validate.deleteAccountRules = () => {
  return [
    // inv_id is required
    body("inv_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please select a vehicle to delete."),
  ];
};

validate.checkDeleteAccountData = async (req, res, next) => {
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors", errors.array());
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      errors,
      title: `Management`,
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;

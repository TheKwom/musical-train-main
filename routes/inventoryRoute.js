// inventoryRoute.js
// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const managementController = require("../controllers/managementController");
const invValidate = require("../utilities/inventory-validation");

/***************************
 * GET methods
 ****************************/
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.getClassifications),
  (req, res) => {
    console.log("add-inv");
  },
  utilities.handleErrors(invController.buildAddInventory)
);
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(managementController.buildManagement)
);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildEditInventory)
);
router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.checkLogin,
  utilities.handleErrors(invController.buildDeleteInventory)
);
router.get(
  "/delete-classification",
  utilities.handleErrors(invController.buildDeleteClassification)
);

/***************************
 * POST methods
 ****************************/
router.post(
  "/update",
  invController.updateInventory,
  utilities.checkLogin,
  invValidate.inventoryRules()
);
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.deleteAccountRules(),
  invValidate.checkDeleteAccountData,
  utilities.handleErrors(invController.deleteInventory)
);

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInv)
);

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.post(
  "/delete-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.checkAccountType,
  invValidate.checkDeleteAccountData,
  utilities.handleErrors(invController.deleteClassification)
);

module.exports = router;

// inventoryRoute.js
// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by id
router.get("/detail/:invId", invController.buildByInvId);
// Route to build inventory management
router.get("/", invController.buildInvManagement);
// Deliver add classification view
router.get("/add-class", invController.buildAddClassification);
// Process Add Classification data
router.post(
  "/add-class",
  utilities.handleErrors(invController.addClassification)
);
// Route to add new vehicle view
router.get("/add-inventory", invController.buildAddInventory);
// Route to add new vehicle
router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;

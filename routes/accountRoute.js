// accountRoute.js
// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/***************************
 * GET methods
 ****************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/update/:account_id", accountController.buildUpdateAccount);
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
);
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/***************************
 * Enhancement GET methods
 ****************************/
router.get(
  "/update-account-type/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildPermissionsPage)
);

router.get(
  "/get-users/:account_type",
  utilities.handleErrors(accountController.getUsersJSON)
);

/***************************
 * POST methods
 ****************************/
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
router.post(
  "/updateAccount",
  regValidate.accountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/change-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
);

/***************************
 * Enhancement POST methods
 ****************************/
router.post(
  "/update-account-type",
  utilities.handleErrors(accountController.updateAccountType)
);

router.post("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;

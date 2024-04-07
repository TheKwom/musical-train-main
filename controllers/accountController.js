const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");

const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function accountManagement(req, res, next) {
  let nav = await utilities.getNav();
  // const accountTypeSelect = await utilities.buildAccountTypeList;
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    // accountTypeSelect,
  });
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  console.log("ACCOUNTLOGIN.JS EXECUTED");
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return (
        res.redirect("/account/"),
        {
          title: "Account Management",
          nav,
          accountData: accountData.account_firstname,
        }
      );
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

async function logout(req, res) {
  console.log("-------------> In logout function");
  try {
    console.log("-------------> In logout TRY");
    res.clearCookie("jwt");
    console.log("JWT cleared");
    res.clearCookie("sessionId");
    console.log("SessionID cleared");
    req.flash("notice", "You are now logged out.");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

/* ***************************
 *  Build edit account view
 * ************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  if (accountData) {
    res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_email: accountData.account_email,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_id: account_id,
    });
  } else {
    req.flash(
      "notice",
      "sorry unable to update your information, please try logging in again"
    );
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  This is the function to update the account
 * ************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  const updateResult = await accountModel.updateAccount(
    Number(account_id),
    String(account_firstname),
    String(account_lastname),
    String(account_email)
  );

  if (updateResult) {
    req.flash("notice", `The account was successfully updated.`);
    res.redirect("/account"),
      {
        title: "Account Management",
        errors: null,
      };
  } else {
    const itemName = `${account_firstname} ${account_lastname}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update " + itemName,
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ***************************
 *  This is the function to update the password
 * ************************** */
async function changePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  const accountData = await accountModel.getAccountById(account_id);

  if (updateResult) {
    req.flash("notice", "The password was successfully updated!");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry we could not update your account password.");
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_email: accountData.account_email,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_id: account_id,
    });
  }
}

/* ***************************
 *  Get user JSON & order by account type
 * ************************** */
async function getUsersJSON(req, res, next) {
  console.log("-----------> getUsersJSON");
  const account_type = req.params.account_type;
  const accountData = await accountModel.getUsersByAccountType(account_type);
  // console.log(accountData);
  if (accountData[0].account_type) {
    return res.json(accountData);
  } else {
    next(new Error("No data returned"));
  }
}

/* ***************************
 *  Build change permissions
 * ************************** */
async function buildPermissionsPage(req, res) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const userData = await accountModel.getAccountById(account_id);
  console.log(userData);
  const accountTypeSelect = await utilities.buildAccountTypeList();
  const userName = `${userData.account_firstname} ${userData.account_lastname}`;
  res.render("./account/updatePermissions", {
    title: "Update " + userName,
    nav,
    accountTypeSelect,
    errors: null,
    account_id: userData.account_id,
    account_firstname: userData.account_firstname,
    account_lastname: userData.account_lastname,
    account_type: userData.account_type,
  });
}

/* ***************************
 *  Update account type
 * ************************** */
async function updateAccountType(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_type } = req.body;
  console.log("----------------------------");
  console.log("accountController/updateAccountType");
  console.log("----------------------------");
  console.log(account_id);
  console.log(account_type);
  console.log("----------------------------");
  const updateResult = await accountModel.updateAccountType(
    account_id,
    account_type
  );
  if (updateResult) {
    req.flash("notice", `Update was successful`);
    res.redirect("/account/");
  } else {
    const accountTypeSelect = await utilities.buildAccountTypeList;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("./account/updatePermissions", {
      title: "Update",
      nav,
      accountTypeSelect: accountTypeSelect,
      errors: null,
      account_id: userData.account_id,
      account_type: userData.account_type,
    });
  }
}

module.exports = {
  buildLogin,
  updateAccount,
  logout,
  changePassword,
  buildUpdateAccount,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
  getUsersJSON,
  buildPermissionsPage,
  updateAccountType,
};

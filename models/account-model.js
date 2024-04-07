const pool = require("../database/index");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    console.log("registerAccount");
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    console.log("checkExistingEmail");
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountById(account_id) {
  try {
    console.log("getAccountById");
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Updates account info
 * ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model " + error);
  }
}

/* *****************************
 * Updates password info
 * ***************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_password, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("model " + error);
  }
}

/* *****************************
 * Get users using account_id
 * ***************************** */
async function getUsersByAccountType(account_type) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.account AS i
        WHERE i.account_type = $1`,
      [account_type]
    );
    return data.rows;
  } catch (error) {
    console.error("model " + error);
  }
}

/* *****************************
 * Get distinct account_types
 * ***************************** */
async function getUniqueAccountTypes() {
  try {
    const data = await pool.query(
      `SELECT DISTINCT account_type FROM public.account`
    );
    return data.rows.map((row) => row.account_type);
  } catch (error) {
    console.error("model " + error);
    return [];
  }
}

/* *****************************
 * Update account type
 * ***************************** */
async function updateAccountType(account_id, account_type) {
  console.log("----------------------------");
  console.log("account-model/updateAccountType");
  console.log("----------------------------");
  console.log(account_id);
  console.log(account_type);
  console.log("----------------------------");
  try {
    const sql =
      "UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_type, account_id]);
    return data;
  } catch (error) {
    console.error("model " + error);
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  getUsersByAccountType,
  getUniqueAccountTypes,
  updateAccountType,
};

"use strict";

// get list of account based on account type
let accountTypeList = document.querySelector("#accountTypeList");
accountTypeList.addEventListener("change", function () {
  let account_type = accountTypeList.value;
  let accountTypeURL = "/account/get-users/" + account_type;
  console.log(account_type);
  fetch(accountTypeURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network resonse not OK");
    })
    .then(function (data) {
      buildUserList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

// get list of users using account_id
function buildUserList(data) {
  let userDisplay = document.getElementById("userDisplay");

  let dataTable = "<thead>";
  dataTable +=
    "<tr><th>User Name</th><th>Account Type</th><th>Action</th></tr>";
  dataTable += "</thead>";
  dataTable += "<tbody>";

  data.forEach(function (element) {
    dataTable += `<tr><td>${element.account_firstname} ${element.account_lastname}</td><td>${element.account_type}</td>`;
    dataTable += `<td><a href='/account/update-account-type/${Number(
      element.account_id
    )}' title='Click to update'>Modify</a></td></tr>`;
  });

  dataTable += "</tbody>";

  userDisplay.innerHTML = dataTable;
}

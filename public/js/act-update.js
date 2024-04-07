const form = document.getElementById("updateAccountForm");
form.addEventListener("change", function () {
  const updateBtn = document.getElementById("updateAccountFormButton");
  updateBtn.removeAttribute("disabled");
});

const historyBack = document.getElementById("historyBack");
historyBack.addEventListener("click", function () {
  history.back();
});

/***********************************************
 * SANKALPA – script.js (NON-CORS, NO PREFLIGHT)
 ***********************************************/

function goHome() {
  window.location.href = "index.html";
}

function showExisting() {
  document.getElementById("existingSection").style.display = "block";
  document.getElementById("newSection").style.display = "none";
}

function showNew() {
  document.getElementById("existingSection").style.display = "none";
  document.getElementById("newSection").style.display = "block";
}

const rules = {
  "India": { code: "+91", len: 10 },
  "United States": { code: "+1", len: 10 },
  "United Kingdom": { code: "+44", len: 10 },
  "Singapore": { code: "+65", len: 8 },
  "UAE": { code: "+971", len: 9 },
  "Australia": { code: "+61", len: 9 },
  "Canada": { code: "+1", len: 10 }
};

function handleCountryChange(type) {
  let sel = document.getElementById(type + "_country");
  let code = document.getElementById(type + "_countryCode");
  let other = document.getElementById(type + "_otherCountryBox");

  if (sel.value === "Others") {
    other.classList.remove("hidden");
    code.value = "";
  } else {
    other.classList.add("hidden");
    code.value = sel.options[sel.selectedIndex].dataset.code || "";
  }
}

function validateMobile(type) {}

/*----------------------------------------------
  EXISTING USER LOGIN
----------------------------------------------*/
function loginUser() {
  let name = document.getElementById("existing_name").value.trim();
  if (!name) { alert("Please enter Name"); return; }
  localStorage.setItem("customerName", name);
  window.location.href = "search.html";
}

/*----------------------------------------------
  NEW USER REGISTRATION (NO FETCH)
  Uses hidden HTML form → never sends OPTIONS
----------------------------------------------*/
async function registerUser() {

  let duplicateBox = document.getElementById("duplicateMsg");
  duplicateBox.style.display = "none";

  let name = document.getElementById("new_name").value.trim();
  let email = document.getElementById("email").value.trim();
  let city = document.getElementById("new_city").value.trim();
  let country = document.getElementById("new_country").value.trim();
  let code = document.getElementById("new_countryCode").value.trim();
  let phone = document.getElementById("new_phone").value.trim();

  if (!name || !phone) {
    alert("Please enter Name and Mobile Number");
    return;
  }

  let fullPhone = code ? `${code} ${phone}` : phone;

  /*----------------------------------------------
    CREATE HIDDEN FORM (NO CORS, NO PREFLIGHT)
  ----------------------------------------------*/
  let form = document.createElement("form");
  form.method = "POST";
  form.action = "https://script.google.com/macros/s/AKfycbyrrJJoNaJSlJenxMEiTNPQCSs-d9BuuOEh_r7QjryYEVTx5TeP0HE8Ty8f22lWRf9h/exec";

  let addField = (name, value) => {
    let input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  addField("action", "registerCustomer");
  addField("name", name);
  addField("email", email);
  addField("mobile", fullPhone);
  addField("city", city);
  addField("country", country);

  document.body.appendChild(form);

  /*----------------------------------------------
    SUBMIT FORM
    → Browser sends POST directly (no OPTIONS)
  ----------------------------------------------*/
  form.submit();
}

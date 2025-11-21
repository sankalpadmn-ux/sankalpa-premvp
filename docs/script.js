/***********************************************
 * SANKALPA – script.js (Form-Encoded Version)
 * NO JSON, NO CORS ISSUES
 ***********************************************/

const API_URL =
  "https://script.google.com/macros/s/AKfycbyrrJJoNaJSlJenxMEiTNPQCSs-d9BuuOEh_r7QjryYEVTx5TeP0HE8Ty8f22lWRf9h/exec";

/*---------------------------------------------------
  HOME NAVIGATION
---------------------------------------------------*/
function goHome() {
  window.location.href = "index.html";
}

/*---------------------------------------------------
  TOGGLE SECTIONS
---------------------------------------------------*/
function showExisting() {
  hideDuplicate();
  document.getElementById("existingSection").style.display = "block";
  document.getElementById("newSection").style.display = "none";
}

function showNew() {
  hideDuplicate();
  document.getElementById("existingSection").style.display = "none";
  document.getElementById("newSection").style.display = "block";
}

function hideDuplicate() {
  const box = document.getElementById("duplicateMsg");
  if (box) box.style.display = "none";
}

/*---------------------------------------------------
  COUNTRY CODE AUTO-FILL
---------------------------------------------------*/
function handleCountryChange(type) {
  const selectEl = document.getElementById(type + "_country");
  const codeEl = document.getElementById(type + "_countryCode");

  const selectedOption = selectEl.options[selectEl.selectedIndex];
  const dialCode = selectedOption.getAttribute("data-code");

  codeEl.value = dialCode ? dialCode : "";
}

/*---------------------------------------------------
  FORM ENCODING HELPER
---------------------------------------------------*/
function encodeForm(data) {
  return Object.keys(data)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
    )
    .join("&");
}

/*---------------------------------------------------
  EXISTING USER LOGIN
---------------------------------------------------*/
async function loginUser() {
  hideDuplicate();

  const name = document.getElementById("existing_name").value.trim();
  const country = document.getElementById("existing_country").value.trim();
  const code = document.getElementById("existing_countryCode").value.trim();
  const phone = document.getElementById("existing_phone").value.trim();

  if (!name || !country || !phone) {
    showDuplicate("Please fill all fields.");
    return;
  }

  const fullPhone = code + phone;

  const body = encodeForm({
    action: "registerCustomer",
    name: name,
    country: country,
    mobile: fullPhone,
    city: "",
    email: ""
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body
    });

    const data = await response.json();

    if (data.status === "duplicate") {
      showDuplicate(`Welcome back, ${data.name}. Redirecting…`);
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(data.name);
      }, 1500);
    } else if (data.status === "success") {
      showDuplicate(`Welcome, ${name}. Redirecting…`);
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(name);
      }, 1500);
    } else {
      showDuplicate("User not found. Please register.");
    }
  } catch (err) {
    showDuplicate("Network issue. Please refresh and try again.");
  }
}

/*---------------------------------------------------
  NEW USER REGISTRATION
---------------------------------------------------*/
async function registerUser() {
  hideDuplicate();

  const name = document.getElementById("new_name").value.trim();
  const country = document.getElementById("new_country").value.trim();
  const code = document.getElementById("new_countryCode").value.trim();
  const phone = document.getElementById("new_phone").value.trim();
  const city = document.getElementById("new_city").value.trim();

  if (!name || !country

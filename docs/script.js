/***********************************************
 * SANKALPA – script.js (Final Stable Version)
 * Form-encoded POST → ALWAYS WORKS with Apps Script
 * No JSON, No CORS, No caching issues
 ***********************************************/

const API_URL =
  "https://script.google.com/macros/s/AKfycbzbNeL0HERxq-Q2mXchTEL3iWCM9PYBJFHTor9ViUjzKRyu3EGqqHJXiTyXXbBgt7IQ/exec";

/*---------------------------------------------------
  NAVIGATION
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
  COUNTRY CODE HANDLER
---------------------------------------------------*/
function handleCountryChange(type) {
  const selectEl = document.getElementById(type + "_country");
  const codeEl = document.getElementById(type + "_countryCode");

  const selectedOption = selectEl.options[selectEl.selectedIndex];
  const dialCode = selectedOption.getAttribute("data-code");

  codeEl.value = dialCode ? dialCode : "";
}

/*---------------------------------------------------
  FORM ENCODING – Apps Script Compatible
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

  if (!name || !country || !phone || !city) {
    showDuplicate("Please fill all fields.");
    return;
  }

  const fullPhone = code + phone;

  const body = encodeForm({
    action: "registerCustomer",
    name: name,
    country: country,
    mobile: fullPhone,
    city: city,
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
      showDuplicate(
        `This mobile number is already registered. Welcome back, ${data.name}.`
      );
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(data.name);
      }, 1500);
    } else if (data.status === "success") {
      showDuplicate("Registration successful! Redirecting…");
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(name);
      }, 1500);
    } else {
      showDuplicate("Unexpected error during registration.");
    }
  } catch (err) {
    showDuplicate("Network issue. Please refresh and try again.");
  }
}

/*---------------------------------------------------
  DUPLICATE / INFO BOX
---------------------------------------------------*/
function showDuplicate(msg) {
  const box = document.getElementById("duplicateMsg");
  if (box) {
    box.textContent = msg;
    box.style.display = "block";
  }
}

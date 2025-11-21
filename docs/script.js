/***********************************************
 * SANKALPA – script.js (JSON Compatible Final)
 ***********************************************/

const API_URL =
  "https://script.google.com/macros/s/AKfycbyrrJJoNaJSlJenxMEiTNPQCSs-d9BuuOEh_r7QjryYEVTx5TeP0HE8Ty8f22lWRf9h/exec";

/*---------------------------------------------------
  PREVENT DEFAULT FORM SUBMIT (Important)
---------------------------------------------------*/
document.addEventListener("submit", (e) => e.preventDefault());

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
  EXISTING USER LOGIN (Option 1)
  - Uses registerCustomer
  - Backend duplicate = login
---------------------------------------------------*/
async function loginUser() {
  hideDuplicate();

  const name = document.getElementById("existing_name").value.trim();
  const country = document.getElementById("existing_country").value.trim();
  const countryCode = document.getElementById("existing_countryCode").value.trim();
  const phone = document.getElementById("existing_phone").value.trim();

  if (!name || !country || !phone) {
    showDuplicate("Please fill all fields.");
    return;
  }

  const fullPhone = countryCode + phone;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "registerCustomer",
        name: name,
        country: country,
        mobile: fullPhone,
        city: "",
        email: ""
      })
    });

    const data = await response.json();

    if (data.status === "duplicate") {
      showDuplicate(`Welcome back, ${data.name}. Redirecting…`);
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(data.name);
      }, 1500);
    }

    else if (data.status === "success") {
      // Rare situation: user not found but backend created new
      showDuplicate(`Welcome, ${name}. Redirecting…`);
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(name);
      }, 1500);
    }

    else {
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
  const countryCode = document.getElementById("new_countryCode").value.trim();
  const phone = document.getElementById("new_phone").value.trim();
  const city = document.getElementById("new_city").value.trim();
  const email = ""; // email not taken on UI

  if (!name || !country || !phone || !city) {
    showDuplicate("Please fill all fields.");
    return;
  }

  const fullPhone = countryCode + phone;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "registerCustomer",
        name: name,
        country: country,
        mobile: fullPhone,
        city: city,
        email: email
      })
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
    }

    else if (data.status === "success") {
      showDuplicate("Registration successful! Redirecting…");
      setTimeout(() => {
        window.location.href =
          "search.html?name=" + encodeURIComponent(name);
      }, 1500);
    }

    else {
      showDuplicate("Unexpected error during registration.");
    }

  } catch (err) {
    showDuplicate("Network issue. Please refresh and try again.");
  }
}

/*---------------------------------------------------
  DUPLICATE / MESSAGE BOX
---------------------------------------------------*/
function showDuplicate(msg) {
  const box = document.getElementById("duplicateMsg");
  if (box) {
    box.textContent = msg;
    box.style.display = "block";
  }
}

/***********************************************
 * SANKALPA – script.js
 * Handles:
 *  - Existing / New User toggle
 *  - Country selection & WhatsApp validation
 *  - Registration + Duplicate logic
 *  - Existing User login
 ***********************************************/


/*---------------------------------------------------------
  GO HOME
---------------------------------------------------------*/
function goHome() {
  window.location.href = "index.html";
}


/*---------------------------------------------------------
  TOGGLE SECTIONS
---------------------------------------------------------*/
function showExisting() {
  document.getElementById("existingSection").style.display = "block";
  document.getElementById("newSection").style.display = "none";
}

function showNew() {
  document.getElementById("existingSection").style.display = "none";
  document.getElementById("newSection").style.display = "block";
}


/*---------------------------------------------------------
  COUNTRY RULES (WhatsApp Validation)
---------------------------------------------------------*/
const rules = {
  "India":          { code: "+91",  len: 10 },
  "United States":  { code: "+1",   len: 10 },
  "United Kingdom": { code: "+44",  len: 10 },
  "Singapore":      { code: "+65",  len: 8  },
  "UAE":            { code: "+971", len: 9  },
  "Australia":      { code: "+61",  len: 9  },
  "Canada":         { code: "+1",   len: 10 }
};


/*---------------------------------------------------------
  HANDLE COUNTRY SELECTION
---------------------------------------------------------*/
function handleCountryChange(type) {

  let sel  = document.getElementById(type + "_country");
  let code = document.getElementById(type + "_countryCode");
  let other = document.getElementById(type + "_otherCountryBox");

  if (sel.value === "Others") {
    other.classList.remove("hidden");
    code.value = "";
  } else {
    other.classList.add("hidden");
    code.value = sel.options[sel.selectedIndex].dataset.code || "";
  }

  validateMobile(type);
}


/*---------------------------------------------------------
  MOBILE VALIDATION (WhatsApp Format)
---------------------------------------------------------*/
function validateMobile(type) {

  let country = document.getElementById(type + "_country").value;
  let phone   = document.getElementById(type + "_phone").value.trim();
  let err     = document.getElementById(type + "_error");
  let ok      = document.getElementById(type + "_valid");

  err.classList.add("hidden");
  ok.classList.add("hidden");

  if (!country || phone === "") return;

  if (country !== "Others") {
    let r = rules[country];

    if (isNaN(phone) || phone.length !== r.len) {
      err.textContent = `Invalid number for ${country}. Expected ${r.len} digits.`;
      err.classList.remove("hidden");
      return;
    }

    ok.classList.remove("hidden");
  } 
  else {
    if (isNaN(phone)) {
      err.textContent = "Digits only.";
      err.classList.remove("hidden");
    } else {
      ok.classList.remove("hidden");
    }
  }
}


/*---------------------------------------------------------
  EXISTING USER LOGIN
---------------------------------------------------------*/
async function loginUser() {

  let name = document.getElementById("existing_name").value.trim();
  let countryCode = document.getElementById("existing_countryCode").value.trim();
  let phone = document.getElementById("existing_phone").value.trim();

  if (name === "" || phone === "") {
    alert("Please enter Name and Mobile Number");
    return;
  }

  let fullPhone = countryCode + " " + phone;

  localStorage.setItem("customerName", name);

  window.location.href = "search.html";
}



/*---------------------------------------------------------
  NEW USER REGISTRATION
---------------------------------------------------------*/
async function registerUser() {

  // Hide duplicate message box
  let duplicateBox = document.getElementById("duplicateMsg");
  duplicateBox.style.display = "none";

  let name       = document.getElementById("new_name").value.trim();
  let email      = document.getElementById("email").value.trim();
  let city       = document.getElementById("new_city").value.trim();
  let country    = document.getElementById("new_country").value.trim();
  let countryCode= document.getElementById("new_countryCode").value.trim();
  let phone      = document.getElementById("new_phone").value.trim();

  if (!name || !phone) {
    alert("Please enter Name and Mobile Number");
    return;
  }

  // Full WhatsApp number saved to backend
  let fullPhone = countryCode ? (countryCode + " " + phone) : phone;

  // ---------------------------------------------------------
  // Correct JSON payload including action
  // ---------------------------------------------------------
  let payload = {
    action: "registerCustomer",
    name: name,
    email: email,
    mobile: fullPhone,
    city: city,
    country: country
  };

  try {
    let response = await fetch(
      "https://script.google.com/macros/s/AKfycbyrrJJoNaJSlJenxMEiTNPQCSs-d9BuuOEh_r7QjryYEVTx5TeP0HE8Ty8f22lWRf9h/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    let result = await response.json();

    /*---------------------------------------------------
      DUPLICATE CUSTOMER (Soft UI Message)
    ---------------------------------------------------*/
    if (result.status === "duplicate") {

      duplicateBox.innerHTML =
        "<b>This mobile number is already registered.</b><br>" +
        "Welcome back, " + (result.name || "Devotee") + ".";

      duplicateBox.style.display = "block";
      return;
    }

    /*---------------------------------------------------
      SUCCESSFUL NEW REGISTRATION
    ---------------------------------------------------*/
    if (result.status === "success") {

      localStorage.setItem("customerName", name);

      alert("Registration successful!");
      window.location.href = "search.html";
      return;
    }

    /*---------------------------------------------------
      BACKEND ERROR MESSAGE
    ---------------------------------------------------*/
    alert("Error: " + result.message);

  } catch (err) {
    alert("Unable to connect to server.");
    console.error(err);
  }
}

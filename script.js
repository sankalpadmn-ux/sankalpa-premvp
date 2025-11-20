/***********************************************
 * SANKALPA – script.js (FINAL MATCHED VERSION)
 ***********************************************/

function goHome() {
  window.location.href = "index.html";
}

/*-------------------------------------------
  TOGGLE SCREENS
-------------------------------------------*/
function showExisting() {
  document.getElementById("duplicateMsg").style.display = "none";
  document.getElementById("existingSection").style.display = "block";
  document.getElementById("newSection").style.display = "none";
}

function showNew() {
  document.getElementById("duplicateMsg").style.display = "none";
  document.getElementById("existingSection").style.display = "none";
  document.getElementById("newSection").style.display = "block";
}

/*-------------------------------------------
  COUNTRY RULES
-------------------------------------------*/
const rules = {
  "India": { code: "+91", len: 10 },
  "United States": { code: "+1", len: 10 },
  "United Kingdom": { code: "+44", len: 10 },
  "Singapore": { code: "+65", len: 8 },
  "UAE": { code: "+971", len: 9 },
  "Australia": { code: "+61", len: 9 },
  "Canada": { code: "+1", len: 10 }
};

/*-------------------------------------------
  SET COUNTRY CODE FOR EXISTING + NEW USERS
-------------------------------------------*/
function handleCountryChange(type) {
  let sel = document.getElementById(type + "_country");
  let code = document.getElementById(type + "_countryCode");

  let selected = sel.options[sel.selectedIndex];
  code.value = selected.dataset.code || "";
}

/*-------------------------------------------
  EXISTING USER LOGIN
-------------------------------------------*/
function loginUser() {

  let name = document.getElementById("existing_name").value.trim();
  let code = document.getElementById("existing_countryCode").value.trim();
  let phone = document.getElementById("existing_phone").value.trim();

  if (!name || !phone) {
    alert("Please enter Name and Mobile Number");
    return;
  }

  localStorage.setItem("customerName", name);
  window.location.href = "search.html";
}

/*-------------------------------------------
  NEW USER REGISTRATION
-------------------------------------------*/
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

  // URL-encoded request (CORS-safe)
  let formData = new URLSearchParams();
  formData.append("action", "registerCustomer");
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile", fullPhone);
  formData.append("city", city);
  formData.append("country", country);

  try {
    let response = await fetch(
      "https://script.google.com/macros/s/AKfycbyrrJJoNaJSlJenxMEiTNPQCSs-d9BuuOEh_r7QjryYEVTx5TeP0HE8Ty8f22lWRf9h/exec",
      {
        method: "POST",
        body: formData
      }
    );

    let result = await response.json();

    /*-------------------------------------------
      DUPLICATE CUSTOMER
    -------------------------------------------*/
    if (result.status === "duplicate") {

      duplicateBox.innerHTML =
        `<b>This mobile number is already registered.</b><br>
         Welcome back, ${result.name}. Redirecting…`;

      duplicateBox.style.display = "block";

      setTimeout(() => {
        localStorage.setItem("customerName", result.name);
        window.location.href = "search.html";
      }, 2000);

      return;
    }

    /*-------------------------------------------
      SUCCESSFUL NEW REGISTRATION
    -------------------------------------------*/
    if (result.status === "success") {

      localStorage.setItem("customerName", name);
      window.location.href = "search.html";
      return;
    }

    /*-------------------------------------------
      OTHER ERRORS
    -------------------------------------------*/
    alert(result.message);

  } catch (err) {
    alert("Unable to connect to server.");
    console.error(err);
  }
}

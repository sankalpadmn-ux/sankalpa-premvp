/***********************************************
 * SANKALPA – script.js (Duplicate Message + Auto Redirect)
 ***********************************************/

function goHome() { window.location.href = "index.html"; }

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
      { method: "POST", body: formData }
    );

    let result = await response.json();

    // ---------------------------
    // DUPLICATE USER HANDLING
    // ---------------------------
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

    // ---------------------------
    // SUCCESSFUL REGISTRATION
    // ---------------------------
    if (result.status === "success") {
      localStorage.setItem("customerName", name);
      window.location.href = "search.html";
      return;
    }

    alert(result.message);

  } catch (err) {
    alert("Unable to connect to server.");
    console.error(err);
  }
}

function loginUser() {
  let name = document.getElementById("existing_name").value.trim();
  if (!name) { alert("Please enter Name"); return; }
  localStorage.setItem("customerName", name);
  window.location.href = "search.html";
}

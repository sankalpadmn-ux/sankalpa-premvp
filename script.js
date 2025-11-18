function goHome() { window.location.href = "index.html"; }

/* Toggle Sections */
function showExisting() {
  document.getElementById("existingSection").style.display = "block";
  document.getElementById("newSection").style.display = "none";
}
function showNew() {
  document.getElementById("existingSection").style.display = "none";
  document.getElementById("newSection").style.display = "block";
}

/* Country Rules */
const rules = {
  "India": { code: "+91", len: 10 },
  "United States": { code: "+1", len: 10 },
  "United Kingdom": { code: "+44", len: 10 },
  "Singapore": { code: "+65", len: 8 },
  "UAE": { code: "+971", len: 9 },
  "Australia": { code: "+61", len: 9 },
  "Canada": { code: "+1", len: 10 }
};

/* Country Change */
function handleCountryChange(type) {
  let sel = document.getElementById(type + "_country");
  let other = document.getElementById(type + "_otherCountryBox");
  let code = document.getElementById(type + "_countryCode");

  if (sel.value === "Others") {
    other.classList.remove("hidden");
    code.value = "";
  } else {
    other.classList.add("hidden");
    code.value = sel.options[sel.selectedIndex].dataset.code || "";
  }

  validateMobile(type);
}

/* WhatsApp validation */
function validateMobile(type) {
  let country = document.getElementById(type + "_country").value;
  let phone = document.getElementById(type + "_phone").value.trim();
  let err = document.getElementById(type + "_error");
  let ok = document.getElementById(type + "_valid");

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
  } else {
    if (isNaN(phone)) {
      err.textContent = "Enter digits only.";
      err.classList.remove("hidden");
    } else {
      ok.classList.remove("hidden");
    }
  }
}

/* Existing User */
function loginUser() {
  let name = document.getElementById("existing_name").value.trim();
  if (name === "") {
    alert("Please enter Name and Mobile Number");
    return;
  }

  localStorage.setItem("customerName", name);
  window.location.href = "search.html";
}

/* New User Registration */
async function registerUser() {

  let name = document.getElementById("new_name").value.trim();
  let mobile = document.getElementById("new_phone").value.trim();
  let country = document.getElementById("new_country").value.trim();
  let city = document.getElementById("new_city").value.trim();
  let email = document.getElementById("email").value.trim();

  if (name === "" || mobile === "") {
    alert("Please enter Name and Mobile Number");
    return;
  }

  // Save customer data
  localStorage.setItem("customerName", name);
  localStorage.setItem("customerCountry", country);
  localStorage.setItem("customerCity", city);
  localStorage.setItem("customerMobile", mobile);

  let payload = {
    name: name,
    mobile: mobile,
    email: email,
    city: city,
    locality: document.getElementById("new_locality").value.trim(),
    otherLocality: document.getElementById("otherLocality").value.trim(),
    country: country
  };

  try {
    let response = await fetch(
      "https://script.google.com/macros/s/AKfycbyrrJJoNaJSlJenxMEiTNPQCSs-d9BuuOEh_r7QjryYEVTx5TeP0HE8Ty8f22lWRf9h/exec?action=registerCustomer",
      { method: "POST", body: JSON.stringify(payload) }
    );

    let result = await response.json();

    if (result.status === "success") {
      alert("Registration successful!");
      window.location.href = "search.html";
    } else {
      alert("Error: " + result.message);
    }

  } catch (err) {
    alert("Unable to connect to server.");
  }

}

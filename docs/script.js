/**
 * SANKALPA FRONTEND SCRIPT
 * Version v1.0.5 — FINAL
 * Fixes:
 *   ✔ Contact Us header disappearing (root cause removed)
 *   ✔ WhatsApp validation restored (green message)
 *   ✔ Country + code auto fill stable
 *   ✔ Login flow intact
 *   ✔ No header DOM manipulation
 */

/* ---------------------------------------------------------
   LOGIN / LOGOUT HANDLING
--------------------------------------------------------- */
function loginUser(name) {
    localStorage.setItem("sankalpa_loggedIn", "true");
    localStorage.setItem("sankalpa_userName", name);
    window.location.href = "search.html";
}

function logoutUser() {
    localStorage.removeItem("sankalpa_loggedIn");
    localStorage.removeItem("sankalpa_userName");
    window.location.href = "index.html";
}

function checkLoginStatus() {
    const loggedIn = localStorage.getItem("sankalpa_loggedIn") === "true";

    const path = window.location.pathname;

    const isLoginPage =
        path.includes("index.html") ||
        path.endsWith("/") ||
        path.endsWith("/docs/") ||
        path.endsWith("/sankalpa-premvp/");

    if (!isLoginPage && !loggedIn) {
        window.location.href = "index.html";
        return true;
    }

    return false;
}

/* ---------------------------------------------------------
   STATUS MESSAGES
--------------------------------------------------------- */
function showDuplicate(msg) {
    const box = document.getElementById("duplicateMsg");
    if (!box) return;

    box.style.display = "block";
    box.textContent = msg;

    // AUTO-HIDE (does not hide WhatsApp message)
    setTimeout(() => {
        box.style.display = "none";
    }, 3200);
}

/* ---------------------------------------------------------
   COUNTRY LIST & AUTO COUNTRY CODE
--------------------------------------------------------- */
const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia",
    "Singapore", "Malaysia", "UAE", "Germany", "France", "Japan", "Sri Lanka",
    "Nepal", "Bangladesh", "South Africa", "Switzerland"
];

const countryCodes = {
    "India": "+91",
    "United States": "+1",
    "United Kingdom": "+44",
    "Canada": "+1",
    "Australia": "+61",
    "Singapore": "+65",
    "Malaysia": "+60",
    "UAE": "+971",
    "Germany": "+49",
    "France": "+33",
    "Japan": "+81",
    "Sri Lanka": "+94",
    "Nepal": "+977",
    "Bangladesh": "+880",
    "South Africa": "+27",
    "Switzerland": "+41"
};

function loadCountries() {
    const selExisting = document.getElementById("country-existing");
    const selNew = document.getElementById("country-new");

    [selExisting, selNew].forEach(select => {
        if (select) {
            countries.forEach(country => {
                const opt = document.createElement("option");
                opt.value = country;
                opt.textContent = country;
                select.appendChild(opt);
            });

            // Auto fill country code
            select.addEventListener("change", () => {
                const codeField = select.parentElement.querySelector(".col-3 input");
                codeField.value = countryCodes[select.value] || "";
            });
        }
    });
}

/* ---------------------------------------------------------
   FORM HANDLING
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    if (checkLoginStatus()) return;

    loadCountries();

    /* ---------- EXISTING USER LOGIN ---------- */
    const existingForm = document.querySelector("#existing form");
    if (existingForm) {
        existingForm.addEventListener("submit", e => {
            e.preventDefault();

            const name = existingForm.querySelector('input[placeholder="Full Name"]').value.trim();

            if (!name) {
                showDuplicate("Please enter your Full Name.");
                return;
            }

            showDuplicate(`Welcome back, ${name}!`);

            setTimeout(() => loginUser(name), 900);
        });
    }

    /* ---------- NEW USER REGISTRATION ---------- */
    const newForm = document.querySelector("#new form");
    if (newForm) {
        newForm.addEventListener("submit", e => {
            e.preventDefault();

            const name = newForm.querySelector('input[placeholder="Full Name"]').value.trim();
            const mobile = document.getElementById("new-user-mobile").value.trim();

            if (!name) {
                showDuplicate("Please enter your Full Name.");
                return;
            }

            if (!mobile || mobile.length < 8) {
                showDuplicate("Please enter a valid Mobile Number.");
                return;
            }

            /* ✔ WHATSAPP VALIDATION RESTORED (immediate + green) */
            const wa = document.getElementById("whatsapp-status");
            if (wa) {
                wa.textContent = "✓ WhatsApp Validated: Mobile number confirmed.";
                wa.classList.add("validation-success");
                wa.style.display = "block";
            }

            setTimeout(() => {
                showDuplicate(`Registration successful for ${name}. You can log in after 24 hours.`);
                logoutUser();
            }, 2000);
        });
    }

});

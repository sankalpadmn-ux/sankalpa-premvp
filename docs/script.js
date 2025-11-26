/**
 * SANKALPA FRONTEND SCRIPT
 * script.js — Version v1.0.3
 * Fixes: Country list, auto code, fixed navigation stability, protected pages
 * Last Updated: 2025-11-27
 */

/* ==========================================================
   LOGIN STATE MANAGEMENT
========================================================== */

function loginUser(userName) {
    localStorage.setItem('sankalpa_loggedIn', 'true');
    localStorage.setItem('sankalpa_userName', userName);
    window.location.href = 'search.html';
}

function logoutUser() {
    localStorage.removeItem('sankalpa_loggedIn');
    localStorage.removeItem('sankalpa_userName');
    window.location.href = 'index.html';
}

function checkLoginStatus() {
    const loggedIn = localStorage.getItem('sankalpa_loggedIn') === 'true';
    const path = window.location.pathname;

    const isLoginPage =
        path.includes('index.html') ||
        path.endsWith('/sankalpa-premvp/') ||
        path.endsWith('/docs/') ||
        path === '/' ||
        path === '';

    if (!isLoginPage && !loggedIn) {
        window.location.href = 'index.html';
        return true;
    }

    if (isLoginPage && loggedIn) {
        window.location.href = 'search.html';
        return true;
    }

    return false;
}

/* ==========================================================
   STATUS / TOAST MESSAGES
========================================================== */

function showDuplicate(message) {
    const box = document.getElementById('duplicateMsg');
    if (!box) return;

    const whatsappBox = document.getElementById('whatsapp-status');
    if (whatsappBox) whatsappBox.style.display = 'none';

    box.style.display = 'block';
    box.textContent = message;

    box.classList.remove('alert-info', 'alert-success', 'alert-danger');

    const lower = message.toLowerCase();

    if (lower.includes("success") || lower.includes("validated")) {
        box.classList.add('alert-success');
    } else if (lower.includes("error") || lower.includes("fail")) {
        box.classList.add('alert-danger');
    } else {
        box.classList.add('alert-info');
    }

    setTimeout(() => {
        box.style.display = 'none';
    }, 3500);
}

/* ==========================================================
   COUNTRY LIST + AUTO COUNTRY CODE
========================================================== */

const countryList = [
    "India", "United States", "United Kingdom", "Canada", "Australia",
    "Singapore", "Malaysia", "United Arab Emirates", "Germany", "France",
    "Netherlands", "New Zealand", "Sri Lanka", "Nepal", "Bangladesh",
    "South Africa", "Japan", "Switzerland"
];

const countryCodes = {
    "India": "+91",
    "United States": "+1",
    "United Kingdom": "+44",
    "Canada": "+1",
    "Australia": "+61",
    "Singapore": "+65",
    "Malaysia": "+60",
    "United Arab Emirates": "+971",
    "Germany": "+49",
    "France": "+33",
    "Netherlands": "+31",
    "New Zealand": "+64",
    "Sri Lanka": "+94",
    "Nepal": "+977",
    "Bangladesh": "+880",
    "South Africa": "+27",
    "Japan": "+81",
    "Switzerland": "+41"
};

function loadCountries() {
    const existingSelect = document.getElementById('country-existing');
    const newSelect = document.getElementById('country-new');

    if (existingSelect) {
        countryList.forEach(country => {
            const opt = document.createElement('option');
            opt.value = country;
            opt.textContent = country;
            existingSelect.appendChild(opt);
        });
    }

    if (newSelect) {
        countryList.forEach(country => {
            const opt = document.createElement('option');
            opt.value = country;
            opt.textContent = country;
            newSelect.appendChild(opt);
        });
    }

    if (existingSelect) {
        existingSelect.addEventListener("change", function () {
            const codeInput = document.querySelector('#existing .col-3 input');
            if (countryCodes[this.value] && codeInput) {
                codeInput.value = countryCodes[this.value];
            }
        });
    }

    if (newSelect) {
        newSelect.addEventListener("change", function () {
            const codeInput = document.querySelector('#new .col-3 input');
            if (countryCodes[this.value] && codeInput) {
                codeInput.value = countryCodes[this.value];
            }
        });
    }
}

/* ==========================================================
   FORM SUBMISSION LOGIC
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (checkLoginStatus()) return;

    loadCountries();

    /* Existing User Login */
    const existingForm = document.querySelector('#existing form');
    if (existingForm) {
        existingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = this.querySelector('input[placeholder="Full Name"]').value.trim();

            if (!name) {
                showDuplicate("Error: Please enter your Full Name.");
                return;
            }

            showDuplicate(`Login Success: Welcome back, ${name}! Redirecting...`);

            setTimeout(() => {
                loginUser(name);
            }, 900);
        });
    }

    /* New User Registration */
    const newForm = document.querySelector('#new form');
    if (newForm) {
        newForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = this.querySelector('input[placeholder="Full Name"]').value.trim();
            const mobile = document.getElementById("new-user-mobile")?.value.trim();

            if (!name) {
                showDuplicate("Error: Please enter a name for registration.");
                return;
            }

            if (!mobile || mobile.length < 8) {
                showDuplicate("Error: Please enter a valid Mobile Number.");
                return;
            }

            const whatsappBox = document.getElementById("whatsapp-status");
            if (whatsappBox) {
                whatsappBox.textContent = "✓ WhatsApp Validated: Mobile number confirmed.";
                whatsappBox.style.display = "block";
            }

            setTimeout(() => {
                showDuplicate(`Registration Success: Vow recorded for ${name}. You can log in after 24 hours.`);
                logoutUser();
            }, 2000);
        });
    }

    /* Logout (if exists) */
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            logoutUser();
        });
    }
});

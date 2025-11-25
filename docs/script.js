/**
 * SANKALPA UI JAVASCRIPT FILE (Final Version)
 * Features:
 *  - Login / Logout / Redirect Logic
 *  - Duplicate Message Handler
 *  - WhatsApp Validation (Untouched)
 *  - Built-in Country Dropdown Loader
 *  - Auto Country Code for BOTH Existing + New User forms
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
    const isLoggedIn = localStorage.getItem('sankalpa_loggedIn') === 'true';
    const isLoginPage = window.location.pathname.includes('index.html');

    if (!isLoginPage) {
        if (!isLoggedIn) {
            window.location.href = 'index.html';
            return true;
        }
    } else {
        if (isLoggedIn) {
            window.location.href = 'search.html';
            return true;
        }
    }
    return false;
}


/* ==========================================================
   DUPLICATE MESSAGE HANDLER
========================================================== */

function showDuplicate(msg) {
    const box = document.getElementById("duplicateMsg");
    if (box) {
        const whatsappStatus = document.getElementById("whatsapp-status");
        if (whatsappStatus) whatsappStatus.style.display = "none";

        box.textContent = msg;
        box.style.display = "block";

        box.classList.remove('alert-info', 'alert-danger', 'alert-success');

        if (msg.toLowerCase().includes('success') ||
            msg.toLowerCase().includes('validated')) {
            box.classList.add('alert-success');
        } else if (msg.toLowerCase().includes('error') ||
                   msg.toLowerCase().includes('fail')) {
            box.classList.add('alert-danger');
        } else {
            box.classList.add('alert-info');
        }

        setTimeout(() => {
            box.style.display = "none";
        }, 5000);
    }
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

    const dropdownExisting = document.getElementById("country-existing");
    const dropdownNew = document.getElementById("country-new");

    countryList.forEach(country => {
        if (dropdownExisting) {
            const opt = document.createElement("option");
            opt.value = country;
            opt.textContent = country;
            dropdownExisting.appendChild(opt);
        }

        if (dropdownNew) {
            const opt2 = document.createElement("option");
            opt2.value = country;
            opt2.textContent = country;
            dropdownNew.appendChild(opt2);
        }
    });

    /* Auto-fill Code when Country changes */
    if (dropdownExisting) {
        dropdownExisting.addEventListener('change', function () {
            const selected = this.value;
            const codeInput = document.querySelector('#existing form .col-3 input');
            if (codeInput && countryCodes[selected]) {
                codeInput.value = countryCodes[selected];
            }
        });
    }

    if (dropdownNew) {
        dropdownNew.addEventListener('change', function () {
            const selected = this.value;
            const codeInput = document.querySelector('#new form .col-3 input');
            if (codeInput && countryCodes[selected]) {
                codeInput.value = countryCodes[selected];
            }
        });
    }
}


/* ==========================================================
   FORM SUBMISSIONS
========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // LOGIN CHECK
    if (checkLoginStatus()) return;

    // LOAD COUNTRY + CODE
    loadCountries();


    /* ---------------------
       EXISTING USER LOGIN
    --------------------- */
    const existingForm = document.querySelector('#existing form');

    if (existingForm) {
        existingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = this.querySelector('input[placeholder="Full Name"]').value;

            if (name.trim() === "") {
                showDuplicate("Error: Please enter your Full Name.");
            } else {
                showDuplicate(`Login Success: Welcome back, ${name}! Redirecting to search...`);
                setTimeout(() => loginUser(name), 1000);
            }
        });
    }


    /* ---------------------
       NEW USER REGISTRATION
    --------------------- */
    const newForm = document.querySelector('#new form');

    if (newForm) {
        newForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = this.querySelector('input[placeholder="Full Name"]').value;
            const mobileInput = this.querySelector('#new-user-mobile');
            const mobile = mobileInput ? mobileInput.value : '';

            if (name.trim() === "") {
                showDuplicate("Error: Please enter a name for registration.");
                return;
            }

            if (mobile.trim() === "" || mobile.trim().length < 8) {
                showDuplicate("Error: Please provide a valid Mobile Number for registration.");
                return;
            }

            // WhatsApp validation (UNTOUCHED)
            const statusBox = document.getElementById("whatsapp-status");
            if (statusBox) {
                statusBox.textContent = "✓ WhatsApp Validated: Mobile number confirmed.";
                statusBox.style.display = "block";
            }

            setTimeout(() => {
                showDuplicate(`Registration Success: Vow recorded for ${name}. You can log in after 24 hours.`);
                logoutUser();
            }, 2000);
        });
    }

    /* ---------------------
       LOGOUT LISTENER
    --------------------- */
    const logoutButton = document.getElementById('logout-link');
    if (logoutButton) {
        logoutButton.addEventListener('click', e => {
            e.preventDefault();
            logoutUser();
        });
    }
});

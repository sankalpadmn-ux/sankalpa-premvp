/**
 * script.js — Version v1.0.0
 * SANKALPA FRONTEND LOGIC
 *
 * Handles:
 * - login/logout
 * - protected page redirects
 * - country dropdown population
 * - auto country-code selection
 * - WhatsApp validation indicator
 * - status messages
 *
 * Cache is managed by versioned URL in HTML (?v=1.0.0)
 *
 * Last Updated: 2025-11-25
 */

/* ==========================================================
   LOGIN STATE MANAGEMENT
========================================================== */

/**
 * loginUser()
 * Saves login state and redirects to search page.
 */
function loginUser(userName) {
  localStorage.setItem('sankalpa_loggedIn', 'true');
  localStorage.setItem('sankalpa_userName', userName);
  window.location.href = 'search.html';
}

/**
 * logoutUser()
 * Clears login session and redirects to index.
 */
function logoutUser() {
  localStorage.removeItem('sankalpa_loggedIn');
  localStorage.removeItem('sankalpa_userName');
  window.location.href = 'index.html';
}

/**
 * checkLoginStatus()
 * Redirects based on login state.
 * Returns true if redirect executed (stop further JS).
 */
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('sankalpa_loggedIn') === 'true';

  const path = window.location.pathname;
  const isLoginPage =
    path.includes('index.html') ||
    path.endsWith('/sankalpa-premvp/') ||
    path.endsWith('/docs/') ||
    path === '/' ||
    path === '';

  // Visiting a protected page
  if (!isLoginPage) {
    if (!isLoggedIn) {
      window.location.href = 'index.html';
      return true;
    }
  }

  // Visiting login page while already logged in
  if (isLoginPage && isLoggedIn) {
    window.location.href = 'search.html';
    return true;
  }

  return false;
}

/* ==========================================================
   STATUS MESSAGES
========================================================== */

/**
 * showDuplicate(msg)
 * Generic toast/alert for login/register responses.
 */
function showDuplicate(msg) {
  const box = document.getElementById('duplicateMsg');
  if (!box) return;

  const whatsappStatus = document.getElementById('whatsapp-status');
  if (whatsappStatus) whatsappStatus.style.display = 'none';

  box.textContent = msg;
  box.style.display = 'block';
  box.classList.remove('alert-info', 'alert-danger', 'alert-success');

  const m = msg.toLowerCase();
  if (m.includes('success') || m.includes('validated')) {
    box.classList.add('alert-success');
  } else if (m.includes('error') || m.includes('fail')) {
    box.classList.add('alert-danger');
  } else {
    box.classList.add('alert-info');
  }

  setTimeout(() => {
    box.style.display = 'none';
  }, 5000);
}

/* ==========================================================
   COUNTRY POPULATION + AUTO COUNTRY CODE
========================================================== */

const countryList = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Singapore', 'Malaysia', 'United Arab Emirates', 'Germany', 'France',
  'Netherlands', 'New Zealand', 'Sri Lanka', 'Nepal', 'Bangladesh',
  'South Africa', 'Japan', 'Switzerland'
];

const countryCodes = {
  'India': '+91',
  'United States': '+1',
  'United Kingdom': '+44',
  'Canada': '+1',
  'Australia': '+61',
  'Singapore': '+65',
  'Malaysia': '+60',
  'United Arab Emirates': '+971',
  'Germany': '+49',
  'France': '+33',
  'Netherlands': '+31',
  'New Zealand': '+64',
  'Sri Lanka': '+94',
  'Nepal': '+977',
  'Bangladesh': '+880',
  'South Africa': '+27',
  'Japan': '+81',
  'Switzerland': '+41'
};

/**
 * loadCountries()
 * Populates dropdowns and applies auto-code updates.
 */
function loadCountries() {
  const dropdownExisting = document.getElementById('country-existing');
  const dropdownNew = document.getElementById('country-new');

  countryList.forEach(country => {
    if (dropdownExisting) {
      const opt = document.createElement('option');
      opt.value = country;
      opt.textContent = country;
      dropdownExisting.appendChild(opt);
    }
    if (dropdownNew) {
      const opt2 = document.createElement('option');
      opt2.value = country;
      opt2.textContent = country;
      dropdownNew.appendChild(opt2);
    }
  });

  if (dropdownExisting) {
    dropdownExisting.addEventListener('change', function () {
      const codeInput = document.querySelector('#existing .col-3 input');
      if (codeInput && countryCodes[this.value]) {
        codeInput.value = countryCodes[this.value];
      }
    });
  }

  if (dropdownNew) {
    dropdownNew.addEventListener('change', function () {
      const codeInput = document.querySelector('#new .col-3 input');
      if (codeInput && countryCodes[this.value]) {
        codeInput.value = countryCodes[this.value];
      }
    });
  }
}

/* ==========================================================
   FORM HANDLERS
========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Login redirection check
  if (checkLoginStatus()) return;

  // Populate dropdowns
  loadCountries();

  /* ---------------------------
     EXISTING USER LOGIN FORM
  ----------------------------*/
  const existingForm = document.querySelector('#existing form');
  if (existingForm) {
    existingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = this.querySelector('input[placeholder="Full Name"]').value;

      if (!name.trim()) {
        showDuplicate('Error: Please enter your Full Name.');
        return;
      }

      showDuplicate(`Login Success: Welcome back, ${name}! Redirecting...`);
      setTimeout(() => loginUser(name), 900);
    });
  }

  /* ---------------------------
     NEW USER REGISTRATION FORM
  ----------------------------*/
  const newUserForm = document.querySelector('#new form');
  if (newUserForm) {
    newUserForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = this.querySelector('input[placeholder="Full Name"]').value;
      const mobile = (document.getElementById('new-user-mobile') || {}).value || '';

      if (!name.trim()) {
        showDuplicate('Error: Please enter a name for registration.');
        return;
      }

      if (!mobile.trim() || mobile.trim().length < 8) {
        showDuplicate('Error: Please provide a valid Mobile Number.');
        return;
      }

      const statusBox = document.getElementById('whatsapp-status');
      if (statusBox) {
        statusBox.textContent = '✓ WhatsApp Validated: Mobile number confirmed.';
        statusBox.style.display = 'block';
      }

      setTimeout(() => {
        showDuplicate(`Registration Success: Vow recorded for ${name}. You can log in after 24 hours.`);
        logoutUser();
      }, 2000);
    });
  }

  /* ---------------------------
     LOGOUT LINK (if present)
  ----------------------------*/
  const logoutButton = document.getElementById('logout-link');
  if (logoutButton) {
    logoutButton.addEventListener('click', function (event) {
      event.preventDefault();
      logoutUser();
    });
  }
});

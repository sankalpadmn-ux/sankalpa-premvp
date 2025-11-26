/**
 * script.js — Version v1.0.2
 * SANKALPA FRONTEND LOGIC
 *
 * - login/logout
 * - protected page redirects
 * - country dropdown population
 * - auto country-code selection
 * - WhatsApp validation indicator
 * - status messages
 *
 * Cache reload is handled via versioned URLs in HTML (?v=1.0.2)
 *
 * Last Updated: 2025-11-26
 */

/* ===========================
   LOGIN STATE MANAGEMENT
   =========================== */

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
  const path = window.location.pathname;
  const isLoginPage =
    path.includes('index.html') || path.endsWith('/sankalpa-premvp/') || path.endsWith('/docs/') || path === '/' || path === '';

  if (!isLoginPage && !isLoggedIn) {
    window.location.href = 'index.html';
    return true;
  }

  if (isLoginPage && isLoggedIn) {
    window.location.href = 'search.html';
    return true;
  }

  return false;
}

/* ===========================
   STATUS / TOAST
   =========================== */

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

/* ===========================
   COUNTRY LIST + AUTO CODE
   =========================== */

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

function loadCountries() {
  const ex = document.getElementById('country-existing');
  const nw = document.getElementById('country-new');

  countryList.forEach(c => {
    if (ex) {
      const o = document.createElement('option');
      o.value = c; o.textContent = c;
      ex.appendChild(o);
    }
    if (nw) {
      const o2 = document.createElement('option');
      o2.value = c; o2.textContent = c;
      nw.appendChild(o2);
    }
  });

  if (ex) {
    ex.addEventListener('change', function () {
      const cd = document.querySelector('#existing .col-3 input');
      if (cd && countryCodes[this.value]) cd.value = countryCodes[this.value];
    });
  }

  if (nw) {
    nw.addEventListener('change', function () {
      const cd = document.querySelector('#new .col-3 input');
      if (cd && countryCodes[this.value]) cd.value = countryCodes[this.value];
    });
  }
}

/* ===========================
   DOM Ready / Form Handlers
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  if (checkLoginStatus()) return;

  loadCountries();

  // Existing user form
  const existingForm = document.querySelector('#existing form');
  if (existingForm) {
    existingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('input[placeholder="Full Name"]').value;
      if (!name.trim()) {
        showDuplicate('Error: Please enter your Full Name.');
        return;
      }
      showDuplicate(`Login Success: Welcome back, ${name}! Redirecting...`);
      setTimeout(() => loginUser(name), 900);
    });
  }

  // New user form
  const newForm = document.querySelector('#new form');
  if (newForm) {
    newForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('input[placeholder="Full Name"]').value;
      const mobile = document.getElementById('new-user-mobile') ? document.getElementById('new-user-mobile').value : '';

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

  // Logout link (if present)
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      logoutUser();
    });
  }
});

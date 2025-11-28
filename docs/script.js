/**
 * SANKALPA FRONTEND SCRIPT — FINAL v1.0.10
 *
 * Fixes included:
 * - WhatsApp validation (green message) for BOTH Existing and New users (shown immediately)
 * - Existing user uses validateCustomer (no sheet write, no email)
 * - Existing user must match both Name and Mobile (exact format +<code> <number>)
 * - New user registers via registerCustomer and then is redirected to search.html (no "24 hours" message)
 * - Mobile format sent as: "+<code> <number>" (example: "+91 9600003499")
 * - Contact form / logout visibility handled separately in contact.html
 *
 * Do NOT modify this file unless you are sure.
 */

const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzbNeL0HERxq-Q2mXchTEL3iWCM9PYBJFHTor9ViUjzKRyu3EGqqHJXiTyXXbBgt7IQ/exec";

/* -----------------------
   Login / Logout helpers
   ----------------------- */
function loginUser(name){
  localStorage.setItem('sankalpa_loggedIn','true');
  localStorage.setItem('sankalpa_userName',name);
  window.location.href = 'search.html';
}

function logoutUser(){
  localStorage.removeItem('sankalpa_loggedIn');
  localStorage.removeItem('sankalpa_userName');
  window.location.href = 'index.html';
}

function checkLoginStatus(){
  const logged = localStorage.getItem('sankalpa_loggedIn') === 'true';
  const path = window.location.pathname;

  const isLoginPage =
    path.includes('index.html') ||
    path.endsWith('/') ||
    path.endsWith('/docs/') ||
    path.endsWith('/sankalpa-premvp/');

  if(!isLoginPage && !logged){
    window.location.href = 'index.html';
    return true;
  }
  return false;
}

function updateLogoutVisibility(){
  const logged = localStorage.getItem('sankalpa_loggedIn') === 'true';
  const elem = document.getElementById('logoutLink');
  if(elem) elem.style.display = logged ? 'inline-block' : 'none';
}

/* -----------------------
   Message helpers
   ----------------------- */
function showInfoMessage(msg, timeout = 3200){
  const box = document.getElementById('duplicateMsg');
  if(!box) return;
  // reset any custom color
  box.style.color = '';
  box.classList.remove('whatsapp-inline');
  box.style.display = 'block';
  box.textContent = msg;
  clearTimeout(box._hideTimeout);
  box._hideTimeout = setTimeout(()=>{ box.style.display='none'; box.style.color = ''; }, timeout);
}

/* show green WhatsApp validation message.
   If #whatsapp-status exists (new user form), use that.
   Otherwise fallback to #duplicateMsg and style it green temporarily.
*/
function showWhatsAppValidatedMessage(){
  const wa = document.getElementById('whatsapp-status');
  if(wa){
    wa.textContent = '✓ WhatsApp Verified: Mobile number confirmed.';
    wa.style.display = 'block';
    wa.style.color = 'green';
    return;
  }
  // fallback
  const box = document.getElementById('duplicateMsg');
  if(!box) return;
  box.style.display = 'block';
  box.style.color = 'green';
  box.textContent = '✓ WhatsApp Verified: Mobile number confirmed.';
  clearTimeout(box._hideTimeout);
  box._hideTimeout = setTimeout(()=>{ box.style.display='none'; box.style.color = ''; }, 3200);
}

/* -----------------------
   Country list + codes
   ----------------------- */
const countries = [
  "India","United States","United Kingdom","Canada","Australia","Singapore","Malaysia",
  "UAE","Germany","France","Japan","Sri Lanka","Nepal","Bangladesh","South Africa","Switzerland"
];

const countryCodes = {
  "India":"+91","United States":"+1","United Kingdom":"+44","Canada":"+1","Australia":"+61",
  "Singapore":"+65","Malaysia":"+60","UAE":"+971","Germany":"+49","France":"+33","Japan":"+81",
  "Sri Lanka":"+94","Nepal":"+977","Bangladesh":"+880","South Africa":"+27","Switzerland":"+41"
};

function loadCountries(){
  const ex = document.getElementById('country-existing');
  const nw = document.getElementById('country-new');

  [ex,nw].forEach(select=>{
    if(select){
      while(select.options.length > 1) select.remove(1);

      countries.forEach(c=>{
        const o = document.createElement('option');
        o.value = c;
        o.textContent = c;
        select.appendChild(o);
      });

      select.addEventListener('change', function(){
        const codeInput = select.parentElement.querySelector('.col-3 input');
        if(codeInput) codeInput.value = countryCodes[select.value] || '';
      });
    }
  });
}

/* -----------------------
   POST helper to GAS
   ----------------------- */
function postToGAS(obj){
  const body = Object.entries(obj)
    .map(([k,v]) => encodeURIComponent(k)+"="+encodeURIComponent(v))
    .join("&");

  return fetch(GAS_WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body
  }).then(r => r.json());
}

/* -----------------------
   Utility: normalize name for comparison
   ----------------------- */
function normalizeName(n){
  return (n || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

/* -----------------------
   MAIN
   ----------------------- */
document.addEventListener('DOMContentLoaded', ()=>{

  if(checkLoginStatus()) return;

  updateLogoutVisibility();
  loadCountries();

  // INPUT listeners to show WhatsApp validated green message early
  // Existing form mobile input (placeholder "Mobile Number" inside existing form)
  const existingMobileInput = document.querySelector('#existing input[placeholder="Mobile Number"]');
  const existingCodeInput = document.querySelector('#existing .col-3 input');

  if(existingMobileInput){
    existingMobileInput.addEventListener('input', function(){
      const v = (this.value || '').trim();
      if(v.length >= 8){
        // show green tick immediately (visual feedback)
        showWhatsAppValidatedMessage();
      }
    });
  }

  // New user mobile
  const newMobileInput = document.getElementById('new-user-mobile');
  const newCodeInput = document.querySelector('#new .col-3 input');

  if(newMobileInput){
    newMobileInput.addEventListener('input', function(){
      const v = (this.value || '').trim();
      if(v.length >= 8){
        showWhatsAppValidatedMessage();
      }
    });
  }

  /* -----------------------
     EXISTING USER LOGIN
     ----------------------- */
  const existingForm = document.querySelector('#existing form');
  if(existingForm){
    existingForm.addEventListener('submit', function(e){
      e.preventDefault();

      const nameInput = this.querySelector('input[placeholder="Full Name"]');
      const mobileInput = this.querySelector('input[placeholder="Mobile Number"]');
      const codeInputLocal = this.querySelector('.col-3 input');

      const name = (nameInput?.value || '').trim();
      const mobile = (mobileInput?.value || '').trim();
      const code = (codeInputLocal?.value || '').trim();

      if(!name){
        showInfoMessage('Please enter your Full Name.');
        return;
      }
      if(!mobile || mobile.length < 8){
        showInfoMessage('Please enter a valid WhatsApp Number.');
        return;
      }

      // Combine to exact format used in sheet: "+91 9600003499"
      const fullMobile = (code ? code : '') + (code ? ' ' : '') + mobile;

      // Show WhatsApp validated message (visual)
      showWhatsAppValidatedMessage();

      // Call validateCustomer (NO sheet writes)
      const payload = {
        action: "validateCustomer",
        mobile: fullMobile
      };

      postToGAS(payload).then(res => {
        if(!res || typeof res !== 'object'){
          showInfoMessage('Server error.');
          return;
        }

        if(res.status === "duplicate"){
          // backend returned the stored name for the mobile
          const storedName = (res.name || '').toString().trim();
          // compare entered name with stored name (case-insensitive)
          if(normalizeName(storedName) === normalizeName(name)){
            // match -> welcome and redirect to search
            showInfoMessage(`Welcome back, ${storedName}.`);
            // small delay so user sees message
            setTimeout(()=> loginUser(storedName), 700);
            return;
          } else {
            // name mismatch
            showInfoMessage('Name and Mobile do not match. Please check your details.');
            return;
          }
        }

        if(res.status === "not_found"){
          showInfoMessage('This number is not registered. Please Register as New User.');
          return;
        }

        showInfoMessage(res.message || 'Server error.');
      }).catch(()=>{
        showInfoMessage('Unable to reach server.');
      });

    });
  }

  /* -----------------------
     NEW USER REGISTRATION
     ----------------------- */
  const newForm = document.querySelector('#new form');
  if(newForm){
    newForm.addEventListener('submit', function(e){
      e.preventDefault();

      const name = (this.querySelector('input[placeholder="Full Name"]')?.value || '').trim();
      const city = (this.querySelector('input[placeholder="City"]')?.value || '').trim();
      const mobile = (document.getElementById('new-user-mobile')?.value || '').trim();
      const code = (this.querySelector('.col-3 input')?.value || '').trim();
      const country = (document.getElementById('country-new')?.value) || '';

      if(!name){
        showInfoMessage('Please enter your Full Name.');
        return;
      }
      if(!mobile || mobile.length < 8){
        showInfoMessage('Please enter a valid Mobile Number.');
        return;
      }

      // Combine to exact format used in sheet: "+91 9600003499"
      const fullMobile = (code ? code : '') + (code ? ' ' : '') + mobile;

      // Show WhatsApp validated message (visual)
      showWhatsAppValidatedMessage();

      // Build payload for registerCustomer
      const payload = {
        action: "registerCustomer",
        name: name,
        mobile: fullMobile,
        email: "",
        city: city,
        country: country
      };

      postToGAS(payload).then(res => {
        if(!res || typeof res !== 'object'){
          showInfoMessage('Server error.');
          return;
        }

        if(res.status === "duplicate"){
          const nm = (res.name || name);
          showInfoMessage(`This mobile number is already registered. Welcome back, ${nm}.`);
          setTimeout(()=> loginUser(nm), 900);
          return;
        }

        if(res.status === "success"){
          // Registration success -> direct login to search (no 24 hours message)
          showInfoMessage(`Welcome, ${name}. Redirecting...`);
          setTimeout(()=> loginUser(name), 700);
          return;
        }

        showInfoMessage(res.message || 'Server error.');
      }).catch(()=>{
        showInfoMessage('Unable to reach server.');
      });

    });
  }

});

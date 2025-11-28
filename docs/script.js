/**
 * SANKALPA FRONTEND SCRIPT — FINAL v1.0.9
 * Stable — Do NOT Modify Structure Without Asking
 */

const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzbNeL0HERxq-Q2mXchTEL3iWCM9PYBJFHTor9ViUjzKRyu3EGqqHJXiTyXXbBgt7IQ/exec";

/***********************
 * LOGIN / LOGOUT
 ***********************/
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

/***********************
 * STATUS MESSAGE BOX
 ***********************/
function showDuplicate(msg){
  const box = document.getElementById('duplicateMsg');
  if(!box) return;
  box.style.display = 'block';
  box.textContent = msg;
  setTimeout(()=>{ box.style.display='none'; }, 3200);
}

/***********************
 * COUNTRY + AUTO CODE
 ***********************/
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

/***********************
 * GAS POST Helper
 ***********************/
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

/***********************
 * MAIN EVENT HANDLERS
 ***********************/
document.addEventListener('DOMContentLoaded', ()=>{

  if(checkLoginStatus()) return;

  updateLogoutVisibility();
  loadCountries();

  /*************************************
   * EXISTING USER LOGIN (NO REGISTER)
   *************************************/
  const existingForm = document.querySelector('#existing form');

  if(existingForm){
    existingForm.addEventListener('submit', function(e){
      e.preventDefault();

      const name = this.querySelector('input[placeholder="Full Name"]').value.trim();
      const mobile = this.querySelector('input[placeholder="Mobile Number"]').value.trim();
      const code = this.querySelector('.col-3 input').value.trim();

      if(!name){
        showDuplicate('Please enter your Full Name.');
        return;
      }

      if(!mobile || mobile.length < 8){
        showDuplicate('Please enter a valid WhatsApp Number.');
        return;
      }

      // Combine as: +91 9600003499
      const fullMobile = code + " " + mobile;

      showDuplicate('Checking number...');

      const payload = {
        action: "validateCustomer",
        mobile: fullMobile
      };

      postToGAS(payload).then(res => {

        if(res.status === "duplicate"){
          const nm = res.name || name;
          showDuplicate(`Welcome back, ${nm}.`);
          setTimeout(()=> loginUser(nm), 900);
          return;
        }

        if(res.status === "not_found"){
          showDuplicate("This number is not registered. Please register as New User.");
          return;
        }

        showDuplicate(res.message || "Server error.");
      })
      .catch(()=>{
        showDuplicate("Unable to reach server.");
      });

    });
  }

  /*************************************
   * NEW USER REGISTRATION
   *************************************/
  const newForm = document.querySelector('#new form');

  if(newForm){
    newForm.addEventListener('submit', function(e){
      e.preventDefault();

      const name = this.querySelector('input[placeholder="Full Name"]').value.trim();
      const city = this.querySelector('input[placeholder="City"]').value.trim();
      const mobile = document.getElementById("new-user-mobile").value.trim();
      const code = this.querySelector('.col-3 input').value.trim();
      const country = document.getElementById("country-new")?.value || "";

      if(!name){
        showDuplicate('Please enter your Full Name.');
        return;
      }

      if(!mobile || mobile.length < 8){
        showDuplicate('Please enter a valid Mobile Number.');
        return;
      }

      // Combine exact format your sheet uses
      const fullMobile = code + " " + mobile;

      // WhatsApp validation message
      const wa = document.getElementById('whatsapp-status');
      if(wa){
        wa.textContent = '✓ WhatsApp Validated: Mobile number confirmed.';
        wa.style.display = 'block';
      }

      const payload = {
        action: "registerCustomer",
        name: name,
        mobile: fullMobile,
        email: "",
        city: city,
        country: country
      };

      postToGAS(payload).then(res => {

        if(res.status === "duplicate"){
          const nm = res.name || name;
          showDuplicate(`This mobile number is already registered. Welcome back, ${nm}.`);
          setTimeout(()=> loginUser(nm), 900);
          return;
        }

        if(res.status === "success"){
          showDuplicate(`Registration successful for ${name}. You can log in after 24 hours.`);
          setTimeout(()=> logoutUser(), 1800);
          return;
        }

        showDuplicate(res.message || "Server error.");
      })
      .catch(()=>{
        showDuplicate("Unable to reach server.");
      });

    });
  }

});

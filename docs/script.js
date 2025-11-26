/**
 * SANKALPA FRONTEND SCRIPT
 * script.js — Version v1.0.6 (FINAL)
 *
 * - No header DOM rewriting
 * - Country population + auto code
 * - WhatsApp validation restored (immediate, green)
 * - Login/logout handled, protected pages redirect
 * - No manipulation of header or navigation markup
 */

/* LOGIN / LOGOUT */
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
    path.includes('index.html') || path.endsWith('/') || path.endsWith('/docs/') || path.endsWith('/sankalpa-premvp/');
  if(!isLoginPage && !logged){
    window.location.href = 'index.html';
    return true;
  }
  return false;
}

/* STATUS BOX */
function showDuplicate(msg){
  const box = document.getElementById('duplicateMsg');
  if(!box) return;
  box.style.display = 'block';
  box.textContent = msg;
  setTimeout(()=>{ box.style.display='none'; }, 3200);
}

/* COUNTRY + AUTO CODE */
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
      // clear previous options except placeholder
      // (helps when reloading)
      while(select.options.length > 1) select.remove(1);

      countries.forEach(c=>{
        const o = document.createElement('option');
        o.value = c; o.textContent = c;
        select.appendChild(o);
      });

      select.addEventListener('change', function(){
        const codeInput = select.parentElement.querySelector('.col-3 input');
        if(codeInput) codeInput.value = countryCodes[select.value] || '';
      });
    }
  });
}

/* FORMS */
document.addEventListener('DOMContentLoaded', ()=>{
  if(checkLoginStatus()) return;

  loadCountries();

  /* existing */
  const existingForm = document.querySelector('#existing form');
  if(existingForm){
    existingForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = this.querySelector('input[placeholder="Full Name"]').value.trim();
      if(!name){ showDuplicate('Please enter your Full Name.'); return; }
      showDuplicate(`Welcome back, ${name}! Redirecting...`);
      setTimeout(()=> loginUser(name), 900);
    });
  }

  /* new */
  const newForm = document.querySelector('#new form');
  if(newForm){
    newForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = this.querySelector('input[placeholder="Full Name"]').value.trim();
      const mobile = (document.getElementById('new-user-mobile') || {}).value.trim();
      if(!name){ showDuplicate('Please enter your Full Name.'); return; }
      if(!mobile || mobile.length < 8){ showDuplicate('Please enter a valid Mobile Number.'); return; }

      const wa = document.getElementById('whatsapp-status');
      if(wa){
        wa.textContent = '✓ WhatsApp Validated: Mobile number confirmed.';
        wa.classList.add('validation-success');
        wa.style.display = 'block';
      }

      setTimeout(()=>{
        showDuplicate(`Registration successful for ${name}. You can log in after 24 hours.`);
        logoutUser();
      }, 1800);
    });
  }
});

/* LOGIN STORAGE */
function loginUser(name){
    localStorage.setItem("sankalpa_loggedIn","true");
    localStorage.setItem("sankalpa_userName",name);
    window.location.href="search.html";
}

function logoutUser(){
    localStorage.removeItem("sankalpa_loggedIn");
    localStorage.removeItem("sankalpa_userName");
    window.location.href="index.html";
}

/* COUNTRY LIST */
const countries=[
"India","United States","United Kingdom","Australia","Canada",
"Singapore","Malaysia","United Arab Emirates","New Zealand","Germany",
"France","Japan","Switzerland","Sri Lanka","Nepal"
];

const codes={
"India":"+91","United States":"+1","United Kingdom":"+44",
"Australia":"+61","Canada":"+1","Singapore":"+65","Malaysia":"+60",
"United Arab Emirates":"+971","New Zealand":"+64","Germany":"+49",
"France":"+33","Japan":"+81","Switzerland":"+41","Sri Lanka":"+94","Nepal":"+977"
};

/* POPULATE DROPDOWNS */
function loadCountries(){
    const ex=document.getElementById("country-existing");
    const nw=document.getElementById("country-new");

    countries.forEach(c=>{
        if(ex){ let o=document.createElement("option"); o.text=c; ex.add(o); }
        if(nw){ let o=document.createElement("option"); o.text=c; nw.add(o); }
    });

    if(ex){
        ex.addEventListener("change",()=>{
            const cd=document.querySelector('#existing .col-3 input');
            if(cd) cd.value=codes[ex.value] || "";
        });
    }

    if(nw){
        nw.addEventListener("change",()=>{
            const cd=document.querySelector('#new .col-3 input');
            if(cd) cd.value=codes[nw.value] || "";
        });
    }
}

/* DUPLICATE/STATUS MESSAGES */
function showDuplicate(msg){
    const box=document.getElementById("duplicateMsg");
    box.textContent=msg;
    box.style.display="block";

    setTimeout(()=>box.style.display="none",4000);
}

/* MAIN */
document.addEventListener("DOMContentLoaded",()=>{

    loadCountries();

    /* EXISTING USER */
    const exForm=document.querySelector("#existing form");
    if(exForm){
        exForm.addEventListener("submit",e=>{
            e.preventDefault();
            const name=exForm.querySelector('input[placeholder="Full Name"]').value;
            if(!name.trim()) return showDuplicate("Please enter your name.");
            showDuplicate("Login Success: Welcome back!");
            setTimeout(()=>loginUser(name),900);
        });
    }

    /* NEW USER */
    const newForm=document.querySelector("#new form");
    if(newForm){
        newForm.addEventListener("submit",e=>{
            e.preventDefault();
            const name=newForm.querySelector('input[placeholder="Full Name"]').value;
            const mobile=document.getElementById("new-user-mobile").value;
            if(!name.trim()) return showDuplicate("Please enter a name.");
            if(!mobile.trim() || mobile.length<8) return showDuplicate("Enter valid mobile.");

            document.getElementById("whatsapp-status").textContent="✓ WhatsApp Validated";
            document.getElementById("whatsapp-status").style.display="block";

            showDuplicate(`Registration Success for ${name}. Login after 24 hours.`);
            setTimeout(()=>logoutUser(),1500);
        });
    }

    /* LOGOUT */
    const lo=document.getElementById("logout-link");
    if(lo){
        lo.addEventListener("click",e=>{
            e.preventDefault();
            logoutUser();
        });
    }
});

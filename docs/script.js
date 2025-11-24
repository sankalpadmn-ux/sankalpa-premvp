/**
 * SANKALPA UI JAVASCRIPT FILE (script.js)
 * Version 1.4 - Finalizing Login State Management and Access Control
 */

// ==========================================================
// GLOBAL STATE MANAGEMENT
// ==========================================================

// Function to handle successful login/registration
function loginUser(userName) {
    localStorage.setItem('sankalpa_loggedIn', 'true');
    localStorage.setItem('sankalpa_userName', userName);
    // Redirect to the Search Page (the main destination after login)
    window.location.href = 'search.html';
}

// Function to handle logout
function logoutUser() {
    localStorage.removeItem('sankalpa_loggedIn');
    localStorage.removeItem('sankalpa_userName');
    // Redirect back to the Login Page
    window.location.href = 'index.html';
}

// Function to check login status and redirect if necessary
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('sankalpa_loggedIn') === 'true';
    const isLoginPage = window.location.pathname.includes('index.html');
    
    // For protected pages (search.html and contact.html)
    if (!isLoginPage) {
        if (!isLoggedIn) {
            // Redirect to login page if trying to access a protected page without logging in
            window.location.href = 'index.html';
            return true; // Stop further execution
        }
    } else {
        // For the login page (index.html)
        if (isLoggedIn) {
            // If user is logged in, immediately redirect to search page
            window.location.href = 'search.html';
            return true; // Stop further execution
        }
    }
    return false; // User is on the correct page state
}


// ==========================================================
// 1. STATUS MESSAGE HANDLER
// ==========================================================

function showDuplicate(msg) {
    const box = document.getElementById("duplicateMsg");
    if (box) {
        const whatsappStatus = document.getElementById("whatsapp-status");
        if (whatsappStatus) whatsappStatus.style.display = "none"; 
        
        box.textContent = msg;
        box.style.display = "block";
        box.classList.remove('alert-info', 'alert-danger', 'alert-success');
        
        if (msg.toLowerCase().includes('success') || msg.toLowerCase().includes('validated')) {
            box.classList.add('alert-success');
        } else if (msg.toLowerCase().includes('error') || msg.toLowerCase().includes('fail')) {
            box.classList.add('alert-danger');
        } else {
            box.classList.add('alert-info');
        }

        setTimeout(() => {
            box.style.display = "none";
        }, 5000);
    }
}


// ==========================================================
// 2. FORM SUBMISSION LOGIC & LISTENERS
//==========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Check login status immediately on load (Handles redirection for all pages)
    if (checkLoginStatus()) return;

    // Function to handle inline WhatsApp validation display
    function showWhatsappStatus(msg, isSuccess) {
        const statusBox = document.getElementById("whatsapp-status");
        if (statusBox) {
            statusBox.textContent = msg;
            statusBox.style.display = "block";
            
            if (isSuccess) {
                statusBox.classList.add('validation-success');
            } else {
                statusBox.classList.remove('validation-success');
            }
        }
    }
    
    // --- Existing User Form Submission (LOGIN) ---
    const existingUserForm = document.querySelector('#existing form');
    if (existingUserForm) {
        existingUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = this.querySelector('input[placeholder="Full Name"]').value;
            if (name.trim() === "") {
                showDuplicate("Error: Please enter your Full Name.");
            } else {
                // Simulate successful login
                showDuplicate(`Login Success: Welcome back, ${name}! Redirecting to search...`);
                setTimeout(() => loginUser(name), 1000); // Redirect after 1 second
            }
        });
    }

    // --- New User Form Submission (REGISTRATION) ---
    const newUserForm = document.querySelector('#new form');
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(event) {
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
            } else {
                showWhatsappStatus(`✓ WhatsApp Validated: Mobile number confirmed.`, true);
            }

            // Registration Success logic (24 hour lockout)
            setTimeout(() => {
                showDuplicate(`Registration Success: Vow recorded for ${name}. You can log in only after 24 hours. Auto-login failed.`);
                // Reset session and redirect back to index page.
                logoutUser(); 
            }, 2000); 
        });
    }

    // --- Logout Button Listener (Must be present on contact/search pages) ---
    const logoutButton = document.getElementById('logout-link');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});

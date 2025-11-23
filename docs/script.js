/**
 * SANKALPA UI JAVASCRIPT FILE (script.js)
 * Version 1.0 - Core Form Handling and Status Messages
 * * NOTE: This script provides basic client-side functionality 
 * for status messages and form submission placeholders.
 * Actual user authentication and registration must be handled 
 * by a secure backend server.
 */

// ==========================================================
// 1. STATUS MESSAGE HANDLER
// ==========================================================

/**
 * Displays a system status message in the designated area.
 * The corresponding HTML element must have the ID 'duplicateMsg'.
 * @param {string} msg - The message to display.
 */
function showDuplicate(msg) {
    const box = document.getElementById("duplicateMsg");
    if (box) {
        // Set the content and make the box visible
        box.textContent = msg;
        box.style.display = "block";
        // Optionally change class for different statuses (e.g., alert-danger, alert-success)
        box.classList.remove('alert-info', 'alert-danger', 'alert-success');
        
        // Simple error/success detection for visual feedback
        if (msg.toLowerCase().includes('success')) {
            box.classList.add('alert-success');
        } else if (msg.toLowerCase().includes('error') || msg.toLowerCase().includes('fail')) {
            box.classList.add('alert-danger');
        } else {
            box.classList.add('alert-info');
        }

        // Hide the message after 5 seconds
        setTimeout(() => {
            box.style.display = "none";
        }, 5000);
    }
}


// ==========================================================
// 2. FORM SUBMISSION LOGIC (Placeholders)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Existing User Form Submission ---
    const existingUserForm = document.querySelector('#existing form');
    if (existingUserForm) {
        existingUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // In a real application, AJAX request would be sent here
            
            // Placeholder Logic:
            const name = this.querySelector('input[placeholder="Full Name"]').value;
            if (name.trim() === "") {
                showDuplicate("Error: Please enter your Full Name.");
            } else {
                // Simulate successful login attempt
                showDuplicate(`Login Success: Welcome back, ${name}!`);
                // document.getElementById('existing').style.display = 'none'; // Example redirect
            }
        });
    }

    // --- New User Form Submission ---
    const newUserForm = document.querySelector('#new form');
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // In a real application, AJAX request would be sent here
            
            // Placeholder Logic:
            const name = this.querySelector('input[placeholder="Full Name"]').value;
            if (name.trim() === "") {
                showDuplicate("Error: Please enter a name for registration.");
            } else {
                // Check saved constraint: user can log in only after 24 hours
                showDuplicate(`Registration Success: Vow recorded for ${name}. You can log in only after 24 hours.`);
                // Switch back to the Existing User tab (Login)
                $('#existing-tab').tab('show'); 
            }
        });
    }

    // --- Initial Message (Optional) ---
    // If you want a message to display when the page first loads
    // showDuplicate("Please log in or register your new Sankalpa.");
});

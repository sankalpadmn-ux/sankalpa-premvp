/**
 * SANKALPA UI JAVASCRIPT FILE (script.js)
 * Version 1.2 - Implemented Inline WhatsApp Validation Status
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
        // Clear inline WhatsApp status if it's currently showing
        const whatsappStatus = document.getElementById("whatsapp-status");
        if (whatsappStatus) whatsappStatus.style.display = "none"; 
        
        // Set the content and make the box visible
        box.textContent = msg;
        box.style.display = "block";
        // Optionally change class for different statuses
        box.classList.remove('alert-info', 'alert-danger', 'alert-success');
        
        if (msg.toLowerCase().includes('success') || msg.toLowerCase().includes('validated')) {
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
    
    // Function to handle inline WhatsApp validation display
    function showWhatsappStatus(msg, isSuccess) {
        const statusBox = document.getElementById("whatsapp-status");
        if (statusBox) {
            statusBox.textContent = msg;
            statusBox.style.display = "block";
            
            // Apply or remove the success class (Green text)
            if (isSuccess) {
                statusBox.classList.add('validation-success');
            } else {
                statusBox.classList.remove('validation-success');
                // You might add a separate error class here if needed
            }

            // Hide the status after 4 seconds (it will be replaced by the final status anyway)
            setTimeout(() => {
                statusBox.style.display = "none";
            }, 4000);
        }
    }
    
    // --- Existing User Form Submission ---
    const existingUserForm = document.querySelector('#existing form');
    if (existingUserForm) {
        existingUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = this.querySelector('input[placeholder="Full Name"]').value;
            if (name.trim() === "") {
                showDuplicate("Error: Please enter your Full Name.");
            } else {
                showDuplicate(`Login Success: Welcome back, ${name}!`);
            }
        });
    }

    // --- New User Form Submission ---
    const newUserForm = document.querySelector('#new form');
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = this.querySelector('input[placeholder="Full Name"]').value;
            // Get the mobile number from the field with the new ID
            const mobileInput = this.querySelector('#new-user-mobile');
            const mobile = mobileInput ? mobileInput.value : '';
            
            // 1. Name Validation
            if (name.trim() === "") {
                showDuplicate("Error: Please enter a name for registration.");
                return;
            }

            // 2. Mobile Validation & WhatsApp Status
            if (mobile.trim() === "" || mobile.trim().length < 8) {
                showDuplicate("Error: Please provide a valid Mobile Number for registration.");
                return;
            } else {
                 // ** Display INLINE Validation Status (Green Success Message) **
                showWhatsappStatus(`✓ WhatsApp Validated: Mobile number confirmed.`, true);
            }

            // 3. Final Registration Status (After a brief delay)
            setTimeout(() => {
                // Clear the inline status before showing the main status
                const whatsappStatus = document.getElementById("whatsapp-status");
                if (whatsappStatus) whatsappStatus.style.display = "none"; 
                
                showDuplicate(`Registration Success: Vow recorded for ${name}. You can log in only after 24 hours.`);
                // Switch back to the Existing User tab (Login)
                $('#existing-tab').tab('show'); 
            }, 2000); // 2 second delay
        });
    }
});

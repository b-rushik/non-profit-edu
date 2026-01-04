// Update the submitForm function
async function submitForm(type, form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    const statusElement = document.getElementById('formStatus') || createStatusElement();
    
    try {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Prepare Netlify form submission (so Netlify Forms stores the submission)
        const netlifyFormData = new FormData(form);
        const botField = netlifyFormData.get('bot-field');
        if (botField) {
            // Honeypot trap triggered — stop silently
            return showStatus('❌ Bot submission blocked.', 'error', statusElement);
        }

        // Ensure availableDays is serialized for the Netlify form as well
        if (type === 'faculty') {
            const availableDaysSelect = form.querySelector('#availableDays');
            if (availableDaysSelect) {
                const selectedOptions = Array.from(availableDaysSelect.selectedOptions).map(opt => opt.value);
                netlifyFormData.set('availableDays', selectedOptions.join(', '));
            }
        }

        // Send to Netlify Forms endpoint (stays in Netlify dashboard)
        await fetch('/', { method: 'POST', body: netlifyFormData });

        // Prepare JSON payload for serverless function
        const formDataObj = Object.fromEntries(new FormData(form));
        if (type === 'faculty' && form.querySelector('#availableDays')) {
            const availableDaysSelect = form.querySelector('#availableDays');
            const selectedOptions = Array.from(availableDaysSelect.selectedOptions).map(opt => opt.value);
            formDataObj.availableDays = selectedOptions.join(', ');
        }

        // Send to Netlify function (email + sheet append)
        const response = await fetch(`/.netlify/functions/submit-${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
        });

        const result = await response.json();

        if (response.ok) {
            showStatus('✅ ' + result.message, 'success', statusElement);
            form.reset();
            
            // Show additional success message
            setTimeout(() => {
                if (type === 'faculty') {
                    showStatus('📧 Check your email for confirmation. Our team will contact you soon!', 'success', statusElement);
                } else {
                    showStatus('📧 Confirmation email sent to parent! Competition details will follow.', 'success', statusElement);
                }
            }, 2000);
        } else {
            throw new Error(result.error || 'Submission failed');
        }
    } catch (error) {
        showStatus('❌ Error: ' + error.message, 'error', statusElement);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function createStatusElement() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'formStatus';
    statusDiv.className = 'form-status';
    const form = document.querySelector('form');
    form.insertBefore(statusDiv, form.querySelector('.submit-btn').parentNode);
    return statusDiv;
}

function showStatus(message, type, element) {
    element.textContent = message;
    element.className = `form-status ${type}`;
    element.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 10000);
    }
}

// Small UI helpers: mobile menu toggle and auto-close behavior
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-times');
            }
        });

        // Close menu when a link is clicked (mobile)
        navLinks.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                if (menuIcon) { menuIcon.classList.add('fa-bars'); menuIcon.classList.remove('fa-times'); }
            }
        });
    }
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
            }
        });
    });

    // Navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
        });
    }

    // Attach form submit handlers
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm('student', studentForm);
        });
    }

    const facultyForm = document.getElementById('facultyForm');
    if (facultyForm) {
        facultyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm('faculty', facultyForm);
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Logo Injection
    const logoContainer = document.getElementById('logo-container');
    const footerLogo = document.getElementById('footer-logo');
    
    // Text-only Logo with TM
    const svgLogo = `
    <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="27" font-family="'Playfair Display', serif" font-size="24" fill="#1A1A1A" letter-spacing="0.5" font-weight="600">Unote<tspan font-family="'Inter', sans-serif" font-size="8" baseline-shift="12" fill="#999">TM</tspan></text>
    </svg>
    `;
    if (logoContainer) logoContainer.innerHTML = svgLogo;
    
    // Footer logo (smaller)
    const footerSvgLogo = `
    <svg width="120" height="32" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="27" font-family="'Playfair Display', serif" font-size="24" fill="#1A1A1A" letter-spacing="0.5" font-weight="600">Unote<tspan font-family="'Inter', sans-serif" font-size="8" baseline-shift="12" fill="#999">TM</tspan></text>
    </svg>
    `;
    if (footerLogo) footerLogo.innerHTML = footerSvgLogo;

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .band-item, .spec-column, .privacy-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Inject styles for animations
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Waitlist Modal (only runs if modal exists on the page)
    const modal = document.getElementById('waitlist-modal');
    if (modal) {
        const modalForm = document.getElementById('waitlist-form');
        const closeBtn = modal.querySelector('.modal-close');
        
        // All buttons that should open the modal
        const waitlistButtons = document.querySelectorAll('.pre-order-btn, .primary-btn, .cta-btn, .btn-primary, .nav-btn, .cta-submit');
        
        // Open modal
        waitlistButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Google Apps Script URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfqB9prgKnAq4l6pOKVMuiV-FrugkSRJ5x0izY7PgfBKGeymElyNz7pOVawqNeiun5lg/exec';
        
        // Form submission
        if (modalForm) {
            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = modalForm.querySelector('input[type="email"]');
                const submitBtn = modalForm.querySelector('button[type="submit"]');
                const email = emailInput.value;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Joining...';
                
                try {
                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, timestamp: new Date().toISOString() })
                    });
                    showSuccess(email);
                } catch (error) {
                    console.error('Error:', error);
                    showSuccess(email);
                }
            });
        }
        
        function showSuccess(email) {
            const modalContent = modal.querySelector('.modal-content');
            modalContent.innerHTML = `
                <button class="modal-close" aria-label="Close">&times;</button>
                <div class="modal-icon">
                    <span class="material-symbols-outlined" style="color: var(--led-green); background: #e8f5e9;">check_circle</span>
                </div>
                <h2>You're on the list!</h2>
                <p>Thanks for your interest. We'll notify you at <strong>${email}</strong> when we launch.</p>
                <button class="modal-submit" onclick="document.getElementById('waitlist-modal').classList.remove('active'); document.body.style.overflow = '';">Got it</button>
            `;
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
        }
    }
});
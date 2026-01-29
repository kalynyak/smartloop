document.addEventListener('DOMContentLoaded', () => {
    // Logo Injection
    const logoContainer = document.getElementById('logo-container');
    const footerLogo = document.getElementById('footer-logo');
    
    // Text-only Logo with TM
    const svgLogo = `
    <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="27" font-family="'Playfair Display', serif" font-size="24" fill="#1A1A1A" letter-spacing="0.5" font-weight="600">SmartLoop<tspan font-family="'Inter', sans-serif" font-size="8" baseline-shift="12" fill="#999">TM</tspan></text>
    </svg>
    `;
    logoContainer.innerHTML = svgLogo;
    
    // Footer logo (smaller)
    const footerSvgLogo = `
    <svg width="120" height="32" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="27" font-family="'Playfair Display', serif" font-size="24" fill="#1A1A1A" letter-spacing="0.5" font-weight="600">SmartLoop<tspan font-family="'Inter', sans-serif" font-size="8" baseline-shift="12" fill="#999">TM</tspan></text>
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

    document.querySelectorAll('.feature-card, .band-item, .spec-column').forEach(el => {
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

    // Waitlist Modal
    const modal = document.getElementById('waitlist-modal');
    const modalForm = document.getElementById('waitlist-form');
    const closeBtn = modal.querySelector('.modal-close');
    
    // All buttons that should open the modal
    const waitlistButtons = document.querySelectorAll('.pre-order-btn, .primary-btn, .cta-btn');
    
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
    
    closeBtn.addEventListener('click', closeModal);
    
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
    
    // Form submission
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = modalForm.querySelector('input[type="email"]').value;
        
        // Show success state
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-icon">
                <span class="material-symbols-outlined" style="color: var(--led-green); background: #e8f5e9;">check_circle</span>
            </div>
            <h2>You're on the list!</h2>
            <p>Thanks for your interest in SmartLoop. We'll notify you at <strong>${email}</strong> when we launch.</p>
            <button class="modal-submit" onclick="document.getElementById('waitlist-modal').classList.remove('active'); document.body.style.overflow = '';">Got it</button>
        `;
        
        // Re-attach close button listener
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
    });
});
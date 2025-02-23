// DOM Elements
const modalOverlay = document.getElementById('modalOverlay');
const modal = document.getElementById('registrationModal');
const modalClose = document.getElementById('modalClose');
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const navItems = document.querySelectorAll('.nav-item');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const sections = document.querySelectorAll('section[id]');

// Smooth Scroll Function
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Modal Functions
function openModal() {
    modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        successMessage.style.display = 'none';
        registrationForm.reset();
    }, 300);
}

// Mobile Menu Functions
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenuBtn.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// Navigation Highlight Function
function highlightNavItem() {
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + sectionId) {
                    item.classList.add('active');
                }
            });
            
            mobileNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + sectionId) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Form Validation
function validateForm(formData) {
    const errors = [];
    
    if (!formData.fullName.trim()) {
        errors.push('Vui lòng nhập họ và tên');
    }
    
    if (!formData.age || formData.age < 18 || formData.age > 25) {
        errors.push('Độ tuổi phải từ 18 đến 25');
    }
    
    if (!formData.university.trim()) {
        errors.push('Vui lòng nhập tên trường đại học');
    }
    
    return errors;
}

// Loan Calculator
function calculateLoan(amount, months) {
    const interestRate = 0.005; // 0.5% monthly interest
    const monthlyPayment = (amount * (1 + interestRate * months)) / months;
    return {
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(monthlyPayment * months)
    };
}

// Section Animation Setup
function setupSectionAnimations() {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('service-card') ||
                        entry.target.classList.contains('feature-card')) {
                        entry.target.style.transitionDelay = `${entry.target.dataset.delay}s`;
                    }
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });

    // Observe cards with delay
    document.querySelectorAll('.service-card, .feature-card').forEach((card, index) => {
        card.dataset.delay = index * 0.2;
        sectionObserver.observe(card);
    });
}

// Scroll Snap Handler
function handleScrollSnap() {
    if (window.innerWidth <= 768) {
        document.documentElement.style.scrollSnapType = 'none';
    } else {
        document.documentElement.style.scrollSnapType = 'y mandatory';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupSectionAnimations();
    handleScrollSnap();
});

window.addEventListener('resize', handleScrollSnap);
window.addEventListener('scroll', highlightNavItem);

// Navigation Event Listeners
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        smoothScrollTo(targetSection);
    });
});

mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        smoothScrollTo(targetSection);
        closeMobileMenu();
    });
});

// Modal Event Listeners
document.querySelectorAll('.register-btn, .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Mobile Menu Event Listeners
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

// Form Submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        age: parseInt(document.getElementById('age').value),
        university: document.getElementById('university').value
    };

    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    // Show success message
    successMessage.style.display = 'block';
    
    // Close modal after delay
    setTimeout(closeModal, 2000);
    
    // Log form data (replace with actual form submission)
    console.log('Form Data:', formData);
});


// Keyboard Events
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeMobileMenu();
    }
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 500);
});
// Thêm vào file script.js

// Section Transition Handler
class SectionTransitionHandler {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.currentSection = 0;
        this.isAnimating = false;
        this.loadingBar = this.createLoadingBar();
        
        this.init();
    }

    createLoadingBar() {
        const bar = document.createElement('div');
        bar.className = 'loading-bar';
        document.body.appendChild(bar);
        return bar;
    }

    init() {
        // Wrap section contents
        this.sections.forEach(section => {
            const content = section.innerHTML;
            section.innerHTML = `<div class="section-content">${content}</div>`;
        });

        // Initial active section
        this.sections[0].classList.add('active');
        
        // Setup observers
        this.setupIntersectionObserver();
        this.setupScrollHandler();
        
        // Update loading bar
        this.updateLoadingBar();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '-50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    this.activateSection(section);
                }
            });
        }, options);

        this.sections.forEach(section => observer.observe(section));
    }

    setupScrollHandler() {
        let lastScrollTop = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll(scrollTop, lastScrollTop);
                    ticking = false;
                });

                ticking = true;
            }

            lastScrollTop = scrollTop;
        });
    }

    handleScroll(scrollTop, lastScrollTop) {
        // Calculate scroll progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrollTop / docHeight) * 100;
        this.updateLoadingBar(scrollProgress);

        // Add parallax effect
        this.sections.forEach(section => {
            const speed = 0.5;
            const yPos = -(scrollTop * speed);
            const parallaxBg = section.querySelector('.parallax-bg');
            if (parallaxBg) {
                parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }

    activateSection(section) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Remove active class from all sections
        this.sections.forEach(s => s.classList.remove('active'));

        // Add active class to current section
        section.classList.add('active');

        // Trigger content animation
        const content = section.querySelector('.section-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 300);
        }

        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    updateLoadingBar(progress = 0) {
        this.loadingBar.style.width = `${progress}%`;
    }
}


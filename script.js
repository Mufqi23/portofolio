// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// ========================================
// PROJECT SLIDER FUNCTIONALITY
// ========================================

class ProjectSlider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.images = sliderElement.querySelectorAll('.slider-image');
        this.prevBtn = sliderElement.querySelector('.prev');
        this.nextBtn = sliderElement.querySelector('.next');
        this.dotsContainer = sliderElement.querySelector('.slider-dots');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        // Only initialize if there are multiple images
        if (this.images.length <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            return;
        }

        this.createDots();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    createDots() {
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.slider-dot');
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    goToSlide(index) {
        this.images[this.currentIndex].classList.remove('active');
        if (this.dots[this.currentIndex]) {
            this.dots[this.currentIndex].classList.remove('active');
        }

        this.currentIndex = index;

        this.images[this.currentIndex].classList.add('active');
        if (this.dots[this.currentIndex]) {
            this.dots[this.currentIndex].classList.add('active');
        }

        this.resetAutoPlay();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        if (this.images.length > 1) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize all sliders
document.querySelectorAll('.project-slider').forEach(slider => {
    new ProjectSlider(slider);
});

// ========================================
// PROJECT CARD HOVER EFFECTS
// ========================================

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.01)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ========================================
// PARALLAX EFFECT FOR HERO BACKGROUND
// ========================================

const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ========================================
// CURSOR FOLLOW EFFECT (OPTIONAL - DESKTOP ONLY)
// ========================================

if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Add cursor styles dynamically
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            width: 10px;
            height: 10px;
            border: 2px solid #2563eb;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease;
            opacity: 0;
        }
        .custom-cursor.active {
            opacity: 1;
            transform: scale(1.5);
        }
    `;
    document.head.appendChild(cursorStyle);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('active'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// LAZY LOADING FOR IMAGES
// ========================================

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

document.querySelectorAll('.project-slider img, .project-image-single img, .hero-image').forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// SCROLL TO TOP BUTTON (APPEARS AFTER SCROLLING)
// ========================================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
`;
scrollTopBtn.classList.add('scroll-top-btn');
document.body.appendChild(scrollTopBtn);

// Scroll to top button styles
const scrollTopStyle = document.createElement('style');
scrollTopStyle.textContent = `
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-color);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        z-index: 999;
    }
    .scroll-top-btn.visible {
        opacity: 1;
        visibility: visible;
    }
    .scroll-top-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }
`;
document.head.appendChild(scrollTopStyle);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event listeners
const optimizedScrollHandler = debounce(() => {
    highlightNavOnScroll();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

window.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for any entrance animations
    document.body.classList.add('loaded');

    // Trigger initial scroll check for nav highlighting
    highlightNavOnScroll();

    console.log('Portfolio website loaded successfully! 🚀');
});

// ========================================
// HANDLE PAGE VISIBILITY CHANGES
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all animations when tab is not visible
        document.querySelectorAll('.project-slider').forEach(slider => {
            const sliderInstance = slider.sliderInstance;
            if (sliderInstance) sliderInstance.stopAutoPlay();
        });
    } else {
        // Resume animations when tab is visible
        document.querySelectorAll('.project-slider').forEach(slider => {
            const sliderInstance = slider.sliderInstance;
            if (sliderInstance) sliderInstance.startAutoPlay();
        });
    }
});

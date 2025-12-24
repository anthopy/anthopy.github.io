// ===================================
// Configuration
// ===================================
const CONFIG = {
    typing: {
        phrases: {
            fr: ['Bonjour, je suis Anthony Miceli', 'Bienvenue sur mon portfolio', 'Data Science | IA | Finance'],
            en: ['Hello, I\'m Anthony Miceli', 'Welcome to my portfolio', 'Data Science | AI | Finance']
        },
        typeSpeed: 120,
        deleteSpeed: 50,
        pauseDuration: 3500
    }
};

// ===================================
// State
// ===================================
let currentLang = 'fr';
let currentTheme = localStorage.getItem('theme') || 'light';

// ===================================
// DOM Elements
// ===================================
const elements = {
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    hamburger: document.getElementById('hamburger'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    langToggle: document.getElementById('lang-toggle'),
    typingText: document.getElementById('typing-text'),
    contactForm: document.getElementById('contact-form'),
    cvBtn: document.getElementById('cv-btn'),
    cvModal: document.getElementById('cv-modal'),
    modalClose: document.getElementById('modal-close')
};

// ===================================
// Theme Management
// ===================================
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (elements.themeIcon) {
        elements.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleTheme() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// Initialize theme
setTheme(currentTheme);

// ===================================
// Language Management
// ===================================
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    
    // Update all elements with data-fr and data-en attributes
    document.querySelectorAll('[data-fr][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });
    
    // Update course tooltips based on language
    document.querySelectorAll('[data-tooltip-fr][data-tooltip-en]').forEach(el => {
        const tooltip = el.getAttribute(`data-tooltip-${lang}`);
        if (tooltip) {
            el.setAttribute('data-tooltip', tooltip);
        }
    });
    
    // Update form placeholders
    const placeholders = {
        fr: {
            name: 'Votre nom',
            email: 'votre@email.com',
            subject: 'Sujet de votre message',
            message: 'Votre message...'
        },
        en: {
            name: 'Your name',
            email: 'your@email.com',
            subject: 'Subject of your message',
            message: 'Your message...'
        }
    };
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    if (nameInput) nameInput.placeholder = placeholders[lang].name;
    if (emailInput) emailInput.placeholder = placeholders[lang].email;
    if (subjectInput) subjectInput.placeholder = placeholders[lang].subject;
    if (messageInput) messageInput.placeholder = placeholders[lang].message;
    
    // Update lang toggle button
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = lang === 'fr' ? 'EN' : 'FR';
    }
    
    // Restart typing animation with new language
    if (typingAnimationId) {
        clearTimeout(typingAnimationId);
        typingAnimationId = null;
    }
    startTypingAnimation();
}

function toggleLanguage() {
    setLanguage(currentLang === 'fr' ? 'en' : 'fr');
}

// ===================================
// Typing Animation
// ===================================
let typingAnimationId = null;
let currentCharIndex = 0;
let isDeleting = false;
let isPaused = false;
let fullText = '';

function startTypingAnimation() {
    const phrases = CONFIG.typing.phrases[currentLang];
    // Combine all phrases with line breaks
    fullText = phrases.join('\n');
    
    // Reset state
    currentCharIndex = 0;
    isDeleting = false;
    isPaused = false;
    
    // Clear the text first
    if (elements.typingText) {
        elements.typingText.textContent = '';
    }
    
    type();
}

function type() {
    if (!elements.typingText) return;
    
    if (isPaused) {
        isPaused = false;
        isDeleting = true;
        typingAnimationId = setTimeout(type, CONFIG.typing.pauseDuration);
        return;
    }
    
    if (isDeleting) {
        currentCharIndex--;
        elements.typingText.textContent = fullText.substring(0, currentCharIndex);
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            // Pause before starting to type again
            typingAnimationId = setTimeout(type, 500);
            return;
        }
        
        typingAnimationId = setTimeout(type, CONFIG.typing.deleteSpeed);
    } else {
        currentCharIndex++;
        elements.typingText.textContent = fullText.substring(0, currentCharIndex);
        
        if (currentCharIndex === fullText.length) {
            // All text typed, pause then delete
            isPaused = true;
            typingAnimationId = setTimeout(type, 100);
            return;
        }
        
        typingAnimationId = setTimeout(type, CONFIG.typing.typeSpeed);
    }
}

// ===================================
// Navigation
// ===================================
function handleScroll() {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        elements.navbar?.classList.add('scrolled');
    } else {
        elements.navbar?.classList.remove('scrolled');
    }
    
    // Reveal fade-in elements
    revealElements();
}

function toggleMobileMenu() {
    elements.hamburger?.classList.toggle('active');
    elements.navMenu?.classList.toggle('active');
}

function closeMobileMenu() {
    elements.hamburger?.classList.remove('active');
    elements.navMenu?.classList.remove('active');
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// ===================================
// Scroll Reveal Animation
// ===================================
function revealElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;
    
    fadeElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100;
        
        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('visible');
        }
    });
}

// ===================================
// Smooth Scroll
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const navHeight = elements.navbar?.offsetHeight || 70;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// CV Modal
// ===================================
function openCvModal() {
    elements.cvModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCvModal() {
    elements.cvModal?.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
function handleModalClick(e) {
    if (e.target === elements.cvModal) {
        closeCvModal();
    }
}

// Close modal with Escape key
function handleEscapeKey(e) {
    if (e.key === 'Escape' && elements.cvModal?.classList.contains('active')) {
        closeCvModal();
    }
}

// ===================================
// Contact Form
// ===================================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification(
            currentLang === 'fr' 
                ? 'Veuillez remplir tous les champs obligatoires.' 
                : 'Please fill in all required fields.',
            'error'
        );
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification(
            currentLang === 'fr' 
                ? 'Veuillez entrer une adresse email valide.' 
                : 'Please enter a valid email address.',
            'error'
        );
        return;
    }
    
    // Show loading state
    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    try {
        // Send to Formspree
        const response = await fetch('https://formspree.io/f/xnjaykrw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showNotification(
                currentLang === 'fr' 
                    ? 'Message envoyé avec succès !' 
                    : 'Message sent successfully!',
                'success'
            );
            elements.contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        showNotification(
            currentLang === 'fr' 
                ? 'Erreur lors de l\'envoi. Veuillez réessayer.' 
                : 'Error sending message. Please try again.',
            'error'
        );
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        borderRadius: '12px',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Language toggle
    elements.langToggle?.addEventListener('click', toggleLanguage);
    
    // Mobile menu
    elements.hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Form submission
    elements.contactForm?.addEventListener('submit', handleFormSubmit);
    
    // CV Modal
    elements.cvBtn?.addEventListener('click', openCvModal);
    elements.modalClose?.addEventListener('click', closeCvModal);
    elements.cvModal?.addEventListener('click', handleModalClick);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Initial reveal check
    revealElements();
}

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    startTypingAnimation();
    
    // Initialize course tooltips for default language (French)
    document.querySelectorAll('[data-tooltip-fr][data-tooltip-en]').forEach(el => {
        const tooltip = el.getAttribute('data-tooltip-fr');
        if (tooltip) {
            el.setAttribute('data-tooltip', tooltip);
        }
    });
    
    // Check system preference for theme
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            setTheme('dark');
        }
    }
});

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

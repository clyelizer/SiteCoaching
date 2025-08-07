// Fonction pour faire défiler vers une section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Variables globales
const header = document.querySelector('header');
const logo = document.querySelector('.logo');
const scrollThreshold = 100;
let lastScrollTop = 0;

// Gestion de la position de la navbar
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const scrollingDown = currentScroll > lastScrollTop;
    
    if (scrollingDown && currentScroll > scrollThreshold) {
        header.classList.remove('top');
        header.classList.add('bottom');
        if (logo) logo.style.display = 'none';
    } else if (!scrollingDown || currentScroll <= scrollThreshold) {
        header.classList.remove('bottom');
        header.classList.add('top');
        if (logo) logo.style.display = '';
    }
    
    lastScrollTop = currentScroll;
}, { passive: true });

// Gestion du thème sombre/clair
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Init du thème
    initializeTheme();
    
    // Init du chat
    const chat = new Chat();

    // Init du calendrier
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        const calendar = new Calendar(calendarContainer);
    }

    // Transitions des sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-transition');
        sectionObserver.observe(section);
    });

    // Lazy loading des images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Gestion du formulaire de contact
const formContact = document.getElementById('formulaire-contact');
if (formContact) {
  formContact.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nom: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        message: this.querySelector('textarea').value
    };

    // Vous pouvez remplacer cette alerte par un envoi réel à un serveur
    alert(`Message reçu !\nDe: ${formData.nom}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    
    // Réinitialisation du formulaire
    this.reset();
    const msg = document.createElement('div');
    msg.textContent = 'Merci pour votre message ! Je vous répondrai rapidement.';
    msg.style.background = '#2b2d42';
    msg.style.color = '#fff';
    msg.style.padding = '1rem';
    msg.style.marginTop = '1rem';
    msg.style.borderRadius = '8px';
    msg.style.textAlign = 'center';
    formContact.parentNode.insertBefore(msg, formContact.nextSibling);
    setTimeout(() => msg.remove(), 5000);
  });
}

// Animation des icônes sociales au survol
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Animation fade-in au scroll
function revealOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const triggerBottom = window.innerHeight * 0.92;
  fadeEls.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

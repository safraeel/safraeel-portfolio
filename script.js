const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const typewriterElement = document.getElementById('typewriter');
const texts = ['Safraeel', 'Frontend Developer', 'JavaScript Warrior', 'Problem Solver', 'Continuous Learner'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);

        charIndex--;

    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeWriter, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeWriter, 500);
    } else {
        setTimeout(typeWriter, isDeleting ? 50 : 100);
    }
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const width = bar.parentElement.getAttribute('data-width') + '%';
        bar.style.width = width;
    });
}

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.about-content > *');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(typeWriter, 1000);

    document.querySelectorAll('.about-content > *').forEach(element => {
        element.classList.add('fade-in');
    });

    handleScrollAnimations();

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksList = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksList) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinksList.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navLinksList.classList.remove('open');
            });
        });
    }
});

themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
});

window.addEventListener('scroll', function() {
    handleScrollAnimations();

    const aboutSection = document.getElementById('about');
    const aboutTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (aboutTop < windowHeight - 100) {
        animateSkillBars();
    }

    const navbar = document.getElementById('navbar');

    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';

    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
    }

    if (body.classList.contains('dark-mode')) {
        navbar.style.background = 'rgba(45, 45, 45, 0.95)';
    }
});
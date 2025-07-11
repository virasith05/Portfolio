document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Show loading state
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#fff';
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Success
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = '#4CAF50';
                    contactForm.reset();
                } else {
                    // Error
                    formStatus.textContent = data.error || 'Failed to send message. Please try again.';
                    formStatus.style.color = '#f44336';
                }
            } catch (error) {
                // Network error
                formStatus.textContent = 'Network error. Please check your connection and try again.';
                formStatus.style.color = '#f44336';
            }

            // Clear status message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        });
    }

    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // THEME SWITCHER LOGIC
    const themeSwitcherContainer = document.querySelector('.theme-switcher-container');
    const themeSwitcherBtn = document.querySelector('.theme-switcher-btn');
    const themeDropdown = document.querySelector('.theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeIcon = themeSwitcherBtn.querySelector('i');

    // Helper: set theme
    function setTheme(theme, save = true) {
        document.body.classList.remove('light-theme', 'dark-theme');
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.className = 'fas fa-sun';
        } else if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-moon';
        } else {
            // System
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
                themeIcon.className = 'fas fa-moon';
            } else {
                document.body.classList.add('light-theme');
                themeIcon.className = 'fas fa-sun';
            }
        }
        if (save) localStorage.setItem('theme', theme);
    }

    // Load theme from storage or system
    function loadTheme() {
        const saved = localStorage.getItem('theme') || 'system';
        setTheme(saved, false);
    }

    // Dropdown toggle
    themeSwitcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeSwitcherContainer.classList.toggle('open');
    });
    // Close dropdown on outside click
    document.addEventListener('click', () => {
        themeSwitcherContainer.classList.remove('open');
    });
    // Theme option click
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selected = option.getAttribute('data-theme');
            setTheme(selected);
            themeSwitcherContainer.classList.remove('open');
        });
    });
    // Listen for system theme changes if 'system' is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem('theme') || 'system') === 'system') {
            setTheme('system', false);
        }
    });
    // On load
    loadTheme();
}); 
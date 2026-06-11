// ============================================
// 1. DARK MODE TOGGLE (Nilai Plus)
// ============================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
    const html = document.documentElement;
    
    // Helper function to apply dark mode
    const applyDarkMode = (isDark) => {
        if (isDark) {
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };
    
    // Check saved preference or default to system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    let isDarkMode;
    
    if (savedDarkMode !== null) {
        // Use saved preference
        isDarkMode = savedDarkMode === 'true';
    } else {
        // Use system preference
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Apply initial dark mode
    applyDarkMode(isDarkMode);
    
    // Toggle dark mode on button click
    const toggleDarkMode = () => {
        const isDark = html.classList.contains('dark');
        applyDarkMode(!isDark);
        
        // Trigger AOS refresh if available
        if (window.AOS) {
            AOS.refresh();
        }
    };
    
    // Add event listeners to both desktop and mobile buttons
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', toggleDarkMode);
    }
    
    // Listen for system theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            applyDarkMode(e.matches);
        }
    });
}

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            } else {
                mobileMenu.style.maxHeight = '0';
            }
        });
        
        // Close menu when link clicked
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenu.style.maxHeight = '0';
            });
        });
    }
}

// ============================================
// 3. INITIALIZE AOS ANIMATION
// ============================================
function initAOSAnimation() {
    if (window.AOS) {
        AOS.init({
            once: true,
            offset: 100,
            duration: 800,
            disable: false,
            startEvent: 'DOMContentLoaded'
        });
    }
}

// ============================================
// 4. FORM VALIDASI JAVASCRIPT
// ============================================
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ambil value input
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Ambil element error
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const successNotif = document.getElementById('successNotif');
        
        let isValid = true;

        // Validasi Nama (minimal 3 karakter)
        if(name === "" || name.length < 3) {
            nameError.classList.remove('hidden');
            isValid = false;
        } else {
            nameError.classList.add('hidden');
        }

        // Validasi Email dengan regex yang lebih akurat
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email === "" || !email.match(emailPattern)) {
            emailError.classList.remove('hidden');
            isValid = false;
        } else {
            emailError.classList.add('hidden');
        }

        // Validasi Pesan (minimal 5 karakter)
        if(message === "" || message.length < 5) {
            messageError.classList.remove('hidden');
            isValid = false;
        } else {
            messageError.classList.add('hidden');
        }

        // Jika valid semua, tampilkan notifikasi sukses
        if(isValid) {
            successNotif.classList.remove('hidden');
            contactForm.reset();
            
            // Hilangkan notif setelah 4 detik
            setTimeout(() => {
                successNotif.classList.add('hidden');
            }, 4000);
        }
    });
}

// ============================================
// 5. BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 6. COUNTER ANIMATION (Nilai Plus)
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    let counterStarted = false;
    
    const startCounters = () => {
        if (counterStarted) return;
        counterStarted = true;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            
            const updateCount = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(progress * target);
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCount();
        });
    };
    
    // Start counter when stats section is visible
    const statsSection = document.querySelector('.bg-blue-600.text-white');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// ============================================
// 7. SMOOTH SCROLL BEHAVIOR
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// 8. LAZY LOADING IMAGES (Nilai Plus)
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src || img.getAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// 9. INITIALIZE ALL ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initAOSAnimation();
    initMobileMenu();
    initFormValidation();
    initBackToTop();
    initCounterAnimation();
    initSmoothScroll();
    initLazyLoading();
});

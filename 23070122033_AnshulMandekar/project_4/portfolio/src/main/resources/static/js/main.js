// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 90
    });

    // Typing Effect
    const typingTexts = [
        "Computer Science Engineer",
        "Java Developer",
        "Spring Boot Developer",
        "DevOps Enthusiast",
        "AI Engineer"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        function type() {
            const currentText = typingTexts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = 100;
            if (isDeleting) {
                typeSpeed /= 2;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
                typeSpeed = 500; // Pause before typing next
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const particlesBg = document.querySelector('.particles-bg');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-sm');
                navbar.style.background = 'rgba(5, 6, 8, 0.96)';
                navbar.style.boxShadow = '0 14px 40px rgba(0, 0, 0, 0.32)';
            } else {
                navbar.classList.remove('shadow-sm');
                navbar.style.background = 'rgba(5, 6, 8, 0.82)';
                navbar.style.boxShadow = 'none';
            }

            if (particlesBg) {
                particlesBg.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * -0.08, 0)}px`);
            }
        });
    }

    AOS.refresh();

    // Progress bar animation on scroll
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('aria-valuenow');
                    entry.target.style.width = width + '%';
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }
});

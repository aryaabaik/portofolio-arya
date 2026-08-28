/**
 * Portfolio JS — Vanilla JavaScript interactions & animations
 * No external libraries. Lightweight & performant.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================
    // 1. Smooth Scrolling for all anchor links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // =========================================
    // 1b. "Scroll to explore" click handler
    // =========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.cursor = 'pointer';
        scrollIndicator.addEventListener('click', () => {
            const detailsSection = document.getElementById('details');
            if (!detailsSection) return;

            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = detailsSection.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    
    const revealTargets = document.querySelectorAll(
        '.info-item-editorial, .about-editorial-section, .keahlian-item, .karya-item, .details-section .detail-card, .keahlian-section .keahlian-card, .footer'
    );

    // Set initial hidden state
    revealTargets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target); // Run only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));

 
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = 0;
        const handleNavbarScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 20) {
                navbar.style.boxShadow = '0 4px 20px rgba(26, 58, 92, 0.06)';
                navbar.style.borderBottomColor = 'transparent';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.borderBottomColor = '#e1e8ed';
            }
            lastScrollY = scrollY;
        };

        // Use passive listener for performance
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
        handleNavbarScroll(); // Initial check
    }

    // =========================================
    // 4. Card hover interaction (subtle lift)
    //    Already handled in CSS, but we add a
    //    smoother feel with active/mousedown state
    // =========================================
    document.querySelectorAll('.detail-card, .keahlian-card').forEach(card => {
        card.addEventListener('mousedown', () => {
            card.style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseup', () => {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // =========================================
    // 5. Button press (click) effect
    // =========================================
    document.querySelectorAll('.btn-primary, .btn-cta-primary, .btn-secondary, .navbar-contact').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(0) scale(0.97)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // =========================================
    // 6. Active navigation indicator (Scrollspy)
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a');

    const activateNavLink = () => {
        if (!sections || sections.length === 0) return;

        const scrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const scrollPosition = scrollY + navbarHeight + 120;

        let currentSection = 'profile';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop) {
                currentSection = sectionId;
            }
        });

        // If user is at or near the very bottom of the page, pick the last section
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                currentSection = lastSection.getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active', 'nav-active');

            if (href === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink, { passive: true });
    window.addEventListener('resize', activateNavLink, { passive: true });
    activateNavLink(); // Initial check

    console.log('Portfolio JS loaded');
});

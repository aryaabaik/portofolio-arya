/**
 * Portfolio JS — Vanilla JavaScript interactions & animations
 * Lightweight, accessible, and performant.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================
    // 1. Smooth Scrolling for all anchor links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            const navbar = document.querySelector('.navbar') || document.querySelector('.home-navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });

            // Update URL hash without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        });
    });

    // =========================================
    // 2. Navbar elevation on scroll
    // =========================================
    const header = document.querySelector('.navbar-header');
    if (header) {
        const handleNavbarScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
        handleNavbarScroll();
    }

    // =========================================
    // 3. Scrollspy: Active navigation indicator
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a, .home-nav-links a');

    if (sections.length > 0 && navLinks.length > 0) {
        const activateNavLink = () => {
            const scrollY = window.scrollY;
            const navbarEl = document.querySelector('.navbar') || document.querySelector('.home-navbar');
            const navbarHeight = navbarEl ? navbarEl.offsetHeight : 70;
            const scrollPosition = scrollY + navbarHeight + 100;

            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                    currentSection = sectionId;
                }
            });

            // If at bottom of page, activate last section
            if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50)) {
                const lastSection = sections[sections.length - 1];
                if (lastSection) {
                    currentSection = lastSection.getAttribute('id');
                }
            }

            if (currentSection) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + currentSection) {
                        link.classList.add('active');
                    } else if (href && href.startsWith('#')) {
                        link.classList.remove('active', 'nav-active');
                    }
                });
            }
        };

        window.addEventListener('scroll', activateNavLink, { passive: true });
        activateNavLink();
    }
});

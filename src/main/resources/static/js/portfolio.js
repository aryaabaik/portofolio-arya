/**
 * Portfolio JS — Vanilla JavaScript interactions & animations
 * Lightweight, accessible, and performant.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Add js-enabled class for progressive enhancement
    document.documentElement.classList.add('js-enabled');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================
    // 0. Update current year in footer
    // =========================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // =========================================
    // 0.5 Mobile Menu Toggle
    // =========================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.home-nav-links') || document.querySelector('.navbar-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('nav-open');
            navLinksContainer.classList.toggle('nav-open');

            // ARIA accessibility
            const isOpen = navLinksContainer.classList.contains('nav-open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu when clicking a link
        const links = navLinksContainer.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('nav-open');
                navLinksContainer.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on tap outside (mobile)
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
                menuToggle.classList.remove('nav-open');
                navLinksContainer.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

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

            if (window.portfolioLenis) {
                window.portfolioLenis.scrollTo(targetEl, { offset: -navbarHeight - 16 });
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
                return;
            }

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
    // 1.5 Minimalist Editorial Scroll Reading Bar
    // =========================================
    const progressBar = document.getElementById('scrollProgressBar');
    if (progressBar) {
        let progressTicking = false;
        const updateProgressBar = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
            progressBar.style.transform = `scaleX(${progress})`;
            progressTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!progressTicking) {
                window.requestAnimationFrame(updateProgressBar);
                progressTicking = true;
            }
        }, { passive: true });
        updateProgressBar();
    }

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

    // =========================================
    // 4. Master-Tier Editorial Scroll Reveal (Zero Jitter, Smooth Cadence)
    // =========================================
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // Unobserve so it remains revealed permanently without flickering
                    observerInstance.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.12
        });

        // 1. About section narrative & artwork
        const aboutContent = document.querySelector('.about-content-left');
        if (aboutContent) {
            aboutContent.classList.add('scroll-reveal-left');
            revealObserver.observe(aboutContent);
        }

        const aboutArt = document.querySelector('.about-art-card');
        if (aboutArt) {
            aboutArt.classList.add('scroll-reveal-right');
            revealObserver.observe(aboutArt);
        }

        // 2. Section Headers
        document.querySelectorAll('.keahlian-header, .karya-header, .contact-header').forEach(el => {
            el.classList.add('scroll-reveal');
            revealObserver.observe(el);
        });

        // 3. Skills Cards with Cascading Row Stagger
        const skillCards = document.querySelectorAll('.keahlian-grid .keahlian-item');
        skillCards.forEach((card, idx) => {
            card.classList.add('scroll-reveal-scale', 'stagger-card');
            card.style.setProperty('--stagger-i', idx % 4);
            revealObserver.observe(card);
        });

        // 4. Project Deck
        const projectControls = document.querySelector('.karya-deck-controls');
        if (projectControls) {
            projectControls.classList.add('scroll-reveal');
            revealObserver.observe(projectControls);
        }

        const projectFanRow = document.getElementById('karyaFanRow');
        if (projectFanRow) {
            projectFanRow.classList.add('scroll-reveal');
            revealObserver.observe(projectFanRow);
        }

        // 5. Contact Section & Buttons
        const contactButtons = document.querySelectorAll('.contact-buttons-wrapper .btn-pill');
        contactButtons.forEach((btn, idx) => {
            btn.classList.add('scroll-reveal-scale', 'stagger-card');
            btn.style.setProperty('--stagger-i', idx);
            revealObserver.observe(btn);
        });

        // 6. Footer
        const footerContent = document.querySelector('.footer-container');
        if (footerContent) {
            footerContent.classList.add('scroll-reveal');
            revealObserver.observe(footerContent);
        }
    }

    // =========================================
    // 5. Hero Optical Depth Parallax (Desktop)
    // =========================================
    if (!prefersReducedMotion && window.innerWidth > 768) {
        const heroSection = document.querySelector('.profile-hero-section');
        const heroCoverImg = document.querySelector('.hero-cover-img');
        const heroHaloArc = document.querySelector('.hero-halo-arc');

        if (heroSection && heroCoverImg) {
            let heroTicking = false;

            const updateHeroParallax = () => {
                const scrollY = window.scrollY;
                const heroHeight = heroSection.offsetHeight;

                if (scrollY <= heroHeight + 50) {
                    const ratio = scrollY / heroHeight;
                    // Photo subtly sinks down creating realistic 3D depth separation
                    const photoY = scrollY * 0.18;
                    heroCoverImg.style.transform = `translate3d(0, ${photoY}px, 0)`;

                    // Halo subtly scales and breathes
                    if (heroHaloArc) {
                        const haloScale = 1 + ratio * 0.08;
                        const haloOpacity = Math.max(0, 1 - ratio * 1.2);
                        heroHaloArc.style.transform = `translate(-50%, -70%) scale(${haloScale})`;
                        heroHaloArc.style.opacity = haloOpacity;
                    }
                }
                heroTicking = false;
            };

            window.addEventListener('scroll', () => {
                if (!heroTicking) {
                    window.requestAnimationFrame(updateHeroParallax);
                    heroTicking = true;
                }
            }, { passive: true });
        }
    }

    // =========================================
    // 6. Mobile Touch UX Improvements
    // =========================================
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
        // Add active tap ripple feedback to cards
        document.querySelectorAll('.karya-item, .keahlian-item, .hero-meta-card, .stat-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.willChange = 'transform';
            }, { passive: true });

            card.addEventListener('touchend', () => {
                card.style.willChange = '';
            }, { passive: true });
        });

        // Show swipe hint briefly on project fan row
        const fanRowEl = document.getElementById('karyaFanRow');
        if (fanRowEl) {
            const hint = document.querySelector('.karya-deck-hint');
            if (hint) {
                hint.style.opacity = '1';
                setTimeout(() => {
                    hint.style.transition = 'opacity 1s ease';
                    hint.style.opacity = '0.55';
                }, 2000);
            }

            // Auto-scroll to first card on reveal
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const firstCard = fanRowEl.querySelector('.karya-item');
                        if (firstCard) {
                            firstCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        }
                        scrollObserver.disconnect();
                    }
                });
            }, { threshold: 0.3 });

            scrollObserver.observe(fanRowEl);
        }
    }

});

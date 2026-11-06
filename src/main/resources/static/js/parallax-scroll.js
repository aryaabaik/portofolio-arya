/**
 * ==========================================================================
 * PORTFOLIO PARALLAX SCROLL SYSTEM — CINEMATIC MULTI-LAYER ENGINE
 * Vanilla JavaScript + GSAP ScrollTrigger + Lenis Smooth Scroll
 * Fully reversible, continuously synchronized, multi-layer depth experience.
 * ==========================================================================
 */

(function () {
    'use strict';

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.log('[Parallax] prefers-reduced-motion active: Parallax animations bypassed.');
        return;
    }

    let lenis = null;
    let scrollTriggerInstances = [];

    // Helper: detect mobile screen
    function isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * 1. Initialize Lenis Smooth Scrolling & Integrate with GSAP
     */
    function initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('[Parallax] Lenis library not loaded; falling back to standard scroll.');
            return;
        }

        // Avoid multiple instances
        if (window.portfolioLenis) {
            window.portfolioLenis.destroy();
        }

        lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.95,
            smoothTouch: false,
            touchMultiplier: 1.5,
            infinite: false,
        });

        window.portfolioLenis = lenis;

        // Sync Lenis scroll events with GSAP ScrollTrigger
        lenis.on('scroll', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
            }
        });

        // Single GSAP ticker loop (eliminates duplicate requestAnimationFrame)
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // Bind in-page anchor links to Lenis smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navbar = document.querySelector('.navbar') || document.querySelector('.navbar-header');
                    const offset = navbar ? -navbar.offsetHeight - 16 : -70;
                    lenis.scrollTo(target, { offset: offset });
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    /**
     * 2. Section: HOME (Hero Welcome)
     */
    function initHomeSection(section) {
        if (!section) return;
        const mobile = isMobile();

        // Layer BG: Contour lines & watercolor glyphs
        const bgElements = section.querySelectorAll('[data-parallax-layer="bg"]');
        bgElements.forEach((bg) => {
            const tween = gsap.to(bg, {
                yPercent: mobile ? 14 : 26,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });

        // Layer 3: Left Column (Headline, Eyebrow, Bio)
        const leftContent = section.querySelector('.hero-content-col, [data-parallax-layer="3"]');
        if (leftContent) {
            const tween = gsap.to(leftContent, {
                yPercent: mobile ? -14 : -28,
                opacity: 0.85,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 2: Right Column Editorial Portrait Card
        const portraitCard = section.querySelector('.portrait-card, .editorial-portrait-frame');
        if (portraitCard) {
            const tween = gsap.to(portraitCard, {
                yPercent: mobile ? 12 : 24,
                scale: mobile ? 1.02 : 1.06,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 4: Floating Ocean Elements (Fish & Shell)
        const fish = section.querySelector('.decor-fish, [data-parallax-layer="4"]:first-of-type');
        if (fish) {
            const tween = gsap.to(fish, {
                yPercent: mobile ? -30 : -65,
                xPercent: mobile ? 0 : -14,
                rotation: mobile ? -5 : -12,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        const shell = section.querySelector('.decor-shell');
        if (shell) {
            const tween = gsap.to(shell, {
                yPercent: mobile ? -25 : -55,
                xPercent: mobile ? 0 : 14,
                rotation: mobile ? 6 : 20,
                scale: mobile ? 1.06 : 1.16,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }
    }

    /**
     * 3. Section: PROFILE (Hero Cutout + Kinetic Title)
     */
    function initProfileSection(section) {
        if (!section) return;
        const mobile = isMobile();

        // Layer BG: Kinetic Grid
        const bg = section.querySelector('[data-parallax-layer="bg"], .kinetic-grid-bg');
        if (bg) {
            const tween = gsap.to(bg, {
                yPercent: mobile ? 12 : 26,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 1: Halo Arc behind head
        const haloArc = section.querySelector('.hero-halo-arc, [data-parallax-layer="1"]');
        if (haloArc) {
            const tween = gsap.to(haloArc, {
                yPercent: mobile ? -10 : -18,
                scale: mobile ? 1.05 : 1.12,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 1: Horizontal Deco Lines
        const decoLines = section.querySelectorAll('.hero-deco-line');
        decoLines.forEach((line) => {
            const isLeft = line.classList.contains('hero-deco-line-left');
            const tween = gsap.to(line, {
                xPercent: mobile ? (isLeft ? -5 : 5) : (isLeft ? -16 : 16),
                yPercent: mobile ? -12 : -26,
                opacity: 0.7,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });

        // Layer 4: Deco Stars
        const decoStars = section.querySelectorAll('.hero-deco-star');
        decoStars.forEach((star, idx) => {
            const dir = idx % 2 === 0 ? 1 : -1;
            const tween = gsap.to(star, {
                yPercent: mobile ? -30 : -62,
                rotation: dir * (mobile ? 25 : 60),
                scale: mobile ? 1.1 : 1.28,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });

        // Layer 3: Kinetic Title "ARYA ADHITYA" (Moves Upward Rapidly)
        const kineticTitle = section.querySelector('.hero-kinetic-title, [data-parallax-layer="3"]');
        if (kineticTitle) {
            const tween = gsap.to(kineticTitle, {
                yPercent: mobile ? -24 : -46,
                opacity: 0.72,
                scale: mobile ? 0.98 : 0.95,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 2: Main Portrait Cutout (Moves Downward for 3D separation)
        const portraitStage = section.querySelector('.hero-portrait-stage, [data-parallax-layer="2"]');
        if (portraitStage) {
            const tween = gsap.to(portraitStage, {
                yPercent: mobile ? 10 : 22,
                scale: mobile ? 1.02 : 1.05,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }
    }

    /**
     * 4. Section: ABOUT (Narrative + Art Frame)
     */
    function initAboutSection(section) {
        if (!section) return;
        const mobile = isMobile();

        // Layer BG: Glyph Canvas
        const bg = section.querySelector('[data-parallax-layer="bg"], .glyph-bg');
        if (bg) {
            const tween = gsap.to(bg, {
                yPercent: mobile ? 12 : 25,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 2: Narrative Column
        const narrativeCol = section.querySelector('.about-content-left, [data-parallax-layer="2"]');
        if (narrativeCol) {
            const tween = gsap.to(narrativeCol, {
                yPercent: mobile ? -16 : -34,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 3: Right Art Card (Contrasting faster speed & subtle tilt)
        const artCol = section.querySelector('.about-artwork-right, [data-parallax-layer="3"], .about-art-card');
        if (artCol) {
            const tween = gsap.to(artCol, {
                yPercent: mobile ? -3 : -4,
                scale: mobile ? 1.01 : 1.02,
                rotation: mobile ? 0 : 0.5,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 1: Ambient Luxury Glows (Crimson & Gold Orbs)
        const aboutGlows = section.querySelectorAll('.about-glow');
        aboutGlows.forEach((glow, idx) => {
            const speed = idx % 2 === 0 ? 0.22 : -0.18;
            const tween = gsap.to(glow, {
                yPercent: mobile ? speed * 50 : speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });
    }

    /**
     * 5. Section: KEAHLIAN (Staggered Floating Skills Grid)
     */
    function initKeahlianSection(section) {
        if (!section) return;
        const mobile = isMobile();

        // Layer 3: Header
        const header = section.querySelector('.keahlian-header, [data-parallax-layer="3"]');
        if (header) {
            const tween = gsap.to(header, {
                yPercent: mobile ? -15 : -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Skill Cards: Alternating Depth Wave
        const cards = section.querySelectorAll('.keahlian-item');
        cards.forEach((card, idx) => {
            const isOdd = idx % 2 === 0;
            const targetY = isOdd ? (mobile ? -15 : -28) : (mobile ? -25 : -52);
            const targetScale = isOdd ? 1.02 : 1.04;

            const tween = gsap.to(card, {
                yPercent: targetY,
                scale: mobile ? 1 : targetScale,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });
    }

    /**
     * 6. Section: PROJECT (Showcase + Gallery Stage Parallax)
     */
    function initProjectSection(section) {
        if (!section) return;
        const mobile = isMobile();

        // Layer BG: Dark Kinetic Grid
        const bg = section.querySelector('[data-parallax-layer="bg"], .kinetic-grid-black');
        if (bg) {
            const tween = gsap.to(bg, {
                yPercent: mobile ? 12 : 24,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 3: Project Hero Header
        const hero = section.querySelector('.project-hero, [data-parallax-layer="3"]');
        if (hero) {
            const tween = gsap.to(hero, {
                yPercent: mobile ? -16 : -34,
                opacity: 0.85,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Project Items Internal Preview Image Travel
        const previewImgs = section.querySelectorAll('.reveal-item-img, [data-parallax-layer="img"]');
        previewImgs.forEach((img) => {
            const tween = gsap.fromTo(
                img,
                { yPercent: mobile ? -10 : -18, scale: mobile ? 1.03 : 1.08 },
                {
                    yPercent: mobile ? 10 : 18,
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.project-reveal-item') || section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                }
            );
            scrollTriggerInstances.push(tween.scrollTrigger);
        });
    }

    /**
     * 7. Section: CONTACT (Closing Buoyant Composition)
     */
    function initContactSection(section) {
        if (!section) return;
        const mobile = isMobile();

        // Layer 3: Header
        const header = section.querySelector('.contact-header, [data-parallax-layer="3"]');
        if (header) {
            const tween = gsap.to(header, {
                yPercent: mobile ? -14 : -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        }

        // Layer 2: Action Buttons Wrapper & Staggered Pills
        const pills = section.querySelectorAll('.btn-pill, [data-parallax-layer="pill"]');
        pills.forEach((pill, idx) => {
            const stepY = -32 - idx * (mobile ? 6 : 12);
            const tween = gsap.to(pill, {
                yPercent: stepY,
                scale: mobile ? 1 : 1.03,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.1,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });
    }

    /**
     * 8. Cinematic Section Transitions (Inter-section continuous depth)
     */
    function initSectionTransitions() {
        const sections = document.querySelectorAll('section[id], main.home-hero-main');
        sections.forEach((sec, idx) => {
            if (idx === 0) return; // Opening section is already in view

            const tween = gsap.fromTo(
                sec,
                { opacity: 0.88, y: 35 },
                {
                    opacity: 1,
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sec,
                        start: 'top 92%',
                        end: 'top 65%',
                        scrub: 1,
                    },
                }
            );
            scrollTriggerInstances.push(tween.scrollTrigger);
        });
    }

    /**
     * 9. Ambient Glows Drift
     */
    function initAmbientGlows() {
        const glows = document.querySelectorAll('.ambient-glow');
        glows.forEach((glow, idx) => {
            const dir = idx % 2 === 0 ? 0.35 : -0.25;
            const tween = gsap.to(glow, {
                y: window.innerHeight * dir,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5,
                },
            });
            scrollTriggerInstances.push(tween.scrollTrigger);
        });
    }

    /**
     * 10. Master Initialization
     */
    function init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('[Parallax] GSAP or ScrollTrigger is missing from the page.');
            return;
        }

        // Register plugin
        gsap.registerPlugin(ScrollTrigger);

        // Initialize Lenis smooth scrolling
        initLenis();

        // 1. Home section (on / or /home)
        const homeSection = document.querySelector('[data-parallax-section="home"], .home-hero-main');
        if (homeSection) {
            initHomeSection(homeSection);
        }

        // 2. Profile section (on /profile)
        const profileSection = document.querySelector('[data-parallax-section="profile"], #profile');
        if (profileSection) {
            initProfileSection(profileSection);
        }

        // 3. About section
        const aboutSection = document.querySelector('[data-parallax-section="about"], #about');
        if (aboutSection) {
            initAboutSection(aboutSection);
        }

        // 4. Keahlian section
        const keahlianSection = document.querySelector('[data-parallax-section="keahlian"], #keahlian');
        if (keahlianSection) {
            initKeahlianSection(keahlianSection);
        }

        // 5. Project section
        const projectSection = document.querySelector('[data-parallax-section="project"], #project');
        if (projectSection) {
            initProjectSection(projectSection);
        }

        // 6. Contact section
        const contactSection = document.querySelector('[data-parallax-section="contact"], #contact');
        if (contactSection) {
            initContactSection(contactSection);
        }

        // 7. Transitions & Glows
        initSectionTransitions();
        initAmbientGlows();

        // Refresh triggers after DOM settling
        ScrollTrigger.refresh();

        // Handle window resize with debounce
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        });

        console.log('[Parallax] Cinematic Multi-Layer Parallax System initialized successfully.');
    }

    /**
     * 11. Cleanup routine
     */
    function cleanup() {
        if (lenis) {
            lenis.destroy();
            lenis = null;
            window.portfolioLenis = null;
        }
        scrollTriggerInstances.forEach((st) => {
            if (st) st.kill();
        });
        scrollTriggerInstances = [];
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose control API
    window.portfolioParallax = { init, cleanup };
})();

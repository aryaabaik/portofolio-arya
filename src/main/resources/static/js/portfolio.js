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

    // =========================================
    // 4. Scroll Reveal: Animate elements on scroll
    // =========================================
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    entry.target.classList.remove('reveal-on-scroll');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.about-content-left, .about-art-card, .keahlian-header, .karya-header, .contact-container, .footer-container').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });

        document.querySelectorAll('.keahlian-grid .keahlian-item').forEach((el, i) => {
            el.classList.add('reveal-on-scroll');
            el.style.transitionDelay = `${i * 0.08}s`;
            observer.observe(el);
        });

        // Project fan rows with smooth reveal
        document.querySelectorAll('.karya-fan-row').forEach((row, rowIndex) => {
            row.style.transitionDelay = `${rowIndex * 0.2}s`;
            observer.observe(row);
        });

        document.querySelectorAll('.about-artwork-right, .keahlian-decor-omba, .karya-decor-bintang, .contact-ocean-decor').forEach((el, i) => {
            el.classList.add('reveal-on-scroll');
            el.style.transitionDelay = `${0.12 + i * 0.05}s`;
            observer.observe(el);
        });
    }

    // =========================================
    // 5. Optional Subtle Parallax (Desktop only)
    // =========================================
    if (!prefersReducedMotion && window.innerWidth > 960 && !('ontouchstart' in window)) {
        let ticking = false;
        
        const handleParallax = () => {
            const scrolled = window.scrollY;
            
            document.querySelectorAll('.karya-item::after').forEach((el) => {
                const speed = 0.5;
                const yPos = -(scrolled * speed * 0.02);
                if (el.style) {
                    el.style.transform = `translate(${yPos}px, ${yPos}px)`;
                }
            });
            
            ticking = false;
        };

        const requestParallax = () => {
            if (!ticking) {
                window.requestAnimationFrame(handleParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallax, { passive: true });
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

    // =========================================================================
    // 7. GOD-TIER PROJECT ANIMATIONS (3D Tilt, Glare, In-Card Slider, Lightbox)
    // =========================================================================
    initGodTierProjectAnimations();
});

function initGodTierProjectAnimations() {
    const fanRow = document.getElementById('karyaFanRow');
    const projectCards = document.querySelectorAll('.karya-item');
    const prevDeckBtn = document.querySelector('.deck-btn-prev');
    const nextDeckBtn = document.querySelector('.deck-btn-next');

    // ─────────────────────────────────────────────
    // A. 3D Tilt & Specular Holographic Glare (Desktop only)
    // ─────────────────────────────────────────────
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (projectCards.length > 0 && !isTouch) {
        projectCards.forEach((card) => {
            let isHovering = false;

            card.addEventListener('mouseenter', () => {
                isHovering = true;
                card.classList.add('is-hovered');
                if (fanRow) fanRow.classList.add('has-hovered');
            });

            card.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;

                // Max 10 deg tilt
                const tiltX = -(percentY * 12).toFixed(2);
                const tiltY = (percentX * 14).toFixed(2);

                const glareX = ((x / rect.width) * 100).toFixed(1);
                const glareY = ((y / rect.height) * 100).toFixed(1);

                card.style.setProperty('--tilt-x', `${tiltX}deg`);
                card.style.setProperty('--tilt-y', `${tiltY}deg`);
                card.style.setProperty('--mouse-x', `${glareX}%`);
                card.style.setProperty('--mouse-y', `${glareY}%`);
            });

            card.addEventListener('mouseleave', () => {
                isHovering = false;
                card.classList.remove('is-hovered');
                if (fanRow) fanRow.classList.remove('has-hovered');
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });

            // ─────────────────────────────────────────
            // B. In-Card Multi-Photo Slider
            // ─────────────────────────────────────────
            const slidesTrack = card.querySelector('.karya-slides-track');
            const slides = card.querySelectorAll('.karya-slide');
            const prevSlideBtn = card.querySelector('.karya-slide-nav.slide-prev');
            const nextSlideBtn = card.querySelector('.karya-slide-nav.slide-next');
            const dots = card.querySelectorAll('.karya-dot');

            if (slides.length > 1) {
                let currentSlideIdx = 0;

                const showSlide = (idx) => {
                    if (idx < 0) idx = slides.length - 1;
                    if (idx >= slides.length) idx = 0;
                    currentSlideIdx = idx;

                    slides.forEach((sl, i) => {
                        sl.classList.toggle('active', i === currentSlideIdx);
                    });

                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentSlideIdx);
                    });
                };

                if (prevSlideBtn) {
                    prevSlideBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showSlide(currentSlideIdx - 1);
                    });
                }

                if (nextSlideBtn) {
                    nextSlideBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showSlide(currentSlideIdx + 1);
                    });
                }

                dots.forEach((dot, i) => {
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showSlide(i);
                    });
                });

                // Swipe gesture support on card image
                let touchStartX = 0;
                let touchEndX = 0;
                if (slidesTrack) {
                    slidesTrack.addEventListener('touchstart', (e) => {
                        touchStartX = e.changedTouches[0].screenX;
                    }, { passive: true });

                    slidesTrack.addEventListener('touchend', (e) => {
                        touchEndX = e.changedTouches[0].screenX;
                        const diff = touchEndX - touchStartX;
                        if (Math.abs(diff) > 40) {
                            if (diff < 0) showSlide(currentSlideIdx + 1);
                            else showSlide(currentSlideIdx - 1);
                        }
                    }, { passive: true });
                }
            }
        });
    }

    // ─────────────────────────────────────────────
    // C. Fan Deck Drag-to-Scroll & Navigation
    // ─────────────────────────────────────────────
    if (fanRow) {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let hasMoved = false;

        fanRow.addEventListener('mousedown', (e) => {
            // Ignore if clicking on interactive elements
            if (e.target.closest('button') || e.target.closest('a')) return;
            isDown = true;
            hasMoved = false;
            fanRow.classList.add('is-dragging');
            startX = e.pageX - fanRow.offsetLeft;
            scrollLeft = fanRow.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                fanRow.classList.remove('is-dragging');
            }
        });

        fanRow.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                fanRow.classList.remove('is-dragging');
            }
        });

        fanRow.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - fanRow.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) hasMoved = true;
            fanRow.scrollLeft = scrollLeft - walk;
        });

        const cards = Array.from(fanRow.querySelectorAll('.karya-item'));

        const getActiveIndex = () => {
            const rowRect = fanRow.getBoundingClientRect();
            const rowCenter = rowRect.left + rowRect.width / 2;
            let closestIdx = 0;
            let closestDist = Infinity;
            cards.forEach((card, idx) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const dist = Math.abs(cardCenter - rowCenter);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = idx;
                }
            });
            return closestIdx;
        };

        const scrollToCard = (index) => {
            if (cards.length === 0) return;
            // Wrap around or clamp
            if (index < 0) index = cards.length - 1;
            if (index >= cards.length) index = 0;
            
            cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        };

        if (prevDeckBtn) {
            prevDeckBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentIdx = getActiveIndex();
                scrollToCard(currentIdx - 1);
            });
        }

        if (nextDeckBtn) {
            nextDeckBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentIdx = getActiveIndex();
                scrollToCard(currentIdx + 1);
            });
        }
    }

    // ─────────────────────────────────────────────
    // D. Fullscreen Lightbox Modal Controller
    // ─────────────────────────────────────────────
    const lightbox = document.getElementById('karyaLightbox');
    if (!lightbox) return;

    const overlay = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const mainImg = document.getElementById('lightboxMainImg');
    const counterEl = document.getElementById('lightboxCounter');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');
    const thumbsContainer = document.getElementById('lightboxThumbs');

    let currentPhotos = [];
    let currentPhotoIdx = 0;

    const openLightbox = (card, startIndex = 0) => {
        const title = card.getAttribute('data-title') || 'Proyek';
        const desc = card.getAttribute('data-desc') || '';

        // Collect photos
        currentPhotos = [];
        for (let i = 1; i <= 5; i++) {
            const attr = i === 1 ? 'data-foto' : `data-foto${i}`;
            const val = card.getAttribute(attr);
            if (val && val.trim() !== '') {
                currentPhotos.push(`/images/${val.trim()}`);
            }
        }

        // Fallback: look for <img> in card
        if (currentPhotos.length === 0) {
            card.querySelectorAll('.karya-img').forEach(img => {
                if (img.src) currentPhotos.push(img.src);
            });
        }

        if (currentPhotos.length === 0) return;

        titleEl.textContent = title;
        descEl.textContent = desc;
        currentPhotoIdx = Math.min(startIndex, currentPhotos.length - 1);

        // Build thumbnails
        thumbsContainer.innerHTML = '';
        currentPhotos.forEach((src, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `karya-lb-thumb ${idx === currentPhotoIdx ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${src}" alt="Thumb ${idx + 1}" loading="lazy">`;
            thumb.addEventListener('click', () => {
                showPhoto(idx);
            });
            thumbsContainer.appendChild(thumb);
        });

        // Hide prev/next if only 1 photo
        if (currentPhotos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            thumbsContainer.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            thumbsContainer.style.display = 'flex';
        }

        showPhoto(currentPhotoIdx);

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const showPhoto = (idx) => {
        if (currentPhotos.length === 0) return;
        if (idx < 0) idx = currentPhotos.length - 1;
        if (idx >= currentPhotos.length) idx = 0;
        currentPhotoIdx = idx;

        // Image smooth transition
        mainImg.style.opacity = '0';
        mainImg.style.transform = 'scale(0.96)';

        setTimeout(() => {
            mainImg.src = currentPhotos[currentPhotoIdx];
            mainImg.style.opacity = '1';
            mainImg.style.transform = 'scale(1)';
        }, 150);

        counterEl.textContent = `${currentPhotoIdx + 1} / ${currentPhotos.length}`;

        // Update active thumb
        thumbsContainer.querySelectorAll('.karya-lb-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentPhotoIdx);
            if (i === currentPhotoIdx) {
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Attach trigger listeners to cards
    projectCards.forEach((card) => {
        // Expand badge
        const expandBadge = card.querySelector('.karya-expand-badge');
        if (expandBadge) {
            expandBadge.addEventListener('click', (e) => {
                e.stopPropagation();
                // Find currently active slide in card
                const activeSlide = card.querySelector('.karya-slide.active');
                let startIdx = 0;
                if (activeSlide) {
                    const allSlides = Array.from(card.querySelectorAll('.karya-slide'));
                    startIdx = allSlides.indexOf(activeSlide);
                }
                openLightbox(card, startIdx >= 0 ? startIdx : 0);
            });
        }

        // Detail Action button
        const actionBtn = card.querySelector('.karya-card-action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(card, 0);
            });
        }

        // Clicking the slide image itself
        const slides = card.querySelectorAll('.karya-slide');
        slides.forEach((slide, idx) => {
            slide.addEventListener('click', (e) => {
                if (e.target.closest('.karya-slide-nav') || e.target.closest('.karya-expand-badge')) return;
                openLightbox(card, idx);
            });
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (overlay) overlay.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => showPhoto(currentPhotoIdx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showPhoto(currentPhotoIdx + 1));

    // Keyboard support (Escape, ArrowLeft, ArrowRight)
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPhoto(currentPhotoIdx - 1);
        if (e.key === 'ArrowRight') showPhoto(currentPhotoIdx + 1);
    });

    // Lightbox touch swipe support
    let lbTouchStartX = 0;
    let lbTouchEndX = 0;
    const stage = document.querySelector('.karya-lightbox-stage');
    if (stage) {
        stage.addEventListener('touchstart', (e) => {
            lbTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        stage.addEventListener('touchend', (e) => {
            lbTouchEndX = e.changedTouches[0].screenX;
            const diff = lbTouchEndX - lbTouchStartX;
            if (Math.abs(diff) > 50) {
                if (diff < 0) showPhoto(currentPhotoIdx + 1);
                else showPhoto(currentPhotoIdx - 1);
            }
        }, { passive: true });
    }
}

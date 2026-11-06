/**
 * Premium Project Showcase — Complete Scroll-Driven Animation System
 * Vanilla JavaScript with Reveal Stage + Editorial Gallery
 */

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initScrollRevealStage();
    }

    // ==========================================================================
    // SCROLL REVEAL STAGE — Circular to Grid Expansion
    // ==========================================================================

    function initScrollRevealStage() {
        const stage = document.getElementById('projectRevealStage');
        if (!stage) return;

        const items = Array.from(stage.querySelectorAll('.project-reveal-item'));
        if (items.length === 0) return;

        const prompt = document.getElementById('revealPrompt');
        const section = document.querySelector('.project-showcase-section');

        // Calculate positions
        const positions = calculateRevealPositions(items.length);
        
        // Initial compact state
        items.forEach((item, index) => {
            const pos = positions.initial[index];
            item.style.left = `${pos.x}px`;
            item.style.top = `${pos.y}px`;
            item.style.zIndex = positions.initial.length - index;
            item.style.transform = `translate(-50%, -50%) scale(${pos.scale}) rotate(${pos.rotate}deg)`;
        });

        // Scroll animation
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                updateRevealAnimation(stage, items, positions, prompt, section);
                ticking = false;
            });
        };

        if (!prefersReducedMotion) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial call
        } else {
            // Reduced motion: show expanded immediately
            items.forEach((item, index) => {
                const pos = positions.expanded[index];
                item.style.left = `${pos.x}px`;
                item.style.top = `${pos.y}px`;
                item.style.transform = `translate(-50%, -50%) scale(1) rotate(0deg)`;
                item.classList.add('expanded');
            });
            if (prompt) prompt.classList.add('hidden');
        }

        // Click handlers
        items.forEach(item => {
            item.addEventListener('click', () => {
                openProjectLightbox(item);
            });
        });

        // Responsive recalculation
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newPositions = calculateRevealPositions(items.length);
                Object.assign(positions, newPositions);
                handleScroll();
            }, 150);
        });
    }

    function calculateRevealPositions(count) {
        const stageWidth = Math.min(window.innerWidth, 1440);
        const stageHeight = window.innerWidth <= 768 ? 700 : window.innerWidth <= 1024 ? 800 : 1000;
        const centerX = stageWidth / 2;
        const centerY = stageHeight / 2;

        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

        // Initial: compact circular arrangement
        const initial = [];
        const radius = isMobile ? 80 : isTablet ? 120 : 160;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            initial.push({
                x,
                y,
                scale: isMobile ? 0.35 : isTablet ? 0.4 : 0.45,
                rotate: (i - count / 2) * 4
            });
        }

        // Expanded: responsive grid layout
        const expanded = [];
        const cols = isMobile ? 1 : isTablet ? 2 : 3;
        const rows = Math.ceil(count / cols);
        
        const cardWidth = isMobile ? 280 : isTablet ? 300 : 340;
        const cardHeight = isMobile ? 480 : isTablet ? 500 : 520;
        const gapX = isMobile ? 0 : isTablet ? 24 : 36;
        const gapY = isMobile ? 24 : isTablet ? 28 : 36;
        
        const gridWidth = cols * cardWidth + (cols - 1) * gapX;
        const gridHeight = rows * cardHeight + (rows - 1) * gapY;
        const startX = (stageWidth - gridWidth) / 2 + cardWidth / 2;
        const startY = (stageHeight - gridHeight) / 2 + cardHeight / 2;

        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardWidth + gapX);
            const y = startY + row * (cardHeight + gapY);
            
            expanded.push({ x, y, scale: 1, rotate: 0 });
        }

        return { initial, expanded };
    }

    function updateRevealAnimation(stage, items, positions, prompt, section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress - SLOWER animation range
        const scrollStart = viewportHeight * 0.5; // Start later (was 0.4)
        const scrollEnd = -sectionHeight * 0.4; // End later (was 0.2)
        
        let progress = 0;
        if (sectionTop <= scrollStart && sectionTop >= scrollEnd) {
            progress = (scrollStart - sectionTop) / (scrollStart - scrollEnd);
        } else if (sectionTop < scrollEnd) {
            progress = 1;
        }

        // Slower easing curve
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4); // Slower than cubic
        const easedProgress = easeOutQuart(Math.max(0, Math.min(1, progress)));

        // Fade prompt more gradually
        if (prompt) {
            prompt.style.opacity = Math.max(0, 1 - progress * 2.5); // Slower fade (was 4)
            if (progress > 0.3) { // Later threshold (was 0.2)
                prompt.classList.add('hidden');
            } else {
                prompt.classList.remove('hidden');
            }
        }

        // Animate items
        items.forEach((item, index) => {
            const initial = positions.initial[index];
            const expanded = positions.expanded[index];

            const x = initial.x + (expanded.x - initial.x) * easedProgress;
            const y = initial.y + (expanded.y - initial.y) * easedProgress;
            const scale = initial.scale + (expanded.scale - initial.scale) * easedProgress;
            const rotate = initial.rotate + (expanded.rotate - initial.rotate) * easedProgress;

            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            item.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;
            
            // Add expanded class later in animation (was 0.6)
            if (easedProgress > 0.75) {
                item.classList.add('expanded');
            } else {
                item.classList.remove('expanded');
            }
        });
    }

    // ==========================================================================
    // PROJECT LIGHTBOX — Gallery Modal
    // ==========================================================================

    function openProjectLightbox(card) {
        const lightbox = document.getElementById('karyaLightbox');
        if (!lightbox) return;

        const title = card.getAttribute('data-title') || 'Proyek';
        const desc = card.getAttribute('data-desc') || '';
        
        const titleEl = document.getElementById('lightboxTitle');
        const descEl = document.getElementById('lightboxDesc');
        const mainImg = document.getElementById('lightboxMainImg');
        const counterEl = document.getElementById('lightboxCounter');
        const thumbsContainer = document.getElementById('lightboxThumbs');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        // Collect photos
        const photos = [];
        for (let i = 1; i <= 5; i++) {
            const attr = i === 1 ? 'data-foto' : `data-foto${i}`;
            const val = card.getAttribute(attr);
            if (val && val.trim() !== '') {
                photos.push(`/images/${val.trim()}`);
            }
        }

        if (photos.length === 0) return;

        titleEl.textContent = title;
        descEl.textContent = desc;
        
        let currentIdx = 0;

        // Build thumbnails
        thumbsContainer.innerHTML = '';
        photos.forEach((src, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `karya-lb-thumb ${idx === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${src}" alt="Thumb ${idx + 1}" loading="lazy">`;
            thumb.addEventListener('click', () => showPhoto(idx));
            thumbsContainer.appendChild(thumb);
        });

        const showPhoto = (idx) => {
            if (idx < 0) idx = photos.length - 1;
            if (idx >= photos.length) idx = 0;
            currentIdx = idx;

            mainImg.style.opacity = '0';
            mainImg.style.transform = 'scale(0.96)';

            setTimeout(() => {
                mainImg.src = photos[currentIdx];
                mainImg.style.opacity = '1';
                mainImg.style.transform = 'scale(1)';
            }, 150);

            counterEl.textContent = `${currentIdx + 1} / ${photos.length}`;

            thumbsContainer.querySelectorAll('.karya-lb-thumb').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentIdx);
                if (i === currentIdx) {
                    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        };

        if (photos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            thumbsContainer.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            thumbsContainer.style.display = 'flex';
            
            prevBtn.onclick = () => showPhoto(currentIdx - 1);
            nextBtn.onclick = () => showPhoto(currentIdx + 1);
        }

        showPhoto(0);
        
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Keyboard navigation
        const handleKeyboard = (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            
            if (e.key === 'ArrowLeft') showPhoto(currentIdx - 1);
            if (e.key === 'ArrowRight') showPhoto(currentIdx + 1);
        };

        window.addEventListener('keydown', handleKeyboard);
        
        // Store for cleanup
        lightbox._keyboardHandler = handleKeyboard;
    }

    // Close lightbox
    window.closeLightbox = function() {
        const lightbox = document.getElementById('karyaLightbox');
        if (!lightbox) return;
        
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Cleanup keyboard handler
        if (lightbox._keyboardHandler) {
            window.removeEventListener('keydown', lightbox._keyboardHandler);
            lightbox._keyboardHandler = null;
        }
    };

    // Lightbox close handlers
    document.addEventListener('DOMContentLoaded', () => {
        const closeBtn = document.getElementById('lightboxClose');
        const overlay = document.getElementById('lightboxOverlay');
        
        if (closeBtn) closeBtn.addEventListener('click', window.closeLightbox);
        if (overlay) overlay.addEventListener('click', window.closeLightbox);

        // Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.closeLightbox();
        });
    });

})();

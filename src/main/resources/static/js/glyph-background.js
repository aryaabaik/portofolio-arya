/**
 * Glyph Background — Animated editorial typography floating particles
 * Minimalist design matching high-end portfolio cover theme
 */
(() => {
    'use strict';

    function initGlyphBackgrounds() {
        const glyphContainers = document.querySelectorAll('.glyph-bg');
        if (!glyphContainers || glyphContainers.length === 0) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        glyphContainers.forEach((glyphBg) => {
            // Find or create glyph-layer
            let glyphLayer = glyphBg.querySelector('.glyph-layer');
            if (!glyphLayer) {
                glyphLayer = document.createElement('div');
                glyphLayer.className = 'glyph-layer';
                glyphBg.appendChild(glyphLayer);
            }
            glyphLayer.innerHTML = '';
            glyphLayer.style.opacity = '1';

            // Get dimensions
            const rect = glyphBg.getBoundingClientRect();
            const width = rect.width > 50 ? rect.width : (glyphBg.parentElement ? glyphBg.parentElement.offsetWidth : window.innerWidth);
            const height = rect.height > 50 ? rect.height : (glyphBg.parentElement ? glyphBg.parentElement.offsetHeight : 600);

            // Palette
            const GLYPH_COLOR = getComputedStyle(glyphBg).getPropertyValue('--glyph-color').trim() || 'rgba(30, 30, 30, 0.22)';
            const GLYPH_ACCENT = getComputedStyle(glyphBg).getPropertyValue('--glyph-accent').trim() || '#C29B38';

            const allChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const accentChars = 'AryaAdhitya2026✦';

            // Generate responsive number of glyphs
            const count = Math.max(35, Math.min(85, Math.round((width * height) / 9000)));

            const glyphs = [];

            for (let i = 0; i < count; i++) {
                const glyph = document.createElement('span');
                glyph.className = 'glyph';

                const isAccent = Math.random() < 0.18;
                if (isAccent) {
                    glyph.classList.add('glyph-accent');
                    const charIdx = Math.floor(Math.random() * accentChars.length);
                    glyph.textContent = accentChars.charAt(charIdx);
                    glyph.style.color = GLYPH_ACCENT;
                    glyph.style.setProperty('--glyph-opacity', '0.85');
                } else {
                    const charIdx = Math.floor(Math.random() * allChars.length);
                    glyph.textContent = allChars.charAt(charIdx);
                    glyph.style.color = GLYPH_COLOR;
                    const opacity = (Math.random() * 0.4 + 0.15).toFixed(2);
                    glyph.style.setProperty('--glyph-opacity', opacity);
                }

                // Distributed positioning
                const posX = (Math.random() * 94).toFixed(1);
                const posY = (Math.random() * 92).toFixed(1);
                glyph.style.left = `${posX}%`;
                glyph.style.top = `${posY}%`;

                // Subtle font size variance
                const fontSize = (Math.random() * 5 + 13).toFixed(0);
                glyph.style.fontSize = `${fontSize}px`;

                if (!prefersReducedMotion) {
                    const duration = (Math.random() * 8 + 8).toFixed(1);
                    const delay = (Math.random() * 5).toFixed(1);
                    glyph.style.animation = `glyphFloat ${duration}s ease-in-out ${delay}s infinite alternate`;
                }

                glyphLayer.appendChild(glyph);
                glyphs.push(glyph);
            }

            // Mouse proximity repulsion
            let mouseX = -9999;
            let mouseY = -9999;
            let isMoving = false;
            let animFrame = null;

            const onMouseMove = (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (!isMoving && !prefersReducedMotion) {
                    isMoving = true;
                    animFrame = requestAnimationFrame(updateMouseRepulsion);
                }
            };

            function updateMouseRepulsion() {
                const bgRect = glyphBg.getBoundingClientRect();
                const isInside = mouseX >= bgRect.left - 100 && mouseX <= bgRect.right + 100 &&
                                 mouseY >= bgRect.top - 100 && mouseY <= bgRect.bottom + 100;

                if (isInside) {
                    for (let i = 0; i < glyphs.length; i++) {
                        const g = glyphs[i];
                        const gRect = g.getBoundingClientRect();
                        const gx = gRect.left + gRect.width / 2;
                        const gy = gRect.top + gRect.height / 2;

                        const dx = mouseX - gx;
                        const dy = mouseY - gy;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 140) {
                            const force = (140 - dist) / 140;
                            const angle = Math.atan2(dy, dx);
                            const pushX = -Math.cos(angle) * force * 24;
                            const pushY = -Math.sin(angle) * force * 24;
                            g.style.transform = `translate(${pushX}px, ${pushY}px)`;
                        } else {
                            g.style.transform = '';
                        }
                    }
                    animFrame = requestAnimationFrame(updateMouseRepulsion);
                } else {
                    for (let i = 0; i < glyphs.length; i++) {
                        glyphs[i].style.transform = '';
                    }
                    isMoving = false;
                }
            }

            window.addEventListener('mousemove', onMouseMove, { passive: true });

            // Click ripple
            if (glyphBg.parentElement) {
                glyphBg.parentElement.addEventListener('click', (e) => {
                    const bgRect = glyphBg.getBoundingClientRect();
                    const rx = e.clientX - bgRect.left;
                    const ry = e.clientY - bgRect.top;

                    const ripple = document.createElement('span');
                    ripple.className = 'glyph-click-ripple';
                    ripple.style.left = `${rx}px`;
                    ripple.style.top = `${ry}px`;
                    glyphBg.appendChild(ripple);

                    setTimeout(() => {
                        if (ripple.parentNode) {
                            ripple.parentNode.removeChild(ripple);
                        }
                    }, 650);
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlyphBackgrounds);
    } else {
        initGlyphBackgrounds();
    }
})();

/**
 * Light Kinetic Grid Background
 * Supports:
 * - Default: Warm ivory canvas with subtle beige grid and champagne gold interactive physics (Hero)
 * - Black Variant: Warm ivory canvas with crisp black grid lines and dark kinetic physics (Project)
 */
(() => {
    'use strict';

    class KineticGrid {
        constructor(container) {
            this.container = container;
            this.section = container.closest('.profile-hero-section') || container.closest('.project-showcase-section') || container.parentElement || container;
            this.isBlack = container.classList.contains('kinetic-grid-black');
            this.canvas = null;
            this.ctx = null;
            this.width = 0;
            this.height = 0;
            this.dpr = 1;
            this.gridSize = 28;
            this.nodes = [];
            this.mouse = { x: -9999, y: -9999 };
            this.ripples = [];
            this.animationId = null;
            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.init();
        }

        init() {
            this.createCanvas();
            this.resize();
            this.createNodes();
            this.bindEvents();

            if (!this.prefersReducedMotion) {
                this.animate();
            } else {
                this.drawStatic();
            }
        }

        createCanvas() {
            const existing = this.container.querySelector('.kinetic-grid-canvas');
            if (existing) {
                existing.remove();
            }

            this.canvas = document.createElement('canvas');
            this.canvas.className = 'kinetic-grid-canvas';
            this.canvas.setAttribute('aria-hidden', 'true');
            this.ctx = this.canvas.getContext('2d', { alpha: true });
            this.container.appendChild(this.canvas);
        }

        resize() {
            const rect = this.container.getBoundingClientRect();
            this.width = Math.round(rect.width) || window.innerWidth;
            this.height = Math.round(rect.height) || (this.section ? this.section.offsetHeight : 600);

            if (this.width === 0 || this.height === 0) {
                setTimeout(() => this.resize(), 100);
                return;
            }

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.dpr = dpr;

            this.canvas.width = Math.round(this.width * dpr);
            this.canvas.height = Math.round(this.height * dpr);
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;

            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(dpr, dpr);

            this.createNodes();
        }

        createNodes() {
            this.nodes = [];
            const cols = Math.ceil(this.width / this.gridSize) + 1;
            const rows = Math.ceil(this.height / this.gridSize) + 1;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * this.gridSize;
                    const y = row * this.gridSize;
                    this.nodes.push({
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        }

        drawStatic() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const cols = Math.ceil(this.width / this.gridSize) + 1;
            const rows = Math.ceil(this.height / this.gridSize) + 1;

            // Grid lines color
            this.ctx.strokeStyle = this.isBlack ? 'rgba(20, 20, 22, 0.32)' : '#D8D0C3';
            this.ctx.lineWidth = 0.85;
            this.ctx.beginPath();

            for (let col = 0; col < cols; col++) {
                const x = col * this.gridSize;
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
            }

            for (let row = 0; row < rows; row++) {
                const y = row * this.gridSize;
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
            }
            this.ctx.stroke();

            // Intersection nodes
            this.ctx.fillStyle = this.isBlack ? 'rgba(20, 20, 22, 0.50)' : 'rgba(195, 178, 150, 0.75)';
            for (let node of this.nodes) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        updateNodes() {
            const influenceRadius = 135;
            const maxDisplacement = 14;
            const returnSpeed = 0.14;

            for (let node of this.nodes) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Smooth mouse kinetic repulsion
                if (distance < influenceRadius && distance > 0) {
                    const force = (1 - distance / influenceRadius) * maxDisplacement;
                    const angle = Math.atan2(dy, dx);
                    node.vx = -Math.cos(angle) * force;
                    node.vy = -Math.sin(angle) * force;
                } else {
                    node.vx += (node.baseX - node.x) * returnSpeed;
                    node.vy += (node.baseY - node.y) * returnSpeed;
                }

                // Smooth ripple wave displacement
                for (let ripple of this.ripples) {
                    const rdx = node.x - ripple.x;
                    const rdy = node.y - ripple.y;
                    const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
                    const diff = Math.abs(rDist - ripple.radius);

                    if (diff < 26) {
                        const rippleForce = (1 - diff / 26) * 9 * ripple.opacity;
                        const angle = Math.atan2(rdy, rdx);
                        node.vx += Math.cos(angle) * rippleForce;
                        node.vy += Math.sin(angle) * rippleForce;
                    }
                }

                // Damped spring motion
                node.vx *= 0.83;
                node.vy *= 0.83;
                node.x += node.vx;
                node.y += node.vy;
            }
        }

        updateRipples() {
            for (let i = this.ripples.length - 1; i >= 0; i--) {
                const ripple = this.ripples[i];
                ripple.radius += ripple.speed;
                ripple.opacity -= ripple.decay;

                if (ripple.opacity <= 0) {
                    this.ripples.splice(i, 1);
                }
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const cols = Math.ceil(this.width / this.gridSize) + 1;
            const activeThreshold = 135;
            const activeLines = [];

            // 1. Draw base grid lines
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.isBlack ? 'rgba(20, 20, 22, 0.32)' : '#D8D0C3';
            this.ctx.lineWidth = 0.85;

            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const col = i % cols;
                const row = Math.floor(i / cols);

                // Horizontal line segment
                if (col < cols - 1) {
                    const nextNode = this.nodes[i + 1];
                    const midX = (node.x + nextNode.x) / 2;
                    const midY = (node.y + nextNode.y) / 2;
                    const dist = Math.hypot(this.mouse.x - midX, this.mouse.y - midY);

                    if (dist < activeThreshold) {
                        activeLines.push({
                            x1: node.x, y1: node.y,
                            x2: nextNode.x, y2: nextNode.y,
                            intensity: 1 - dist / activeThreshold
                        });
                    } else {
                        this.ctx.moveTo(node.x, node.y);
                        this.ctx.lineTo(nextNode.x, nextNode.y);
                    }
                }

                // Vertical line segment
                if (row < Math.floor(this.nodes.length / cols) - 1) {
                    const belowNode = this.nodes[i + cols];
                    if (belowNode) {
                        const midX = (node.x + belowNode.x) / 2;
                        const midY = (node.y + belowNode.y) / 2;
                        const dist = Math.hypot(this.mouse.x - midX, this.mouse.y - midY);

                        if (dist < activeThreshold) {
                            activeLines.push({
                                x1: node.x, y1: node.y,
                                x2: belowNode.x, y2: belowNode.y,
                                intensity: 1 - dist / activeThreshold
                            });
                        } else {
                            this.ctx.moveTo(node.x, node.y);
                            this.ctx.lineTo(belowNode.x, belowNode.y);
                        }
                    }
                }
            }
            this.ctx.stroke();

            // 2. Draw active lines
            for (let line of activeLines) {
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);

                if (this.isBlack) {
                    this.ctx.strokeStyle = `rgba(20, 20, 22, ${0.55 + line.intensity * 0.45})`;
                    this.ctx.lineWidth = 1.0 + line.intensity * 1.0;
                } else {
                    this.ctx.strokeStyle = `rgba(198, 166, 107, ${0.4 + line.intensity * 0.6})`;
                    this.ctx.lineWidth = 0.9 + line.intensity * 0.8;
                }
                this.ctx.stroke();
            }

            // 3. Draw base node dots
            const activeNodes = [];
            this.ctx.fillStyle = this.isBlack ? 'rgba(20, 20, 22, 0.50)' : 'rgba(195, 178, 150, 0.75)';
            this.ctx.beginPath();

            for (let node of this.nodes) {
                const dist = Math.hypot(this.mouse.x - node.x, this.mouse.y - node.y);
                if (dist < activeThreshold) {
                    activeNodes.push({ node, intensity: 1 - dist / activeThreshold });
                } else {
                    this.ctx.moveTo(node.x + 1.2, node.y);
                    this.ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
                }
            }
            this.ctx.fill();

            // 4. Draw active nodes
            for (let item of activeNodes) {
                const node = item.node;
                const intensity = item.intensity;

                // Subtle halo
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 2.0 + intensity * 2.5, 0, Math.PI * 2);
                if (this.isBlack) {
                    this.ctx.fillStyle = `rgba(20, 20, 22, ${0.12 + intensity * 0.20})`;
                } else {
                    this.ctx.fillStyle = `rgba(198, 166, 107, ${0.12 + intensity * 0.22})`;
                }
                this.ctx.fill();

                // Core node
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 1.4 + intensity * 1.2, 0, Math.PI * 2);
                if (this.isBlack) {
                    this.ctx.fillStyle = `rgba(20, 20, 22, ${0.85 + intensity * 0.15})`;
                } else {
                    this.ctx.fillStyle = `rgba(198, 166, 107, ${0.8 + intensity * 0.2})`;
                }
                this.ctx.fill();
            }

            // 5. Draw ripples
            for (let ripple of this.ripples) {
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                if (this.isBlack) {
                    this.ctx.strokeStyle = `rgba(20, 20, 22, ${ripple.opacity * 0.65})`;
                } else {
                    this.ctx.strokeStyle = `rgba(198, 166, 107, ${ripple.opacity * 0.6})`;
                }
                this.ctx.lineWidth = 1.8;
                this.ctx.stroke();

                if (ripple.radius > 8) {
                    this.ctx.beginPath();
                    this.ctx.arc(ripple.x, ripple.y, ripple.radius * 0.75, 0, Math.PI * 2);
                    if (this.isBlack) {
                        this.ctx.strokeStyle = `rgba(20, 20, 22, ${ripple.opacity * 0.35})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(198, 166, 107, ${ripple.opacity * 0.3})`;
                    }
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        animate() {
            this.updateNodes();
            this.updateRipples();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        handleMouseMove(e) {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }

        handleMouseLeave() {
            this.mouse.x = -9999;
            this.mouse.y = -9999;
        }

        handleClick(e) {
            const rect = this.container.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            this.ripples.push({
                x: x,
                y: y,
                radius: 0,
                opacity: 1,
                speed: 3.2,
                decay: 0.014
            });
        }

        bindEvents() {
            if (this.prefersReducedMotion) return;

            const target = this.section;

            target.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
            target.addEventListener('mouseleave', () => this.handleMouseLeave());
            target.addEventListener('click', (e) => this.handleClick(e));

            // Touch events for mobile
            target.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches.length > 0) {
                    this.handleMouseMove(e.touches[0]);
                }
            }, { passive: true });
            target.addEventListener('touchend', () => this.handleMouseLeave());
            target.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length > 0) {
                    this.handleMouseMove(e.touches[0]);
                    this.handleClick(e.touches[0]);
                }
            }, { passive: true });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.resize(), 120);
            });

            if ('ResizeObserver' in window && this.section) {
                const ro = new ResizeObserver(() => {
                    this.resize();
                });
                ro.observe(this.section);
            }
        }

        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            if (this.canvas) {
                this.canvas.remove();
            }
        }
    }

    function initKineticGrids() {
        const containers = document.querySelectorAll('.kinetic-grid-bg');
        if (containers.length === 0) return;

        containers.forEach((container) => {
            if (!container.dataset.kineticInitialized) {
                new KineticGrid(container);
                container.dataset.kineticInitialized = 'true';
            }
        });
    }

    function initTypewriterAnimation() {
        const wordLeft = document.getElementById('typewriterWordLeft');
        const wordRight = document.getElementById('typewriterWordRight');
        const cursorLeft = document.querySelector('.typewriter-cursor-left');
        const cursorRight = document.querySelector('.typewriter-cursor-right');

        if (!wordLeft || !wordRight || wordLeft.dataset.typewriterInitialized) return;
        wordLeft.dataset.typewriterInitialized = 'true';

        const leftText = (wordLeft.getAttribute('data-word') || wordLeft.textContent || 'ARYA').trim();
        const rightText = (wordRight.getAttribute('data-word') || wordRight.textContent || 'ADHITYA').trim();

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            wordLeft.textContent = leftText;
            wordRight.textContent = rightText;
            if (cursorLeft) cursorLeft.style.display = 'none';
            if (cursorRight) cursorRight.style.display = 'inline-block';
            return;
        }

        // Start both words blank
        wordLeft.textContent = '';
        wordRight.textContent = '';
        if (cursorLeft) cursorLeft.style.display = 'inline-block';
        if (cursorRight) cursorRight.style.display = 'none';

        const typingSpeed = 85;
        const initialDelay = 300;
        let leftIndex = 0;
        let rightIndex = 0;

        setTimeout(() => {
            // Step 1: Type left word ("ARYA")
            const leftTimer = setInterval(() => {
                if (leftIndex < leftText.length) {
                    wordLeft.textContent += leftText.charAt(leftIndex);
                    leftIndex++;
                } else {
                    clearInterval(leftTimer);

                    // Step 2: Switch cursor to right side
                    setTimeout(() => {
                        if (cursorLeft) cursorLeft.style.display = 'none';
                        if (cursorRight) cursorRight.style.display = 'inline-block';

                        // Step 3: Type right word ("ADHITYA")
                        const rightTimer = setInterval(() => {
                            if (rightIndex < rightText.length) {
                                wordRight.textContent += rightText.charAt(rightIndex);
                                rightIndex++;
                            } else {
                                clearInterval(rightTimer);
                            }
                        }, typingSpeed);
                    }, 140);
                }
            }, typingSpeed);
        }, initialDelay);
    }

    function initProjectTypewriter() {
        const textEl = document.getElementById('projectTypewriterText');
        if (!textEl || textEl.dataset.typewriterInitialized) return;
        textEl.dataset.typewriterInitialized = 'true';

        const fullText = (textEl.getAttribute('data-text') || textEl.textContent || 'MY PROJECT').trim();
        if (!fullText) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            textEl.textContent = fullText;
            return;
        }

        textEl.textContent = '';

        const startTyping = () => {
            let charIndex = 0;
            const typingSpeed = 85;
            const timer = setInterval(() => {
                if (charIndex < fullText.length) {
                    textEl.textContent += fullText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(timer);
                }
            }, typingSpeed);
        };

        const section = document.getElementById('project');
        if ('IntersectionObserver' in window && section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(startTyping, 180);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(section);
        } else {
            setTimeout(startTyping, 350);
        }
    }

    function initHeroFeatures() {
        initKineticGrids();
        initTypewriterAnimation();
        initProjectTypewriter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroFeatures);
    } else {
        initHeroFeatures();
    }
    window.addEventListener('load', initHeroFeatures);
})();

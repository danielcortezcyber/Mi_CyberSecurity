// ================================================================
// PARTICLES.JS - OPTIMIZADO (menos partículas en móvil, pausa al ocultar)
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const isMobile = window.innerWidth <= 768;
    const PARTICLE_COUNT = isMobile ? 30 : 70;
    const CONNECT_DISTANCE = isMobile ? 100 : 150;
    const MAX_SPEED = isMobile ? 0.3 : 0.5;

    const canvas = document.createElement('canvas');
    canvas.id = 'romantic-particles';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        background: transparent;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const colors = ['#d6336c', '#ff6b9d', '#ff4081', '#e91e63', '#f06292'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = 2 + Math.random() * 3;
            this.speedX = (Math.random() - 0.5) * MAX_SPEED * 2;
            this.speedY = (Math.random() - 0.5) * MAX_SPEED * 2;
            this.opacity = 0.3 + Math.random() * 0.4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DISTANCE) {
                    const alpha = 1 - (dist / CONNECT_DISTANCE);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particles[i].color;
                    ctx.globalAlpha = alpha * 0.15;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    let frameId = null;
    function animate() {
        frameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden && frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
        } else if (!document.hidden && !frameId) {
            animate();
        }
    });

    console.log('💫 Partículas optimizadas activadas.');
});
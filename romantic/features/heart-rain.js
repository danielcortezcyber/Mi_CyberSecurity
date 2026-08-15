// ================================================================
// HEART RAIN - Lluvia de corazones en cascada
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Buscar el botón de confeti existente o crear uno nuevo
    const btn = document.getElementById('lanzarConfeti');
    if (!btn) {
        // Si no existe, crearlo en la sección final
        const finalSection = document.getElementById('romantic-final');
        if (finalSection) {
            const newBtn = document.createElement('button');
            newBtn.id = 'lanzarConfeti';
            newBtn.className = 'btn btn-primary confeti-btn';
            newBtn.style.cssText = 'margin-top: 2rem; position: relative; z-index: 2;';
            newBtn.textContent = '🌧️ Lluvia de corazones';
            finalSection.querySelector('.final-content')?.appendChild(newBtn);
        }
    }

    // Función de lluvia de corazones (más intensa que confetti.js)
    function lanzarLluviaCorazones() {
        const emojis = ['❤️', '💕', '💖', '💗', '💓', '♥️', '💝', '💘'];
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const count = window.innerWidth <= 768 ? 80 : 150;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            const size = 20 + Math.random() * 40;
            const startX = Math.random() * window.innerWidth;
            const duration = 3 + Math.random() * 4;
            const delay = Math.random() * 2;
            const rotation = Math.random() * 720;

            el.style.cssText = `
                position: absolute;
                top: -30px;
                left: ${startX}px;
                font-size: ${size}px;
                opacity: 1;
                animation: heartRain ${duration}s ease-in ${delay}s forwards;
                user-select: none;
                pointer-events: none;
                filter: drop-shadow(0 4px 12px rgba(214,51,108,0.3));
            `;
            const uid = 'heartrain-' + Date.now() + '-' + i;
            el.id = uid;
            const style = document.createElement('style');
            style.textContent = `
                #${uid} {
                    animation: heartRain ${duration}s ease-in ${delay}s forwards;
                }
                @keyframes heartRain {
                    0% { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 1; }
                    50% { transform: translateY(${window.innerHeight / 2}px) rotate(${rotation/2}deg) scale(1.2); opacity: 0.9; }
                    100% { transform: translateY(${window.innerHeight + 100}px) rotate(${rotation}deg) scale(0.3); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            container.appendChild(el);
        }
        setTimeout(() => container.remove(), 6000);
    }

    // Enlazar el botón
    const btnFinal = document.getElementById('lanzarConfeti');
    if (btnFinal) {
        btnFinal.addEventListener('click', lanzarLluviaCorazones);
    }

    // También lanzar automáticamente al llegar al final (opcional)
    // Se puede activar con IntersectionObserver
    const finalSection = document.getElementById('romantic-final');
    if (finalSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Lanzar lluvia automáticamente al llegar al final (solo una vez)
                    if (!finalSection.dataset.rainDone) {
                        finalSection.dataset.rainDone = 'true';
                        setTimeout(lanzarLluviaCorazones, 1500);
                    }
                }
            });
        }, { threshold: 0.3 });
        observer.observe(finalSection);
    }

    console.log('🌧️ Lluvia de corazones activada.');
});
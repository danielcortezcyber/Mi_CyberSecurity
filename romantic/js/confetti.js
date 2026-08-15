// ================================================================
// CONFETTI.JS - Confeti romántico ❤️
// ================================================================

'use strict';

const BUTTON_ID = 'lanzarConfeti';
const EMOJIS = ['❤️', '💕', '💖', '💗', '💓', '♥️', '✨', '🌟', '💝'];
const KEYFRAMES_STYLE_ID = 'confetti-keyframes';

// ---------------------------------------------------------------
// KEYFRAMES
// ---------------------------------------------------------------
function ensureKeyframes() {
    if (document.getElementById(KEYFRAMES_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = KEYFRAMES_STYLE_ID;

    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg) scale(1);
                opacity: 1;
            }

            100% {
                transform:
                    translateY(var(--ty))
                    rotate(var(--rot))
                    scale(0.3);
                opacity: 0;
            }
        }

        @keyframes confettiFade {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }

            20% {
                opacity: 1;
                transform: scale(1);
            }

            80% {
                opacity: 1;
                transform: scale(1);
            }

            100% {
                opacity: 0;
                transform: scale(0.8);
            }
        }
    `;

    document.head.appendChild(style);
}

// ---------------------------------------------------------------
// LANZAR CONFETI
// ---------------------------------------------------------------
function launchConfetti() {

    console.log('🎉 Lanzando confeti...');

    ensureKeyframes();

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const container = document.createElement('div');

    container.className = 'love-confetti-container';

    container.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 999999;
        overflow: hidden;
    `;

    document.body.appendChild(container);

    // -----------------------------------------------------------
    // MOVIMIENTO REDUCIDO
    // -----------------------------------------------------------
    if (reducedMotion) {

        for (let i = 0; i < 12; i++) {

            const heart = document.createElement('div');

            heart.textContent =
                EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

            heart.style.cssText = `
                position: absolute;
                top: ${20 + Math.random() * 60}%;
                left: ${10 + Math.random() * 80}%;
                font-size: ${20 + Math.random() * 20}px;
                animation: confettiFade 1.8s ease forwards;
            `;

            container.appendChild(heart);
        }

        setTimeout(() => {
            container.remove();
        }, 2200);

        return;
    }

    // -----------------------------------------------------------
    // CONFETI NORMAL
    // -----------------------------------------------------------

    const count = window.innerWidth <= 768 ? 60 : 100;

    let maxFinishTime = 0;

    for (let i = 0; i < count; i++) {

        const heart = document.createElement('div');

        heart.textContent =
            EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

        const size = 16 + Math.random() * 28;
        const startX = Math.random() * window.innerWidth;

        const duration = 2.5 + Math.random() * 3;
        const delay = Math.random() * 1.2;

        const rotation =
            (Math.random() > 0.5 ? 1 : -1) *
            (360 + Math.random() * 720);

        const fallDistance =
            window.innerHeight + 100 + Math.random() * 300;

        maxFinishTime = Math.max(
            maxFinishTime,
            duration + delay
        );

        heart.style.position = 'absolute';
        heart.style.top = '-40px';
        heart.style.left = `${startX}px`;
        heart.style.fontSize = `${size}px`;
        heart.style.opacity = '1';
        heart.style.userSelect = 'none';
        heart.style.pointerEvents = 'none';

        heart.style.setProperty(
            '--ty',
            `${fallDistance}px`
        );

        heart.style.setProperty(
            '--rot',
            `${rotation}deg`
        );

        heart.style.animation =
            `confettiFall ${duration}s ease-in ${delay}s forwards`;

        container.appendChild(heart);
    }

    // -----------------------------------------------------------
    // LIMPIEZA
    // -----------------------------------------------------------

    setTimeout(() => {
        container.remove();
    }, (maxFinishTime + 0.5) * 1000);
}

// ---------------------------------------------------------------
// CONECTAR BOTÓN
// ---------------------------------------------------------------
function bindButton(button) {

    if (!button) return;

    if (button.dataset.confettiListener === 'true') {
        return;
    }

    button.dataset.confettiListener = 'true';

    button.addEventListener('click', function (event) {

        console.log('❤️ Botón de confeti presionado');

        launchConfetti();

    });

    console.log('✅ Botón #lanzarConfeti conectado');
}

// ---------------------------------------------------------------
// BUSCAR BOTÓN
// ---------------------------------------------------------------
function initConfetti() {

    ensureKeyframes();

    const button = document.getElementById(BUTTON_ID);

    if (button) {

        bindButton(button);

        return;
    }

    console.log('⏳ Esperando botón #lanzarConfeti...');

    const observer = new MutationObserver(() => {

        const button = document.getElementById(BUTTON_ID);

        if (button) {

            bindButton(button);

            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        observer.disconnect();
    }, 30000);
}

// ---------------------------------------------------------------
// INICIALIZACIÓN SEGURA
// ---------------------------------------------------------------

// Esto soluciona el problema de DOMContentLoaded.
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initConfetti
    );

} else {

    // El DOM ya cargó.
    initConfetti();
}
// ================================================================
// HEARTS.JS - Corazones románticos al hacer clic
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================================
    // EVITAR DUPLICAR EL SISTEMA
    // ============================================================

    if (document.getElementById('hearts-container')) {
        return;
    }

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    const CONFIG = {
        maxHearts: 35,
        minSize: 22,
        maxSize: 48,
        minDuration: 1600,
        maxDuration: 2400,
        minRise: 180,
        maxRise: 300,
        minDrift: 25,
        maxDrift: 80,
        zIndex: 9999
    };

    // ============================================================
    // REDUCED MOTION
    // ============================================================

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // EMOJIS
    // ============================================================

    const emojis = [
        '❤️',
        '💕',
        '💖',
        '💗',
        '💓',
        '♥️',
        '💝',
        '💘'
    ];

    // ============================================================
    // CONTENEDOR
    // ============================================================

    const heartsContainer = document.createElement('div');

    heartsContainer.id = 'hearts-container';

    heartsContainer.setAttribute(
        'aria-hidden',
        'true'
    );

    heartsContainer.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: ${CONFIG.zIndex};
        user-select: none;
        contain: layout style paint;
    `;

    document.body.appendChild(heartsContainer);

    // ============================================================
    // FUNCIONES AUXILIARES
    // ============================================================

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomEmoji() {
        return emojis[
            Math.floor(
                Math.random() * emojis.length
            )
        ];
    }

    function removeOldestHeart() {
        const oldest =
            heartsContainer.firstElementChild;

        if (oldest) {
            oldest.remove();
        }
    }

    // ============================================================
    // CREAR CORAZÓN
    // ============================================================

    function createHeart(x, y) {

        if (reducedMotion) {
            return;
        }

        // --------------------------------------------------------
        // Limitar cantidad de corazones
        // --------------------------------------------------------

        if (
            heartsContainer.children.length >=
            CONFIG.maxHearts
        ) {
            removeOldestHeart();
        }

        // --------------------------------------------------------
        // Valores aleatorios
        // --------------------------------------------------------

        const size =
            random(
                CONFIG.minSize,
                CONFIG.maxSize
            );

        const duration =
            random(
                CONFIG.minDuration,
                CONFIG.maxDuration
            );

        const rise =
            random(
                CONFIG.minRise,
                CONFIG.maxRise
            );

        const drift =
            random(
                CONFIG.minDrift,
                CONFIG.maxDrift
            ) *
            (Math.random() > 0.5 ? 1 : -1);

        const rotationStart =
            random(-20, 20);

        const rotationEnd =
            random(-45, 45);

        const heart =
            document.createElement('span');

        heart.className =
            'floating-heart';

        heart.textContent =
            randomEmoji();

        // --------------------------------------------------------
        // Posición segura
        // --------------------------------------------------------

        const posX =
            Math.max(
                0,
                Math.min(
                    window.innerWidth,
                    x
                )
            );

        const posY =
            Math.max(
                0,
                Math.min(
                    window.innerHeight,
                    y
                )
            );

        // --------------------------------------------------------
        // Variables CSS
        // --------------------------------------------------------

        heart.style.left =
            `${posX}px`;

        heart.style.top =
            `${posY}px`;

        heart.style.fontSize =
            `${size}px`;

        heart.style.setProperty(
            '--heart-rise',
            `${rise}px`
        );

        heart.style.setProperty(
            '--heart-drift',
            `${drift}px`
        );

        heart.style.setProperty(
            '--heart-rotation-start',
            `${rotationStart}deg`
        );

        heart.style.setProperty(
            '--heart-rotation-end',
            `${rotationEnd}deg`
        );

        heart.style.setProperty(
            '--heart-duration',
            `${duration}ms`
        );

        // --------------------------------------------------------
        // Estilos
        // --------------------------------------------------------

        heart.style.cssText += `
            position: fixed;
            line-height: 1;
            pointer-events: none;
            user-select: none;
            opacity: 0;
            transform:
                translate3d(-50%, -50%, 0)
                scale(0.45)
                rotate(${rotationStart}deg);
            will-change: transform, opacity;
            filter:
                drop-shadow(
                    0 0 6px
                    rgba(214, 51, 108, 0.55)
                );
            animation:
                heartFly
                ${duration}ms
                cubic-bezier(
                    0.22,
                    0.61,
                    0.36,
                    1
                )
                forwards;
        `;

        heartsContainer.appendChild(
            heart
        );

        // --------------------------------------------------------
        // Limpieza
        // --------------------------------------------------------

        heart.addEventListener(
            'animationend',
            function () {
                heart.remove();
            },
            {
                once: true
            }
        );

        // Seguridad
        setTimeout(
            function () {
                if (
                    heart.parentNode
                ) {
                    heart.remove();
                }
            },
            duration + 500
        );
    }

    // ============================================================
    // CLICK DEL MOUSE
    // ============================================================

    document.addEventListener(
        'click',
        function (event) {

            if (reducedMotion) {
                return;
            }

            const target =
                event.target;

            // No activar en controles
            if (
                target.closest(
                    'button, a, input, textarea, select, option, label, video, audio, summary'
                )
            ) {
                return;
            }

            // No activar dentro del reproductor
            if (
                target.closest(
                    '.music-player'
                )
            ) {
                return;
            }

            // No activar dentro del lightbox
            if (
                target.closest(
                    '#lightboxModal'
                )
            ) {
                return;
            }

            createHeart(
                event.clientX,
                event.clientY
            );
        },
        {
            passive: true
        }
    );

    // ============================================================
    // TOUCH EN MÓVILES
    // ============================================================

    document.addEventListener(
        'touchend',
        function (event) {

            if (reducedMotion) {
                return;
            }

            const target =
                event.target;

            if (
                target.closest(
                    'button, a, input, textarea, select, option, label, video, audio, summary'
                )
            ) {
                return;
            }

            if (
                target.closest(
                    '.music-player, #lightboxModal'
                )
            ) {
                return;
            }

            const touch =
                event.changedTouches[0];

            if (!touch) {
                return;
            }

            createHeart(
                touch.clientX,
                touch.clientY
            );
        },
        {
            passive: true
        }
    );

    // ============================================================
    // ANIMACIÓN CSS
    // ============================================================

    const styleId =
        'hearts-animation-style';

    if (
        !document.getElementById(styleId)
    ) {

        const style =
            document.createElement('style');

        style.id =
            styleId;

        style.textContent = `
            @keyframes heartFly {

                0% {
                    opacity: 0;

                    transform:
                        translate3d(
                            -50%,
                            -50%,
                            0
                        )
                        scale(0.45)
                        rotate(
                            var(
                                --heart-rotation-start
                            )
                        );
                }

                10% {
                    opacity: 1;

                    transform:
                        translate3d(
                            -50%,
                            -65%,
                            0
                        )
                        scale(1)
                        rotate(
                            var(
                                --heart-rotation-start
                            )
                        );
                }

                35% {
                    opacity: 1;

                    transform:
                        translate3d(
                            calc(
                                -50% +
                                var(--heart-drift) * 0.25
                            ),
                            calc(
                                -50% -
                                var(--heart-rise) * 0.35
                            ),
                            0
                        )
                        scale(1.12)
                        rotate(
                            var(
                                --heart-rotation-end
                            )
                        );
                }

                65% {
                    opacity: 0.8;

                    transform:
                        translate3d(
                            calc(
                                -50% +
                                var(--heart-drift) * 0.65
                            ),
                            calc(
                                -50% -
                                var(--heart-rise) * 0.7
                            ),
                            0
                        )
                        scale(0.95)
                        rotate(
                            var(
                                --heart-rotation-start
                            )
                        );
                }

                100% {
                    opacity: 0;

                    transform:
                        translate3d(
                            calc(
                                -50% +
                                var(--heart-drift)
                            ),
                            calc(
                                -50% -
                                var(--heart-rise)
                            ),
                            0
                        )
                        scale(0.35)
                        rotate(
                            var(
                                --heart-rotation-end
                            )
                        );
                }
            }

            @media (
                prefers-reduced-motion: reduce
            ) {
                .floating-heart {
                    display: none !important;
                    animation: none !important;
                }
            }
        `;

        document.head.appendChild(
            style
        );
    }

    // ============================================================
    // LIMPIAR AL CAMBIAR DE PESTAÑA
    // ============================================================

    document.addEventListener(
        'visibilitychange',
        function () {

            if (
                document.hidden &&
                heartsContainer.children.length
            ) {
                heartsContainer.replaceChildren();
            }
        }
    );

    // ============================================================
    // LIMPIAR AL SALIR
    // ============================================================

    window.addEventListener(
        'pagehide',
        function () {

            heartsContainer.replaceChildren();

        },
        {
            once: true
        }
    );

    // ============================================================
    // FINAL
    // ============================================================

    console.log(
        '❤️ HEARTS.JS activado correctamente.'
    );

});
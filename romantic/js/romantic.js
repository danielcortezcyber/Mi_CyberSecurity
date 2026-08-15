// ================================================================
// ROMANTIC.JS - Sistema principal de la página romántica
//
// VERSIÓN ULTRA OPTIMIZADA
//
// Incluye:
// - Lazy loading inteligente de secciones
// - Cache de secciones cargadas
// - Manejo robusto de errores
// - Contador de tiempo juntos
// - Carta animada
// - Mensaje sorpresa
// - Razones aleatorias
// - Modal de momentos
// - Slider de galería
// - Autoplay inteligente
// - Soporte táctil
// - Navegación con teclado
// - Confeti romántico
// - Accesibilidad
// - Compatibilidad móvil
// - Pausa automática al ocultar pestaña
// - Prevención de duplicaciones
// - Limpieza de timers y observers
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================================================
    // CONFIGURACIÓN GLOBAL
    // ============================================================

    const CONFIG = {
        sections: [
            'intro',
            'hero',
            'historia',
            'galeria',
            'momentos',
            'canciones',
            'razones',
            'divertido',
            'carta',
            'futuro',
            'final'
        ],

        criticalSections: 3,

        lazyRootMargin: '350px',

        counterStartDate: '2025-01-15',

        sliderAutoplay: 4000,

        confettiCountDesktop: 40,

        confettiCountMobile: 25,

        debug: false
    };

    // ============================================================
    // ELEMENTO PRINCIPAL
    // ============================================================

    const app =
        document.getElementById(
            'romantic-app'
        );

    if (!app) {
        console.warn(
            '❤️ Romantic App no encontrado.'
        );
        return;
    }

    // ============================================================
    // EVITAR INICIALIZACIÓN DUPLICADA
    // ============================================================

    if (
        app.dataset.romanticInitialized === 'true'
    ) {
        console.warn(
            '❤️ ROMANTIC.JS ya está inicializado.'
        );
        return;
    }

    app.dataset.romanticInitialized = 'true';

    // ============================================================
    // UTILIDADES
    // ============================================================

    const utils = {

        log(...args) {
            if (CONFIG.debug) {
                console.log(
                    '💗 [ROMANTIC]',
                    ...args
                );
            }
        },

        error(...args) {
            console.error(
                '💔 [ROMANTIC]',
                ...args
            );
        },

        random(min, max) {
            return Math.random() *
                (max - min) +
                min;
        },

        randomInt(min, max) {
            return Math.floor(
                Math.random() *
                (max - min + 1)
            ) + min;
        },

        isMobile() {
            return window.innerWidth <= 768;
        },

        prefersReducedMotion() {
            return window.matchMedia &&
                window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches;
        }
    };

    // ============================================================
    // ESTADO GLOBAL
    // ============================================================

    const state = {

        loadedSections: new Set(),

        loadingSections: new Set(),

        sectionObserver: null,

        mutationObserver: null,

        sliderInitialized: false,

        modalOpen: false,

        previousBodyOverflow: '',

        previousFocus: null,

        timers: new Set(),

        destroyed: false
    };

    // ============================================================
    // MOMENTOS
    // ============================================================

    const MOMENTOS = {

        momento1: {
            titulo: 'El primer mensaje',
            descripcion:
                'Ese "hola" que lo cambió todo. 📱',
            detalle:
                'Aquí puedes escribir una historia más larga sobre ese primer momento especial.'
        },

        momento2: {
            titulo: 'Risas sin fin',
            descripcion:
                'Una tarde de risas que no quería que terminara. 😂',
            detalle:
                'Escribe sobre esa vez que no pararon de reírse.'
        },

        momento3: {
            titulo: 'El tiempo se detuvo',
            descripcion:
                'Un instante que parecía eterno. ⏳',
            detalle:
                'Describe ese momento en el que todo se sintió perfecto.'
        },

        momento4: {
            titulo: 'Nuestra canción',
            descripcion:
                'Esa melodía que siempre nos recuerda a nosotros. 🎵',
            detalle:
                '¿Cuál es esa canción? ¿Por qué es especial?'
        },

        momento5: {
            titulo: 'Un lugar con historia',
            descripcion:
                'Ese rincón del mundo que guarda nuestro momento. 🌍',
            detalle:
                '¿Dónde fue? ¿Qué pasó ahí?'
        },

        momento6: {
            titulo: 'El día que todo cambió',
            descripcion:
                'Un antes y un después. 🌟',
            detalle:
                'Ese momento en el que supe que todo era diferente.'
        }
    };

    // ============================================================
    // ============================================================
    // LAZY LOADING
    // ============================================================
    // ============================================================

    const sectionCache = new Map();

    async function fetchSection(
        section,
        placeholder = null
    ) {

        if (
            state.destroyed ||
            state.loadedSections.has(section) ||
            state.loadingSections.has(section)
        ) {
            return;
        }

        state.loadingSections.add(
            section
        );

        if (placeholder) {
            placeholder.dataset.loading =
                'true';

            placeholder.setAttribute(
                'aria-busy',
                'true'
            );
        }

        try {

            let html;

            // ----------------------------------------------------
            // CACHE
            // ----------------------------------------------------

            if (
                sectionCache.has(section)
            ) {

                html =
                    sectionCache.get(
                        section
                    );

            } else {

                const response =
                    await fetch(
                        `romantic/sections/${section}.html`,
                        {
                            method: 'GET',
                            cache: 'no-cache'
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }

                html =
                    await response.text();

                if (!html.trim()) {
                    throw new Error(
                        'La sección está vacía.'
                    );
                }

                sectionCache.set(
                    section,
                    html
                );
            }

            // ----------------------------------------------------
            // INSERTAR
            // ----------------------------------------------------

            const temp =
                document.createElement(
                    'div'
                );

            temp.innerHTML =
                html.trim();

            const sectionElement =
                temp.firstElementChild;

            if (!sectionElement) {
                throw new Error(
                    'No se encontró un elemento raíz válido.'
                );
            }

            // ----------------------------------------------------
            // BUSCAR PLACEHOLDER
            // ----------------------------------------------------

            const currentPlaceholder =
                placeholder ||
                app.querySelector(
                    `[data-section="${section}"]`
                );

            if (
                currentPlaceholder
            ) {

                currentPlaceholder.replaceWith(
                    sectionElement
                );

            } else {

                app.appendChild(
                    sectionElement
                );
            }

            state.loadedSections.add(
                section
            );

            utils.log(
                `Sección "${section}" cargada.`
            );

            // ----------------------------------------------------
            // INICIALIZAR COMPONENTES
            // ----------------------------------------------------

            initializeDynamicComponents(
                sectionElement
            );

        } catch (error) {

            utils.error(
                `Error cargando "${section}":`,
                error
            );

            if (placeholder) {

                placeholder.dataset.loading =
                    'false';

                placeholder.setAttribute(
                    'aria-busy',
                    'false'
                );

                placeholder.innerHTML = `
                    <div
                        class="romantic-loading-error"
                        role="alert"
                        style="
                            text-align:center;
                            padding:2rem;
                            color:var(--text-secondary);
                        "
                    >
                        <div
                            style="
                                font-size:2rem;
                                margin-bottom:.5rem;
                            "
                        >
                            💔
                        </div>

                        <p>
                            No se pudo cargar esta sección.
                        </p>

                        <button
                            type="button"
                            data-retry-section="${section}"
                            style="
                                margin-top:.75rem;
                                padding:.6rem 1rem;
                                border:0;
                                border-radius:999px;
                                cursor:pointer;
                            "
                        >
                            Intentar nuevamente
                        </button>
                    </div>
                `;
            }

        } finally {

            state.loadingSections.delete(
                section
            );

            if (placeholder) {
                placeholder.removeAttribute(
                    'aria-busy'
                );
            }
        }
    }

    // ============================================================
    // CREAR PLACEHOLDER
    // ============================================================

    function createSectionPlaceholder(
        section
    ) {

        const placeholder =
            document.createElement(
                'div'
            );

        placeholder.dataset.section =
            section;

        placeholder.dataset.loaded =
            'false';

        placeholder.setAttribute(
            'aria-label',
            `Cargando sección ${section}`
        );

        placeholder.style.cssText = `
            min-height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        placeholder.innerHTML = `
            <div
                style="
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    gap:.6rem;
                    min-height:120px;
                    padding:2rem;
                    color:var(--text-secondary);
                    text-align:center;
                "
            >
                <span
                    style="
                        font-size:1.5rem;
                        animation: romanticPulse 1.5s ease-in-out infinite;
                    "
                    aria-hidden="true"
                >
                    ❤️
                </span>

                <span>
                    Cargando ${section}...
                </span>
            </div>
        `;

        return placeholder;
    }

    // ============================================================
    // INICIALIZAR LAZY LOADING
    // ============================================================

    function initializeSections() {

        const critical =
            CONFIG.sections.slice(
                0,
                CONFIG.criticalSections
            );

        const lazy =
            CONFIG.sections.slice(
                CONFIG.criticalSections
            );

        // --------------------------------------------------------
        // Cargar inmediatamente
        // --------------------------------------------------------

        critical.forEach(
            section => {
                fetchSection(section);
            }
        );

        // --------------------------------------------------------
        // Lazy loading
        // --------------------------------------------------------

        if (
            'IntersectionObserver' in window
        ) {

            state.sectionObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(
                            entry => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                const placeholder =
                                    entry.target;

                                const section =
                                    placeholder.dataset.section;

                                if (
                                    !section ||
                                    state.loadedSections.has(
                                        section
                                    )
                                ) {
                                    return;
                                }

                                placeholder.dataset.loaded =
                                    'true';

                                state.sectionObserver.unobserve(
                                    placeholder
                                );

                                fetchSection(
                                    section,
                                    placeholder
                                );
                            }
                        );
                    },
                    {
                        root: null,
                        rootMargin:
                            CONFIG.lazyRootMargin,
                        threshold: 0.01
                    }
                );

            lazy.forEach(
                section => {

                    const placeholder =
                        createSectionPlaceholder(
                            section
                        );

                    app.appendChild(
                        placeholder
                    );

                    state.sectionObserver.observe(
                        placeholder
                    );
                }
            );

        } else {

            lazy.forEach(
                section => {
                    fetchSection(
                        section
                    );
                }
            );
        }
    }

    // ============================================================
    // INICIALIZAR COMPONENTES DINÁMICOS
    // ============================================================

    function initializeDynamicComponents(
        root = document
    ) {

        if (
            root.querySelector(
                '#sliderTrack'
            )
        ) {
            initSlider();
        }

        updateCounter();

        utils.log(
            'Componentes dinámicos actualizados.'
        );
    }


    // ============================================================
    // CARTA
    // ============================================================

    function openLetter() {

        const envelope =
            document.querySelector(
                '.carta-sobre'
            );

        const opened =
            document.getElementById(
                'cartaAbierta'
            );

        if (
            !envelope ||
            !opened
        ) {
            return;
        }

        envelope.style.display =
            'none';

        opened.hidden =
            false;

        const text =
            opened.querySelector(
                '.carta-texto-escrito'
            );

        if (text) {

            text.style.animation =
                'none';

            // Forzar reflow
            void text.offsetWidth;

            text.style.animation =
                'typing 3s steps(40) 1s forwards, blink 0.8s step-end infinite';

            text.style.overflow =
                'hidden';

            text.style.borderRight =
                '3px solid var(--romantic-accent)';

            text.style.whiteSpace =
                'nowrap';

            text.style.maxWidth =
                '0';

            const timer =
                setTimeout(
                    () => {

                        text.style.borderRight =
                            'none';

                    },
                    4500
                );

            state.timers.add(
                timer
            );
        }
    }

    // ============================================================
    // SORPRESA
    // ============================================================

    function showSurprise(button) {

        const surprise =
            document.getElementById(
                'mensajeSorpresa'
            );

        if (!surprise) {
            return;
        }

        surprise.hidden =
            false;

        surprise.style.animation =
            'none';

        void surprise.offsetWidth;

        surprise.style.animation =
            'bounceIn 0.6s ease forwards';

        if (button) {
            button.style.display =
                'none';
        }

        if (
            typeof window.lanzarConfetiMini ===
            'function'
        ) {
            window.lanzarConfetiMini();
        }
    }

    // ============================================================
    // RAZONES
    // ============================================================

    function showRandomReason() {

        const list =
            document.getElementById(
                'razones-list'
            );

        const display =
            document.getElementById(
                'razonDisplay'
            );

        if (
            !list ||
            !display
        ) {
            return;
        }

        const reasons =
            Array.from(
                list.querySelectorAll(
                    'p[data-razon]'
                )
            );

        if (
            reasons.length === 0
        ) {

            display.innerHTML =
                '<p class="razon-text">No hay razones definidas aún. ❤️</p>';

            return;
        }

        let index =
            Math.floor(
                Math.random() *
                reasons.length
            );

        const lastIndex =
            Number(
                display.dataset.lastIndex
            );

        // Evitar repetir inmediatamente
        if (
            reasons.length > 1 &&
            index === lastIndex
        ) {
            index =
                (index + 1) %
                reasons.length;
        }

        display.dataset.lastIndex =
            String(index);

        const text =
            reasons[index].textContent
                .trim();

        display.innerHTML = `
            <p class="razon-text">
                ${escapeHTML(text)}
            </p>
        `;

        display.animate(
            [
                {
                    opacity: 0,
                    transform:
                        'translateY(15px) scale(.95)'
                },
                {
                    opacity: 1,
                    transform:
                        'translateY(0) scale(1)'
                }
            ],
            {
                duration: 450,
                easing:
                    'cubic-bezier(.2,.8,.2,1)'
            }
        );
    }

    // ============================================================
    // ESCAPAR HTML
    // ============================================================

    function escapeHTML(value) {

        const div =
            document.createElement(
                'div'
            );

        div.textContent =
            value;

        return div.innerHTML;
    }

    // ============================================================
    // MODAL DE MOMENTOS
    // ============================================================

    function openMomentModal(
        card
    ) {

        const modal =
            document.getElementById(
                'momentoModal'
            );

        const body =
            document.getElementById(
                'momentoModalBody'
            );

        if (
            !modal ||
            !body
        ) {
            return;
        }

        const icon =
            card.querySelector(
                '.momento-icon'
            )?.textContent
                ?.trim() ||
            '❤️';

        const modalId =
            card.dataset.modal ||
            'momento1';

        const data =
            MOMENTOS[modalId] ||
            MOMENTOS.momento1;

        body.innerHTML = `
            <div
                class="momento-modal-icon"
                style="
                    font-size:3rem;
                    text-align:center;
                "
                aria-hidden="true"
            >
                ${escapeHTML(icon)}
            </div>

            <h2
                style="
                    text-align:center;
                    color:var(--romantic-accent);
                    font-family:'Playfair Display',serif;
                "
            >
                ${escapeHTML(data.titulo)}
            </h2>

            <p
                style="
                    text-align:center;
                    font-size:1.1rem;
                    color:var(--text-secondary);
                "
            >
                ${escapeHTML(data.descripcion)}
            </p>

            <div
                style="
                    margin-top:1rem;
                    border-top:1px solid var(--border-color);
                    padding-top:1rem;
                "
            >
                <p>
                    ${escapeHTML(data.detalle)}
                </p>
            </div>
        `;

        state.previousFocus =
            document.activeElement;

        state.previousBodyOverflow =
            document.body.style.overflow;

        state.modalOpen =
            true;

        modal.hidden =
            false;

        document.body.style.overflow =
            'hidden';

        // Accesibilidad
        modal.setAttribute(
            'aria-modal',
            'true'
        );

        modal.querySelector(
            '.momento-modal-close'
        )?.focus();
    }

    // ============================================================
    // CERRAR MODAL
    // ============================================================

    function closeMomentModal() {

        const modal =
            document.getElementById(
                'momentoModal'
            );

        if (!modal) {
            return;
        }

        modal.hidden =
            true;

        modal.removeAttribute(
            'aria-modal'
        );

        document.body.style.overflow =
            state.previousBodyOverflow ||
            '';

        state.modalOpen =
            false;

        if (
            state.previousFocus &&
            typeof state.previousFocus.focus ===
                'function'
        ) {
            state.previousFocus.focus();
        }

        state.previousFocus =
            null;
    }

    // ============================================================
    // EVENTOS GLOBALES
    // ============================================================

    document.addEventListener(
        'click',
        event => {

            const target =
                event.target;

            // ----------------------------------------------------
            // INTRO
            // ----------------------------------------------------

            if (
                target.closest(
                    '#introContinue'
                )
            ) {

                document
                    .getElementById(
                        'romantic-hero'
                    )
                    ?.scrollIntoView({
                        behavior:
                            utils.prefersReducedMotion()
                                ? 'auto'
                                : 'smooth',
                        block:
                            'start'
                    });

                return;
            }

            // ----------------------------------------------------
            // CARTA
            // ----------------------------------------------------

            if (
                target.closest(
                    '.carta-sobre'
                )
            ) {

                openLetter();

                return;
            }

            // ----------------------------------------------------
            // SORPRESA
            // ----------------------------------------------------

            const surpriseButton =
                target.closest(
                    '#btnSorpresa'
                );

            if (
                surpriseButton
            ) {

                showSurprise(
                    surpriseButton
                );

                return;
            }

            // ----------------------------------------------------
            // RAZONES
            // ----------------------------------------------------

            if (
                target.closest(
                    '#razonRevelar'
                )
            ) {

                showRandomReason();

                return;
            }

            // ----------------------------------------------------
            // MOMENTOS
            // ----------------------------------------------------

            const card =
                target.closest(
                    '.momento-card'
                );

            if (card) {

                openMomentModal(
                    card
                );

                return;
            }

            // ----------------------------------------------------
            // CERRAR MODAL
            // ----------------------------------------------------

            const closeButton =
                target.closest(
                    '.momento-modal-close'
                );

            const modal =
                document.getElementById(
                    'momentoModal'
                );

            if (
                closeButton
            ) {

                closeMomentModal();

                return;
            }

            if (
                modal &&
                target === modal
            ) {

                closeMomentModal();

                return;
            }

            // ----------------------------------------------------
            // REINTENTAR SECCIÓN
            // ----------------------------------------------------

            const retry =
                target.closest(
                    '[data-retry-section]'
                );

            if (retry) {

                const section =
                    retry.dataset.retrySection;

                const placeholder =
                    retry.closest(
                        '[data-section]'
                    );

                if (
                    section
                ) {

                    fetchSection(
                        section,
                        placeholder
                    );
                }
            }
        }
    );

    // ============================================================
    // TECLADO
    // ============================================================

    document.addEventListener(
        'keydown',
        event => {

            // Escape
            if (
                event.key === 'Escape' &&
                state.modalOpen
            ) {

                closeMomentModal();

                return;
            }

            // ----------------------------------------------------
            // FOCUS TRAP BÁSICO DEL MODAL
            // ----------------------------------------------------

            if (
                event.key === 'Tab' &&
                state.modalOpen
            ) {

                const modal =
                    document.getElementById(
                        'momentoModal'
                    );

                if (!modal) {
                    return;
                }

                const focusable =
                    modal.querySelectorAll(
                        'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                    );

                if (
                    focusable.length === 0
                ) {
                    return;
                }

                const first =
                    focusable[0];

                const last =
                    focusable[
                        focusable.length - 1
                    ];

                if (
                    event.shiftKey &&
                    document.activeElement ===
                        first
                ) {

                    event.preventDefault();

                    last.focus();

                } else if (
                    !event.shiftKey &&
                    document.activeElement ===
                        last
                ) {

                    event.preventDefault();

                    first.focus();
                }
            }
        }
    );

    // ============================================================
    // SLIDER
    // ============================================================

    let activeSlider = null;

    function initSlider() {

        if (
            activeSlider
        ) {
            return;
        }

        const track =
            document.getElementById(
                'sliderTrack'
            );

        const slides =
            track?.querySelectorAll(
                '.slider-slide'
            );

        const dotsContainer =
            document.getElementById(
                'sliderDots'
            );

        const prevButton =
            document.getElementById(
                'sliderPrev'
            );

        const nextButton =
            document.getElementById(
                'sliderNext'
            );

        const container =
            document.getElementById(
                'sliderContainer'
            );

        if (
            !track ||
            !slides ||
            !dotsContainer ||
            slides.length === 0
        ) {
            return;
        }

        let currentIndex =
            0;

        let autoplayTimer =
            null;

        let isPaused =
            false;

        let touchStartX =
            0;

        let touchStartY =
            0;

        let isTouching =
            false;

        const total =
            slides.length;

        // --------------------------------------------------------
        // DOTS
        // --------------------------------------------------------

        dotsContainer.innerHTML =
            '';

        const dotsFragment =
            document.createDocumentFragment();

        for (
            let i = 0;
            i < total;
            i++
        ) {

            const dot =
                document.createElement(
                    'button'
                );

            dot.type =
                'button';

            dot.className =
                'slider-dot' +
                (
                    i === 0
                        ? ' active'
                        : ''
                );

            dot.dataset.index =
                String(i);

            dot.setAttribute(
                'aria-label',
                `Ir a la foto ${i + 1}`
            );

            dot.setAttribute(
                'aria-current',
                i === 0
                    ? 'true'
                    : 'false'
            );

            dotsFragment.appendChild(
                dot
            );
        }

        dotsContainer.appendChild(
            dotsFragment
        );

        const dots =
            dotsContainer.querySelectorAll(
                '.slider-dot'
            );

        // --------------------------------------------------------
        // IR A SLIDE
        // --------------------------------------------------------

        function goToSlide(
            index,
            userAction = false
        ) {

            currentIndex =
                (
                    index + total
                ) % total;

            track.style.transform =
                `translate3d(${
                    -currentIndex * 100
                }%, 0, 0)`;

            dots.forEach(
                (dot, i) => {

                    const active =
                        i === currentIndex;

                    dot.classList.toggle(
                        'active',
                        active
                    );

                    dot.setAttribute(
                        'aria-current',
                        active
                            ? 'true'
                            : 'false'
                    );
                }
            );

            slides.forEach(
                (slide, i) => {

                    slide.setAttribute(
                        'aria-hidden',
                        i === currentIndex
                            ? 'false'
                            : 'true'
                    );
                }
            );

            if (
                userAction
            ) {
                restartAutoplay();
            }
        }

        // --------------------------------------------------------
        // SIGUIENTE
        // --------------------------------------------------------

        function nextSlide() {

            goToSlide(
                currentIndex + 1,
                true
            );
        }

        // --------------------------------------------------------
        // ANTERIOR
        // --------------------------------------------------------

        function prevSlide() {

            goToSlide(
                currentIndex - 1,
                true
            );
        }

        // --------------------------------------------------------
        // AUTOPLAY
        // --------------------------------------------------------

        function stopAutoplay() {

            if (
                autoplayTimer
            ) {

                clearInterval(
                    autoplayTimer
                );

                autoplayTimer =
                    null;
            }
        }

        function startAutoplay() {

            stopAutoplay();

            if (
                total <= 1 ||
                isPaused ||
                document.hidden ||
                utils.prefersReducedMotion()
            ) {
                return;
            }

            autoplayTimer =
                setInterval(
                    () => {

                        if (
                            !document.hidden &&
                            !isPaused
                        ) {

                            goToSlide(
                                currentIndex + 1
                            );
                        }

                    },
                    CONFIG.sliderAutoplay
                );
        }

        function restartAutoplay() {

            startAutoplay();
        }

        // --------------------------------------------------------
        // BOTONES
        // --------------------------------------------------------

        prevButton?.addEventListener(
            'click',
            prevSlide
        );

        nextButton?.addEventListener(
            'click',
            nextSlide
        );

        // --------------------------------------------------------
        // DOTS
        // --------------------------------------------------------

        dotsContainer.addEventListener(
            'click',
            event => {

                const dot =
                    event.target.closest(
                        '.slider-dot'
                    );

                if (!dot) {
                    return;
                }

                goToSlide(
                    Number(
                        dot.dataset.index
                    ),
                    true
                );
            }
        );

        // --------------------------------------------------------
        // TECLADO
        // --------------------------------------------------------

        dotsContainer.addEventListener(
            'keydown',
            event => {

                const dot =
                    event.target.closest(
                        '.slider-dot'
                    );

                if (!dot) {
                    return;
                }

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    goToSlide(
                        Number(
                            dot.dataset.index
                        ),
                        true
                    );
                }
            }
        );

        // --------------------------------------------------------
        // MOUSE
        // --------------------------------------------------------

        container?.addEventListener(
            'mouseenter',
            () => {

                isPaused =
                    true;

                stopAutoplay();
            }
        );

        container?.addEventListener(
            'mouseleave',
            () => {

                isPaused =
                    false;

                startAutoplay();
            }
        );

        // --------------------------------------------------------
        // TOUCH
        // --------------------------------------------------------

        container?.addEventListener(
            'touchstart',
            event => {

                const touch =
                    event.touches[0];

                if (!touch) {
                    return;
                }

                touchStartX =
                    touch.clientX;

                touchStartY =
                    touch.clientY;

                isTouching =
                    true;

                stopAutoplay();

            },
            {
                passive: true
            }
        );

        container?.addEventListener(
            'touchend',
            event => {

                if (!isTouching) {
                    return;
                }

                const touch =
                    event.changedTouches[0];

                if (!touch) {
                    return;
                }

                const diffX =
                    touchStartX -
                    touch.clientX;

                const diffY =
                    touchStartY -
                    touch.clientY;

                // Solo swipe horizontal
                if (
                    Math.abs(diffX) >
                        50 &&
                    Math.abs(diffX) >
                        Math.abs(diffY)
                ) {

                    if (
                        diffX > 0
                    ) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }

                isTouching =
                    false;

                startAutoplay();

            },
            {
                passive: true
            }
        );

        // --------------------------------------------------------
        // VISIBILIDAD
        // --------------------------------------------------------

        const visibilityHandler =
            () => {

                if (
                    document.hidden
                ) {

                    stopAutoplay();

                } else {

                    startAutoplay();
                }
            };

        document.addEventListener(
            'visibilitychange',
            visibilityHandler
        );

        // --------------------------------------------------------
        // INICIALIZAR
        // --------------------------------------------------------

        goToSlide(0);

        startAutoplay();

        activeSlider = {
            destroy() {

                stopAutoplay();

                document.removeEventListener(
                    'visibilitychange',
                    visibilityHandler
                );

                activeSlider =
                    null;
            }
        };

        state.sliderInitialized =
            true;

        utils.log(
            '📸 Slider inicializado.'
        );
    }

    // ============================================================
    // CONFETI ROMÁNTICO
    // ============================================================

    function lanzarConfetiMini() {

        if (
            utils.prefersReducedMotion()
        ) {
            return;
        }

        const existing =
            document.getElementById(
                'romantic-mini-confetti'
            );

        if (existing) {
            existing.remove();
        }

        const container =
            document.createElement(
                'div'
            );

        container.id =
            'romantic-mini-confetti';

        container.setAttribute(
            'aria-hidden',
            'true'
        );

        container.style.cssText = `
            position:fixed;
            inset:0;
            width:100%;
            height:100%;
            pointer-events:none;
            overflow:hidden;
            z-index:10000;
        `;

        document.body.appendChild(
            container
        );

        const emojis = [
            '❤️',
            '💕',
            '💖',
            '💗',
            '💓',
            '✨',
            '🌟',
            '💝'
        ];

        const count =
            utils.isMobile()
                ? CONFIG.confettiCountMobile
                : CONFIG.confettiCountDesktop;

        const fragment =
            document.createDocumentFragment();

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const element =
                document.createElement(
                    'span'
                );

            const size =
                utils.random(
                    16,
                    40
                );

            const startX =
                utils.random(
                    0,
                    window.innerWidth
                );

            const duration =
                utils.random(
                    1.8,
                    3.8
                );

            const delay =
                utils.random(
                    0,
                    0.8
                );

            const drift =
                utils.random(
                    -120,
                    120
                );

            const rotation =
                utils.random(
                    -180,
                    180
                );

            element.textContent =
                emojis[
                    utils.randomInt(
                        0,
                        emojis.length - 1
                    )
                ];

            element.style.cssText = `
                position:absolute;
                top:-50px;
                left:${startX}px;
                font-size:${size}px;
                line-height:1;
                opacity:0;
                pointer-events:none;
                user-select:none;
                will-change:transform,opacity;
                --confetti-drift:${drift}px;
                --confetti-rotation:${rotation}deg;
                animation:
                    romanticConfettiFall
                    ${duration}s
                    cubic-bezier(.2,.7,.3,1)
                    ${delay}s
                    forwards;
            `;

            fragment.appendChild(
                element
            );
        }

        container.appendChild(
            fragment
        );

        const cleanupTimer =
            setTimeout(
                () => {

                    container.remove();

                },
                5000
            );

        state.timers.add(
            cleanupTimer
        );
    }

    // Hacerla accesible desde otros scripts
    window.lanzarConfetiMini =
        lanzarConfetiMini;

    // ============================================================
    // CSS NECESARIO PARA EFECTOS
    // ============================================================

    function injectRomanticStyles() {

        if (
            document.getElementById(
                'romantic-js-styles'
            )
        ) {
            return;
        }

        const style =
            document.createElement(
                'style'
            );

        style.id =
            'romantic-js-styles';

        style.textContent = `
            @keyframes romanticPulse {

                0%,
                100% {
                    transform:scale(1);
                    opacity:.7;
                }

                50% {
                    transform:scale(1.2);
                    opacity:1;
                }
            }

            @keyframes romanticConfettiFall {

                0% {
                    opacity:0;
                    transform:
                        translate3d(
                            0,
                            -30px,
                            0
                        )
                        rotate(0deg)
                        scale(.7);
                }

                10% {
                    opacity:1;
                }

                55% {
                    opacity:1;
                    transform:
                        translate3d(
                            var(--confetti-drift),
                            50vh,
                            0
                        )
                        rotate(
                            calc(
                                var(--confetti-rotation) * .5
                            )
                        )
                        scale(1);
                }

                100% {
                    opacity:0;
                    transform:
                        translate3d(
                            calc(
                                var(--confetti-drift) * 1.5
                            ),
                            110vh,
                            0
                        )
                        rotate(
                            var(--confetti-rotation)
                        )
                        scale(.65);
                }
            }

            @media (
                prefers-reduced-motion: reduce
            ) {

                .romantic-loading-error,
                .slider-slide,
                .razon-text {
                    animation:none !important;
                    transition:none !important;
                }
            }
        `;

        document.head.appendChild(
            style
        );
    }

    // ============================================================
    // OBSERVAR CAMBIOS DEL DOM
    // ============================================================

    function initializeMutationObserver() {

        if (
            !('MutationObserver' in window)
        ) {
            return;
        }

        state.mutationObserver =
            new MutationObserver(
                mutations => {

                    let sliderFound =
                        false;

                    for (
                        const mutation of mutations
                    ) {

                        if (
                            mutation.addedNodes.length
                        ) {

                            mutation.addedNodes.forEach(
                                node => {

                                    if (
                                        node.nodeType !==
                                        Node.ELEMENT_NODE
                                    ) {
                                        return;
                                    }

                                    if (
                                        node.id ===
                                        'sliderTrack' ||
                                        node.querySelector?.(
                                            '#sliderTrack'
                                        )
                                    ) {

                                        sliderFound =
                                            true;
                                    }
                                }
                            );
                        }
                    }

                    if (
                        sliderFound
                    ) {

                        initSlider();
                    }
                }
            );

        state.mutationObserver.observe(
            app,
            {
                childList: true,
                subtree: true
            }
        );
    }

    // ============================================================
    // INICIALIZACIÓN
    // ============================================================

    injectRomanticStyles();

    initializeSections();

    initializeMutationObserver();

    // ============================================================
    // LIMPIEZA
    // ============================================================

    window.addEventListener(
        'pagehide',
        () => {

            state.destroyed =
                true;

            if (
                state.sectionObserver
            ) {

                state.sectionObserver.disconnect();

                state.sectionObserver =
                    null;
            }

            if (
                state.mutationObserver
            ) {

                state.mutationObserver.disconnect();

                state.mutationObserver =
                    null;
            }

            if (
                activeSlider
            ) {

                activeSlider.destroy();
            }

            state.timers.forEach(
                timer => {
                    clearTimeout(
                        timer
                    );

                    clearInterval(
                        timer
                    );
                }
            );

            state.timers.clear();

            closeMomentModal();
        },
        {
            once: true
        }
    );

    // ============================================================
    // FINAL
    // ============================================================

    console.log(
        '❤️ ROMANTIC.JS cargado correctamente.'
    );

});
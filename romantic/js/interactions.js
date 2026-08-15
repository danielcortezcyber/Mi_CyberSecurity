// ================================================================
// INTERACTIONS.JS
// Microinteracciones + Lightbox + Slider de galería
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // UTILIDADES
    // ============================================================

    function safeFocus(element) {
        if (!element || typeof element.focus !== 'function') {
            return;
        }

        requestAnimationFrame(() => {
            try {
                element.focus({ preventScroll: true });
            } catch {
                element.focus();
            }
        });
    }

    function isModalOpen() {
        return (
            lightboxModal &&
            !lightboxModal.hidden
        );
    }

    // ============================================================
    // 1. LIGHTBOX
    // ============================================================

    const lightboxModal =
        document.getElementById('lightboxModal');

    const lightboxBody =
        document.getElementById('lightboxBody');

    const closeBtn =
        document.getElementById('lightboxCloseBtn');

    const lightboxContent =
        lightboxModal
            ? lightboxModal.querySelector('.lightbox-content')
            : null;

    let lastFocusedElement = null;

    // ------------------------------------------------------------
    // Elementos enfocables
    // ------------------------------------------------------------

    function getFocusableElements(container) {
        if (!container) {
            return [];
        }

        return Array.from(
            container.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(element => {
            return (
                !element.hidden &&
                element.getAttribute('aria-hidden') !== 'true'
            );
        });
    }

    // ------------------------------------------------------------
    // Focus trap
    // ------------------------------------------------------------

    function trapFocus(event) {
        if (
            event.key !== 'Tab' ||
            !isModalOpen() ||
            !lightboxContent
        ) {
            return;
        }

        const focusable =
            getFocusableElements(lightboxContent);

        if (!focusable.length) {
            event.preventDefault();
            return;
        }

        const first =
            focusable[0];

        const last =
            focusable[focusable.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {
            event.preventDefault();
            safeFocus(last);

        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            safeFocus(first);
        }
    }

    // ------------------------------------------------------------
    // Leer tarjeta de galería
    // ------------------------------------------------------------

    function readGalleryItem(item) {
        if (!item) {
            return {
                icon: '❤️',
                title: 'Momento especial',
                desc: ''
            };
        }

        const iconElement =
            item.querySelector('.galeria-emoji') ||
            item.querySelector('.galeria-thumb span');

        const titleElement =
            item.querySelector('.galeria-info h4');

        const descElement =
            item.querySelector('.galeria-info p');

        return {
            icon:
                iconElement?.textContent?.trim() ||
                '❤️',

            title:
                titleElement?.textContent?.trim() ||
                'Momento especial',

            desc:
                descElement?.textContent?.trim() ||
                ''
        };
    }

    // ------------------------------------------------------------
    // Construir Lightbox
    // ------------------------------------------------------------

    function buildLightbox(icon, title, desc) {
        if (!lightboxBody) {
            return;
        }

        lightboxBody.replaceChildren();

        const iconElement =
            document.createElement('div');

        iconElement.className =
            'lightbox-icon';

        iconElement.setAttribute(
            'aria-hidden',
            'true'
        );

        iconElement.textContent =
            icon || '❤️';

        const titleElement =
            document.createElement('h2');

        titleElement.className =
            'lightbox-title';

        titleElement.id =
            'lightboxTitle';

        titleElement.textContent =
            title || 'Momento especial';

        const descElement =
            document.createElement('p');

        descElement.className =
            'lightbox-desc';

        descElement.textContent =
            desc || '';

        lightboxBody.append(
            iconElement,
            titleElement,
            descElement
        );
    }

    // ------------------------------------------------------------
    // Abrir Lightbox
    // ------------------------------------------------------------

    function openLightbox(
        icon,
        title,
        desc,
        triggerElement
    ) {
        if (
            !lightboxModal ||
            !lightboxBody
        ) {
            return;
        }

        lastFocusedElement =
            triggerElement ||
            document.activeElement;

        buildLightbox(
            icon,
            title,
            desc
        );

        lightboxModal.hidden = false;

        lightboxModal.setAttribute(
            'role',
            'dialog'
        );

        lightboxModal.setAttribute(
            'aria-modal',
            'true'
        );

        lightboxModal.setAttribute(
            'aria-labelledby',
            'lightboxTitle'
        );

        document.body.classList.add(
            'lightbox-open'
        );

        document.body.style.overflow =
            'hidden';

        document.addEventListener(
            'keydown',
            trapFocus
        );

        safeFocus(
            closeBtn ||
            lightboxContent
        );
    }

    // ------------------------------------------------------------
    // Cerrar Lightbox
    // ------------------------------------------------------------

    function closeLightbox() {
        if (!isModalOpen()) {
            return;
        }

        lightboxModal.hidden = true;

        document.body.classList.remove(
            'lightbox-open'
        );

        document.body.style.overflow =
            '';

        document.removeEventListener(
            'keydown',
            trapFocus
        );

        const restoreElement =
            lastFocusedElement;

        lastFocusedElement = null;

        safeFocus(restoreElement);
    }

    // ------------------------------------------------------------
    // Abrir con clic
    // ------------------------------------------------------------

    document.addEventListener(
        'click',
        function (event) {

            const item =
                event.target.closest(
                    '.galeria-item'
                );

            if (!item) {
                return;
            }

            const data =
                readGalleryItem(item);

            openLightbox(
                data.icon,
                data.title,
                data.desc,
                item
            );
        }
    );

    // ------------------------------------------------------------
    // Abrir con Enter / Espacio
    // ------------------------------------------------------------

    document.addEventListener(
        'keydown',
        function (event) {

            const item =
                event.target.closest(
                    '.galeria-item'
                );

            if (!item) {
                return;
            }

            if (
                event.key === 'Enter' ||
                event.key === ' '
            ) {

                event.preventDefault();

                const data =
                    readGalleryItem(item);

                openLightbox(
                    data.icon,
                    data.title,
                    data.desc,
                    item
                );
            }
        }
    );

    // ------------------------------------------------------------
    // Botón cerrar
    // ------------------------------------------------------------

    if (closeBtn) {

        closeBtn.addEventListener(
            'click',
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeLightbox();
            }
        );
    }

    // ------------------------------------------------------------
    // Cerrar haciendo clic fuera
    // ------------------------------------------------------------

    if (lightboxModal) {

        lightboxModal.addEventListener(
            'click',
            function (event) {

                if (
                    event.target ===
                    lightboxModal
                ) {
                    closeLightbox();
                }
            }
        );
    }

    // ------------------------------------------------------------
    // Escape
    // ------------------------------------------------------------

    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key === 'Escape' &&
                isModalOpen()
            ) {

                event.preventDefault();

                closeLightbox();
            }
        }
    );

    // ============================================================
    // 2. BRILLO DE TÍTULOS
    // ============================================================

    document
        .querySelectorAll(
            '.romantic-title, .hero-romantic-title'
        )
        .forEach(function (element) {

            if (!prefersReducedMotion) {

                element.addEventListener(
                    'mouseenter',
                    function () {
                        this.classList.add(
                            'title-glow'
                        );
                    }
                );

                element.addEventListener(
                    'mouseleave',
                    function () {
                        this.classList.remove(
                            'title-glow'
                        );
                    }
                );

                element.addEventListener(
                    'focus',
                    function () {
                        this.classList.add(
                            'title-glow'
                        );
                    }
                );

                element.addEventListener(
                    'blur',
                    function () {
                        this.classList.remove(
                            'title-glow'
                        );
                    }
                );
            }
        });

    // ============================================================
    // 3. CONTADORES ANIMADOS
    // ============================================================

    const animatedCounters =
        new WeakSet();

    function animateCounter(
        element,
        target
    ) {
        if (!element) {
            return;
        }

        if (
            prefersReducedMotion ||
            target <= 0
        ) {

            element.textContent =
                `${target}%`;

            return;
        }

        if (
            animatedCounters.has(element)
        ) {
            return;
        }

        animatedCounters.add(element);

        const duration = 1500;

        const startTime =
            performance.now();

        function updateCounter(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const current =
                Math.round(
                    target * eased
                );

            element.textContent =
                `${current}%`;

            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                element.textContent =
                    `${target}%`;
            }
        }

        requestAnimationFrame(
            updateCounter
        );
    }

    const statElements =
        document.querySelectorAll(
            '.divertido-stat'
        );

    if (
        statElements.length &&
        'IntersectionObserver' in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const element =
                                entry.target;

                            const value =
                                parseFloat(
                                    element.textContent
                                        .replace(
                                            /[^0-9.-]/g,
                                            ''
                                        )
                                );

                            if (
                                Number.isFinite(value)
                            ) {

                                animateCounter(
                                    element,
                                    value
                                );
                            }

                            counterObserver.unobserve(
                                element
                            );
                        }
                    );
                },
                {
                    threshold: 0.5
                }
            );

        statElements.forEach(
            function (element) {
                counterObserver.observe(
                    element
                );
            }
        );

    } else {

        statElements.forEach(
            function (element) {

                const value =
                    parseFloat(
                        element.textContent
                            .replace(
                                /[^0-9.-]/g,
                                ''
                            )
                    );

                if (
                    Number.isFinite(value)
                ) {

                    element.textContent =
                        `${value}%`;
                }
            }
        );
    }

    // ============================================================
    // 4. SLIDER DE GALERÍA
    // ============================================================

    let sliderInitialized = false;

    function initSlider() {

        if (sliderInitialized) {
            return true;
        }

        const track =
            document.getElementById(
                'sliderTrack'
            );

        const dotsContainer =
            document.getElementById(
                'sliderDots'
            );

        const prevBtn =
            document.getElementById(
                'sliderPrev'
            );

        const nextBtn =
            document.getElementById(
                'sliderNext'
            );

        const container =
            document.getElementById(
                'sliderContainer'
            );

        if (
            !track ||
            !dotsContainer
        ) {
            return false;
        }

        const slides =
            Array.from(
                track.querySelectorAll(
                    '.slider-slide'
                )
            );

        const totalSlides =
            slides.length;

        if (!totalSlides) {
            return false;
        }

        sliderInitialized = true;

        // --------------------------------------------------------
        // Estado
        // --------------------------------------------------------

        let currentIndex = 0;

        let autoPlayInterval = null;

        let isHovered = false;

        let isFocused = false;

        let isVisible = true;

        let touchStartX = 0;

        let touchStartY = 0;

        let touching = false;

        // --------------------------------------------------------
        // Configuración
        // --------------------------------------------------------

        const AUTO_PLAY_TIME = 4000;
        const SWIPE_THRESHOLD = 50;

        // --------------------------------------------------------
        // Crear dots
        // --------------------------------------------------------

        dotsContainer.replaceChildren();

        const dots = [];

        for (
            let i = 0;
            i < totalSlides;
            i++
        ) {

            const dot =
                document.createElement(
                    'button'
                );

            dot.type = 'button';

            dot.className =
                'slider-dot';

            dot.dataset.index =
                String(i);

            dot.setAttribute(
                'aria-label',
                `Ir a la imagen ${i + 1}`
            );

            dot.setAttribute(
                'aria-controls',
                'sliderTrack'
            );

            dot.addEventListener(
                'click',
                function () {

                    goToSlide(i);

                    resetAutoPlay();
                }
            );

            dotsContainer.appendChild(
                dot
            );

            dots.push(dot);
        }

        // --------------------------------------------------------
        // Actualizar dots
        // --------------------------------------------------------

        function updateDots() {

            dots.forEach(
                function (dot, index) {

                    const active =
                        index === currentIndex;

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

                    dot.setAttribute(
                        'aria-label',
                        active
                            ? `Imagen ${index + 1}, actual`
                            : `Ir a la imagen ${index + 1}`
                    );
                }
            );
        }

        // --------------------------------------------------------
        // Actualizar slides
        // --------------------------------------------------------

        function updateSlides() {

            slides.forEach(
                function (slide, index) {

                    const active =
                        index === currentIndex;

                    slide.classList.toggle(
                        'active',
                        active
                    );

                    slide.setAttribute(
                        'aria-hidden',
                        active
                            ? 'false'
                            : 'true'
                    );
                }
            );
        }

        // --------------------------------------------------------
        // Ir a slide
        // --------------------------------------------------------

        function goToSlide(index) {

            if (!totalSlides) {
                return;
            }

            if (
                index < 0
            ) {
                index =
                    totalSlides - 1;
            }

            if (
                index >= totalSlides
            ) {
                index = 0;
            }

            currentIndex =
                index;

            const offset =
                -currentIndex * 100;

            track.style.transform =
                `translate3d(${offset}%, 0, 0)`;

            updateDots();
            updateSlides();
        }

        // --------------------------------------------------------
        // Siguiente
        // --------------------------------------------------------

        function nextSlide() {

            goToSlide(
                currentIndex + 1
            );
        }

        // --------------------------------------------------------
        // Anterior
        // --------------------------------------------------------

        function prevSlide() {

            goToSlide(
                currentIndex - 1
            );
        }

        // --------------------------------------------------------
        // ¿Debe ejecutarse autoplay?
        // --------------------------------------------------------

        function canAutoPlay() {

            return (
                !prefersReducedMotion &&
                !document.hidden &&
                isVisible &&
                !isHovered &&
                !isFocused
            );
        }

        // --------------------------------------------------------
        // Iniciar autoplay
        // --------------------------------------------------------

        function startAutoPlay() {

            if (!canAutoPlay()) {
                return;
            }

            stopAutoPlay();

            autoPlayInterval =
                window.setInterval(
                    function () {

                        if (
                            canAutoPlay()
                        ) {
                            nextSlide();
                        }

                    },
                    AUTO_PLAY_TIME
                );
        }

        // --------------------------------------------------------
        // Detener autoplay
        // --------------------------------------------------------

        function stopAutoPlay() {

            if (
                autoPlayInterval !== null
            ) {

                clearInterval(
                    autoPlayInterval
                );

                autoPlayInterval = null;
            }
        }

        // --------------------------------------------------------
        // Reiniciar autoplay
        // --------------------------------------------------------

        function resetAutoPlay() {

            stopAutoPlay();

            startAutoPlay();
        }

        // --------------------------------------------------------
        // Botón anterior
        // --------------------------------------------------------

        if (prevBtn) {

            prevBtn.addEventListener(
                'click',
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    prevSlide();

                    resetAutoPlay();
                }
            );
        }

        // --------------------------------------------------------
        // Botón siguiente
        // --------------------------------------------------------

        if (nextBtn) {

            nextBtn.addEventListener(
                'click',
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    nextSlide();

                    resetAutoPlay();
                }
            );
        }

        // --------------------------------------------------------
        // Teclado
        // --------------------------------------------------------

        if (container) {

            if (
                !container.hasAttribute(
                    'tabindex'
                )
            ) {

                container.setAttribute(
                    'tabindex',
                    '0'
                );
            }

            container.addEventListener(
                'keydown',
                function (event) {

                    if (
                        event.key ===
                        'ArrowLeft'
                    ) {

                        event.preventDefault();

                        prevSlide();

                        resetAutoPlay();

                    } else if (
                        event.key ===
                        'ArrowRight'
                    ) {

                        event.preventDefault();

                        nextSlide();

                        resetAutoPlay();
                    }
                }
            );

            // Mouse entra
            container.addEventListener(
                'mouseenter',
                function () {

                    isHovered = true;

                    stopAutoPlay();
                }
            );

            // Mouse sale
            container.addEventListener(
                'mouseleave',
                function () {

                    isHovered = false;

                    startAutoPlay();
                }
            );

            // Focus entra
            container.addEventListener(
                'focusin',
                function () {

                    isFocused = true;

                    stopAutoPlay();
                }
            );

            // Focus sale
            container.addEventListener(
                'focusout',
                function () {

                    requestAnimationFrame(
                        function () {

                            if (
                                !container.contains(
                                    document.activeElement
                                )
                            ) {

                                isFocused = false;

                                startAutoPlay();
                            }
                        }
                    );
                }
            );
        }

        // --------------------------------------------------------
        // Touch / Swipe
        // --------------------------------------------------------

        track.addEventListener(
            'touchstart',
            function (event) {

                if (
                    event.touches.length !== 1
                ) {
                    return;
                }

                touching = true;

                touchStartX =
                    event.touches[0].clientX;

                touchStartY =
                    event.touches[0].clientY;

                stopAutoPlay();

            },
            {
                passive: true
            }
        );

        track.addEventListener(
            'touchend',
            function (event) {

                if (!touching) {
                    return;
                }

                touching = false;

                const touch =
                    event.changedTouches[0];

                const endX =
                    touch.clientX;

                const endY =
                    touch.clientY;

                const diffX =
                    touchStartX - endX;

                const diffY =
                    touchStartY - endY;

                if (
                    Math.abs(diffX) >
                    Math.abs(diffY) &&
                    Math.abs(diffX) >=
                    SWIPE_THRESHOLD
                ) {

                    if (
                        diffX > 0
                    ) {

                        nextSlide();

                    } else {

                        prevSlide();
                    }
                }

                startAutoPlay();

            },
            {
                passive: true
            }
        );

        track.addEventListener(
            'touchcancel',
            function () {

                touching = false;

                startAutoPlay();
            },
            {
                passive: true
            }
        );

        // --------------------------------------------------------
        // Cambiar pestaña
        // --------------------------------------------------------

        document.addEventListener(
            'visibilitychange',
            function () {

                if (
                    document.hidden
                ) {

                    stopAutoPlay();

                } else {

                    startAutoPlay();
                }
            }
        );

        // --------------------------------------------------------
        // Detectar si el slider está visible
        // --------------------------------------------------------

        if (
            container &&
            'IntersectionObserver' in window
        ) {

            const visibilityObserver =
                new IntersectionObserver(
                    function (entries) {

                        entries.forEach(
                            function (entry) {

                                isVisible =
                                    entry.isIntersecting;

                                if (
                                    isVisible
                                ) {

                                    startAutoPlay();

                                } else {

                                    stopAutoPlay();
                                }
                            }
                        );
                    },
                    {
                        threshold: 0.15
                    }
                );

            visibilityObserver.observe(
                container
            );
        }

        // --------------------------------------------------------
        // Inicializar
        // --------------------------------------------------------

        goToSlide(0);

        startAutoPlay();

        console.log(
            `📸 Slider inicializado: ${totalSlides} slides`
        );

        return true;
    }

    // ============================================================
    // 5. CARGA DINÁMICA DEL SLIDER
    // ============================================================

    if (
        document.getElementById(
            'sliderTrack'
        )
    ) {

        initSlider();

    } else if (
        'MutationObserver' in window
    ) {

        const observerSlider =
            new MutationObserver(
                function () {

                    if (
                        document.getElementById(
                            'sliderTrack'
                        )
                    ) {

                        if (
                            initSlider()
                        ) {

                            observerSlider.disconnect();
                        }
                    }
                }
            );

        observerSlider.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

        // Seguridad: no mantener
        // el observer indefinidamente.

        setTimeout(
            function () {

                observerSlider.disconnect();

            },
            15000
        );
    }

    // ============================================================
    // 6. HACER GALERÍA ACCESIBLE
    // ============================================================

    document
        .querySelectorAll(
            '.galeria-item'
        )
        .forEach(
            function (item) {

                const tag =
                    item.tagName.toLowerCase();

                const nativeInteractive =
                    [
                        'a',
                        'button',
                        'input',
                        'select',
                        'textarea'
                    ].includes(tag);

                if (
                    !nativeInteractive
                ) {

                    if (
                        !item.hasAttribute(
                            'tabindex'
                        )
                    ) {

                        item.setAttribute(
                            'tabindex',
                            '0'
                        );
                    }

                    if (
                        !item.hasAttribute(
                            'role'
                        )
                    ) {

                        item.setAttribute(
                            'role',
                            'button'
                        );
                    }
                }
            }
        );

    // ============================================================
    // FINAL
    // ============================================================

    console.log(
        '✨ Interacciones románticas activadas.'
    );

    console.log(
        '🖼️ Lightbox: OK'
    );

    console.log(
        '📸 Slider: OK'
    );

    console.log(
        '⌨️ Teclado: OK'
    );

    console.log(
        '📱 Touch / Swipe: OK'
    );

});
// js/navbar.js - VERSIÓN CORREGIDA (sin errores de classList)
(function() {
    "use strict";

    let isMobile = window.innerWidth <= 768;
    let dropdownOpen = false;

    function initNavbar() {
        const navbar = document.getElementById('navbar'); // ✅ Usamos ID específico
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        const dropdownToggle = document.getElementById('navDropdownToggle');
        const dropdownMenu = document.getElementById('navDropdownMenu');
        const dropdownLi = document.getElementById('navDropdown');

        // Si no hay navbar, salir (esperar a que se cargue)
        if (!navbar) {
            console.warn('⚠️ Navbar no encontrado, reintentando...');
            setTimeout(initNavbar, 200);
            return;
        }

        // ===== 1. Efecto de scroll (con verificación de existencia) =====
        function handleScroll() {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }

        // Eliminar listeners antiguos si existen
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);

        // Ejecutar una vez al inicio para establecer el estado
        handleScroll();

        // ===== 2. Detectar cambios de tamaño =====
        window.addEventListener('resize', function() {
            isMobile = window.innerWidth <= 768;
            if (!isMobile && dropdownLi && dropdownLi.classList.contains('open')) {
                dropdownLi.classList.remove('open');
                if (dropdownToggle) {
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // ===== 3. Menú hamburguesa =====
        if (toggle && menu) {
            if (toggle.dataset.listener) return;
            toggle.dataset.listener = 'true';

            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                menu.classList.toggle('active');
                const expanded = menu.classList.contains('active');
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });

            menu.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(function(link) {
                link.addEventListener('click', function() {
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    if (dropdownLi) dropdownLi.classList.remove('open');
                });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });

            document.addEventListener('click', function(e) {
                if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // ===== 4. DROPDOWN "MÁS" =====
        if (dropdownToggle && dropdownLi && dropdownMenu) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (isMobile) {
                    dropdownLi.classList.toggle('open');
                    const isOpen = dropdownLi.classList.contains('open');
                    dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                } else {
                    dropdownLi.classList.toggle('open');
                    const isOpen = dropdownLi.classList.contains('open');
                    dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                }
            });

            dropdownLi.addEventListener('mouseenter', function() {
                if (!isMobile) {
                    this.classList.add('open');
                    dropdownToggle.setAttribute('aria-expanded', 'true');
                }
            });
            dropdownLi.addEventListener('mouseleave', function() {
                if (!isMobile) {
                    if (!this.classList.contains('open')) {
                        this.classList.remove('open');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            dropdownMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    dropdownLi.classList.remove('open');
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                    if (menu) {
                        menu.classList.remove('active');
                        if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });

            document.addEventListener('click', function(e) {
                if (dropdownLi.classList.contains('open') && !dropdownLi.contains(e.target)) {
                    dropdownLi.classList.remove('open');
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // ===== 5. Marcar enlace activo según scroll =====
        if ('IntersectionObserver' in window) {
            const links = document.querySelectorAll('.nav-menu a:not(.nav-dropdown-toggle)');
            const sections = document.querySelectorAll('section[id]');
            if (sections.length) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            links.forEach(function(link) {
                                link.classList.remove('active');
                                if (link.getAttribute('href') === '#' + entry.target.id) {
                                    link.classList.add('active');
                                }
                            });
                        }
                    });
                }, { rootMargin: '-45% 0px -50% 0px' });
                sections.forEach(function(s) { observer.observe(s); });
            }
        }

        console.log('✅ Navbar Cyber Green inicializado correctamente (sin errores)');
    }

    // ===== Inicializar con eventos =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }

    document.addEventListener('navbar-cargado', function() {
        setTimeout(initNavbar, 100);
    });
    document.addEventListener('secciones-cargadas', function() {
        setTimeout(initNavbar, 150);
    });
})();
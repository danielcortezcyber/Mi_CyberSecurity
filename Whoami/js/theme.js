// js/theme.js
(function() {
    "use strict";

    const STORAGE_KEY = 'dc_theme_preference';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = localStorage.getItem(STORAGE_KEY) || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        currentTheme = theme;
        updateButtonIcon(theme);
        document.dispatchEvent(new Event('theme-changed'));
        console.log(`🌓 Tema cambiado a: ${theme}`);
    }

    function updateButtonIcon(theme) {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const icon = btn.querySelector('.icon');
        const label = btn.querySelector('.label');
        if (theme === 'dark') {
            if (icon) icon.textContent = '☀️';
            if (label) label.textContent = 'Claro';
            btn.setAttribute('aria-label', 'Cambiar a modo claro');
        } else {
            if (icon) icon.textContent = '🌙';
            if (label) label.textContent = 'Tema';
            btn.setAttribute('aria-label', 'Cambiar a modo oscuro');
        }
    }

    function initTheme() {
        applyTheme(currentTheme);
        console.log('✅ Theme system initialized');
    }

    function linkButton() {
        const btn = document.getElementById('themeToggle');
        if (!btn) {
            console.warn('⏳ Botón de tema no encontrado, reintentando...');
            if (!window._themeRetry) window._themeRetry = 0;
            if (window._themeRetry < 20) {
                window._themeRetry++;
                setTimeout(linkButton, 300);
            }
            return;
        }
        window._themeRetry = 0;
        if (btn.dataset.listener) return;
        btn.dataset.listener = 'true';

        btn.addEventListener('click', function() {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
        updateButtonIcon(currentTheme);
        console.log('✅ Botón de tema enlazado correctamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            linkButton();
        });
    } else {
        initTheme();
        linkButton();
    }

    document.addEventListener('navbar-cargado', function() {
        setTimeout(linkButton, 200);
    });
    document.addEventListener('secciones-cargadas', function() {
        setTimeout(linkButton, 200);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
})();
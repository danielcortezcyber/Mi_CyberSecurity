// js/site-stats.js
(function() {
    "use strict";

    const LAUNCH_DATE = new Date('2025-01-15T00:00:00');
    const LAST_UPDATE = new Date('2026-08-06T14:30:00');

    function updateClock() {
        const clockElement = document.getElementById('liveClock');
        if (!clockElement) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function updateUptime() {
        const now = new Date();
        const diffMs = now - LAUNCH_DATE;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        const uptimeElement = document.getElementById('siteUptime');
        if (uptimeElement) {
            uptimeElement.textContent = `${diffDays}d ${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
        }
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('es-ES', options);
    }

    function showLastUpdate() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = formatDate(LAST_UPDATE);
        }
    }

    function init() {
        updateClock();
        updateUptime();
        showLastUpdate();
        setInterval(updateClock, 1000);
        setInterval(updateUptime, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('secciones-cargadas', function() {
        showLastUpdate();
        updateClock();
    });

    console.log('⏱️ Estadísticas del sitio inicializadas');
})();
// js/cmd-search.js - VERSIÓN DEFINITIVA
(function() {
    "use strict";

    let initAttempts = 0;
    const MAX_ATTEMPTS = 20;

    function initSearch() {
        const searchInput = document.getElementById('cmdSearch');
        const clearBtn = document.getElementById('cmdSearchClear');
        const countSpan = document.getElementById('cmdSearchCount');

        // Si no existen, reintentar
        if (!searchInput || !countSpan) {
            initAttempts++;
            if (initAttempts < MAX_ATTEMPTS) {
                console.warn(`⏳ Buscador CMD no encontrado (intento ${initAttempts}/${MAX_ATTEMPTS}), reintentando...`);
                setTimeout(initSearch, 400);
            } else {
                console.error('❌ Buscador CMD no encontrado después de 20 intentos. Verifica que el HTML tenga los IDs correctos.');
            }
            return;
        }

        // Resetear contador
        initAttempts = 0;

        // Buscar elementos
        const cards = document.querySelectorAll('.cmd-card');
        const sections = document.querySelectorAll('.cmd-section');

        function filterCards(query) {
            const q = query.toLowerCase().trim();
            let visibleCount = 0;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isVisible = !q || text.includes(q);
                card.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;
            });

            sections.forEach(section => {
                const sectionCards = section.querySelectorAll('.cmd-card');
                let hasVisible = false;
                sectionCards.forEach(c => {
                    if (c.style.display !== 'none') hasVisible = true;
                });
                section.style.display = hasVisible ? '' : 'none';
            });

            countSpan.textContent = visibleCount;
            if (clearBtn) clearBtn.hidden = !q;

            // Mensaje vacío
            let emptyMsg = document.getElementById('cmdEmptyMessage');
            if (visibleCount === 0 && q) {
                if (!emptyMsg) {
                    emptyMsg = document.createElement('div');
                    emptyMsg.id = 'cmdEmptyMessage';
                    emptyMsg.className = 'ps-empty-message';
                    emptyMsg.innerHTML = `
                        <p>🔍 No se encontraron comandos que coincidan con "<strong>${q}</strong>"</p>
                        <p style="font-size:0.9rem;color:var(--text-secondary);">Prueba con otra palabra o revisa la ortografía.</p>
                    `;
                    const grid = document.querySelector('.cmd-grid');
                    if (grid) grid.parentNode.insertBefore(emptyMsg, grid.nextSibling);
                } else {
                    emptyMsg.innerHTML = `
                        <p>🔍 No se encontraron comandos que coincidan con "<strong>${q}</strong>"</p>
                        <p style="font-size:0.9rem;color:var(--text-secondary);">Prueba con otra palabra o revisa la ortografía.</p>
                    `;
                    emptyMsg.style.display = 'block';
                }
            } else {
                if (emptyMsg) emptyMsg.style.display = 'none';
            }
        }

        // Eventos
        let timeout = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                filterCards(this.value);
            }, 200);
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                filterCards('');
                searchInput.focus();
            });
        }

        // Inicializar
        filterCards('');
        console.log('🔍 Buscador CMD inicializado correctamente');
    }

    // Intentar inmediatamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }

    // Escuchar evento de secciones cargadas
    document.addEventListener('secciones-cargadas', function() {
        console.log('📢 Evento secciones-cargadas recibido en cmd-search');
        // Si ya se inicializó, no reiniciar
        if (document.getElementById('cmdSearch') && initAttempts === 0) {
            console.log('ℹ️ Buscador CMD ya existe y ya se inicializó');
            return;
        }
        initSearch();
    });

    // También escuchar el evento de navbar cargado (por si el HTML se inyecta después)
    document.addEventListener('navbar-cargado', function() {
        console.log('📢 Evento navbar-cargado recibido en cmd-search');
        setTimeout(initSearch, 200);
    });

})();
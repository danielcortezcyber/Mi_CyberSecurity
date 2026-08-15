// js/ps-search.js
(function() {
    "use strict";

    function initSearch() {
        const searchInput = document.getElementById('psSearch');
        const clearBtn = document.getElementById('psSearchClear');
        const countSpan = document.getElementById('psSearchCount');

        if (!searchInput || !countSpan) {
            console.warn('⏳ Buscador PowerShell no encontrado, reintentando...');
            if (!window._psRetry) window._psRetry = 0;
            if (window._psRetry < 15) {
                window._psRetry++;
                setTimeout(initSearch, 300);
            } else {
                console.error('❌ Buscador PowerShell no encontrado después de 15 intentos');
            }
            return;
        }

        window._psRetry = 0;

        const cards = document.querySelectorAll('.ps-command');
        const categories = document.querySelectorAll('.ps-category');

        function filterCommands(query) {
            const q = query.toLowerCase().trim();
            let visibleCount = 0;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isVisible = !q || text.includes(q);
                card.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;
            });

            categories.forEach(cat => {
                const catCards = cat.querySelectorAll('.ps-command');
                let hasVisible = false;
                catCards.forEach(c => {
                    if (c.style.display !== 'none') hasVisible = true;
                });
                cat.style.display = hasVisible ? '' : 'none';
            });

            countSpan.textContent = visibleCount;
            if (clearBtn) clearBtn.hidden = !q;

            let emptyMsg = document.getElementById('psEmptyMessage');
            if (visibleCount === 0 && q) {
                if (!emptyMsg) {
                    emptyMsg = document.createElement('div');
                    emptyMsg.id = 'psEmptyMessage';
                    emptyMsg.className = 'ps-empty-message';
                    emptyMsg.innerHTML = `
                        <p>🔍 No se encontraron cmdlets que coincidan con "<strong>${q}</strong>"</p>
                        <p style="font-size:0.9rem;color:var(--text-secondary);">Prueba con otra palabra o revisa la ortografía.</p>
                    `;
                    const grid = document.querySelector('.ps-grid');
                    if (grid) grid.parentNode.insertBefore(emptyMsg, grid.nextSibling);
                } else {
                    emptyMsg.innerHTML = `
                        <p>🔍 No se encontraron cmdlets que coincidan con "<strong>${q}</strong>"</p>
                        <p style="font-size:0.9rem;color:var(--text-secondary);">Prueba con otra palabra o revisa la ortografía.</p>
                    `;
                    emptyMsg.style.display = 'block';
                }
            } else {
                if (emptyMsg) emptyMsg.style.display = 'none';
            }
        }

        let timeout = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                filterCommands(this.value);
            }, 200);
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                filterCommands('');
                searchInput.focus();
            });
        }

        filterCommands('');
        console.log('🔍 Buscador PowerShell inicializado correctamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }

    document.addEventListener('secciones-cargadas', function() {
        if (document.getElementById('psSearch')) {
            console.log('ℹ️ Buscador PowerShell ya existe, no se reinicia');
            return;
        }
        initSearch();
    });
})();
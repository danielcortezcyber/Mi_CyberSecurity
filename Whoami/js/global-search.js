// js/global-search.js
(function() {
    "use strict";

    let initialized = false;

    function createSearchBar() {
        if (document.getElementById('globalSearchInput')) {
            console.log('ℹ️ Buscador global ya existe, no se duplica');
            return;
        }

        const container = document.getElementById('globalSearchContainer');
        if (!container) {
            console.warn('⏳ #globalSearchContainer no encontrado, reintentando...');
            setTimeout(createSearchBar, 200);
            return;
        }

        // Crear wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'global-search-wrapper';
        wrapper.innerHTML = `
            <input type="text" id="globalSearchInput" placeholder="🔍 Buscar..." class="global-search-input" />
            <div id="globalSearchResults" class="global-search-results" hidden></div>
        `;
        container.appendChild(wrapper);

        // Estilos inline (ya incluidos en navbar.css, pero los mantenemos por si acaso)
        const style = document.createElement('style');
        style.textContent = `
            .global-search-wrapper {
                position: relative;
                min-width: 140px;
                max-width: 200px;
            }
            .global-search-input {
                width: 100%;
                padding: 0.3rem 0.8rem;
                border-radius: 30px;
                border: 1px solid var(--border-color);
                background: var(--bg-secondary);
                color: var(--text-primary);
                font-size: 0.8rem;
                outline: none;
                transition: border-color 0.3s;
            }
            .global-search-input:focus {
                border-color: var(--accent);
            }
            .global-search-results {
                position: absolute;
                top: 110%;
                left: 0;
                right: 0;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                box-shadow: 0 10px 30px var(--shadow-color);
                max-height: 300px;
                overflow-y: auto;
                z-index: 999;
                padding: 0.3rem 0;
            }
            .global-search-results .result-item {
                padding: 0.4rem 0.8rem;
                cursor: pointer;
                border-bottom: 1px solid var(--border-color);
                font-size: 0.85rem;
            }
            .global-search-results .result-item:last-child {
                border-bottom: none;
            }
            .global-search-results .result-item:hover {
                background: var(--bg-secondary);
            }
            .global-search-results .result-title {
                font-weight: 600;
            }
            .global-search-results .result-desc {
                font-size: 0.75rem;
                color: var(--text-secondary);
            }
            .global-search-results .result-tag {
                font-size: 0.65rem;
                background: var(--accent);
                color: #fff;
                padding: 0.05rem 0.5rem;
                border-radius: 20px;
                margin-left: 0.4rem;
            }
            .global-search-results .empty-result {
                padding: 0.8rem;
                text-align: center;
                color: var(--text-secondary);
            }
            @media (max-width: 768px) {
                .global-search-wrapper {
                    min-width: 100px;
                    max-width: 140px;
                }
                .global-search-input {
                    font-size: 0.7rem;
                    padding: 0.2rem 0.6rem;
                }
            }
            @media (max-width: 480px) {
                .global-search-wrapper {
                    min-width: 80px;
                    max-width: 100px;
                }
            }
        `;
        document.head.appendChild(style);

        // Eventos
        const input = document.getElementById('globalSearchInput');
        const results = document.getElementById('globalSearchResults');

        input.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (query.length < 2) {
                results.hidden = true;
                return;
            }
            const items = searchContent(query);
            renderResults(items, query);
            results.hidden = false;
        });

        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                results.hidden = true;
            }
        });

        console.log('🔎 Búsqueda global inicializada (única instancia)');
    }

    function getContentIndex() {
        const index = [];
        document.querySelectorAll('section[id]').forEach(section => {
            const id = section.id;
            const title = section.querySelector('h2, h3')?.textContent || section.id;
            const text = section.textContent.slice(0, 200);
            const link = '#' + id;
            index.push({ id, title, description: text, link, type: 'Sección' });
            if (id === 'tutoriales' || id === 'ruta-aprendizaje') {
                section.querySelectorAll('.card, .ruta-leccion, .cmd-card, .ps-command').forEach(el => {
                    const itemTitle = el.querySelector('h3, h4, .cmd-name, .leccion-info h4')?.textContent || '';
                    const itemDesc = el.querySelector('p, .card__desc, .leccion-info p')?.textContent || '';
                    const itemLink = el.dataset?.modal ? '#' : '#' + id;
                    if (itemTitle) {
                        index.push({
                            id: id + '-' + Math.random().toString(36).substr(2, 4),
                            title: itemTitle.trim(),
                            description: itemDesc.trim().slice(0, 100),
                            link: itemLink,
                            type: 'Contenido'
                        });
                    }
                });
            }
        });
        return index;
    }

    function searchContent(query) {
        const index = getContentIndex();
        return index.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        ).slice(0, 10);
    }

    function renderResults(items, query) {
        const results = document.getElementById('globalSearchResults');
        if (!results) return;
        if (items.length === 0) {
            results.innerHTML = `<div class="empty-result">No se encontraron resultados para "<strong>${query}</strong>"</div>`;
            return;
        }
        let html = '';
        items.forEach(item => {
            const title = highlightText(item.title, query);
            const desc = highlightText(item.description, query);
            html += `
                <div class="result-item" onclick="window.location.href='${item.link}'">
                    <div class="result-title">${title} <span class="result-tag">${item.type}</span></div>
                    <div class="result-desc">${desc || '...'}</div>
                </div>
            `;
        });
        results.innerHTML = html;
    }

    function highlightText(text, query) {
        if (!text) return '';
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong style="color:var(--accent);">$1</strong>');
    }

    // Inicializar solo una vez
    function init() {
        if (initialized) return;
        createSearchBar();
        initialized = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('secciones-cargadas', function() {
        if (!initialized) {
            init();
        }
    });
})();
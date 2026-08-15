// js/soporte.js
(function() {
    "use strict";

    // ================================================================
    // 1. ASISTENTE DE DIAGNÓSTICO
    // ================================================================
    function initDiagnostico() {
        const container = document.getElementById('diagnosticoContainer');
        if (!container) return;

        const steps = container.querySelectorAll('.diagnostico-step');

        // Función para ir a un paso específico
        function goToStep(stepId) {
            steps.forEach(s => s.classList.remove('active'));
            const target = container.querySelector(`.diagnostico-step[data-step="${stepId}"]`);
            if (target) target.classList.add('active');
        }

        // Clic en botones de diagnóstico (data-next)
        container.querySelectorAll('.diagnostico-btn[data-next]').forEach(btn => {
            btn.addEventListener('click', function() {
                const next = this.dataset.next;
                goToStep(next);
            });
        });

        // Clic en botones "Reiniciar"
        container.querySelectorAll('.diagnostico-restart').forEach(btn => {
            btn.addEventListener('click', function() {
                goToStep('0');
            });
        });

        // Iniciar en el paso 0
        goToStep('0');
    }

    // ================================================================
    // 2. CHECKLIST DE MANTENIMIENTO (con localStorage)
    // ================================================================
    function initChecklist() {
        const checkboxes = document.querySelectorAll('.checklist-checkbox');
        const progressSpan = document.getElementById('checklistProgress');
        const fillBar = document.getElementById('checklistFill');
        const resetBtn = document.getElementById('resetChecklist');

        if (!checkboxes.length || !progressSpan) return;

        // Cargar estado guardado
        function loadState() {
            const saved = localStorage.getItem('soporte_checklist');
            if (saved) {
                const data = JSON.parse(saved);
                checkboxes.forEach((cb, index) => {
                    if (data[index] !== undefined) {
                        cb.checked = data[index];
                    }
                });
            }
            updateProgress();
        }

        // Guardar estado
        function saveState() {
            const data = [];
            checkboxes.forEach(cb => {
                data.push(cb.checked);
            });
            localStorage.setItem('soporte_checklist', JSON.stringify(data));
        }

        // Actualizar barra de progreso
        function updateProgress() {
            const total = checkboxes.length;
            let done = 0;
            checkboxes.forEach(cb => {
                if (cb.checked) done++;
            });
            const pct = total ? Math.round((done / total) * 100) : 0;
            progressSpan.textContent = pct + '%';
            if (fillBar) fillBar.style.width = pct + '%';
        }

        // Eventos
        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                saveState();
                updateProgress();
            });
        });

        // Resetear
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                checkboxes.forEach(cb => cb.checked = false);
                saveState();
                updateProgress();
            });
        }

        loadState();
    }

    // ================================================================
    // 3. INICIALIZAR
    // ================================================================
    function init() {
        console.log('🛠️ Módulo de Soporte Técnico inicializado');
        initDiagnostico();
        initChecklist();
    }

    // Esperar a que la sección esté cargada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // También al cargar secciones (por si el contenido se inyecta después)
    document.addEventListener('secciones-cargadas', function() {
        // Si no se inicializó antes, hacerlo ahora
        if (document.getElementById('diagnosticoContainer')) {
            init();
        }
    });

})();
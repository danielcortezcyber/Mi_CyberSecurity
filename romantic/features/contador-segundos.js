// ================================================================
// CONTADOR INTERACTIVO - Días, horas, minutos y segundos en vivo
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== CONFIGURACIÓN =====
    // CAMBIA ESTA FECHA: la fecha en que se conocieron
    // FORMATO: Año-Mes-Día (ej: 2025-01-15)
    const FECHA_CONOCIMIENTO = new Date('2026-08-09T11:50:00');

    // ===== LOG DE DEPURACIÓN =====
    console.log('📅 Fecha de conocimiento configurada:', FECHA_CONOCIMIENTO);
    console.log('📅 Fecha actual:', new Date());

    // ===== FUNCIÓN PARA FORMATEAR FECHA EN 12 HORAS =====
    function formatearFecha12h(fecha) {
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return fecha.toLocaleDateString('es-ES', opciones);
    }

    // ===== ACTUALIZAR CONTADOR DE TIEMPO TRANSCURRIDO =====
    function actualizarContador() {
        const ahora = new Date();
        const diff = ahora - FECHA_CONOCIMIENTO;

        // Si la fecha de conocimiento es futura, mostramos 0
        if (diff < 0) {
            const contadorElement = document.getElementById('diasJuntos');
            if (contadorElement) {
                contadorElement.textContent = '0 días, 0 horas, 0 minutos y 0 segundos';
                console.warn('⚠️ La fecha de conocimiento es futura. Ajusta la fecha.');
            }
            return;
        }

        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);

        // Formatear con ceros a la izquierda
        const horasStr = String(horas).padStart(2, '0');
        const minutosStr = String(minutos).padStart(2, '0');
        const segundosStr = String(segundos).padStart(2, '0');

        const contadorElement = document.getElementById('diasJuntos');
        if (contadorElement) {
            contadorElement.innerHTML = `
                <span class="contador-numero-grande">${dias}</span> días,
                <span class="contador-numero-grande">${horasStr}</span> horas,
                <span class="contador-numero-grande">${minutosStr}</span> minutos y
                <span class="contador-numero-grande">${segundosStr}</span> segundos
            `;
        } else {
            console.warn('⚠️ Elemento #diasJuntos no encontrado en el DOM.');
        }
    }

    // ===== MOSTRAR FECHA DE INICIO =====
    function mostrarFechaInicio() {
        const fechaElement = document.getElementById('fechaInicio');
        if (fechaElement) {
            fechaElement.textContent = formatearFecha12h(FECHA_CONOCIMIENTO);
        } else {
            console.warn('⚠️ Elemento #fechaInicio no encontrado.');
        }
    }

    // ===== INICIALIZAR =====
    mostrarFechaInicio();
    actualizarContador();
    setInterval(actualizarContador, 1000);

    console.log('⏱️ Contador interactivo activado.');
});
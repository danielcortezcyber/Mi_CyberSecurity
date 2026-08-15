// ================================================================
// SURPRISE MESSAGE - Mensaje sorpresa al cargar la página
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Crear el contenedor del mensaje
    const container = document.createElement('div');
    container.id = 'surpriseMessage';
    container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: var(--romantic-bg-card, rgba(255,255,255,0.95));
        backdrop-filter: blur(12px);
        border: 2px solid var(--romantic-accent, #d6336c);
        border-radius: 24px;
        padding: 2.5rem 3rem;
        box-shadow: 0 20px 60px rgba(214, 51, 108, 0.4);
        z-index: 99999;
        text-align: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.6s ease, transform 0.6s ease, visibility 0.6s ease;
        max-width: 90%;
        width: 400px;
    `;
    container.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">❤️</div>
        <h2 style="font-family: 'Playfair Display', serif; color: var(--romantic-accent, #d6336c); font-size: 1.8rem; margin: 0.2rem 0;">Esto es solo para ti</h2>
        <p style="color: var(--romantic-text-secondary, #555); font-size: 1.1rem; margin: 0.5rem 0 1.2rem;">
            Cada detalle de esta página está hecho pensando en ti.
        </p>
        <button id="closeSurprise" style="
            background: var(--romantic-accent, #d6336c);
            color: #fff;
            border: none;
            padding: 0.6rem 2rem;
            border-radius: 40px;
            font-size: 1rem;
            cursor: pointer;
            transition: 0.3s;
            font-weight: 600;
        ">Cerrar ❤️</button>
    `;
    document.body.appendChild(container);

    // Mostrar con retraso
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        container.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 1500);

    // Cerrar al hacer clic en el botón o en el fondo (fuera del contenedor)
    function closeMessage() {
        container.style.opacity = '0';
        container.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            container.style.visibility = 'hidden';
        }, 600);
    }

    document.getElementById('closeSurprise')?.addEventListener('click', closeMessage);

    // También cerrar al hacer clic fuera del contenedor (en el fondo oscuro no hay, pero podemos agregar un overlay)
    // Para evitar que se cierre al hacer clic en cualquier parte, mejor solo con el botón.
    // Si quieres que se cierre al hacer clic fuera, descomenta esto:
    /*
    container.addEventListener('click', function(e) {
        if (e.target === container) closeMessage();
    });
    */

    console.log('💖 Mensaje sorpresa activado.');
});
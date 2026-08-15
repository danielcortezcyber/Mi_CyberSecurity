// ================================================================
// FINAL FIRMA - Carta de amor con firma animada
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Buscar la sección final
    const finalSection = document.getElementById('romantic-final');
    if (!finalSection) return;

    // Añadir una carta virtual al final (después del texto existente)
    const finalText = finalSection.querySelector('.final-text');
    if (!finalText) return;

    // Crear la carta virtual
    const cartaContainer = document.createElement('div');
    cartaContainer.style.cssText = `
        margin-top: 3rem;
        max-width: 500px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(214,51,108,0.15);
        transition: 0.4s;
        cursor: pointer;
    `;
    cartaContainer.innerHTML = `
        <div style="text-align: center; font-size: 2.5rem; margin-bottom: 0.5rem;">💌</div>
        <h3 style="font-family: 'Playfair Display', serif; color: var(--romantic-accent); font-size: 1.4rem; margin: 0.2rem 0;">Una última carta</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; opacity: 0.7;">Toca para abrir</p>
        <div id="cartaFinalContenido" style="
            max-height: 0;
            overflow: hidden;
            transition: max-height 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease;
            opacity: 0;
        ">
            <div style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                <p style="font-family: 'Playfair Display', serif; font-size: 1.2rem; line-height: 1.8; color: var(--text-primary);">
                    Quería que las últimas palabras de esta página fueran solo para ti.
                    No hay código que pueda escribir lo que siento, pero al menos intenté
                    construir algo que te hiciera sonreír.
                </p>
                <p style="font-family: 'Playfair Display', serif; font-size: 1.1rem; line-height: 1.8; color: var(--text-secondary);">
                    Te elijo, siempre.
                </p>
                <div style="text-align: right; margin-top: 1rem;">
                    <span style="font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--romantic-accent); display: inline-block; animation: heartPulse 1.5s ease-in-out infinite;">
                        ❤️ Daniel
                    </span>
                </div>
            </div>
        </div>
    `;
    finalText.appendChild(cartaContainer);

    // Evento de apertura
    cartaContainer.addEventListener('click', function() {
        const contenido = document.getElementById('cartaFinalContenido');
        if (contenido) {
            const isOpen = contenido.style.maxHeight !== '0px';
            if (isOpen) {
                contenido.style.maxHeight = '0';
                contenido.style.opacity = '0';
            } else {
                contenido.style.maxHeight = '600px';
                contenido.style.opacity = '1';
            }
        }
    });

    // Añadir la animación de latido para la firma (si no existe, la creamos)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartPulse {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(1.2); }
            30% { transform: scale(1); }
            45% { transform: scale(1.1); }
            60% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    console.log('💌 Carta de amor con firma animada activada.');
});
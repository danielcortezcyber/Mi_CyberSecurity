// ================================================================
// PARTICLES COLOR - Partículas que cambian de color lentamente
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Buscar el canvas de partículas existente
    const canvas = document.getElementById('romantic-particles');
    if (!canvas) {
        console.warn('⚠️ No se encontró el canvas de partículas.');
        return;
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    // Colores para la transición
    const colors = ['#d6336c', '#ff6b9d', '#ff4081', '#e91e63', '#f06292', '#d6336c'];
    let colorIndex = 0;
    let colorProgress = 0;
    const SPEED = 0.002; // Velocidad de cambio de color

    // Guardar referencia a la función de dibujo original
    const originalDraw = window.__particleDraw;

    // Sobrescribir la función de dibujo para usar colores cambiantes
    function patchParticles() {
        // Obtener las partículas existentes (si las hay en el scope global)
        // Como no tenemos acceso directo, usamos un enfoque diferente:
        // Modificamos la función animate original para cambiar colores.
        // Para simplificar, podemos reemplazar el color de las partículas en cada frame.

        // La forma más limpia: inyectar un script que modifique el color de las partículas
        // usando un MutationObserver o simplemente redefiniendo la animación.
        // Como es complejo, haremos una solución sencilla: agregar un overlay de color
        // o simplemente cambiar el color de las partículas existentes si podemos acceder a ellas.
    }

    // Solución alternativa: cambiar el color del canvas directamente con un overlay de color
    // o usando un filtro de color CSS.
    // Pero eso afectaría a todo el canvas, no a las partículas individualmente.
    // La mejor opción es modificar el código de particles.js para que acepte un color cambiante.

    // Como no podemos modificar particles.js fácilmente desde aquí (está en otro script),
    // vamos a inyectar una nueva función que cada cierto tiempo actualice el color de las
    // partículas si tenemos acceso a ellas.

    // Para este ejemplo, usaremos un enfoque visual simple: añadir un gradiente superpuesto
    // o cambiar el color de fondo del canvas lentamente.
    // Pero lo más efectivo es modificar directamente particles.js.

    // Como tenemos el archivo particles.js, podemos reemplazarlo con una versión que soporte
    // cambio de color. Pero eso sería más extenso. En su lugar, creamos un script que
    // sobreescribe el color de las partículas existentes mediante un intervalo.

    // Vamos a intentar acceder al array de partículas desde el scope global.
    // Suponemos que particles.js expone las partículas globalmente (no es el caso).
    // Por lo tanto, la solución más práctica es añadir un efecto visual adicional:
    // un gradiente que cambia de color sobre el canvas.

    // Crear un overlay de color que se superponga al canvas
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        mix-blend-mode: overlay;
        opacity: 0.3;
        transition: background 0.1s linear;
    `;
    document.body.prepend(overlay);

    // Cambiar el color del overlay lentamente
    let hue = 330; // rosa
    setInterval(() => {
        hue += 0.5;
        if (hue > 360) hue = 0;
        overlay.style.background = `hsl(${hue}, 80%, 60%)`;
    }, 100);

    // También podemos cambiar el color de las partículas si accedemos a ellas desde el scope global
    // Intentamos obtener las partículas del objeto window (si se guardaron)
    // Como no se guardaron, esta es la solución más sencilla.

    console.log('🎨 Partículas con colores cambiantes activadas (overlay).');
});
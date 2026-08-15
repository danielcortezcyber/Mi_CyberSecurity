// ================================================================
// CARTA PERGAMINO - Despliegue realista con efecto de escritura
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Buscar el sobre
    const sobre = document.getElementById('cartaSobre');
    const abierta = document.getElementById('cartaAbierta');
    if (!sobre || !abierta) return;

    // Mejorar el estilo de la carta (pergamino)
    const papel = abierta.querySelector('.carta-papel');
    if (papel) {
        papel.style.background = 'linear-gradient(145deg, #fdf6e3, #f5e6d3)';
        papel.style.border = '2px solid #d4b896';
        papel.style.boxShadow = '0 8px 40px rgba(0,0,0,0.2)';
        papel.style.borderRadius = '4px 20px 20px 4px';
        papel.style.padding = '2.5rem 2rem';
        papel.style.maxHeight = '0';
        papel.style.overflow = 'hidden';
        papel.style.transition = 'max-height 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease';
        papel.style.opacity = '0';
    }

    // Modificar el evento de apertura
    sobre.addEventListener('click', function() {
        sobre.style.display = 'none';
        abierta.hidden = false;

        // Animación de despliegue
        if (papel) {
            requestAnimationFrame(() => {
                papel.style.maxHeight = '800px';
                papel.style.opacity = '1';
            });

            // ============================================================
            // IMPORTANTE: soltar el límite de altura una vez que termina
            // la animación de despliegue.
            //
            // Mientras el papel se despliega necesitamos "overflow: hidden"
            // y un "max-height" concreto (para poder animar de 0 a 800px).
            // Pero si dejamos esos estilos en línea para siempre, cualquier
            // contenido más alto que 800px (el texto completo + el botón
            // de sorpresa) queda cortado y oculto de forma permanente,
            // aunque la animación de texto siga "revelándolo" por dentro.
            //
            // Por eso, en cuanto termina la transición de max-height,
            // quitamos esos estilos en línea para que el CSS original de
            // .carta-papel (max-height: 500px + overflow-y: auto) tome el
            // control: así el contenido que sobra se puede scrollear en
            // vez de desaparecer.
            // ============================================================
            papel.addEventListener('transitionend', function liberarAltura(evento) {
                if (evento.propertyName !== 'max-height') return;

                papel.style.maxHeight = '';
                papel.style.overflow = '';

                papel.removeEventListener('transitionend', liberarAltura);
            });

            // ============================================================
            // Efecto de máquina de escribir REAL (letra por letra con JS),
            // no con el truco de CSS (steps() + white-space: nowrap).
            //
            // El truco de CSS solo funciona si el texto cabe en una sola
            // línea, porque anima el ANCHO de una caja. Con un párrafo
            // largo eso obliga a "nowrap" y en pantallas angostas (móvil)
            // el texto se corta para siempre, sin importar cuánto dure la
            // animación.
            //
            // Aquí, en cambio, vamos insertando los caracteres uno por uno
            // directamente en el texto real del elemento. Como no usamos
            // "nowrap", el navegador hace el salto de línea con total
            // normalidad — se ve igual de bien en laptop que en móvil, y
            // SIEMPRE termina de escribir el texto completo.
            // ============================================================
            const texto = papel.querySelector('.carta-texto-escrito');
            if (texto) {
                // Normalizamos espacios/saltos de línea del HTML (la
                // indentación del código deja espacios de sobra) para que
                // no se escriban esos espacios extra letra por letra.
                const textoCompleto = texto.textContent.replace(/\s+/g, ' ').trim();

                texto.textContent = '';
                texto.style.borderRight = '3px solid var(--romantic-accent)';
                texto.style.paddingRight = '2px';

                let indice = 0;
                const velocidadPorLetra = 22; // ms entre cada letra

                function escribirSiguienteLetra() {
                    if (indice < textoCompleto.length) {
                        texto.textContent += textoCompleto.charAt(indice);
                        indice++;
                        setTimeout(escribirSiguienteLetra, velocidadPorLetra);
                    } else {
                        // Terminó de escribir: quitamos el cursor.
                        texto.style.borderRight = 'none';
                    }
                }

                // Empieza después de que el papel termine de desplegarse.
                setTimeout(escribirSiguienteLetra, 1000);
            }
        }
    });

    console.log('📜 Carta con despliegue de pergamino activada.');
});
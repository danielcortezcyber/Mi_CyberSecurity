// ================================================================
// ALBUM.JS - Álbum interactivo de canciones con reproductor YouTube
// ================================================================

(function() {
    'use strict';

    let initialized = false;

    // ============================================================
    // ESTADO: ¿está sonando ahora mismo una canción del álbum?
    // ============================================================
    // Se actualiza de dos formas:
    //  1) De forma optimista al cargar un video (autoplay=1).
    //  2) De forma real, escuchando los mensajes que el propio
    //     reproductor de YouTube manda (postMessage), gracias a
    //     enablejsapi=1 en la URL del iframe. Así, si el usuario
    //     pausa el video haciendo clic DENTRO de YouTube (no con
    //     nuestro botón), también nos enteramos.
    // ============================================================
    let cancionEstaSonando = false;

    // ============================================================
    // EXTRAER EL ID DE VIDEO DESDE UNA URL DE YOUTUBE
    // ============================================================
    function extraerIdDeYoutube(urlOId) {
        if (!urlOId) return null;

        const valor = urlOId.trim();

        if (/^[a-zA-Z0-9_-]{11}$/.test(valor)) {
            return valor;
        }

        const patrones = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            /(?:music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
        ];

        for (const patron of patrones) {
            const match = valor.match(patron);
            if (match) return match[1];
        }

        return null;
    }

    function initAlbum() {
        if (initialized) return;

        const reproductor = document.getElementById('reproductorYouTube');
        const tituloActual = document.getElementById('cancionActual');
        const placeholder = document.getElementById('reproductorPlaceholder');
        const canciones = document.querySelectorAll('.cancion-album');

        if (!reproductor || !canciones.length) {
            console.log('⏳ Álbum: esperando que la sección de canciones se cargue...');
            return;
        }

        initialized = true;

        const placeholderIcon = placeholder?.querySelector('.reproductor-placeholder-icon');
        const placeholderText = placeholder?.querySelector('.reproductor-placeholder-text');

        // ============================================================
        // COMUNICACIÓN CON EL IFRAME DE YOUTUBE (API de postMessage)
        // ============================================================
        // No hace falta cargar el script oficial del iframe API: basta
        // con agregar "enablejsapi=1" a la URL y el propio reproductor
        // nos manda mensajes con su estado (reproduciendo / pausado).
        // ============================================================

        function mandarComandoAYoutube(func) {
            if (!reproductor.src) return;
            try {
                reproductor.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: func, args: [] }),
                    '*'
                );
            } catch (error) {
                console.warn('⚠️ No se pudo comunicar con el reproductor de YouTube:', error);
            }
        }

        window.addEventListener('message', function(evento) {
            if (typeof evento.data !== 'string') return;
            if (!evento.origin.includes('youtube.com')) return;

            let datos;
            try {
                datos = JSON.parse(evento.data);
            } catch (error) {
                return;
            }

            if (datos.event === 'infoDelivery' && datos.info && typeof datos.info.playerState === 'number') {
                // playerState: -1 sin iniciar, 0 terminó, 1 reproduciendo,
                // 2 pausado, 3 en buffer, 5 en cola.
                cancionEstaSonando = (datos.info.playerState === 1);
            }
        });

        // ============================================================
        // FUNCIÓN: Cargar canción (siempre a pedido del usuario)
        // ============================================================
        function cargarCancion(elemento) {
            canciones.forEach(c => c.classList.remove('active'));
            elemento.classList.add('active');

            const valorOriginal = elemento.dataset.video;
            const titulo = elemento.dataset.titulo || 'Canción sin nombre';
            const videoId = extraerIdDeYoutube(valorOriginal);

            if (!videoId) {
                tituloActual.textContent = '⚠️ Canción no configurada';
                reproductor.src = '';
                cancionEstaSonando = false;

                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
                if (placeholderIcon) {
                    placeholderIcon.textContent = '⚠️';
                }
                if (placeholderText) {
                    placeholderText.textContent = 'A esta canción todavía le falta la URL de YouTube.';
                }

                console.warn(`⚠️ No se pudo reconocer la URL de YouTube para "${titulo}": "${valorOriginal}"`);
                return;
            }

            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Turno de la canción del álbum: pausamos la música de fondo.
            // SIEMPRE la mandamos a pausar (sin preguntar antes si está
            // sonando): pausar algo que ya está pausado no hace nada,
            // pero así nos aseguramos de que nunca queden sonando las dos
            // a la vez, sin depender de que el estado guardado sea exacto.
            if (window.RomanticMusic) {
                window.RomanticMusic.pause();
                console.log('⏸️ Música de fondo pausada (se eligió una canción del álbum).');
            }

            const origin = encodeURIComponent(window.location.origin);
            reproductor.src =
                `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}`;
            tituloActual.textContent = titulo;

            // Optimista: recién pedimos autoplay=1, asumimos que arranca.
            // El listener de "message" de arriba corregirá esto si el
            // navegador bloquea el autoplay o si el usuario pausa luego.
            cancionEstaSonando = true;

            const reproductorContainer = document.querySelector('.reproductor-container');
            if (window.innerWidth <= 768 && reproductorContainer) {
                setTimeout(() => {
                    reproductorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }

            console.log(`🎵 Reproduciendo: ${titulo} (ID: ${videoId})`);
        }

        // ============================================================
        // FUNCIÓN: Pausar la canción del álbum (usada por music.js)
        // ============================================================
        // NO confiamos solo en el comando "pauseVideo" por postMessage,
        // porque depende de que YouTube haya terminado el handshake del
        // API y a veces eso falla en silencio. Para que esto sea 100%
        // confiable, directamente VACIAMOS el src del iframe: eso corta
        // el audio de inmediato, sin depender de nada externo.
        // ============================================================
        function pausarCancion() {
            if (!reproductor.src) {
                // Ya no hay nada cargado, no hay nada que pausar.
                return;
            }

            mandarComandoAYoutube('pauseVideo'); // intento "amable" primero
            reproductor.src = ''; // corte garantizado del audio

            cancionEstaSonando = false;

            canciones.forEach(c => c.classList.remove('active'));

            if (tituloActual) {
                tituloActual.textContent = 'Selecciona una canción';
            }

            if (placeholder) {
                placeholder.style.display = 'flex';
            }
            if (placeholderIcon) {
                placeholderIcon.textContent = '🎵';
            }
            if (placeholderText) {
                placeholderText.textContent = 'Elige una canción del catálogo para empezar a escuchar';
            }

            console.log('⏸️ Canción del álbum pausada (se activó la música de fondo).');
        }

        // ============================================================
        // EVENTOS: Click en cada canción del álbum
        // ============================================================
        canciones.forEach(cancion => {
            cancion.addEventListener('click', function(e) {
                cargarCancion(this);
            });

            cancion.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    cargarCancion(this);
                }
            });

            cancion.setAttribute('tabindex', '0');
            cancion.setAttribute('role', 'button');
            cancion.setAttribute('aria-label', `Reproducir ${cancion.dataset.titulo || 'canción'}`);
        });

        // ============================================================
        // EXPONER CONTROLES PARA OTROS SCRIPTS (music.js)
        // ============================================================
        window.RomanticAlbum = {
            pause: pausarCancion,
            isPlaying: () => cancionEstaSonando
        };

        // ============================================================
        // ¡SIN AUTOPLAY! No se carga ninguna canción sola.
        // ============================================================
        console.log('🎵 Álbum interactivo listo (esperando que el usuario elija una canción).');
    }

    // ============================================================
    // OBSERVADOR PARA ESPERAR LA SECCIÓN DE CANCIONES
    // ============================================================
    function waitForAlbum() {
        initAlbum();

        if (initialized) return;

        const observer = new MutationObserver(function(mutations) {
            const reproductor = document.getElementById('reproductorYouTube');
            const canciones = document.querySelectorAll('.cancion-album');

            if (reproductor && canciones.length > 0) {
                observer.disconnect();
                initAlbum();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.addEventListener('secciones-cargadas', function() {
            if (!initialized) {
                setTimeout(initAlbum, 300);
            }
        });

        console.log('⏳ Álbum: observando cambios en el DOM...');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForAlbum);
    } else {
        waitForAlbum();
    }
})();
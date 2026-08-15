// ================================================================
// MUSIC.JS - Reproductor de música de fondo
// Persistencia de estado + volumen + reproducción en segundo plano
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================================
    // EVITAR DUPLICAR EL REPRODUCTOR
    // ============================================================

    if (document.querySelector('.music-player')) {
        return;
    }

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    const AUDIO_SRC = 'romantic/assets/music/HIMNO_POSTRATE_.mp3';

    const STORAGE = {
        STATE: 'romantic_music',
        VOLUME: 'romantic_volume',
        TIME: 'romantic_music_time'
    };

    // ============================================================
    // CREAR REPRODUCTOR
    // ============================================================

    const musicPlayer = document.createElement('div');

    musicPlayer.className = 'music-player';

    musicPlayer.innerHTML = `
        <div class="music-player-content">

            <button
                id="musicToggle"
                class="music-btn"
                type="button"
                aria-pressed="false"
                aria-label="Activar música"
            >
                <span class="music-icon" aria-hidden="true">🔇</span>
                <span class="music-label">Música</span>
            </button>

            <div class="music-volume">

                <input
                    type="range"
                    id="musicVolume"
                    min="0"
                    max="100"
                    value="30"
                    aria-label="Volumen de la música"
                >

                <span
                    class="volume-icon"
                    aria-hidden="true"
                >🔉</span>

            </div>

        </div>
    `;

    document.body.appendChild(musicPlayer);

    // ============================================================
    // ELEMENTOS
    // ============================================================

    const toggleBtn = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('musicVolume');

    const icon = toggleBtn?.querySelector('.music-icon');
    const label = toggleBtn?.querySelector('.music-label');
    const volumeIcon =
        volumeSlider?.parentElement?.querySelector('.volume-icon');

    // ============================================================
    // AUDIO
    // ============================================================

    const audio = new Audio(AUDIO_SRC);

    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.3;

    let audioAvailable = true;
    let isPlaying = false;

    // ============================================================
    // LOCAL STORAGE SEGURO
    // ============================================================

    function getStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('No se pudo leer localStorage:', error);
            return null;
        }
    }

    function setStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('No se pudo guardar en localStorage:', error);
        }
    }

    // ============================================================
    // ACTUALIZAR INTERFAZ
    // ============================================================

    function updatePlayUI(playing) {
        isPlaying = playing;

        if (icon) {
            icon.textContent = playing ? '🔊' : '🔇';
        }

        if (label) {
            label.textContent = playing ? 'Silenciar' : 'Música';
        }

        if (toggleBtn) {
            toggleBtn.setAttribute(
                'aria-pressed',
                String(playing)
            );

            toggleBtn.setAttribute(
                'aria-label',
                playing
                    ? 'Silenciar música'
                    : 'Activar música'
            );
        }
    }

    // ============================================================
    // ACTUALIZAR ICONO DE VOLUMEN
    // ============================================================

    function updateVolumeIcon(value) {
        if (!volumeIcon) return;

        const volume = Number(value);

        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 50) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }

    // ============================================================
    // GUARDAR POSICIÓN
    // ============================================================

    function saveCurrentTime() {
        if (
            Number.isFinite(audio.currentTime) &&
            audio.currentTime >= 0
        ) {
            setStorage(
                STORAGE.TIME,
                String(audio.currentTime)
            );
        }
    }

    // ============================================================
    // REPRODUCIR
    // ============================================================
    //
    // Antes de sonar, SIEMPRE mandamos a pausar la canción del álbum
    // (romantic/canciones.html), sin preguntar antes si está sonando.
    // Pausar algo que ya está pausado no rompe nada, y así nos
    // aseguramos de que nunca suenen las dos cosas a la vez, sin
    // depender de que el estado "isPlaying" guardado sea exacto
    // (por ejemplo, si YouTube no avisó su estado a tiempo).
    // ============================================================

    function playAudio() {
        if (!audioAvailable) {
            return Promise.reject(
                new Error('Audio no disponible')
            );
        }

        if (window.RomanticAlbum) {
            window.RomanticAlbum.pause();
            console.log('⏸️ Video del álbum pausado (se activó la música de fondo).');
        }

        return audio.play()
            .then(() => {
                updatePlayUI(true);

                setStorage(
                    STORAGE.STATE,
                    'playing'
                );

                saveCurrentTime();

                console.log('🎵 Música reproduciéndose');
            })
            .catch((error) => {
                updatePlayUI(false);

                console.warn(
                    '⚠️ El navegador bloqueó la reproducción automática.',
                    error
                );

                throw error;
            });
    }

    // ============================================================
    // PAUSAR
    // ============================================================

    function pauseAudio() {
        audio.pause();

        updatePlayUI(false);

        setStorage(
            STORAGE.STATE,
            'paused'
        );

        saveCurrentTime();

        console.log('⏸️ Música pausada');
    }

    // ============================================================
    // ERROR DE AUDIO
    // ============================================================

    audio.addEventListener('error', function () {
        audioAvailable = false;

        updatePlayUI(false);

        if (toggleBtn) {
            toggleBtn.disabled = true;
            toggleBtn.title = 'No se pudo cargar la música';
        }

        console.error(
            '❌ No se pudo cargar:',
            AUDIO_SRC
        );
    });

    // ============================================================
    // AUDIO CARGADO
    // ============================================================

    audio.addEventListener(
        'loadedmetadata',
        function () {

            const savedTime =
                getStorage(STORAGE.TIME);

            if (savedTime !== null) {

                const time =
                    Number(savedTime);

                if (
                    Number.isFinite(time) &&
                    time >= 0 &&
                    time < audio.duration
                ) {
                    audio.currentTime = time;
                }
            }
        }
    );

    // ============================================================
    // EVENTO PLAY
    // ============================================================

    audio.addEventListener('play', function () {
        updatePlayUI(true);

        setStorage(
            STORAGE.STATE,
            'playing'
        );
    });

    // ============================================================
    // EVENTO PAUSE
    // ============================================================

    audio.addEventListener('pause', function () {

        if (!audio.ended) {
            updatePlayUI(false);
        }
    });

    // ============================================================
    // GUARDAR POSICIÓN
    // ============================================================

    audio.addEventListener(
        'timeupdate',
        function () {

            if (
                Math.floor(audio.currentTime) % 5 === 0
            ) {
                saveCurrentTime();
            }
        }
    );

    // ============================================================
    // RECUPERAR VOLUMEN
    // ============================================================

    const savedVolume =
        getStorage(STORAGE.VOLUME);

    if (savedVolume !== null) {

        const volume = Math.min(
            100,
            Math.max(
                0,
                Number(savedVolume)
            )
        );

        audio.volume = volume / 100;

        if (volumeSlider) {
            volumeSlider.value = volume;
        }

        updateVolumeIcon(volume);

    } else {

        audio.volume = 0.3;

        if (volumeSlider) {
            volumeSlider.value = 30;
        }

        updateVolumeIcon(30);
    }

    // ============================================================
    // BOTÓN DE MÚSICA
    // ============================================================

    toggleBtn?.addEventListener(
        'click',
        function () {

            if (!audioAvailable) {
                return;
            }

            if (audio.paused) {
                playAudio().catch(() => {});
            } else {
                pauseAudio();
            }
        }
    );

    // ============================================================
    // CONTROL DE VOLUMEN
    // ============================================================

    volumeSlider?.addEventListener(
        'input',
        function () {

            const volume =
                Number(this.value);

            audio.volume =
                volume / 100;

            updateVolumeIcon(volume);

            setStorage(
                STORAGE.VOLUME,
                String(volume)
            );
        }
    );

    // ============================================================
    // CAMBIO DE PESTAÑA
    // ============================================================
    //
    // IMPORTANTE:
    //
    // NO pausamos el audio cuando:
    //
    // - Cambias de pestaña.
    // - Usas ALT + TAB.
    // - Minimizas Chrome.
    // - Abres otra ventana.
    //
    // El audio continuará reproduciéndose.
    //
    // ============================================================

    document.addEventListener(
        'visibilitychange',
        function () {

            if (document.hidden) {

                console.log(
                    '👀 Pestaña en segundo plano. La música continúa.'
                );

                // NO HACER:
                // audio.pause();

            } else {

                console.log(
                    '👀 Pestaña activa nuevamente.'
                );

                // Si el navegador pausó el audio
                // por alguna razón, intentamos recuperarlo
                // (solo si no hay un video del álbum sonando).

                if (
                    getStorage(STORAGE.STATE) === 'playing' &&
                    audio.paused &&
                    !(window.RomanticAlbum && window.RomanticAlbum.isPlaying())
                ) {

                    audio.play()
                        .then(() => {
                            updatePlayUI(true);
                        })
                        .catch(() => {});
                }
            }
        }
    );

    // ============================================================
    // ANTES DE CERRAR / RECARGAR
    // ============================================================
    //
    // NO pausamos el audio manualmente.
    //
    // Solo guardamos su estado.
    //
    // ============================================================

    window.addEventListener(
        'beforeunload',
        function () {

            saveCurrentTime();

            if (!audio.paused) {

                setStorage(
                    STORAGE.STATE,
                    'playing'
                );

            } else {

                setStorage(
                    STORAGE.STATE,
                    'paused'
                );
            }
        }
    );

    // ============================================================
    // EXPONER CONTROLES PARA OTROS SCRIPTS (p. ej. album.js)
    // ============================================================
    //
    // Así, cuando el usuario elige una canción del álbum en la
    // sección "Nuestras canciones", ese script puede pausar esta
    // música de fondo sin que se toquen entre sí.
    // ============================================================

    window.RomanticMusic = {
        pause: pauseAudio,
        play: () => playAudio().catch(() => {}),
        isPlaying: () => isPlaying
    };

    // ============================================================
    // INICIAR MÚSICA POR DEFECTO
    // ============================================================
    //
    // Queremos que suene sola desde que se abre la página.
    //
    // El único caso en que NO lo intentamos es si el propio usuario
    // la pausó manualmente en una visita anterior (respetamos esa
    // decisión). En cualquier otro caso (primera visita, o la última
    // vez que sonaba) intentamos reproducirla de inmediato.
    //
    // Los navegadores (Chrome, Firefox, Safari, etc.) bloquean el
    // autoplay CON SONIDO si el usuario todavía no interactuó con la
    // página — esto es una política del navegador, no algo que se
    // pueda evitar desde el código. Por eso, si el intento inicial
    // falla, dejamos un "oyente" que arranca la música automáticamente
    // en cuanto el usuario haga cualquier clic, toque o tecla en la
    // página (sin que tenga que usar el botón "Música" a propósito).
    // ============================================================

    const savedState = getStorage(STORAGE.STATE);

    if (savedState === 'paused') {

        // El usuario la silenció la última vez: respetamos su elección.
        updatePlayUI(false);

    } else {

        playAudio().catch(() => {

            console.log(
                '🎵 El navegador bloqueó el autoplay. Se iniciará automáticamente con la primera interacción del usuario.'
            );

            const iniciarConPrimeraInteraccion = () => {
                playAudio().catch(() => {});
            };

            ['click', 'touchstart', 'keydown'].forEach(function (evento) {
                document.addEventListener(
                    evento,
                    iniciarConPrimeraInteraccion,
                    { once: true }
                );
            });
        });
    }

    // ============================================================
    // ESTILOS
    // ============================================================

    const style = document.createElement('style');

    style.textContent = `

        .music-player {
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 9999;

            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);

            border: 1px solid var(--glass-border);
            border-radius: 20px;

            padding: 0.8rem 1.2rem;

            box-shadow:
                0 8px 32px var(--romantic-shadow);

            display: flex;
            align-items: center;

            gap: 0.8rem;

            transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
        }

        .music-player:hover {
            transform: translateY(-2px);

            box-shadow:
                0 12px 40px var(--romantic-shadow);
        }

        .music-player-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }

        .music-btn {
            background: var(--romantic-accent);

            border: none;
            color: #fff;

            padding: 0.3rem 0.8rem;

            border-radius: 30px;

            font-size: 0.85rem;

            cursor: pointer;

            display: flex;
            align-items: center;

            gap: 0.3rem;

            transition:
                transform 0.3s ease,
                background 0.3s ease;
        }

        .music-btn:hover {
            transform: scale(1.05);

            background:
                var(
                    --romantic-accent-hover,
                    #b81f5e
                );
        }

        .music-btn:active {
            transform: scale(0.96);
        }

        .music-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .music-volume {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }

        .music-volume input[type="range"] {
            width: 60px;
            height: 4px;

            background:
                var(--border-color);

            border-radius: 4px;

            -webkit-appearance: none;
            appearance: none;

            cursor: pointer;
        }

        .music-volume
        input[type="range"]::-webkit-slider-thumb {

            -webkit-appearance: none;
            appearance: none;

            width: 12px;
            height: 12px;

            border-radius: 50%;

            background:
                var(--romantic-accent);

            cursor: pointer;
        }

        .music-volume
        input[type="range"]::-moz-range-thumb {

            width: 12px;
            height: 12px;

            border-radius: 50%;

            border: none;

            background:
                var(--romantic-accent);

            cursor: pointer;
        }

        .volume-icon {
            font-size: 0.9rem;
            user-select: none;
        }

        .music-icon {
            display: inline-block;
        }

        .music-btn[aria-pressed="true"]
        .music-icon {

            animation:
                musicPulse 1.5s
                ease-in-out infinite;
        }

        @keyframes musicPulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.15);
            }
        }

        @media (max-width: 768px) {

            .music-player {
                bottom: 80px;
                right: 10px;

                padding:
                    0.5rem 0.8rem;
            }

            .music-volume
            input[type="range"] {
                width: 40px;
            }

            .music-btn {
                font-size: 0.75rem;

                padding:
                    0.2rem 0.6rem;
            }
        }
    `;

    document.head.appendChild(style);

    // ============================================================
    // MENSAJE DE CONSOLA
    // ============================================================

    console.log(
        '🎵 Reproductor de música cargado correctamente.'
    );

    console.log(
        '🔄 Persistencia: ACTIVADA.'
    );

    console.log(
        '👀 Reproducción en segundo plano: ACTIVADA.'
    );
});
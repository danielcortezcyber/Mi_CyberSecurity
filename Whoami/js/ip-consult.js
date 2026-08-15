// js/ip-consult.js
(function() {
    "use strict";

    const STORAGE_KEY = 'vt_api_key';

    // ---- Función para encontrar elementos con reintentos ----
    function getElement(id, maxAttempts = 10) {
        let attempts = 0;
        return new Promise((resolve) => {
            const check = () => {
                const el = document.getElementById(id);
                if (el) {
                    resolve(el);
                    return;
                }
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(check, 200);
                } else {
                    console.warn(`⚠️ No se encontró el elemento #${id} después de ${maxAttempts} intentos`);
                    resolve(null);
                }
            };
            check();
        });
    }

    // ---- Inicializar cuando el DOM esté listo ----
    async function init() {
        console.log('🕵️ Inicializando IP Consult...');

        // Obtener elementos
        const input = await getElement('ipInput');
        const btn = await getElement('ipCheckBtn');
        const result = await getElement('ipResult');
        const resultContent = await getElement('ipResultContent');
        const resultIcon = await getElement('ipResultIcon');
        const resultTitle = await getElement('ipResultTitle');

        const keyModal = await getElement('ipKeyModal');
        const keyInput = await getElement('ipApiKeyInput');
        const saveBtn = await getElement('ipSaveKeyBtn');
        const cancelBtn = await getElement('ipCancelKeyBtn');
        const closeBtn = await getElement('ipKeyModalClose');
        const configLink = await getElement('ipConfigKey');
        const keyStatus = await getElement('ipKeyStatus');

        // Verificar que los elementos críticos existen
        if (!input || !btn) {
            console.error('❌ Elementos críticos no encontrados (ipInput o ipCheckBtn)');
            return;
        }

        // ---- Función para cerrar el modal ----
        function closeModalFn() {
            console.log('🔄 Cerrando modal...');
            if (keyModal) {
                keyModal.hidden = true;
                keyModal.style.display = 'none';
                document.body.style.overflow = '';
            }
            if (keyStatus) {
                keyStatus.textContent = '';
            }
            console.log('✅ Modal cerrado.');
        }

        // ---- Función para abrir el modal ----
        function openModal() {
            console.log('🔓 Abriendo modal...');
            if (!keyModal) {
                console.warn('⚠️ keyModal no existe');
                return;
            }
            keyModal.hidden = false;
            keyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (keyInput) {
                keyInput.value = localStorage.getItem(STORAGE_KEY) || '';
                keyInput.focus();
            }
            if (keyStatus) {
                keyStatus.textContent = '';
            }
            console.log('✅ Modal abierto.');
        }

        // ---- Obtener API Key ----
        function getApiKey() {
            return localStorage.getItem(STORAGE_KEY) || '';
        }

        // ---- CERRAR MODAL: X ----
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeModalFn();
            });
            console.log('✅ X asignada');
        } else {
            console.warn('⚠️ X no encontrada');
        }

        // ---- CERRAR MODAL: Cancelar ----
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeModalFn();
            });
            console.log('✅ Cancelar asignado');
        } else {
            console.warn('⚠️ Cancelar no encontrado');
        }

        // ---- CERRAR MODAL: fondo oscuro ----
        if (keyModal) {
            keyModal.addEventListener('click', function(e) {
                if (e.target === keyModal) {
                    closeModalFn();
                }
            });
            console.log('✅ Fondo oscuro asignado');
        }

        // ---- CERRAR MODAL: ESC ----
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && keyModal && !keyModal.hidden) {
                closeModalFn();
            }
        });

        // ---- ABRIR MODAL: Configurar API Key ----
        if (configLink) {
            configLink.addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });
            console.log('✅ Configurar API Key asignado');
        } else {
            console.warn('⚠️ Configurar API Key no encontrado');
        }

        // ---- Guardar API Key ----
        if (saveBtn && keyInput) {
            saveBtn.addEventListener('click', function() {
                const key = keyInput.value.trim();
                if (key.length > 10) {
                    localStorage.setItem(STORAGE_KEY, key);
                    if (keyStatus) {
                        keyStatus.textContent = '✅ API Key guardada correctamente.';
                        keyStatus.style.color = 'green';
                    }
                    setTimeout(closeModalFn, 1200);
                } else {
                    if (keyStatus) {
                        keyStatus.textContent = '❌ La API key debe tener al menos 10 caracteres.';
                        keyStatus.style.color = 'red';
                    }
                }
            });
            console.log('✅ Guardar asignado');
        } else {
            console.warn('⚠️ Guardar no encontrado');
        }

        // ---- Consultar IP ----
        if (btn && input) {
            async function consultarIP() {
                const ip = input.value.trim();
                if (!ip) {
                    alert('Por favor, ingresa una dirección IP.');
                    return;
                }
                if (!isValidIP(ip)) {
                    alert('Formato de IP inválido. Ejemplo: 8.8.8.8');
                    return;
                }

                const apiKey = getApiKey();
                if (!apiKey) {
                    if (result) {
                        result.hidden = false;
                        if (resultIcon) resultIcon.textContent = '🔑';
                        if (resultTitle) resultTitle.textContent = 'API Key requerida';
                        result.className = 'ip-result info';
                        if (resultContent) {
                            resultContent.innerHTML = `
                                <p style="color:var(--text-secondary);">
                                    Para consultar la reputación de IPs necesitas una <strong>API Key de VirusTotal</strong>.
                                </p>
                                <p style="font-size:0.9rem;">
                                    Puedes obtener una <strong>gratuita</strong> en 
                                    <a href="https://www.virustotal.com/gui/join-us" target="_blank" style="color:var(--accent);">
                                        VirusTotal
                                    </a>
                                </p>
                                <button id="ipOpenConfigBtn" class="btn btn-primary" style="margin-top:0.5rem;">
                                    🔑 Configurar API Key ahora
                                </button>
                            `;
                            const configBtn = document.getElementById('ipOpenConfigBtn');
                            if (configBtn) {
                                configBtn.addEventListener('click', openModal);
                            }
                        }
                    }
                    return;
                }

                // Consulta con API Key
                if (result) {
                    result.hidden = false;
                    if (resultIcon) resultIcon.textContent = '⏳';
                    if (resultTitle) resultTitle.textContent = 'Consultando...';
                    result.className = 'ip-result loading';
                    if (resultContent) {
                        resultContent.innerHTML = '<p style="color:var(--text-secondary);">Esperando respuesta de VirusTotal...</p>';
                    }
                }

                const url = `https://www.virustotal.com/api/v3/ip_addresses/${ip}`;
                try {
                    const response = await fetch(url, {
                        headers: { 'x-apikey': apiKey }
                    });
                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('API Key inválida o caducada.');
                        }
                        throw new Error('Error en la API: ' + response.status);
                    }
                    const data = await response.json();
                    mostrarResultado(data, ip, result, resultIcon, resultTitle, resultContent);
                } catch (error) {
                    if (result) {
                        result.className = 'ip-result error';
                        if (resultIcon) resultIcon.textContent = '❌';
                        if (resultTitle) resultTitle.textContent = 'Error';
                        if (resultContent) {
                            resultContent.innerHTML = `
                                <p style="color:var(--error-color);">${error.message}</p>
                                <p style="font-size:0.9rem;color:var(--text-secondary);">
                                    Verifica tu conexión o la API Key.
                                    <a href="#" id="retryConfigLink" style="color:var(--accent);">Configurar API Key</a>
                                </p>
                            `;
                            const retryLink = document.getElementById('retryConfigLink');
                            if (retryLink) {
                                retryLink.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    openModal();
                                });
                            }
                        }
                    }
                }
            }

            btn.addEventListener('click', consultarIP);
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') consultarIP();
            });
        }

        console.log('✅ IP Consult inicializado correctamente');
    }

    function mostrarResultado(data, ip, result, resultIcon, resultTitle, resultContent) {
        const stats = data.data.attributes.stats;
        const malicious = stats.malicious || 0;
        const suspicious = stats.suspicious || 0;
        const harmless = stats.harmless || 0;
        const undetected = stats.undetected || 0;

        const isMalicious = malicious > 0 || suspicious > 0;

        if (resultIcon) resultIcon.textContent = isMalicious ? '⚠️' : '✅';
        if (resultTitle) resultTitle.textContent = isMalicious ? 'IP sospechosa' : 'IP segura';
        if (result) result.className = 'ip-result ' + (isMalicious ? 'malicious' : 'safe');

        let html = `
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Análisis:</strong> ${malicious + suspicious + harmless + undetected} motores</p>
            <div class="ip-stats">
                <span class="ip-stat malicious">Malicioso: ${malicious}</span>
                <span class="ip-stat suspicious">Sospechoso: ${suspicious}</span>
                <span class="ip-stat harmless">Inocuo: ${harmless}</span>
                <span class="ip-stat undetected">No detectado: ${undetected}</span>
            </div>
            <p><strong>País:</strong> ${data.data.attributes.country || 'Desconocido'}</p>
            <p><strong>ISP:</strong> ${data.data.attributes.as_owner || 'Desconocido'}</p>
        `;

        if (data.data.attributes.last_analysis_results) {
            const last = data.data.attributes.last_analysis_results;
            const detections = Object.keys(last).filter(k => last[k].category === 'malicious' || last[k].category === 'suspicious');
            if (detections.length > 0) {
                html += `<p><strong>Detectado por:</strong> ${detections.slice(0, 5).join(', ')}${detections.length > 5 ? ' ...' : ''}</p>`;
            }
        }

        if (resultContent) resultContent.innerHTML = html;
    }

    function isValidIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        return parts.every(p => {
            const num = parseInt(p, 10);
            return !isNaN(num) && num >= 0 && num <= 255 && p === String(num);
        });
    }

    // ---- Iniciar cuando el DOM esté listo ----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // También escuchar el evento de secciones cargadas
    document.addEventListener('secciones-cargadas', function() {
        // Esperar un poco para asegurar que el DOM esté actualizado
        setTimeout(init, 300);
    });
})();
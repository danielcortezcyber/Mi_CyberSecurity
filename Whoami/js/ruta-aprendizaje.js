// js/ruta-aprendizaje.js (CON PROPIEDADES PARA MODAL)
(function() {
  "use strict";

  var LECCIONES_RUTA = [
    // ===============================
    // 🌱 NIVEL BÁSICO (12 lecciones)
    // ===============================
    { 
      id: "ruta-redes-fundamentos", 
      titulo: "Fundamentos de Redes", 
      categoria: "redes", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Introducción a los conceptos básicos: topologías, modelos OSI y TCP/IP, dispositivos de red (switch, router, firewall).",
      // AÑADIDO para modal:
      duration: "30 min",
      level: "Principiante",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.cisco.com/c/en/us/solutions/enterprise-networks/what-is-computer-networking.html"
    },
    { 
      id: "ruta-ip-subnetting", 
      titulo: "Direccionamiento IP y Subnetting", 
      categoria: "redes", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Clases de IP, máscaras de subred, cálculo de subredes y VLSM. Ejercicios prácticos con calculadora de subredes.",
      duration: "45 min",
      level: "Principiante",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.subnetting.net/"
    },
    { 
      id: "ruta-cisco-basico", 
      titulo: "Configuración básica de router Cisco", 
      categoria: "redes", 
      nivel: "basico", 
      tipo: "practica", 
      desc: "Primeros pasos en CLI de Cisco: acceso, modos de usuario, comandos básicos (show, configure) y configuración de interfaces.",
      duration: "60 min",
      level: "Principiante",
      catLabel: "🌐 Redes",
      art: "topo",
      download: "Cheatsheet Cisco Básico (PDF)",
      enlace: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/12-2_55_se/configuration/guide/scg_2960/swcli.html"
    },
    { 
      id: "ruta-cia", 
      titulo: "Principios de seguridad: Tríada CIA", 
      categoria: "ciberseguridad", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Confidencialidad, Integridad y Disponibilidad. Ejemplos de controles de seguridad para cada pilar. Introducción a la gestión de riesgos.",
      duration: "25 min",
      level: "Principiante",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://www.nist.gov/cyberframework"
    },
    { 
      id: "ruta-phishing", 
      titulo: "Phishing: Cómo identificarlo y prevenirlo", 
      categoria: "ciberseguridad", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Señales de alarma en correos y SMS. Urgencia artificial, remitentes falsificados, enlaces sospechosos. Cómo reportar y bloquear.",
      duration: "20 min",
      level: "Principiante",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://www.cisa.gov/phishing"
    },
    { 
      id: "ruta-contraseñas", 
      titulo: "Contraseñas seguras y autenticación", 
      categoria: "ciberseguridad", 
      nivel: "basico", 
      tipo: "practica", 
      desc: "Creación de contraseñas robustas (passphrases), uso de gestores de contraseñas, autenticación de dos factores (2FA) y buenas prácticas.",
      duration: "30 min",
      level: "Principiante",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      download: "Checklist de contraseñas seguras (PDF)",
      enlace: "https://www.nist.gov/itl/smallbusinesscyber/guidance-topics/password-guidance"
    },
    { 
      id: "ruta-windows-basico", 
      titulo: "Administración básica de Windows", 
      categoria: "windows", 
      nivel: "basico", 
      tipo: "practica", 
      desc: "Panel de control, administración de usuarios y grupos, permisos de archivos (NTFS), tareas programadas y monitorización básica (Task Manager).",
      duration: "40 min",
      level: "Principiante",
      catLabel: "💻 Windows",
      art: "board",
      enlace: "https://learn.microsoft.com/en-us/windows-server/administration/"
    },
    { 
      id: "ruta-windows-cmd", 
      titulo: "Comandos esenciales de Windows (CMD)", 
      categoria: "windows", 
      nivel: "basico", 
      tipo: "practica", 
      desc: "Comandos básicos: ipconfig, ping, tracert, netstat, tasklist, systeminfo. Uso para diagnóstico y administración.",
      duration: "35 min",
      level: "Principiante",
      catLabel: "💻 Windows",
      art: "board",
      download: "Cheatsheet de CMD (PDF)"
    },
    { 
      id: "ruta-linux-intro", 
      titulo: "Introducción a Linux y su estructura", 
      categoria: "linux", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Historia de Linux, distribución (Ubuntu, Kali), sistema de archivos (/, /etc, /var), permisos y usuarios.",
      duration: "30 min",
      level: "Principiante",
      catLabel: "🐧 Linux",
      art: "term",
      enlace: "https://www.linuxfoundation.org/"
    },
    { 
      id: "ruta-linux-comandos", 
      titulo: "Comandos esenciales de Linux", 
      categoria: "linux", 
      nivel: "basico", 
      tipo: "practica", 
      desc: "Comandos de navegación (cd, ls, pwd), gestión de archivos (cp, mv, rm, mkdir), búsqueda (grep, find), permisos (chmod, chown) y gestión de paquetes (apt, yum).",
      duration: "50 min",
      level: "Principiante",
      catLabel: "🐧 Linux",
      art: "term",
      download: "Hoja de comandos Linux esenciales (PDF)",
      enlace: "https://linuxcommand.org/"
    },
    { 
      id: "ruta-dns", 
      titulo: "DNS: Funcionamiento y seguridad", 
      categoria: "redes", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Cómo funciona el sistema de nombres de dominio. Tipos de registros (A, CNAME, MX). Ataques comunes (DNS spoofing) y protección (DNSSEC).",
      duration: "25 min",
      level: "Principiante",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.cloudflare.com/dns/"
    },
    { 
      id: "ruta-malware-intro", 
      titulo: "Introducción al Malware: Tipos y vectores", 
      categoria: "ciberseguridad", 
      nivel: "basico", 
      tipo: "teoria", 
      desc: "Definición de malware. Clasificación: virus, troyanos, gusanos, ransomware, spyware, rootkits. Vías de infección y cómo prevenirlas.",
      duration: "30 min",
      level: "Principiante",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://www.cisa.gov/malware"
    },
    // ===============================
    // 🌿 NIVEL INTERMEDIO (12 lecciones)
    // ===============================
    { 
      id: "ruta-vlan", 
      titulo: "VLANs y Trunking", 
      categoria: "redes", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Configuración de VLANs, enlaces trunk, VLAN nativa, y router-on-a-stick para enrutamiento entre VLANs. Topología descargable.",
      duration: "60 min",
      level: "Intermedio",
      catLabel: "🌐 Redes",
      art: "topo",
      download: "Topología VLAN (Packet Tracer) (PKT)",
      enlace: "https://www.cisco.com/c/en/us/tech/lan-switching/virtual-lans-vlans/index.html"
    },
    { 
      id: "ruta-ospf", 
      titulo: "OSPF: Enrutamiento dinámico", 
      categoria: "redes", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Protocolo OSPF de estado de enlace: áreas, elección de DR/BDR, configuración y verificación de vecinos. Laboratorio con Packet Tracer.",
      duration: "75 min",
      level: "Intermedio",
      catLabel: "🌐 Redes",
      art: "topo",
      download: "Configuración OSPF multiárea (PDF)",
      enlace: "https://www.cisco.com/c/en/us/support/ip/open-shortest-path-first-ospf/products-technical-reference-list.html"
    },
    { 
      id: "ruta-acl", 
      titulo: "Listas de Control de Acceso (ACL)", 
      categoria: "redes", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "ACLs estándar y extendidas en Cisco. Filtrado de tráfico por IP, protocolo y puerto. Aplicación a interfaces. Ejemplos prácticos.",
      duration: "60 min",
      level: "Intermedio",
      catLabel: "🌐 Redes",
      art: "topo",
      download: "Ejemplos de ACLs Cisco (PDF)",
      enlace: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/a1/sec-a1-cr-book/sec-cr-a1.html"
    },
    { 
      id: "ruta-nmap", 
      titulo: "Escaneo de red con Nmap", 
      categoria: "ciberseguridad", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Escaneo de puertos, detección de servicios, fingerprinting de SO y scripts NSE (Nmap Scripting Engine) para auditoría básica.",
      duration: "50 min",
      level: "Intermedio",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      download: "Cheatsheet de Nmap (PDF)",
      enlace: "https://nmap.org/docs.html"
    },
    { 
      id: "ruta-wireshark", 
      titulo: "Análisis de tráfico con Wireshark", 
      categoria: "ciberseguridad", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Captura y análisis de paquetes en tiempo real. Filtros de visualización. Detección de credenciales en texto plano, problemas de red y malware.",
      duration: "60 min",
      level: "Intermedio",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://www.wireshark.org/docs/"
    },
    { 
      id: "ruta-hardening-linux", 
      titulo: "Hardening de servidores Linux", 
      categoria: "linux", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Configuración segura de SSH (claves, desactivar root), firewall (iptables/nftables), fail2ban, actualizaciones automáticas y auditoría con Lynis.",
      duration: "70 min",
      level: "Intermedio",
      catLabel: "🐧 Linux",
      art: "term",
      download: "Script de hardening para Ubuntu (SH)",
      enlace: "https://www.cisecurity.org/benchmark/ubuntu_linux/"
    },
    { 
      id: "ruta-powershell", 
      titulo: "PowerShell para administración", 
      categoria: "windows", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Cmdlets esenciales (Get-Process, Get-Service, Get-EventLog), pipeline, gestión de usuarios y Active Directory con PowerShell.",
      duration: "55 min",
      level: "Intermedio",
      catLabel: "💻 Windows",
      art: "board",
      download: "Cmdlets esenciales de PowerShell (PDF)",
      enlace: "https://learn.microsoft.com/en-us/powershell/"
    },
    { 
      id: "ruta-servicios", 
      titulo: "Administración de servicios y sistemas en Windows", 
      categoria: "windows", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Gestión de servicios (sc, servicios.msc), monitorización de rendimiento (Performance Monitor), análisis de logs y resolución de problemas.",
      duration: "45 min",
      level: "Intermedio",
      catLabel: "💻 Windows",
      art: "board",
      enlace: "https://learn.microsoft.com/en-us/windows-server/administration/"
    },
    { 
      id: "ruta-web-vulns", 
      titulo: "Vulnerabilidades web básicas (OWASP Top 10)", 
      categoria: "ciberseguridad", 
      nivel: "intermedio", 
      tipo: "teoria", 
      desc: "Introducción a las 10 vulnerabilidades más críticas. Explicación de SQL Injection, XSS, CSRF y cómo prevenirlas.",
      duration: "40 min",
      level: "Intermedio",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      download: "Resumen OWASP Top 10 (PDF)",
      enlace: "https://owasp.org/Top10/"
    },
    { 
      id: "ruta-nat", 
      titulo: "NAT y Traducción de Direcciones", 
      categoria: "redes", 
      nivel: "intermedio", 
      tipo: "teoria", 
      desc: "Concepto de NAT (Network Address Translation), tipos (estático, dinámico, PAT). Configuración en routers Cisco. Aplicaciones en seguridad.",
      duration: "35 min",
      level: "Intermedio",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.cisco.com/c/en/us/tech/ip/network-address-translation-nat/index.html"
    },
    { 
      id: "ruta-bash-scripting", 
      titulo: "Scripting básico en Bash", 
      categoria: "linux", 
      nivel: "intermedio", 
      tipo: "practica", 
      desc: "Creación de scripts para automatizar tareas: variables, condicionales (if), bucles (for, while), funciones y manejo de archivos.",
      duration: "60 min",
      level: "Intermedio",
      catLabel: "🐧 Linux",
      art: "term",
      download: "Ejemplos de scripts Bash (SH)",
      enlace: "https://www.gnu.org/software/bash/manual/"
    },
    { 
      id: "ruta-soc-intro", 
      titulo: "Introducción a los Centros de Operaciones de Seguridad (SOC)", 
      categoria: "ciberseguridad", 
      nivel: "intermedio", 
      tipo: "teoria", 
      desc: "Funciones de un SOC, roles (analista, incident responder), herramientas SIEM, y proceso de gestión de alertas.",
      duration: "30 min",
      level: "Intermedio",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://www.sans.org/security-resources/"
    },
    // ===============================
    // 🌳 NIVEL AVANZADO (12 lecciones)
    // ===============================
    { 
      id: "ruta-sdn", 
      titulo: "SDN y Automatización de redes", 
      categoria: "redes", 
      nivel: "avanzado", 
      tipo: "teoria", 
      desc: "Software Defined Networking: conceptos, controladores (OpenDaylight, ONOS), OpenFlow y automatización con Python/Ansible.",
      duration: "45 min",
      level: "Avanzado",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.opennetworking.org/sdn-definition/"
    },
    { 
      id: "ruta-owasp-avanzado", 
      titulo: "OWASP Top 10: Análisis detallado y mitigación", 
      categoria: "ciberseguridad", 
      nivel: "avanzado", 
      tipo: "teoria", 
      desc: "Análisis en profundidad de cada una de las 10 categorías. Técnicas de explotación y prevención con ejemplos prácticos.",
      duration: "60 min",
      level: "Avanzado",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      download: "Guía de mitigación OWASP (PDF)",
      enlace: "https://owasp.org/Top10/"
    },
    { 
      id: "ruta-pentesting", 
      titulo: "Metodología de Pentesting (PTES/NIST)", 
      categoria: "ciberseguridad", 
      nivel: "avanzado", 
      tipo: "practica", 
      desc: "Fases de una prueba de penetración: reconocimiento, escaneo, explotación, post-explotación. Herramientas y buenas prácticas. Marco legal.",
      duration: "90 min",
      level: "Avanzado",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://www.pentest-standard.org/"
    },
    { 
      id: "ruta-active-directory", 
      titulo: "Active Directory: Estructura y seguridad", 
      categoria: "windows", 
      nivel: "avanzado", 
      tipo: "teoria", 
      desc: "Estructura de AD (dominios, árboles, OU). Configuración de GPO para seguridad y automatización. Ataques comunes a AD y su mitigación.",
      duration: "60 min",
      level: "Avanzado",
      catLabel: "💻 Windows",
      art: "board",
      enlace: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview"
    },
    { 
      id: "ruta-docker", 
      titulo: "Virtualización y contenedores (Docker)", 
      categoria: "linux", 
      nivel: "avanzado", 
      tipo: "practica", 
      desc: "Conceptos de contenedores, creación de Dockerfiles, gestión de imágenes, redes y volúmenes. Orquestación básica con docker-compose.",
      duration: "75 min",
      level: "Avanzado",
      catLabel: "🐧 Linux",
      art: "term",
      download: "Dockerfile ejemplo (SH)",
      enlace: "https://docs.docker.com/"
    },
    { 
      id: "ruta-ir-forense", 
      titulo: "Respuesta a incidentes y Forense Digital", 
      categoria: "ciberseguridad", 
      nivel: "avanzado", 
      tipo: "practica", 
      desc: "Ciclo de respuesta a incidentes (PICERL). Recolección y análisis de evidencias. Herramientas forenses (Autopsy, FTK, Volatility).",
      duration: "80 min",
      level: "Avanzado",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      download: "Plantilla de informe de incidentes (DOCX)",
      enlace: "https://www.sans.org/security-resources/posters/incident-response/"
    },
    { 
      id: "ruta-mpls", 
      titulo: "MPLS y redes de proveedores", 
      categoria: "redes", 
      nivel: "avanzado", 
      tipo: "teoria", 
      desc: "Conceptos de MPLS (Multi-Protocol Label Switching), etiquetas, LSP, VPN sobre MPLS. Aplicaciones en redes WAN.",
      duration: "45 min",
      level: "Avanzado",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.cisco.com/c/en/us/support/ios/mpls/products-technical-reference-list.html"
    },
    { 
      id: "ruta-red-team", 
      titulo: "Tácticas de Red Team y evasión de defensas", 
      categoria: "ciberseguridad", 
      nivel: "avanzado", 
      tipo: "practica", 
      desc: "Simulación de ataques avanzados: movimiento lateral, escalada de privilegios, evasión de EDR. Uso de C2 (Command & Control).",
      duration: "90 min",
      level: "Avanzado",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://attack.mitre.org/"
    },
    { 
      id: "ruta-windows-advanced", 
      titulo: "Administración avanzada de Windows Server", 
      categoria: "windows", 
      nivel: "avanzado", 
      tipo: "practica", 
      desc: "Roles avanzados (DNS, DHCP, ADCS, WSUS). PowerShell avanzado, automatización con DSC. Monitorización con SCOM.",
      duration: "70 min",
      level: "Avanzado",
      catLabel: "💻 Windows",
      art: "board",
      enlace: "https://learn.microsoft.com/en-us/windows-server/"
    },
    { 
      id: "ruta-linux-avanzado", 
      titulo: "Administración avanzada de Linux", 
      categoria: "linux", 
      nivel: "avanzado", 
      tipo: "practica", 
      desc: "Kernel tuning, gestión avanzada de procesos, LVM, RAID, automatización con Ansible, monitoreo con Nagios/Zabbix.",
      duration: "80 min",
      level: "Avanzado",
      catLabel: "🐧 Linux",
      art: "term",
      enlace: "https://www.linuxfoundation.org/"
    },
    { 
      id: "ruta-cloud-security", 
      titulo: "Seguridad en la nube: IAM y hardening", 
      categoria: "ciberseguridad", 
      nivel: "avanzado", 
      tipo: "teoria", 
      desc: "Modelo de responsabilidad compartida (AWS/Azure/GCP). Gestión de identidades y accesos (IAM), hardening de servicios, monitorización con CloudTrail.",
      duration: "60 min",
      level: "Avanzado",
      catLabel: "🔐 Ciberseguridad",
      art: "shield",
      enlace: "https://aws.amazon.com/security/"
    },
    { 
      id: "ruta-wireless", 
      titulo: "Seguridad en redes inalámbricas", 
      categoria: "redes", 
      nivel: "avanzado", 
      tipo: "teoria", 
      desc: "Protocolos WPA2/WPA3, ataques a redes Wi-Fi (deauthentication, PMKID), hardening de puntos de acceso y segmentación.",
      duration: "40 min",
      level: "Avanzado",
      catLabel: "🌐 Redes",
      art: "topo",
      enlace: "https://www.wi-fi.org/"
    }
  ];

  window.LECCIONES_RUTA = LECCIONES_RUTA;

  // ===== LÓGICA DE FILTROS Y RENDER =====
  var P = window.Persistencia;
  var $ = function(s, r) { return (r || document).querySelector(s); };
  var $$ = function(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s) { return String(s).replace(/[&<>"]/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var state = { search: "", categorias: { redes: true, ciberseguridad: true, windows: true, linux: true }, niveles: { basico: true, intermedio: true, avanzado: true } };

  function getFiltered() {
    return LECCIONES_RUTA.filter(function(l) {
      var matchSearch = l.titulo.toLowerCase().includes(state.search.toLowerCase()) || l.desc.toLowerCase().includes(state.search.toLowerCase());
      var matchCat = state.categorias[l.categoria] !== false;
      var matchNivel = state.niveles[l.nivel] !== false;
      return matchSearch && matchCat && matchNivel;
    });
  }

  function render() {
    var grid = $("#rutaGrid");
    var empty = $("#rutaEmpty");
    if (!grid) { console.warn('⚠️ #rutaGrid no encontrado'); return; }
    var list = getFiltered();
    if (list.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    var niveles = ['basico', 'intermedio', 'avanzado'];
    var labels = { basico: '🌱 Básico', intermedio: '🌿 Intermedio', avanzado: '🌳 Avanzado' };
    var html = '';
    niveles.forEach(function(nivel) {
      var items = list.filter(function(l) { return l.nivel === nivel; });
      if (items.length === 0) return;
      var total = LECCIONES_RUTA.filter(function(l) { return l.nivel === nivel; }).length;
      var done = 0;
      items.forEach(function(l) { if (P.isAcademyDone(l.id)) done++; });
      html += '<div class="ruta-nivel-group">' +
        '<div class="ruta-nivel-header"><h3>' + labels[nivel] + '</h3><span class="progress-mini">' + done + ' / ' + total + ' completadas</span></div>' +
        '<div class="ruta-lecciones">';
      items.forEach(function(l) {
        var isDone = P.isAcademyDone(l.id);
        var icon = l.categoria === 'redes' ? '🌐' : l.categoria === 'ciberseguridad' ? '🔐' : l.categoria === 'windows' ? '💻' : '🐧';
        var tipo = l.tipo === 'teoria' ? '📖 Teoría' : '⚙️ Práctica';
        html += '<div class="ruta-leccion" data-id="' + esc(l.id) + '" data-modal="' + esc(l.id) + '">' +
          '<span class="leccion-icon">' + icon + '</span>' +
          '<div class="leccion-info">' +
            '<h4>' + esc(l.titulo) + '</h4>' +
            '<div class="leccion-meta"><span>' + tipo + '</span><span>' + (l.nivel === 'basico' ? '🌱' : l.nivel === 'intermedio' ? '🌿' : '🌳') + ' ' + l.nivel.charAt(0).toUpperCase() + l.nivel.slice(1) + '</span></div>' +
            '<p style="font-size:0.9rem;color:#555;margin:0.2rem 0;">' + esc(l.desc) + '</p>' +
            (l.enlace ? '<a href="' + esc(l.enlace) + '" target="_blank" class="leccion-download" style="font-size:0.8rem;">🔗 Más información</a>' : '') +
          '</div>' +
          '<div class="leccion-actions">' +
            (l.download ? '<a href="#" class="leccion-download" title="' + esc(l.download) + '">⬇️</a>' : '') +
            '<span class="leccion-status' + (isDone ? ' completed' : '') + '" data-ruta-progress="' + esc(l.id) + '" role="button" aria-label="Marcar como completada">' + (isDone ? '✅' : '⬜') + '</span>' +
          '</div>' +
        '</div>';
      });
      html += '</div></div>';
    });
    grid.innerHTML = html;

    // Enlazar clic para abrir modal (usando delegación)
    grid.querySelectorAll('.ruta-leccion').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.closest('.leccion-actions')) return;
        var id = this.dataset.id;
        if (window.Modal && window.Modal.open) {
          window.Modal.open(id);
        }
      });
    });

    $$('[data-ruta-progress]', grid).forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = this.dataset.rutaProgress;
        var on = !P.isAcademyDone(id);
        P.setAcademyDone(id, on);
        this.textContent = on ? '✅' : '⬜';
        this.classList.toggle('completed', on);
        render();
        actualizarProgresoGlobal();
      });
    });
  }

  function actualizarProgresoGlobal() {
    var total = LECCIONES_RUTA.length;
    var done = 0;
    for (var i = 0; i < total; i++) if (P.isAcademyDone(LECCIONES_RUTA[i].id)) done++;
    var fill = $("#rutaProgressFill");
    var doneEl = $("#rutaProgressDone");
    var totalEl = $("#rutaProgressTotal");
    if (fill) fill.style.width = total ? Math.round((done / total) * 100) + "%" : "0%";
    if (doneEl) doneEl.textContent = done;
    if (totalEl) totalEl.textContent = total;
  }

  function initFilters() {
    var search = $("#rutaSearch");
    var clear = $("#rutaSearchClear");
    var to = null;
    if (search) {
      search.addEventListener('input', function() {
        if (clear) clear.hidden = !this.value;
        if (to) clearTimeout(to);
        to = setTimeout(function() {
          state.search = search.value.trim();
          render();
        }, 180);
      });
    }
    if (clear) {
      clear.addEventListener('click', function() {
        search.value = '';
        this.hidden = true;
        state.search = '';
        render();
        search.focus();
      });
    }

    $$('#ruta-aprendizaje .filter-group input[type="checkbox"]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        var val = this.value;
        var group = this.closest('.filter-group');
        var isCat = group.querySelector('span') && group.querySelector('span').textContent.includes('Categoría');
        if (isCat) state.categorias[val] = this.checked;
        else state.niveles[val] = this.checked;
        render();
      });
    });

    var reset = $("#rutaResetFilters");
    if (reset) {
      reset.addEventListener('click', function() {
        search.value = '';
        if (clear) clear.hidden = true;
        state.search = '';
        $$('#ruta-aprendizaje .filter-group input[type="checkbox"]').forEach(function(cb) { cb.checked = true; });
        state.categorias = { redes: true, ciberseguridad: true, windows: true, linux: true };
        state.niveles = { basico: true, intermedio: true, avanzado: true };
        render();
      });
    }
  }

  function init() {
    console.log('🗺️ Inicializando Ruta de Aprendizaje...');
    render();
    actualizarProgresoGlobal();
    initFilters();
  }

  document.addEventListener('secciones-cargadas', init);
})();
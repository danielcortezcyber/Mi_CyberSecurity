// js/casos.js (COMPLETO)
(function() {
  "use strict";

  var CASOS = [
    {
      id: "case-vlan",
      kicker: "Redes / Cisco · Caso #01",
      title: "Troubleshooting de VLAN que no se comunican",
      lede: "Dos departamentos (Ingeniería y Ventas) no pueden alcanzar su gateway. Sigue el diagnóstico desde la capa física hasta el enrutamiento entre VLAN.",
      art: "topo",
      steps: [
        { h: "1. Verificar membresía de VLAN en los puertos", p: "El síntoma clásico: un host no alcanza a otros en su misma subred. Confirma que el puerto de acceso pertenece a la VLAN correcta con show vlan brief." },
        { h: "2. Revisar los enlaces trunk", p: "Si los switches están encadenados, el trunk debe transportar ambas VLAN. Un trunk configurado solo para la VLAN nativa rompe la comunicación." },
        { h: "3. Confirmar el router-on-a-stick", p: "Las subinterfaces del router deben tener encapsulación dot1Q coincidente con el VLAN ID y una IP de gateway por subred." },
        { h: "4. Probar con ping aislado por VLAN", p: "Haz ping desde el host al gateway y luego al host remoto. Así separas problemas de capa 2 vs. capa 3." }
      ],
      code: [
        {
          head: "$ show running-config — switches y router",
          lines: [
            { t: "! === SWITCH ===", c: "c" },
            { t: "vlan 10", c: "" }, { t: "  name INGENIERIA", c: "o" },
            { t: "vlan 20", c: "" }, { t: "  name VENTAS", c: "o" },
            { t: "!", c: "c" },
            { t: "interface FastEthernet0/10", c: "" },
            { t: "  switchport mode access", c: "" },
            { t: "  switchport access vlan 10", c: "o" },
            { t: "interface GigabitEthernet0/1", c: "" },
            { t: "  switchport mode trunk", c: "o" },
            { t: "  switchport trunk allowed vlan 10,20", c: "o" },
            { t: "", c: "" },
            { t: "! === ROUTER (router-on-a-stick) ===", c: "c" },
            { t: "interface GigabitEthernet0/0.10", c: "" },
            { t: "  encapsulation dot1Q 10", c: "o" },
            { t: "  ip address 192.168.10.1 255.255.255.0", c: "b" },
            { t: "interface GigabitEthernet0/0.20", c: "" },
            { t: "  encapsulation dot1Q 20", c: "o" },
            { t: "  ip address 192.168.20.1 255.255.255.0", c: "b" }
          ]
        },
        {
          head: "$ verificación — pings por VLAN",
          lines: [
            { t: "PC-Ingenieria> ping 192.168.10.1", c: "p" },
            { t: "Reply from 192.168.10.1: bytes=32 time=1ms", c: "o" },
            { t: "Reply from 192.168.10.1: bytes=32 time=1ms", c: "o" },
            { t: "", c: "" },
            { t: "PC-Ingenieria> ping 192.168.20.5", c: "p" },
            { t: "Reply from 192.168.20.5: bytes=32 time=2ms", c: "o" },
            { t: "% Enrutamiento entre VLAN: OK", c: "o" }
          ]
        }
      ],
      tags: ["VLAN", "Trunk", "dot1Q", "Router-on-a-stick", "OSI Capa 2-3"]
    },
    {
      id: "case-malware",
      kicker: "Ciberseguridad · Caso #02",
      title: "Respuesta a Incidente: Equipo Infectado",
      lede: "Un equipo de ventas muestra pop-ups y consume CPU al 100%. Aplica el ciclo completo de respuesta a incidentes: contención, erradicación y recuperación.",
      art: "shield",
      steps: [
        { h: "1. Aislar el equipo de la red", p: "Desconéctalo del cable de red y del Wi-Fi de inmediato. El objetivo es frenar la propagación lateral y el robo de datos antes de analizar." },
        { h: "2. Iniciar en Modo Seguro con funciones de red", p: "Arranca sin cargar drivers de terceros. Muchos malware no logran ejecutarse en este modo, lo que facilita su detección." },
        { h: "3. Análisis de procesos y persistencia", p: "Revisa procesos con nombres falsificados (svchost32), tareas programadas y claves de ejecución automática en el registro." },
        { h: "4. Erradicar y restaurar", p: "Mueve a cuarentena, elimina los mecanismos de persistencia y restaura archivos desde un backup verificado. Cambia credenciales filtradas." }
      ],
      code: [
        {
          head: "$ PowerShell — caza de persistencia",
          lines: [
            { t: "PS C:\\> Get-ScheduledTask | ", c: "p" },
            { t: "  ? State -ne 'Disabled' | ft TaskName", c: "c" },
            { t: "TaskName                    State", c: "c" },
            { t: "WindowsHelper               Ready  <- sospechoso", c: "e" },
            { t: "", c: "" },
            { t: "PS C:\\> Get-CimInstance Win32_StartupCommand", c: "p" },
            { t: "  | Select Name, Command, Location", c: "c" },
            { t: "Name      : Updater", c: "" },
            { t: "Command   : C:\\Temp\\svchost32.exe", c: "e" },
            { t: "Location  : HKCU:\\...\\Run", c: "e" },
            { t: "", c: "" },
            { t: "PS C:\\> Stop-Process -Name svchost32 -Force", c: "p" },
            { t: "PS C:\\> Remove-Item C:\\Temp\\svchost32.exe", c: "o" },
            { t: "% Persistencia eliminada", c: "o" }
          ]
        }
      ],
      tags: ["IR", "Malware", "PowerShell", "Persistence", "Forense"]
    },
    {
      id: "case-phishing",
      kicker: "Ciberseguridad · Caso #03",
      title: "Análisis de un Ataque de Phishing",
      lede: "Un empleado recibe un correo sospechoso que simula ser del banco. Sigue el análisis y las medidas de mitigación para evitar el fraude.",
      art: "shield",
      steps: [
        { h: "1. Identificar las señales de phishing", p: "Urgencia, remitente falso (dominio similar), enlace sospechoso, errores gramaticales. No hacer clic." },
        { h: "2. Verificar la URL real", p: "Pasar el cursor sobre el enlace para ver la URL real. Si no coincide con el dominio oficial, es phishing." },
        { h: "3. Reportar y eliminar", p: "Notificar al equipo de seguridad, reportar el correo como phishing y eliminarlo de la bandeja de entrada." },
        { h: "4. Concienciar al empleado", p: "Recordar las buenas prácticas: no introducir credenciales en enlaces de correos, usar 2FA, y verificar siempre por un canal alternativo." }
      ],
      code: [
        {
          head: "$ Análisis del encabezado del correo",
          lines: [
            { t: "Received: from mail.x9k.ru (mail.x9k.ru [185.xxx.xxx.xxx])", c: "c" },
            { t: "From: banc0-seguridad@x9k.ru", c: "e" },
            { t: "Subject: TU CUENTA SERÁ SUSPENDIDA", c: "e" },
            { t: "X-Phishing: Este dominio no pertenece al banco oficial", c: "e" },
            { t: "[!] Se detectaron 3 señales de phishing", c: "e" },
            { t: "Acción: Marcar como phishing y reportar", c: "o" }
          ]
        }
      ],
      tags: ["Phishing", "Ingeniería social", "Prevención", "Concienciación"]
    }
  ];

  var $ = function(s, r) { return (r || document).querySelector(s); };
  var $$ = function(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s) { return String(s).replace(/[&<>"]/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function render() {
    var box = $("#caseList");
    if (!box) { console.warn('⚠️ #caseList no encontrado'); return; }

    box.innerHTML = CASOS.map(function(c, idx) {
      var steps = c.steps.map(function(s) {
        return '<div class="step"><h4 class="step__h">' + esc(s.h) + '</h4><p class="step__p">' + esc(s.p) + '</p></div>';
      }).join("");
      var code = c.code.map(function(blk) {
        var lines = blk.lines.map(function(l) {
          return '<span class="' + (l.c || "") + '">' + esc(l.t) + '</span>';
        }).join("\n");
        return '<div class="accordion__item' + (idx === 0 ? " open" : "") + '">' +
          '<button class="accordion__head" aria-expanded="' + (idx === 0 ? "true" : "false") + '"><span>' + esc(blk.head) + '</span><svg class="accordion__chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>' +
          '<div class="accordion__panel"><div><pre class="codeblock">' + lines + '</pre></div></div>' +
        '</div>';
      }).join("");
      var tags = (c.tags || []).map(function(t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("");

      var icon = c.art === "topo" ? "🌐" : "🛡️";

      return '<article class="case">' +
        '<div class="case__sticky">' +
          '<div class="case__video" style="background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:4rem;color:#fff;height:120px;border-radius:12px;">' + icon + '</div>' +
        '</div>' +
        '<div class="case__body">' +
          '<p class="case__kicker">' + esc(c.kicker) + '</p>' +
          '<h3 class="case__title">' + esc(c.title) + '</h3>' +
          '<p class="case__lede">' + esc(c.lede) + '</p>' +
          '<div class="case__steps">' + steps + '</div>' +
          '<div class="accordion">' + code + '</div>' +
          '<div class="case__taglist">' + tags + '</div>' +
        '</div>' +
      '</article>';
    }).join("");

    $$(".accordion__item", box).forEach(function(item) {
      var head = $(".accordion__head", item);
      if (head) {
        head.addEventListener("click", function() {
          var open = item.classList.toggle("open");
          head.setAttribute("aria-expanded", String(open));
        });
      }
    });
  }

  function init() {
    console.log('📖 Inicializando Casos de Estudio...');
    render();
  }

  document.addEventListener('secciones-cargadas', init);
})();
// js/descargas.js
(function() {
  "use strict";

  var $ = function(s, r) { return (r || document).querySelector(s); };
  var $$ = function(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s) { return String(s).replace(/[&<>"]/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var RECURSOS = [
    { id: "checklist-malware", titulo: "Checklist de Eliminación de Malware", tipo: "pdf", tamano: "2.4 MB", desc: "Guía paso a paso para aislar, detectar y erradicar malware persistente en entornos Windows." },
    { id: "topologia-vlan", titulo: "Topología VLAN (Packet Tracer)", tipo: "pkt", tamano: "1.1 MB", desc: "Laboratorio preconfigurado con VLANs, trunk y router-on-a-stick para practicar segmentación." },
    { id: "hardening-ubuntu", titulo: "Script de Hardening para Ubuntu", tipo: "sh", tamano: "8 KB", desc: "Script automatizado que aplica buenas prácticas de seguridad: firewall, SSH, actualizaciones y fail2ban." },
    { id: "plantilla-ir", titulo: "Plantilla de Informe de Incidentes (IR)", tipo: "docx", tamano: "450 KB", desc: "Estructura profesional para documentar la respuesta a incidentes, hallazgos y lecciones aprendidas." },
    { id: "comandos-cisco", titulo: "Hoja de Comandos Cisco Esenciales", tipo: "pdf", tamano: "980 KB", desc: "Resumen de comandos de configuración, verificación y troubleshooting para routers y switches." },
    { id: "plan-homelab", titulo: "Plan de Armado de Home Lab", tipo: "xlsx", tamano: "220 KB", desc: "Presupuesto, lista de componentes y guía de ensamblaje para tu propio laboratorio de virtualización." },
    { id: "cheatsheet-nmap", titulo: "Cheatsheet de Nmap", tipo: "pdf", tamano: "1.2 MB", desc: "Referencia rápida de comandos Nmap para escaneo de puertos, detección de servicios y scripts NSE." },
    { id: "cheatsheet-linux", titulo: "Hoja de Comandos Linux Esenciales", tipo: "pdf", tamano: "850 KB", desc: "Comandos básicos de navegación, gestión de archivos, permisos, procesos y red en Linux." },
    { id: "guia-owasp", titulo: "Resumen OWASP Top 10 2021", tipo: "pdf", tamano: "650 KB", desc: "Explicación concisa de las 10 vulnerabilidades web más críticas y cómo prevenirlas." },
    { id: "script-bash", titulo: "Ejemplos de Scripts Bash", tipo: "sh", tamano: "15 KB", desc: "Colección de scripts Bash para automatizar tareas comunes en administración de sistemas." }
  ];

  var icons = { pdf: '📄', pkt: '🌐', sh: '🐧', docx: '📋', xlsx: '📊' };
  var labels = { pdf: 'PDF', pkt: 'Packet Tracer', sh: 'Scripts', docx: 'Documentos', xlsx: 'Hojas de cálculo' };

  var state = { tipos: { pdf: true, pkt: true, sh: true, docx: true, xlsx: true } };

  function getFiltered() {
    return RECURSOS.filter(function(r) {
      return state.tipos[r.tipo] !== false;
    });
  }

  function render() {
    var grid = $("#descargasGrid");
    var empty = $("#descargasEmpty");
    if (!grid) return;
    var list = getFiltered();
    if (list.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    grid.innerHTML = list.map(function(r) {
      var icon = icons[r.tipo] || '📁';
      var label = labels[r.tipo] || r.tipo.toUpperCase();
      return '<div class="descarga-card">' +
        '<div class="descarga-card__header">' +
          '<div class="descarga-card__icon">' + icon + '</div>' +
          '<div class="descarga-card__meta">' +
            '<span class="descarga-card__type">' + esc(label) + '</span>' +
            '<span class="descarga-card__size">' + esc(r.tamano) + '</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="descarga-card__title">' + esc(r.titulo) + '</h3>' +
        '<p class="descarga-card__desc">' + esc(r.desc) + '</p>' +
        '<a href="#" class="btn btn-small descarga-card__btn">⬇️ Descargar</a>' +
      '</div>';
    }).join('');
  }

  function initFilters() {
    $$('#descargas .filter-group input[type="checkbox"]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        state.tipos[this.value] = this.checked;
        render();
      });
    });
    var reset = $("#descargasReset");
    if (reset) {
      reset.addEventListener('click', function() {
        $$('#descargas .filter-group input[type="checkbox"]').forEach(function(cb) { cb.checked = true; });
        state.tipos = { pdf: true, pkt: true, sh: true, docx: true, xlsx: true };
        render();
      });
    }
  }

  function init() {
    console.log('📥 Inicializando Descargas...');
    render();
    initFilters();
  }

  document.addEventListener('secciones-cargadas', init);
})();
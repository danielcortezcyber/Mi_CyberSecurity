// js/modal.js (VERSIÓN MEJORADA PARA RUTA Y TUTORIALES)
(function() {
  "use strict";

  console.log('🟢 modal.js cargado');

  var $ = function(s, r) { return (r || document).querySelector(s); };
  var $$ = function(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s) { return String(s).replace(/[&<>"]/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var P = window.Persistencia;

  function getProjects() {
    return window.TUTORIALES || [];
  }
  function getAcademy() {
    return window.LECCIONES_RUTA || [];
  }

  function byId(arr, id) {
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }

  function resolveItem(id) {
    console.log('🔍 Buscando item con id:', id);
    var projects = getProjects();
    var academy = getAcademy();

    var p = byId(projects, id);
    if (p) {
      console.log('✅ Encontrado en PROJECTS:', p.title);
      return { item: p, kind: 'project' };
    }
    var a = byId(academy, id);
    if (a) {
      console.log('✅ Encontrado en ACADEMY:', a.titulo);
      return { item: a, kind: 'academy' };
    }
    console.warn('⚠️ No se encontró el item con id:', id);
    return null;
  }

  function renderModalContent(item, kind) {
    console.log('🎨 Renderizando modal para:', item.title || item.titulo);
    var isAcademy = kind === 'academy';
    var typeLabel = isAcademy ? 'Lección' : ((item.type === 'proyecto') ? 'Proyecto' : 'Tutorial');

    // Obtener propiedades según el tipo
    var title = isAcademy ? (item.titulo || '') : (item.title || '');
    var desc = isAcademy ? (item.desc || '') : (item.desc || '');
    var catLabel = isAcademy ? (item.catLabel || item.categoria || '') : (item.catLabel || '');
    var level = isAcademy ? (item.level || item.nivel || '') : (item.level || '');
    var duration = isAcademy ? (item.duration || 'Variable') : (item.duration || '');
    var art = isAcademy ? (item.art || (item.categoria === 'redes' ? 'topo' : item.categoria === 'ciberseguridad' ? 'shield' : item.categoria === 'windows' ? 'board' : 'term')) : (item.art || 'term');
    var isFav = P.isFav(item.id);
    var isDone = isAcademy ? P.isAcademyDone(item.id) : P.isWatched(item.id);

    var icon = art === 'topo' ? '🌐' : art === 'shield' ? '🛡️' : art === 'board' ? '💻' : '⌨️';

    var html = '<div class="modal__media">' +
      '<div class="modal__art" style="height:120px;background:var(--primary, #6c63ff);display:flex;align-items:center;justify-content:center;font-size:4rem;color:#fff;">' + icon + '</div>' +
      '<div class="modal__badges">' +
        '<span class="modal__badge modal__badge--type">' + esc(typeLabel) + '</span>' +
        '<span class="modal__badge">' + esc(catLabel) + '</span>' +
        '<span class="modal__badge">' + esc(level) + '</span>' +
      '</div></div>' +
      '<div class="modal__body">' +
        '<h3 class="modal__title" id="modalTitle">' + esc(title) + '</h3>' +
        '<div class="modal__meta">' +
          '<span><strong>Duración:</strong> ' + esc(duration) + '</span>' +
          '<span><strong>Nivel:</strong> ' + esc(level) + '</span>' +
        '</div>' +
        '<p class="modal__desc">' + esc(desc) + '</p>';

    // Pasos (solo para proyectos, no para academia)
    if (!isAcademy && item.steps && item.steps.length > 0) {
      html += '<div class="modal__steps"><div class="steps-title">📋 Pasos del tutorial</div>';
      item.steps.forEach(function(step) {
        html += '<div class="step"><div class="step__h">' + esc(step.h) + '</div><div class="step__p">' + esc(step.p) + '</div></div>';
      });
      html += '</div>';
    }

    // Código (solo para proyectos)
    if (!isAcademy && item.code && item.code.length > 0) {
      html += '<div class="modal__code"><div class="code-title">💻 Comandos y configuración</div>';
      item.code.forEach(function(blk) {
        var lines = blk.lines.map(function(l) {
          return '<span class="' + (l.c || "") + '">' + esc(l.t) + '</span>';
        }).join("\n");
        html += '<div class="code-block">' +
          '<div class="code-head">' + esc(blk.head) + '</div>' +
          '<pre class="codeblock">' + lines + '</pre>' +
        '</div>';
      });
      html += '</div>';
    }

    // Botones
    html += '<div class="modal__links">' +
      '<button class="modal__action" data-modal-progress="' + esc(item.id) + '" aria-pressed="' + (isDone ? 'true' : 'false') + '">' +
        '<svg class="modal__action-icon" viewBox="0 0 24 24" width="18" height="18"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"/></svg>' +
        '<span>' + (isDone ? (isAcademy ? 'Completada ✓' : 'Visto') : (isAcademy ? 'Marcar completada' : 'Marcar visto')) + '</span>' +
      '</button>' +
      (isAcademy ? '' : '<button class="modal__action" data-modal-fav="' + esc(item.id) + '" aria-pressed="' + (isFav ? 'true' : 'false') + '">★ <span>' + (isFav ? 'Favorito' : 'Añadir favorito') + '</span></button>') +
      (item.repo && !isAcademy ? '<a class="modal__action" href="' + esc(item.repo) + '" target="_blank" rel="noopener">📁 Repositorio</a>' : '') +
      (item.demo && !isAcademy ? '<a class="modal__action" href="' + esc(item.demo) + '">📖 Ver caso completo</a>' : '') +
    '</div>';

    html += '</div>';
    return html;
  }

  function openModal(id) {
    console.log('🖱️ openModal llamado con id:', id);
    var resolved = resolveItem(id);
    if (!resolved) {
      console.warn('⚠️ No se pudo resolver el item');
      return;
    }
    var modal = $('#projectModal');
    var content = $('#modalContent');
    if (!modal || !content) {
      console.warn('⚠️ Modal no encontrado en el DOM');
      return;
    }

    console.log('📝 Renderizando contenido...');
    content.innerHTML = renderModalContent(resolved.item, resolved.kind);
    modal.hidden = false;
    modal.offsetHeight;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    console.log('✅ Modal abierto');

    // Eventos de botones
    var progBtn = $('[data-modal-progress]', content);
    if (progBtn) {
      progBtn.addEventListener('click', function(e) {
        var id = this.dataset.modalProgress;
        var isAcademy = resolved.kind === 'academy';
        var on = isAcademy ? !P.isAcademyDone(id) : !P.isWatched(id);
        if (isAcademy) P.setAcademyDone(id, on);
        else P.setWatched(id, on);
        this.setAttribute('aria-pressed', String(on));
        var span = this.querySelector('span');
        if (span) span.textContent = on ? (isAcademy ? 'Completada ✓' : 'Visto') : (isAcademy ? 'Marcar completada' : 'Marcar visto');
        this.classList.toggle('is-on', on);
        actualizarTarjeta(id, on, isAcademy);
        if (isAcademy) actualizarProgresoAcademia();
        else actualizarProgreso();
        toast(on ? (isAcademy ? '✓ Lección completada' : '✓ Marcado como visto') : 'Desmarcado');
      });
    }

    var favBtn = $('[data-modal-fav]', content);
    if (favBtn) {
      favBtn.addEventListener('click', function(e) {
        var id = this.dataset.modalFav;
        var on = !P.isFav(id);
        P.setFav(id, on);
        this.setAttribute('aria-pressed', String(on));
        var span = this.querySelector('span');
        if (span) span.textContent = on ? 'Favorito' : 'Añadir favorito';
        actualizarFavTarjeta(id, on);
        toast(on ? '★ Añadido a favoritos' : '★ Quitado de favoritos');
      });
    }

    var closeBtns = modal.querySelectorAll('[data-close]');
    closeBtns.forEach(function(btn) {
      btn.addEventListener('click', closeModal);
    });
  }

  function closeModal() {
    var modal = $('#projectModal');
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(function() {
      modal.hidden = true;
      $('#modalContent').innerHTML = '';
      document.body.style.overflow = '';
    }, 300);
  }

  function actualizarTarjeta(id, on, isAcademy) {
    var selector = isAcademy ? '#rutaGrid' : '#tutorialesGrid';
    var card = document.querySelector(selector + ' .card[data-id="' + id + '"]');
    if (card) card.classList.toggle('is-watched', on);
    if (isAcademy) {
      var rutaItem = document.querySelector('#rutaGrid [data-id="' + id + '"] .leccion-status');
      if (rutaItem) {
        rutaItem.textContent = on ? '✅' : '⬜';
        rutaItem.classList.toggle('completed', on);
      }
    }
  }

  function actualizarFavTarjeta(id, on) {
    var card = document.querySelector('#tutorialesGrid .card[data-id="' + id + '"]');
    if (card) card.classList.toggle('is-fav', on);
  }

  function actualizarProgreso() {
    var total = window.TUTORIALES ? window.TUTORIALES.length : 0;
    var done = 0;
    for (var i = 0; i < total; i++) if (P.isWatched(window.TUTORIALES[i].id)) done++;
    var fill = $('#progressFill');
    var doneEl = $('#progressDone');
    var totalEl = $('#progressTotal');
    if (fill) fill.style.width = total ? Math.round((done / total) * 100) + '%' : '0%';
    if (doneEl) doneEl.textContent = done;
    if (totalEl) totalEl.textContent = total;
  }

  function actualizarProgresoAcademia() {
    var total = window.LECCIONES_RUTA ? window.LECCIONES_RUTA.length : 0;
    var done = 0;
    for (var i = 0; i < total; i++) if (P.isAcademyDone(window.LECCIONES_RUTA[i].id)) done++;
    var fill = $('#rutaProgressFill');
    var doneEl = $('#rutaProgressDone');
    var totalEl = $('#rutaProgressTotal');
    if (fill) fill.style.width = total ? Math.round((done / total) * 100) + '%' : '0%';
    if (doneEl) doneEl.textContent = done;
    if (totalEl) totalEl.textContent = total;
  }

  function toast(text) {
    var t = $('#toast');
    if (!t) return;
    t.innerHTML = '<span>' + esc(text) + '</span>';
    t.hidden = false;
    requestAnimationFrame(function() { t.classList.add('show'); });
    clearTimeout(t._timer);
    t._timer = setTimeout(function() {
      t.classList.remove('show');
      setTimeout(function() { t.hidden = true; }, 350);
    }, 3000);
  }

  // Eventos globales
  console.log('🔄 Enlazando eventos click...');
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    }
    if (e.target.closest('[data-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  window.Modal = { open: openModal, close: closeModal };
  console.log('✅ modal.js listo, window.Modal asignado');
})();
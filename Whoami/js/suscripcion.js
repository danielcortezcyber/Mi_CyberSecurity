// js/suscripcion.js
(function() {
  "use strict";
  var form = document.getElementById('subscribeForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('¡Gracias por suscribirte! Revisa tu correo para recibir las guías.');
      form.reset();
    });
  }
})();
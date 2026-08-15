// js/loader.js - VERSIÓN ESTABLE (carga todas las secciones al inicio)
document.addEventListener('DOMContentLoaded', function() {
    // 1. Cargar el navbar SOLO en el placeholder
    var navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder && !navbarPlaceholder.dataset.cargado) {
        fetch('Whoami/sections/navbar.html')
            .then(res => res.text())
            .then(html => {
                navbarPlaceholder.innerHTML = html;
                navbarPlaceholder.dataset.cargado = 'true';
                document.dispatchEvent(new Event('navbar-cargado'));
            })
            .catch(err => console.error('Error cargando navbar:', err));
    }

    // 2. Cargar el resto de secciones en #app
    var app = document.getElementById('app');
    if (!app) return;

    // Lista de secciones (TODAS excepto navbar)
    var sections = [
        'hero',
        'academia-pnp',
        'ruta-aprendizaje',
        'tutoriales',
        'casos',
        'gear',
        'descargas',
        'soporte',  
        'powershell',
        'cmd',
        'cheatsheets',
        'ip-consult',
        'trayectoria',
        'suscripcion',
        'footer'
    ];

    var promesas = sections.map(function(section) {
        return fetch('Whoami/sections/' + section + '.html')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar ' + section);
                return response.text();
            })
            .then(html => {
                app.insertAdjacentHTML('beforeend', html);
                console.log('✅ Sección ' + section + ' cargada');
            })
            .catch(error => {
                console.error(error);
                app.insertAdjacentHTML('beforeend', 
                    '<section class="section error"><div class="container"><h2>Error al cargar ' + section + '</h2><p>Recarga la página.</p></div></section>'
                );
            });
    });

    Promise.all(promesas).then(function() {
        console.log('✅ Todas las secciones cargadas. Inicializando módulos...');
        document.dispatchEvent(new Event('secciones-cargadas'));
    }).catch(function(error) {
        console.error('❌ Error general al cargar secciones:', error);
        // Aun así, intentamos inicializar los módulos
        document.dispatchEvent(new Event('secciones-cargadas'));
    });
});
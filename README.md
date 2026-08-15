# 🛡️ Daniel Cortez · Web Personal de Ciberseguridad

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-brightgreen?style=flat-square)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue?style=flat-square)
![Responsive](https://img.shields.io/badge/Responsive-Sí-success?style=flat-square)
![Modo Oscuro](https://img.shields.io/badge/Modo%20Oscuro-Sí-9cf?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/Desplegado-GitHub%20Pages-blueviolet?style=flat-square)
![Estructura](https://img.shields.io/badge/Estructura-Modular-orange?style=flat-square)

> Web personal profesional enfocada en **Ciberseguridad, Redes y Administración de Sistemas**. Incluye ruta de aprendizaje interactiva, tutoriales, comandos PowerShell/CMD con buscadores, cheatsheets, consulta de IPs maliciosas, laboratorio de soporte técnico y estadísticas en vivo.

🔗 **Ver demo:** [https://danielcortezcyber.github.io/mi-web-personal/](https://danielcortezcyber.github.io/mi-web-personal/)

---

## 📸 Captura de pantalla

<p align="center">
  <img src="assets/img/screenshot.png" alt="Vista previa de la web" width="800" />
  <br>
  <em>Vista del modo oscuro con la sección de PowerShell y el navbar Cyber Green</em>
</p>

*(Reemplaza `assets/img/screenshot.png` con una captura real de tu web)*

---

## ✨ Características principales

- 🌓 **Tema Oscuro/Claro** con persistencia en `localStorage` y soporte global en todo el sitio.
- 🔍 **Buscador Global** en el navbar que indexa todo el contenido.
- 📘 **Ruta de Aprendizaje** con 36 lecciones interactivas y progreso guardado.
- 💻 **Guía de PowerShell** con más de 100 cmdlets organizados por categorías + buscador en tiempo real.
- ⚡ **Guía de CMD** con más de 40 comandos + buscador en tiempo real.
- 🛠️ **Laboratorio de Soporte Técnico** interactivo: asistente de diagnóstico, checklist de mantenimiento, códigos POST y recursos.
- 📄 **Cheatsheets** (hojas de referencia descargables).
- 🕵️ **Consulta de IPs maliciosas** con VirusTotal (API Key opcional).
- 📚 **Tutoriales y Proyectos** con sistema de favoritos y progreso.
- 🔐 **Casos de Estudio** con acordeones y código interactivo.
- 🛒 **Gear** (recomendaciones de hardware con slider de presupuesto).
- 📊 **Trayectoria profesional** visual con línea de tiempo.
- 📬 **Formulario de contacto** (simulado).
- 📱 **100% Responsive** (móviles, tablets y escritorio).
- ⏱️ **Estadísticas en vivo**: reloj, tiempo de actividad (uptime) y última actualización.
- 🧩 **Arquitectura modular** con lazy loading para mejorar el rendimiento.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Estilos, variables, animaciones, Flexbox/Grid |
| **JavaScript (ES6+)** | Lógica, eventos, fetch, localStorage, IntersectionObserver |
| **FontAwesome** | Iconos profesionales |
| **Google Fonts** | Tipografía Inter |
| **VirusTotal API** | Consulta de reputación de IPs |

---

## 📁 Estructura del proyecto (reorganizada)

El proyecto ha sido reorganizado para una mejor mantenibilidad. Todo el código principal (CSS, JS y secciones HTML) se encuentra ahora dentro de la carpeta `Whoami/`. La carpeta `romantic/` contiene la sección especial "Romantic" con su propia estructura.

```
Mi_CyberSecurity/
├── index.html          # Página principal
├── romantico.html      # Página romántica (especial)
├── README.md            # Este archivo
├── Whoami/               # 🚀 CARPETA PRINCIPAL
│   ├── css/              # Todos los estilos (22 archivos)
│   ├── js/               # Todos los scripts (19 archivos)
│   └── sections/         # Fragmentos HTML (16 archivos)
└── romantic/             # Sección especial
    ├── assets/            # Música, imágenes, etc.
    ├── css/               # Estilos propios
    ├── features/          # Funcionalidades específicas
    ├── js/                # Scripts propios
    └── sections/          # Fragmentos HTML de la sección
```

> **Nota:** La antigua carpeta `src/` fue eliminada y su contenido movido a `Whoami/` para mantener un nombre más descriptivo y alineado con la identidad del sitio.

---

## 🚀 Cómo ejecutar localmente

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/danielcortezcyber/Mi_CyberSecurity.git
   ```

2. **Abre la carpeta**:
   ```bash
   cd Mi_CyberSecurity
   ```

3. **Usa un servidor local** (recomendado):

   - Con VS Code: instala la extensión "Live Server" y haz clic en "Go Live".
   - Con Python:
     ```bash
     python -m http.server
     ```
   - Con Node.js:
     ```bash
     npx serve
     ```

4. Abre tu navegador en `http://localhost:5500` (o el puerto que corresponda).

⚠️ **Importante:** No uses el protocolo `file://` directamente, ya que los `fetch()` para cargar secciones no funcionarán por restricciones CORS.

---

## 📦 Despliegue en GitHub Pages

El sitio está preparado para ser desplegado en GitHub Pages sin configuración adicional:

1. Ve a **Settings > Pages** en tu repositorio.
2. Selecciona la rama `main` y la carpeta raíz (`/`).
3. Guarda y espera unos minutos.

Tu sitio estará disponible en:
`https://danielcortezcyber.github.io/Mi_CyberSecurity/`

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un error o quieres mejorar alguna funcionalidad:

1. Haz un **fork** del repositorio.
2. Crea una rama con tu mejora: `git checkout -b feature/nueva-funcionalidad`.
3. Haz commit de tus cambios: `git commit -m "Añadida nueva funcionalidad"`.
4. Haz push a tu rama: `git push origin feature/nueva-funcionalidad`.
5. Abre un **Pull Request** y describe los cambios.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 📬 Contacto

- **Autor:** Daniel Cortez
- **GitHub:** [@danielcortezcyber](https://github.com/danielcortezcyber)
- **LinkedIn:** Daniel Cortez (opcional)
- **Correo:** danielcortezcyber@proton.me (opcional)

---

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub. ¡Gracias por visitar!
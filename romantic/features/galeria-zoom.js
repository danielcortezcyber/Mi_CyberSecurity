// ================================================================
// GALERÍA ZOOM - Lightbox con zoom y navegación
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Ya existe un lightbox en interactions.js, lo mejoramos aquí.
    // Añadimos navegación con flechas y zoom.

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxBody = document.getElementById('lightboxBody');
    if (!lightboxModal || !lightboxBody) return;

    let currentSlideIndex = 0;
    let slides = [];

    // Función para obtener todos los elementos de la galería (slider o grid)
    function getGalleryItems() {
        // Si hay slider, tomar las slides del slider
        const sliderSlides = document.querySelectorAll('.slider-slide');
        if (sliderSlides.length) {
            return Array.from(sliderSlides).map(slide => ({
                icon: slide.querySelector('.slider-emoji')?.textContent || '❤️',
                title: slide.querySelector('.slider-info h3')?.textContent || 'Momento especial',
                desc: slide.querySelector('.slider-info p')?.textContent || ''
            }));
        }
        // Si no, tomar las tarjetas de la galería grid
        const items = document.querySelectorAll('.galeria-item');
        return Array.from(items).map(item => ({
            icon: item.querySelector('.galeria-emoji')?.textContent || '❤️',
            title: item.querySelector('.galeria-info h4')?.textContent || 'Momento especial',
            desc: item.querySelector('.galeria-info p')?.textContent || ''
        }));
    }

    // Función para abrir el lightbox con navegación
    function openLightboxWithNav(index) {
        slides = getGalleryItems();
        if (slides.length === 0) return;
        currentSlideIndex = Math.min(Math.max(index, 0), slides.length - 1);
        renderSlide(currentSlideIndex);
        lightboxModal.hidden = false;
        document.body.style.overflow = 'hidden';

        // Añadir botones de navegación si no existen
        addNavigationButtons();
    }

    function renderSlide(index) {
        const data = slides[index];
        if (!data) return;
        lightboxBody.innerHTML = `
            <div class="lightbox-icon" style="font-size: 5rem; text-align: center; margin-bottom: 0.5rem;">${data.icon}</div>
            <h2 class="lightbox-title" style="text-align: center; font-family: 'Playfair Display', serif;">${data.title}</h2>
            <p class="lightbox-desc" style="text-align: center; color: var(--text-secondary);">${data.desc}</p>
            <div style="text-align: center; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
                ${currentSlideIndex + 1} / ${slides.length}
            </div>
        `;
    }

    function addNavigationButtons() {
        // Eliminar botones antiguos para evitar duplicados
        const oldPrev = document.querySelector('.lightbox-nav-prev');
        const oldNext = document.querySelector('.lightbox-nav-next');
        if (oldPrev) oldPrev.remove();
        if (oldNext) oldNext.remove();

        const prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-nav-prev';
        prevBtn.innerHTML = '‹';
        prevBtn.style.cssText = `
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.8);
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            font-size: 2rem;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10;
        `;
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            openLightboxWithNav(newIndex);
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-nav-next';
        nextBtn.innerHTML = '›';
        nextBtn.style.cssText = `
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.8);
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            font-size: 2rem;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10;
        `;
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentSlideIndex + 1) % slides.length;
            openLightboxWithNav(newIndex);
        });

        const content = lightboxModal.querySelector('.lightbox-content');
        content.appendChild(prevBtn);
        content.appendChild(nextBtn);

        // Ajustar estilos del contenido para dejar espacio
        content.style.position = 'relative';
        content.style.padding = '2.5rem 3rem';
    }

    // Interceptar clics en la galería para usar el nuevo lightbox
    document.addEventListener('click', function(e) {
        const item = e.target.closest('.galeria-item') || e.target.closest('.slider-slide');
        if (!item) return;

        // Determinar el índice
        let allItems = getGalleryItems();
        let index = 0;
        if (item.classList.contains('galeria-item')) {
            const items = document.querySelectorAll('.galeria-item');
            index = Array.from(items).indexOf(item);
        } else if (item.classList.contains('slider-slide')) {
            const slides = document.querySelectorAll('.slider-slide');
            index = Array.from(slides).indexOf(item);
        }
        openLightboxWithNav(index);
        // Prevenir que el lightbox normal se abra (ya que usamos el mismo modal)
        e.stopPropagation();
    });

    // Cerrar lightbox (mantener funcionalidad existente)
    const closeBtn = document.getElementById('lightboxCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            lightboxModal.hidden = true;
            document.body.style.overflow = '';
        });
    }
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            lightboxModal.hidden = true;
            document.body.style.overflow = '';
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !lightboxModal.hidden) {
            lightboxModal.hidden = true;
            document.body.style.overflow = '';
        }
        // Navegación con teclado
        if (!lightboxModal.hidden) {
            if (e.key === 'ArrowLeft') {
                const newIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                openLightboxWithNav(newIndex);
            } else if (e.key === 'ArrowRight') {
                const newIndex = (currentSlideIndex + 1) % slides.length;
                openLightboxWithNav(newIndex);
            }
        }
    });

    console.log('🔍 Galería con zoom y navegación activada.');
});
// js/hero.js
document.addEventListener('DOMContentLoaded', function() {
    var typedSpan = document.getElementById('typedName');
    if (!typedSpan) return;
    var names = ['Daniel Cortez', 'Ingeniero en Ciberseguridad', 'Docente', 'Pentester Ético'];
    var index = 0, charIndex = 0, isDeleting = false;

    function type() {
        var current = names[index];
        if (!isDeleting) {
            typedSpan.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 120);
        } else {
            typedSpan.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % names.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 60);
        }
    }
    type();
});
// ===== CALIFICACION.JS =====
// Maneja el sistema de estrellas y calificaciones

function calificar(contenedorId, numero) {
    const estrellas = document.getElementById(contenedorId).querySelectorAll('.estrella')
    estrellas.forEach((estrella, index) => {
        estrella.classList.toggle('activa', index < numero)
    })
}

function enviarCalificacion(boton) {
    const card = boton.closest('.calificacion-card')
    const estrellasActivas = card.querySelectorAll('.estrella.activa').length
    const comentario = card.querySelector('textarea').value

    if (estrellasActivas === 0) {
        alert('Por favor selecciona al menos una estrella')
        return
    }
    if (!comentario) {
        alert('Por favor escribe un comentario')
        return
    }

    alert(`⭐ Calificación enviada: ${estrellasActivas} estrellas`)
    boton.textContent = '✅ Calificación enviada'
    boton.disabled = true
    boton.style.background = '#22c55e'

    // TEMPORAL - cuando el backend esté listo:
    // fetch('../../backend/calificaciones/calificar.php', {
    //    method: 'POST',
    //    body: JSON.stringify({ estrellas: estrellasActivas, comentario })
    // })
}

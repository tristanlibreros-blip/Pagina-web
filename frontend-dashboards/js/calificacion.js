// ===== CALIFICACION.JS =====

// Maneja el sistema de estrellas
function calificar(contenedorId, numero){
    const estrellas = document.getElementById(contenedorId).querySelectorAll('.estrella')
    estrellas.forEach((estrella, index) => {
        estrella.classList.toggle('activa', index < numero)
    })
    document.getElementById(contenedorId).dataset.seleccion = numero
}

// Enviar calificación al backend
function enviarCalificacion(boton, proyectoId, desarrolladorId){
    const card = boton.closest('.calificacion-card')
    const contenedorEstrellas = card.querySelector('.estrellas')
    const estrellas = parseInt(contenedorEstrellas.dataset.seleccion || 0)
    const comentario = card.querySelector('textarea').value

    if(estrellas === 0){
        alert('Por favor selecciona al menos una estrella')
        return
    }
    if(!comentario){
        alert('Por favor escribe un comentario')
        return
    }

    fetch('../../backend-servicios/calificaciones/calificar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            proyecto_id: proyectoId,
            cliente_id: window.usuarioId,
            desarrollador_id: desarrolladorId,
            estrellas: estrellas,
            comentario: comentario
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            boton.textContent = '✅ Calificación enviada'
            boton.disabled = true
            boton.style.background = '#22c55e'
            alert(`⭐ Calificación enviada: ${estrellas} estrellas`)
        } else {
            alert(data.mensaje || 'Error al enviar la calificación')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// ===== CALIFICACION.JS =====
function cargarCalificacionesCliente(){
    if(!window.usuarioId) return

    fetch(`../backend-servicios/proyectos/ver-proyectos.php?cliente_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-calificaciones')
        lista.innerHTML = ''

        const terminados = data.proyectos.filter(p => p.estado === 'terminado')

        if(terminados.length === 0){
            lista.innerHTML = '<p class="empty-state">Sin proyectos terminados aún</p>'
            return
        }

        paginar(
            terminados,
            'lista-calificaciones',
            proj => {
                if(proj.calificacion){
                    return `
                        <div class="calificacion-card">
                            <h3>${proj.nombre}</h3>
                            <p>Desarrollador: ${proj.desarrollador_nombre}</p>
                            <p><strong>Tu calificación:</strong> ${'⭐'.repeat(proj.calificacion.estrellas)}</p>
                            <p><strong>Comentario:</strong> ${proj.calificacion.comentario}</p>
                            <p><strong>Fecha:</strong> ${proj.calificacion.fecha}</p>
                            <span class="badge badge-terminado">Ya calificaste este proyecto ✅</span>
                        </div>
                    `
                } else {
                    return `
                        <div class="calificacion-card">
                            <h3>${proj.nombre}</h3>
                            <p>Desarrollador: ${proj.desarrollador_nombre}</p>
                            <div class="estrellas" id="estrellas-${proj.id}" data-seleccion="0">
                                <span class="estrella" onclick="calificar('estrellas-${proj.id}', 1)">★</span>
                                <span class="estrella" onclick="calificar('estrellas-${proj.id}', 2)">★</span>
                                <span class="estrella" onclick="calificar('estrellas-${proj.id}', 3)">★</span>
                                <span class="estrella" onclick="calificar('estrellas-${proj.id}', 4)">★</span>
                                <span class="estrella" onclick="calificar('estrellas-${proj.id}', 5)">★</span>
                            </div>
                            <textarea placeholder="Escribe tu comentario..."></textarea>
                            <button class="btn btn-verde" onclick="enviarCalificacion(this, ${proj.id}, ${proj.desarrollador_id})">
                                Enviar calificación
                            </button>
                        </div>
                    `
                }
            }
        )
    })
}
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

    fetch('../backend-servicios/calificaciones/calificar.php', {
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

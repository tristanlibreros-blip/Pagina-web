// ===== SOLICITUDES.JS =====

// Responder solicitud (aceptar o rechazar)
function responderSolicitud(boton, respuesta, solicitudId){
    const card = boton.closest('.solicitud-card')
    const nombre = card.querySelector('h3').textContent

    fetch('../../backend/solicitudes/responder-solicitud.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            solicitud_id: solicitudId,
            estado: respuesta,
            desarrollador_id: window.usuarioId
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            if(respuesta === 'aceptada'){
                card.querySelector('.solicitud-botones').innerHTML =
                    `<span class="badge badge-aceptada">Aceptada ✅</span>`
                alert(`✅ Solicitud de ${nombre} aceptada`)
            } else {
                card.querySelector('.solicitud-botones').innerHTML =
                    `<span class="badge badge-rechazada">Rechazada ❌</span>`
                alert(`❌ Solicitud de ${nombre} rechazada`)
            }
        } else {
            alert(data.mensaje || 'Error al responder la solicitud')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// Subir archivo de avance
function subirArchivo(inputId, proyectoId){
    const archivo = document.getElementById(inputId).files[0]

    if(!archivo){
        alert('Por favor selecciona un archivo')
        return
    }

    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('proyecto_id', proyectoId)

    fetch('../../backend/archivos/subir.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert(`📤 Archivo "${archivo.name}" subido correctamente ✅`)
            document.getElementById(inputId).value = ''
        } else {
            alert(data.mensaje || 'Error al subir el archivo')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// Descargar archivo
function descargarArchivo(archivoId){
    window.location = `../../backend/archivos/descargar.php?archivo_id=${archivoId}`
}

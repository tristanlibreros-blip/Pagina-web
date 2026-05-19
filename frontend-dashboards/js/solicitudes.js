// ===== SOLICITUDES.JS =====

// Responder solicitud (aceptar o rechazar)
function responderSolicitud(boton, respuesta, solicitudId){
    const card = boton.closest('.solicitud-card')
    const nombre = card.querySelector('h3').textContent

    fetch('../backend-servicios/solicitudes/responder-solicitud.php', {
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
                alert(`✅ Solicitud aceptada`)
            } else {
                card.querySelector('.solicitud-botones').innerHTML =
                    `<span class="badge badge-rechazada">Rechazada ❌</span>`
                alert(`❌ Solicitud rechazada`)
            }
        } else {
            alert(data.mensaje || 'Error al responder la solicitud')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// Subir archivo de avance
function subirArchivo(proyectoId){
    const input = document.getElementById(`archivo-${proyectoId}`)

    if(!input || input.files.length === 0){
        alert('Por favor selecciona un archivo')
        return
    }

    const archivo = input.files[0]

    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('proyecto_id', proyectoId)

    
    fetch('../backend-servicios/archivos/subir.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert(`📤 Archivo "${archivo.name}" subido correctamente ✅`)
            input.value = ''
        } else {
            alert(data.mensaje || 'Error al subir el archivo')
        }
    })
    .catch(error => {
        console.error(error)
        alert('Error de conexión')
    })
}
function responderAvance(archivoId, estado){

    let razon = ''

    if(estado === 'rechazado'){

        razon = prompt('Escribe la razón del rechazo')

        if(!razon) return
    }

    fetch('../backend-servicios/archivos/responder-avance.php', {

        method: 'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body: JSON.stringify({
            archivo_id: archivoId,
            estado: estado,
            razon: razon
        })
    })

    .then(res => res.json())

    .then(data => {

        if(data.success){

            alert('Respuesta enviada ✅')

            cargarProyectosCliente()

        }else{

            alert(data.mensaje)
        }
    })

    .catch(error => {
        console.error(error)
        alert('Error de conexión')
    })
}

// Descargar archivo
function descargarArchivo(archivoId){
    window.location = `../backend-servicios/archivos/descargar.php?archivo_id=${archivoId}`
}

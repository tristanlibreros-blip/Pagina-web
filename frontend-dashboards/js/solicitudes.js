// ===== SOLICITUDES.JS =====
// Maneja aceptar y rechazar solicitudes

function responderSolicitud(boton, respuesta) {
    const card = boton.closest('.solicitud-card')
    const nombre = card.querySelector('h3').textContent

    if (respuesta === 'aceptada') {
        card.querySelector('.solicitud-botones').innerHTML = 
            `<span class="badge badge-aceptada">Aceptada ✅</span>`
        alert(`✅ Solicitud de ${nombre} aceptada`)
    } else {
        card.querySelector('.solicitud-botones').innerHTML = 
            `<span class="badge badge-rechazada">Rechazada ❌</span>`
        alert(`❌ Solicitud de ${nombre} rechazada`)
    }

    // TEMPORAL - cuando el backend esté listo:
    // fetch('../../backend/solicitudes/responder-solicitud.php', {
    //    method: 'POST',
    //    body: JSON.stringify({ solicitud_id: id, estado: respuesta })
    // })
}

function subirArchivo(inputId) {
    const archivo = document.getElementById(inputId).files[0]
    if (!archivo) {
        alert('Por favor selecciona un archivo')
        return
    }
    alert(`📤 Archivo "${archivo.name}" subido correctamente`)

    // TEMPORAL - cuando el backend esté listo:
    // const formData = new FormData()
    // formData.append('archivo', archivo)
    // fetch('../../backend/archivos/subir.php', { method: 'POST', body: formData })
}

function descargarArchivo(nombre) {
    alert(`⬇ Descargando ${nombre}...`)

    // TEMPORAL - cuando el backend esté listo:
    // window.location = `../../backend/archivos/descargar.php?archivo=${nombre}`
}

// ===== DASHBOARD.JS =====

// Al cargar la página verifica la sesión
document.addEventListener('DOMContentLoaded', function(){
    verificarSesion()
    cargarSolicitudesDesarrollador()
    cargarSolicitudesCliente()
    cargarProyectosCliente()
})

// Verifica si hay sesión activa
function verificarSesion(){
    fetch('../../backend/auth/sesion.php')
    .then(res => res.json())
    .then(data => {
        if(!data.logueado){
            // Si no está logueado redirige al login
            window.location = '../frontend-diseño/login.html'
            return
        }
        // Muestra el nombre en la navbar
        document.getElementById('nombre-usuario').textContent = '👤 ' + data.nombre

        // Guarda el id en una variable global para usarlo en los fetch
        window.usuarioId = data.id
        window.usuarioNombre = data.nombre

        // Carga los datos con el id real
        cargarSolicitudesDesarrollador()
        cargarSolicitudesCliente()
        cargarProyectosCliente()
    })
    .catch(() => {
        window.location = '../frontend-diseño/login.html'
    })
}

// Cambiar entre pestañas
function cambiarPestana(pestana, boton){
    document.querySelectorAll('.contenido-pestana').forEach(p => p.classList.remove('activo'))
    document.querySelectorAll('.pestana').forEach(b => b.classList.remove('activa'))
    document.getElementById('pestana-' + pestana).classList.add('activo')
    boton.classList.add('activa')
}

// Cerrar sesión
function cerrarSesion(){
    fetch('../../backend/auth/cerrar-sesion.php')
    .then(res => res.json())
    .then(data => {
        if(data.success){
            window.location = '../frontend-diseño/index.html'
        }
    })
}

// Ver detalles de solicitud
function verDetalles(cliente, descripcion){
    document.getElementById('detalle-cliente').textContent = cliente
    document.getElementById('detalle-descripcion').textContent = descripcion
    document.getElementById('modal-detalles').classList.add('activo')
}

// Cerrar modal detalles
function cerrarModalDetalles(){
    document.getElementById('modal-detalles').classList.remove('activo')
}

// Cargar solicitudes recibidas por el desarrollador
function cargarSolicitudesDesarrollador(){
    if(!window.usuarioId) return

    fetch(`../../backend/solicitudes/ver-solicitudes.php?desarrollador_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        if(!data.success) return

        const lista = document.getElementById('lista-solicitudes-dev')

        if(data.solicitudes.length === 0){
            lista.innerHTML = '<p class="empty-state">No tienes solicitudes pendientes 😊</p>'
            return
        }

        lista.innerHTML = ''
        data.solicitudes.forEach(sol => {
            lista.innerHTML += `
                <div class="solicitud-card" data-id="${sol.id}">
                    <div class="solicitud-info">
                        <h3>${sol.cliente_nombre}</h3>
                        <p>${sol.descripcion}</p>
                        <p style="margin-top:5px; font-size:0.8rem; color:#aaa">${sol.fecha}</p>
                    </div>
                    <div class="solicitud-botones">
                        ${sol.estado === 'pendiente' ? `
                            <button class="btn btn-azul" onclick="verDetalles('${sol.cliente_nombre}', '${sol.descripcion}')">Ver más</button>
                            <button class="btn btn-verde" onclick="responderSolicitud(this, 'aceptada', ${sol.id})">Aceptar ✅</button>
                            <button class="btn btn-rojo" onclick="responderSolicitud(this, 'rechazada', ${sol.id})">Rechazar ❌</button>
                        ` : `<span class="badge badge-${sol.estado}">${sol.estado} ${sol.estado === 'aceptada' ? '✅' : '❌'}</span>`}
                    </div>
                </div>
            `
        })
    })
    .catch(() => console.log('Error al cargar solicitudes del desarrollador'))
}

// Cargar solicitudes enviadas por el cliente
function cargarSolicitudesCliente(){
    if(!window.usuarioId) return

    fetch(`../../backend/solicitudes/ver-solicitudes.php?cliente_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        if(!data.success) return

        const lista = document.getElementById('lista-solicitudes-cliente')

        if(data.solicitudes.length === 0){
            lista.innerHTML = '<p class="empty-state">No has enviado solicitudes aún 😊</p>'
            return
        }

        lista.innerHTML = ''
        data.solicitudes.forEach(sol => {
            lista.innerHTML += `
                <div class="solicitud-card">
                    <div class="solicitud-info">
                        <h3>Solicitud a ${sol.desarrollador_nombre}</h3>
                        <p>${sol.descripcion}</p>
                    </div>
                    <span class="badge badge-${sol.estado}">
                        ${sol.estado === 'pendiente' ? 'Pendiente 🟡' : sol.estado === 'aceptada' ? 'Aceptada ✅' : 'Rechazada ❌'}
                    </span>
                </div>
            `
        })
    })
    .catch(() => console.log('Error al cargar solicitudes del cliente'))
}

// Cargar proyectos del cliente con archivos
function cargarProyectosCliente(){
    if(!window.usuarioId) return

    fetch(`../../backend/archivos/ver-archivos.php?cliente_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        if(!data.success) return

        const lista = document.getElementById('lista-proyectos-cliente')
        if(data.proyectos.length === 0){
            lista.innerHTML = '<p class="empty-state">No tienes proyectos activos aún 😊</p>'
            return
        }

        lista.innerHTML = ''
        data.proyectos.forEach(proj => {
            const archivos = proj.archivos.map(a => `
                <div class="archivo-item">
                    <span>📄 ${a.nombre} — ${a.fecha}</span>
                    <button class="btn btn-azul" onclick="window.location='../../backend/archivos/descargar.php?archivo_id=${a.id}'">⬇ Descargar</button>
                </div>
            `).join('')

            lista.innerHTML += `
                <div class="proyecto-card">
                    <div class="proyecto-header">
                        <h3>${proj.nombre} - ${proj.desarrollador_nombre}</h3>
                        <span class="badge badge-${proj.estado === 'en progreso' ? 'progreso' : proj.estado}">${proj.estado}</span>
                    </div>
                    <p class="proyecto-info">Desarrollador: ${proj.desarrollador_nombre} | Inicio: ${proj.fecha_inicio}</p>
                    ${archivos.length > 0 ? `<p class="proyecto-info">Archivos de avance:</p>${archivos}` : '<p class="proyecto-info">Sin archivos aún</p>'}
                </div>
            `
        })
    })
    .catch(() => console.log('Error al cargar proyectos'))
}

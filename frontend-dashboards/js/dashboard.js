// ===== DASHBOARD.JS =====

document.addEventListener('DOMContentLoaded', function(){
    verificarSesionDashboard()
})

function verificarSesionDashboard(){
    fetch('../backend-auth/auth/sesion.php', {
        credentials: 'include' // Asegura que se envíen las cookies de sesión
    })
    .then(res => res.json())
    .then(data => {
        if(!data.logueado){
            window.location = '../frontend-diseño/login.html'
            return
        }

        window.usuarioId     = data.id
        window.usuarioNombre = data.nombre
        window.usuarioTipo   = data.tipo

        // Muestra nombre en navbar
        const navNombre = document.getElementById('nav-nombre')
        if(navNombre) navNombre.textContent = '👤 ' + data.nombre

        document.getElementById('nombre-bienvenida').textContent = data.nombre

        // Muestra la vista según el tipo
        if(data.tipo === 'desarrollador'){
            document.getElementById('vista-desarrollador').style.display = 'block'
            cargarAnunciosDesarrollador()
            cargarSolicitudesDesarrollador()
            cargarProyectosDesarrollador()
        } else {
            document.getElementById('vista-cliente').style.display = 'block'
            cargarSolicitudesCliente()
            cargarProyectosCliente()
            cargarCalificacionesCliente()
        }
    })
    .catch(() => {
        window.location = '../frontend-diseño/login.html'
    })
}

// Ver detalles de solicitud
function verDetalles(cliente, descripcion){
    document.getElementById('detalle-cliente').textContent = cliente
    document.getElementById('detalle-descripcion').textContent = descripcion
    document.getElementById('modal-detalles').classList.add('activo')
}

function cerrarModalDetalles(){
    document.getElementById('modal-detalles').classList.remove('activo')
}

// Cargar solicitudes recibidas por el desarrollador
function cargarSolicitudesDesarrollador(){
    if(!window.usuarioId) return

    fetch(`../backend-servicios/solicitudes/ver-solicitudes.php?desarrollador_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-solicitudes-dev')
        if(!data.success || data.solicitudes.length === 0){
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
    .catch(() => console.log('Error al cargar solicitudes'))
}

function cargarProyectosDesarrollador(){
    if(!window.usuarioId) return

    fetch(`../backend-servicios/proyectos/ver-proyectos.php?desarrollador_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-proyectos-dev')

        if(!data.success || data.proyectos.length === 0){
            lista.innerHTML = '<p class="empty-state">No tienes proyectos activos aún</p>'
            return
        }

        lista.innerHTML = ''

        data.proyectos.forEach(proj => {
            lista.innerHTML += `
                <div class="proyecto-card">
                    <div class="proyecto-header">
                        <h3>${proj.nombre}</h3>
                        <span class="badge badge-progreso">${proj.estado}</span>
                    </div>

                    <p class="proyecto-info">Cliente: ${proj.cliente_nombre}</p>
                    <p>${proj.descripcion}</p>

                    ${proj.estado === 'terminado' ? `
                    <p class="badge badge-terminado">Proyecto terminado ✅</p>
                    ` : `
                        <div class="subir-archivo">
                            <input type="file" id="archivo-${proj.id}">
                            <button class="btn btn-azul" onclick="subirArchivo(${proj.id})">
                                Subir avance
                            </button>
                            <button class="btn btn-verde" onclick="finalizarProyecto(${proj.id})">
                                Finalizar proyecto
                            </button>
                        </div>
                    `}
                </div>
            `
        })
    })
    .catch(error => console.error(error))
}

// Cargar solicitudes enviadas por el cliente
function cargarSolicitudesCliente(){
    if(!window.usuarioId) return

    fetch(`../backend-servicios/solicitudes/ver-solicitudes.php?cliente_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-solicitudes-cliente')
        if(!data.success || data.solicitudes.length === 0){
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
    .catch(() => console.log('Error al cargar solicitudes cliente'))
}

// Cargar proyectos del cliente con archivos
function cargarProyectosCliente(){
    if(!window.usuarioId) return

    fetch(`../backend-servicios/proyectos/ver-proyectos.php?cliente_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-proyectos-cliente')
        if(!data.success || data.proyectos.length === 0){
            lista.innerHTML = '<p class="empty-state">No tienes proyectos activos aún 😊</p>'
            return
        }

        lista.innerHTML = ''
        data.proyectos.forEach(proj => {
            const archivos = proj.archivos.map(a => `
                <div class="archivo-item">
                    <span>📄 ${a.nombre} — ${a.fecha}</span>
                    <button class="btn btn-azul" onclick="window.location='../backend-servicios/archivos/descargar.php?archivo_id=${a.id}'">⬇ Descargar</button>
                </div>
            `).join('')

            lista.innerHTML += `
                <div class="proyecto-card">
                    <div class="proyecto-header">
                        <h3>${proj.nombre} - ${proj.desarrollador_nombre}</h3>
                        <span class="badge badge-${proj.estado === 'en progreso' ? 'progreso' : proj.estado}">${proj.estado}</span>
                    </div>
                    <p class="proyecto-info">Desarrollador: ${proj.desarrollador_nombre} | Inicio: ${proj.fecha_inicio}</p>
                    ${proj.archivos.length > 0 ? `<p class="proyecto-info">Archivos de avance:</p>${archivos}` : '<p class="proyecto-info">Sin archivos aún</p>'}
                </div>
            `
        })
    })
    .catch(() => console.log('Error al cargar proyectos'))
}
function finalizarProyecto(proyectoId){

    fetch('../backend-servicios/proyectos/finalizar-proyecto.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            proyecto_id: proyectoId
        })
    })
    .then(res => res.json())
    .then(data => {

        if(data.success){

            alert('Proyecto finalizado ✅')

            cargarProyectosDesarrollador()
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

        terminados.forEach(proj => {
            lista.innerHTML += `
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
        })
    })
}
function cerrarSesion(){

    fetch('../backend-auth/auth/cerrar_sesion.php', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {

        if(data.success){

            window.location =
            '../frontend-diseño/login.html'
        }
    })
    .catch(error => {
        console.error(error)
    })
}
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
        const lista =
        document.getElementById('lista-solicitudes-dev')

        if(!data.success || data.solicitudes.length === 0){
            lista.innerHTML =
            '<p class="empty-state">No tienes solicitudes pendientes 😊</p>'
            return
        }
        lista.innerHTML = ''
        paginar(
            data.solicitudes,
            'lista-solicitudes-dev',
            sol => {
                return `
                    <div class="solicitud-card" data-id="${sol.id}">
                        <div class="solicitud-info">
                            <h1>
                                ${sol.titulo}
                            </h1>
                            <h3>
                                <a href="perfil.html?id=${sol.cliente_id}" style="color:blue; text-decoration:none">
                                    ${sol.cliente_nombre}
                                </a>
                            </h3>
                            <p>
                                ${sol.descripcion}
                            </p>
                            <p style="margin-top:5px; font-size:0.8rem; color:#aaa">
                                ${sol.fecha}
                            </p>
                        </div>
                        <div class="solicitud-botones">
                            ${
                                sol.estado === 'pendiente'
                                ? `
                                    <button
                                    class="btn btn-azul"
                                    onclick="verDetalles('${sol.cliente_nombre}', '${sol.descripcion}')">

                                        Ver más

                                    </button>
                                    <button
                                    class="btn btn-verde"
                                    onclick="responderSolicitud(this, 'aceptada', ${sol.id})">

                                        Aceptar ✅

                                    </button>
                                    <button
                                    class="btn btn-rojo"
                                    onclick="responderSolicitud(this, 'rechazada', ${sol.id})">
                                        Rechazar ❌
                                    </button>
                                  `
                                : `
                                    <span class="badge badge-${sol.estado}">
                                        ${sol.estado}
                                        ${
                                            sol.estado === 'aceptada'
                                            ? '✅'
                                            : '❌'
                                        }
                                    </span>
                                  `
                            }
                        </div>
                    </div>
                `
            }
        )
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
        paginar(
            data.proyectos,
            'lista-proyectos-dev',
            proj => {
                const archivos = proj.archivos.map(a => `
                    <div class="archivo-item">
                        <span>📄 ${a.nombre} — ${a.fecha}</span>

                        ${
                            a.estado === 'aprobado'
                            ? `<span class="badge badge-aceptada">Aprobado ✅</span>`
                            : a.estado === 'rechazado'
                            ? `
                                <span class="badge badge-rechazada">Rechazado ❌</span>
                                <p>Razón: ${a.razon_rechazo || 'Sin razón escrita'}</p>
                            `
                            : `<span class="badge badge-pendiente">Pendiente 🟡</span>`
                        }
                    </div>
                `).join('')
                return `
                <div class="proyecto-card">
                    <div class="proyecto-header">
                        <h3>${proj.nombre}</h3>
                        <span class="badge badge-${proj.estado === 'en progreso' ? 'progreso' : proj.estado}">
                            ${proj.estado}
                        </span>
                    </div>
                    <p class="proyecto-info">
                        Cliente: ${proj.cliente_nombre}
                    </p>
                    <p>${proj.descripcion}</p>
                    ${
                        proj.archivos.length > 0
                        ? `<p class="proyecto-info">Archivos subidos:</p>${archivos}`
                        : `<p class="proyecto-info">Aún no has subido archivos</p>`
                    }
                    ${
                        proj.estado === 'terminado'
                        ? `
                            <p class="badge badge-terminado">
                                Proyecto terminado ✅
                            </p>
                          `
                        : `
                        <div class="subir-archivo">
                            <input type="file" id="archivo-${proj.id}">

                            <button
                            class="btn btn-azul"
                            onclick="subirArchivo(${proj.id})">
                                Subir avance
                            </button>

                            <button
                            class="btn btn-verde"
                            onclick="finalizarProyecto(${proj.id})">
                                Finalizar proyecto
                            </button>
                        </div>
                          `
                    }
                </div>
                `
            }
        )
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
        paginar(
            data.solicitudes,
            'lista-solicitudes-cliente',
            sol => {
                return `
                <div class="solicitud-card">
                    <div class="solicitud-info">
                        <h3>
                            Solicitud a ${sol.desarrollador_nombre}
                        </h3>
                        <p>${sol.descripcion}</p>
                    </div>
                    <span class="badge badge-${sol.estado}">
                        ${
                            sol.estado === 'pendiente'
                            ? 'Pendiente 🟡'
                            : sol.estado === 'aceptada'
                            ? 'Aceptada ✅'
                            : 'Rechazada ❌'
                        }
                    </span>
                </div>
                `
            }
        )
    })
    .catch(() => console.log('Error al cargar solicitudes cliente'))
}

// Cargar proyectos del cliente con archivos
function cargarProyectosCliente(){
    if(!window.usuarioId) return
    fetch(`../backend-servicios/proyectos/ver-proyectos.php?cliente_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista =
        document.getElementById('lista-proyectos-cliente')
        if(!data.success || data.proyectos.length === 0){
            lista.innerHTML =
            '<p class="empty-state">No tienes proyectos activos aún 😊</p>'
            return
        }
        lista.innerHTML = ''
        paginar(
            data.proyectos,
            'lista-proyectos-cliente',
            proj => {
                const archivos = proj.archivos.map(a => `
                    <div class="archivo-item">
                    <span>
                        📄 ${a.nombre}
                        —
                        ${a.fecha}
                    </span>
                    <button
                    class="btn btn-azul"
                    onclick="window.location='../backend-servicios/archivos/descargar.php?archivo_id=${a.id}'">
                        ⬇ Descargar
                    </button>
                    ${
                        a.estado === 'pendiente' && proj.estado !== 'terminado'
                        ? `
                            <button
                            class="btn btn-verde"
                            onclick="responderAvance(${a.id}, 'aprobado')">
                                Aprobar ✅
                            </button>
                            <button
                            class="btn btn-rojo"
                            onclick="responderAvance(${a.id}, 'rechazado')">
                                Rechazar ❌
                            </button>
                        `
                        : a.estado === 'aprobado'
                        ? `
                            <span class="badge badge-aceptada">
                                Aprobado ✅
                            </span>
                        `
                        : a.estado === 'rechazado'
                        ? `
                            <span class="badge badge-rechazada">
                                Rechazado ❌
                            </span>
                            <p>Razón: ${a.razon_rechazo || 'Sin razón escrita'}</p>
                        `
                        : `
                            <span class="badge badge-pendiente">
                                Pendiente 🟡
                            </span>
                        `
                    }
                </div>
                `).join('')
                return `
                    <div class="proyecto-card">
                        <div class="proyecto-header">
                            <h3>
                                ${proj.nombre}
                                -
                                ${proj.desarrollador_nombre}
                            </h3>
                            <span class="badge badge-${proj.estado === 'en progreso' ? 'progreso' : proj.estado}">
                                ${proj.estado}
                            </span>
                        </div>

                        <p class="proyecto-info">
                            Desarrollador:
                            ${proj.desarrollador_nombre}
                            |
                            Inicio:
                            ${proj.fecha_inicio}
                        </p>
                        ${
                            proj.archivos.length > 0
                            ? `
                                <p class="proyecto-info">
                                    Archivos de avance:
                                </p>
                                ${archivos}
                              `
                            : `
                                <p class="proyecto-info">
                                    Sin archivos aún
                                </p>
                              `
                        }
                    </div>
                `
            }
        )
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
function paginar(listaDatos, contenedorId, renderItem, porPagina = 4){

    let paginaActual = 1

    const totalPaginas =
    Math.ceil(listaDatos.length / porPagina)

    const contenedor =
    document.getElementById(contenedorId)

    function mostrarPagina(){

        const inicio =
        (paginaActual - 1) * porPagina

        const fin = inicio + porPagina

        const datosPagina =
        listaDatos.slice(inicio, fin)

        contenedor.innerHTML = ''

        datosPagina.forEach(item => {
            contenedor.innerHTML += renderItem(item)
        })

        contenedor.innerHTML += `
            <div class="paginacion">

                <button
                class="btn btn-gris"
                ${paginaActual === 1 ? 'disabled' : ''}
                onclick="cambiarPagina('${contenedorId}', -1)">
                    Anterior
                </button>

                <span>
                    Página ${paginaActual}
                    de ${totalPaginas}
                </span>

                <button
                class="btn btn-gris"
                ${paginaActual === totalPaginas ? 'disabled' : ''}
                onclick="cambiarPagina('${contenedorId}', 1)">
                    Siguiente
                </button>

            </div>
        `
    }

    window[`pagina_${contenedorId}`] = {
        paginaActual,
        totalPaginas,
        mostrarPagina,
        listaDatos,
        renderItem,
        porPagina
    }

    mostrarPagina()
}

function cambiarPagina(contenedorId, cambio){

    const pag =
    window[`pagina_${contenedorId}`]

    pag.paginaActual += cambio

    if(pag.paginaActual < 1){
        pag.paginaActual = 1
    }

    if(pag.paginaActual > pag.totalPaginas){
        pag.paginaActual = pag.totalPaginas
    }

    const inicio =
    (pag.paginaActual - 1) * pag.porPagina

    const fin = inicio + pag.porPagina

    const datosPagina =
    pag.listaDatos.slice(inicio, fin)

    const contenedor =
    document.getElementById(contenedorId)

    contenedor.innerHTML = ''

    datosPagina.forEach(item => {
        contenedor.innerHTML += pag.renderItem(item)
    })

    contenedor.innerHTML += `
        <div class="paginacion">

            <button
            class="btn btn-gris"
            ${pag.paginaActual === 1 ? 'disabled' : ''}
            onclick="cambiarPagina('${contenedorId}', -1)">
                Anterior
            </button>

            <span>
                Página ${pag.paginaActual}
                de ${pag.totalPaginas}
            </span>

            <button
            class="btn btn-gris"
            ${pag.paginaActual === pag.totalPaginas ? 'disabled' : ''}
            onclick="cambiarPagina('${contenedorId}', 1)">
                Siguiente
            </button>

        </div>
    `
}
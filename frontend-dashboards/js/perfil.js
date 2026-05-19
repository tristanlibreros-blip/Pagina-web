// ===== PERFIL.JS =====

const lenguajesDisponibles = [
    'PHP', 'JavaScript', 'Python', 'Java', 'C#', 'TypeScript',
    'React', 'Vue', 'Angular', 'Node.js', 'Laravel', 'MySQL',
    'MongoDB', 'CSS', 'HTML', 'Swift', 'Kotlin', 'Flutter'
]

let lenguajesSeleccionados = []
let certificaciones = []
let usuarioTipo = null
let usuarioSesionId = null
let usuarioId = null
let esMiPerfil = false
let reviews = []
let reviewActual = 0
// ===== AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function(){
    cargarPerfil()
})

function cargarPerfil(){
    fetch('../backend-auth/auth/sesion.php', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if(!data.logueado){
            window.location = '../frontend-diseño/login.html'
            return
        }

         const params = new URLSearchParams(window.location.search)

        usuarioId = params.get('id') || data.id
        usuarioTipo = data.tipo
        usuarioSesionId = data.id
        esMiPerfil = usuarioId == usuarioSesionId

        // Actualizar navbar
        const navNombre = document.getElementById('nav-nombre')
        if(navNombre) navNombre.textContent = '👤 ' + data.nombre

        // Cargar datos del perfil
        fetch(`../backend-auth/auth/perfil.php?usuario_id=${usuarioId}`)
        .then(res => res.json())
        .then(perfil => {
            if(!perfil.success) return
            mostrarPerfil(perfil.perfil)
        })
    })
    .catch(() => window.location = '../frontend-diseño/login.html')
}

function mostrarPerfil(perfil){
    // Datos básicos
    document.getElementById('campo-nombre').value    = perfil.nombre || ''
    document.getElementById('campo-usuario').value   = perfil.usuario || ''
    document.getElementById('campo-email').value     = perfil.email || ''
    document.getElementById('campo-telefono').value  = perfil.telefono || ''
    document.getElementById('perfil-nombre-titulo').textContent = perfil.nombre
    document.getElementById('perfil-usuario').textContent = '@' + perfil.usuario

    // Foto de perfil
    if(perfil.tiene_foto){
        document.getElementById('foto-placeholder').style.display = 'none'
        const fotoImg = document.getElementById('foto-img')
        fotoImg.src = `../backend-auth/auth/foto.php?usuario_id=${usuarioId}`
        fotoImg.style.display = 'block'
    }

    // Badge de tipo
    const badge = document.getElementById('perfil-badge')
    if(perfil.tipo === 'desarrollador'){
        badge.textContent = '👨‍💻 Desarrollador'
        badge.className = 'badge-tipo badge-desarrollador'
        mostrarSeccionesDesarrollador(perfil)
    } else {
        badge.textContent = '👤 Cliente'
        badge.className = 'badge-tipo badge-cliente'
        mostrarSeccionesCliente(perfil)
    }
    if(!esMiPerfil){
    bloquearEdicionPerfil()
    document.getElementById('github-input').style.display = 'none'
    }
    if(perfil.github){
    document.getElementById('github-preview').innerHTML = `
        <a
        href="${perfil.github}"
        target="_blank"
        class="github-btn">

            <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            width="24">

            GitHub

        </a>
    `
}
}

function bloquearEdicionPerfil(){
    document.querySelectorAll('input, textarea, select').forEach(campo => {
        campo.disabled = true
    })

    document.querySelectorAll(
        '.perfil-actions, .btn-foto, .btn-cambiar-banner, .btn-add-cert, .link-ver-todos'
    ).forEach(el => {
        el.style.display = 'none'
    })
}

// ===== SECCIONES DESARROLLADOR =====
function mostrarSeccionesDesarrollador(perfil){
    // Mostrar banner
    document.getElementById('banner-container').style.display = 'block'
    if(perfil.tiene_banner){
        const bannerImg = document.getElementById('banner-img')
        bannerImg.src = `../backend-auth/auth/portada.php?usuario_id=${usuarioId}`
        bannerImg.style.display = 'block'
    }

    // Mostrar stats
    document.getElementById('card-stats').style.display = 'block'
    document.getElementById('perfil-stats-dev').style.display = 'block'
    document.getElementById('card-profesional').style.display = 'block'
    document.getElementById('card-certificaciones').style.display = 'block'

    // Cargar stats
    fetch(`../backend-servicios/calificaciones/ver-calificaciones.php?desarrollador_id=${usuarioId}`)
    .then(res => res.json())
    .then(data => {
        if(data.success){
            document.getElementById('stat-califs').textContent   = data.total
            document.getElementById('stat-promedio').textContent = data.promedio
            document.getElementById('promedio-num').textContent  = data.promedio
            document.getElementById('total-califs').textContent  = `(${data.total} reseñas)`
            // Estrellas visuales
            const stars = '⭐'.repeat(Math.round(data.promedio)) + '☆'.repeat(5 - Math.round(data.promedio))
            document.getElementById('stars-promedio').textContent = stars
            reviews = data.calificaciones || []
            reviewActual = 0
            mostrarReview()
        }
    })
    // Cargar proyectos completados
    fetch(`../backend-servicios/proyectos/ver-proyectos.php?desarrollador_id=${usuarioId}&estado=terminado`)
    .then(res => res.json())
    .then(data => {
        if(data.success){
            document.getElementById('stat-proyectos').textContent = data.proyectos.length
        }
    })

    // Datos profesionales
    if(perfil.especialidad){
        document.getElementById('campo-especialidad').value = perfil.especialidad
    }
    if(perfil.experiencia){
        document.getElementById('campo-experiencia').value = perfil.experiencia
    }
    if(perfil.descripcion){
        document.getElementById('campo-descripcion').value = perfil.descripcion
    }

    // Lenguajes
    lenguajesSeleccionados = perfil.lenguajes || []
    generarChipsLenguajes()

    // Certificaciones
    certificaciones = perfil.certificaciones || []
    renderCertificaciones()
}

// ===== SECCIONES CLIENTE =====
function mostrarSeccionesCliente(perfil){
    document.getElementById('card-proyectos-cliente').style.display = 'block'
    document.getElementById('card-cliente-desc').style.display = 'block'

    if(perfil.descripcion){
        document.getElementById('campo-desc-cliente').value = perfil.descripcion
    }

    // Cargar proyectos recientes
    fetch(`../backend-servicios/proyectos/ver-proyectos.php?cliente_id=${usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-proyectos-recientes')
        if(!data.success || data.proyectos.length === 0){
            lista.innerHTML = '<p style="color:var(--color-texto-suave); text-align:center; padding:15px">Sin proyectos aún 😊</p>'
            return
        }
        lista.innerHTML = data.proyectos.slice(0, 5).map(p => `
            <div class="proyecto-item">
                <div>
                    <strong>${p.nombre}</strong>
                    <p style="font-size:0.85rem; color:var(--color-texto-suave)">${p.desarrollador_nombre}</p>
                </div>
                <span class="badge badge-${p.estado === 'en progreso' ? 'progreso' : p.estado === 'terminado' ? 'terminado' : 'cancelado'}">
                    ${p.estado}
                </span>
                <span class="badge badge-${p.estado === 'cancelado' ? 'cancelado' : 'progreso'}">
                    ${p.estado === 'cancelado' ? (p.razon_cancelacion ? 'Razón: ' + p.razon_cancelacion : 'Proyecto cancelado ❌') : ''}
                </span>
            </div>
        `).join('')
    })
}

// ===== LENGUAJES CHIPS =====
function generarChipsLenguajes(){
    const grid = document.getElementById('lenguajes-grid')
    grid.innerHTML = ''
    lenguajesDisponibles.forEach(lang => {
        const chip = document.createElement('span')
        chip.className =
        'lang-chip' + (lenguajesSeleccionados.includes(lang) ? ' activo' : '')
        chip.textContent = lang
        if(esMiPerfil){
            chip.onclick = () => toggleLenguaje(chip, lang)
        } else {
            chip.style.cursor = 'default'
        }
        grid.appendChild(chip)
    })
}

function toggleLenguaje(chip, lang){
    if(lenguajesSeleccionados.includes(lang)){
        lenguajesSeleccionados = lenguajesSeleccionados.filter(l => l !== lang)
        chip.classList.remove('activo')
    } else {
        lenguajesSeleccionados.push(lang)
        chip.classList.add('activo')
    }
}

// ===== CERTIFICACIONES =====
function renderCertificaciones(){
    const lista = document.getElementById('lista-certificaciones')
    if(certificaciones.length === 0){
        lista.innerHTML = '<p style="color:var(--color-texto-suave); font-size:0.9rem; margin-bottom:10px">Sin certificaciones aún</p>'
        return
    }
    lista.innerHTML = certificaciones.map((cert, i) => `
        <div class="cert-item">
            <div class="cert-info">
                <h4>🎓 ${cert.nombre}</h4>
                <p>${cert.institucion} — ${cert.año}</p>
            </div>
            <button class="btn btn-rojo" style="padding:5px 12px; font-size:0.8rem" onclick="eliminarCert(${i})">✕</button>
        </div>
    `).join('')
}

function abrirModalCert(){
    document.getElementById('modal-cert').classList.add('activo')
}

function cerrarModalCert(){
    document.getElementById('modal-cert').classList.remove('activo')
    document.getElementById('cert-nombre').value = ''
    document.getElementById('cert-institucion').value = ''
    document.getElementById('cert-año').value = ''
}

function agregarCert(){
    const nombre = document.getElementById('cert-nombre').value.trim()
    const institucion = document.getElementById('cert-institucion').value.trim()
    const año = document.getElementById('cert-año').value

    if(!nombre || !institucion || !año){
        alert('Por favor llena todos los campos')
        return
    }

    certificaciones.push({ nombre, institucion, año })
    renderCertificaciones()
    cerrarModalCert()
    guardarPerfil(true) // Guarda automáticamente
}

function eliminarCert(index){
    if(!confirm('¿Eliminar esta certificación?')) return
    certificaciones.splice(index, 1)
    renderCertificaciones()
    guardarPerfil(true)
}

// ===== GUARDAR DATOS BÁSICOS =====
function guardarDatos(){
    const nombre   = document.getElementById('campo-nombre').value.trim()
    const telefono = document.getElementById('campo-telefono').value.trim()

    if(!nombre){
        alert('El nombre no puede estar vacío')
        return
    }

    const formData = new FormData()
    formData.append('usuario_id', usuarioId)
    formData.append('nombre', nombre)
    formData.append('telefono', telefono)
    formData.append('tipo', usuarioTipo)

    fetch('/Pagina web/backend-auth/auth/perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert('✅ Datos guardados correctamente')
            document.getElementById('perfil-nombre-titulo').textContent = nombre
        } else {
            alert(data.mensaje || 'Error al guardar')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// ===== GUARDAR PERFIL DESARROLLADOR =====
function guardarPerfil(silencioso = false){
    const especialidad = document.getElementById('campo-especialidad').value
    const experiencia  = document.getElementById('campo-experiencia').value
    const descripcion  = document.getElementById('campo-descripcion').value

    const formData = new FormData()
    formData.append('usuario_id', usuarioId)
    formData.append('tipo', 'desarrollador')
    formData.append('nombre', document.getElementById('campo-nombre').value)
    formData.append('telefono', document.getElementById('campo-telefono').value)
    formData.append('especialidad', especialidad)
    formData.append('experiencia', experiencia)
    formData.append('descripcion', descripcion)
    formData.append('lenguajes', JSON.stringify(lenguajesSeleccionados))
    formData.append('certificaciones', JSON.stringify(certificaciones))
    formData.append('github', document.getElementById('github-input').value)

    fetch('../backend-auth/auth/perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success && !silencioso){
            alert('✅ Perfil guardado correctamente')
        } else if(!data.success){
            alert(data.mensaje || 'Error al guardar')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// ===== GUARDAR DESCRIPCIÓN CLIENTE =====
function guardarDescCliente(){
    const descripcion = document.getElementById('campo-desc-cliente').value

    const formData = new FormData()
    formData.append('usuario_id', usuarioId)
    formData.append('tipo', 'cliente')
    formData.append('nombre', document.getElementById('campo-nombre').value)
    formData.append('telefono', document.getElementById('campo-telefono').value)
    formData.append('descripcion', descripcion)

    fetch('../backend-auth/auth/perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) alert('✅ Guardado correctamente')
        else alert(data.mensaje || 'Error al guardar')
    })
    .catch(() => alert('Error de conexión'))
}

// ===== SUBIR FOTO DE PERFIL =====
function subirFoto(input){
    const archivo = input.files[0]
    if(!archivo) return

    const formData = new FormData()
    formData.append('usuario_id', usuarioId)
    formData.append('tipo', usuarioTipo)
    formData.append('foto_perfil', archivo)

    fetch('../backend-auth/auth/perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            // Mostrar la nueva foto
            const reader = new FileReader()
            reader.onload = e => {
                document.getElementById('foto-placeholder').style.display = 'none'
                const fotoImg = document.getElementById('foto-img')
                fotoImg.src = e.target.result
                fotoImg.style.display = 'block'
            }
            reader.readAsDataURL(archivo)
            alert('✅ Foto actualizada')
        } else {
            alert(data.mensaje || 'Error al subir foto')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// ===== SUBIR BANNER (solo desarrollador) =====
function subirBanner(input){
    const archivo = input.files[0]
    if(!archivo) return

    const formData = new FormData()
    formData.append('usuario_id', usuarioId)
    formData.append('tipo', 'desarrollador')
    formData.append('nombre', document.getElementById('campo-nombre').value)
    formData.append('banner', archivo)

    fetch('../backend-auth/auth/perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            const reader = new FileReader()
            reader.onload = e => {
                const bannerImg = document.getElementById('banner-img')
                bannerImg.src = e.target.result
                bannerImg.style.display = 'block'
            }
            reader.readAsDataURL(archivo)
            alert('✅ Banner actualizado')
        } else {
            alert(data.mensaje || 'Error al subir banner')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// ===== CERRAR SESIÓN =====
function cerrarSesion(){
    fetch('../backend-auth/auth/cerrar_sesion.php', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if(data.success) window.location = '../frontend-diseño/index.html'
    })
}
function mostrarReview(){
    const contenedor = document.getElementById('review-card')
    if(!contenedor) return

    if(reviews.length === 0){
        contenedor.innerHTML = '<p style="color:#777">Aún no tienes comentarios</p>'
        return
    }

    const r = reviews[reviewActual]

    contenedor.innerHTML = `
        <div class="review-item">
            <h1>${r.proyecto_nombre}</h1>
            <p style="font-size:1.3rem">${'⭐'.repeat(r.estrellas)}</p>
            <p>"${r.comentario}"</p>
            <p><strong>${r.cliente_nombre}</strong></p>
            <p style="font-size:0.8rem; color:#777">${r.fecha}</p>
        </div>
    `
}

function cambiarReview(cambio){
    if(reviews.length === 0) return

    reviewActual += cambio

    if(reviewActual < 0){
        reviewActual = reviews.length - 1
    }

    if(reviewActual >= reviews.length){
        reviewActual = 0
    }

    mostrarReview()
}
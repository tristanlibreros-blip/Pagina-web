// ===== ANUNCIOS.JS =====

const lenguajesDisponibles = ['PHP', 'JavaScript', 'Python', 'Java', 'C#', 'TypeScript',
    'React', 'Vue', 'Angular', 'Node.js', 'Laravel', 'MySQL', 'MongoDB', 'CSS', 'HTML']

let lenguajesSeleccionados = []
let anunciosGlobal = []
let anuncioEditando = null

// Genera los botones de lenguajes en el modal
function generarBotonesLenguajes(){
    const container = document.getElementById('lenguajes-container')
    if(!container) return
    container.innerHTML = ''
    lenguajesDisponibles.forEach(lang => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.textContent = lang
        btn.className = 'btn-lang'
        btn.style.cssText = `padding:5px 12px; border:1px solid var(--color-borde); 
            border-radius:20px; cursor:pointer; font-size:0.85rem; background:white; transition:0.2s`
        btn.onclick = () => toggleLenguaje(btn, lang)
        container.appendChild(btn)
    })
}

function toggleLenguaje(btn, lang){
    if(lenguajesSeleccionados.includes(lang)){
        lenguajesSeleccionados = lenguajesSeleccionados.filter(l => l !== lang)
        btn.style.background = 'white'
        btn.style.borderColor = 'var(--color-borde)'
        btn.style.color = 'black'
    } else {
        lenguajesSeleccionados.push(lang)
        btn.style.background = 'blue'
        btn.style.borderColor = 'blue'
        btn.style.color = 'white'
    }
}

// Abrir modal de anuncio
function abrirModalAnuncio(){
    lenguajesSeleccionados = []
    generarBotonesLenguajes()
    document.getElementById('modal-anuncio').classList.add('activo')
}

function cerrarModalAnuncio(){
    document.getElementById('modal-anuncio').classList.remove('activo')
    anuncioEditando = null
}

// Guardar anuncio
function guardarAnuncio(){
    const titulo      = document.getElementById('anuncio-titulo').value
    const descripcion = document.getElementById('anuncio-descripcion').value
    const especialidad = document.getElementById('anuncio-especialidad').value
    const precio      = document.getElementById('anuncio-precio').value
    const bannerFile  = document.getElementById('anuncio-banner').files[0]

    if(!titulo || !especialidad || !precio){
        alert('Por favor llena todos los campos requeridos')
        return
    }

    const formData = new FormData()
    formData.append('desarrollador_id', window.usuarioId)
    formData.append('titulo', titulo)
    formData.append('descripcion', descripcion)
    formData.append('especialidad', especialidad)
    formData.append('lenguajes', JSON.stringify(lenguajesSeleccionados))
    formData.append('precio', precio)
    if(bannerFile) formData.append('banner', bannerFile)
    
    if(anuncioEditando){
    formData.append('anuncio_id', anuncioEditando)
    }

    fetch(
        anuncioEditando
        ? '../backend-auth/anuncios/editar-anuncio.php'
        : '../backend-auth/anuncios/crear-anuncio.php',
    {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert('✅ Anuncio publicado correctamente')
            cerrarModalAnuncio()
            cargarAnunciosDesarrollador() // Recarga la lista
        } else {
            alert(data.mensaje || 'Error al crear el anuncio')
        }
    })
    .catch(() => alert('Error de conexión'))
}

// Cargar anuncios del desarrollador
function cargarAnunciosDesarrollador(){
    if(!window.usuarioId) return

    fetch(`../backend-auth/anuncios/ver-anuncios.php?desarrollador_id=${window.usuarioId}`)
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-anuncios-dev')
        if(!lista) return

        if(!data.success || data.anuncios.length === 0){
            lista.innerHTML = '<p class="empty-state">No tienes anuncios publicados aún 😊</p>'
            return
        }

        lista.innerHTML = ''
        anunciosGlobal = data.anuncios
        data.anuncios.forEach(anuncio => {
            lista.innerHTML += `
                <div class="solicitud-card">
                <div class="solicitud-info">
                <img 
                    src="../backend-auth/anuncios/imagen.php?anuncio_id=${anuncio.id}" 
                    style="display:block; width:100%; height:120px; object-fit:cover; border:3px solid red; border-radius:10px; margin-bottom:10px"
                >
                    <h3>${anuncio.titulo}</h3>
                    <p>${anuncio.especialidad} | Desde $${anuncio.precio}</p>
                    <p style="margin-top:4px; font-size:0.85rem; color:#888">
                        ${Array.isArray(anuncio.lenguajes) ? anuncio.lenguajes.join(', ') : ''}
                    </p>
                </div>
                <div class="solicitud-botones">
                    <button class="btn btn-azul" onclick="editarAnuncio(${anuncio.id})">✏️ Editar</button>
                    <button class="btn btn-rojo" onclick="eliminarAnuncio(${anuncio.id})">🗑 Eliminar</button>
                </div>
            </div>
            `
        })
    })
    .catch(() => console.log('Error al cargar anuncios'))
}
function editarAnuncio(id){

    const anuncio = anunciosGlobal.find(a => a.id == id)

    if(!anuncio) return

    anuncioEditando = anuncio.id

    document.getElementById('anuncio-titulo').value =
    anuncio.titulo

    document.getElementById('anuncio-descripcion').value =
    anuncio.descripcion

    document.getElementById('anuncio-especialidad').value =
    anuncio.especialidad

    document.getElementById('anuncio-precio').value =
    anuncio.precio

    lenguajesSeleccionados =
    anuncio.lenguajes || []

    generarBotonesLenguajes()

    document.getElementById('modal-anuncio')
    .classList.add('activo')
}
// Eliminar anuncio
function eliminarAnuncio(id){
    if(!confirm('¿Seguro que quieres eliminar este anuncio?')) return

    fetch('../backend-auth/anuncios/eliminar-anuncio.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anuncio_id: id, desarrollador_id: window.usuarioId })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert('🗑 Anuncio eliminado')
            cargarAnunciosDesarrollador()
        } else {
            alert(data.mensaje || 'Error al eliminar')
        }
    })
    .catch(() => alert('Error de conexión'))
}

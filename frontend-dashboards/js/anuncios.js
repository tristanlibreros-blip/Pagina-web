// ===== ANUNCIOS.JS =====
// Para que el desarrollador pueda crear y gestionar sus anuncios
// (Se conectará al backend cuando esté listo)

// TEMPORAL - datos de prueba
const misAnuncios = [
    { id: 1, titulo: "Desarrollo Web Profesional", especialidad: "Web", precio: 500, descripcion: "Hago páginas web modernas y responsivas" }
]

// Esta función se usará cuando el Compañero 2 implemente el formulario de anuncios
function crearAnuncio(titulo, especialidad, precio, descripcion) {
    // TEMPORAL
    alert(`✅ Anuncio "${titulo}" creado`)

    // Cuando el backend esté listo:
    // fetch('../../backend/anuncios/crear-anuncio.php', {
    //    method: 'POST',
    //    body: JSON.stringify({ titulo, especialidad, precio, descripcion })
    // })
}

function eliminarAnuncio(id) {
    if (confirm('¿Seguro que quieres eliminar este anuncio?')) {
        alert('🗑 Anuncio eliminado')
        // Cuando el backend esté listo:
        // fetch('../../backend/anuncios/eliminar-anuncio.php', {
        //    method: 'POST',
        //    body: JSON.stringify({ id })
        // })
    }
}

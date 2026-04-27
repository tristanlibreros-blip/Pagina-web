// ===== DASHBOARD.JS =====
// Maneja las pestañas y funciones generales

// Cambiar entre pestañas
function cambiarPestana(pestana, boton) {
    // Desactiva todas las pestañas
    document.querySelectorAll('.contenido-pestana').forEach(p => p.classList.remove('activo'))
    document.querySelectorAll('.pestana').forEach(b => b.classList.remove('activa'))

    // Activa la seleccionada
    document.getElementById('pestana-' + pestana).classList.add('activo')
    boton.classList.add('activa')
}

// Cerrar sesión
function cerrarSesion() {
    // TEMPORAL - cuando el backend esté listo usar fetch a cerrar-sesion.php
    alert('Sesión cerrada')
    window.location = '../frontend-diseño/index.html'
}

// Ver detalles de solicitud
function verDetalles(cliente, descripcion) {
    document.getElementById('detalle-cliente').textContent = cliente
    document.getElementById('detalle-descripcion').textContent = descripcion
    document.getElementById('modal-detalles').classList.add('activo')
}

// Cerrar modal detalles
function cerrarModalDetalles() {
    document.getElementById('modal-detalles').classList.remove('activo')
}

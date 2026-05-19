document.addEventListener('DOMContentLoaded', () => {
    cargarNavbar()
})

function cargarNavbar(){
    fetch('../backend-auth/auth/sesion.php', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const navLogin = document.getElementById('nav-login')
        const navRegistro = document.getElementById('nav-registro')
        const navPerfil = document.getElementById('nav-perfil')
        const navDashboard = document.getElementById('nav-dashboard')
        const navCerrar = document.getElementById('nav-cerrar')
        const nombre = document.getElementById('nav-nombre')

        if(data.logueado){
            if(navLogin) navLogin.style.display = 'none'
            if(navRegistro) navRegistro.style.display = 'none'

            if(navPerfil) navPerfil.style.display = 'inline-block'
            if(navDashboard) navDashboard.style.display = 'inline-block'
            if(navCerrar) navCerrar.style.display = 'inline-block'

            if(nombre){
                nombre.textContent = `👤 ${data.nombre}`
            }
        } else {
            if(navLogin) navLogin.style.display = 'inline-block'
            if(navRegistro) navRegistro.style.display = 'inline-block'

            if(navPerfil) navPerfil.style.display = 'none'
            if(navDashboard) navDashboard.style.display = 'none'
            if(navCerrar) navCerrar.style.display = 'none'
        }
    })
}

function cerrarSesion(){
    fetch('../backend-auth/auth/cerrar_sesion.php', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            window.location = '../frontend-diseño/index.html'
        }
    })
}
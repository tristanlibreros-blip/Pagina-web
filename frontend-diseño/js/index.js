document.addEventListener('DOMContentLoaded', () => {
   cargarDesarrolladoresCarrusel()
   cargarAnunciosIndex()
})

function cargarDesarrolladoresCarrusel(){
   fetch('../backend-auth/auth/ver-desarrolladores.php')
   .then(res => res.json())
   .then(data => {
      const lista = document.querySelector('.swiper-wrapper')
      lista.innerHTML = ''

      if(!data.success || data.desarrolladores.length === 0){
         lista.innerHTML = '<p>No hay desarrolladores disponibles</p>'
         return
      }

      data.desarrolladores.forEach(dev => {
         lista.innerHTML += `
            <div class="items swiper-slide">
               <img 
                  src="${dev.tiene_foto == 1 
                     ? `../backend-auth/auth/foto.php?usuario_id=${dev.id}` 
                     : 'gato.jpg'}" 
                  alt="${dev.nombre}" 
                  class="usuario-img"
               >

               <h2 class="usuario-name">
                  <a
                  href="../frontend-dashboards/perfil.html?id=${dev.id}"
                  style="color:white; text-decoration:none">
                     ${dev.nombre || dev.usuario}
                  </a>
               </h2>

               <p class="usuario-profesion">
                  ${dev.especialidad || 'Desarrollador'}
               </p>

               <p class="usuario-estrellas">
                  ⭐ ${dev.promedio} (${dev.total_calificaciones})
               </p>

               <button
               class="btn-mensaje"
               onclick="abrirModalSolicitud(null, ${dev.id}, '${dev.nombre}')">
                  Enviar solicitud
               </button>
            </div>
         `
      })

      iniciarSwiper()
   })
}

function iniciarSwiper(){
   new Swiper('.slider-wrapper', {
      loop: true,
      grabCursor: true,
      spaceBetween: 30,
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
         dynamicBullets: true,
      },
      navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
      },
      breakpoints: {
         0: { slidesPerView: 1 },
         620: { slidesPerView: 2 },
         1024: { slidesPerView: 3 }
      }
   })
}

function cargarAnunciosIndex(){
   fetch('../backend-auth/anuncios/ver-anuncios.php?top=20')
   .then(res => res.json())
   .then(data => {
      const lista = document.getElementById('lista-anuncios-index')

      if(!data.success || data.anuncios.length === 0){
         lista.innerHTML = '<p>No hay anuncios disponibles</p>'
         return
      }

      lista.innerHTML = ''

      data.anuncios.forEach(anuncio => {
         lista.innerHTML += `
         <div class="anuncio-index-card anuncio-horizontal">
            <div class="anuncio-info">
               <h2>${anuncio.titulo}</h2>
               <p>${anuncio.descripcion}</p>
               <p>
                  <strong>${anuncio.especialidad}</strong>
               </p>
               <p>
                  Desde $${anuncio.precio}
               </p>
               <p>
                  ${
                     Array.isArray(anuncio.lenguajes)
                     ? anuncio.lenguajes.join(', ')
                     : ''
                  }
               </p>
               <p>
                  👨‍💻
                  <a
                  href="../frontend-dashboards/perfil.html?id=${anuncio.desarrollador_id}"
                  style="color:blue; text-decoration:none">
                     ${anuncio.dev_nombre}
                  </a>
               </p>
               <button
               class="btn btn-azul"
               onclick="abrirModalSolicitud(${anuncio.id}, ${anuncio.desarrollador_id}, '${anuncio.dev_nombre}')">
                  Enviar solicitud
               </button>
            </div>
            <img
               src="../backend-auth/anuncios/imagen.php?anuncio_id=${anuncio.id}"
               class="anuncio-img"
            >
         </div>
      `
      })
   })
   .catch(error => {
      console.error(error)
   })
}
let anuncioSeleccionado = null
let desarrolladorIdSeleccionado = null

function abrirModalSolicitud(anuncioId, desarrolladorId, nombreDev){
   anuncioSeleccionado = anuncioId
   desarrolladorIdSeleccionado = desarrolladorId

   document.getElementById('nombre-dev').textContent = nombreDev
   document.getElementById('descripcion-solicitud').value = ''
   document.getElementById('modal-solicitud').classList.add('activo')
}

function cerrarModalSolicitud(){
   document.getElementById('modal-solicitud').classList.remove('activo')
}

function enviarSolicitud(){
   const descripcion = document.getElementById('descripcion-solicitud').value
   const titulo =
   document.getElementById('titulo-solicitud').value

   if(!titulo){
      alert('Escribe un título')
      return
   }

   if(!descripcion){
      alert('Por favor describe lo que necesitas')
      return
   }

   fetch('../backend-servicios/solicitudes/crear-solicitud.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         anuncio_id: anuncioSeleccionado,
         desarrollador_id: desarrolladorIdSeleccionado,
         titulo: titulo,
         descripcion: descripcion
      })
   })
   .then(res => res.json())
   .then(data => {
      if(data.success){
         alert('Solicitud enviada ✅')
         cerrarModalSolicitud()
      } else {
         alert(data.mensaje)
      }
   })
   .catch(error => {
      console.error(error)
      alert('Error de conexión')
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
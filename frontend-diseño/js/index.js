// Datos temporales
const desarrolladores = [
   { nombre: "Carlos", profesion: "Desarrollador Web", estrellas: 4.9, img: "gato.jpg" },
   { nombre: "María", profesion: "E-commerce", estrellas: 4.7, img: "gato.jpg" },
   { nombre: "Ibeth", profesion: "Apps", estrellas: 4.5, img: "gato.jpg" },
   { nombre: "Tristan", profesion: "Diseño Web", estrellas: 4.3, img: "gato.jpg" },
   { nombre: "Juan", profesion: "Backend", estrellas: 4.1, img: "gato.jpg" },
]

// Ordena por estrellas
desarrolladores.sort((a, b) => b.estrellas - a.estrellas)

// Genera las cards
const lista = document.querySelector('.swiper-wrapper')
lista.innerHTML = ''

desarrolladores.forEach(dev => {
   lista.innerHTML += `
      <div class="items swiper-slide">
         <img src="${dev.img}" alt="${dev.nombre}" class="usuario-img">
         <h2 class="usuario-name">${dev.nombre}</h2>
         <p class="usuario-profesion">${dev.profesion}</p>
         <p class="usuario-estrellas">⭐ ${dev.estrellas}</p>
         <button class="btn-mensaje" onclick="abrirModal('${dev.nombre}')">
            Enviar solicitud
         </button>
      </div>
   `
})

// Inicia Swiper DESPUÉS de generar las cards
const swiper = new Swiper('.slider-wrapper', {
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

// Modal
let desarrolladorSeleccionado = null

function abrirModal(nombre){
   desarrolladorSeleccionado = nombre
   document.getElementById('nombre-dev').textContent = nombre
   document.getElementById('modal-fondo').classList.add('activo')
}

function cerrarModal(){
   document.getElementById('modal-fondo').classList.remove('activo')
   document.getElementById('descripcion').value = ''
}

function enviarSolicitud(){
   const descripcion = document.getElementById('descripcion').value
   if(!descripcion){
      alert('Por favor describe lo que necesitas')
      return
   }
   alert(`Solicitud enviada a ${desarrolladorSeleccionado} ✅`)
   cerrarModal()
}
document.addEventListener('DOMContentLoaded', () => {
   cargarAnunciosIndex()
})

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
            <div class="anuncio-index-card">
               <h2>${anuncio.titulo}</h2>
               <p>${anuncio.descripcion}</p>
               <p><strong>${anuncio.especialidad}</strong></p>
               <p>Desde $${anuncio.precio}</p>
               <p>${Array.isArray(anuncio.lenguajes) ? anuncio.lenguajes.join(', ') : ''}</p>
               <p>👨‍💻 ${anuncio.dev_nombre}</p>

               <button class="btn btn-azul" onclick="abrirModal('${anuncio.dev_nombre}')">
                  Enviar solicitud
               </button>
            </div>
         `
      })
   })
   .catch(error => {
      console.error(error)
   })
}
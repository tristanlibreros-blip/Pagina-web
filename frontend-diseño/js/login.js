// Agarra el formulario
document.querySelector('form')
.addEventListener('submit', function(e){
   e.preventDefault()

   // Agarra los valores con tus IDs
   const datos = {
      usuario: document.getElementById('usuario').value,
      contraseña: document.getElementById('contraseña').value
   }

   // Valida que no estén vacíos
   if(!datos.usuario || !datos.contraseña){
      alert('Por favor llena todos los campos')
      return
   }

   // Manda los datos al backend
   fetch('../../backend/auth/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
   })
   .then(res => res.json())
   .then(data => {
      if(data.success){
         // Redirige según tipo de usuario
         if(data.tipo == 'cliente'){
            window.location = '../dashboard-cliente.html'
         } else {
            window.location = '../dashboard-desarrollador.html'
         }
      } else {
         alert(data.mensaje)
      }
   })
   .catch(error => {
      alert('Error de conexión, intenta de nuevo')
   })
})
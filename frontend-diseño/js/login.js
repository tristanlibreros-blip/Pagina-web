// Agarra el formulario
document.querySelector('form')
.addEventListener('submit', function(e){
   e.preventDefault()

   // Agarra los valores con tus IDs
   const datos = {
      usuario: document.getElementById('usuario').value,
      contrasena: document.getElementById('contrasena').value
   }

   // Valida que no estén vacíos
   if(!datos.usuario || !datos.contrasena){
      alert('Por favor llena todos los campos')
      return
   }

   // Manda los datos al backend
   fetch('../backend-auth/auth/login.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
   })
   .then(res => res.json())
   .then(data => {
      if(data.success){
         // Redirige según tipo de usuario
         if(data.tipo == 'cliente'){
            window.location = '../frontend-dashboards/dashboard.html'
         } else {
            window.location = '../frontend-dashboards/dashboard.html'
         }
      } else {
         alert(data.mensaje)
      }
   })
   .catch(error => {
      alert('Error de conexión, intenta de nuevo')
   })
})
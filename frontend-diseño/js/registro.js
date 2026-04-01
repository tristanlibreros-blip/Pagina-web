const addForm = document.getElementById("validacion");

addForm.addEventListener("submit", (e) => {
   e.preventDefault();
   e.stopPropagation();

   // Valida campos vacíos
   if(addForm.checkValidity() === false){
      addForm.classList.add('was-validated');
      return;
   }

   // Verifica que las contraseñas coincidan
   const contrasena = document.getElementById('contrasena').value;
   const confirmar = document.getElementById('confirmar_contrasena').value;

   if(contrasena !== confirmar){
      alert('Las contraseñas no coinciden')
      return;
   }

   // Agarra todos los datos con tus IDs
   const datos = {
      nombre: document.getElementById('nombre').value,
      usuario: document.getElementById('usuario').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      contrasena: contrasena
   }

   // Manda los datos al backend
   fetch('../../backend/auth/registro.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
   })
   .then(res => res.json())
   .then(data => {
      if(data.success){
         alert('¡Registro exitoso!')
         window.location = 'login.html' // Redirige al login
      } else {
         alert(data.mensaje)
      }
   })
   .catch(error => {
      alert('Error de conexión, intenta de nuevo')
   })
});
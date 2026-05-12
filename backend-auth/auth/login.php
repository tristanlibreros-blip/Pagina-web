<?php
// Arrancamos la sesión para "recordar" al usuario mientras navega
session_start(); 
include '../conexion.php';

// Recibir los datos JSON del frontend
$datos = json_decode(file_get_contents('php://input'), true);

if ($datos) {
    $usuario = $datos['usuario'];
    // OJO: En tu login.js le pusiste 'contraseña' (con ñ), así que aquí la recibimos igual
    $contrasena_ingresada = $datos['contrasena']; 

    // Preparamos la consulta para buscar al usuario por su nombre de usuario
    $stmt = $conn->prepare("SELECT id, nombre, contrasena, tipo FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    // ¿Existe el usuario en la base de datos?
    if ($resultado->num_rows > 0) {
        $user_db = $resultado->fetch_assoc();
        
        // Verificamos si la contraseña ingresada coincide con la encriptada
        if (password_verify($contrasena_ingresada, $user_db['contrasena'])) {
            
            // ¡Éxito! Guardamos sus datos en la sesión del servidor
            $_SESSION['usuario_id'] = $user_db['id'];
            $_SESSION['usuario_nombre'] = $user_db['nombre'];
            $_SESSION['usuario_tipo'] = $user_db['tipo'];

            // Le respondemos al frontend que todo salió bien y le pasamos el rol
            echo json_encode([
                "success" => true, 
                "mensaje" => "Bienvenido " . $user_db['nombre'],
                "tipo" => $user_db['tipo'] 
            ]);
        } else {
            // Contraseña mal escrita
            echo json_encode(["success" => false, "mensaje" => "Contraseña incorrecta"]);
        }
    } else {
        // El usuario no existe en la BD
        echo json_encode(["success" => false, "mensaje" => "El usuario no existe"]);
    }
    $stmt->close();
}
?>
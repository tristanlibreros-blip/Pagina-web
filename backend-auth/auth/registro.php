<?php
include '../conexion.php';

// Recibir los datos JSON del frontend
$datos = json_decode(file_get_contents('php://input'), true);

if ($datos) {
    $nombre = $datos['nombre'];
    $usuario = $datos['usuario'];
    $email = $datos['email'];
    $telefono = $datos['telefono'];
    // Encriptamos la contraseña por seguridad
    $pass_hash = password_hash($datos['contrasena'], PASSWORD_BCRYPT);

    // Preparamos la consulta
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, usuario, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombre, $usuario, $email, $telefono, $pass_hash);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mensaje" => "Registro exitoso"]);
    } else {
        echo json_encode(["success" => false, "mensaje" => "Error al registrar: " . $conn->error]);
    }
    $stmt->close();
}
?>      
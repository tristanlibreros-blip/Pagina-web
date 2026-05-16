<?php
include '../conexion.php';

// Recibir los datos JSON del frontend
$datos = json_decode(file_get_contents('php://input'), true);

if ($datos) {
    $nombre = $datos['nombre'];
    $usuario = $datos['usuario'];
    $email = $datos['email'];
    $telefono = $datos['telefono'];
    $tipo = $datos['tipo'];
    // Validar usuario existente
    $checkUsuario = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
    $checkUsuario->bind_param("s", $usuario);
    $checkUsuario->execute();
    $resUsuario = $checkUsuario->get_result();

    if($resUsuario->num_rows > 0){
        echo json_encode([
            "success" => false,
            "mensaje" => "Ese usuario ya existe"
        ]);
        exit;
    }

    // Validar email existente
    $checkEmail = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $resEmail = $checkEmail->get_result();

    if($resEmail->num_rows > 0){
        echo json_encode([
            "success" => false,
            "mensaje" => "Ese correo ya está registrado"
        ]);
        exit;
    }
    // Encriptamos la contraseña por seguridad
    $pass_hash = password_hash($datos['contrasena'], PASSWORD_BCRYPT);

    // Preparamos la consulta
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, usuario, email, telefono, contrasena, tipo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nombre, $usuario, $email, $telefono, $pass_hash, $tipo);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mensaje" => "Registro exitoso"]);
    } else {
        echo json_encode(["success" => false, "mensaje" => "Error al registrar: " . $conn->error]);
    }
    $stmt->close();
}
?>      
<?php
// Arrancamos la sesión para poder "leer la pulsera"
session_start();

// Le decimos a la página que vamos a responder en formato JSON
header('Content-Type: application/json');

// Revisamos si existe la variable de sesión 'usuario_id'
if (isset($_SESSION['usuario_id'])) {
    // Si existe, le mandamos los datos del usuario al frontend
    echo json_encode([
        "logueado" => true,
        'id' => $_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "tipo" => $_SESSION['usuario_tipo']
    ]);
} else {
    // Si no existe, significa que es un visitante sin cuenta
    echo json_encode([
        "logueado" => false
    ]);
}
?>
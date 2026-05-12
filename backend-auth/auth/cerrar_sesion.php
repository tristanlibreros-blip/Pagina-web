<?php
session_start();
// Limpia todas las variables de sesión
session_unset();
// Destruye la sesión
session_destroy();

// Envía respuesta de éxito al frontend
header('Content-Type: application/json');
echo json_encode(["success" => true]);
exit();
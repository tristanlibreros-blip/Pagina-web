<?php
// ver-solicitudes.php
// Recibe por GET: ?desarrollador_id=X  → solicitudes recibidas por el dev
//                 ?cliente_id=X        → solicitudes enviadas por el cliente
// Responde: { success: true, solicitudes: [...] }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

if(isset($_GET['desarrollador_id'])){
    // Solicitudes recibidas por el desarrollador
    $desarrollador_id = mysqli_real_escape_string($conexion, $_GET['desarrollador_id']);

    $query = "SELECT s.id, s.descripcion, s.estado, s.fecha,
                     u.nombre AS cliente_nombre, u.usuario AS cliente_usuario
              FROM solicitudes s
              JOIN usuarios u ON s.cliente_id = u.id
              WHERE s.desarrollador_id = '$desarrollador_id'
              ORDER BY s.fecha DESC";

} else if(isset($_GET['cliente_id'])){
    // Solicitudes enviadas por el cliente
    $cliente_id = mysqli_real_escape_string($conexion, $_GET['cliente_id']);

    $query = "SELECT s.id, s.descripcion, s.estado, s.fecha,
                     u.nombre AS desarrollador_nombre, u.usuario AS desarrollador_usuario
              FROM solicitudes s
              JOIN usuarios u ON s.desarrollador_id = u.id
              WHERE s.cliente_id = '$cliente_id'
              ORDER BY s.fecha DESC";

} else {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan parámetros']);
    exit;
}

$resultado = mysqli_query($conexion, $query);
$solicitudes = [];

while($fila = mysqli_fetch_assoc($resultado)){
    $solicitudes[] = $fila;
}

echo json_encode(['success' => true, 'solicitudes' => $solicitudes]);
?>

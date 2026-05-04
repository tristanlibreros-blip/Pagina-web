<?php
// ver-calificaciones.php
// Recibe por GET: ?desarrollador_id=X
// Responde: { success: true, promedio: 4.5, total: 10, calificaciones: [...] }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

if(!isset($_GET['desarrollador_id'])){
    echo json_encode(['success' => false, 'mensaje' => 'Falta el ID del desarrollador']);
    exit;
}

$desarrollador_id = mysqli_real_escape_string($conexion, $_GET['desarrollador_id']);

// Obtener todas las calificaciones con info del cliente y proyecto
$query = "SELECT c.id, c.estrellas, c.comentario, c.fecha,
                 u.nombre AS cliente_nombre,
                 p.nombre AS proyecto_nombre
          FROM calificaciones c
          JOIN usuarios u ON c.cliente_id = u.id
          JOIN proyectos p ON c.proyecto_id = p.id
          WHERE c.desarrollador_id = '$desarrollador_id'
          ORDER BY c.fecha DESC";

$resultado = mysqli_query($conexion, $query);
$calificaciones = [];
$total_estrellas = 0;

while($fila = mysqli_fetch_assoc($resultado)){
    $calificaciones[] = $fila;
    $total_estrellas += $fila['estrellas'];
}

$total = count($calificaciones);
$promedio = $total > 0 ? round($total_estrellas / $total, 1) : 0;

echo json_encode([
    'success' => true,
    'promedio' => $promedio,
    'total' => $total,
    'calificaciones' => $calificaciones
]);
?>

<?php
// ver-anuncios.php
// GET ?top=1          → top 10 por calificación (para el index)
// GET ?desarrollador_id=X → anuncios de ese dev (para su dashboard)
// GET ?buscar=X       → buscar por nombre o especialidad
// Responde: { success: true, anuncios: [...] }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

if(isset($_GET['desarrollador_id'])){
    // Anuncios del desarrollador para su dashboard
    $id = mysqli_real_escape_string($conexion, $_GET['desarrollador_id']);
    $query = "SELECT a.*, u.nombre AS dev_nombre, u.usuario AS dev_usuario
              FROM anuncios a
              JOIN usuarios u ON a.desarrollador_id = u.id
              WHERE a.desarrollador_id = '$id' AND a.activo = 1
              ORDER BY a.fecha DESC";

} else if(isset($_GET['buscar'])){
    // Búsqueda por nombre o especialidad
    $buscar = mysqli_real_escape_string($conexion, $_GET['buscar']);
    $query = "SELECT a.*, u.nombre AS dev_nombre, u.usuario AS dev_usuario,
                     COALESCE(AVG(c.estrellas), 0) AS promedio_estrellas,
                     COUNT(c.id) AS total_calificaciones
              FROM anuncios a
              JOIN usuarios u ON a.desarrollador_id = u.id
              LEFT JOIN calificaciones c ON a.desarrollador_id = c.desarrollador_id
              WHERE a.activo = 1
              AND (u.nombre LIKE '%$buscar%' OR a.especialidad LIKE '%$buscar%' OR a.titulo LIKE '%$buscar%')
              GROUP BY a.id
              ORDER BY promedio_estrellas DESC";

} else {
    // Top anuncios por calificación (para el index)
    $limit = isset($_GET['top']) ? (int)$_GET['top'] : 10;
    $query = "SELECT a.*, u.nombre AS dev_nombre, u.usuario AS dev_usuario,
                     COALESCE(AVG(c.estrellas), 0) AS promedio_estrellas,
                     COUNT(c.id) AS total_calificaciones
              FROM anuncios a
              JOIN usuarios u ON a.desarrollador_id = u.id
              LEFT JOIN calificaciones c ON a.desarrollador_id = c.desarrollador_id
              WHERE a.activo = 1
              GROUP BY a.id
              ORDER BY promedio_estrellas DESC
              LIMIT $limit";
}

$resultado = mysqli_query($conexion, $query);
$anuncios = [];

while($fila = mysqli_fetch_assoc($resultado)){
    // No enviar el binario del banner en el listado, solo indicar si existe
    $fila['tiene_banner'] = !empty($fila['banner']);
    unset($fila['banner']);
    // Decodificar lenguajes
    $fila['lenguajes'] = json_decode($fila['lenguajes'] ?? '[]');
    $anuncios[] = $fila;
}

echo json_encode(['success' => true, 'anuncios' => $anuncios]);
?>

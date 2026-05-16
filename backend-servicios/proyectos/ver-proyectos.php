<?php
header('Content-Type: application/json');

include '../../backend-auth/conexion.php';

if(isset($_GET['cliente_id'])){
    $cliente_id = mysqli_real_escape_string($conn, $_GET['cliente_id']);

    $query = "SELECT p.*, u.nombre AS desarrollador_nombre
              FROM proyectos p
              JOIN usuarios u ON p.desarrollador_id = u.id
              WHERE p.cliente_id = '$cliente_id'
              ORDER BY p.fecha_inicio DESC";

} else if(isset($_GET['desarrollador_id'])){
    $desarrollador_id = mysqli_real_escape_string($conn, $_GET['desarrollador_id']);

    $query = "SELECT p.*, u.nombre AS cliente_nombre
              FROM proyectos p
              JOIN usuarios u ON p.cliente_id = u.id
              WHERE p.desarrollador_id = '$desarrollador_id'
              ORDER BY p.fecha_inicio DESC";

} else {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan parámetros']);
    exit;
}

$resultado = mysqli_query($conn, $query);

$proyectos = [];

while($fila = mysqli_fetch_assoc($resultado)){

    $proyecto_id = $fila['id'];

    $queryArchivos = "
    SELECT id, nombre, fecha, estado, razon_rechazo
    FROM archivos
    WHERE proyecto_id = '$proyecto_id'
    ORDER BY fecha DESC
    ";

    $resArchivos = mysqli_query($conn, $queryArchivos);

    $archivos = [];

    while($archivo = mysqli_fetch_assoc($resArchivos)){
        $archivos[] = $archivo;
    }

    $fila['archivos'] = $archivos;

    $queryCalificacion = "
        SELECT estrellas, comentario, fecha
        FROM calificaciones
        WHERE proyecto_id = '$proyecto_id'
        LIMIT 1
    ";

    $resCalificacion = mysqli_query($conn, $queryCalificacion);

    $fila['calificacion'] = mysqli_fetch_assoc($resCalificacion);

    $proyectos[] = $fila;
}

echo json_encode([
    'success' => true,
    'proyectos' => $proyectos
]);
?>
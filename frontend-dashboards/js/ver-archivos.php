<?php
// ver-archivos.php
// Recibe por GET: ?cliente_id=X o ?desarrollador_id=X
// Responde: { success: true, proyectos: [ { ...proyecto, archivos: [...] } ] }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

if(isset($_GET['cliente_id'])){
    $campo = 'p.cliente_id';
    $id = mysqli_real_escape_string($conexion, $_GET['cliente_id']);
} else if(isset($_GET['desarrollador_id'])){
    $campo = 'p.desarrollador_id';
    $id = mysqli_real_escape_string($conexion, $_GET['desarrollador_id']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan parámetros']);
    exit;
}

// Obtener proyectos
$query = "SELECT p.id, p.nombre, p.descripcion, p.estado, p.fecha_inicio,
                 u.nombre AS desarrollador_nombre
          FROM proyectos p
          JOIN usuarios u ON p.desarrollador_id = u.id
          WHERE $campo = '$id'
          ORDER BY p.fecha_inicio DESC";

$resultado = mysqli_query($conexion, $query);
$proyectos = [];

while($proyecto = mysqli_fetch_assoc($resultado)){
    // Obtener archivos de cada proyecto
    $archivos_query = "SELECT id, nombre, fecha FROM archivos WHERE proyecto_id = '{$proyecto['id']}' ORDER BY fecha DESC";
    $archivos_resultado = mysqli_query($conexion, $archivos_query);
    $archivos = [];

    while($archivo = mysqli_fetch_assoc($archivos_resultado)){
        $archivos[] = $archivo;
    }

    $proyecto['archivos'] = $archivos;
    $proyectos[] = $proyecto;
}

echo json_encode(['success' => true, 'proyectos' => $proyectos]);
?>

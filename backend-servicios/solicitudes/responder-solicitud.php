<?php
// responder-solicitud.php
// Recibe: solicitud_id, estado ('aceptada' o 'rechazada'), desarrollador_id
// Si acepta → crea un proyecto automáticamente
// Responde: { success: true, proyecto_id: X } o { success: false, mensaje: "..." }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

$datos = json_decode(file_get_contents('php://input'));

if(!isset($datos->solicitud_id) || !isset($datos->estado) || !isset($datos->desarrollador_id)){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$solicitud_id    = mysqli_real_escape_string($conexion, $datos->solicitud_id);
$estado          = mysqli_real_escape_string($conexion, $datos->estado);
$desarrollador_id = mysqli_real_escape_string($conexion, $datos->desarrollador_id);

// Verificar que la solicitud pertenece al desarrollador
$check = "SELECT * FROM solicitudes 
          WHERE id = '$solicitud_id' 
          AND desarrollador_id = '$desarrollador_id'
          AND estado = 'pendiente'";
$resultado = mysqli_query($conexion, $check);
$solicitud = mysqli_fetch_assoc($resultado);

if(!$solicitud){
    echo json_encode(['success' => false, 'mensaje' => 'Solicitud no encontrada o ya respondida']);
    exit;
}

// Actualizar estado de la solicitud
$update = "UPDATE solicitudes SET estado = '$estado' WHERE id = '$solicitud_id'";
mysqli_query($conexion, $update);

// Si acepta → crear proyecto automáticamente
if($estado === 'aceptada'){
    $cliente_id  = $solicitud['cliente_id'];
    $descripcion = mysqli_real_escape_string($conexion, $solicitud['descripcion']);

    $proyecto = "INSERT INTO proyectos (solicitud_id, cliente_id, desarrollador_id, nombre, descripcion, estado)
                 VALUES ('$solicitud_id', '$cliente_id', '$desarrollador_id', 'Nuevo Proyecto', '$descripcion', 'en progreso')";
    mysqli_query($conexion, $proyecto);
    $proyecto_id = mysqli_insert_id($conexion);

    echo json_encode(['success' => true, 'proyecto_id' => $proyecto_id]);
} else {
    echo json_encode(['success' => true]);
}
?>

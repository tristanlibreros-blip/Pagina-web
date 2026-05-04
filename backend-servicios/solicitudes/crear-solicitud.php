<?php
// crear-solicitud.php
// Recibe: cliente_id, desarrollador_id, anuncio_id, descripcion
// Responde: { success: true } o { success: false, mensaje: "..." }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

$datos = json_decode(file_get_contents('php://input'));

// Validar datos
if(!isset($datos->cliente_id) || !isset($datos->desarrollador_id) || !isset($datos->descripcion)){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$cliente_id      = mysqli_real_escape_string($conexion, $datos->cliente_id);
$desarrollador_id = mysqli_real_escape_string($conexion, $datos->desarrollador_id);
$anuncio_id      = isset($datos->anuncio_id) ? mysqli_real_escape_string($conexion, $datos->anuncio_id) : null;
$descripcion     = mysqli_real_escape_string($conexion, $datos->descripcion);

// Verificar que no exista ya una solicitud pendiente del mismo cliente al mismo dev
$check = "SELECT id FROM solicitudes 
          WHERE cliente_id = '$cliente_id' 
          AND desarrollador_id = '$desarrollador_id' 
          AND estado = 'pendiente'";
$resultado = mysqli_query($conexion, $check);

if(mysqli_num_rows($resultado) > 0){
    echo json_encode(['success' => false, 'mensaje' => 'Ya tienes una solicitud pendiente con este desarrollador']);
    exit;
}

// Insertar solicitud
$query = "INSERT INTO solicitudes (cliente_id, desarrollador_id, anuncio_id, descripcion, estado) 
          VALUES ('$cliente_id', '$desarrollador_id', " . ($anuncio_id ? "'$anuncio_id'" : "NULL") . ", '$descripcion', 'pendiente')";

if(mysqli_query($conexion, $query)){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al crear la solicitud']);
}
?>

<?php
// eliminar-anuncio.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include '../conexion.php';

$datos = json_decode(file_get_contents('php://input'));

if(!isset($datos->anuncio_id) || !isset($datos->desarrollador_id)){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$anuncio_id      = mysqli_real_escape_string($conexion, $datos->anuncio_id);
$desarrollador_id = mysqli_real_escape_string($conexion, $datos->desarrollador_id);

// Solo desactiva, no borra físicamente
$query = "UPDATE anuncios SET activo = 0 
          WHERE id = '$anuncio_id' AND desarrollador_id = '$desarrollador_id'";

if(mysqli_query($conexion, $query)){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar el anuncio']);
}
?>

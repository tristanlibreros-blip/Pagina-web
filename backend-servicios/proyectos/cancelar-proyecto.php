<?php
header('Content-Type: application/json');
include '../../backend-auth/conexion.php';

$datos = json_decode(file_get_contents('php://input'), true);

if(!isset($datos['proyecto_id']) || !isset($datos['razon'])){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$proyecto_id = mysqli_real_escape_string($conn, $datos['proyecto_id']);
$razon = mysqli_real_escape_string($conn, $datos['razon']);

$query = "
UPDATE proyectos
SET estado = 'cancelado',
razon_cancelacion = '$razon'
WHERE id = '$proyecto_id'
";

if(mysqli_query($conn, $query)){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'mensaje' => mysqli_error($conn)]);
}
?>
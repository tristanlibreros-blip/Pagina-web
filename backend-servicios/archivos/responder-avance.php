<?php

header('Content-Type: application/json');

include '../../backend-auth/conexion.php';

$datos = json_decode(file_get_contents('php://input'), true);

if(
    !isset($datos['archivo_id']) ||
    !isset($datos['estado'])
){
    echo json_encode([
        'success' => false,
        'mensaje' => 'Faltan datos'
    ]);
    exit;
}

$archivo_id = mysqli_real_escape_string($conn, $datos['archivo_id']);

$estado = mysqli_real_escape_string($conn, $datos['estado']);

$razon = mysqli_real_escape_string(
    $conn,
    $datos['razon'] ?? ''
);

$query = "
UPDATE archivos
SET
estado = '$estado',
razon_rechazo = " .
(
    $estado === 'rechazado'
    ? "'$razon'"
    : "NULL"
)
. "
WHERE id = '$archivo_id'
";

if(mysqli_query($conn, $query)){

    echo json_encode([
        'success' => true
    ]);

}else{

    echo json_encode([
        'success' => false,
        'mensaje' => mysqli_error($conn)
    ]);
}
?>
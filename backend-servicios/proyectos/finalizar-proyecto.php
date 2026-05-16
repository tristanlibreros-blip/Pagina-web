<?php

header('Content-Type: application/json');

include '../../backend-auth/conexion.php';

$datos = json_decode(file_get_contents('php://input'), true);

if(!isset($datos['proyecto_id'])){
    echo json_encode([
        'success' => false,
        'mensaje' => 'Falta proyecto_id'
    ]);
    exit;
}

$proyecto_id = mysqli_real_escape_string($conn, $datos['proyecto_id']);

$check = "
SELECT id
FROM archivos
WHERE proyecto_id = '$proyecto_id'
AND estado != 'aprobado'
LIMIT 1
";

$resCheck = mysqli_query($conn, $check);

if(mysqli_num_rows($resCheck) > 0){
    echo json_encode([
        'success' => false,
        'mensaje' => 'No puedes finalizar el proyecto hasta que todos los avances estén aprobados'
    ]);
    exit;
}

$query = "
UPDATE proyectos
SET estado = 'terminado'
WHERE id = '$proyecto_id'
";

if(mysqli_query($conn, $query)){

    echo json_encode([
        'success' => true
    ]);

}else{

    echo json_encode([
        'success' => false,
        'mensaje' => $conn->error
    ]);
}
?>
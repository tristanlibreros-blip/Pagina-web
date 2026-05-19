<?php
header('Content-Type: application/json');

include '../../backend-auth/conexion.php';

if(!isset($_POST['proyecto_id'])){
    echo json_encode([
        'success' => false,
        'mensaje' => 'Falta proyecto_id'
    ]);
    exit;
}

$proyecto_id = mysqli_real_escape_string($conn, $_POST['proyecto_id']);
$link_final = mysqli_real_escape_string($conn, $_POST['link_final'] ?? '');

if(!isset($_FILES['archivo_final']) || $_FILES['archivo_final']['error'] !== 0){
    echo json_encode([
        'success' => false,
        'mensaje' => 'Falta archivo final'
    ]);
    exit;
}
if($_FILES['archivo_final']['size'] > 5 * 1024 * 1024){
    echo json_encode([
        'success' => false,
        'mensaje' => 'El archivo final no puede superar 5MB'
    ]);
    exit;
}

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

$nombre = mysqli_real_escape_string($conn, $_FILES['archivo_final']['name']);
$archivo = mysqli_real_escape_string($conn, file_get_contents($_FILES['archivo_final']['tmp_name']));

$queryArchivo = "
INSERT INTO archivos (proyecto_id, nombre, archivo, estado)
VALUES ('$proyecto_id', '$nombre', '$archivo', 'aprobado')
";

if(!mysqli_query($conn, $queryArchivo)){
    echo json_encode([
        'success' => false,
        'mensaje' => mysqli_error($conn)
    ]);
    exit;
}

$archivo_final_id = mysqli_insert_id($conn);

$query = "
UPDATE proyectos
SET estado = 'terminado',
archivo_final_id = '$archivo_final_id',
link_final = '$link_final'
WHERE id = '$proyecto_id'
";

if(mysqli_query($conn, $query)){
    echo json_encode(['success' => true]);
}else{
    echo json_encode([
        'success' => false,
        'mensaje' => mysqli_error($conn)
    ]);
}
?>
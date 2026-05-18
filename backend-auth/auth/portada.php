<?php

include '../conexion.php';

if(!isset($_GET['usuario_id'])){
    http_response_code(400);
    exit;
}

$usuario_id = mysqli_real_escape_string($conn, $_GET['usuario_id']);

$query = "
SELECT banner
FROM perfiles_desarrollador
WHERE usuario_id = '$usuario_id'
LIMIT 1
";

$resultado = mysqli_query($conn, $query);

if(!$resultado || mysqli_num_rows($resultado) === 0){
    http_response_code(404);
    exit;
}

$fila = mysqli_fetch_assoc($resultado);

if(empty($fila['banner'])){
    http_response_code(404);
    exit;
}

header('Content-Type: image/jpeg');

echo $fila['banner'];
?>
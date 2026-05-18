<?php
// foto.php
// GET ?usuario_id=X → devuelve la foto de perfil del usuario

include '../conexion.php';

if(!isset($_GET['usuario_id'])){
    http_response_code(400);
    exit;
}

$id = mysqli_real_escape_string($conn, $_GET['usuario_id']);
$resultado = mysqli_query($conn, "SELECT foto_perfil FROM usuarios WHERE id = '$id'");
$fila = mysqli_fetch_assoc($resultado);

if(!$fila || empty($fila['foto_perfil'])){
    http_response_code(404);
    exit;
}

header('Content-Type: image/jpeg');
header('Cache-Control: max-age=3600');
echo $fila['foto_perfil'];
?>

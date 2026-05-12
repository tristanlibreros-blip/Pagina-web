<?php
// banner.php
// GET ?anuncio_id=X → devuelve la imagen del banner
// GET ?usuario_id=X → devuelve la foto de perfil

include '../conexion.php';

if(isset($_GET['anuncio_id'])){
    $id = mysqli_real_escape_string($conn, $_GET['anuncio_id']);
    $query = "SELECT banner FROM anuncios WHERE id = '$id'";
    $campo = 'banner';
} else if(isset($_GET['usuario_id'])){
    $id = mysqli_real_escape_string($conn, $_GET['usuario_id']);
    $query = "SELECT foto_perfil AS banner FROM usuarios WHERE id = '$id'";
    $campo = 'banner';
} else {
    http_response_code(400);
    exit;
}

$resultado = mysqli_query($conn, $query);
$fila = mysqli_fetch_assoc($resultado);

if(!$fila || empty($fila[$campo])){
    // Devuelve imagen placeholder si no hay foto
    http_response_code(404);
    exit;
}

header('Content-Type: image/jpeg');
header('Cache-Control: max-age=3600');
echo $fila[$campo];
?>

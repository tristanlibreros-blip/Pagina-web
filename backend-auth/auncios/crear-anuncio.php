<?php
// crear-anuncio.php
// Recibe multipart/form-data: desarrollador_id, titulo, descripcion, especialidad, lenguajes (JSON), precio, banner (file)
// Responde: { success: true, anuncio_id: X } o { success: false, mensaje: "..." }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

if(!isset($_POST['desarrollador_id']) || !isset($_POST['titulo'])){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$desarrollador_id = mysqli_real_escape_string($conexion, $_POST['desarrollador_id']);
$titulo           = mysqli_real_escape_string($conexion, $_POST['titulo']);
$descripcion      = mysqli_real_escape_string($conexion, $_POST['descripcion'] ?? '');
$especialidad     = mysqli_real_escape_string($conexion, $_POST['especialidad'] ?? '');
$lenguajes        = mysqli_real_escape_string($conexion, $_POST['lenguajes'] ?? '[]');
$precio           = (float)($_POST['precio'] ?? 0);

// Banner opcional
$banner = null;
if(isset($_FILES['banner']) && $_FILES['banner']['error'] === 0){
    if($_FILES['banner']['size'] > 5 * 1024 * 1024){
        echo json_encode(['success' => false, 'mensaje' => 'El banner no puede superar 5MB']);
        exit;
    }
    $banner = mysqli_real_escape_string($conexion, file_get_contents($_FILES['banner']['tmp_name']));
}

$banner_sql = $banner ? "'$banner'" : "NULL";

$query = "INSERT INTO anuncios (desarrollador_id, titulo, descripcion, especialidad, lenguajes, precio, banner)
          VALUES ('$desarrollador_id', '$titulo', '$descripcion', '$especialidad', '$lenguajes', '$precio', $banner_sql)";

if(mysqli_query($conexion, $query)){
    $anuncio_id = mysqli_insert_id($conexion);
    echo json_encode(['success' => true, 'anuncio_id' => $anuncio_id]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al crear el anuncio']);
}
?>

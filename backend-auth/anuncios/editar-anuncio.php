<?php
// editar-anuncio.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include '../conexion.php';

if(!isset($_POST['anuncio_id']) || !isset($_POST['desarrollador_id'])){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$anuncio_id      = mysqli_real_escape_string($conn, $_POST['anuncio_id']);
$desarrollador_id = mysqli_real_escape_string($conn, $_POST['desarrollador_id']);
$titulo          = mysqli_real_escape_string($conn, $_POST['titulo'] ?? '');
$descripcion     = mysqli_real_escape_string($conn, $_POST['descripcion'] ?? '');
$especialidad    = mysqli_real_escape_string($conn, $_POST['especialidad'] ?? '');
$lenguajes       = mysqli_real_escape_string($conn, $_POST['lenguajes'] ?? '[]');
$precio          = (float)($_POST['precio'] ?? 0);

$query = "UPDATE anuncios SET 
          titulo = '$titulo',
          descripcion = '$descripcion',
          especialidad = '$especialidad',
          lenguajes = '$lenguajes',
          precio = '$precio'
          WHERE id = '$anuncio_id' AND desarrollador_id = '$desarrollador_id'";

// Actualizar banner si se subió uno nuevo
if(isset($_FILES['banner']) && $_FILES['banner']['error'] === 0){
    $banner = mysqli_real_escape_string($conn, file_get_contents($_FILES['banner']['tmp_name']));
    $query = "UPDATE anuncios SET 
              titulo = '$titulo', descripcion = '$descripcion',
              especialidad = '$especialidad', lenguajes = '$lenguajes',
              precio = '$precio', banner = '$banner'
              WHERE id = '$anuncio_id' AND desarrollador_id = '$desarrollador_id'";
}

if(mysqli_query($conn, $query)){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al editar el anuncio']);
}
?>

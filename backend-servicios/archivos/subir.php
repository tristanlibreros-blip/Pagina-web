<?php
// subir.php
// Recibe por POST (multipart): proyecto_id, archivo (file)
// Guarda el archivo en la DB como LONGBLOB
// Responde: { success: true } o { success: false, mensaje: "..." }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

if(!isset($_POST['proyecto_id']) || !isset($_FILES['archivo'])){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$proyecto_id = mysqli_real_escape_string($conexion, $_POST['proyecto_id']);
$nombre      = mysqli_real_escape_string($conexion, $_FILES['archivo']['name']);

// Verificar tamaño máximo (5MB)
if($_FILES['archivo']['size'] > 5 * 1024 * 1024){
    echo json_encode(['success' => false, 'mensaje' => 'El archivo no puede superar 5MB']);
    exit;
}

// Leer el archivo y convertirlo a binario
$archivo = file_get_contents($_FILES['archivo']['tmp_name']);
$archivo = mysqli_real_escape_string($conexion, $archivo);

$query = "INSERT INTO archivos (proyecto_id, nombre, archivo) 
          VALUES ('$proyecto_id', '$nombre', '$archivo')";

if(mysqli_query($conexion, $query)){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al subir el archivo']);
}
?>

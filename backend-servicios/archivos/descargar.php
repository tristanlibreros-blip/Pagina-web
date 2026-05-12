<?php
// descargar.php
// Recibe por GET: ?archivo_id=X
// Descarga el archivo guardado en la DB
// No responde JSON, descarga el archivo directamente

include '../../backend-auth/conexion.php';

if(!isset($_GET['archivo_id'])){
    die('Falta el ID del archivo');
}

$archivo_id = mysqli_real_escape_string($conn, $_GET['archivo_id']);

$query = "SELECT nombre, archivo FROM archivos WHERE id = '$archivo_id'";
$resultado = mysqli_query($conn, $query);
$archivo = mysqli_fetch_assoc($resultado);

if(!$archivo){
    die('Archivo no encontrado');
}

// Forzar descarga
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $archivo['nombre'] . '"');
header('Content-Length: ' . strlen($archivo['archivo']));

echo $archivo['archivo'];
?>

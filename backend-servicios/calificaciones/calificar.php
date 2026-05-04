<?php
// calificar.php
// Recibe: proyecto_id, cliente_id, desarrollador_id, estrellas, comentario
// Responde: { success: true } o { success: false, mensaje: "..." }

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include '../conexion.php';

$datos = json_decode(file_get_contents('php://input'));

if(!isset($datos->proyecto_id) || !isset($datos->cliente_id) || !isset($datos->desarrollador_id) || !isset($datos->estrellas)){
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$proyecto_id     = mysqli_real_escape_string($conexion, $datos->proyecto_id);
$cliente_id      = mysqli_real_escape_string($conexion, $datos->cliente_id);
$desarrollador_id = mysqli_real_escape_string($conexion, $datos->desarrollador_id);
$estrellas       = (int)$datos->estrellas;
$comentario      = isset($datos->comentario) ? mysqli_real_escape_string($conexion, $datos->comentario) : '';

// Validar estrellas
if($estrellas < 1 || $estrellas > 5){
    echo json_encode(['success' => false, 'mensaje' => 'Las estrellas deben ser entre 1 y 5']);
    exit;
}

// Verificar que el proyecto esté terminado
$check = "SELECT id FROM proyectos 
          WHERE id = '$proyecto_id' 
          AND cliente_id = '$cliente_id'
          AND estado = 'terminado'";
$resultado = mysqli_query($conexion, $check);

if(mysqli_num_rows($resultado) === 0){
    echo json_encode(['success' => false, 'mensaje' => 'El proyecto no está terminado o no te pertenece']);
    exit;
}

// Verificar que no haya calificado ya
$check2 = "SELECT id FROM calificaciones 
           WHERE proyecto_id = '$proyecto_id' 
           AND cliente_id = '$cliente_id'";
$resultado2 = mysqli_query($conexion, $check2);

if(mysqli_num_rows($resultado2) > 0){
    echo json_encode(['success' => false, 'mensaje' => 'Ya calificaste este proyecto']);
    exit;
}

// Guardar calificación
$query = "INSERT INTO calificaciones (proyecto_id, cliente_id, desarrollador_id, estrellas, comentario)
          VALUES ('$proyecto_id', '$cliente_id', '$desarrollador_id', '$estrellas', '$comentario')";

if(mysqli_query($conexion, $query)){
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al guardar la calificación']);
}
?>

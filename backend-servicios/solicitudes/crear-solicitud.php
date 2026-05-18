<?php
session_start();

header('Content-Type: application/json');

include '../../backend-auth/conexion.php';

if(!isset($_SESSION['usuario_id'])){
    echo json_encode([
        'success' => false,
        'mensaje' => 'Debes iniciar sesión como cliente'
    ]);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

if(!$datos || !isset($datos['desarrollador_id']) || !isset($datos['descripcion'])){
    echo json_encode([
        'success' => false,
        'mensaje' => 'Faltan datos'
    ]);
    exit;
}

$titulo = mysqli_real_escape_string(
    $conn,
    $datos['titulo']
);

$cliente_id = $_SESSION['usuario_id'];
$desarrollador_id = $datos['desarrollador_id'];
$anuncio_id = $datos['anuncio_id'] ?? null;
$descripcion = $datos['descripcion'];

$stmt = $conn->prepare("
    INSERT INTO solicitudes
    (cliente_id, desarrollador_id, anuncio_id, titulo, descripcion, estado)
    VALUES (?, ?, ?, ?, ?, 'pendiente')
");

$stmt->bind_param(
    "iiis",
    $cliente_id,
    $desarrollador_id,
    $anuncio_id,
    $titulo,
    $descripcion
);

if($stmt->execute()){
    echo json_encode(['success' => true]);
} else {
    echo json_encode([
        'success' => false,
        'mensaje' => $conn->error
    ]);
}
?>
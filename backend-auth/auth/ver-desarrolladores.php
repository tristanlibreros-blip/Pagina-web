<?php
header('Content-Type: application/json');
include '../conexion.php';

$query = "
SELECT 
    u.id,
    u.nombre,
    u.usuario,
    u.foto_perfil IS NOT NULL AS tiene_foto,
    p.especialidad,
    p.descripcion,
    p.lenguajes,
    COALESCE(AVG(c.estrellas), 0) AS promedio,
    COUNT(c.id) AS total_calificaciones
FROM usuarios u
LEFT JOIN perfiles_desarrollador p ON u.id = p.usuario_id
LEFT JOIN calificaciones c ON u.id = c.desarrollador_id
WHERE u.tipo = 'desarrollador'
GROUP BY u.id
ORDER BY promedio DESC
";

$resultado = mysqli_query($conn, $query);

$desarrolladores = [];

while($fila = mysqli_fetch_assoc($resultado)){
    $fila['promedio'] = round($fila['promedio'], 1);
    $desarrolladores[] = $fila;
}

echo json_encode([
    'success' => true,
    'desarrolladores' => $desarrolladores
]);
?>
<?php
// perfil.php
// GET  ?usuario_id=X → ver perfil
// POST             → actualizar perfil

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include '../conexion.php';

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    if(!isset($_GET['usuario_id'])){
        echo json_encode(['success' => false, 'mensaje' => 'Falta usuario_id']);
        exit;
    }
session_start();

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    if(!isset($_SESSION['usuario_id']) || $_SESSION['usuario_id'] != $_POST['usuario_id']){
        echo json_encode([
            'success' => false,
            'mensaje' => 'No puedes editar este perfil'
        ]);
        exit;
    }
}

    $id = mysqli_real_escape_string($conn, $_GET['usuario_id']);

    $query = "SELECT u.id, u.nombre, u.usuario, u.email, u.telefono, u.tipo, u.fecha_registro,
                     (u.foto_perfil IS NOT NULL AND u.foto_perfil != '') AS tiene_foto,
                     p.especialidad, p.lenguajes, p.descripcion, p.certificaciones, p.experiencia,
                     (p.banner IS NOT NULL AND p.banner != '') AS tiene_banner,
                     COALESCE(AVG(c.estrellas), 0) AS promedio_estrellas,
                     COUNT(c.id) AS total_calificaciones
              FROM usuarios u
              LEFT JOIN perfiles_desarrollador p ON u.id = p.usuario_id
              LEFT JOIN calificaciones c ON u.id = c.desarrollador_id
              WHERE u.id = '$id'
              GROUP BY u.id";

    $resultado = mysqli_query($conn, $query);
    $perfil = mysqli_fetch_assoc($resultado);

    if(!$perfil){
        echo json_encode(['success' => false, 'mensaje' => 'Usuario no encontrado']);
        exit;
    }

    $perfil['tiene_foto']   = (bool)$perfil['tiene_foto'];
    $perfil['tiene_banner'] = (bool)$perfil['tiene_banner'];
    $perfil['lenguajes']       = json_decode($perfil['lenguajes'] ?? '[]');
    $perfil['certificaciones'] = json_decode($perfil['certificaciones'] ?? '[]');
    $perfil['promedio_estrellas'] = round($perfil['promedio_estrellas'], 1);

    echo json_encode(['success' => true, 'perfil' => $perfil]);

} else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    if(!isset($_POST['usuario_id'])){
        echo json_encode(['success' => false, 'mensaje' => 'Falta usuario_id']);
        exit;
    }

    $id       = mysqli_real_escape_string($conn, $_POST['usuario_id']);
    $nombre   = mysqli_real_escape_string($conn, $_POST['nombre'] ?? '');
    $telefono = mysqli_real_escape_string($conn, $_POST['telefono'] ?? '');
    $tipo     = $_POST['tipo'] ?? '';

    // Actualizar datos básicos
    mysqli_query($conn, "UPDATE usuarios SET nombre = '$nombre', telefono = '$telefono' WHERE id = '$id'");

    // Foto de perfil
    if(isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === 0){
        if($_FILES['foto_perfil']['size'] > 3 * 1024 * 1024){
            echo json_encode(['success' => false, 'mensaje' => 'La foto no puede superar 3MB']);
            exit;
        }
        $foto = mysqli_real_escape_string($conn, file_get_contents($_FILES['foto_perfil']['tmp_name']));
        $nombre_foto = mysqli_real_escape_string($conn, $_FILES['foto_perfil']['name']);
        mysqli_query($conn, "UPDATE usuarios SET foto_perfil = '$foto', foto_perfil_nombre = '$nombre_foto' WHERE id = '$id'");
    }

    // Perfil de desarrollador
    if($tipo === 'desarrollador'){
        $especialidad    = mysqli_real_escape_string($conn, $_POST['especialidad'] ?? '');
        $experiencia     = (int)($_POST['experiencia'] ?? 0);
        $descripcion     = mysqli_real_escape_string($conn, $_POST['descripcion'] ?? '');
        $lenguajes       = mysqli_real_escape_string($conn, $_POST['lenguajes'] ?? '[]');
        $certificaciones = mysqli_real_escape_string($conn, $_POST['certificaciones'] ?? '[]');

        // Verificar si ya tiene perfil
        $check = mysqli_query($conn, "SELECT id FROM perfiles_desarrollador WHERE usuario_id = '$id'");

        if(mysqli_num_rows($check) > 0){
            mysqli_query($conn, "UPDATE perfiles_desarrollador SET
                especialidad = '$especialidad',
                experiencia = '$experiencia',
                descripcion = '$descripcion',
                lenguajes = '$lenguajes',
                certificaciones = '$certificaciones'
                WHERE usuario_id = '$id'");
        } else {
            mysqli_query($conn, "INSERT INTO perfiles_desarrollador
                (usuario_id, especialidad, experiencia, descripcion, lenguajes, certificaciones)
                VALUES ('$id', '$especialidad', '$experiencia', '$descripcion', '$lenguajes', '$certificaciones')");
        }

        // Banner del perfil
        if(isset($_FILES['banner']) && $_FILES['banner']['error'] === 0){
            if($_FILES['banner']['size'] > 5 * 1024 * 1024){
                echo json_encode(['success' => false, 'mensaje' => 'El banner no puede superar 5MB']);
                exit;
            }
            $banner = mysqli_real_escape_string($conn, file_get_contents($_FILES['banner']['tmp_name']));
            $banner_nombre = mysqli_real_escape_string($conn, $_FILES['banner']['name']);

            $checkBanner = mysqli_query($conn, "SELECT id FROM perfiles_desarrollador WHERE usuario_id = '$id'");
            if(mysqli_num_rows($checkBanner) > 0){
                mysqli_query($conn, "UPDATE perfiles_desarrollador SET banner = '$banner', banner_nombre = '$banner_nombre' WHERE usuario_id = '$id'");
            } else {
                mysqli_query($conn, "INSERT INTO perfiles_desarrollador (usuario_id, banner, banner_nombre) VALUES ('$id', '$banner', '$banner_nombre')");
            }
        }
    }

    // Descripción del cliente
    if($tipo === 'cliente'){
        $descripcion = mysqli_real_escape_string($conn, $_POST['descripcion'] ?? '');
        $check = mysqli_query($conn, "SELECT id FROM perfiles_desarrollador WHERE usuario_id = '$id'");
        if(mysqli_num_rows($check) > 0){
            mysqli_query($conn, "UPDATE perfiles_desarrollador SET descripcion = '$descripcion' WHERE usuario_id = '$id'");
        } else {
            mysqli_query($conn, "INSERT INTO perfiles_desarrollador (usuario_id, descripcion) VALUES ('$id', '$descripcion')");
        }
    }

    echo json_encode(['success' => true]);
}
?>

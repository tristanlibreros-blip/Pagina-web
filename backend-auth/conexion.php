<?php 
$host = 'sql105.infinityfree.com';
$user = 'if0_41968401';
$password = 'CpXsBB4n0Pc';
$database = 'if0_41968401_chambatec';
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
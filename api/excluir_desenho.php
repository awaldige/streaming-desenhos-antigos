<?php
header("Content-Type: application/json");
// ... (mesmos dados de conexão do Aiven acima) ...

$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

$id = $_POST["id"] ?? null;

if ($id) {
    $stmt = $conn->prepare("DELETE FROM desenhos WHERE id_desenho = ?");
    $stmt->bind_param("i", $id);
    $sucesso = $stmt->execute();
    echo json_encode(["sucesso" => $sucesso]);
} else {
    echo json_encode(["sucesso" => false, "erro" => "ID não informado"]);
}
?>

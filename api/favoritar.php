<?php
header("Content-Type: application/json");
include "conexao.php";

// Recebe dados do frontend
$data = json_decode(file_get_contents("php://input"), true);

$usuario_id = $data["usuario_id"] ?? null;
$desenho_id = $data["desenho_id"] ?? null;

// Validação básica
if (!$usuario_id || !$desenho_id) {
    echo json_encode(["success" => false, "message" => "Dados inválidos"]);
    exit;
}

// Verifica se já existe favorito
$sql = "SELECT * FROM favoritos WHERE usuario_id = ? AND desenho_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $usuario_id, $desenho_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // REMOVE dos favoritos
    $sql = "DELETE FROM favoritos WHERE usuario_id = ? AND desenho_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $usuario_id, $desenho_id);
    $stmt->execute();

    echo json_encode(["success" => true, "action" => "removed"]);
} else {
    // ADICIONA aos favoritos
    $sql = "INSERT INTO favoritos (usuario_id, desenho_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $usuario_id, $desenho_id);
    $stmt->execute();

    echo json_encode(["success" => true, "action" => "added"]);
}
?>

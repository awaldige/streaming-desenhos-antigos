<?php
// Impede avisos do PHP de quebrarem o formato JSON
mysqli_report(MYSQLI_REPORT_OFF);
header("Content-Type: application/json; charset=utf-8");

// Conexão com a porta 3308
$conn = @new mysqli("localhost", "root", "", "desenhos_antigos", 3308);

if ($conn->connect_error) {
    echo json_encode(["erro" => "Falha na conexão com o banco de dados"]);
    exit;
}

// Busca todos os desenhos
$sql = "SELECT * FROM desenhos ORDER BY id_desenho DESC";
$result = $conn->query($sql);

$dados = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $dados[] = [
            "id_desenho" => $row["id_desenho"],
            "nome" => $row["nome"],
            "ano_lancamento" => $row["ano_lancamento"],
            "descricao" => $row["descricao"] ?? "",
            "imagem" => $row["imagem"] ?? null,
            "video_url" => $row["video_url"] ?? "" // <--- ESTA LINHA ESTAVA FALTANDO!
        ];
    }
}

echo json_encode($dados);
$conn->close();
?>

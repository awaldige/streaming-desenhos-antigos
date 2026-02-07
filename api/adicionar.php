<?php
// Exibir erros para debug
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=utf-8");

// --- CONFIGURAÇÃO AIVEN ---
$host = "mysql-63c6648-streaming-desenhos.j.aivencloud.com";
$port = 28840;
$user = "avnadmin";
$pass = "AVNS_y1R_KaHJC0qp4VAHb_k"; 
$dbname = "defaultdb";

// Inicializa a conexão com SSL
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    echo json_encode(["sucesso" => false, "erro" => "Falha na conexão com Aiven"]);
    exit;
}
// --------------------------

$nome = $_POST["nome"] ?? '';
$ano = $_POST["ano"] ?? 0;
$descricao = $_POST["descricao"] ?? '';
$video_url = $_POST["video_url"] ?? '';
$imagemNome = null;

// Lógica da Imagem
if (!empty($_FILES["imagem"]["name"])) {
    $diretorio = "../imagens/";
    if (!is_dir($diretorio)) mkdir($diretorio, 0777, true);

    $extensao = pathinfo($_FILES["imagem"]["name"], PATHINFO_EXTENSION);
    $imagemNome = time() . "_" . uniqid() . "." . $extensao;
    move_uploaded_file($_FILES["imagem"]["tmp_name"], $diretorio . $imagemNome);
}

// Prepare e Bind_Param usando a conexão SSL ($conn)
$stmt = $conn->prepare("INSERT INTO desenhos (nome, ano_lancamento, descricao, imagem, video_url) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sisss", $nome, $ano, $descricao, $imagemNome, $video_url);

$resultado = $stmt->execute();

if ($resultado) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "erro" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

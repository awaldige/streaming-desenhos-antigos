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

// --- CONFIGURAÇÃO CLOUDINARY ---
// Coloque o seu Cloud Name que aparece no Dashboard do Cloudinary aqui:
$cloud_name = "SEU_CLOUD_NAME_AQUI"; 
$upload_preset = "streaming-desenhos-antigos";

// Inicializa a conexão com SSL (Aiven)
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, NULL, NULL, NULL);
$conectar = @mysqli_real_connect($conn, $host, $user, $pass, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

if (!$conectar) {
    echo json_encode(["sucesso" => false, "erro" => "Falha na conexão com Aiven"]);
    exit;
}

$nome = $_POST["nome"] ?? '';
$ano = $_POST["ano"] ?? 0;
$descricao = $_POST["descricao"] ?? '';
$video_url = $_POST["video_url"] ?? '';
$imagemUrl = null; // Agora salvaremos a URL completa

// Lógica da Imagem via Cloudinary
if (!empty($_FILES["imagem"]["tmp_name"])) {
    $arquivo_temporario = $_FILES["imagem"]["tmp_name"];

    // Prepara o upload para o Cloudinary via cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/$cloud_name/image/upload");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        "file" => new CURLFile($arquivo_temporario),
        "upload_preset" => $upload_preset
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $resposta_json = curl_exec($ch);
    $erro_curl = curl_error($ch);
    curl_close($ch);

    if ($erro_curl) {
        echo json_encode(["sucesso" => false, "erro" => "Erro no cURL: " . $erro_curl]);
        exit;
    }

    $dados_cloudinary = json_decode($resposta_json, true);

    if (isset($dados_cloudinary['secure_url'])) {
        // Esta é a URL permanente da imagem
        $imagemUrl = $dados_cloudinary['secure_url'];
    } else {
        $msg_erro = $dados_cloudinary['error']['message'] ?? 'Erro desconhecido no Cloudinary';
        echo json_encode(["sucesso" => false, "erro" => $msg_erro]);
        exit;
    }
}

// Salva no banco (Agora a coluna 'imagem' guardará o link do Cloudinary)
$stmt = $conn->prepare("INSERT INTO desenhos (nome, ano_lancamento, descricao, imagem, video_url) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sisss", $nome, $ano, $descricao, $imagemUrl, $video_url);

$resultado = $stmt->execute();

if ($resultado) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "erro" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>

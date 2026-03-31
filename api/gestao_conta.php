<?php
session_start();
header("Content-Type: application/json");
include 'conexao.php';

// Proteção: Só processa se houver alguém logado na sessão
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["sucesso" => false, "erro" => "Sessão expirada."]);
    exit;
}

$id_user = $_SESSION['usuario_id'];
$acao = $_POST['acao'] ?? '';

if ($acao === 'editar') {
    $nome = $_POST['nome'] ?? '';
    $senha = $_POST['senha'] ?? '';

    if ($senha !== '') {
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE usuarios SET nome = ?, senha = ? WHERE id_usuario = ?");
        $stmt->bind_param("ssi", $nome, $senhaHash, $id_user);
    } else {
        $stmt = $conn->prepare("UPDATE usuarios SET nome = ? WHERE id_usuario = ?");
        $stmt->bind_param("si", $nome, $id_user);
    }

    if ($stmt->execute()) {
        $_SESSION['usuario_nome'] = $nome;
        echo json_encode(["sucesso" => true]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Erro ao atualizar."]);
    }

} elseif ($acao === 'excluir') {
    $confirmacao = $_POST['confirmacao_login'] ?? '';
    
    // Verifica se o login de confirmação bate com o da sessão para evitar exclusão acidental
    if ($confirmacao !== $_SESSION['usuario_login']) {
        echo json_encode(["sucesso" => false, "erro" => "Login de confirmação incorreto."]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param("i", $id_user);

    if ($stmt->execute()) {
        session_destroy();
        echo json_encode(["sucesso" => true]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Erro ao excluir conta."]);
    }
}
?>

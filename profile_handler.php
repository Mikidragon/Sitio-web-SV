<?php
session_start();
require_once 'db_connection.php';

// Verificar si el usuario está autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

function updateProfile($userId, $nombre, $email, $telefono) {
    global $pdo;
    
    try {
        // Verificar si el email ya existe para otro usuario
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
        $stmt->execute([$email, $userId]);
        if ($stmt->rowCount() > 0) {
            return ['success' => false, 'message' => 'El email ya está registrado por otro usuario'];
        }

        // Actualizar datos del usuario
        $stmt = $pdo->prepare("UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?");
        $stmt->execute([$nombre, $email, $telefono, $userId]);

        // Actualizar datos de sesión
        $_SESSION['user_name'] = $nombre;

        return ['success' => true, 'message' => 'Perfil actualizado correctamente'];
    } catch(PDOException $e) {
        return ['success' => false, 'message' => 'Error al actualizar el perfil'];
    }
}

function changePassword($userId, $currentPassword, $newPassword) {
    global $pdo;
    
    try {
        // Verificar contraseña actual
        $stmt = $pdo->prepare("SELECT password FROM usuarios WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($currentPassword, $user['password'])) {
            return ['success' => false, 'message' => 'La contraseña actual es incorrecta'];
        }

        // Actualizar contraseña
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $userId]);

        return ['success' => true, 'message' => 'Contraseña actualizada correctamente'];
    } catch(PDOException $e) {
        return ['success' => false, 'message' => 'Error al actualizar la contraseña'];
    }
}

// Procesar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $userId = $_SESSION['user_id'];
    $response = ['success' => false, 'message' => 'Acción no válida'];

    switch ($action) {
        case 'updateProfile':
            $response = updateProfile(
                $userId,
                $_POST['fullName'] ?? '',
                $_POST['email'] ?? '',
                $_POST['phone'] ?? ''
            );
            break;

        case 'changePassword':
            $response = changePassword(
                $userId,
                $_POST['currentPassword'] ?? '',
                $_POST['newPassword'] ?? ''
            );
            break;
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 
<?php
session_start();
require_once 'db_connection.php';

// Función para procesar el login
function processLogin($email, $password) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            $_SESSION['user_role'] = $user['rol'];
            
            return [
                'success' => true, 
                'message' => 'Login exitoso',
                'user_role' => $user['rol']
            ];
        } else {
            return ['success' => false, 'message' => 'Credenciales inválidas'];
        }
    } catch(PDOException $e) {
        return ['success' => false, 'message' => 'Error en el servidor'];
    }
}

// Función para procesar el registro
function processRegister($nombre, $email, $password, $rol) {
    global $pdo;
    
    try {
        // Verificar si el email ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            return ['success' => false, 'message' => 'El email ya está registrado'];
        }

        // Insertar nuevo usuario
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nombre, $email, $hashedPassword, $rol]);

        return ['success' => true, 'message' => 'Registro exitoso'];
    } catch(PDOException $e) {
        return ['success' => false, 'message' => 'Error en el servidor'];
    }
}

// Procesar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $response = ['success' => false, 'message' => 'Acción no válida'];

    if ($action === 'login') {
        $response = processLogin($_POST['email'], $_POST['password']);
    } elseif ($action === 'register') {
        $response = processRegister(
            $_POST['nombre'],
            $_POST['email'],
            $_POST['password'],
            $_POST['rol']
        );
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 
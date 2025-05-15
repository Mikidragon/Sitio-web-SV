<?php
session_start();
include_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $database = new Database();
    $db = $database->getConnection();

    $email = $_POST['email'];
    $password = $_POST['password'];

    try {
        $query = "SELECT id, nombre, email, password, rol FROM usuarios WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($password, $row['password'])) {
                // Login exitoso
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['nombre'] = $row['nombre'];
                $_SESSION['rol'] = $row['rol'];

                // Redirigir según el rol
                switch($row['rol']) {
                    case 'admin':
                        $response = ["success" => true, "redirect" => "admin_panel.html"];
                        break;
                    case 'profesor':
                        $response = ["success" => true, "redirect" => "./programaweb/teacher_panel.html"];
                        break;
                    case 'estudiante':
                        $response = ["success" => true, "redirect" => "./programaweb/index.html"];
                        break;
                    default:
                        $response = ["success" => false, "message" => "Rol no válido"];
                }
            } else {
                $response = ["success" => false, "message" => "Contraseña incorrecta"];
            }
        } else {
            $response = ["success" => false, "message" => "Usuario no encontrado"];
        }
    } catch(PDOException $e) {
        $response = ["success" => false, "message" => "Error en el servidor"];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}
?> 
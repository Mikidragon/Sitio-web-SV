-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_escolar;
USE sistema_escolar;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'profesor', 'estudiante') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto
-- Contraseña: Admin123
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@escuela.com', 
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
        'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insertar un profesor de prueba (contraseña: Profesor123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Profesor Demo', 'profesor@escuela.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'profesor');

-- Insertar un estudiante de prueba (contraseña: Estudiante123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Estudiante Demo', 'estudiante@escuela.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'estudiante'); 
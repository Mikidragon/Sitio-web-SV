// Definir roles y permisos
const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
};

const PERMISSIONS = {
    VIEW_FILES: 'view_files',
    UPLOAD_HOMEWORK: 'upload_homework',
    UPLOAD_MATERIALS: 'upload_materials',
    DELETE_FILES: 'delete_files',
    GRADE_HOMEWORK: 'grade_homework',
    MANAGE_USERS: 'manage_users'
};

// Configuración de permisos por rol
const rolePermissions = {
    [ROLES.STUDENT]: [
        PERMISSIONS.VIEW_FILES,
        PERMISSIONS.UPLOAD_HOMEWORK
    ],
    [ROLES.TEACHER]: [
        PERMISSIONS.VIEW_FILES,
        PERMISSIONS.UPLOAD_MATERIALS,
        PERMISSIONS.DELETE_FILES,
        PERMISSIONS.GRADE_HOMEWORK
    ],
    [ROLES.ADMIN]: [
        PERMISSIONS.VIEW_FILES,
        PERMISSIONS.UPLOAD_MATERIALS,
        PERMISSIONS.DELETE_FILES,
        PERMISSIONS.GRADE_HOMEWORK,
        PERMISSIONS.MANAGE_USERS
    ]
};

// Clase para manejar la autenticación
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.checkAuthStatus();
    }

    // Verificar el estado de autenticación al cargar
    checkAuthStatus() {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            this.currentUser = JSON.parse(userSession);
            this.updateUI();
        } else {
            this.redirectToLogin();
        }
    }

    // Manejar el inicio de sesión
    async login(username, password, role) {
        try {
            // Aquí iría la llamada al backend para verificar credenciales
            // Por ahora simulamos una respuesta
            const user = await this.mockLoginRequest(username, password, role);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('userSession', JSON.stringify(user));
                this.updateUI();
                return true;
            }
        } catch (error) {
            console.error('Error en inicio de sesión:', error);
            return false;
        }
    }


    // Verificar si el usuario tiene un permiso específico
    hasPermission(permission) {
        if (!this.currentUser) return false;
        const userPermissions = rolePermissions[this.currentUser.role] || [];
        return userPermissions.includes(permission);
    }

    // Simular una petición de login al servidor
    async mockLoginRequest(username, password, role) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simular validación de credenciales
        if (username && password) {
            return {
                id: Math.random().toString(36).substr(2, 9),
                username,
                role,
                name: `Usuario ${role === ROLES.TEACHER ? 'Docente' : 'Estudiante'}`,
                permissions: rolePermissions[role]
            };
        }
        return null;
    }

    // Redirigir a la página de login
    redirectToLogin() {
        if (!window.location.pathname.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
    }

   /**
 * Actualiza la interfaz de usuario según el rol del usuario actual
 * Muestra u oculta elementos basándose en los permisos y el rol
 */
updateUI() {
    // Verificar si hay un usuario autenticado
    if (!this.currentUser) {
        console.log('No hay usuario autenticado');
        return;
    }

    const userRole = this.currentUser.role;
    const userPermissions = rolePermissions[userRole] || [];

    // Función para verificar permisos
    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    // Ocultar/mostrar elementos según el rol y permisos
    document.querySelectorAll('[data-role]').forEach(element => {
        const requiredRole = element.dataset.role;
        const showElement = 
            // Si el elemento pertenece al rol actual
            userRole === requiredRole ||
            // Si el usuario es administrador y el elemento es para docentes
            (userRole === ROLES.ADMIN && requiredRole === ROLES.TEACHER);

        // Mostrar u ocultar el elemento
        element.style.display = showElement ? '' : 'none';
    });

    // Opcional: Mostrar mensaje con el rol actual
    console.log(`Interfaz actualizada correctamente para el rol: ${userRole}`);
}
    }

// Inicializar el manejador de autenticación
const authManager = new AuthManager();

// Función para manejar el envío del formulario de login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('.tab-btn.active').textContent.toLowerCase();

    authManager.login(username, password, role)
        .then(success => {
            if (success) {
                if (role === 'teacher') {
                    window.location.href = './teacher_panel.html';
                } else if (role === 'admin'){
                    window.location.href = 'admin:_panel.html';
            } else {
                window.location.href = 'index.html';
            }
        };

    return false;
}

// Función para cambiar entre pestañas de estudiante/docente
function switchTab(role) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
} 
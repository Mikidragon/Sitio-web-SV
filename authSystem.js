class AdvancedAuthSystem {
    constructor() {
        this.baseUrl = '/api/auth';
        this.refreshInterval = 1000 * 60 * 15; // 15 minutos
    }

    // Sistema de roles jerárquico
    static ROLES = {
        ADMIN: {
            level: 3,
            permissions: ['manage_users', 'manage_courses', 'manage_grades', 'manage_system']
        },
        TEACHER: {
            level: 2,
            permissions: ['view_courses', 'manage_grades', 'upload_content', 'communicate']
        },
        STUDENT: {
            level: 1,
            permissions: ['view_grades', 'submit_homework', 'view_content']
        }
    };

    async login(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCSRFToken()
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                this.setupSession(data);
                this.startTokenRefresh();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en autenticación:', error);
            return false;
        }
    }

    setupSession(data) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        this.setUserData(data.user);
        this.setupAxiosInterceptors();
    }

    // Sistema de permisos granular
    hasPermission(permission) {
        const userData = this.getUserData();
        const rolePermissions = AdvancedAuthSystem.ROLES[userData.role].permissions;
        return rolePermissions.includes(permission);
    }

    // Verificación de seguridad en dos pasos
    async setupTwoFactor(phoneNumber) {
        // Implementación de 2FA
    }
} 
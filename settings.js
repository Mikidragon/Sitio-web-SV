document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuraciones guardadas
    loadSettings();

    // Configurar manejadores de eventos
    setupEventListeners();
});

function loadSettings() {
    // Obtener configuraciones del localStorage
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Aplicar configuraciones de notificaciones
    document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
    document.getElementById('assignmentNotifications').checked = settings.assignmentNotifications !== false;
    document.getElementById('eventReminders').checked = settings.eventReminders !== false;
    
    // Aplicar configuraciones de apariencia
    document.getElementById('theme').value = settings.theme || 'light';
    document.getElementById('fontSize').value = settings.fontSize || 'medium';
    
    // Aplicar configuraciones de privacidad
    document.getElementById('twoFactorAuth').checked = settings.twoFactorAuth === true;
    document.getElementById('showOnlineStatus').checked = settings.showOnlineStatus !== false;

    // Aplicar tema
    applyTheme(settings.theme || 'light');
    
    // Aplicar tamaño de fuente
    applyFontSize(settings.fontSize || 'medium');
}

function setupEventListeners() {
    // Escuchar cambios en el tema
    document.getElementById('theme').addEventListener('change', function(e) {
        applyTheme(e.target.value);
        saveSettings();
    });

    // Escuchar cambios en el tamaño de fuente
    document.getElementById('fontSize').addEventListener('change', function(e) {
        applyFontSize(e.target.value);
        saveSettings();
    });

    // Escuchar cambios en cualquier switch o select
    document.querySelectorAll('input[type="checkbox"], select').forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    // Configurar botones de acción
    document.querySelector('.btn-primary').addEventListener('click', saveSettings);
    document.querySelector('.btn-secondary').addEventListener('click', resetSettings);
}

function saveSettings() {
    const settings = {
        // Notificaciones
        emailNotifications: document.getElementById('emailNotifications').checked,
        assignmentNotifications: document.getElementById('assignmentNotifications').checked,
        eventReminders: document.getElementById('eventReminders').checked,
        
        // Apariencia
        theme: document.getElementById('theme').value,
        fontSize: document.getElementById('fontSize').value,
        
        // Privacidad
        twoFactorAuth: document.getElementById('twoFactorAuth').checked,
        showOnlineStatus: document.getElementById('showOnlineStatus').checked
    };

    // Guardar en localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));

    // Mostrar mensaje de éxito
    showToast('Configuraciones guardadas correctamente');
}

function resetSettings() {
    const defaultSettings = {
        emailNotifications: true,
        assignmentNotifications: true,
        eventReminders: true,
        theme: 'light',
        fontSize: 'medium',
        twoFactorAuth: false,
        showOnlineStatus: true
    };

    // Guardar configuraciones por defecto
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));

    // Recargar configuraciones
    loadSettings();

    // Mostrar mensaje
    showToast('Configuraciones restauradas a valores predeterminados');
}

function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
}

function applyFontSize(size) {
    const sizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
    };
    document.documentElement.style.fontSize = sizes[size] || sizes.medium;
}

function showToast(message) {
    // Crear elemento toast si no existe
    let toast = document.getElementById('settingsToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'settingsToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a237e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
    }

    // Mostrar mensaje
    toast.textContent = message;
    toast.style.opacity = '1';

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
} 
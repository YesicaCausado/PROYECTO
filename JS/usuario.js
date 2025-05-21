// Simulación de base de datos de usuarios
let users = [];
let currentUser = null;

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const configLink = document.querySelector('.config-link'); // Enlace de Configuración

// Login
loginForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Verificar credenciales (simulado)
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        updateUI();
        window.location.href = 'index.html'; // Redirige al inicio
    } else {
        alert('Credenciales incorrectas');
    }
});

// Registro
registerForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Guardar usuario (simulado)
    users.push({ name, email, password });
    currentUser = { name, email };
    updateUI();
    alert('¡Registro exitoso!');
    mostrarLogin(); // Vuelve al formulario de login
});

// Actualizar la UI según el estado de sesión
function updateUI() {
    const navLinks = document.querySelector('.nav-links');
    if (currentUser) {
        // Mostrar Configuración
        if (!document.querySelector('.config-link')) {
            const configLink = document.createElement('a');
            configLink.href = '#configuracion';
            configLink.className = 'config-link';
            configLink.textContent = '⚙️ Configuración';
            navLinks.appendChild(configLink);
        }
    } else {
        // Ocultar Configuración
        const configLink = document.querySelector('.config-link');
        if (configLink) configLink.remove();
    }
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Simular persistencia de sesión (ej. si recargas la página)
    if (localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    updateUI();
});

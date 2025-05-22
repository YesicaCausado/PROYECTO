document.addEventListener('DOMContentLoaded', () => {
  // Nombre de usuario
  const nombre = localStorage.getItem('nombreUsuario') || 'Mi perfil';
  const nombreSpan = document.querySelector('.nombre-usuario');
  if (nombreSpan) nombreSpan.textContent = nombre;

  // Imagen de perfil (usa la misma clave que en myperfil.html)
  const imagenPerfil = localStorage.getItem('avatar');
  const iconoPerfil = document.getElementById('iconoPerfil');
  if (imagenPerfil && iconoPerfil) {
    iconoPerfil.src = imagenPerfil;
  }
});
document.addEventListener("DOMContentLoaded", () => { 
  const params = new URLSearchParams(window.location.search);
  const ingrediente = params.get("ingrediente");

  console.log("Ingrediente recibido:", ingrediente);

  const resultadosLista = document.querySelector("#resultados-lista");

  if (ingrediente) {
    resultadosLista.innerHTML = `
      <div class="loading">
        <p>Buscando recetas con "${ingrediente}"...</p>
        <div class="spinner"></div>
      </div>
    `;

    obtenerRecetas(ingrediente);
  } else {
    resultadosLista.innerHTML = `
      <div class="error">
        <p>No se ha proporcionado un ingrediente para buscar.</p>
        <a href="index.html">Volver al inicio</a>
      </div>
    `;
  }
});

async function obtenerRecetas(ingrediente) {
  const apiKey = "ca6497e5ffbb4d6180d17c180e75ff2f";
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingrediente)}&number=5&apiKey=${apiKey}`;
  const resultadosLista = document.querySelector("#resultados-lista");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener recetas: ${response.status}`);
    }

    const recetas = await response.json();

    if (recetas.length === 0) {
      resultadosLista.innerHTML = `
        <div class="error">
          <p>No se encontraron recetas con "${ingrediente}".</p>
          <a href="index.html" class="buscar-mas">Volver al inicio</a>
        </div>
      `;
      return;
    }

    // Obtener favoritas guardadas
    const favoritas = JSON.parse(localStorage.getItem("favoritas")) || [];

    resultadosLista.innerHTML = `
      <div class="receta-container">
        <h2 class="titulo-recetas">Recetas con "${ingrediente}"</h2>
        <div class="recetas-grid">
          ${recetas.map(r => `
            <div class="receta">
              <h3>${r.title}</h3>
              <img src="${r.image}" alt="${r.title}" width="200">
              <p>Usa ${r.usedIngredientCount} ingrediente(s) que tienes.</p>
              <p>Faltan ${r.missedIngredientCount} ingrediente(s).</p>
              <a href="https://spoonacular.com/recipes/${r.title.replace(/ /g, "-")}-${r.id}" target="_blank">Ver receta</a>
              <div class="estrellas-favorito">
                <div class="estrellas" data-rating="0">
                  <span class="estrella" data-value="1">&#9734;</span>
                  <span class="estrella" data-value="2">&#9734;</span>
                  <span class="estrella" data-value="3">&#9734;</span>
                  <span class="estrella" data-value="4">&#9734;</span>
                  <span class="estrella" data-value="5">&#9734;</span>
                </div>
                <button class="favorito-btn ${favoritas.includes(r.id) ? 'favorito-activo' : ''}" 
                        data-id="${r.id}" 
                        title="${favoritas.includes(r.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}" 
                        onclick="toggleFavorito(${r.id}, this)">
                  <svg class="favorito-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        <button onclick="window.location.href='index.html'" class="buscar-mas">Buscar otra receta</button>
      </div>
    `;
    
    inicializarEstrellas();
  } catch (error) {
    console.error("Error:", error);
    resultadosLista.innerHTML = `
      <div class="error">
        <p>Error al buscar recetas: ${error.message}</p>
        <p>Intenta con otro ingrediente o regresa más tarde.</p>
        <a href="index.html" class="buscar-mas">Volver al inicio</a>
      </div>
    `;
  }
}

function toggleFavorito(id, boton) {
  const favoritas = JSON.parse(localStorage.getItem("favoritas")) || [];
  const esFavorito = favoritas.includes(id);
  
  if (esFavorito) {
    // Quitar de favoritos
    const index = favoritas.indexOf(id);
    favoritas.splice(index, 1);
    boton.classList.remove('favorito-activo');
    boton.title = 'Agregar a favoritos';
    mostrarNotificacion('Receta quitada de favoritos', 'info');
  } else {
    // Agregar a favoritos
    favoritas.push(id);
    boton.classList.add('favorito-activo');
    boton.title = 'Quitar de favoritos';
    mostrarNotificacion('¡Receta guardada en favoritos!', 'success');
  }
  
  localStorage.setItem("favoritas", JSON.stringify(favoritas));
}

function mostrarNotificacion(mensaje, tipo = 'success') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.innerHTML = `
    <div class="notificacion-contenido">
      <span class="notificacion-icono">
        ${tipo === 'success' ? '✓' : 'ℹ'}
      </span>
      <span class="notificacion-texto">${mensaje}</span>
    </div>
  `;
  
  // Agregar al body
  document.body.appendChild(notificacion);
  
  // Mostrar con animación
  setTimeout(() => {
    notificacion.classList.add('mostrar');
  }, 100);
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

function guardarReceta(id) {
  const recetasGuardadas = JSON.parse(localStorage.getItem("recetasGuardadas")) || [];
  if (!recetasGuardadas.includes(id)) {
    recetasGuardadas.push(id);
    localStorage.setItem("recetasGuardadas", JSON.stringify(recetasGuardadas));
    mostrarNotificacion("Receta guardada correctamente", "success");
  } else {
    mostrarNotificacion("Esta receta ya está guardada", "info");
  }
}

// Función legacy - mantener por compatibilidad
function guardarComoFavorita(id) {
  const boton = document.querySelector(`[data-id="${id}"]`);
  if (boton) {
    toggleFavorito(id, boton);
  }
}

function inicializarEstrellas() {
  document.querySelectorAll('.estrellas').forEach(estrellasDiv => {
    const estrellas = estrellasDiv.querySelectorAll('.estrella');
    let rating = 0;

    estrellas.forEach((estrella, idx) => {
      // Hover effect
      estrella.addEventListener('mouseenter', () => {
        estrellas.forEach((e, i) => {
          e.classList.toggle('hovered', i <= idx);
        });
      });
      estrella.addEventListener('mouseleave', () => {
        estrellas.forEach(e => e.classList.remove('hovered'));
      });

      // Click to rate
      estrella.addEventListener('click', () => {
        rating = idx + 1;
        estrellasDiv.dataset.rating = rating;
        estrellas.forEach((e, i) => {
          e.classList.toggle('selected', i < rating);
        });
        mostrarNotificacion(`Calificaste con ${rating} estrella${rating > 1 ? 's' : ''}`, 'success');
      });
    });
  });
}

// Al guardar la imagen en "Mi perfil"
localStorage.setItem('imagenPerfil', imagenBase64); // imagenBase64 es el string de la imagen
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
  const apiKey = "ca6497e5ffbb4d6180d17c180e75ff2f"; // Reemplaza con tu API Key de Spoonacular
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

    resultadosLista.innerHTML = `
      <div class="receta-container">
        <h2>Recetas con "${ingrediente}"</h2>
        <div class="recetas-grid">
          ${recetas.map(r => `
            <div class="receta">
              <h3>${r.title}</h3>
              <img src="${r.image}" alt="${r.title}" width="200">
              <p>Usa ${r.usedIngredientCount} ingrediente(s) que tienes.</p>
              <p>Faltan ${r.missedIngredientCount} ingrediente(s).</p>
              <a href="https://spoonacular.com/recipes/${r.title.replace(/ /g, "-")}-${r.id}" target="_blank">Ver receta</a>
            </div>
          `).join('')}
        </div>
        <button onclick="window.location.href='index.html'" class="buscar-mas">Buscar otra receta</button>
      </div>
    `;
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
function guardarReceta(id) {
  const recetasGuardadas = JSON.parse(localStorage.getItem("recetasGuardadas")) || [];
  if (!recetasGuardadas.includes(id)) {
    recetasGuardadas.push(id);
    localStorage.setItem("recetasGuardadas", JSON.stringify(recetasGuardadas));
    alert("Receta guardada correctamente.");
  } else {
    alert("Esta receta ya está guardada.");
  }
}
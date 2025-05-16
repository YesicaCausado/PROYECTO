const apiKey = "ca6497e5ffbb4d6180d17c180e75ff2f";  // Reemplaza con tu API Key real

async function buscarRecetas() {
  const ingredientes = document.getElementById("ingredientsInput").value;
  const resultadosDiv = document.getElementById("resultados");

  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientes)}&number=5&apiKey=${apiKey}`;

  try {
    const respuesta = await fetch(url);
    const recetas = await respuesta.json();

    resultadosDiv.innerHTML = "";

    recetas.forEach(receta => {
      const recetaHTML = `
        <div>
          <h3>${receta.title}</h3>
          <img src="${receta.image}" alt="${receta.title}" width="200">
        </div>
      `;
      resultadosDiv.innerHTML += recetaHTML;
    });
  } catch (error) {
    resultadosDiv.innerHTML = "<p>Error al buscar recetas</p>";
    console.error(error);
  }
}

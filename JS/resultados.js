document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const ingrediente = params.get("ingrediente");
    console.log("ingrediente recibido:", ingrediente); // Verifica el valor del ingrediente recibido
    if (ingrediente) {
      obtenerRecetas(ingrediente);
    } else{
        console.log("No se ha proporcionado un ingrediente para buscar.");
    }
  });
  
  async function obtenerRecetas(ingrediente) {
    console.log("Obteniendo recetas para el ingrediente:", ingrediente); // Verifica el valor del ingrediente   
    try {
      const response = await fetch(`/api/generarReceta?ingrediente=${encodeURIComponent(ingrediente)}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener la receta: ${response.status}`);
      }
  
      const data = await response.json();
  
      const resultadosLista = document.querySelector("#resultados-lista");
      resultadosLista.innerHTML = `
        <div class="receta">
          <pre>${data.receta}</pre>
        </div>
      `;
  
    } catch (error) {
      console.error("Error:", error);
      const resultadosLista = document.querySelector("#resultados-lista");
      resultadosLista.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
  
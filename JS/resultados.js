document.addEventListener("DOMContentLoaded", () => {
    // Obtener el ingrediente de los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const ingrediente = params.get("ingrediente");
    
    console.log("Ingrediente recibido:", ingrediente);
    
    // Verificar si se recibió un ingrediente
    if (ingrediente) {
      // Mostrar un mensaje de carga
      const resultadosLista = document.querySelector("#resultados-lista");
      resultadosLista.innerHTML = `
        <div class="loading">
          <p>Buscando recetas con ${ingrediente}...</p>
          <div class="spinner"></div>
        </div>
      `;
      
      // Llamar a la función para obtener recetas
      obtenerRecetas(ingrediente);
    } else {
      // Mostrar un mensaje de error si no hay ingrediente
      const resultadosLista = document.querySelector("#resultados-lista");
      resultadosLista.innerHTML = `
        <div class="error">
          <p>No se ha proporcionado un ingrediente para buscar.</p>
          <a href="index.html">Volver al inicio</a>
        </div>
      `;
    }
  });
  
  async function obtenerRecetas(ingrediente) {
    try {
      // Realizar la solicitud a la API
      const response = await fetch(`/api/generarReceta?ingrediente=${encodeURIComponent(ingrediente)}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener la receta: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Formatear la receta para mejor visualización
      const recetaFormateada = formatearReceta(data.receta);
      
      // Mostrar la receta en la página
      const resultadosLista = document.querySelector("#resultados-lista");
      resultadosLista.innerHTML = `
        <div class="receta-container">
          <h2>Receta con ${ingrediente}</h2>
          <div class="receta">
            ${recetaFormateada}
          </div>
          <button onclick="window.location.href='index.html'" class="buscar-mas">Buscar otra receta</button>
        </div>
      `;
  
    } catch (error) {
      console.error("Error:", error);
      
      // Mostrar mensaje de error
      const resultadosLista = document.querySelector("#resultados-lista");
      resultadosLista.innerHTML = `
        <div class="error">
          <p>Error al buscar recetas: ${error.message}</p>
          <p>Intenta con otro ingrediente o regresa más tarde.</p>
          <a href="index.html" class="buscar-mas">Volver al inicio</a>
        </div>
      `;
    }
  }
  
  // Función para formatear la receta con HTML para mejor visualización
  function formatearReceta(textoReceta) {
    // Dividir el texto en líneas
    const lineas = textoReceta.split('\n');
    let html = '';
    
    // Procesar cada línea
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      
      if (!linea) {
        // Línea vacía
        html += '<br>';
      } else if (linea.endsWith(':')) {
        // Encabezados (terminados en :)
        html += `<h3>${linea}</h3>`;
      } else if (linea.match(/^\d+\.\s/)) {
        // Pasos numerados
        html += `<p class="paso">${linea}</p>`;
      } else if (linea.match(/^-\s/)) {
        // Elementos de lista
        html += `<p class="ingrediente">${linea}</p>`;
      } else if (i === 0 || (i > 0 && !lineas[i-1].trim())) {
        // Primera línea o después de una línea en blanco (probable título)
        html += `<h2>${linea}</h2>`;
      } else {
        // Texto normal
        html += `<p>${linea}</p>`;
      }
    }
    
    return html;
  }
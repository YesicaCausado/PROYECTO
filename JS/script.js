// -------- Código del slider --------
let currentSlide = 0;
const slides = document.querySelectorAll(".slider .slide");

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

setInterval(nextSlide, 4000);

// -------- Código de búsqueda de ingredientes --------
document.addEventListener("DOMContentLoaded", function() {
  const searchForm = document.querySelector('#searchForm'); // Obtén el formulario
  const ingredienteInput = document.querySelector('#ingrediente'); // Obtén el campo de ingrediente

  // Cuando se envíe el formulario, ejecutamos la lógica de búsqueda
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const ingrediente = ingredienteInput.value.trim(); // Obtén el ingrediente ingresado

    if (ingrediente) {
      // Redirige a resultados.html pasando el ingrediente en la URL
      window.location.href = `resultados.html?ingrediente=${encodeURIComponent(ingrediente)}`;
    } else {
      alert("Por favor ingresa un ingrediente.");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Obtener el parámetro 'ingrediente' de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const ingrediente = urlParams.get("ingrediente");

  // Mostrar el ingrediente en la página
  const resultadosLista = document.querySelector("#resultados-lista");

  if (!resultadosLista) {
    console.error("No se encontró el elemento #resultados-lista");
    return;  // Detener ejecución si no se encuentra el elemento
  }

  if (ingrediente) {
    obtenerRecetas(ingrediente);
  } else {
    resultadosLista.innerHTML = "<p>No se ha proporcionado un ingrediente para buscar.</p>";
  }
});

async function obtenerRecetas(ingrediente) {
  try {
    // Supón que tienes una API que te devuelve las recetas.
    // Aquí pongo un ejemplo de una API simulada. Reemplázalo con tu API real.
    const response = await fetch(`https://api.ejemplo.com/recetas?ingrediente=${ingrediente}`);
    
    if (!response.ok) {
      throw new Error("Error al obtener las recetas");
    }

    const recetas = await response.json();
    
    if (!Array.isArray(recetas) || recetas.length === 0) {
      throw new Error("No se encontraron recetas con ese ingrediente.");
    }

    const resultadosLista = document.querySelector("#resultados-lista");
    resultadosLista.innerHTML = "";  // Limpiar los resultados anteriores

    recetas.forEach((receta) => {
      const recetaDiv = document.createElement("div");
      recetaDiv.classList.add("receta");
      recetaDiv.innerHTML = `
        <h3>${receta.nombre}</h3>
        <p>${receta.descripcion}</p>
      `;
      resultadosLista.appendChild(recetaDiv);
    });
    
  } catch (error) {
    console.error(error);
    const resultadosLista = document.querySelector("#resultados-lista");
    if (resultadosLista) {
      resultadosLista.innerHTML = `<p>${error.message}</p>`;
    }
  }
}



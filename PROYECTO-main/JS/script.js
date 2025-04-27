// Script para manejar el formulario de búsqueda
document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.search-box');
    const searchInput = searchForm.querySelector('input');
    
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const ingredients = searchInput.value.trim();
  
      if (ingredients === "") {
        alert("Por favor, ingresa al menos un ingrediente.");
      } else {
        alert(`Buscando recetas con los ingredientes: ${ingredients}`);
        // Aquí podrías agregar más lógica para mostrar las recetas, como una llamada a una API.
      }
    });
  });
  
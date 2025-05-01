// Script principal para manejar la búsqueda en la página de inicio

document.addEventListener("DOMContentLoaded", function() {
  // Obtener el formulario de búsqueda
  const searchForm = document.getElementById("searchForm");
  
  // Agregar evento para manejar el envío del formulario
  if (searchForm) {
      searchForm.addEventListener("submit", function(event) {
          event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
          
          // Obtener el valor del ingrediente ingresado
          const ingrediente = document.getElementById("ingrediente").value.trim();
          
          if (ingrediente) {
              // Redirigir a la página de resultados con el ingrediente como parámetro de URL
              window.location.href = `resultados.html?ingrediente=${encodeURIComponent(ingrediente)}`;
          } else {
              alert("Por favor ingresa un ingrediente para buscar recetas.");
          }
      });
  }
  
  // Código para el slider de beneficios
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
  
  // Iniciar el slider automático si hay slides
  if (slides.length > 0) {
      setInterval(nextSlide, 4000);
  }
});
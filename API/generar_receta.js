export default async function handler(req, res) {
    const { ingrediente } = req.query;
  
    if (!ingrediente) {
      return res.status(400).json({ error: "Falta el parámetro 'ingrediente'" });
    }
  
    try {
      const apiKey = "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
                       ";
  
      const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Eres un chef creativo que crea recetas fáciles, deliciosas y detalladas."
            },
            {
              role: "user",
              content: `Por favor crea una receta usando ${ingrediente}. Incluye: nombre de la receta, lista de ingredientes, pasos de preparación y tiempo estimado.`
            }
          ],
          temperature: 0.7
        })
      });
  
      if (!respuesta.ok) {
        throw new Error(`Error de la API: ${respuesta.status}`);
      }
  
      const data = await respuesta.json();
      const recetaGenerada = data.choices[0].message.content;
  
      res.status(200).json({ receta: recetaGenerada });
  
    } catch (error) {
      console.error("Error al generar receta:", error);
      res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
  }
  
// api/generarReceta.js
import OpenAI from 'openai';

// Handler de la API
export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejo de solicitudes preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo aceptar solicitudes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener el ingrediente de la consulta
    const ingrediente = req.query.ingrediente;
    
    if (!ingrediente) {
      return res.status(400).json({ error: 'Se requiere un ingrediente' });
    }

    console.log(`Generando receta para: ${ingrediente}`);

    // Configuración de OpenAI (versión moderna de la API)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Preparar el prompt para OpenAI
    const prompt = `Crea una receta de cocina utilizando principalmente ${ingrediente}. 
    Incluye:
    - Título atractivo
    - Lista de ingredientes con cantidades
    - Instrucciones paso a paso
    - Tiempo de preparación
    - Nivel de dificultad
    - Consejos adicionales

    Formatea la receta de manera clara y ordenada.`;

    try {
      // Intento con la API moderna
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un chef experto que crea recetas deliciosas." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      // Retornar la receta generada
      const recetaGenerada = completion.choices[0].message.content.trim();
      console.log("Receta generada correctamente");
      return res.status(200).json({ receta: recetaGenerada });
    } catch (openaiError) {
      console.log("Error en API moderna, intentando con API legacy:", openaiError.message);
      
      // Si falla, intentar con la API anterior (por compatibilidad)
      // Nota: esto es solo por seguridad, si tienes una API key nueva debería funcionar el código de arriba
      try {
        // Importación dinámica de la versión antigua de la API
        const { Configuration, OpenAIApi } = await import('openai');
        
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        
        const openaiLegacy = new OpenAIApi(configuration);
        
        const completionLegacy = await openaiLegacy.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.7,
        });
        
        const recetaGenerada = completionLegacy.data.choices[0].text.trim();
        console.log("Receta generada correctamente con API legacy");
        return res.status(200).json({ receta: recetaGenerada });
      } catch (legacyError) {
        console.error("Error también en API legacy:", legacyError);
        throw openaiError; // Lanzar el error original
      }
    }
  } catch (error) {
    console.error('Error completo al generar la receta:', error);
    
    // Preparar un mensaje de error más informativo
    let errorMessage = error.message || 'Error desconocido';
    let errorDetails = {};
    
    // Si es un error de OpenAI, extraer más detalles
    if (error.response) {
      errorDetails = {
        status: error.response.status,
        data: error.response.data,
      };
      errorMessage = `Error de OpenAI: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    }
    
    res.status(500).json({ 
      error: 'Error al generar la receta', 
      message: errorMessage,
      details: errorDetails,
      apiKey: process.env.OPENAI_API_KEY ? 'API key configurada' : 'API key no configurada'
    });
  }
}
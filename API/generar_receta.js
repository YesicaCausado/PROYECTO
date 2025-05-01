// api/generarReceta.js
import { Configuration, OpenAIApi } from 'openai';

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  // Permitir solicitudes CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verificar que sea un método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener el ingrediente de la consulta
    const ingrediente = req.query.ingrediente;
    
    if (!ingrediente) {
      return res.status(400).json({ error: 'Se requiere un ingrediente' });
    }

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

    // Hacer la solicitud a la API de OpenAI
    const completion = await openai.createCompletion({
      model: "text-davinci-003", // Puedes ajustar el modelo según tu API key
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Retornar la receta generada
    res.status(200).json({ receta: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error al generar la receta:', error);
    res.status(500).json({ error: 'Error al generar la receta', details: error.message });
  }
}
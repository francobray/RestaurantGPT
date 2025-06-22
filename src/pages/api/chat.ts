import 'dotenv/config';
import type { Request, Response } from 'express';
import { Client } from '@googlemaps/google-maps-services-js';

function formatPlaceDetails(place: any): string {
  const name = place.name || 'Nombre no disponible';
  const address = place.formatted_address || 'Dirección no disponible';
  const rating = place.rating ? `${place.rating} ⭐` : 'No disponible';
  const totalRatings = place.user_ratings_total || 0;
  const isOpen = place.opening_hours?.open_now ? 'Abierto ahora' : 'Cerrado ahora';

  return `🍽️ **Análisis de ${name}**

📍 **Dirección**: ${address}
🌟 **Rating**: ${rating} (${totalRatings} reseñas)
🚪 **Estado**: ${isOpen}

Este análisis se basa en datos de Google Places. ¿Te gustaría que busque otro restaurante?`;
}

async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }
    
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    console.log('API Key status:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      console.error('Google Places API key is not configured');
      return res.status(500).json({ 
        error: 'Configuración incompleta: Falta la API Key de Google Places. Por favor, crea un archivo .env.local con VITE_GOOGLE_PLACES_API_KEY="tu_clave_aqui"' 
      });
    }

    const client = new Client({});

    console.log('Searching for place:', message);

    // 1. Find the place from text
    const findPlaceResponse = await client.findPlaceFromText({
      params: {
        input: message,
        inputtype: 'textquery',
        fields: ['place_id', 'name'],
        key: apiKey,
      },
    });

    console.log('Find place response status:', findPlaceResponse.data.status);
    console.log('Candidates found:', findPlaceResponse.data.candidates.length);

    if (findPlaceResponse.data.status !== 'OK') {
      console.error('Google Places API error:', findPlaceResponse.data.status, findPlaceResponse.data.error_message);
      return res.status(500).json({ 
        error: `Error de Google Places API: ${findPlaceResponse.data.status}. ${findPlaceResponse.data.error_message || 'Verifica tu API key y que la Places API esté habilitada.'}` 
      });
    }

    if (findPlaceResponse.data.candidates.length === 0) {
      return res.status(200).json({ response: `🤔 No pude encontrar ningún restaurante llamado "${message}". Por favor, intenta con un nombre más específico o verifica que esté escrito correctamente.` });
    }

    const placeId = findPlaceResponse.data.candidates[0].place_id;
    if (!placeId) {
      throw new Error('Place ID not found');
    }

    console.log('Found place ID:', placeId);

    // 2. Get place details
    const placeDetailsResponse = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'opening_hours'],
        key: apiKey,
      },
    });

    console.log('Place details response status:', placeDetailsResponse.data.status);

    if (placeDetailsResponse.data.status !== 'OK') {
      console.error('Google Places Details API error:', placeDetailsResponse.data.status, placeDetailsResponse.data.error_message);
      return res.status(500).json({ 
        error: `Error al obtener detalles del lugar: ${placeDetailsResponse.data.status}. ${placeDetailsResponse.data.error_message || ''}` 
      });
    }

    const responseText = formatPlaceDetails(placeDetailsResponse.data.result);
    
    return res.status(200).json({ response: responseText });

  } catch (error) {
    console.error('Error processing Google Places API request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: `Error interno del servidor: ${errorMessage}` });
  }
}

export { handler };
export default handler; 
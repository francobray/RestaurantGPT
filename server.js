require('dotenv').config({ path: '.env.local' });
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());

function formatPlaceDetails(place) {
  const name = place.name || 'Nombre no disponible';
  const address = place.formatted_address || 'Dirección no disponible';
  const rating = place.rating ? `${place.rating} ⭐ (${place.user_ratings_total || 0} reseñas)` : 'No disponible';
  const primaryCategory = place.types && place.types.length > 0
    ? place.types[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'No disponible';

  return `Encontré este negocio:

🍽️ Nombre: ${name}
🧰 Categoría: ${primaryCategory}
📍 Dirección: ${address}
⭐ Rating: ${rating}`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, placeId: analysisPlaceId, getRecommendations, wantsToSchedule } = req.body;
    
    if (wantsToSchedule) {
      const link = 'Puedes agendar tu llamada aquí: https://calendly.com/franco-rayapp';
      return res.status(200).json({ response: link });
    }

    if (getRecommendations) {
      const allRecommendations = [
        "📝 Missing meta descriptions on 8 pages",
        "🔗 Broken links detected (4)",
        "📉 Low keyword density for primary terms",
        "🛑 Stop pushing customers to 3rd party websites",
        "🐢 Slow page loading speed (5.2s)",
        "📱 Unoptimized website for mobile devices",
        "🗺️ Inconsistent NAP information across directories",
        "🖼️ Missing alt tags on 12 images",
        "⚙️ No schema markup implemented"
      ];

      const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
      const count = Math.floor(Math.random() * 5) + 5; // 5 to 9
      const selected = shuffled.slice(0, count);

      const recommendationsText = "Recomendaciones de mejora:\n\n- " + selected.join('\n- ');
      const followupQuestion = '¿Quieres agendar una llamada con nuestro equipo de expertos para ayudarte a resolver estos puntos?';
      
      return res.status(200).json({ 
        responses: [recommendationsText, followupQuestion],
        nextAction: 'schedule_call'
      });
    }

    // --- Branch for Analysis ---
    if (analysisPlaceId) {
      const analysisResponse = await getAnalysis(analysisPlaceId);
      
      const followupQuestion = '¿Quieres recomendaciones de mejora?';
      
      return res.status(200).json({ 
        responses: [analysisResponse, followupQuestion],
        nextAction: 'get_recommendations' 
      });
    }

    // --- Branch for Search ---
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
      return res.status(200).json({ response: `🤔 No encontré restaurantes llamados "${message}". Por favor, intenta con un nombre más específico o verifica que esté escrito correctamente.` });
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
        fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'opening_hours', 'types'],
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
    const followupQuestion = '¿Analizo este negocio o prefieres cambiar la búsqueda?';
    
    return res.status(200).json({ 
      responses: [
        responseText,
        { type: 'image', url: 'https://www.rayapp.io/wp-content/uploads/2025/06/Screenshot-2025-06-22-at-1.20.57%E2%80%AFp.m.webp' },
        followupQuestion
      ],
      placeId: placeId,
    });

  } catch (error) {
    console.error('Error processing API request:', error);
    const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
    return res.status(500).json({ error: `Error interno del servidor: ${errorMessage}` });
  }
});

async function getAnalysis(placeId) {
  console.log('Starting analysis for placeId:', placeId);
      
  // Simulate Grader API response
  const rayScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
  const websiteScore = Math.floor(Math.random() * 30) + 40; // Random score between 40-69
  
  const analysisText = `Análisis de Temple Craft:

🎯 RAY Score: ${rayScore}%
🔍 Que busca el cliente: "bar cerca mío"
📊 Ranking Google Maps para "bar cercamío": 9
🥊 Competidor mas fuerte: The Dirty Rabbit Wynwood
🌐 Score website: ${websiteScore}%`;

  return analysisText;
}

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
}); 
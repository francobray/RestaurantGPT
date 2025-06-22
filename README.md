# Restaurant GPT Chat

Una aplicación web de chat estilo WhatsApp que permite conversar con "Restaurant GPT" para obtener análisis de competitividad de restaurantes.

## 🚀 Características

- **Interfaz estilo WhatsApp**: Diseño familiar con colores y estilos de WhatsApp
- **Chat en tiempo real**: Mensajes con burbujas, timestamps y indicador de escritura
- **Análisis de restaurantes**: Base de datos simulada con análisis de restaurantes populares
- **Responsive**: Funciona perfectamente en móvil y desktop
- **API simulada**: Endpoint que simula integración con WhatsApp Business API

## 🛠️ Tecnologías

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático para mejor desarrollo
- **Tailwind CSS**: Estilos utilitarios y diseño responsive
- **React Hooks**: Estado y efectos para la funcionalidad del chat

## 📦 Instalación

1. **Clona el repositorio**:
```bash
git clone <tu-repositorio>
cd restaurant-gpt-chat
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Ejecuta el servidor de desarrollo**:
```bash
npm run dev
```

4. **Abre tu navegador**:
```
http://localhost:3000
```

## 🏗️ Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del proyecto

```
restaurant-gpt-chat/
├── app/
│   ├── api/chat/route.ts    # API endpoint para el chat
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal
├── components/
│   ├── ChatWindow.tsx       # Componente de ventana de chat
│   └── MessageInput.tsx     # Componente de entrada de mensajes
├── package.json
├── tailwind.config.js       # Configuración de Tailwind
└── README.md
```

## 🎯 Funcionalidades

### Chat Interface
- **Mensajes de usuario**: Aparecen a la derecha en verde
- **Mensajes del agente**: Aparecen a la izquierda en blanco
- **Indicador de escritura**: Animación de puntos mientras el agente "escribe"
- **Auto-scroll**: La ventana se desplaza automáticamente a nuevos mensajes
- **Timestamps**: Cada mensaje muestra la hora de envío

### Análisis de Restaurantes
La aplicación incluye una base de datos simulada con análisis de:
- **McDonald's**
- **Burger King**
- **Domino's Pizza**
- **Starbucks**

Para cada restaurante proporciona:
- Puntuación y calificación
- Tiempos de entrega
- Rango de precios
- Fortalezas y debilidades
- Recomendaciones de mejora

## 🔧 Configuración de API

### Cambiar URL de la API
Si necesitas cambiar la URL de la API, edita el archivo `app/page.tsx` en la línea donde se hace el fetch:

```typescript
const response = await fetch('/api/chat', {
  // Cambia '/api/chat' por tu URL personalizada
  // Ejemplo: 'https://tu-api.com/chat'
})
```

### Integración con APIs reales
Para integrar con APIs reales como OpenAI, HuBot o WhatsApp Business:

1. **Modifica `app/api/chat/route.ts`**:
```typescript
// Reemplaza la lógica simulada con llamadas reales
const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }]
  })
})
```

2. **Configura variables de entorno**:
Crea un archivo `.env.local`:
```
OPENAI_API_KEY=tu_api_key_aqui
WHATSAPP_API_TOKEN=tu_token_aqui
```

## 🎨 Personalización

### Colores de WhatsApp
Los colores están definidos en `tailwind.config.js`:
```javascript
colors: {
  whatsapp: {
    green: '#25D366',      // Verde principal
    dark: '#128C7E',       // Verde oscuro
    light: '#DCF8C6',      // Verde claro
    gray: '#E5DDD5',       // Gris de fondo
    darkgray: '#667781',   // Gris oscuro
  }
}
```

### Agregar más restaurantes
Edita `app/api/chat/route.ts` y agrega entradas al objeto `restaurantDatabase`:
```typescript
const restaurantDatabase = {
  'tu-restaurante': {
    name: 'Tu Restaurante',
    rating: 4.5,
    deliveryTime: '20-30 min',
    priceRange: 'Medio',
    strengths: ['Fortaleza 1', 'Fortaleza 2'],
    weaknesses: ['Debilidad 1', 'Debilidad 2'],
    recommendations: ['Recomendación 1', 'Recomendación 2']
  }
}
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. Configura las variables de entorno si es necesario
4. ¡Listo!

### Otros proveedores
La aplicación es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

¡Disfruta usando Restaurant GPT Chat! 🍽️🤖 
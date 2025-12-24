// Almacenamiento global para datos del ESP32
global.esp32Data = global.esp32Data || null;

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Endpoint para recibir datos del ESP32 via POST",
        last_data: global.esp32Data,
        status: "active"
      })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body || '{}');
      
      if (!data || typeof data.weight !== 'number') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'Datos inválidos. Se requiere peso numérico.' 
          })
        };
      }

      // Almacenar datos con timestamp
      global.esp32Data = {
        ...data,
        received_at: Date.now(),
        timestamp: new Date().toISOString()
      };

      console.log(`[ESP32] ✅ Datos recibidos: ${data.weight} kg`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Datos recibidos correctamente",
          weight: data.weight,
          timestamp: global.esp32Data.timestamp
        })
      };

    } catch (error) {
      console.error('[ESP32] Error:', error);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Error interno del servidor',
          message: error.message 
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Método no permitido' })
  };
};

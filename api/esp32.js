// Almacenamiento global para datos del ESP32
global.esp32Data = global.esp32Data || null;

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: "Endpoint para recibir datos del ESP32 via POST",
      last_data: global.esp32Data,
      status: "active"
    });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      if (!data || typeof data.weight !== 'number') {
        return res.status(400).json({ 
          success: false, 
          error: 'Datos inválidos. Se requiere peso numérico.' 
        });
      }

      // Almacenar datos con timestamp
      global.esp32Data = {
        ...data,
        received_at: Date.now(),
        timestamp: new Date().toISOString()
      };

      console.log(`[ESP32] ✅ Datos recibidos: ${data.weight} kg`);

      return res.status(200).json({
        success: true,
        message: "Datos recibidos correctamente",
        weight: data.weight,
        timestamp: global.esp32Data.timestamp
      });

    } catch (error) {
      console.error('[ESP32] Error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

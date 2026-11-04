
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarMQTT } from './mqtt.js';
import { conectarMongoDB } from './database.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

let db = null;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    proyecto: 'Proyecto Final DWSSR',
    mensaje: 'Servidor de monitoreo de agua funcionando correctamente',
    estado: 'activo',
    modo: 'desarrollo'
  });
});

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    estado: 'correcto',
    servidor: 'Express',
    fecha: new Date().toISOString()
  });
});

// Consultar mediciones almacenadas
app.get('/api/mediciones', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        estado: 'error',
        mensaje: 'La base de datos no esta disponible.'
      });
    }

    const limiteSolicitado = Number.parseInt(req.query.limite, 10);
    const limite = Number.isInteger(limiteSolicitado)
      ? Math.min(Math.max(limiteSolicitado, 1), 100)
      : 20;

    const mediciones = await db.collection('mediciones')
      .find({})
      .sort({ fechaRecepcion: -1 })
      .limit(limite)
      .toArray();

    res.json({
      estado: 'correcto',
      total: mediciones.length,
      mediciones
    });
  } catch (error) {
    console.error('Error al consultar las mediciones:', error.message);

    res.status(500).json({
      estado: 'error',
      mensaje: 'No fue posible consultar las mediciones.'
    });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);

  // Conectar con MongoDB Atlas
  try {
    db = await conectarMongoDB();
  } catch (error) {
    console.error('No fue posible conectar con MongoDB Atlas.');
  }

  // Iniciar conexion MQTT
  conectarMQTT(db);
});

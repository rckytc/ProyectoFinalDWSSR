
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarMQTT } from './mqtt.js';
import { conectarMongoDB } from './database.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);

  let db = null;

  // Conectar con MongoDB Atlas
  try {
    db = await conectarMongoDB();
  } catch (error) {
    console.error('No fue posible conectar con MongoDB Atlas.');
  }

  // Iniciar conexion MQTT
  conectarMQTT(db);
});

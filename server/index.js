
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    proyecto: 'Proyecto Final DWSSR',
    mensaje: 'Servidor de monitoreo de agua funcionando correctamente',
    estado: 'activo',
    modo: 'desarrollo'
  });
});

// Ruta de comprobación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    estado: 'correcto',
    servidor: 'Express',
    fecha: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});


import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const INTERVAL_MS = 3000;
const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'agua/mediciones';

// Genera mediciones temporales para probar el sistema.
// Estos datos NO provienen de sensores físicos.
function generarMedicion() {
  const nivelesAgua = ['bajo', 'normal', 'lleno'];
  const nivelAleatorio = Math.floor(Math.random() * nivelesAgua.length);

  return {
    timestamp: new Date().toISOString(),
    origen: 'simulado',
    temperaturaC: Number((20 + Math.random() * 10).toFixed(2)),
    nivelAgua: nivelesAgua[nivelAleatorio],
    caudalLitrosMinuto: Number((2 + Math.random() * 8).toFixed(2))
  };
}

const clienteMQTT = mqtt.connect(MQTT_URL);

let intervalo = null;

function publicarMedicion() {
  const medicion = generarMedicion();

  clienteMQTT.publish(
    MQTT_TOPIC,
    JSON.stringify(medicion),
    (error) => {
      if (error) {
        console.error('Error al publicar medicion:', error.message);
        return;
      }

      console.log('Medicion publicada por MQTT:');
      console.log(JSON.stringify(medicion, null, 2));
      console.log('--------------------------------');
    }
  );
}

clienteMQTT.on('connect', () => {
  console.log('Simulador de monitoreo de agua iniciado.');
  console.log('Origen de datos: SIMULADO');
  console.log(`Conectado a MQTT: ${MQTT_URL}`);
  console.log(`Tema: ${MQTT_TOPIC}`);
  console.log('Intervalo: 3 segundos');
  console.log('Presiona Ctrl + C para detenerlo.');
  console.log('--------------------------------');

  publicarMedicion();

  if (!intervalo) {
    intervalo = setInterval(publicarMedicion, INTERVAL_MS);
  }
});

clienteMQTT.on('error', (error) => {
  console.error('Error de conexion MQTT:', error.message);
});

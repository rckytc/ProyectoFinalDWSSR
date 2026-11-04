
import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const MQTT_URL = process.env.MQTT_URL;
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'agua/mediciones';

let clienteMQTT = null;

// Conectar con el broker MQTT
export function conectarMQTT() {
  if (!MQTT_URL) {
    console.log('MQTT no configurado. Se omitira la conexion.');
    return;
  }

  clienteMQTT = mqtt.connect(MQTT_URL);

  clienteMQTT.on('connect', () => {
    console.log('Conexion con el broker MQTT establecida.');

    clienteMQTT.subscribe(MQTT_TOPIC, (error) => {
      if (error) {
        console.error('Error al suscribirse al tema MQTT:', error.message);
        return;
      }

      console.log(`Suscrito al tema: ${MQTT_TOPIC}`);
    });
  });

  clienteMQTT.on('message', (topic, mensaje) => {
    try {
      const medicion = JSON.parse(mensaje.toString());

      console.log('Medicion recibida por MQTT:');
      console.log({
        tema: topic,
        datos: medicion
      });
    } catch (error) {
      console.error('Error al procesar el mensaje MQTT:', error.message);
    }
  });

  clienteMQTT.on('error', (error) => {
    console.error('Error de conexion MQTT:', error.message);
  });
}

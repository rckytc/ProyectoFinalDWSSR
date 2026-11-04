
import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const MQTT_URL = process.env.MQTT_URL;
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'agua/mediciones';

let clienteMQTT = null;

// Conectar con el broker MQTT
export function conectarMQTT(db) {
  if (!MQTT_URL) {
    console.log('MQTT no configurado. Se omitira la conexion.');
    return;
  }

  if (!db) {
    console.error('MongoDB no esta disponible. Las mediciones no se guardaran.');
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

  clienteMQTT.on('message', async (topic, mensaje) => {
    try {
      const medicion = JSON.parse(mensaje.toString());

      if (
        typeof medicion !== 'object'
        || medicion === null
        || Array.isArray(medicion)
      ) {
        throw new Error('El mensaje recibido no contiene un objeto JSON valido.');
      }

      console.log('Medicion recibida por MQTT:');
      console.log({
        tema: topic,
        datos: medicion
      });

      // Guardar medicion en MongoDB Atlas
      if (db) {
        const documento = {
          ...medicion,
          tema: topic,
          fechaRecepcion: new Date()
        };

        const resultado = await db.collection('mediciones').insertOne(documento);

        console.log('Medicion guardada en MongoDB Atlas.');
        console.log('ID del documento:', resultado.insertedId.toString());
      }
    } catch (error) {
      console.error('Error al procesar o guardar la medicion:', error.message);
    }
  });

  clienteMQTT.on('error', (error) => {
    console.error('Error de conexion MQTT:', error.message);
  });
}

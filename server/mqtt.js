
import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const MQTT_URL = process.env.MQTT_URL;
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'agua/mediciones';

let clienteMQTT = null;

// Validar la estructura y los valores de una medición.
function validarMedicion(medicion) {
  if (
    typeof medicion !== 'object'
    || medicion === null
    || Array.isArray(medicion)
  ) {
    return 'El mensaje debe contener un objeto JSON válido.';
  }

  const camposObligatorios = [
    'timestamp',
    'origen',
    'temperaturaC',
    'nivelAgua',
    'caudalLitrosMinuto'
  ];

  for (const campo of camposObligatorios) {
    if (!Object.hasOwn(medicion, campo)) {
      return `Falta el campo obligatorio: ${campo}.`;
    }
  }

  if (
    medicion.origen !== 'simulado'
    && medicion.origen !== 'fisico'
  ) {
    return 'El origen debe ser simulado o fisico.';
  }

  if (
    typeof medicion.timestamp !== 'string'
    || Number.isNaN(Date.parse(medicion.timestamp))
  ) {
    return 'El timestamp no contiene una fecha válida.';
  }

  if (
    typeof medicion.temperaturaC !== 'number'
    || !Number.isFinite(medicion.temperaturaC)
  ) {
    return 'La temperatura debe ser un número válido.';
  }

  const nivelesPermitidos = ['bajo', 'normal', 'lleno'];

  if (!nivelesPermitidos.includes(medicion.nivelAgua)) {
    return 'El nivel del agua debe ser bajo, normal o lleno.';
  }

  if (
    typeof medicion.caudalLitrosMinuto !== 'number'
    || !Number.isFinite(medicion.caudalLitrosMinuto)
    || medicion.caudalLitrosMinuto < 0
  ) {
    return 'El caudal debe ser un número válido y no negativo.';
  }

  return null;
}

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

      const errorValidacion = validarMedicion(medicion);

      if (errorValidacion) {
        console.error('Medicion rechazada:', errorValidacion);
        return;
      }

      console.log('Medicion recibida por MQTT:');
      console.log({
        tema: topic,
        origen: medicion.origen,
        datos: medicion
      });

      // Guardar medicion validada en MongoDB Atlas
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

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

let cliente;

export async function conectarMongoDB() {
  try {
    if (!uri) {
      throw new Error('No se encontro MONGODB_URI en el archivo .env');
    }

    cliente = new MongoClient(uri);

    await cliente.connect();

    console.log('Conexion con MongoDB Atlas establecida.');

    return cliente.db('agua_dwssr');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    throw error;
  }
}
# Arquitectura del sistema AguaDWSSR

## 1. Descripción general

AguaDWSSR utiliza una arquitectura dividida en componentes que permiten recibir mediciones, procesarlas, almacenarlas y mostrarlas mediante una interfaz web.

El sistema está desarrollado con Node.js, Express, MQTT, MongoDB Atlas y tecnologías frontend.

Actualmente se utiliza un simulador para generar mediciones de prueba. En una etapa posterior, el simulador será sustituido por las mediciones obtenidas mediante sensores físicos conectados a un ESP32.

## 2. Componentes principales

### 2.1. Generación de mediciones

Durante el desarrollo se utiliza el archivo `simulator/index.js`.

Este componente genera datos de prueba cada tres segundos, incluyendo:

- Temperatura del agua en grados Celsius.
- Nivel del agua (normal o bajo).
- Caudal en litros por minuto.
- Fecha y hora de generación.
- Identificación del origen de los datos.

El simulador publica las mediciones mediante MQTT.

En la integración física, el ESP32 será el encargado de obtener los valores de los sensores y enviarlos al broker MQTT.

### 2.2. Comunicación MQTT

MQTT permite transportar las mediciones entre el dispositivo que las genera y el servidor.

El proyecto utiliza Mosquitto como broker MQTT.

Configuración actual:

- Tema: `agua/mediciones`.
- Dirección del broker: configurada mediante `MQTT_URL`.
- Tema de suscripción: configurado mediante `MQTT_TOPIC`.

El archivo `server/mqtt.js` se encarga de:

1. Conectarse al broker MQTT.
2. Suscribirse al tema de mediciones.
3. Recibir los mensajes publicados.
4. Convertir los mensajes JSON en objetos JavaScript.
5. Validar que los mensajes recibidos sean objetos JSON.
6. Guardar las mediciones en MongoDB Atlas.

### 2.3. Backend con Express

El backend se encuentra dentro de la carpeta `server/`.

Su función es coordinar la comunicación, acceder a la base de datos y proporcionar información al frontend.

Archivos principales:

- `server/index.js`: configura Express, inicia las conexiones y define las rutas de la API.
- `server/mqtt.js`: administra la conexión y recepción de mensajes MQTT.
- `server/database.js`: establece la conexión con MongoDB Atlas.

El servidor utiliza el puerto 3000 de forma predeterminada.

#### Rutas disponibles

| Ruta | Función |
|---|---|
| `GET /` | Comprueba que el servidor está funcionando. |
| `GET /api/health` | Consulta el estado del servidor. |
| `GET /api/mediciones` | Obtiene las últimas mediciones almacenadas. |
| `GET /api/mediciones?limite=5` | Obtiene un máximo de cinco mediciones. |

La consulta de mediciones permite solicitar entre 1 y 100 registros. Si no se especifica un límite válido, se utilizan 20 registros.

### 2.4. Base de datos MongoDB Atlas

MongoDB Atlas almacena las mediciones recibidas por MQTT.

Configuración del proyecto:

- Base de datos: `agua_dwssr`.
- Colección: `mediciones`.

Cada documento contiene los datos de la medición y puede incluir información adicional:

- `timestamp`: fecha y hora de generación.
- `origen`: procedencia de los datos, por ejemplo, `simulado`.
- `temperaturaC`: temperatura del agua.
- `nivelAgua`: estado del nivel.
- `caudalLitrosMinuto`: caudal registrado.
- `tema`: tema MQTT de procedencia.
- `fechaRecepcion`: fecha y hora en que el servidor recibió el mensaje.

La conexión se configura mediante la variable privada `MONGODB_URI` del archivo `.env`.

### 2.5. Frontend y panel de monitoreo

El frontend se encuentra dentro de la carpeta `client/`.

Se utilizan Vite, Tailwind CSS, JavaScript y Chart.js.

El archivo `client/src/main.js` se encarga de:

- Consultar la API del backend.
- Mostrar las mediciones en tarjetas.
- Actualizar la tabla de registros recientes.
- Generar las gráficas de temperatura, nivel y caudal.
- Actualizar la información automáticamente cada tres segundos.
- Mostrar el estado de conexión.

El frontend se ejecuta en el puerto 5173 y utiliza un proxy de Vite para comunicarse con la API del backend.

## 3. Flujo de funcionamiento

El flujo actual de información es el siguiente:

1. El simulador genera una medición.
2. La medición se publica en el tema MQTT `agua/mediciones`.
3. Mosquitto recibe y distribuye el mensaje.
4. El backend recibe el mensaje mediante su suscripción MQTT.
5. El backend procesa el JSON y guarda el registro en MongoDB Atlas.
6. El frontend consulta periódicamente la API.
7. El panel presenta las mediciones mediante tarjetas, una tabla y tres gráficas.

En la integración física, el ESP32 sustituirá al simulador como origen de las mediciones.

## 4. Diagrama general

```text
          GENERACIÓN DE MEDICIONES
          ┌──────────────────────┐
          │ Simulador (actual)   │
          │ ESP32 + sensores     │
          │ (integración futura) │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │     Mosquitto        │
          │      Broker MQTT     │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Backend Express    │
          │     server/mqtt.js   │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │    MongoDB Atlas     │
          │ agua_dwssr.mediciones│
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │    API Express       │
          │  /api/mediciones     │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │    Panel web         │
          │ Vite + Tailwind CSS  │
          │      Chart.js        │
          └──────────────────────┘
```

## 5. Comunicación entre componentes

| Componente | Comunicación |
|---|---|
| Simulador | Publica mensajes MQTT. |
| ESP32 (futuro) | Publicará mediciones mediante MQTT. |
| Mosquitto | Distribuye los mensajes MQTT. |
| Backend | Recibe mensajes y consulta la base de datos. |
| MongoDB Atlas | Almacena los registros. |
| Frontend | Consulta la API mediante HTTP. |

## 6. Estado de la arquitectura

**Implementado:**

- Comunicación MQTT con Mosquitto.
- Recepción y validación de mensajes JSON.
- Almacenamiento en MongoDB Atlas.
- API para consultar mediciones.
- Panel web con actualización periódica.
- Tres gráficas históricas.

**Pendiente:**

- Conexión del ESP32.
- Lectura de sensores físicos.
- Envío de mediciones reales mediante MQTT.
- Validación y calibración de sensores.
- Implementación de detección de anomalías.

## 7. Consideraciones

El simulador se utiliza exclusivamente para pruebas durante el desarrollo. Sus mediciones no deben confundirse con datos obtenidos mediante sensores físicos.

Las credenciales y direcciones privadas de conexión deben permanecer en el archivo `.env`, el cual está excluido del repositorio mediante `.gitignore`.
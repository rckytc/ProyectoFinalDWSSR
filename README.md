# AguaDWSSR — Proyecto Final DWSSR

## Descripción

AguaDWSSR es un sistema de monitoreo inteligente de agua desarrollado como proyecto final de la asignatura DWSSR. Su propósito es recopilar, almacenar y visualizar información relacionada con el comportamiento y el uso del agua.

El sistema utiliza tecnologías web y comunicación mediante MQTT para recibir mediciones, almacenarlas en una base de datos y mostrarlas en un panel de monitoreo.

Actualmente se encuentra en desarrollo y utiliza datos simulados para realizar pruebas. Posteriormente se integrarán sensores físicos mediante un microcontrolador ESP32.

## Objetivo general

Desarrollar un sistema de monitoreo de agua que permita visualizar mediciones en tiempo real, almacenar registros históricos y preparar una base para implementar mecanismos de detección de anomalías.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** servidor y API del sistema.
- **MQTT:** comunicación y recepción de mediciones.
- **Mosquitto:** broker MQTT.
- **MongoDB Atlas:** almacenamiento de mediciones.
- **Vite:** servidor de desarrollo del frontend.
- **Tailwind CSS:** estilos de la interfaz.
- **Chart.js:** generación de gráficas históricas.
- **JavaScript:** lógica del sistema.

## Funcionalidades implementadas

- Servidor backend con Express.
- Conexión con un broker MQTT.
- Recepción y procesamiento de mensajes JSON.
- Almacenamiento de mediciones en MongoDB Atlas.
- Consulta de mediciones mediante una API.
- Panel web de monitoreo.
- Visualización de temperatura del agua.
- Visualización del nivel del agua.
- Visualización del caudal.
- Gráficas históricas que se actualizan automáticamente.
- Tabla con las últimas mediciones registradas.

## Variables monitoreadas

| Variable | Descripción |
|---|---|
| Temperatura | Temperatura del agua en grados Celsius. |
| Nivel del agua | Estado del nivel: normal o bajo. |
| Caudal | Flujo de agua expresado en litros por minuto. |

## Arquitectura general

El sistema está organizado en los siguientes componentes:

1. **Simulador o sensores físicos:** generan las mediciones.
2. **MQTT:** transporta los datos hacia el servidor.
3. **Backend Express:** recibe y procesa las mediciones.
4. **MongoDB Atlas:** almacena los registros.
5. **Frontend:** consulta y presenta la información mediante tarjetas, tablas y gráficas.

## Instalación y ejecución

### Requisitos

- Node.js y npm.
- Git.
- Broker MQTT Mosquitto.
- Cuenta y base de datos en MongoDB Atlas.

### 1. Clonar el repositorio

```bash
git clone https://github.com/rckytc/ProyectoFinalDWSSR.git
cd ProyectoFinalDWSSR
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Configurar las siguientes variables con los datos correspondientes:

```env
PORT=3000
MQTT_URL=mqtt://localhost:1883
MQTT_TOPIC=agua/mediciones
MONGODB_URI=
```

La dirección de conexión de MongoDB Atlas debe mantenerse privada y no compartirse públicamente.

### 4. Iniciar el backend

```bash
npm run dev
```

El servidor estará disponible en:

`http://localhost:3000`

### 5. Iniciar el frontend

En otra terminal:

```bash
npm exec vite -- client --config vite.config.js
```

El panel web estará disponible en:

`http://localhost:5173`

### 6. Ejecutar el simulador

En una tercera terminal:

```bash
node simulator/index.js
```

El simulador enviará mediciones cada tres segundos mediante MQTT.

## Estado actual del proyecto

**Implementado:**
- Backend y API.
- Comunicación MQTT.
- Conexión con MongoDB Atlas.
- Panel web de monitoreo.
- Gráficas históricas.
- Simulador para pruebas.

**Pendiente de desarrollo:**
- Integración del microcontrolador ESP32.
- Conexión de sensores físicos.
- Recepción y almacenamiento de mediciones reales.
- Implementación de mecanismos de detección de anomalías.

Los datos generados por el simulador están identificados como simulados y no representan mediciones obtenidas de sensores físicos.

## Integración de hardware prevista

Se contempla utilizar los siguientes componentes:

- ESP32 DevKit V1.
- Sensor de temperatura impermeable DS18B20.
- Interruptor de flotador para detectar el nivel del agua.
- Sensor de flujo YF-S201.
- Bomba sumergible de 12 V.
- Módulo MOSFET compatible con señales de 3.3 V.
- Fuente de alimentación de 12 V.

La integración se realizará en una etapa posterior del proyecto.

## Estructura del proyecto

```text
ProyectoFinalDWSSR/
│
├── client/
│   ├── index.html
│   └── src/
│       ├── main.js
│       └── style.css
│
├── docs/
│
├── server/
│   ├── index.js
│   ├── mqtt.js
│   └── database.js
│
├── simulator/
│   └── index.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## Autor

Ricardo Toledo Cano

**Proyecto Final — Desarrollo Web de Sistemas de Sensores Remotos (DWSSR)**
# Hardware del sistema AguaDWSSR

## 1. Descripción

El proyecto AguaDWSSR contempla una etapa de integración física para obtener mediciones reales del agua mediante sensores conectados a un microcontrolador ESP32.

El objetivo es sustituir progresivamente el simulador utilizado durante el desarrollo por componentes electrónicos que permitan monitorear temperatura, nivel y caudal.

También se contempla utilizar una bomba de agua para realizar pruebas de circulación dentro del sistema.

## 2. Microcontrolador

### ESP32 DevKit V1

Será el componente principal encargado de recibir las señales de los sensores y enviar las mediciones al servidor mediante MQTT.

Características consideradas:

- Conectividad Wi-Fi.
- Entradas y salidas digitales.
- Entradas para lectura de sensores.
- Compatibilidad con comunicación MQTT mediante programación.
- Lógica de trabajo a 3.3 V.

Se contempla adquirir una versión con pines previamente soldados para facilitar el montaje y evitar trabajos de soldadura.

## 3. Sensores

### 3.1. Sensor de temperatura DS18B20

Se utilizará para medir la temperatura del agua.

Características:

- Versión impermeable.
- Comunicación digital mediante protocolo OneWire.
- Lectura de temperatura en grados Celsius.

### 3.2. Interruptor de flotador

Se utilizará para detectar el nivel del agua.

Su función será identificar cuándo el agua alcanza un nivel determinado.

Se contempla manejar dos estados:

- Normal: el nivel se encuentra dentro del rango esperado.
- Bajo: el nivel ha descendido por debajo del punto de detección.

El estado dependerá de la orientación y configuración física del interruptor.

### 3.3. Sensor de flujo YF-S201

Se utilizará para medir el caudal del agua que circula por la manguera.

Características:

- Sensor de flujo con salida de pulsos.
- Lectura mediante una entrada digital del ESP32.
- Conversión de pulsos a litros por minuto mediante calibración.

La lectura deberá ajustarse mediante pruebas físicas para obtener valores confiables.

## 4. Sistema de bombeo

### Bomba sumergible de 12 V

Se contempla utilizar una bomba sumergible para impulsar el agua dentro del recipiente y la manguera.

La bomba permitirá realizar pruebas de circulación y observar los cambios de caudal y nivel.

### Módulo MOSFET

Se utilizará un módulo MOSFET compatible con señales de control de 3.3 V para controlar la alimentación de la bomba desde el ESP32.

Se prefiere un módulo con terminales de tornillo para facilitar las conexiones.

### Fuente de alimentación de 12 V

Proporcionará la energía necesaria para la bomba.

Su capacidad de corriente deberá seleccionarse de acuerdo con el consumo eléctrico especificado por el fabricante de la bomba.

El ESP32 y sus sensores deberán recibir una alimentación adecuada a sus especificaciones.

## 5. Lista de componentes previstos

| Componente | Función |
|---|---|
| ESP32 DevKit V1 | Controlador principal. |
| DS18B20 impermeable | Medición de temperatura. |
| Interruptor de flotador | Detección de nivel. |
| YF-S201 | Medición de caudal. |
| Bomba sumergible 12 V | Circulación de agua. |
| Módulo MOSFET | Control de la bomba. |
| Fuente de 12 V | Alimentación de la bomba. |
| Cables Dupont | Conexiones eléctricas. |
| Protoboard o terminales | Facilitar el montaje. |
| Recipiente y manguera | Circuito de circulación de agua. |

## 6. Conexión prevista

La arquitectura física tendrá la siguiente distribución:

1. El DS18B20 enviará la lectura de temperatura al ESP32.
2. El interruptor de flotador enviará el estado del nivel.
3. El YF-S201 enviará pulsos que permitirán calcular el caudal.
4. El ESP32 procesará las lecturas.
5. El ESP32 publicará las mediciones mediante MQTT.
6. El servidor almacenará los registros en MongoDB Atlas.
7. El panel web mostrará los valores obtenidos.

La asignación definitiva de pines se documentará después de adquirir y verificar los componentes.

## 7. Integración con el software

El ESP32 deberá enviar mensajes JSON al tema MQTT:

`agua/mediciones`

El formato previsto será compatible con las variables que actualmente utiliza el sistema:

```json
{
  "timestamp": "2026-11-10T12:00:00.000Z",
  "origen": "fisico",
  "temperaturaC": 24.5,
  "nivelAgua": "normal",
  "caudalLitrosMinuto": 5.2
}
```

Los valores mostrados son únicamente un ejemplo del formato esperado, no mediciones reales.

## 8. Consideraciones de seguridad

- Evitar que el agua entre en contacto con las conexiones eléctricas.
- Proteger las conexiones y el microcontrolador de la humedad.
- No alimentar la bomba directamente desde los pines del ESP32.
- Utilizar un módulo de control adecuado para la corriente de la bomba.
- Verificar la compatibilidad de las señales de los sensores con las entradas de 3.3 V del ESP32.
- Revisar las conexiones antes de energizar el circuito.
- Utilizar una fuente adecuada para la bomba.

## 9. Estado de integración

**Planeado:**

- Selección de componentes.
- Montaje del circuito.
- Conexión de sensores.
- Programación del ESP32.
- Comunicación MQTT desde el microcontrolador.
- Pruebas con circulación real de agua.
- Sustitución del simulador por mediciones físicas.

La integración física todavía no se considera terminada hasta realizar las pruebas correspondientes.

const INTERVAL_MS = 3000;

// Genera mediciones temporales para probar el sistema.
// Estos datos NO provienen de sensores físicos.
function generarMedicion() {
  return {
    timestamp: new Date().toISOString(),
    origen: 'simulado',
    temperaturaC: Number((20 + Math.random() * 10).toFixed(2)),
    nivelAgua: Math.random() > 0.2 ? 'normal' : 'bajo',
    caudalLitrosMinuto: Number((2 + Math.random() * 8).toFixed(2))
  };
}

function publicarMedicion() {
  const medicion = generarMedicion();

  console.log('Medición generada:');
  console.log(JSON.stringify(medicion, null, 2));
  console.log('--------------------------------');
}

console.log('Simulador de monitoreo de agua iniciado.');
console.log('Origen de datos: SIMULADO');
console.log('Intervalo: 3 segundos');
console.log('Presiona Ctrl + C para detenerlo.');
console.log('--------------------------------');

publicarMedicion();
setInterval(publicarMedicion, INTERVAL_MS);

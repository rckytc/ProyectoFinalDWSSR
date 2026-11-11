
import './style.css';
import Chart from 'chart.js/auto';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="min-h-screen p-6 md:p-10">
    <header class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-widest text-cyan-700">
        Proyecto Final DWSSR
      </p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
        AguaDWSSR
      </h1>
      <p class="mt-2 text-slate-600">
        Sistema de monitoreo inteligente de agua
      </p>
    </header>

    <section class="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Temperatura del agua</p>
        <p id="temperatura" class="mt-3 text-4xl font-bold text-slate-900">
          -- °C
        </p>
      </article>

      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Nivel del agua</p>
        <p id="nivel" class="mt-3 text-4xl font-bold text-slate-900">
          --
        </p>
      </article>

      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Caudal de agua</p>
        <p id="caudal" class="mt-3 text-4xl font-bold text-slate-900">
          -- L/min
        </p>
      </article>
    </section>

    <!-- Alertas del sistema -->
    <section class="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div class="mb-4">
        <h2 class="text-xl font-bold text-slate-900">
          Alertas del sistema
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Estado actual de las condiciones del agua
        </p>
      </div>

      <div id="alertas" class="space-y-3">
        <p class="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          Esperando mediciones...
        </p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="mb-5 text-2xl font-bold text-slate-900">
        Historial de mediciones
      </h2>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article class="rounded-2xl bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-semibold text-slate-800">
            Temperatura del agua (°C)
          </h3>
          <div class="relative h-64">
            <canvas id="grafica-temperatura"></canvas>
          </div>
        </article>

        <article class="rounded-2xl bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-semibold text-slate-800">
            Nivel del agua
          </h3>
          <div class="relative h-64">
            <canvas id="grafica-nivel"></canvas>
          </div>
        </article>

        <article class="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h3 class="mb-4 text-lg font-semibold text-slate-800">
            Caudal de agua (L/min)
          </h3>
          <div class="relative h-64">
            <canvas id="grafica-caudal"></canvas>
          </div>
        </article>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            Últimas mediciones
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Datos almacenados en MongoDB Atlas
          </p>
        </div>

        <span id="estado" class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          Conectando...
        </span>
      </div>

      <div class="mt-5 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 text-slate-500">
            <tr>
              <th class="p-3">Fecha</th>
              <th class="p-3">Temperatura</th>
              <th class="p-3">Nivel</th>
              <th class="p-3">Caudal</th>
              <th class="p-3">Origen</th>
            </tr>
          </thead>
          <tbody id="tabla-mediciones">
            <tr>
              <td colspan="5" class="p-4 text-center text-slate-500">
                Cargando mediciones...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p id="actualizacion" class="mt-4 text-xs text-slate-400">
        Esperando primera actualización...
      </p>
    </section>
  </main>
`;

const temperaturaElemento = document.querySelector('#temperatura');
const nivelElemento = document.querySelector('#nivel');
const caudalElemento = document.querySelector('#caudal');
const estadoElemento = document.querySelector('#estado');
const alertasElemento = document.querySelector('#alertas');
const tablaElemento = document.querySelector('#tabla-mediciones');
const actualizacionElemento = document.querySelector('#actualizacion');

// Configuración común para las gráficas.
const opcionesComunes = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 8
      }
    }
  }
};

// Gráfica de temperatura.
const graficaTemperatura = new Chart(
  document.querySelector('#grafica-temperatura'),
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperatura',
        data: [],
        borderColor: '#0891b2',
        backgroundColor: 'rgba(8, 145, 178, 0.15)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      ...opcionesComunes,
      scales: {
        ...opcionesComunes.scales,
        y: {
          title: {
            display: true,
            text: 'Temperatura (°C)'
          }
        }
      }
    }
  }
);

// Gráfica del nivel del agua.
const graficaNivel = new Chart(
  document.querySelector('#grafica-nivel'),
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Nivel del agua',
        data: [],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.15)',
        fill: true,
        stepped: true,
        pointRadius: 5
      }]
    },
    options: {
      ...opcionesComunes,
      scales: {
        ...opcionesComunes.scales,
        y: {
          min: -0.2,
          max: 1.2,
          ticks: {
            stepSize: 1,
            callback: (valor) => {
              if (valor === 1) return 'Normal';
              if (valor === 0) return 'Bajo';
              return '';
            }
          },
          title: {
            display: true,
            text: 'Estado del nivel'
          }
        }
      },
      plugins: {
        ...opcionesComunes.plugins,
        tooltip: {
          callbacks: {
            label: (context) =>
              context.parsed.y === 1 ? 'Nivel normal' : 'Nivel bajo'
          }
        }
      }
    }
  }
);

// Gráfica del caudal.
const graficaCaudal = new Chart(
  document.querySelector('#grafica-caudal'),
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Caudal',
        data: [],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.15)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      ...opcionesComunes,
      scales: {
        ...opcionesComunes.scales,
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Caudal (L/min)'
          }
        }
      }
    }
  }
);

// Actualizar las tres gráficas con las mediciones recibidas.
function actualizarGraficas(mediciones) {
  // Ordenar desde la medición más antigua hasta la más reciente.
  const ordenadas = [...mediciones].reverse();

  const etiquetas = ordenadas.map((medicion) =>
    new Date(medicion.fechaRecepcion).toLocaleTimeString('es-MX')
  );

  graficaTemperatura.data.labels = etiquetas;
  graficaTemperatura.data.datasets[0].data =
    ordenadas.map((medicion) => medicion.temperaturaC);
  graficaTemperatura.update();

  graficaNivel.data.labels = etiquetas;
  graficaNivel.data.datasets[0].data =
    ordenadas.map((medicion) =>
      medicion.nivelAgua === 'normal' ? 1 : 0
    );
  graficaNivel.update();

  graficaCaudal.data.labels = etiquetas;
  graficaCaudal.data.datasets[0].data =
    ordenadas.map((medicion) => medicion.caudalLitrosMinuto);
  graficaCaudal.update();
}

function actualizarAlertas(medicion) {
  const alertas = [];

  if (medicion.temperaturaC > 30) {
    alertas.push({
      tipo: 'danger',
      titulo: 'Temperatura alta',
      mensaje: `La temperatura es de ${medicion.temperaturaC} °C. El límite establecido es 30 °C.`
    });
  }

  if (medicion.nivelAgua === 'bajo') {
    alertas.push({
      tipo: 'warning',
      titulo: 'Nivel de agua bajo',
      mensaje: 'El nivel del agua se encuentra por debajo del nivel normal.'
    });
  }

  if (medicion.caudalLitrosMinuto === 0) {
    alertas.push({
      tipo: 'danger',
      titulo: 'Sin flujo de agua',
      mensaje: 'No se está detectando circulación de agua.'
    });
  }

  if (alertas.length === 0) {
    alertasElemento.innerHTML = `
      <div class="rounded-xl bg-green-100 p-4 text-green-800">
        <p class="font-semibold">Sistema funcionando correctamente</p>
        <p class="mt-1 text-sm">
          No se detectaron condiciones anormales en la última medición.
        </p>
      </div>
    `;
    return;
  }

  alertasElemento.innerHTML = alertas.map((alerta) => `
    <div class="rounded-xl p-4 ${
      alerta.tipo === 'danger'
        ? 'bg-red-100 text-red-800'
        : 'bg-amber-100 text-amber-800'
    }">
      <p class="font-semibold">${alerta.titulo}</p>
      <p class="mt-1 text-sm">${alerta.mensaje}</p>
    </div>
  `).join('');
}

function mostrarMediciones(mediciones) {
  if (mediciones.length === 0) {
    alertasElemento.innerHTML = `
  <p class="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
    Sin mediciones disponibles. Esperando nuevos datos...
  </p>
`;
    tablaElemento.innerHTML = `
      <tr>
        <td colspan="5" class="p-4 text-center text-slate-500">
          No hay mediciones registradas.
        </td>
      </tr>
    `;

    actualizarGraficas([]);
    estadoElemento.textContent = 'Conectado';
    return;
  }

  const ultima = mediciones[0];
  actualizarAlertas(ultima);
  temperaturaElemento.textContent = `${ultima.temperaturaC} °C`;
  nivelElemento.textContent = ultima.nivelAgua;
  caudalElemento.textContent = `${ultima.caudalLitrosMinuto} L/min`;

  tablaElemento.innerHTML = mediciones.map((medicion) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="whitespace-nowrap p-3">
        ${new Date(medicion.fechaRecepcion).toLocaleString('es-MX')}
      </td>
      <td class="p-3">${medicion.temperaturaC} °C</td>
      <td class="p-3">${medicion.nivelAgua}</td>
      <td class="p-3">${medicion.caudalLitrosMinuto} L/min</td>
      <td class="p-3">
        <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          medicion.origen === 'fisico'
            ? 'bg-blue-100 text-blue-700'
            : medicion.origen === 'simulado'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-600'
        }">
          ${
            medicion.origen === 'fisico'
              ? 'FÍSICO'
              : medicion.origen === 'simulado'
                ? 'SIMULADO'
                : 'DESCONOCIDO'
          }
        </span>
      </td>
    </tr>
  `).join('');

  actualizarGraficas(mediciones);

  estadoElemento.textContent = 'Conectado';
  estadoElemento.className =
    'rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700';

  actualizacionElemento.textContent =
    `Última actualización: ${new Date().toLocaleTimeString('es-MX')}`;
}

async function cargarMediciones() {
  try {
    const respuesta = await fetch('/api/mediciones?limite=20');

    if (!respuesta.ok) {
      throw new Error('No fue posible consultar las mediciones.');
    }

    const datos = await respuesta.json();

    mostrarMediciones(datos.mediciones);
  } catch (error) {
    console.error('Error al cargar mediciones:', error);

    estadoElemento.textContent = 'Sin conexión';
    estadoElemento.className =
      'rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700';

    tablaElemento.innerHTML = `
      <tr>
        <td colspan="5" class="p-4 text-center text-red-600">
          No se pudieron cargar las mediciones.
        </td>
      </tr>
    `;
  }
}

cargarMediciones();
setInterval(cargarMediciones, 3000);

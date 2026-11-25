import './style.css';
import Chart from 'chart.js/auto';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="mx-auto min-h-screen max-w-7xl p-5 sm:p-8 md:p-10">
    <header class="mb-8 rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-cyan-700">
            Proyecto Final DWSSR
          </p>
          <h1 class="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            AguaDWSSR
          </h1>
          <p class="mt-1.5 text-sm text-slate-600 sm:text-base">
            Sistema de monitoreo inteligente de agua
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-200/80 bg-cyan-50/70 px-3.5 py-2 text-xs font-semibold text-cyan-800">
            <span class="h-2 w-2 rounded-full bg-cyan-600"></span>
            Telemetría en tiempo real
          </div>

          <button
            id="btn-tema"
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors duration-200 hover:bg-slate-200"
          >
            Modo oscuro
          </button>
        </div>
      </div>
    </header>

    <section class="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
      <article class="group rounded-2xl border border-slate-200/90 border-t-4 border-t-cyan-600 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Temperatura del agua
        </p>
        <p id="temperatura" class="tabular-nums mt-3 text-4xl font-bold tracking-tight text-slate-900">
          -- °C
        </p>
      </article>

      <article class="group rounded-2xl border border-slate-200/90 border-t-4 border-t-emerald-600 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Nivel del agua
        </p>
        <p id="nivel" class="tabular-nums mt-3 text-4xl font-bold tracking-tight text-slate-900">
          --
        </p>
      </article>

      <article class="group rounded-2xl border border-slate-200/90 border-t-4 border-t-violet-600 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Caudal de agua
        </p>
        <p id="caudal" class="tabular-nums mt-3 text-4xl font-bold tracking-tight text-slate-900">
          -- L/min
        </p>
      </article>
    </section>

    <!-- Alertas del sistema -->
    <section class="mb-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div class="mb-4 border-b border-slate-100 pb-3">
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Alertas del sistema
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Estado actual de las condiciones del agua
        </p>
      </div>

      <div id="alertas" class="space-y-3">
        <p class="rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-600">
          Esperando mediciones...
        </p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="mb-5 text-2xl font-bold tracking-tight text-slate-900">
        Historial de mediciones
      </h2>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article class="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h3 class="mb-4 border-b border-slate-100 pb-2.5 text-base font-semibold text-slate-800">
            Temperatura del agua (°C)
          </h3>
          <div class="relative h-64">
            <canvas id="grafica-temperatura"></canvas>
          </div>
        </article>

        <article class="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h3 class="mb-4 border-b border-slate-100 pb-2.5 text-base font-semibold text-slate-800">
            Nivel del agua
          </h3>
          <div class="relative h-64">
            <canvas id="grafica-nivel"></canvas>
          </div>
        </article>

        <article class="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md lg:col-span-2">
          <h3 class="mb-4 border-b border-slate-100 pb-2.5 text-base font-semibold text-slate-800">
            Caudal de agua (L/min)
          </h3>
          <div class="relative h-64">
            <canvas id="grafica-caudal"></canvas>
          </div>
        </article>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-slate-900">
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

      <div class="mt-5 overflow-x-auto rounded-xl border border-slate-100">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th class="p-3.5">Fecha</th>
              <th class="p-3.5">Temperatura</th>
              <th class="p-3.5">Nivel</th>
              <th class="p-3.5">Caudal</th>
              <th class="p-3.5">Origen</th>
            </tr>
          </thead>
          <tbody id="tabla-mediciones" class="divide-y divide-slate-100">
            <tr>
              <td colspan="5" class="p-4 text-center text-slate-500">
                Cargando mediciones...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p id="actualizacion" class="tabular-nums mt-4 text-xs text-slate-400">
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
const botonTema = document.querySelector('#btn-tema');

// Convertir el nivel del agua a un valor numérico.
function convertirNivel(nivel) {
  const niveles = {
    bajo: 0,
    normal: 1,
    lleno: 2
  };

  return niveles[nivel] ?? null;
}

// Mostrar el nombre del nivel con la primera letra en mayúscula.
function mostrarNivel(nivel) {
  const nombres = {
    bajo: 'Bajo',
    normal: 'Normal',
    lleno: 'Lleno'
  };

  return nombres[nivel] || 'Desconocido';
}

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
        maxTicksLimit: 8,
        color: '#64748b'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.15)'
      }
    },
    y: {
      ticks: {
        color: '#64748b'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.15)'
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
          ...opcionesComunes.scales.y,
          title: {
            display: true,
            text: 'Temperatura (°C)',
            color: '#64748b'
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
          ...opcionesComunes.scales.y,
          min: -0.2,
          max: 2.2,
          ticks: {
            ...opcionesComunes.scales.y.ticks,
            stepSize: 1,
            callback: (valor) => {
              if (valor === 2) return 'Lleno';
              if (valor === 1) return 'Normal';
              if (valor === 0) return 'Bajo';
              return '';
            }
          },
          title: {
            display: true,
            text: 'Estado del nivel',
            color: '#64748b'
          }
        }
      },
      plugins: {
        ...opcionesComunes.plugins,
        tooltip: {
          callbacks: {
            label: (context) => {
              const nombres = {
                0: 'Nivel bajo',
                1: 'Nivel normal',
                2: 'Nivel lleno'
              };

              return nombres[context.parsed.y] || 'Nivel desconocido';
            }
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
          ...opcionesComunes.scales.y,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Caudal (L/min)',
            color: '#64748b'
          }
        }
      }
    }
  }
);

// Sincronizar colores de las gráficas con el tema activo.
function actualizarColoresGraficas(esOscuro) {
  const colorTexto = esOscuro ? '#cbd5e1' : '#64748b';
  const colorRejilla = esOscuro
    ? 'rgba(148, 163, 184, 0.14)'
    : 'rgba(148, 163, 184, 0.18)';

  [graficaTemperatura, graficaNivel, graficaCaudal].forEach((grafica) => {
    grafica.options.scales.x.ticks.color = colorTexto;
    grafica.options.scales.x.grid.color = colorRejilla;
    grafica.options.scales.y.ticks.color = colorTexto;
    grafica.options.scales.y.grid.color = colorRejilla;
    if (grafica.options.scales.y.title) {
      grafica.options.scales.y.title.color = colorTexto;
    }
    grafica.update();
  });
}

// Alternar entre modo claro y modo oscuro.
botonTema.addEventListener('click', () => {
  const esOscuro = document.body.classList.toggle('modo-oscuro');
  botonTema.textContent = esOscuro ? 'Modo claro' : 'Modo oscuro';
  actualizarColoresGraficas(esOscuro);
});

// Actualizar las tres gráficas con las mediciones recibidas.
function actualizarGraficas(mediciones) {
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
    ordenadas.map((medicion) => convertirNivel(medicion.nivelAgua));
  graficaNivel.update();

  graficaCaudal.data.labels = etiquetas;
  graficaCaudal.data.datasets[0].data =
    ordenadas.map((medicion) => medicion.caudalLitrosMinuto);
  graficaCaudal.update();
}

// Actualizar las alertas según la última medición.
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

  if (medicion.nivelAgua === 'lleno') {
    alertas.push({
      tipo: 'info',
      titulo: 'Nivel de agua lleno',
      mensaje: 'El recipiente ha alcanzado el nivel máximo establecido.'
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
        : alerta.tipo === 'warning'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-blue-100 text-blue-800'
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
  nivelElemento.textContent = mostrarNivel(ultima.nivelAgua);
  caudalElemento.textContent = `${ultima.caudalLitrosMinuto} L/min`;

  tablaElemento.innerHTML = mediciones.map((medicion) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="tabular-nums whitespace-nowrap p-3.5">
        ${new Date(medicion.fechaRecepcion).toLocaleString('es-MX')}
      </td>
      <td class="tabular-nums p-3.5">${medicion.temperaturaC} °C</td>
      <td class="p-3.5">${mostrarNivel(medicion.nivelAgua)}</td>
      <td class="tabular-nums p-3.5">${medicion.caudalLitrosMinuto} L/min</td>
      <td class="p-3.5">
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
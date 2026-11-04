import './style.css';

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
const tablaElemento = document.querySelector('#tabla-mediciones');
const actualizacionElemento = document.querySelector('#actualizacion');

function mostrarMediciones(mediciones) {
  if (mediciones.length === 0) {
    tablaElemento.innerHTML = `
      <tr>
        <td colspan="5" class="p-4 text-center text-slate-500">
          No hay mediciones registradas.
        </td>
      </tr>
    `;
    return;
  }

  const ultima = mediciones[0];

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
      <td class="p-3">${medicion.origen}</td>
    </tr>
  `).join('');

  estadoElemento.textContent = 'Conectado';
  estadoElemento.className = 'rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700';

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
    estadoElemento.className = 'rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700';

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
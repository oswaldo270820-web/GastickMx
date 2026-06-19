/* ==========================
   FECHA
========================== */

const fechaHoy = new Date();
document.getElementById("fechaActual").textContent =
  fechaHoy.toLocaleDateString("es-MX", { weekday:"short", year:"numeric", month:"short", day:"numeric" });

/* ==========================
   USUARIO ACTIVO
========================== */

const usuarioActivo = localStorage.getItem("usuarioActivo") || "Usuario";
const saludoEl = document.getElementById("saludoUsuario");
if (saludoEl) saludoEl.textContent = `Hola ${usuarioActivo} 👋`;

const inputNombreUsuario = document.getElementById("inputNombreUsuario");
if (inputNombreUsuario) inputNombreUsuario.value = usuarioActivo;

/* ==========================
   DARK MODE
========================== */

function aplicarTema(dark) {
  document.body.classList.toggle("dark", dark);
  const icon = document.getElementById("toggleDark")?.querySelector("i");
  if (icon) {
    icon.className = dark ? "bi bi-sun-fill" : "bi bi-moon-fill";
  }
  const tl = document.getElementById("themeLight");
  const td = document.getElementById("themeDark");
  if (tl) tl.classList.toggle("active", !dark);
  if (td) td.classList.toggle("active", dark);
}

let modoOscuro = localStorage.getItem("darkMode") === "1";
aplicarTema(modoOscuro);

document.getElementById("toggleDark")?.addEventListener("click", () => {
  modoOscuro = !modoOscuro;
  localStorage.setItem("darkMode", modoOscuro ? "1" : "0");
  aplicarTema(modoOscuro);
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
});

document.getElementById("themeLight")?.addEventListener("click", () => {
  modoOscuro = false;
  localStorage.setItem("darkMode", "0");
  aplicarTema(false);
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
});

document.getElementById("themeDark")?.addEventListener("click", () => {
  modoOscuro = true;
  localStorage.setItem("darkMode", "1");
  aplicarTema(true);
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
});

/* ==========================
   TOAST
========================== */

function mostrarToast(texto, tipo = "success") {
  const toastEl = document.getElementById("toastMsg");
  const toastTexto = document.getElementById("toastTexto");
  if (!toastEl || !toastTexto) return;

  toastEl.className = "toast align-items-center text-white border-0";
  toastEl.classList.add(tipo === "success" ? "bg-success" : "bg-danger");
  toastTexto.textContent = texto;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

/* ==========================
   VARIABLES
========================== */

let ingresos    = [];
let gastos      = [];
let movimientos = [];
let metas       = [];

/* ==========================
   LOCAL STORAGE
========================== */

function guardarDatos() {
  localStorage.setItem("ingresos",    JSON.stringify(ingresos));
  localStorage.setItem("gastos",      JSON.stringify(gastos));
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  localStorage.setItem("metas",       JSON.stringify(metas));
}

function cargarDatos() {
  ingresos    = JSON.parse(localStorage.getItem("ingresos"))    || [];
  gastos      = JSON.parse(localStorage.getItem("gastos"))      || [];
  movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
  metas       = JSON.parse(localStorage.getItem("metas"))       || [];

  actualizarResumen();
  renderizarUltimosMovimientos();
  renderizarMovimientos();
  renderizarMetas();
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
}

/* ==========================
   ELEMENTOS
========================== */

const tabla           = document.getElementById("tablaMovimientos");
const tablaCompleta   = document.getElementById("tablaCompleta");
const saldoHTML       = document.getElementById("saldo");
const ingresosHTML    = document.getElementById("ingresos");
const gastosHTML      = document.getElementById("gastos");
const contenedorMetas = document.getElementById("contenedorMetas");

/* ==========================
   INGRESOS
========================== */

document.getElementById("formIngreso").addEventListener("submit", function(e) {
  e.preventDefault();

  const concepto  = document.getElementById("conceptoIngreso").value.trim();
  const monto     = parseFloat(document.getElementById("montoIngreso").value);
  const categoria = document.getElementById("categoriaIngreso").value;

  if (!concepto || isNaN(monto) || monto <= 0) {
    mostrarToast("Completa los campos correctamente", "danger");
    return;
  }

  ingresos.push({ concepto, monto, categoria });
  agregarMovimiento(concepto, monto, "Ingreso", categoria);
  guardarDatos();
  actualizarResumen();
  mostrarToast("✅ Ingreso registrado");
  this.reset();
});

/* ==========================
   GASTOS
========================== */

document.getElementById("formGasto").addEventListener("submit", function(e) {
  e.preventDefault();

  const concepto  = document.getElementById("conceptoGasto").value.trim();
  const monto     = parseFloat(document.getElementById("montoGasto").value);
  const categoria = document.getElementById("categoriaGasto").value;

  if (!concepto || isNaN(monto) || monto <= 0) {
    mostrarToast("Completa los campos correctamente", "danger");
    return;
  }

  gastos.push({ concepto, monto, categoria });
  agregarMovimiento(concepto, monto, "Gasto", categoria);
  guardarDatos();
  actualizarResumen();
  mostrarToast("✅ Gasto registrado");
  this.reset();
});

/* ==========================
   AGREGAR MOVIMIENTO
========================== */

function agregarMovimiento(concepto, monto, tipo, categoria = "") {
  const fecha = new Date().toISOString().split("T")[0];
  movimientos.push({ fecha, concepto, monto, tipo, categoria });
  guardarDatos();
  renderizarMovimientos();
  renderizarUltimosMovimientos();
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
}

/* ==========================
   ELIMINAR MOVIMIENTO
========================== */

let indexPendienteEliminar = null;

function pedirEliminar(index) {
  indexPendienteEliminar = index;
  const modal = new bootstrap.Modal(document.getElementById("modalEliminar"));
  modal.show();
}

document.getElementById("btnConfirmarEliminar")?.addEventListener("click", () => {
  if (indexPendienteEliminar === null) return;

  const mov = movimientos[indexPendienteEliminar];

  // Quitar del array correspondiente
  if (mov.tipo === "Ingreso") {
    const idx = ingresos.findIndex(i =>
      i.concepto === mov.concepto && i.monto === mov.monto
    );
    if (idx > -1) ingresos.splice(idx, 1);
  } else {
    const idx = gastos.findIndex(g =>
      g.concepto === mov.concepto && g.monto === mov.monto
    );
    if (idx > -1) gastos.splice(idx, 1);
  }

  movimientos.splice(indexPendienteEliminar, 1);
  indexPendienteEliminar = null;

  guardarDatos();
  actualizarResumen();
  renderizarMovimientos();
  renderizarUltimosMovimientos();
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
  mostrarToast("Movimiento eliminado", "danger");

  bootstrap.Modal.getInstance(document.getElementById("modalEliminar"))?.hide();
});

/* ==========================
   ÚLTIMOS MOVIMIENTOS
========================== */

function renderizarUltimosMovimientos() {
  if (!tabla) return;

  const emptyEl   = document.getElementById("emptyInicio");
  const wrapperEl = document.getElementById("wrapperTablaInicio");
  const ultimos   = [...movimientos].reverse().slice(0, 10);

  if (ultimos.length === 0) {
    emptyEl?.classList.remove("d-none");
    wrapperEl?.classList.add("d-none");
    return;
  }

  emptyEl?.classList.add("d-none");
  wrapperEl?.classList.remove("d-none");
  tabla.innerHTML = "";

  ultimos.forEach(mov => {
    tabla.innerHTML += `
      <tr>
        <td>${mov.concepto}</td>
        <td><span class="cat-chip">${mov.categoria || "—"}</span></td>
        <td><strong>$${mov.monto.toFixed(2)}</strong></td>
        <td>
          <span class="badge ${mov.tipo === "Ingreso" ? "bg-success" : "bg-danger"}">
            ${mov.tipo}
          </span>
        </td>
      </tr>`;
  });
}

/* ==========================
   TABLA COMPLETA
========================== */

function renderizarMovimientos() {
  if (!tablaCompleta) return;

  const emptyEl   = document.getElementById("emptyMovimientos");
  const wrapperEl = document.getElementById("wrapperTablaCompleta");
  const filtroF   = document.getElementById("filtroFecha")?.value;
  const filtroT   = document.getElementById("filtroTipo")?.value;

  let lista = [...movimientos].reverse();

  if (filtroF) lista = lista.filter(m => m.fecha === filtroF);
  if (filtroT) lista = lista.filter(m => m.tipo === filtroT);

  if (lista.length === 0) {
    emptyEl?.classList.remove("d-none");
    wrapperEl?.classList.add("d-none");
    return;
  }

  emptyEl?.classList.add("d-none");
  wrapperEl?.classList.remove("d-none");
  tablaCompleta.innerHTML = "";

  lista.forEach((mov) => {
    // Índice real en el array original (sin reverse)
    const realIndex = movimientos.findLastIndex(m =>
      m.fecha === mov.fecha &&
      m.concepto === mov.concepto &&
      m.monto === mov.monto &&
      m.tipo === mov.tipo
    );

    tablaCompleta.innerHTML += `
      <tr>
        <td>${mov.fecha}</td>
        <td>${mov.concepto}</td>
        <td><span class="cat-chip">${mov.categoria || "—"}</span></td>
        <td><strong>$${mov.monto.toFixed(2)}</strong></td>
        <td>
          <span class="badge ${mov.tipo === "Ingreso" ? "bg-success" : "bg-danger"}">
            ${mov.tipo}
          </span>
        </td>
        <td>
          <button class="btn-del" onclick="pedirEliminar(${realIndex})" title="Eliminar">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>`;
  });
}

document.getElementById("filtroFecha")?.addEventListener("change", renderizarMovimientos);
document.getElementById("filtroTipo")?.addEventListener("change", renderizarMovimientos);

document.getElementById("btnLimpiarFiltros")?.addEventListener("click", () => {
  const fF = document.getElementById("filtroFecha");
  const fT = document.getElementById("filtroTipo");
  if (fF) fF.value = "";
  if (fT) fT.value = "";
  renderizarMovimientos();
});

/* ==========================
   RESUMEN
========================== */

function actualizarResumen() {
  const totalIngresos = ingresos.reduce((a, i) => a + i.monto, 0);
  const totalGastos   = gastos.reduce((a, g)   => a + g.monto, 0);

  ingresosHTML.textContent = "$" + totalIngresos.toFixed(2);
  gastosHTML.textContent   = "$" + totalGastos.toFixed(2);
  saldoHTML.textContent    = "$" + (totalIngresos - totalGastos).toFixed(2);
}

/* ==========================
   GRÁFICA DASHBOARD
========================== */

let chartDashboard = null;
let filtroGraficaTipo = "semana";

function obtenerDatosGrafica(tipo) {
  const hoy = new Date();
  const labels = [];
  const datosIngresos = [];
  const datosGastos   = [];

  const dias = tipo === "semana" ? 7 : 30;

  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const key = d.toISOString().split("T")[0];

    const label = tipo === "semana"
      ? d.toLocaleDateString("es-MX", { weekday:"short" })
      : d.getDate().toString();

    labels.push(label);

    const sumI = movimientos
      .filter(m => m.fecha === key && m.tipo === "Ingreso")
      .reduce((a, m) => a + m.monto, 0);

    const sumG = movimientos
      .filter(m => m.fecha === key && m.tipo === "Gasto")
      .reduce((a, m) => a + m.monto, 0);

    datosIngresos.push(sumI);
    datosGastos.push(sumG);
  }

  return { labels, datosIngresos, datosGastos };
}

function coloresGrafica() {
  return modoOscuro
    ? { grid: "rgba(255,255,255,.07)", text: "#94a3b8" }
    : { grid: "rgba(0,0,0,.05)",       text: "#64748b" };
}

function renderizarGraficaDashboard() {
  const canvas = document.getElementById("graficaDashboard");
  if (!canvas) return;

  const { labels, datosIngresos, datosGastos } = obtenerDatosGrafica(filtroGraficaTipo);
  const c = coloresGrafica();

  if (chartDashboard) chartDashboard.destroy();

  chartDashboard = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: datosIngresos,
          backgroundColor: "rgba(34,197,94,.75)",
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: "Gastos",
          data: datosGastos,
          backgroundColor: "rgba(239,68,68,.75)",
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: c.text, padding: 20 } },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        x: { grid: { color: c.grid }, ticks: { color: c.text } },
        y: {
          grid: { color: c.grid },
          ticks: { color: c.text, callback: v => "$" + v.toLocaleString() },
          beginAtZero: true
        }
      }
    }
  });
}

/* Filtro semana / mes */
document.querySelectorAll("#filtroGrafica button").forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll("#filtroGrafica button")
      .forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    filtroGraficaTipo = this.dataset.tipo;
    renderizarGraficaDashboard();
  });
});

/* ==========================
   GRÁFICA MOVIMIENTOS
========================== */

let chartMovimientos = null;

function renderizarGraficaMovimientos() {
  const canvas = document.getElementById("graficaMovimientos");
  if (!canvas) return;

  const { labels, datosIngresos, datosGastos } = obtenerDatosGrafica("semana");
  const c = coloresGrafica();

  if (chartMovimientos) chartMovimientos.destroy();

  chartMovimientos = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: datosIngresos,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,.1)",
          tension: .4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: "Gastos",
          data: datosGastos,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,.1)",
          tension: .4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: c.text } },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        x: { grid: { color: c.grid }, ticks: { color: c.text } },
        y: {
          grid: { color: c.grid },
          ticks: { color: c.text, callback: v => "$" + v.toLocaleString() },
          beginAtZero: true
        }
      }
    }
  });
}

/* ==========================
   EXPORTAR CSV
========================== */

document.getElementById("btnExportarCSV")?.addEventListener("click", () => {
  if (movimientos.length === 0) {
    mostrarToast("No hay movimientos para exportar", "danger");
    return;
  }

  const filas = [
    ["Fecha", "Concepto", "Categoría", "Monto", "Tipo"],
    ...movimientos.map(m => [m.fecha, m.concepto, m.categoria || "", m.monto.toFixed(2), m.tipo])
  ];

  const csv = filas.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `gastick_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast("✅ CSV descargado");
});

/* ==========================
   METAS
========================== */

document.getElementById("formMeta").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreMeta").value.trim();
  const monto  = parseFloat(document.getElementById("montoMeta").value);
  const fecha  = document.getElementById("fechaMeta")?.value || "";

  if (!nombre || isNaN(monto) || monto <= 0) {
    mostrarToast("Completa los campos correctamente", "danger");
    return;
  }

  metas.push({ nombre, monto, fecha, ahorrado: 0 });
  guardarDatos();
  renderizarMetas();
  mostrarToast("✅ Meta guardada");
  this.reset();
});

/* ==========================
   RENDER METAS
========================== */

function renderizarMetas() {
  if (!contenedorMetas) return;

  const emptyEl = document.getElementById("emptyMetas");

  if (metas.length === 0) {
    contenedorMetas.innerHTML = "";
    emptyEl?.classList.remove("d-none");
    return;
  }

  emptyEl?.classList.add("d-none");
  contenedorMetas.innerHTML = "";

  metas.forEach((meta, index) => {
    const pct     = Math.min(100, Math.round((meta.ahorrado / meta.monto) * 100));
    const faltaNum = Math.max(0, meta.monto - meta.ahorrado);

    contenedorMetas.innerHTML += `
      <div class="col-lg-4 col-md-6 fade-in" style="--delay:${index * .05}s">
        <div class="meta-card">
          <h5>${meta.nombre}</h5>
          <p>Objetivo: <strong>$${meta.monto.toFixed(2)}</strong></p>
          ${meta.fecha ? `<p class="meta-fecha">📅 Fecha límite: ${meta.fecha}</p>` : ""}
          <div class="progress mb-1">
            <div class="progress-bar bg-success" style="width:${pct}%"></div>
          </div>
          <div class="meta-info-row">
            <span>Ahorrado: $${meta.ahorrado.toFixed(2)}</span>
            <span>${pct}%</span>
          </div>
          <p class="text-muted" style="font-size:.8rem">Falta: $${faltaNum.toFixed(2)}</p>
          <div class="d-flex gap-2 mt-3">
            <input
              type="number"
              class="form-control form-control-sm"
              placeholder="Abonar $"
              id="abonoMeta${index}"
              min="0.01" step="0.01">
            <button
              class="btn btn-sm btn-success"
              onclick="abonarMeta(${index})">
              +
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              onclick="eliminarMeta(${index})">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>`;
  });
}

/* ==========================
   ABONAR A META
========================== */

function abonarMeta(index) {
  const input = document.getElementById(`abonoMeta${index}`);
  const valor = parseFloat(input?.value);

  if (isNaN(valor) || valor <= 0) {
    mostrarToast("Ingresa un monto válido", "danger");
    return;
  }

  metas[index].ahorrado = (metas[index].ahorrado || 0) + valor;

  if (metas[index].ahorrado >= metas[index].monto) {
    mostrarToast(`🎉 ¡Meta "${metas[index].nombre}" completada!`);
  } else {
    mostrarToast(`✅ Abono registrado a "${metas[index].nombre}"`);
  }

  guardarDatos();
  renderizarMetas();
}

/* ==========================
   ELIMINAR META
========================== */

function eliminarMeta(index) {
  metas.splice(index, 1);
  guardarDatos();
  renderizarMetas();
  mostrarToast("Meta eliminada", "danger");
}

/* ==========================
   CONFIGURACIÓN
========================== */

document.getElementById("btnGuardarNombre")?.addEventListener("click", () => {
  const nombre = document.getElementById("inputNombreUsuario")?.value.trim();
  if (!nombre) return;
  localStorage.setItem("usuarioActivo", nombre);
  if (saludoEl) saludoEl.textContent = `Hola ${nombre} 👋`;
  mostrarToast("✅ Nombre actualizado");
});

document.getElementById("btnBorrarTodo")?.addEventListener("click", () => {
  if (!confirm("¿Seguro? Esto borrará todos tus datos permanentemente.")) return;
  ingresos = []; gastos = []; movimientos = []; metas = [];
  guardarDatos();
  actualizarResumen();
  renderizarUltimosMovimientos();
  renderizarMovimientos();
  renderizarMetas();
  renderizarGraficaDashboard();
  renderizarGraficaMovimientos();
  mostrarToast("Todos los datos han sido borrados", "danger");
});

/* ==========================
   SECCIONES
========================== */

const inicioSection      = document.getElementById("inicio-section");
const movimientosSection = document.getElementById("movimientos-section");
const metasSection       = document.getElementById("metas-section");
const configSection      = document.getElementById("config-section");

function mostrarSeccion(seccion) {
  [inicioSection, movimientosSection, metasSection, configSection]
    .forEach(s => s?.classList.add("d-none"));

  document.querySelectorAll(".menu-link")
    .forEach(l => l.classList.remove("active"));

  const mapa = {
    inicio:       [inicioSection,      "btnInicio"],
    movimientos:  [movimientosSection, "btnMovimientos"],
    metas:        [metasSection,       "btnMetas"],
    config:       [configSection,      "btnConfig"],
  };

  const [section, btnId] = mapa[seccion] || [];
  section?.classList.remove("d-none");
  document.getElementById(btnId)?.classList.add("active");

  // Rerender gráficas al cambiar sección
  if (seccion === "inicio")      renderizarGraficaDashboard();
  if (seccion === "movimientos") renderizarGraficaMovimientos();

  // Cerrar sidebar en móvil
  if (window.innerWidth <= 768) {
    sidebar?.classList.add("closed");
  }
}

["btnInicio", "btnMovimientos", "btnMetas", "btnConfig"].forEach((id, i) => {
  const secciones = ["inicio", "movimientos", "metas", "config"];
  document.getElementById(id)?.addEventListener("click", e => {
    e.preventDefault();
    mostrarSeccion(secciones[i]);
  });
});

/* ==========================
   CERRAR SESIÓN
========================== */

document.getElementById("cerrarSesion")?.addEventListener("click", () => {
  const modal = new bootstrap.Modal(document.getElementById("modalSesion"));
  modal.show();
});

document.getElementById("btnConfirmarSesion")?.addEventListener("click", () => {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "login.html";
});

/* ==========================
   SIDEBAR
========================== */

const sidebar        = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

document.getElementById("toggleSidebar")?.addEventListener("click", () => {
  sidebar?.classList.toggle("closed");
});

sidebarOverlay?.addEventListener("click", () => {
  sidebar?.classList.add("closed");
});

/* ==========================
   INICIO
========================== */

cargarDatos();
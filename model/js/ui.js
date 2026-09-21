/* =====================================================
   Banco — ui.js
   Utilidades de UI compartidas entre módulos:
   pestañas, switch "Ocultar importes", paneles
   colapsables y dropdown "Quiero".
   ===================================================== */

// ---------- Estado global del toggle de importes ----------
let importesOcultos = false;

// Escapa HTML de datos ingresados por el usuario (nombres de productos, etc.)
function esc(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------- Ocultar importes ----------
function ocultarTextoImporte(texto) {
  // Reemplaza dígitos, puntos y comas por asteriscos; conserva "S/ " y espacios
  return texto.replace(/[\d.,]/g, "*");
}

function aplicarOcultarImportes() {
  document
    .querySelectorAll(".saldo, .saldo-importe, .credito-valor, .total-row__value")
    .forEach((el) => {
      if (importesOcultos) {
        if (!("textoOriginal" in el.dataset)) {
          el.dataset.textoOriginal = el.textContent;
        }
        el.textContent = ocultarTextoImporte(el.dataset.textoOriginal);
      } else if ("textoOriginal" in el.dataset) {
        el.textContent = el.dataset.textoOriginal;
      }
    });
}

function initSwitch() {
  const sw = document.getElementById("switch-ocultar");
  if (!sw) return;

  const toggle = () => {
    importesOcultos = !importesOcultos;
    sw.setAttribute("aria-checked", importesOcultos ? "true" : "false");
    sw.classList.toggle("is-on", importesOcultos);
    aplicarOcultarImportes();
  };

  sw.addEventListener("click", toggle);
  sw.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
}

// ---------- Pestañas ----------
function initTabs() {
  const tabs = document.querySelectorAll(".tabs__tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
      document.getElementById("tab-" + tab.dataset.tab).classList.add("is-active");
      // La pestaña de productos no es una "vista" especial: limpia el parámetro
      if (tab.dataset.tab === "mis-productos") limpiarVistaURL();
    });
  });
}

// ---------- Atajos del menú "Quiero" (detalle / movimientos / transferir) ----------
// Devuelve "detalle", "movimientos" o "transferir" según la URL (?vista=...)
function vistaDeURL() {
  const v = new URLSearchParams(window.location.search).get("vista");
  return ["detalle", "movimientos", "transferir"].includes(v) ? v : null;
}

// Reescribe/elimina ?vista=... en la URL sin recargar la página
function actualizarVistaURL(vista) {
  const url = new URL(window.location.href);
  if (vista) url.searchParams.set("vista", vista);
  else url.searchParams.delete("vista");
  window.history.replaceState({}, "", url);
}

function limpiarVistaURL() {
  actualizarVistaURL(null);
}

// Aplica la vista pedida: activa la pestaña de detalle, abre Operaciones
// y hace scroll al bloque correspondiente.
function activarVista(vista) {
  if (vista === "detalle" || vista === "movimientos") {
    activarTabDetalle();
    const objetivo =
      vista === "detalle"
        ? document.querySelector(".resumen")
        : document.querySelector(".movs-head");
    if (objetivo) objetivo.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (vista === "transferir") {
    activarTabDetalle();
    abrirPanelOperaciones(true);
  }
}

function activarTabDetalle() {
  const tab = document.querySelector('.tabs__tab[data-tab="mas-informacion"]');
  if (tab && !tab.classList.contains("is-active")) tab.click();
}

// Abre (o cierra) el panel de Operaciones; usado por el atajo "Transferir"
function abrirPanelOperaciones(abrir) {
  const panel = document.getElementById("ops-panel");
  if (!panel) return;
  panel.hidden = !abrir;
  document.querySelectorAll("[data-abre-operaciones]").forEach((b) =>
    b.classList.toggle("acciones-bar__btn--activo", !panel.hidden)
  );
  if (abrir) panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Si la página llega con ?vista=..., ejecuta el atajo al cargar
function activarVistaDesdeURL() {
  const vista = vistaDeURL();
  if (vista) activarVista(vista);
}

// Atajos del menú "Quiero" DENTRO de Cuentas/Tarjetas: no navegan,
// actualizan el producto+vista en la URL, re-renderizan y activan la vista.
// (delegación en document: sobrevive a los re-renders del listado)
function initAtajosQuiero() {
  document.addEventListener("click", (e) => {
    const opt = e.target.closest(".quiero-menu button[data-accion]");
    if (!opt) return;
    const numero = opt.dataset.cuenta || opt.dataset.tarjeta;
    if (!numero) return; // en Inicio lo maneja app.js con su propia lógica

    e.preventDefault();
    const param = opt.dataset.cuenta ? "cuenta" : "tarjeta";

    const url = new URL(window.location.href);
    url.searchParams.set(param, numero);
    url.searchParams.set("vista", opt.dataset.accion);
    window.history.replaceState({}, "", url);

    // Re-render con el producto elegido (detalle y resaltado del listado)
    if (typeof renderDetalle === "function") renderDetalle();
    if (document.getElementById("cuentas-tbody") && typeof renderCuentas === "function") renderCuentas();
    if (document.getElementById("tarjetas-tbody") && typeof renderTarjetas === "function") renderTarjetas();

    activarVista(opt.dataset.accion);
  });

  // Botón atrás del navegador: re-aplica el estado de la URL
  window.addEventListener("popstate", () => {
    if (typeof renderDetalle === "function") renderDetalle();
    if (document.getElementById("cuentas-tbody") && typeof renderCuentas === "function") renderCuentas();
    if (document.getElementById("tarjetas-tbody") && typeof renderTarjetas === "function") renderTarjetas();
    cerrarPanelOperaciones();
    activarVista(vistaDeURL());
  });
}

// Cierra el panel de Operaciones sin tocar la URL (para popstate)
function cerrarPanelOperaciones() {
  const panel = document.getElementById("ops-panel");
  if (!panel) return;
  panel.hidden = true;
  document.querySelectorAll("[data-abre-operaciones]").forEach((b) =>
    b.classList.remove("acciones-bar__btn--activo")
  );
}

// ---------- Dropdown "Quiero" ----------
function initQuieroMenus() {
  document.querySelectorAll(".btn-quiero").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      document.querySelectorAll(".quiero-menu.is-open").forEach((m) => {
        if (m !== menu) m.classList.remove("is-open");
      });
      menu.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".quiero-menu.is-open").forEach((m) =>
      m.classList.remove("is-open")
    );
  });
}

// ---------- Paneles colapsables ----------
function initPaneles() {
  document.querySelectorAll("[data-toggle]").forEach((header) => {
    header.addEventListener("click", () => {
      const panel = document.getElementById(header.dataset.toggle);
      panel.classList.toggle("panel--collapsed");
      header.setAttribute(
        "aria-expanded",
        panel.classList.contains("panel--collapsed") ? "false" : "true"
      );
    });
  });
}

// ---------- Detalle de movimiento (al seleccionar una fila) ----------
function toggleDetalleMovimiento(tr, mov, tbody) {
  const existente = tbody.querySelector(".movs-detalle-fila");

  // Si ya está abierto este mismo movimiento, solo se cierra
  if (
    existente &&
    existente.previousElementSibling === tr &&
    tr.classList.contains("movs-fila--seleccionada")
  ) {
    existente.remove();
    tr.classList.remove("movs-fila--seleccionada");
    return;
  }

  // Cerrar cualquier otro detalle abierto
  if (existente) existente.remove();
  tbody
    .querySelectorAll(".movs-fila--seleccionada")
    .forEach((f) => f.classList.remove("movs-fila--seleccionada"));

  tr.classList.add("movs-fila--seleccionada");

  const signo = mov.monto < 0 ? "- " : "";
  const fila = document.createElement("tr");
  fila.className = "movs-detalle-fila";
  fila.innerHTML = `
    <td colspan="3">
      <div class="movs-detalle">
        <div class="movs-detalle__barra">
          <span class="movs-icono movs-icono--pdf" title="Descargar PDF">PDF</span>
          <span class="movs-icono movs-icono--imprimir" title="Imprimir">&#128424;</span>
          <span class="movs-detalle__separador"></span>
          <button class="movs-detalle__cerrar" type="button">cerrar <span class="movs-detalle__cerrar-x">✕</span></button>
        </div>
        <div class="movs-detalle__resumen">
          <span class="movs-fecha">${mov.fecha}</span>
          <span class="movs-desc movs-enlace">${mov.descripcion}</span>
          <span class="movs-monto">${signo}${dinero(Math.abs(mov.monto))}</span>
        </div>
        <div class="movs-detalle__cuerpo">
          <h4 class="movs-detalle__titulo">Información de movimiento</h4>
          <div class="movs-detalle__campos">
            <div class="movs-campo"><dt>N° del movimiento</dt><dd>${mov.numero}</dd></div>
            <div class="movs-campo"><dt>Operación</dt><dd>${mov.operacion}</dd></div>
            <div class="movs-campo"><dt>Centro</dt><dd>${mov.centro}</dd></div>
            <div class="movs-campo"><dt>Tipo</dt><dd>${mov.tipo}</dd></div>
            <div class="movs-campo"><dt>Fecha Operación</dt><dd>${mov.fecha}</dd></div>
            <div class="movs-campo"><dt>Hora</dt><dd>${mov.hora}</dd></div>
            <div class="movs-campo"><dt>Fecha Valor</dt><dd>${mov.fechaValor}</dd></div>
            <div class="movs-campo"><dt>Fecha Contable</dt><dd>${mov.fechaContable}</dd></div>
          </div>
        </div>
      </div>
    </td>
  `;

  tr.after(fila);

  // Cerrar con el botón
  fila.querySelector(".movs-detalle__cerrar").addEventListener("click", () => {
    fila.remove();
    tr.classList.remove("movs-fila--seleccionada");
  });
}

function initDetalleMovimientos() {
  const tbody = document.getElementById("movs-tbody");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const fila = e.target.closest(".movs-fila");
    if (!fila || !tbody.contains(fila)) return;
    e.preventDefault();

    // El producto mostrado lo deja renderDetalle() en window.__productoActual
    const producto = window.__productoActual;
    const idx = parseInt(fila.dataset.mov, 10);
    const mov = producto && producto.movimientos ? producto.movimientos[idx] : null;
    if (mov) toggleDetalleMovimiento(fila, mov, tbody);
  });
}

// ---------- Panel Operaciones (Realizar transferencia) ----------
function initOperaciones() {
  const panel = document.getElementById("ops-panel");
  if (!panel) return;

  // Abrir/cerrar con el botón Operaciones (sincroniza ?vista=transferir)
  document.querySelectorAll("[data-abre-operaciones]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const abrir = panel.hidden;
      abrirPanelOperaciones(abrir);
      if (abrir) actualizarVistaURL("transferir");
      else limpiarVistaURL();
    });
  });

  // Cerrar con la X
  const cerrar = panel.querySelector("[data-cierra-operaciones]");
  if (cerrar) {
    cerrar.addEventListener("click", () => {
      abrirPanelOperaciones(false);
      limpiarVistaURL();
    });
  }

  // Segmentos: Mis cuentas / Terceros / Otros Bancos
  const segmentos = panel.querySelectorAll(".ops-segmento");
  segmentos.forEach((seg) => {
    seg.addEventListener("click", () => {
      segmentos.forEach((s) => s.classList.remove("is-activo"));
      seg.classList.add("is-activo");
      panel.querySelectorAll(".ops-form").forEach((f) => {
        f.classList.toggle("ops-form--activa", f.dataset.form === seg.dataset.segmento);
      });
    });
  });

  // Poblar el select de "Mis cuentas" con las cuentas registradas
  const select = panel.querySelector(".ops-select");
  if (select && typeof cuentas !== "undefined") {
    cuentas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.numero;
      opt.textContent = c.numero + " — " + c.nombre + " (" + dinero(c.saldoDisponible) + ")";
      select.appendChild(opt);
    });
  }

  // Botón Siguiente (por ahora solo valida que haya datos)
  const siguiente = panel.querySelector("[data-siguiente]");
  if (siguiente) {
    siguiente.addEventListener("click", () => {
      const activa = panel.querySelector(".ops-form--activa");
      if (!activa) return;

      if (activa.dataset.form === "mis-cuentas") {
        const val = activa.querySelector(".ops-select").value;
        if (!val) {
          alert("Seleccione una cuenta destino.");
          return;
        }
      } else {
        const vacio = [...activa.querySelectorAll(".ops-input")].some(
          (i) => i.tagName === "INPUT" && !i.value.trim()
        );
        if (vacio) {
          alert("Complete el número de cuenta destino.");
          return;
        }
      }

      // Importe (en Mis cuentas y Otros Bancos)
      const importeInput = activa.querySelector(".ops-input--importe");
      if (importeInput) {
        const importe = parseFloat(importeInput.value.replace(",", "."));
        if (isNaN(importe) || importe <= 0) {
          alert("Ingrese un importe válido a transferir.");
          importeInput.focus();
          return;
        }
      }

      alert("Paso 1 completado: cuenta destino registrada. (Paso 2 próximamente)");
    });
  }
}

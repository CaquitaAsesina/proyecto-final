/* =====================================================
   Banco — cuentas.js
   Módulo Cuentas: listado, detalle, pestañas y toggle
   ===================================================== */

// ---------- Parámetro de URL (?cuenta=...) ----------
function getCuentaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cuenta");
}

// ---------- Render de la tabla de cuentas ----------
function renderCuentas() {
  const tbody = document.getElementById("cuentas-tbody");
  const totalEl = document.getElementById("cuentas-total");
  const cuentaSeleccionada = getCuentaDesdeURL();

  tbody.innerHTML = cuentas
    .map((c) => {
      const resaltada = cuentaSeleccionada === c.numero ? " fila-resaltada" : "";
      return `
        <tr class="${resaltada.trim()}">
          <td>
            <div class="fila-producto">
              <div class="producto-info">
                <a class="cuenta-num cuenta-num--link" href="cuentas.html?cuenta=${encodeURIComponent(c.numero)}">${c.numero}</a>
                <span class="cuenta-nombre">${c.nombre}</span>
              </div>
              <div class="quiero-wrap">
                <button class="btn-quiero" type="button">Quiero</button>
                <div class="quiero-menu">
                  <button type="button" data-accion="detalle">Ver detalle</button>
                  <button type="button" data-accion="movimientos">Ver movimientos</button>
                  <button type="button" data-accion="transferir">Transferir</button>
                </div>
              </div>
            </div>
          </td>
          <td class="saldo">${soles(c.saldoContable)}</td>
          <td class="saldo">${soles(c.saldoDisponible)}</td>
        </tr>
      `;
    })
    .join("");

  const totalDisponible = cuentas.reduce((acc, c) => acc + c.saldoDisponible, 0);
  totalEl.textContent = soles(totalDisponible);
}

// ---------- Render del detalle (pestaña Más información) ----------
function renderDetalle() {
  const detalleEl = document.getElementById("cuenta-detalle");
  const cuentaSeleccionada = getCuentaDesdeURL();

  const cuenta = cuentas.find((c) => c.numero === cuentaSeleccionada) || cuentas[0];

  if (!cuenta) {
    detalleEl.innerHTML = "<dt class=\"detalle-vacio\">No hay cuentas registradas.</dt>";
    return;
  }

  detalleEl.innerHTML = `
    <div class="detalle-item detalle-item--full"><dt>Número de cuenta</dt><dd class="cuenta-num">${cuenta.numero}</dd></div>
    <div class="detalle-item"><dt>Nombre</dt><dd>${cuenta.nombre}</dd></div>
    <div class="detalle-item"><dt>Moneda</dt><dd>${cuenta.moneda}</dd></div>
    <div class="detalle-item"><dt>Estado</dt><dd>${cuenta.estado}</dd></div>
    <div class="detalle-item"><dt>Fecha de apertura</dt><dd>${cuenta.aperturada}</dd></div>
    <div class="detalle-item"><dt>Saldo contable</dt><dd class="saldo-importe">${soles(cuenta.saldoContable)}</dd></div>
    <div class="detalle-item"><dt>Saldo disponible</dt><dd class="saldo-importe">${soles(cuenta.saldoDisponible)}</dd></div>
  `;
}

// ---------- Pestañas ----------
function initTabs() {
  const tabs = document.querySelectorAll(".tabs__tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelectorAll(".tab-panel").forEach((p) =>
        p.classList.remove("is-active")
      );
      document.getElementById("tab-" + tab.dataset.tab).classList.add("is-active");
    });
  });
}

// ---------- Toggle Ocultar importes ----------
let importesOcultos = false;

function ocultarTextoImporte(texto) {
  // Reemplaza dígitos, puntos y comas por asteriscos; conserva "S/ " y espacios
  return texto.replace(/[\d.,]/g, "*");
}

function aplicarOcultarImportes() {
  document
    .querySelectorAll(".saldo, .saldo-importe, .total-row__value")
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

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCuentas();
  renderDetalle();
  initTabs();
  initSwitch();
  initQuieroMenus();
  initPaneles();
  aplicarOcultarImportes();
});

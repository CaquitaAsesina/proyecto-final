/* =====================================================
   Banco — cuentas.js
   Módulo Cuentas: listado y detalle de cuentas
   (utilidades de UI en js/ui.js, datos en js/datos.js)
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
          <td class="saldo">${dinero(c.saldoContable, c.moneda)}</td>
          <td class="saldo">${dinero(c.saldoDisponible, c.moneda)}</td>
        </tr>
      `;
    })
    .join("");

  totalEl.innerHTML = totalesPorMoneda(cuentas, (c) => c.saldoDisponible)
    .map((t) => dinero(t.total, t.moneda))
    .join(" &nbsp;·&nbsp; ");
}

// ---------- Render del detalle (pestaña Más información) ----------
function renderDetalle() {
  const detalleEl = document.getElementById("cuenta-detalle");
  const cuentaSeleccionada = getCuentaDesdeURL();

  const cuenta = cuentas.find((c) => c.numero === cuentaSeleccionada) || cuentas[0];

  if (!cuenta) {
    detalleEl.innerHTML = "<div class=\"detalle-vacio\">No hay cuentas registradas.</div>";
    return;
  }

  detalleEl.innerHTML = `
    <div class="detalle-item detalle-item--full"><dt>Número de cuenta</dt><dd class="cuenta-num">${cuenta.numero}</dd></div>
    <div class="detalle-item"><dt>Nombre</dt><dd>${cuenta.nombre}</dd></div>
    <div class="detalle-item"><dt>Moneda</dt><dd>${cuenta.moneda}</dd></div>
    <div class="detalle-item"><dt>Estado</dt><dd>${cuenta.estado}</dd></div>
    <div class="detalle-item"><dt>Fecha de apertura</dt><dd>${cuenta.aperturada}</dd></div>
    <div class="detalle-item"><dt>Saldo contable</dt><dd class="saldo-importe">${dinero(cuenta.saldoContable, cuenta.moneda)}</dd></div>
    <div class="detalle-item"><dt>Saldo disponible</dt><dd class="saldo-importe">${dinero(cuenta.saldoDisponible, cuenta.moneda)}</dd></div>
  `;
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCuentas();
  renderDetalle();
  initTabs();
  initSwitch();
  initQuieroMenus();
  initPaneles();
  if (importesOcultos) aplicarOcultarImportes();
});

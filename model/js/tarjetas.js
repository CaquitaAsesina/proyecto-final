/* =====================================================
   Banco — tarjetas.js
   Módulo Tarjetas: listado y detalle de tarjetas
   (utilidades de UI en js/ui.js, datos en js/datos.js)
   ===================================================== */

// ---------- Parámetro de URL (?tarjeta=...) ----------
function getTarjetaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tarjeta");
}

// ---------- Render de la tabla de tarjetas ----------
function renderTarjetas() {
  const tbody = document.getElementById("tarjetas-tbody");
  const totalEl = document.getElementById("tarjetas-total");
  const tarjetaSeleccionada = getTarjetaDesdeURL();

  tbody.innerHTML = tarjetas
    .map((t) => {
      const disponible = t.lineaCredito - t.consumo;
      const pct = Math.min(100, (t.consumo / t.lineaCredito) * 100);
      const resaltada = tarjetaSeleccionada === t.numero ? " fila-resaltada" : "";
      return `
        <tr class="${resaltada.trim()}">
          <td>
            <div class="fila-producto">
              <div class="producto-info">
                <a class="tarjeta-num tarjeta-num--link" href="tarjetas.html?tarjeta=${encodeURIComponent(t.numero)}">${t.numero}</a>
                <span class="tarjeta-nombre">${t.nombre}</span>
                <span class="tarjeta-titular">${t.titular}</span>
              </div>
              <div class="quiero-wrap">
                <button class="btn-quiero" type="button">Quiero</button>
                <div class="quiero-menu">
                  <button type="button" data-accion="detalle">Ver detalle</button>
                  <button type="button" data-accion="movimientos">Ver movimientos</button>
                  <button type="button" data-accion="pagar">Pagar tarjeta</button>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="credito-grid">
              <span class="credito-label">Consumido:</span>
              <span class="credito-label" style="text-align:right;">Disponible:</span>
              <span class="credito-valor">${dinero(t.consumo, t.moneda)}</span>
              <span class="credito-valor credito-valor--verde">${dinero(disponible, t.moneda)}</span>
              <div class="barra-credito">
                <div class="barra-credito__fill" style="width: ${pct}%;"></div>
              </div>
              <div class="linea-credito">Línea de crédito ${dinero(t.lineaCredito, t.moneda)}</div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  totalEl.innerHTML = totalesPorMoneda(tarjetas, (t) => t.lineaCredito - t.consumo)
    .map((t) => dinero(t.total, t.moneda))
    .join(" &nbsp;·&nbsp; ");
}

// ---------- Render del detalle (pestaña Más información) ----------
function renderDetalle() {
  const detalleEl = document.getElementById("tarjeta-detalle");
  const tarjetaSeleccionada = getTarjetaDesdeURL();

  const tarjeta = tarjetas.find((t) => t.numero === tarjetaSeleccionada) || tarjetas[0];

  if (!tarjeta) {
    detalleEl.innerHTML = "<div class=\"detalle-vacio\">No hay tarjetas registradas.</div>";
    return;
  }

  const disponible = tarjeta.lineaCredito - tarjeta.consumo;
  const pct = Math.min(100, (tarjeta.consumo / tarjeta.lineaCredito) * 100);

  detalleEl.innerHTML = `
    <div class="detalle-item detalle-item--full"><dt>Número de tarjeta</dt><dd class="tarjeta-num">${tarjeta.numero}</dd></div>
    <div class="detalle-item"><dt>Producto</dt><dd>${tarjeta.nombre}</dd></div>
    <div class="detalle-item"><dt>Titular</dt><dd>${tarjeta.titular}</dd></div>
    <div class="detalle-item"><dt>Estado</dt><dd>${tarjeta.estado}</dd></div>
    <div class="detalle-item"><dt>Fecha de emisión</dt><dd>${tarjeta.emision}</dd></div>
    <div class="detalle-item"><dt>Línea de crédito</dt><dd class="saldo-importe">${dinero(tarjeta.lineaCredito, tarjeta.moneda)}</dd></div>
    <div class="detalle-item"><dt>Crédito consumido</dt><dd class="saldo-importe">${dinero(tarjeta.consumo, tarjeta.moneda)}</dd></div>
    <div class="detalle-item"><dt>Crédito disponible</dt><dd class="saldo-importe">${dinero(disponible, tarjeta.moneda)}</dd></div>
    <div class="detalle-item detalle-item--full">
      <dt>Uso de la línea</dt>
      <dd>
        <div class="barra-credito" style="max-width: 340px;">
          <div class="barra-credito__fill" style="width: ${pct}%;"></div>
        </div>
      </dd>
    </div>
  `;
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderTarjetas();
  renderDetalle();
  initTabs();
  initSwitch();
  initQuieroMenus();
  initPaneles();
  if (importesOcultos) aplicarOcultarImportes();
});

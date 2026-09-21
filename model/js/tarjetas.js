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
                <a class="tarjeta-num tarjeta-num--link" href="tarjetas.html?tarjeta=${encodeURIComponent(t.numero)}">${esc(t.numero)}</a>
                <span class="tarjeta-nombre">${esc(t.nombre)}</span>
                <span class="tarjeta-titular">${esc(t.titular)}</span>
              </div>
              <div class="quiero-wrap">
                <button class="btn-quiero" type="button">Quiero</button>
                <div class="quiero-menu">
                  <button type="button" data-accion="detalle" data-tarjeta="${t.numero}">Ver detalle</button>
                  <button type="button" data-accion="movimientos" data-tarjeta="${t.numero}">Ver movimientos</button>
                  <button type="button" data-accion="transferir" data-tarjeta="${t.numero}">Transferir</button>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="credito-grid">
              <span class="credito-label">Consumido:</span>
              <span class="credito-label" style="text-align:right;">Disponible:</span>
              <span class="credito-valor">${dinero(t.consumo)}</span>
              <span class="credito-valor credito-valor--verde">${dinero(disponible)}</span>
              <div class="barra-credito">
                <div class="barra-credito__fill" style="width: ${pct}%;"></div>
              </div>
              <div class="linea-credito">Línea de crédito ${dinero(t.lineaCredito)}</div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const totalCredito = tarjetas.reduce(
    (acc, t) => acc + (t.lineaCredito - t.consumo),
    0
  );
  totalEl.textContent = dinero(totalCredito);
}

// ---------- Render del detalle (pestaña Más información) ----------
function renderDetalle() {
  const numEl = document.getElementById("detalle-numero");
  const nombreEl = document.getElementById("detalle-nombre");
  const disponibleEl = document.getElementById("detalle-disponible");
  const consumidoEl = document.getElementById("detalle-consumido");
  const movsTbody = document.getElementById("movs-tbody");

  const tarjetaSeleccionada = getTarjetaDesdeURL();
  const tarjeta = tarjetas.find((t) => t.numero === tarjetaSeleccionada) || tarjetas[0];

  if (!tarjeta) {
    numEl.textContent = "—";
    nombreEl.textContent = "No hay tarjetas registradas.";
    disponibleEl.textContent = "";
    consumidoEl.textContent = "";
    movsTbody.innerHTML = "";
    return;
  }

  const disponible = tarjeta.lineaCredito - tarjeta.consumo;

  // Producto actual (para initDetalleMovimientos)
  window.__productoActual = tarjeta;

  // Resumen
  numEl.textContent = tarjeta.numero;
  nombreEl.textContent = tarjeta.nombre;
  disponibleEl.textContent = dinero(disponible);
  consumidoEl.textContent = dinero(tarjeta.consumo);

  // Movimientos (filas clickeables; el detalle se inserta debajo de la fila)
  const movs = tarjeta.movimientos || [];
  movsTbody.innerHTML = movs
    .map((m, i) => {
      const signo = m.monto < 0 ? "- " : "";
      return `
        <tr class="movs-fila" data-mov="${i}">
          <td class="movs-fecha">${m.fecha}</td>
          <td class="movs-desc"><a href="#" class="movs-enlace">${esc(m.descripcion)}</a></td>
          <td class="movs-monto">${signo}${dinero(Math.abs(m.monto))}</td>
        </tr>
      `;
    })
    .join("");
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosUsuario();
  initSesionHeader();
  renderTarjetas();
  renderDetalle();
  initTabs();
  initSwitch();
  initQuieroMenus();
  initPaneles();
  initOperaciones();
  initDetalleMovimientos();
  initAtajosQuiero();
  activarVistaDesdeURL();
  if (importesOcultos) aplicarOcultarImportes();
});

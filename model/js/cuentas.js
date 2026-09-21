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
                <a class="cuenta-num cuenta-num--link" href="cuentas.html?cuenta=${encodeURIComponent(c.numero)}">${esc(c.numero)}</a>
                <span class="cuenta-nombre">${esc(c.nombre)}</span>
              </div>
              <div class="quiero-wrap">
                <button class="btn-quiero" type="button">Quiero</button>
                <div class="quiero-menu">
                  <button type="button" data-accion="detalle" data-cuenta="${c.numero}">Ver detalle</button>
                  <button type="button" data-accion="movimientos" data-cuenta="${c.numero}">Ver movimientos</button>
                  <button type="button" data-accion="transferir" data-cuenta="${c.numero}">Transferir</button>
                </div>
              </div>
            </div>
          </td>
          <td class="saldo">${dinero(c.saldoContable)}</td>
          <td class="saldo">${dinero(c.saldoDisponible)}</td>
        </tr>
      `;
    })
    .join("");

  const totalDisponible = cuentas.reduce((acc, c) => acc + c.saldoDisponible, 0);
  totalEl.textContent = dinero(totalDisponible);
}

// ---------- Render del detalle (pestaña Más información) ----------
function renderDetalle() {
  const numEl = document.getElementById("detalle-numero");
  const nombreEl = document.getElementById("detalle-nombre");
  const disponibleEl = document.getElementById("detalle-disponible");
  const contableEl = document.getElementById("detalle-contable");
  const movsTbody = document.getElementById("movs-tbody");

  const cuentaSeleccionada = getCuentaDesdeURL();
  const cuenta = cuentas.find((c) => c.numero === cuentaSeleccionada) || cuentas[0];

  if (!cuenta) {
    numEl.textContent = "—";
    nombreEl.textContent = "No hay cuentas registradas.";
    disponibleEl.textContent = "";
    contableEl.textContent = "";
    movsTbody.innerHTML = "";
    return;
  }

  // Producto actual (para initDetalleMovimientos)
  window.__productoActual = cuenta;

  // Resumen
  numEl.textContent = cuenta.numero;
  nombreEl.textContent = cuenta.nombre;
  disponibleEl.textContent = dinero(cuenta.saldoDisponible);
  contableEl.textContent = dinero(cuenta.saldoContable);

  // Movimientos (filas clickeables; el detalle se inserta debajo de la fila)
  const movs = cuenta.movimientos || [];
  movsTbody.innerHTML = movs
    .map((m, i) => {
      const clase = m.monto < 0 ? " movs-monto--negativo" : "";
      const monto = dinero(Math.abs(m.monto));
      const signo = m.monto < 0 ? "- " : "";
      return `
        <tr class="movs-fila" data-mov="${i}">
          <td class="movs-fecha">${m.fecha}</td>
          <td class="movs-desc"><a href="#" class="movs-enlace">${esc(m.descripcion)}</a></td>
          <td class="movs-monto${clase}">${signo}${monto}</td>
        </tr>
      `;
    })
    .join("");
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosUsuario();
  initSesionHeader();
  renderCuentas();
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

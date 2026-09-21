/* =====================================================
   Banco — app.js
   Módulo Inicio: render de cuentas y tarjetas
   (utilidades de UI en js/ui.js, datos en js/datos.js)
   ===================================================== */

// ---------- Render de CUENTAS ----------
function renderCuentas() {
  const tbody = document.getElementById("cuentas-tbody");
  const totalEl = document.getElementById("cuentas-total");

  tbody.innerHTML = cuentas
    .map((c) => {
      return `
        <tr>
          <td>
            <div class="fila-producto">
              <div class="producto-info">
                <a class="cuenta-num cuenta-num--link" href="cuentas.html?cuenta=${encodeURIComponent(c.numero)}" title="Ver detalle de la cuenta">${esc(c.numero)}</a>
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

// ---------- Render de TARJETAS ----------
function renderTarjetas() {
  const tbody = document.getElementById("tarjetas-tbody");
  const totalEl = document.getElementById("tarjetas-total");

  tbody.innerHTML = tarjetas
    .map((t) => {
      const disponible = t.lineaCredito - t.consumo;
      const pct = Math.min(100, (t.consumo / t.lineaCredito) * 100);
      return `
        <tr>
          <td>
            <div class="fila-producto">
              <div class="producto-info">
                <a class="tarjeta-num tarjeta-num--link" href="tarjetas.html?tarjeta=${encodeURIComponent(t.numero)}" title="Ver detalle de la tarjeta">${esc(t.numero)}</a>
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

// ---------- Acciones del menú "Quiero" (atajos) ----------
function ejecutarAccion(accion, origen) {
  const producto = origen.cuenta
    ? "cuenta=" + encodeURIComponent(origen.cuenta)
    : "tarjeta=" + encodeURIComponent(origen.tarjeta);
  const pagina = origen.cuenta ? "cuentas.html" : "tarjetas.html";

  // Atajos: detalle → resumen, movimientos → tabla, transferir → panel Operaciones
  const vista = accion === "detalle" || accion === "movimientos" || accion === "transferir"
    ? "&vista=" + accion
    : "";

  if (accion === "pagar") {
    alert("Funcionalidad próximamente: pagar tarjeta.");
    return;
  }

  window.location.href = pagina + "?" + producto + vista;
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosUsuario();
  initSesionHeader();
  renderCuentas();
  renderTarjetas();

  // Opciones del menú "Quiero"
  document.querySelectorAll(".quiero-menu button[data-accion]").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      ejecutarAccion(opt.dataset.accion, {
        cuenta: opt.dataset.cuenta,
        tarjeta: opt.dataset.tarjeta,
      });
    });
  });

  initQuieroMenus();
  initPaneles();
});

/* =====================================================
   Banco — app.js
   Módulo Inicio: render de cuentas y tarjetas
   (los datos viven en js/datos.js)
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
                <a class="cuenta-num cuenta-num--link" href="cuentas.html?cuenta=${encodeURIComponent(c.numero)}" title="Ver detalle de la cuenta">${c.numero}</a>
                <span class="cuenta-nombre">${c.nombre}</span>
              </div>
              <div class="quiero-wrap">
                <button class="btn-quiero" type="button">Quiero</button>
                <div class="quiero-menu">
                  <button type="button" data-accion="detalle" data-cuenta="${c.numero}">Ver detalle</button>
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
                <span class="tarjeta-num">${t.numero}</span>
                <span class="tarjeta-nombre">${t.nombre}</span>
                <span class="tarjeta-titular">${t.titular}</span>
              </div>
              <div class="quiero-wrap">
                <button class="btn-quiero" type="button">Quiero</button>
                <div class="quiero-menu">
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
              <span class="credito-valor">${soles(t.consumo)}</span>
              <span class="credito-valor credito-valor--verde">${soles(disponible)}</span>
              <div class="barra-credito">
                <div class="barra-credito__fill" style="width: ${pct}%;"></div>
              </div>
              <div class="linea-credito">Línea de crédito ${soles(t.lineaCredito)}</div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const totalDisponible = tarjetas.reduce(
    (acc, t) => acc + (t.lineaCredito - t.consumo),
    0
  );
  totalEl.textContent = soles(totalDisponible);
}

// ---------- Acciones del menú "Quiero" ----------
function ejecutarAccion(accion, cuenta) {
  if (accion === "detalle" || accion === "saldo") {
    window.location.href = "cuentas.html" + (cuenta ? "?cuenta=" + encodeURIComponent(cuenta) : "");
  } else {
    alert("Funcionalidad próximamente: " + accion);
  }
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

  // Opciones del menú
  document.querySelectorAll(".quiero-menu button[data-accion]").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      ejecutarAccion(opt.dataset.accion, opt.dataset.cuenta);
    });
  });

  // Cerrar al hacer clic fuera
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
  renderTarjetas();
  initQuieroMenus();
  initPaneles();
});

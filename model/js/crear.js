/* =====================================================
   Banco — crear.js
   Módulo Crear: registrar una cuenta o tarjeta nueva.
   El producto queda asociado al usuario en sesión
   (localStorage, ver js/usuarios.js) y aparece en
   Inicio, Cuentas y Tarjetas.
   ===================================================== */

// ---------- Selector Cuenta / Tarjeta ----------
function initSelectorTipo() {
  const tabs = document.querySelectorAll(".tabs__tab");
  const titulo = document.getElementById("crear-titulo");
  const linea = document.getElementById("campo-linea");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const esTarjeta = tab.dataset.tipo === "tarjeta";
      titulo.textContent = esTarjeta ? "Nueva tarjeta" : "Nueva cuenta";
      linea.hidden = !esTarjeta;
      const labelSaldo = document.getElementById("crear-label-saldo");
      if (labelSaldo) labelSaldo.textContent = esTarjeta ? "Consumo inicial" : "Saldo inicial";
    });
  });
}

// ---------- Generación de números de producto (demo) ----------
function generarNumeroCuenta() {
  const bloque = () => String(Math.floor(1000 + Math.random() * 9000));
  return "0011-" + bloque() + "-" + bloque() + bloque();
}

function generarNumeroTarjeta() {
  const bloque = () => String(Math.floor(1000 + Math.random() * 9000));
  return "4" + String(Math.floor(100 + Math.random() * 900)) + "-" + bloque() + "-" + bloque() + "-" + bloque();
}

function hoy() {
  const f = new Date();
  return (
    String(f.getDate()).padStart(2, "0") + "/" +
    String(f.getMonth() + 1).padStart(2, "0") + "/" +
    f.getFullYear()
  );
}

// ---------- Envío del formulario ----------
function initCrearForm() {
  const form = document.getElementById("crear-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const esTarjeta = document.querySelector(".tabs__tab.is-active").dataset.tipo === "tarjeta";
    const nombre = document.getElementById("crear-nombre").value.trim().toUpperCase();
    const saldo = parseFloat(document.getElementById("crear-saldo").value.replace(",", "."));
    const linea = parseFloat((document.getElementById("crear-linea").value || "").replace(",", "."));
    const err = document.getElementById("crear-error");

    const fallo = (msg) => {
      err.textContent = msg;
      err.hidden = false;
    };

    if (!nombre) return fallo("Ingresa el nombre del producto.");
    if (isNaN(saldo) || saldo < 0) return fallo("Ingresa un saldo inicial válido.");
    if (esTarjeta && (isNaN(linea) || linea <= 0))
      return fallo("Ingresa una línea de crédito válida.");
    if (esTarjeta && saldo > linea)
      return fallo("El consumo no puede superar la línea de crédito.");

    err.hidden = true;

    const producto = esTarjeta
      ? {
          tipo: "tarjetas",
          data: {
            numero: generarNumeroTarjeta(),
            nombre: nombre,
            titular: "TITULAR",
            consumo: saldo,
            lineaCredito: linea,
            saldoDisponible: linea - saldo,
            estado: "Activa",
            emision: hoy(),
            movimientos: [],
          },
        }
      : {
          tipo: "cuentas",
          data: {
            numero: generarNumeroCuenta(),
            nombre: nombre,
            saldoContable: saldo,
            saldoDisponible: saldo,
            estado: "Activa",
            aperturada: hoy(),
            movimientos: [],
          },
        };

    guardarProductoCreado(producto);

    const destino = esTarjeta
      ? "tarjetas.html?tarjeta=" + encodeURIComponent(producto.data.numero) + "&vista=detalle"
      : "cuentas.html?cuenta=" + encodeURIComponent(producto.data.numero) + "&vista=detalle";

    window.location.href = destino;
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  // Protege la página: solo clientes (el analista va a su módulo)
  exigirCliente();
  if (!usuarioActual()) return;
  initSesionHeader();
  initSelectorTipo();
  initCrearForm();
});

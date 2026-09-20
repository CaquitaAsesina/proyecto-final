/* =====================================================
   Banco — datos.js
   Datos compartidos entre módulos (Inicio, Cuentas, ...)
   ===================================================== */

const cuentas = [
  {
    numero: "0011-0814-0290104608",
    nombre: "CUENTA INDEPENDENCIA",
    saldoContable: 59.4,
    saldoDisponible: 59.4,
    moneda: "Soles",
    estado: "Activa",
    aperturada: "15/03/2024",
  },
];

const tarjetas = [
  {
    numero: "4919-0984-7657-8899",
    nombre: "VISA BFREE",
    titular: "TITULAR",
    consumo: 449.62,
    lineaCredito: 500.0,
  },
];

// ---------- Utilidades compartidas ----------
const formatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const soles = (n) => "S/ " + formatter.format(n);

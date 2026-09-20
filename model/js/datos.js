/* =====================================================
   Banco — datos.js
   Datos compartidos entre módulos (Inicio, Cuentas, Tarjetas)
   Todos los importes en SOLES (S/).
   ===================================================== */

const cuentas = [
  {
    numero: "0011-0814-0290104608",
    nombre: "CUENTA INDEPENDENCIA",
    saldoContable: 2350.75,
    saldoDisponible: 2150.75,
    estado: "Activa",
    aperturada: "15/03/2024",
  },
  {
    numero: "0011-0802-0194457621",
    nombre: "CUENTA SUELDOS",
    saldoContable: 4820.0,
    saldoDisponible: 4820.0,
    estado: "Activa",
    aperturada: "02/08/2023",
  },
  {
    numero: "0011-0945-0302876410",
    nombre: "CUENTA AHORROS",
    saldoContable: 4301.75,
    saldoDisponible: 3833.14,
    estado: "Activa",
    aperturada: "19/11/2022",
  },
  {
    numero: "0011-0805-0410389247",
    nombre: "CUENTA PLAZO FIJO",
    saldoContable: 10000.0,
    saldoDisponible: 9999.0,
    estado: "Bloqueada",
    aperturada: "05/05/2025",
  },
];

const tarjetas = [
  {
    numero: "4919-0984-7657-8899",
    nombre: "VISA BFREE",
    titular: "TITULAR",
    consumo: 449.62,
    lineaCredito: 500.0,
    estado: "Activa",
    emision: "10/01/2025",
  },
  {
    numero: "5412-7513-2890-4416",
    nombre: "MASTERCARD ORO",
    titular: "TITULAR",
    consumo: 3250.4,
    lineaCredito: 8000.0,
    estado: "Activa",
    emision: "22/06/2024",
  },
  {
    numero: "4544-1802-9931-5077",
    nombre: "VISA SIGNATURE",
    titular: "TITULAR",
    consumo: 1042.5,
    lineaCredito: 17375.0,
    estado: "Bloqueada",
    emision: "03/02/2023",
  },
];

// ---------- Utilidades compartidas ----------
const formatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Formatea un importe en soles: S/ 1,234.56
function dinero(n) {
  return "S/ " + formatter.format(n);
}

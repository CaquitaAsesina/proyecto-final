/* =====================================================
   Banco — datos.js
   Datos compartidos entre módulos (Inicio, Cuentas, Tarjetas)
   ===================================================== */

const cuentas = [
  {
    numero: "0011-0814-0290104608",
    nombre: "CUENTA INDEPENDENCIA",
    saldoContable: 2350.75,
    saldoDisponible: 2150.75,
    moneda: "Soles",
    estado: "Activa",
    aperturada: "15/03/2024",
  },
  {
    numero: "0011-0802-0194457621",
    nombre: "CUENTA SUELDOS",
    saldoContable: 4820.0,
    saldoDisponible: 4820.0,
    moneda: "Soles",
    estado: "Activa",
    aperturada: "02/08/2023",
  },
  {
    numero: "0011-0945-0302876410",
    nombre: "CUENTA AHORRO USD",
    saldoContable: 1240.5,
    saldoDisponible: 1105.25,
    moneda: "Dólares",
    estado: "Activa",
    aperturada: "19/11/2022",
  },
  {
    numero: "0011-0805-0410389247",
    nombre: "CUENTA PLAZO FIJO",
    saldoContable: 10000.0,
    saldoDisponible: 0.0,
    moneda: "Soles",
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
    moneda: "Soles",
    estado: "Activa",
    emision: "10/01/2025",
  },
  {
    numero: "5412-7513-2890-4416",
    nombre: "MASTERCARD ORO",
    titular: "TITULAR",
    consumo: 3250.4,
    lineaCredito: 8000.0,
    moneda: "Soles",
    estado: "Activa",
    emision: "22/06/2024",
  },
  {
    numero: "4544-1802-9931-5077",
    nombre: "VISA SIGNATURE",
    titular: "TITULAR",
    consumo: 300.0,
    lineaCredito: 5000.0,
    moneda: "Dólares",
    estado: "Bloqueada",
    emision: "03/02/2023",
  },
];

// ---------- Utilidades compartidas ----------
const formatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Formatea un importe según su moneda: S/ 1,234.56 o US$ 1,234.56
function dinero(n, moneda) {
  if (moneda === "Dólares") return "US$ " + formatter.format(n);
  return "S/ " + formatter.format(n);
}

// Suma importes agrupándolos por moneda -> [{ moneda, total }]
function totalesPorMoneda(items, montoFn) {
  const mapa = new Map();
  items.forEach((it) => {
    const m = it.moneda || "Soles";
    mapa.set(m, (mapa.get(m) || 0) + montoFn(it));
  });
  return [...mapa.entries()].map(([moneda, total]) => ({ moneda, total }));
}

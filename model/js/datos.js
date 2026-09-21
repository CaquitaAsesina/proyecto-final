/* =====================================================
   Banco — datos.js
   Datos compartidos entre módulos (Inicio, Cuentas, Tarjetas)
   Todos los importes en SOLES (S/).
   ===================================================== */

const cuentas = [
  {
    numero: "0011-0123-4567890123",
    nombre: "CUENTA NOMINA",
    saldoContable: 5830.25,
    saldoDisponible: 5730.25,
    estado: "Activa",
    aperturada: "12/01/2025",
    movimientos: [
      { fecha: "18/09/2026", descripcion: "ABONO NOMINA TEXTIL ANDINA SAC", monto: 3200.0 },
      { fecha: "16/09/2026", descripcion: "YAPE-RODRIGO PAZ C/701234******8901", monto: -45.5 },
      { fecha: "14/09/2026", descripcion: "PAGO SERVICIO AGUA SEDAPAL", monto: -68.75 },
      { fecha: "12/09/2026", descripcion: "PLIN VALERIA SOTO RIOS", monto: 120.0 },
      { fecha: "09/09/2026", descripcion: "RETIRO CAJERO SAN ISIDRO", monto: -300.0 },
    ],
  },
  {
    numero: "0011-0987-6543210987",
    nombre: "CUENTA AHORRO PLUS",
    saldoContable: 12450.0,
    saldoDisponible: 11980.5,
    estado: "Activa",
    aperturada: "03/07/2023",
    movimientos: [
      { fecha: "17/09/2026", descripcion: "DEPOSITO EFECTIVO AGENTE", monto: 850.0 },
      { fecha: "15/09/2026", descripcion: "TRANSFERENCIA RECIBIDA CTA 0987", monto: 450.0 },
      { fecha: "11/09/2026", descripcion: "INTERESES GANADOS AGOSTO", monto: 38.75 },
      { fecha: "08/09/2026", descripcion: "TRANSFERENCIA ENVIADA CTA 4567", monto: -600.0 },
      { fecha: "04/09/2026", descripcion: "COMPRA COMERCIO ONLINE", monto: -158.25 },
    ],
  },
  {
    numero: "0011-0555-1111222233",
    nombre: "CUENTA AHORRO DIVISA",
    saldoContable: 8215.4,
    saldoDisponible: 8215.4,
    estado: "Activa",
    aperturada: "25/10/2024",
    movimientos: [
      { fecha: "16/09/2026", descripcion: "DEPOSITO EFECTIVO AGENCIA", monto: 1200.0 },
      { fecha: "13/09/2026", descripcion: "YAPE-LUCIA MORALES C/769876******6543", monto: -95.0 },
      { fecha: "10/09/2026", descripcion: "INTERESES GANADOS AGOSTO", monto: 25.4 },
      { fecha: "06/09/2026", descripcion: "PLIN MARTIN ESPINOZA CRUZ", monto: 200.0 },
      { fecha: "02/09/2026", descripcion: "PAGO TARJETA VISA 5566", monto: -350.0 },
    ],
  },
  {
    numero: "0011-0777-3333444455",
    nombre: "CUENTA PROGRAMADA",
    saldoContable: 15000.0,
    saldoDisponible: 0.0,
    estado: "Bloqueada",
    aperturada: "18/02/2026",
    movimientos: [
      { fecha: "18/08/2026", descripcion: "CONSTITUCION DEPOSITO PROGRAMADO", monto: -15000.0 },
      { fecha: "18/08/2026", descripcion: "DEPOSITO DEPOSITO PROGRAMADO", monto: 15000.0 },
      { fecha: "18/07/2026", descripcion: "INTERES DEVENGADO JULIO", monto: 52.5 },
      { fecha: "18/06/2026", descripcion: "INTERES DEVENGADO JUNIO", monto: 52.5 },
      { fecha: "18/05/2026", descripcion: "INTERES DEVENGADO MAYO", monto: 52.5 },
    ],
  },
];

const tarjetas = [
  {
    numero: "5312-8765-4321-0987",
    nombre: "MASTERCARD CLASICA",
    titular: "TITULAR",
    consumo: 892.35,
    lineaCredito: 3500.0,
    estado: "Activa",
    emision: "14/03/2025",
    movimientos: [
      { fecha: "17/09/2026", descripcion: "COMPRA SUPERMERCADO METRO", monto: -214.8 },
      { fecha: "15/09/2026", descripcion: "COMPRA FARMACIA MIFARMA", monto: -56.9 },
      { fecha: "13/09/2026", descripcion: "PAGO DE TARJETA - ABONO", monto: 400.0 },
      { fecha: "10/09/2026", descripcion: "COMPRA RESTAURANT TANTA", monto: -132.5 },
      { fecha: "07/09/2026", descripcion: "SUSCRIPCION MUSICA DIGITAL", monto: -16.9 },
    ],
  },
  {
    numero: "4539-2211-3344-5566",
    nombre: "VISA ORO",
    titular: "TITULAR",
    consumo: 2145.8,
    lineaCredito: 6000.0,
    estado: "Activa",
    emision: "29/08/2024",
    movimientos: [
      { fecha: "16/09/2026", descripcion: "COMPRA TIENDA PARIS SAN MIGUEL", monto: -489.9 },
      { fecha: "14/09/2026", descripcion: "GASOLINA PRIMAX - REPSOL", monto: -150.0 },
      { fecha: "12/09/2026", descripcion: "PAGO DE TARJETA - ABONO", monto: 650.0 },
      { fecha: "09/09/2026", descripcion: "COMPRA AEROLINEA SKY", monto: -780.0 },
      { fecha: "05/09/2026", descripcion: "COMPRA CASINELLI LIBRERIA", monto: -75.9 },
    ],
  },
  {
    numero: "4550-9988-7766-5544",
    nombre: "VISA INFINITA",
    titular: "TITULAR",
    consumo: 620.0,
    lineaCredito: 15000.0,
    estado: "Bloqueada",
    emision: "07/12/2023",
    movimientos: [
      { fecha: "15/09/2026", descripcion: "COMPRA HOTEL LOS DELFINES", monto: -520.0 },
      { fecha: "11/09/2026", descripcion: "PAGO DE TARJETA - ABONO", monto: 1000.0 },
      { fecha: "08/09/2026", descripcion: "COMPRA RIPLEY", monto: -45.0 },
      { fecha: "04/09/2026", descripcion: "SUSCRIPCION STREAMING VIDEO", monto: -44.9 },
      { fecha: "01/09/2026", descripcion: "COMPRA SUPERMERCADO WONG", monto: -310.2 },
    ],
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

// ---------- Datos operativos para el detalle de movimientos (demo) ----------
function operacionDe(desc) {
  if (/COMPRA/.test(desc)) return "COMPRA COMERC";
  if (/YAPE|PLIN/.test(desc)) return "TRANSFERENCIA MOVIL";
  if (/TRANSFERENCIA/.test(desc)) return "TRANSFERENCIA CTA";
  if (/NOMINA/.test(desc)) return "ABONO NOMINA";
  if (/RETIRO/.test(desc)) return "RETIRO CAJERO";
  if (/INTERES/.test(desc)) return "ABONO INTERES";
  if (/DEPOSITO|CONSTITUCION/.test(desc)) return "DEPOSITO CTA";
  if (/LUZ|AGUA|SERVICIO/.test(desc)) return "PAGO SERVICIOS";
  if (/TARJETA/.test(desc)) return "PAGO TARJETA";
  return "OPERACION VARIAS";
}

(function () {
  let n = 510;
  const estados = ["Aprobado", "Aprobado", "Aprobado", "Pendiente", "Rechazado"];
  [...cuentas, ...tarjetas].forEach((p) => {
    (p.movimientos || []).forEach((m, i) => {
      m.numero = String(n++);
      m.centro = ["0212", "0156", "0391"][i % 3];
      m.tipo = "AUTOMATICA";
      m.hora =
        String(9 + ((i * 2) % 12)).padStart(2, "0") +
        ":" + String((i * 23) % 60).padStart(2, "0") + ":00";
      m.fechaContable = m.fecha;
      const partes = m.fecha.split("/").map(Number);
      const fv = new Date(partes[2], partes[1] - 1, partes[0]);
      fv.setDate(fv.getDate() - (1 + (i % 3)));
      m.fechaValor =
        String(fv.getDate()).padStart(2, "0") + "/" +
        String(fv.getMonth() + 1).padStart(2, "0") + "/" +
        fv.getFullYear();
      m.operacion = operacionDe(m.descripcion);
      m.estado = m.monto >= 0 ? "Aprobado" : estados[i % estados.length];
    });
  });
})();

/* =====================================================
   Banco — reglas.js
   Módulo de Reglas del sistema para el Analista
   ===================================================== */

(function () {
  // ---------- Guard de sesión ----------
  if (typeof exigirAnalista === "function") exigirAnalista();

  const a = typeof analistaActual === "function" ? analistaActual() : null;
  if (!a) return;

  // Header: nombre del analista
  document.querySelector(".usuario__nombre").childNodes[0].nodeValue = a.nombre + " ";
  const elRol = document.getElementById("an-rol");
  if (elRol) elRol.textContent = "ANALISTA · " + a.codigo;

  // ---------- Salir ----------
  document.querySelectorAll(".util-link--salir").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("banco_sesion");
      window.location.href = "login.html";
    });
  });

  // ---------- Datos de reglas ----------
  const reglas = [
    {
      fecha: "20/09/2026",
      regla: "Destinatario recurrente",
      descripcion: "Valida si el destinatario ha recibido transferencias previas del mismo origen. Transacciones hacia contactos frecuentes reducen el riesgo de fraude.",
      importancia: "Crítica",
      porcentaje: 20
    },
    {
      fecha: "20/09/2026",
      regla: "País destinatario recurrente",
      descripcion: "Verifica si el país de destino coincide con operaciones anteriores del titular. Movimientos hacia ubicaciones habituales generan mayor confianza.",
      importancia: "Alta",
      porcentaje: 20
    },
    {
      fecha: "20/09/2026",
      regla: "Monto constante en origen",
      descripcion: "Compara el monto actual con transferencias previas del mismo cliente. Montos similares o idénticos a operaciones regulares indican comportamiento esperado.",
      importancia: "Alta",
      porcentaje: 20
    },
    {
      fecha: "20/09/2026",
      regla: "Hora recurrente",
      descripcion: "Analiza si la hora de la transacción coincide con el patrón horario habitual del titular. Operaciones dentro del horario normal reducen sospechas.",
      importancia: "Media",
      porcentaje: 20
    },
    {
      fecha: "20/09/2026",
      regla: "Tipo destinatario recurrente",
      descripcion: "Evalúa si el tipo de destinatario (persona, comercio, entidad financiera) corresponde con las categorías habituales del cliente.",
      importancia: "Media",
      porcentaje: 20
    }
  ];

  // ---------- Lógica de evaluación ----------
  function evaluarReglas(transaccion) {
    let cumple = 0;
    const resultado = reglas.map((r) => {
      // Simulación: en producción se validaría contra datos reales
      const cumpleRegla = Math.random() > 0.4;
      if (cumpleRegla) cumple++;
      return { ...r, cumple: cumpleRegla };
    });
    return { reglas: resultado, total: cumple * 20 };
  }

  // ---------- Render ----------
  function renderReglas() {
    const tbody = document.getElementById("reglas-tbody");
    if (!tbody) return;

    const colores = {
      "Crítica": "an-regla--critica",
      "Alta": "an-regla--alta",
      "Media": "an-regla--media",
      "Baja": "an-regla--baja"
    };

    tbody.innerHTML = reglas.map((r) => {
      const clase = colores[r.importancia] || "";
      return `
        <tr class="an-fila">
          <td class="an-fecha">${r.fecha}</td>
          <td class="an-porcentaje">${r.porcentaje}%</td>
          <td class="an-regla ${clase}">${r.regla}</td>
          <td class="an-desc">${r.descripcion}</td>
        </tr>
      `;
    }).join("");
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderReglas();
    if (typeof initPaneles === "function") initPaneles();
  });
})();

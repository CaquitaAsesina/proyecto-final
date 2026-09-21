/* =====================================================
   Banco — analista.js
   Módulo del ANALISTA: ve TODAS las transacciones de
   TODOS los clientes, con filtros, orden y detalle.
   Usa las listas completas de datos.js (sin filtro de
   sesión) más los productos creados en el módulo Crear.
   ===================================================== */

(function () {
  // ---------- Guard de sesión ----------
  if (typeof exigirAnalista === "function") exigirAnalista();

  const a = typeof analistaActual === "function" ? analistaActual() : null;
  if (!a) return; // exigirAnalista ya redirigió

  // Header: nombre y código del analista
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

  // ---------- Construcción del consolidado ----------
  // Propietario de un producto creado (clave = dni o correo)
  function nombreDePropietario(clave) {
    const u = todosLosUsuarios().find((x) => (x.dni || x.correo) === clave);
    return u ? u.nombre : "CLIENTE REGISTRADO";
  }

  // Completa la operativa demo de movimientos que no la tengan
  // (productos creados en el módulo Crear)
  function asegurarOperativa(mov, i) {
    if (mov.numero) return;
    mov.numero = "P" + String(900 + i);
    mov.centro = ["0212", "0156", "0391"][i % 3];
    mov.tipo = "AUTOMATICA";
    mov.hora =
      String(9 + ((i * 2) % 12)).padStart(2, "0") +
      ":" + String((i * 23) % 60).padStart(2, "0") + ":00";
    mov.fechaContable = mov.fecha;
    const p = mov.fecha.split("/").map(Number);
    const fv = new Date(p[2], p[1] - 1, p[0]);
    fv.setDate(fv.getDate() - (1 + (i % 3)));
    mov.fechaValor =
      String(fv.getDate()).padStart(2, "0") + "/" +
      String(fv.getMonth() + 1).padStart(2, "0") + "/" + fv.getFullYear();
    mov.operacion = operacionDe(mov.descripcion);
  }

  // Fecha dd/mm/yyyy -> timestamp (NaN si es inválida)
  function tsDe(fecha) {
    const p = String(fecha).split("/").map(Number);
    if (p.length !== 3 || !p[2]) return NaN;
    return new Date(p[2], p[1] - 1, p[0]).getTime();
  }

  // Extrae el destino de la descripción del movimiento
  function extraerDestino(descripcion) {
    const desc = normalizar(descripcion);
    if (/yape|plin/.test(desc)) {
      const partes = descripcion.split(/[- ]+/);
      const idx = partes.findIndex((p) => /yape|plin/i.test(p));
      return partes.slice(idx + 1, idx + 3).join(" ") || descripcion;
    }
    if (/abono nomina/.test(desc)) return descripcion.replace(/^abono nomina\s*/i, "");
    if (/compra\s+/.test(desc)) return descripcion.replace(/^compra\s*/i, "");
    if (/transferencia recibida/.test(desc)) return descripcion.replace(/^transferencia recibida\s*/i, "");
    if (/deposito/.test(desc)) return descripcion.replace(/^deposito\s*(efectivo\s*)?/i, "").trim() || "Banco";
    if (/retiro/.test(desc)) return descripcion.replace(/^retiro\s*/i, "");
    if (/pago tarjeta/.test(desc)) return descripcion.replace(/^pago tarjeta\s*/i, "");
    if (/interes/.test(desc)) return "Banco";
    if (/servicio/.test(desc)) return descripcion.replace(/^pago servicio\s*/i, "");
    if (/suscripcion/.test(desc)) return descripcion.replace(/^suscripcion\s*/i, "");
    return descripcion;
  }

  function construirTransacciones() {
    const lista = [];

    const agregar = (producto, tipo, cliente) => {
      (producto.movimientos || []).forEach((mov, i) => {
        asegurarOperativa(mov, i);
        const destino = extraerDestino(mov.descripcion);
        const estado = mov.estado || (mov.monto >= 0 ? "Aprobado" : "Aprobado");
        lista.push({
          cliente,
          tipo,
          producto,
          mov,
          destino,
          estado,
          monto: mov.monto,
          fechaTs: tsDe(mov.fecha),
        });
      });
    };

    // Clientes demo (datos.js tiene las listas completas)
    USUARIOS.forEach((u) => {
      cuentas.filter((c) => u.cuentas.includes(c.numero))
        .forEach((c) => agregar(c, "cuenta", u.nombre));
      tarjetas.filter((t) => u.tarjetas.includes(t.numero))
        .forEach((t) => agregar(t, "tarjeta", u.nombre));
    });

    // Usuarios registrados con productos creados (localStorage)
    const creados = leerProductosCreados();
    Object.keys(creados).forEach((clave) => {
      const nombre = nombreDePropietario(clave);
      (creados[clave].cuentas || []).forEach((c) => agregar(c, "cuenta", nombre));
      (creados[clave].tarjetas || []).forEach((t) => agregar(t, "tarjeta", nombre));
    });

    return lista;
  }

  const transacciones = construirTransacciones();

  // ---------- Referencias ----------
  const tbody = document.getElementById("an-tbody");
  const elN = document.getElementById("an-n");
  const elIngresos = document.getElementById("an-ingresos");
  const elSalidas = document.getElementById("an-salidas");
  const elNeto = document.getElementById("an-neto");
  const elOrden = document.getElementById("an-orden-indicador");
  const selCliente = document.getElementById("an-f-cliente");
  const inBuscar = document.getElementById("an-buscar");
  const selTipo = document.getElementById("an-f-tipo");
  const selEstado = document.getElementById("an-f-estado");
  const selPositivo = document.getElementById("an-f-positivo");
  const inDesde = document.getElementById("an-f-desde");
  const inHasta = document.getElementById("an-f-hasta");

  // ---------- Estado ----------
  let orden = { campo: "fecha", dir: "desc" };
  let filasActuales = []; // transacciones mostradas (para el detalle)

  function textoOrden() {
    if (orden.campo === "fecha")
      return orden.dir === "desc" ? "Fecha: más recientes" : "Fecha: más antiguas";
    return orden.dir === "desc" ? "Importe: mayor a menor" : "Importe: menor a mayor";
  }

  // Normaliza quitando acentos y en minúsculas (para buscar)
  function normalizar(s) {
    return String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // ---------- Poblar select de clientes ----------
  [...new Set(transacciones.map((t) => t.cliente))].sort().forEach((n) => {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n;
    selCliente.appendChild(opt);
  });

  // ---------- Filtrar y ordenar ----------
  function filtrar() {
    const cliente = selCliente.value;
    const texto = normalizar(inBuscar.value.trim());
    const tipo = selTipo.value;
    const estado = selEstado.value;
    const positivo = selPositivo.value;
    const desde = inDesde.value ? new Date(inDesde.value + "T00:00:00").getTime() : null;
    const hasta = inHasta.value ? new Date(inHasta.value + "T23:59:59").getTime() : null;

    return transacciones.filter((t) => {
      if (cliente && t.cliente !== cliente) return false;
      if (tipo && t.tipo !== tipo) return false;
      if (estado && t.estado !== estado) return false;
      if (positivo === "positivo" && t.monto <= 0) return false;
      if (positivo === "negativo" && t.monto >= 0) return false;
      if (desde !== null && (isNaN(t.fechaTs) || t.fechaTs < desde)) return false;
      if (hasta !== null && (isNaN(t.fechaTs) || t.fechaTs > hasta)) return false;
      if (texto) {
        const pila = normalizar(
          t.cliente + " " +
          t.destino + " " +
          t.producto.numero
        );
        if (!pila.includes(texto)) return false;
      }
      return true;
    });
  }

  function ordenar(lista) {
    const f = orden.campo === "fecha" ? (t) => t.fechaTs : (t) => Math.abs(t.monto);
    lista.sort((x, y) => {
      const nx = isNaN(f(x)) ? -Infinity : f(x);
      const ny = isNaN(f(y)) ? -Infinity : f(y);
      return orden.dir === "desc" ? ny - nx : nx - ny;
    });
    return lista;
  }

  // ---------- Render ----------
  function render() {
    const filas = ordenar(filtrar());
    filasActuales = filas;

    elOrden.textContent = textoOrden();

    let ingresos = 0, salidas = 0;
    filas.forEach((t) => {
      if (t.monto >= 0) ingresos += t.monto;
      else salidas += Math.abs(t.monto);
    });
    elN.textContent = filas.length;
    elIngresos.textContent = importesOcultos ? ocultarTextoImporte(dinero(ingresos)) : dinero(ingresos);
    elSalidas.textContent = importesOcultos ? ocultarTextoImporte(dinero(salidas)) : dinero(salidas);
    elNeto.textContent = importesOcultos ? ocultarTextoImporte(dinero(ingresos - salidas)) : dinero(ingresos - salidas);

    tbody.innerHTML = "";
    if (!filas.length) {
      const tr = document.createElement("tr");
      tr.className = "an-vacia";
      tr.innerHTML = '<td colspan="7">No hay transacciones con los filtros aplicados.</td>';
      tbody.appendChild(tr);
      return;
    }

    filas.forEach((t, i) => {
      const tr = document.createElement("tr");
      tr.className = "an-fila";
      tr.dataset.idx = i;

      let montoTxt = dinero(Math.abs(t.monto));
      if (importesOcultos) montoTxt = ocultarTextoImporte(montoTxt);

      tr.innerHTML =
        '<td class="an-fecha">' + esc(t.mov.fecha) + "</td>" +
        '<td class="an-cliente">' + esc(t.cliente) + "</td>" +
        '<td class="an-destino">' + esc(t.destino) + "</td>" +
        '<td class="an-tipo">' + (t.tipo === "cuenta" ? "Cuenta de Débito" : "Tarjeta de Crédito") + "</td>" +
        '<td class="an-estado an-estado--' + normalizar(t.estado) + '">' + esc(t.estado) + "</td>" +
        '<td class="an-col-importe"><span class="an-monto an-monto--' + t.tipo + '">' +
          dinero(Math.abs(t.monto)) + "</span></td>" +
        '<td class="an-col-ver"><button type="button" class="an-ver">Ver detalle</button></td>';

      tbody.appendChild(tr);
    });
  }

  // ---------- Detalle de transacción ----------
  function abrirDetalle(tr) {
    const existente = tbody.querySelector(".an-detalle-fila");

    // Mismo movimiento abierto: se cierra
    if (
      existente &&
      existente.previousElementSibling === tr &&
      tr.classList.contains("movs-fila--seleccionada")
    ) {
      existente.remove();
      tr.classList.remove("movs-fila--seleccionada");
      return;
    }

    if (existente) existente.remove();
    tbody.querySelectorAll(".movs-fila--seleccionada")
      .forEach((f) => f.classList.remove("movs-fila--seleccionada"));

    const t = filasActuales[parseInt(tr.dataset.idx, 10)];
    if (!t) return;

    tr.classList.add("movs-fila--seleccionada");

    let montoTxt = dinero(Math.abs(t.monto));
    if (importesOcultos) montoTxt = ocultarTextoImporte(montoTxt);

    const fila = document.createElement("tr");
    fila.className = "an-detalle-fila";
    fila.innerHTML =
      '<td colspan="7"><div class="movs-detalle">' +
        '<div class="movs-detalle__barra">' +
          '<span class="movs-icono movs-icono--pdf" title="Descargar PDF">PDF</span>' +
          '<span class="movs-icono movs-icono--imprimir" title="Imprimir">&#128424;</span>' +
          '<span class="movs-detalle__separador"></span>' +
          '<button class="movs-detalle__cerrar" type="button">cerrar <span class="movs-detalle__cerrar-x">✕</span></button>' +
        "</div>" +
        '<div class="movs-detalle__resumen">' +
          '<span class="movs-fecha">' + esc(t.mov.fecha) + "</span>" +
          '<span class="movs-desc movs-enlace">' + esc(t.mov.descripcion) + "</span>" +
          '<span class="movs-monto an-monto--' + t.tipo + '">' + dinero(Math.abs(t.monto)) + "</span>" +
        "</div>" +
        '<div class="movs-detalle__cuerpo">' +
          '<h4 class="movs-detalle__titulo">Información de transacción</h4>' +
          '<div class="movs-detalle__campos">' +
            '<div class="movs-campo"><dt>Cliente</dt><dd>' + esc(t.cliente) + "</dd></div>" +
            '<div class="movs-campo"><dt>Destino</dt><dd>' + esc(t.destino) + "</dd></div>" +
            '<div class="movs-campo"><dt>N° del movimiento</dt><dd>' + esc(t.mov.numero) + "</dd></div>" +
            '<div class="movs-campo"><dt>Estado</dt><dd>' + esc(t.estado || t.mov.estado || "Aprobado") + "</dd></div>" +
            '<div class="movs-campo"><dt>Centro</dt><dd>' + esc(t.mov.centro) + "</dd></div>" +
            '<div class="movs-campo"><dt>Tipo</dt><dd>' + esc(t.tipo === "cuenta" ? "Cuenta de Débito" : "Tarjeta de Crédito") + "</dd></div>" +
            '<div class="movs-campo"><dt>Fecha Operación</dt><dd>' + esc(t.mov.fecha) + "</dd></div>" +
            '<div class="movs-campo"><dt>Hora</dt><dd>' + esc(t.mov.hora) + "</dd></div>" +
            '<div class="movs-campo"><dt>País destino</dt><dd>Perú</dd></div>' +
            '<div class="movs-campo"><dt>N° de cuenta o tarjeta</dt><dd>' + esc(t.producto.numero) + "</dd></div>" +
          "</div>" +
        "</div>" +
      "</div></td>";

    tr.after(fila);

    fila.querySelector(".movs-detalle__cerrar").addEventListener("click", () => {
      fila.remove();
      tr.classList.remove("movs-fila--seleccionada");
    });
  }

  tbody.addEventListener("click", (e) => {
    const tr = e.target.closest(".an-fila");
    if (!tr || !tbody.contains(tr)) return;
    abrirDetalle(tr);
  });

  // ---------- Eventos de filtros y orden ----------
  [inBuscar, inDesde, inHasta].forEach((el) =>
    el.addEventListener("input", render)
  );
  [selCliente, selTipo, selEstado, selPositivo].forEach((el) =>
    el.addEventListener("change", render)
  );

  document.querySelectorAll(".an-th-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const campo = btn.dataset.orden;
      if (orden.campo === campo) {
        orden.dir = orden.dir === "desc" ? "asc" : "desc";
      } else {
        orden = { campo, dir: "desc" };
      }
      render();
    });
  });

  document.getElementById("an-limpiar").addEventListener("click", () => {
    inBuscar.value = "";
    selCliente.value = "";
    selTipo.value = "";
    selEstado.value = "";
    selPositivo.value = "";
    inDesde.value = "";
    inHasta.value = "";
    render();
  });

  // ---------- Ocultar importes (mismo switch que los otros módulos) ----------
  const sw = document.getElementById("switch-ocultar");
  if (sw) {
    const toggle = () => {
      importesOcultos = !importesOcultos;
      sw.setAttribute("aria-checked", importesOcultos ? "true" : "false");
      sw.classList.toggle("is-on", importesOcultos);
      render();
    };
    sw.addEventListener("click", toggle);
    sw.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

  // ---------- Init ----------
  // Paneles colapsables (Filtros / Consolidado) comparten utilidad de ui.js
  if (typeof initPaneles === "function") initPaneles();
  render();
})();

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

  function construirTransacciones() {
    const lista = [];

    const agregar = (producto, tipo, cliente) => {
      (producto.movimientos || []).forEach((mov, i) => {
        asegurarOperativa(mov, i);
        lista.push({
          cliente,
          tipo, // "cuenta" | "tarjeta"
          producto,
          mov,
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
  const selProducto = document.getElementById("an-f-producto");
  const selOperacion = document.getElementById("an-f-operacion");
  const selTipo = document.getElementById("an-f-tipo");
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
    const producto = selProducto.value;
    const operacion = selOperacion.value;
    const tipo = selTipo.value;
    const desde = inDesde.value ? new Date(inDesde.value + "T00:00:00").getTime() : null;
    const hasta = inHasta.value ? new Date(inHasta.value + "T23:59:59").getTime() : null;

    return transacciones.filter((t) => {
      if (cliente && t.cliente !== cliente) return false;
      if (producto && t.tipo !== producto) return false;
      if (operacion && t.mov.operacion !== operacion) return false;
      if (tipo === "positivo" && t.monto <= 0) return false;
      if (tipo === "negativo" && t.monto >= 0) return false;
      if (desde !== null && (isNaN(t.fechaTs) || t.fechaTs < desde)) return false;
      if (hasta !== null && (isNaN(t.fechaTs) || t.fechaTs > hasta)) return false;
      if (texto) {
        const pila = normalizar(
          t.cliente + " " +
          t.mov.descripcion + " " +
          t.producto.numero + " " +
          t.producto.nombre
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

      const signo = t.monto < 0 ? "- " : "";
      let montoTxt = signo + dinero(Math.abs(t.monto));
      if (importesOcultos) montoTxt = ocultarTextoImporte(montoTxt);

      tr.innerHTML =
        '<td class="an-fecha">' + esc(t.mov.fecha) + "</td>" +
        '<td class="an-cliente">' + esc(t.cliente) + "</td>" +
        '<td class="an-producto"><span class="an-badge an-badge--' + t.tipo + '">' +
          (t.tipo === "cuenta" ? "Cuenta" : "Tarjeta") + "</span> " +
          esc(t.producto.numero) + "</td>" +
        '<td class="an-oper">' + esc(t.mov.operacion || "OPERACION VARIAS") + "</td>" +
        '<td class="an-desc">' + esc(t.mov.descripcion) + "</td>" +
        '<td class="an-col-importe"><span class="an-monto ' +
          (t.monto < 0 ? "an-monto--neg" : "an-monto--pos") + '">' + montoTxt + "</span></td>" +
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

    const signo = t.monto < 0 ? "- " : "";
    let montoTxt = signo + dinero(Math.abs(t.monto));
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
          '<span class="movs-monto">' + montoTxt + "</span>" +
        "</div>" +
        '<div class="movs-detalle__cuerpo">' +
          '<h4 class="movs-detalle__titulo">Información de transacción</h4>' +
          '<div class="movs-detalle__campos">' +
            '<div class="movs-campo"><dt>Cliente</dt><dd>' + esc(t.cliente) + "</dd></div>" +
            '<div class="movs-campo"><dt>Producto</dt><dd>' + esc(t.producto.numero) + " — " + esc(t.producto.nombre) + "</dd></div>" +
            '<div class="movs-campo"><dt>N° del movimiento</dt><dd>' + esc(t.mov.numero) + "</dd></div>" +
            '<div class="movs-campo"><dt>Operación</dt><dd>' + esc(t.mov.operacion) + "</dd></div>" +
            '<div class="movs-campo"><dt>Centro</dt><dd>' + esc(t.mov.centro) + "</dd></div>" +
            '<div class="movs-campo"><dt>Tipo</dt><dd>' + esc(t.mov.tipo) + "</dd></div>" +
            '<div class="movs-campo"><dt>Fecha Operación</dt><dd>' + esc(t.mov.fecha) + "</dd></div>" +
            '<div class="movs-campo"><dt>Hora</dt><dd>' + esc(t.mov.hora) + "</dd></div>" +
            '<div class="movs-campo"><dt>Fecha Valor</dt><dd>' + esc(t.mov.fechaValor) + "</dd></div>" +
            '<div class="movs-campo"><dt>Fecha Contable</dt><dd>' + esc(t.mov.fechaContable) + "</dd></div>" +
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
  [selCliente, selProducto, selOperacion, selTipo].forEach((el) =>
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
    selProducto.value = "";
    selOperacion.value = "";
    selTipo.value = "";
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

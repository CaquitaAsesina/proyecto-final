/* =====================================================
   Banco — usuarios.js
   Usuarios de prueba para simular el login.
   Cada usuario ve SOLO los productos que tiene asignados.
   Requiere datos.js (cuentas, tarjetas).
   ===================================================== */

const USUARIOS = [
  {
    nombre: "DIEGO FLORES CASTRO",
    dni: "70123456",
    clave: "diego789",
    cuentas: ["0011-0123-4567890123", "0011-0987-6543210987"],
    tarjetas: ["5312-8765-4321-0987"],
  },
  {
    nombre: "VALERIA SOTO RIOS",
    dni: "79876543",
    clave: "vale2026",
    cuentas: ["0011-0555-1111222233"],
    tarjetas: ["4539-2211-3344-5566", "4550-9988-7766-5544"],
  },
  {
    nombre: "MARTIN ESPINOZA CRUZ",
    dni: "74445556",
    clave: "martin456",
    cuentas: ["0011-0777-3333444455"],
    tarjetas: [],
  },
];

// ---------- Analistas (rol interno) ----------
// El analista NO puede registrarse: solo ingresa con DNI + contraseña.
// Ve TODAS las transacciones de TODOS los clientes en analista.html.
const ANALISTAS = [
  {
    nombre: "SOFIA RAMIREZ VEGA",
    dni: "10101010",
    clave: "analista2026",
    codigo: "AN-001",
  },
  {
    nombre: "JORGE CASTAÑEDA LEON",
    dni: "22223333",
    clave: "jorge789",
    codigo: "AN-002",
  },
];

// Devuelve el analista con sesión activa o null
function analistaActual() {
  const ses = sessionStorage.getItem("banco_sesion");
  if (!ses || !ses.startsWith("analista:")) return null;
  const dni = ses.split(":")[1];
  return ANALISTAS.find((a) => a.dni === dni) || null;
}

// ---------- Usuarios registrados desde registro.html ----------
// Se guardan en localStorage y se fusionan con USUARIOS al cargar.
const CLAVE_REGISTRADOS = "banco_usuarios_registrados";

function leerRegistrados() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_REGISTRADOS)) || [];
  } catch (e) {
    return [];
  }
}

function guardarRegistrado(u) {
  const lista = leerRegistrados();
  lista.push(u);
  localStorage.setItem(CLAVE_REGISTRADOS, JSON.stringify(lista));
}

// Lista combinada: demo + registrados (para login y sesión)
function todosLosUsuarios() {
  return USUARIOS.concat(leerRegistrados());
}

// Guards de sesión por rol. Un analista nunca debe ver la banca del
// cliente y un cliente (o un visitante sin sesión) nunca el módulo analista.
function exigirCliente() {
  if (analistaActual()) {
    // El analista logueado va a su propio módulo, no a la banca del cliente
    window.location.href = "analista.html";
  } else if (!usuarioActual()) {
    window.location.href = "login.html";
  }
}

function exigirAnalista() {
  if (!analistaActual()) {
    window.location.href = "login.html";
  }
}

// Devuelve el usuario con sesión activa o null.
// La sesión se guarda como "dni:valor" o "correo:valor".
function usuarioActual() {
  const ses = sessionStorage.getItem("banco_sesion");
  if (!ses) return null;
  const [tipo, valor] = ses.split(":");
  return (
    todosLosUsuarios().find(
      (u) => (tipo === "dni" ? u.dni === valor : u.correo === valor)
    ) || null
  );
}

// ---------- Productos creados por el usuario (módulo Crear) ----------
// Se guardan en localStorage por usuario (dni o correo) y se inyectan
// en las listas globales al cargar cada módulo.
const CLAVE_PRODUCTOS = "banco_productos_creados";

function claveUsuarioActual() {
  const ses = sessionStorage.getItem("banco_sesion");
  return ses ? ses.split(":")[1] : null;
}

function leerProductosCreados() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || {};
  } catch (e) {
    return {};
  }
}

function productosDe(claveUsuario) {
  const todos = leerProductosCreados();
  return todos[claveUsuario] || { cuentas: [], tarjetas: [] };
}

function guardarProductoCreado(producto) {
  const clave = claveUsuarioActual();
  if (!clave) return;
  const todos = leerProductosCreados();
  const mios = todos[clave] || { cuentas: [], tarjetas: [] };
  mios[producto.tipo].push(producto.data);
  todos[clave] = mios;
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(todos));
}

// Filtra las listas globales por los productos del usuario en sesión
// y agrega los que haya creado en el módulo Crear.
// Muta los arreglos en lugar de reasignarlos (son const en datos.js)
function cargarProductosUsuario() {
  const u = usuarioActual();
  if (!u || typeof cuentas === "undefined") return;

  const cs = cuentas.filter((c) => u.cuentas.includes(c.numero));
  const extrasC = productosDe(u.dni || u.correo).cuentas || [];
  cuentas.splice(0, cuentas.length, ...cs, ...extrasC);

  const ts = tarjetas.filter((t) => u.tarjetas.includes(t.numero));
  const extrasT = productosDe(u.dni || u.correo).tarjetas || [];
  tarjetas.splice(0, tarjetas.length, ...ts, ...extrasT);
}

// Nombre del cliente en el header + enlace "Salir" funcional
function initSesionHeader() {
  const u = usuarioActual();
  if (u) {
    document.querySelectorAll(".usuario__nombre").forEach((el) => {
      el.childNodes[0].nodeValue = u.nombre + " ";
    });
  } else if (analistaActual()) {
    // El analista logueado no entra a la banca del cliente
    window.location.href = "analista.html";
  } else {
    window.location.href = "login.html";
  }

  document.querySelectorAll(".util-link--salir").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("banco_sesion");
      window.location.href = "login.html";
    });
  });
}

// ---------- Registro ----------
function initRegistro() {
  const form = document.getElementById("registro-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombres = document.getElementById("reg-nombres").value.trim();
    const pais = document.getElementById("reg-pais").value;
    const telefono = document.getElementById("reg-telefono").value.trim();
    const correo = document.getElementById("reg-correo").value.trim().toLowerCase();
    const clave = document.getElementById("reg-clave").value;
    const clave2 = document.getElementById("reg-clave2").value;

    const err = document.getElementById("registro-error");
    const fallo = (msg) => {
      err.textContent = msg;
      err.hidden = false;
    };

    if (!nombres) return fallo("Ingresa tus nombres completos.");
    if (!pais) return fallo("Selecciona tu país.");
    if (!/^[0-9+ ()-]{6,15}$/.test(telefono))
      return fallo("Ingresa un teléfono válido (6-15 dígitos).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      return fallo("Ingresa un correo electrónico válido.");
    if (todosLosUsuarios().some((u) => u.correo === correo))
      return fallo("Ya existe una cuenta con ese correo. Inicia sesión.");
    if (clave.length < 6) return fallo("La contraseña debe tener al menos 6 caracteres.");
    if (clave !== clave2) return fallo("Las contraseñas no coinciden.");

    // Nuevo usuario: sin cuentas ni tarjetas
    guardarRegistrado({
      nombre: nombres.toUpperCase(),
      correo,
      telefono,
      pais,
      clave,
      cuentas: [],
      tarjetas: [],
    });

    sessionStorage.setItem("banco_sesion", "correo:" + correo);
    window.location.href = "inicio.html";
  });
}

// Inicializa el registro si la página lo tiene
if (document.getElementById("registro-form")) {
  document.addEventListener("DOMContentLoaded", initRegistro);
}

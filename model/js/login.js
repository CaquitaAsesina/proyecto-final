/* =====================================================
   Banco — login.js
   Acceso a la Banca por Internet (demo).
   Ingreso con DNI + contraseña (nombre opcional).
   ===================================================== */

// ---------- Mostrar / ocultar contraseña ----------
function initToggleClave() {
  const btn = document.getElementById("toggle-clave");
  const clave = document.getElementById("clave");
  if (!btn || !clave) return;

  btn.addEventListener("click", () => {
    const visible = clave.type === "text";
    clave.type = visible ? "password" : "text";
    btn.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
    btn.style.opacity = visible ? "1" : "0.55";
  });
}

// ---------- Mostrar error ----------
function mostrarError(mensaje) {
  const err = document.getElementById("login-error");
  if (!err) return;
  err.textContent = mensaje;
  err.hidden = false;
}

// ---------- Validación y envío ----------
function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("num-doc").value.trim();
    const nombre = document.getElementById("usuario").value.trim(); // opcional
    const clave = document.getElementById("clave").value;
    const recordar = document.getElementById("recordar").checked;

    const esCorreo = id.includes("@");

    if (!id) {
      mostrarError(esCorreo ? "Ingresa tu correo." : "Ingresa tu DNI.");
      return;
    }
    if (esCorreo) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
        mostrarError("Ingresa un correo electrónico válido.");
        return;
      }
    } else if (!/^\d{8}$/.test(id)) {
      mostrarError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }
    if (!clave) {
      mostrarError("Ingresa tu contraseña de Banca por Internet.");
      return;
    }
    if (clave.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // El analista NO puede entrar por correo: su acceso es solo con DNI
    if (esCorreo && ANALISTAS.length) {
      mostrarError("Ingresa tu DNI para acceder.");
      return;
    }

    // 1) ¿Es un analista? (solo por DNI)
    const analista = esCorreo ? null : ANALISTAS.find((a) => a.dni === id);
    if (analista) {
      if (analista.clave !== clave) {
        mostrarError("Contraseña incorrecta.");
        return;
      }
      sessionStorage.setItem("banco_sesion", "analista:" + analista.dni);
      window.location.href = "analista.html";
      return;
    }

    // 2) Cliente: demo + registrados (por DNI o correo)
    const user = todosLosUsuarios().find((u) =>
      esCorreo
        ? (u.correo || "").toLowerCase() === id.toLowerCase()
        : u.dni === id
    );
    if (!user) {
      mostrarError(
        esCorreo
          ? "Correo no registrado. Regístrate o prueba con: 70123456, 79876543 o 74445556."
          : "DNI no registrado. Prueba con: 70123456, 79876543 o 74445556."
      );
      return;
    }
    if (user.clave !== clave) {
      mostrarError("Contraseña incorrecta.");
      return;
    }

    // Recordar documento
    if (recordar) {
      localStorage.setItem(
        "banco_doc_frecuente",
        JSON.stringify({ id, esCorreo })
      );
    } else {
      localStorage.removeItem("banco_doc_frecuente");
    }

    // Nombre opcional: si se escribe y no coincide, solo se avisa (no bloquea)
    if (nombre && nombre.toUpperCase() !== user.nombre) {
      console.info(
        "Nombre ingresado no coincide con el registrado (" + user.nombre + "), se continúa con el DNI."
      );
    }

    // Sesión: por DNI o correo, y redirección
    sessionStorage.setItem("banco_sesion", (esCorreo ? "correo:" : "dni:") + (esCorreo ? id.toLowerCase() : id));
    window.location.href = "inicio.html";
  });
}

// ---------- Prefill con documento guardado ----------
function prefillDocumento() {
  const guardado = localStorage.getItem("banco_doc_frecuente");
  if (!guardado) return;

  try {
    const data = JSON.parse(guardado);
    const campo = document.getElementById("num-doc");
    if (campo && data.id) campo.value = data.id;
  } catch (e) {
    // Compatibilidad con formato antiguo (solo DNI)
    const campo = document.getElementById("num-doc");
    if (campo && /^[0-9]+$/.test(guardado)) campo.value = guardado;
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  prefillDocumento();
  initToggleClave();
  initLogin();
});

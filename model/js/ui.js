/* =====================================================
   Banco — ui.js
   Utilidades de UI compartidas entre módulos:
   pestañas, switch "Ocultar importes", paneles
   colapsables y dropdown "Quiero".
   ===================================================== */

// ---------- Estado global del toggle de importes ----------
let importesOcultos = false;

// ---------- Ocultar importes ----------
function ocultarTextoImporte(texto) {
  // Reemplaza dígitos, puntos y comas por asteriscos; conserva "S/ " y espacios
  return texto.replace(/[\d.,]/g, "*");
}

function aplicarOcultarImportes() {
  document
    .querySelectorAll(".saldo, .saldo-importe, .credito-valor, .total-row__value")
    .forEach((el) => {
      if (importesOcultos) {
        if (!("textoOriginal" in el.dataset)) {
          el.dataset.textoOriginal = el.textContent;
        }
        el.textContent = ocultarTextoImporte(el.dataset.textoOriginal);
      } else if ("textoOriginal" in el.dataset) {
        el.textContent = el.dataset.textoOriginal;
      }
    });
}

function initSwitch() {
  const sw = document.getElementById("switch-ocultar");
  if (!sw) return;

  const toggle = () => {
    importesOcultos = !importesOcultos;
    sw.setAttribute("aria-checked", importesOcultos ? "true" : "false");
    sw.classList.toggle("is-on", importesOcultos);
    aplicarOcultarImportes();
  };

  sw.addEventListener("click", toggle);
  sw.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
}

// ---------- Pestañas ----------
function initTabs() {
  const tabs = document.querySelectorAll(".tabs__tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
      document.getElementById("tab-" + tab.dataset.tab).classList.add("is-active");
    });
  });
}

// ---------- Dropdown "Quiero" ----------
function initQuieroMenus() {
  document.querySelectorAll(".btn-quiero").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      document.querySelectorAll(".quiero-menu.is-open").forEach((m) => {
        if (m !== menu) m.classList.remove("is-open");
      });
      menu.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".quiero-menu.is-open").forEach((m) =>
      m.classList.remove("is-open")
    );
  });
}

// ---------- Paneles colapsables ----------
function initPaneles() {
  document.querySelectorAll("[data-toggle]").forEach((header) => {
    header.addEventListener("click", () => {
      const panel = document.getElementById(header.dataset.toggle);
      panel.classList.toggle("panel--collapsed");
      header.setAttribute(
        "aria-expanded",
        panel.classList.contains("panel--collapsed") ? "false" : "true"
      );
    });
  });
}

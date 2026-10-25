// Efecto slot: divide el texto de cada enlace .roll en letras
document.querySelectorAll(".roll").forEach((link) => {
  const text = link.textContent.trim();
  link.setAttribute("aria-label", text);
  link.textContent = "";

  [...text].forEach((char, i) => {
    const visible = char === " " ? " " : char;

    const charBox = document.createElement("span");
    charBox.className = "slot-char";
    charBox.setAttribute("aria-hidden", "true");

    const strip = document.createElement("span");
    strip.className = "slot-strip";
    strip.style.setProperty("--i", i);

    // dos copias: la blanca (normal) y la verde (hover)
    strip.innerHTML = `<span>${visible}</span><span>${visible}</span>`;

    charBox.appendChild(strip);
    link.appendChild(charBox);
  });
});

// Menú móvil
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.setAttribute("aria-expanded", "false");
menuBtn.setAttribute("aria-controls", "nav");

const header = document.querySelector(".header");
let menuTimer;

function setMenu(open) {
  // Mientras el menú móvil está abierto (y mientras se cierra) no se aplica el modo de fusión
  clearTimeout(menuTimer);
  if (open) header.classList.add("menu-on");
  else menuTimer = setTimeout(() => header.classList.remove("menu-on"), 520);

  nav.classList.toggle("open", open);
  document.body.classList.toggle("no-scroll", open);   // bloquea el scroll de fondo
  menuBtn.textContent = open ? "Close" : "Menu";
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

// Al pulsar una categoría: se pone verde y, un instante después, se cierra el menú
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!nav.classList.contains("open")) return;   // en escritorio no hace falta

    link.classList.add("is-selected");
    document.body.classList.remove("no-scroll");   // permite que la página se desplace a la sección

    setTimeout(() => {
      setMenu(false);
      link.classList.remove("is-selected");
    }, 450);
  });
});

// Cierra con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// Si se pasa a escritorio (girar el móvil, ampliar la ventana), cierra el menú
window.matchMedia("(min-width: 801px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

// Aparición suave al hacer scroll
const items = document.querySelectorAll(".service, .cap__intro");
items.forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity .8s ease, transform .8s ease";
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

items.forEach((el) => observer.observe(el));

// Efecto cortina: guarda la altura de cada sección en --h (el CSS la usa para el sticky)
document.querySelectorAll(".hero").forEach((el) => {
  const setH = () => el.style.setProperty("--h", el.offsetHeight + "px");
  setH();
  new ResizeObserver(setH).observe(el);
});

// Enlaces internos: como las secciones son "sticky", el navegador no sabe a dónde ir.
// Medimos su posición natural y hacemos el scroll nosotros.
function naturalTop(el) {
  const pos = el.style.position, top = el.style.top;
  el.style.position = "relative";
  el.style.top = "auto";
  const y = el.getBoundingClientRect().top + window.scrollY;
  el.style.position = pos;
  el.style.top = top;
  return y;
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    if (!id) return;                       // enlaces "#" vacíos (proyectos de prueba)
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const y = id === "top" ? 0 : naturalTop(target);
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// About: el texto va apareciendo palabra a palabra al hacer scroll
(() => {
  const box = document.querySelector(".about__text");
  if (!box) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;   // sin animación: todo visible

  // Divide cada párrafo en palabras (mantiene los espacios y la sangría)
  const words = [];
  box.querySelectorAll("p").forEach((p) => {
    const parts = p.textContent.trim().split(/\s+/);
    p.textContent = "";
    parts.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      p.appendChild(span);
      words.push(span);
      if (i < parts.length - 1) p.appendChild(document.createTextNode(" "));
    });
  });

  const MIN = 0.12;    // opacidad de las palabras que aún no han aparecido
  const SOFT = 8;      // cuántas palabras se están "encendiendo" a la vez (más = más suave)
  const clamp = (v) => Math.min(1, Math.max(0, v));

  function update() {
    const vh = window.innerHeight;
    const top = box.getBoundingClientRect().top;
    // 0 cuando el texto entra por abajo · 1 cuando ya ha subido hasta ~1/3 de la pantalla
    const t = clamp((vh * 0.9 - top) / (vh * 0.55));
    const n = words.length;
    words.forEach((w, i) => {
      w.style.opacity = MIN + (1 - MIN) * clamp((t * (n + SOFT) - i) / SOFT);
    });
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
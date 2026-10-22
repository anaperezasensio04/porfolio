// Efecto slot: divide el texto de cada enlace .roll en letras
document.querySelectorAll(".roll").forEach((link) => {
  const text = link.textContent.trim();
  link.setAttribute("aria-label", text);
  link.textContent = "";

  [...text].forEach((char, i) => {
    const visible = char === " " ? " " : char;

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

function setMenu(open) {
  nav.classList.toggle("open", open);
  document.body.classList.toggle("no-scroll", open);   // bloquea el scroll de fondo
  menuBtn.textContent = open ? "Close" : "Menu";
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

// Cierra el menú al pulsar un enlace
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
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
const items = document.querySelectorAll(".project, .card, .about__text p");
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

// Estrella: se desplaza e inclina con el ratón (efecto de profundidad)
const hero = document.querySelector(".hero");
const star = document.querySelector(".hero__star");
const mouseOk = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");

if (hero && star && mouseOk.matches) {
  const move = (x, y, r) => {
    star.style.setProperty("--mx", `${x}px`);
    star.style.setProperty("--my", `${y}px`);
    star.style.setProperty("--mr", `${r}deg`);
  };

  hero.addEventListener("mousemove", (e) => {
    const box = hero.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;    // de -0.5 a 0.5
    const y = (e.clientY - box.top) / box.height - 0.5;
    move(-x * 40, -y * 40, x * 24);   // se aleja del cursor y se inclina
  });

  hero.addEventListener("mouseleave", () => move(0, 0, 0));
}
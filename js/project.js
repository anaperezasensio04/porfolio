// Subpáginas de proyecto: el texto de Info va apareciendo palabra a palabra al hacer scroll
(() => {
  const box = document.querySelector(".pj-info__text");
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

  const meta = document.querySelector(".pj-meta");   // Year / Project name / Services
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
    if (meta) meta.style.opacity = clamp((t - 0.7) / 0.3);
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
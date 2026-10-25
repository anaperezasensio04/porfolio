// Transición entre páginas (se carga en el <head> para que el panel esté listo antes de pintar)
(function () {
  var root = document.documentElement;
  var DURATION = 600;   // ms: debe coincidir con la animación pt-cover de transition.css
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ¿Venimos de otra página del sitio? Entonces la página empieza tapada y se revela
  var entering = false;
  try {
    entering = sessionStorage.getItem("pt") === "1";
    sessionStorage.removeItem("pt");
  } catch (e) {}
  if (entering && !reduce) root.classList.add("pt-enter");

  // Al volver con el botón "atrás" desde la caché, quita el panel que se quedó puesto
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) root.classList.remove("pt-leave", "pt-enter");
  });

  if (reduce) return;

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.protocol !== location.protocol || url.host !== location.host) return;   // externos, mailto...
    if (url.pathname === location.pathname && url.search === location.search) return; // enlaces a la misma página (#ancla)

    e.preventDefault();
    try { sessionStorage.setItem("pt", "1"); } catch (err) {}
    root.classList.add("pt-leave");
    setTimeout(function () { location.href = url.href; }, DURATION);
  });
})();
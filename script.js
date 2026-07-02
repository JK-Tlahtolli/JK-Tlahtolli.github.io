/* =============================================
   MIS HISTORIAS — JavaScript
   ============================================= */

/* ---- MODO CLARO / OSCURO ---- */
const toggle = document.getElementById('toggle');
const body = document.body;

const modoGuardado = localStorage.getItem('modo');
if (modoGuardado === 'oscuro') body.classList.add('oscuro');

toggle.addEventListener('click', () => {
  body.classList.toggle('oscuro');
  localStorage.setItem('modo', body.classList.contains('oscuro') ? 'oscuro' : 'claro');
});

/* ---- CARRUSEL ---- */
const pista = document.getElementById('pista');
const dotsWrap = document.getElementById('dots');

if (pista && dotsWrap) {
  const slides = pista.querySelectorAll('.slide');
  const visible = Math.floor(pista.parentElement.offsetWidth / 164) || 3;
  const total = slides.length;
  let idx = 0;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' activo' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }

  function goTo(n) {
    idx = Math.max(0, Math.min(n, total - visible));
    const ancho = slides[0].offsetWidth + 14;
    pista.style.transform = 'translateX(-' + (idx * ancho) + 'px)';
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('activo', i === idx));
  }

  document.getElementById('prev').addEventListener('click', () => goTo(idx - 1));
  document.getElementById('next').addEventListener('click', () => goTo(idx + 1));
}

/* ---- BUSCADOR ---- */
const busqueda = document.getElementById('busqueda');

if (busqueda) {
  busqueda.addEventListener('input', () => {
    const texto = busqueda.value.toLowerCase().trim();
    document.querySelectorAll('.tarjeta:not(.vacia)').forEach(tarjeta => {
      const titulo = tarjeta.querySelector('.tarjeta-titulo')?.textContent.toLowerCase() || '';
      const tag = tarjeta.querySelector('.tag')?.textContent.toLowerCase() || '';
      tarjeta.classList.toggle('oculta', texto !== '' && !titulo.includes(texto) && !tag.includes(texto));
    });
  });
}

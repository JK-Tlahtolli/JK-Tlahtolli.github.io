/* =============================================
   SAGAS — Sistema de sagas vinculadas
   
   Para agregar o editar sagas, modifica el
   array `sagas` de abajo. Cada saga tiene:
   
   nombre:    texto de respaldo si no hay imagen
   tabImg:    imagen del tab en la barra superior
              → 'imagenes/saga-xxx-logo.png'
              → null para usar el nombre en texto
   bgImg:     imagen de fondo de la portada
              → 'imagenes/saga-xxx-bg.jpg'
              → null o emoji para placeholder
   nombreImg: imagen del título sobre la portada
              → 'imagenes/saga-xxx-titulo.png'
              → null para mostrar placeholder
   historias: array de historias de la saga
              cada una con:
              - href: ruta a la página de la historia
              - portadaImg: imagen o emoji
   ============================================= */

const sagas = [
  {
    nombre: 'El Ciclo del Vacío',
    tabImg: 'imagenes/sagas/LogoSagaALTER_Blanco.png',
    bgImg: 'imagenes/sagas/PortadaSaga_ALTER.png',
    nombreImg: 'imagenes/sagas/TituloSaga_ALTER_Negro.png','
    historias: [
      { href: 'historias/voces/index.html',   portadaImg: 'historias/voces/imagenes/VocesPH.png' },
      // Agrega más historias aquí:
      // { href: 'historias/xxx/index.html', portadaImg: 'historias/xxx/imagenes/portada.jpg' },
    ]
  },
  {
    nombre: 'Crónicas de Yarbatashy',
    tabImg: null,
    bgImg: null,
    nombreImg: null,
    historias: [
      { href: 'historias/cenizas/index.html', portadaImg: '⚔' },
    ]
  },
  /* PLANTILLA SAGA — descomenta y edita:
  {
    nombre: 'Nombre de la Saga',
    tabImg: null,
    bgImg: null,
    nombreImg: null,
    historias: [
      { href: 'historias/xxx/index.html', portadaImg: 'historias/xxx/imagenes/portada.jpg' },
    ]
  },
  */
];

/* =============================================
   NO ES NECESARIO EDITAR DEBAJO DE ESTA LÍNEA
   ============================================= */

let sagaActiva = 0;
let hIdx = 0;

function esEmoji(s) {
  return s && !s.includes('/') && !s.startsWith('http');
}

function renderSagas() {
  const saga = sagas[sagaActiva];
  hIdx = 0;

  // TABS
  document.getElementById('saga-tabs').innerHTML = sagas.map((s, i) => {
    let contenido = '';
    if (s.tabImg && !esEmoji(s.tabImg)) {
      contenido = `<img src="${s.tabImg}" alt="${s.nombre}">`;
    } else {
      contenido = `<span class="saga-tab-texto">${s.nombre}</span>`;
    }
    return `<div class="saga-tab ${i === sagaActiva ? 'activo' : ''}" onclick="selSaga(${i})">${contenido}</div>`;
  }).join('');

  // FONDO
  const bg = document.getElementById('saga-bg');
  if (!saga.bgImg || esEmoji(saga.bgImg)) {
    bg.innerHTML = saga.bgImg || '📖';
    bg.style.fontSize = '6rem';
  } else {
    bg.innerHTML = `<img src="${saga.bgImg}" alt="${saga.nombre}">`;
  }

  // NOMBRE
  const nombreEl = document.getElementById('saga-nombre');
  if (saga.nombreImg && !esEmoji(saga.nombreImg)) {
    nombreEl.innerHTML = `<div class="saga-nombre-img"><img src="${saga.nombreImg}" alt="${saga.nombre}"></div>`;
  } else {
    nombreEl.innerHTML = `
      <span class="saga-nombre-placeholder">🖼 Imagen del título</span>
      <span class="saga-nombre-fallback">${saga.nombre}</span>`;
  }

  // HISTORIAS
  document.getElementById('saga-historias').innerHTML = saga.historias.map(h => `
    <div class="saga-historia-slide" onclick="location.href='${h.href}'">
      <div class="saga-historia-portada">
        ${esEmoji(h.portadaImg)
          ? h.portadaImg
          : `<img src="${h.portadaImg}" alt="">`}
      </div>
    </div>`).join('');

  moverHistorias();
}

function moverHistorias() {
  const pista = document.getElementById('saga-historias');
  const saga = sagas[sagaActiva];
  const visible = Math.floor(
    (document.querySelector('.saga-historias-pista-wrap')?.offsetWidth || 400) / 130
  );
  const max = Math.max(0, saga.historias.length - visible);
  hIdx = Math.max(0, Math.min(hIdx, max));
  pista.style.transform = `translateX(-${hIdx * 130}px)`;
  document.getElementById('saga-prev').disabled = hIdx === 0;
  document.getElementById('saga-next').disabled = hIdx >= max;
}

function selSaga(i) {
  sagaActiva = i;
  renderSagas();
}

// Flechas
document.getElementById('saga-prev').addEventListener('click', () => { hIdx--; moverHistorias(); });
document.getElementById('saga-next').addEventListener('click', () => { hIdx++; moverHistorias(); });

// Arrastre con mouse
const pistaSagas = document.getElementById('saga-historias');
let drag = false, startX = 0, scrollStart = 0;

pistaSagas.addEventListener('mousedown', e => {
  drag = true;
  startX = e.pageX;
  scrollStart = hIdx * 130;
});
pistaSagas.addEventListener('mousemove', e => {
  if (!drag) return;
  const diff = startX - e.pageX;
  pistaSagas.style.transform = `translateX(-${Math.max(0, scrollStart + diff)}px)`;
});
pistaSagas.addEventListener('mouseup', e => {
  if (!drag) return;
  drag = false;
  hIdx = Math.round((scrollStart + (startX - e.pageX)) / 130);
  moverHistorias();
});
pistaSagas.addEventListener('mouseleave', () => {
  if (drag) { drag = false; moverHistorias(); }
});

renderSagas();

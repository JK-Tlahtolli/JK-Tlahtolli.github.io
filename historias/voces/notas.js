/* =============================================
   VOCES — Sistema de notas con imágenes
   ============================================= */

let notaActivaId = null;
let lbImagenes = [];
let lbIdx = 0;

const lista = document.getElementById('lista-notas');
const fileInput = document.getElementById('file-input');
const lightbox = document.getElementById('lightbox');

// Notas guardadas en localStorage para que persistan entre visitas
let notas = JSON.parse(localStorage.getItem('voces-notas') || '[]');
let nextId = JSON.parse(localStorage.getItem('voces-nextid') || '1');

function guardar() {
  localStorage.setItem('voces-notas', JSON.stringify(notas));
  localStorage.setItem('voces-nextid', JSON.stringify(nextId));
}

function fechaHoy() {
  return new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderNotas() {
  lista.innerHTML = '';
  if (notas.length === 0) {
    lista.innerHTML = '<p class="vacio-texto">Aún no hay notas. ¡Agrega la primera!</p>';
    return;
  }
  notas.forEach(n => {
    const div = document.createElement('div');
    div.className = 'nota';
    const imgsHtml = n.imagenes.map((img, i) => `
      <div class="nota-img-wrap" onclick="abrirLb(${n.id}, ${i})">
        <img src="${img}" alt="imagen ${i + 1}">
        <button class="nota-img-quitar" onclick="event.stopPropagation(); quitarImg(${n.id}, ${i})">✕</button>
      </div>`).join('');

    div.innerHTML = `
      <div class="nota-header">
        <div class="nota-meta">
          <input class="nota-titulo-input" value="${n.titulo}" placeholder="Título de la nota"
            onchange="upNota(${n.id}, 'titulo', this.value)">
          <span class="nota-fecha">${n.fecha}</span>
        </div>
        <button class="nota-borrar" onclick="borrarNota(${n.id})">🗑</button>
      </div>
      <textarea class="nota-texto" rows="3" placeholder="Escribe tus ideas, preguntas o descripciones de escena..."
        onchange="upNota(${n.id}, 'texto', this.value)">${n.texto}</textarea>
      <div class="nota-imagenes">
        ${imgsHtml}
        <div class="nota-img-placeholder" onclick="selImg(${n.id})">
          <span class="ph-icono">🖼</span>
          <span class="ph-texto">Agregar</span>
        </div>
      </div>`;
    lista.appendChild(div);
  });
}

function upNota(id, campo, valor) {
  const n = notas.find(n => n.id === id);
  if (n) { n[campo] = valor; guardar(); }
}

function borrarNota(id) {
  if (!confirm('¿Eliminar esta nota?')) return;
  notas = notas.filter(n => n.id !== id);
  guardar();
  renderNotas();
}

function quitarImg(id, i) {
  const n = notas.find(n => n.id === id);
  if (n) { n.imagenes.splice(i, 1); guardar(); renderNotas(); }
}

function selImg(id) {
  notaActivaId = id;
  fileInput.click();
}

fileInput.addEventListener('change', () => {
  const n = notas.find(n => n.id === notaActivaId);
  if (!n) return;
  const archivos = Array.from(fileInput.files);
  let cargados = 0;
  archivos.forEach(file => {
    const r = new FileReader();
    r.onload = e => {
      n.imagenes.push(e.target.result);
      cargados++;
      if (cargados === archivos.length) { guardar(); renderNotas(); }
    };
    r.readAsDataURL(file);
  });
  fileInput.value = '';
});

document.getElementById('btn-nueva').addEventListener('click', () => {
  notas.push({ id: nextId++, titulo: '', fecha: fechaHoy(), texto: '', imagenes: [] });
  guardar();
  renderNotas();
  lista.querySelectorAll('.nota-titulo-input')[notas.length - 1]?.focus();
});

/* ---- LIGHTBOX ---- */
function abrirLb(notaId, idx) {
  const n = notas.find(n => n.id === notaId);
  if (!n || !n.imagenes.length) return;
  lbImagenes = n.imagenes;
  lbIdx = idx;
  lightbox.classList.add('abierto');
  renderLb();
}

function renderLb() {
  const img = lbImagenes[lbIdx];
  const wrap = document.getElementById('lb-img-wrap');
  const minis = document.getElementById('lb-miniaturas');
  document.getElementById('lb-contador').textContent =
    lbImagenes.length > 1 ? `${lbIdx + 1} / ${lbImagenes.length}` : '';
  document.getElementById('lb-prev').disabled = lbIdx === 0;
  document.getElementById('lb-next').disabled = lbIdx === lbImagenes.length - 1;
  wrap.innerHTML = `<img src="${img}" alt="imagen ${lbIdx + 1}">`;
  minis.style.display = lbImagenes.length > 1 ? 'flex' : 'none';
  minis.innerHTML = lbImagenes.map((im, i) =>
    `<img class="lb-mini ${i === lbIdx ? 'activo' : ''}" src="${im}" onclick="irLb(${i})">`
  ).join('');
}

function irLb(n) { lbIdx = n; renderLb(); }

document.getElementById('lb-prev').onclick = () => { if (lbIdx > 0) { lbIdx--; renderLb(); } };
document.getElementById('lb-next').onclick = () => { if (lbIdx < lbImagenes.length - 1) { lbIdx++; renderLb(); } };
document.getElementById('lb-cerrar').onclick = () => lightbox.classList.remove('abierto');
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('abierto'); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('abierto')) return;
  if (e.key === 'ArrowLeft' && lbIdx > 0) { lbIdx--; renderLb(); }
  if (e.key === 'ArrowRight' && lbIdx < lbImagenes.length - 1) { lbIdx++; renderLb(); }
  if (e.key === 'Escape') lightbox.classList.remove('abierto');
});

/* ---- TABS ---- */
function cambiarTab(n) {
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('activo', i === n));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('activo', i === n));
}

renderNotas();

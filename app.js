/* =============================================
   MUNDIAL MASSIMO — Lógica del formulario
   Conectado a Google Sheets vía Apps Script
   ============================================= */

// ── CAMBIA ESTA URL POR LA DE TU SCRIPT ──────
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwv8BGvJeDyl0WMHSWIH7f_sapqDmfAKVSPnGlVZKMCSi5DmNQ8q0yR01vJNyoMqhex/exec';
// ─────────────────────────────────────────────

var form          = document.getElementById('regForm');
var successScreen = document.getElementById('successScreen');


/* ── Generador de código de participación único ──
   Formato: MM-XXXXXX-YY  (hexadecimal) */
function generarCodigo() {
  var hex = function() { return Math.floor(Math.random() * 16).toString(16).toUpperCase(); };
  var seg1 = Array.from({ length: 6 }, hex).join('');
  var seg2 = Array.from({ length: 2 }, hex).join('');
  return 'MM-' + seg1 + '-' + seg2;
}


/* ── Muestra u oculta el error inline de un campo ── */
function showError(fieldId, errId, show) {
  var field = document.getElementById(fieldId);
  var err   = document.getElementById(errId);
  if (show) {
    field.classList.add('error');
    err.style.display = 'block';
  } else {
    field.classList.remove('error');
    err.style.display = 'none';
  }
}


/* ── Alerta de folio duplicado (banner superior) ── */
function mostrarAlertaFolio(visible) {
  var alerta = document.getElementById('folioAlert');
  if (visible) {
    alerta.classList.add('visible');
    document.getElementById('folio').classList.add('error');
    alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    alerta.classList.remove('visible');
    document.getElementById('folio').classList.remove('error');
  }
}


/* ── Validación de todos los campos ── */
function validate() {
  var valid = true;

  var nombre = document.getElementById('nombre').value.trim();
  if (nombre.length < 3 || !/\s/.test(nombre)) {
    showError('nombre', 'err-nombre', true); valid = false;
  } else {
    showError('nombre', 'err-nombre', false);
  }

  var tel = document.getElementById('telefono').value.replace(/\D/g, '');
  if (tel.length < 10) {
    showError('telefono', 'err-telefono', true); valid = false;
  } else {
    showError('telefono', 'err-telefono', false);
  }

  var correo = document.getElementById('correo').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    showError('correo', 'err-correo', true); valid = false;
  } else {
    showError('correo', 'err-correo', false);
  }

  var equipo = document.getElementById('equipo').value;
  if (!equipo) {
    showError('equipo', 'err-equipo', true); valid = false;
  } else {
    showError('equipo', 'err-equipo', false);
  }

  var folio = document.getElementById('folio').value.trim();
  if (folio.length < 3) {
    showError('folio', 'err-folio', true); valid = false;
  } else {
    showError('folio', 'err-folio', false);
  }

  return valid;
}


/* ── Limpia errores al escribir ── */
['nombre', 'telefono', 'correo', 'equipo', 'folio'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', function() {
    document.getElementById(id).classList.remove('error');
    var errEl = document.getElementById('err-' + id);
    if (errEl) errEl.style.display = 'none';
    if (id === 'folio') mostrarAlertaFolio(false);
  });
});

/* Cerrar alerta manualmente */
document.getElementById('folioAlertClose').addEventListener('click', function() {
  mostrarAlertaFolio(false);
});

/* Teléfono: solo números y caracteres válidos */
document.getElementById('telefono').addEventListener('input', function() {
  this.value = this.value.replace(/[^\d\s\-\+\(\)]/g, '');
});

/* Folio: mayúsculas automáticas */
document.getElementById('folio').addEventListener('input', function() {
  var pos = this.selectionStart;
  this.value = this.value.toUpperCase();
  this.setSelectionRange(pos, pos);
});


/* ── Genera la tarjeta en canvas y la muestra como <img> ── */
function generarTarjeta(codigo, folio, equipo) {
  var canvas = document.getElementById('downloadCanvas');
  var ctx    = canvas.getContext('2d');
  var W = 600, H = 980;
  canvas.width  = W;
  canvas.height = H;

  // Fondo sólido vino oscuro
  ctx.fillStyle = '#5a0c26';
  ctx.fillRect(0, 0, W, H);

  // Patrón de puntos decorativos (sutil)
  ctx.fillStyle = 'rgba(232,175,0,0.04)';
  for (var px = 0; px < W; px += 28) {
    for (var py = 0; py < H; py += 28) {
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Franja dorada superior
  ctx.fillStyle = '#e8af00';
  ctx.fillRect(0, 0, W, 6);

  // Franja dorada inferior
  ctx.fillStyle = '#e8af00';
  ctx.fillRect(0, H - 6, W, 6);

  // Líneas laterales doradas delgadas
  ctx.fillStyle = 'rgba(232,175,0,0.25)';
  ctx.fillRect(0, 6, 2, H - 12);
  ctx.fillRect(W - 2, 6, 2, H - 12);

  // ── ZONA SUPERIOR: restaurante y concurso ──
  ctx.textAlign = 'center';

  // Título restaurante
  ctx.fillStyle = '#e8af00';
  ctx.font      = 'bold 18px Arial, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('RISTORANTE DA MASSIMO', W / 2, 60);

  // Separador fino
  ctx.strokeStyle = 'rgba(232,175,0,0.3)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(60, 74); ctx.lineTo(W - 60, 74);
  ctx.stroke();

  // Título principal del concurso
  ctx.fillStyle = '#ffffff';
  ctx.font      = 'bold 44px Georgia, serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Mundial', W / 2, 122);
  ctx.fillStyle = '#e8af00';
  ctx.font      = 'bold italic 44px Georgia, serif';
  ctx.fillText('Massimo 2026', W / 2, 170);

  // ── ZONA MEDIA: bloque de código de participación ──

  // Rectángulo de fondo del código
  var bx = 40, by = 194, bw = W - 80, bh = 180;
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(232,175,0,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 14);
  ctx.stroke();

  // Etiqueta código
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font      = '17px Arial, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('NÚMERO DE PARTICIPACIÓN', W / 2, 228);

  // Código grande
  ctx.fillStyle = '#e8af00';
  ctx.font      = 'bold 38px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(codigo, W / 2, 290);

  // Nota bajo el código
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font      = '17px Arial, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('Guarda esta imagen como comprobante', W / 2, 348);

  // Separador central
  ctx.strokeStyle = 'rgba(232,175,0,0.2)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(60, 400); ctx.lineTo(W - 60, 400);
  ctx.stroke();

  // ── ZONA INFERIOR: folio y equipo en columnas ──

  // Columna izquierda: FOLIO
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font      = '16px Arial, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('FOLIO DE TICKET', 60, 440);
  ctx.fillStyle = '#ffffff';
  ctx.font      = 'bold 26px Arial, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(folio, 60, 476);

  // Separador vertical entre columnas
  ctx.strokeStyle = 'rgba(232,175,0,0.2)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2, 418); ctx.lineTo(W / 2, 494);
  ctx.stroke();

  // Columna derecha: SELECCIÓN
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font      = '16px Arial, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('SELECCIÓN', W - 60, 440);
  ctx.fillStyle = '#ffffff';
  ctx.font      = 'bold 26px Arial, sans-serif';
  ctx.letterSpacing = '0.5px';

  // Recortar texto del equipo si es muy largo
  var equipoText = equipo.length > 14 ? equipo.substring(0, 13) + '…' : equipo;
  ctx.fillText(equipoText, W - 60, 476);

  // ── ZONA PIE ──
  ctx.strokeStyle = 'rgba(232,175,0,0.2)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(60, 514); ctx.lineTo(W - 60, 514);
  ctx.stroke();

  // Sorteo y dirección
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font      = '18px Arial, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('El sorteo se realizará al cierre del torneo', W / 2, 552);
  ctx.font      = '16px Arial, sans-serif';
  ctx.fillText('Av. de las Américas 1213, Altamira, Zapopan, Jal.', W / 2, 578);

  // Separador antes del aviso
  ctx.strokeStyle = 'rgba(232,175,0,0.3)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(60, 604); ctx.lineTo(W - 60, 604);
  ctx.stroke();

  // ── AVISO CONSERVAR TICKET (prominente) ──
  // Rectángulo de fondo del aviso
  ctx.fillStyle = 'rgba(232,175,0,0.12)';
  ctx.beginPath();
  ctx.roundRect(40, 616, W - 80, 168, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(232,175,0,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(40, 616, W - 80, 168, 12);
  ctx.stroke();

  ctx.fillStyle = '#e8af00';
  ctx.font      = 'bold 22px Arial, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('⚠ Conserva tu ticket de consumo', W / 2, 652);
  ctx.fillText('o una foto del mismo.', W / 2, 682);

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font      = '18px Arial, sans-serif';
  ctx.fillText('Lo necesitarás para reclamar', W / 2, 718);
  ctx.fillText('el premio en caso de ganar.', W / 2, 746);

  // Premio destacado
  ctx.strokeStyle = 'rgba(232,175,0,0.2)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(60, 810); ctx.lineTo(W - 60, 810);
  ctx.stroke();

  ctx.fillStyle = '#e8af00';
  ctx.font      = 'bold italic 24px Georgia, serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('Premio: $10,000 en consumo', W / 2, 850);

  // Balones decorativos
  var balonesY = 900;
  var balonesX = [W/2 - 56, W/2 - 28, W/2, W/2 + 28, W/2 + 56];
  balonesX.forEach(function(bx, i) {
    ctx.beginPath();
    ctx.arc(bx, balonesY, i === 2 ? 9 : 6, 0, Math.PI * 2);
    ctx.fillStyle = i === 2 ? '#e8af00' : 'rgba(232,175,0,0.3)';
    ctx.fill();
  });

  // Convertir canvas a imagen y mostrarla en pantalla
  var dataUrl = canvas.toDataURL('image/png');
  var img = document.getElementById('tarjetaImagen');
  img.src = dataUrl;
}


/* ── Envío del formulario ── */
form.addEventListener('submit', function(e) {
  e.preventDefault();
  mostrarAlertaFolio(false);

  if (!validate()) return;

  var btn = document.getElementById('submitBtn');
  btn.disabled    = true;
  btn.textContent = 'Registrando...';

  var folio   = document.getElementById('folio').value.trim().toUpperCase();
  var nombre  = document.getElementById('nombre').value.trim();
  var tel     = document.getElementById('telefono').value.trim();
  var correo  = document.getElementById('correo').value.trim();
  var equipo  = document.getElementById('equipo').value;
  var codigo  = generarCodigo();

  var payload = JSON.stringify({
    folio:    folio,
    nombre:   nombre,
    telefono: tel,
    correo:   correo,
    equipo:   equipo,
    codigo:   codigo
  });

  fetch(SCRIPT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    payload
  })
  .then(function(res) {
    return res.text().then(function(text) {
      try { return JSON.parse(text); }
      catch(e) { return { ok: true }; }
    });
  })
  .then(function(data) {

    if (data.ok) {
      // Generar y mostrar la tarjeta como imagen
      generarTarjeta(codigo, folio, equipo);

      // Actualizar textos de la pantalla de éxito
      document.getElementById('successTeamInline').textContent = equipo;

      form.style.display          = 'none';
      successScreen.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } else if (data.error === 'FOLIO_DUPLICADO') {
      mostrarAlertaFolio(true);
      btn.disabled    = false;
      btn.textContent = 'Registrarme al concurso';

    } else {
      alert('Ocurrió un problema al procesar tu registro. Por favor inténtalo de nuevo en unos momentos.');
      btn.disabled    = false;
      btn.textContent = 'Registrarme al concurso';
    }

  })
  .catch(function(err) {
    alert('No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.');
    btn.disabled    = false;
    btn.textContent = 'Registrarme al concurso';
  });

}); // cierre del form.addEventListener


/* ── Botón "Volver al inicio" ── */
document.getElementById('btnVolver').addEventListener('click', function() {
  successScreen.style.display = 'none';
  form.style.display          = 'block';
  form.reset();

  // Resetear el botón de submit
  var btn = document.getElementById('submitBtn');
  btn.disabled    = false;
  btn.textContent = 'Registrarme al concurso';

  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── Modal de Términos y Condiciones ── */
var modalTerms    = document.getElementById('modalTerms');
var openTerms     = document.getElementById('openTerms');
var closeTerms    = document.getElementById('closeTerms');
var closeTermsBtn = document.getElementById('closeTermsBtn');

openTerms.addEventListener('click', function(e) {
  e.preventDefault();
  modalTerms.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function cerrarModal() {
  modalTerms.classList.remove('open');
  document.body.style.overflow = '';
}

closeTerms.addEventListener('click', cerrarModal);
closeTermsBtn.addEventListener('click', cerrarModal);

modalTerms.addEventListener('click', function(e) {
  if (e.target === modalTerms) cerrarModal();
});

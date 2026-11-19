// Andesita (demo) — interacción del sitio (sin dependencias)
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // ---------- Menú lateral ----------
  const menu = $('[data-show="menuAbierto"]');
  const openBtn = $('[data-menu-open]');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { const c = $('[aria-label="Cerrar menú"]', menu); if (c) c.focus(); }
    else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', () => setMenu(true));
  $$('[data-menu-close]').forEach(b => b.addEventListener('click', () => setMenu(false)));
  if (menu) {
    // clic en el fondo oscuro cierra el menú
    const overlay = menu.firstElementChild;
    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  }

  // ---------- Formularios (Contacto y Cotización) ----------
  // En la maqueta solo muestran el mensaje de confirmación.
  // Para enviar de verdad, conectar con Web3Forms, Formspree o Power Automate.
  const form = $('[data-show="verForm"]');
  const ok = $('[data-show="enviado"]');
  $$('[data-form-send]').forEach(b => b.addEventListener('click', () => {
    if (form) form.hidden = true;
    if (ok) { ok.hidden = false; ok.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }));
  $$('[data-form-reset]').forEach(b => b.addEventListener('click', () => {
    if (ok) ok.hidden = true;
    if (form) form.hidden = false;
  }));

  // ---------- Repuestos: combo de selección múltiple ----------
  const combo = $('.combo');
  if (combo) {
    const boton = $('.combo-boton', combo);
    const lista = $('.combo-lista', combo);
    const resumen = $('.combo-resumen', combo);
    const checks = $$('input[type="checkbox"]', lista);
    const chips = $('.combo-chips');
    const conteo = $('.combo-conteo');
    const cats = $$('.categoria');
    const nombre = cb => cb.closest('label').querySelector('span').textContent;

    const abrir = v => { lista.hidden = !v; boton.setAttribute('aria-expanded', String(v)); };
    boton.addEventListener('click', () => abrir(lista.hidden));
    $('.combo-listo', lista).addEventListener('click', () => abrir(false));
    $('.combo-limpiar', lista).addEventListener('click', () => { checks.forEach(c => (c.checked = false)); render(); });
    document.addEventListener('click', e => { if (!combo.contains(e.target)) abrir(false); });

    function render() {
      const sel = checks.filter(c => c.checked);
      checks.forEach(c => c.closest('label').classList.toggle('sel', c.checked));
      resumen.textContent = sel.length === 0 ? 'Todas las categorías'
        : sel.length === 1 ? nombre(sel[0]) : sel.length + ' categorías seleccionadas';
      const ids = sel.map(c => c.value);
      cats.forEach(a => (a.hidden = ids.length > 0 && !ids.includes(a.dataset.cat)));
      $$('.chip', chips).forEach(c => c.remove());
      sel.forEach(c => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'chip';
        b.setAttribute('aria-label', 'Quitar filtro ' + nombre(c));
        b.innerHTML = '<span></span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
        b.firstChild.textContent = nombre(c);
        b.addEventListener('click', () => { c.checked = false; render(); });
        chips.insertBefore(b, conteo);
      });
      conteo.textContent = ids.length === 0 ? 'Mostrando las ' + cats.length + ' categorías'
        : 'Mostrando ' + ids.length + ' de ' + cats.length + ' categorías';
    }
    checks.forEach(c => c.addEventListener('change', render));
  }

  // ---------- Maquinaria: galería ----------
  const actual = $('.foto-actual');
  $$('.foto-mini').forEach(b => b.addEventListener('click', () => {
    $$('.foto-mini').forEach(x => { x.setAttribute('aria-pressed', 'false'); x.style.borderColor = 'transparent'; });
    b.setAttribute('aria-pressed', 'true'); b.style.borderColor = '#3FBFA3';
    if (actual) actual.textContent = b.dataset.foto;
  }));

  // ---------- Clientes: antes / después ----------
  $$('.caso').forEach(caso => {
    const foto = $('.caso-foto', caso);
    const badge = $('.caso-badge', caso);
    $$('.caso-btn', caso).forEach(btn => btn.addEventListener('click', () => {
      const antes = btn.dataset.vista === 'antes';
      $$('.caso-btn', caso).forEach(x => { const on = x === btn; x.classList.toggle('activo', on); x.setAttribute('aria-pressed', String(on)); });
      foto.textContent = antes ? caso.dataset.antes : caso.dataset.despues;
      badge.textContent = antes ? 'Antes' : 'Después';
      badge.style.background = antes ? '#EEF2F2' : '#3FBFA3';
    }));
  });
})();

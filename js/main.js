/* =========================================================
   RevelArte — Interacciones
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const desktop = matchMedia('(min-width: 901px)');

  /* ---------- Productos destacados (edita aquí tu contenido) ---------- */
  // type: digital | impresion | personalizados   ·   service: nombre del servicio para "Cotizar"
  const PRODUCTS = [
    { name: 'Camisetas personalizadas', type: 'personalizados', tag: 'Prendas', service: 'Personalización de Prendas',
      features: ['Serigrafía', 'DTF', 'Sublimación'], img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=75' },
    { name: 'Logos e identidad visual', type: 'digital', tag: 'Diseño', service: 'Diseño Gráfico Integral',
      features: ['Logos', 'Flyers', 'Manual de marca'], img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=75' },
    { name: 'Pocillos y souvenirs', type: 'personalizados', tag: 'Souvenirs', service: 'Insumos y Souvenirs Corporativos Personalizados',
      features: ['Pocillos', 'Llaveros', 'Tulas'], img: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=900&q=75' },
    { name: 'Impresión en todo formato', type: 'impresion', tag: 'Impresión', service: 'Impresión en Diversos Formatos',
      features: ['Banner', 'Tarjetas', 'Carnets'], img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=75' },
    { name: 'Contenido para redes', type: 'digital', tag: 'Redes', service: 'Creación y Edición de Contenido para Redes',
      features: ['Creación', 'Edición', 'Redes sociales'], img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=75' },
    { name: 'Buzos y hoodies', type: 'personalizados', tag: 'Prendas', service: 'Personalización de Prendas',
      features: ['Bordado', 'Vinilo', 'DTF'], img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=75' },
    { name: 'Cuadernos y libretas', type: 'impresion', tag: 'Papelería', service: 'Artículos de Papelería Comercial',
      features: ['Cuadernos', 'Recetarios', 'Calendarios'], img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=75' },
    { name: 'Fotografía de matrimonios', type: 'digital', tag: 'Fotografía', service: 'Fotografía Profesional',
      features: ['Matrimonios', 'Eventos', 'Books'], img: 'assets/portafolio/boda-09.jpg' }
  ];

  /* ---------- Utilidades ---------- */
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Si una imagen falla, queda el degradado de fondo
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') e.target.classList.add('is-broken');
  }, true);

  // Toast
  const toastEl = $('.toast');
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2800);
  };
  $$('[data-toast]').forEach((b) => b.addEventListener('click', () => toast(b.dataset.toast)));

  /* ---------- Tema claro / oscuro ---------- */
  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('ra-theme', t); } catch (e) { /* sin almacenamiento */ }
    $$('[data-theme-set]').forEach((b) => b.classList.toggle('is-active', b.dataset.themeSet === t));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = t === 'dark' ? '#0a0a0a' : '#e9e9ea';
  };
  setTheme(root.getAttribute('data-theme') || 'light');
  $$('[data-theme-set]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () =>
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')));

  /* ---------- Menú móvil ---------- */
  const navToggle = $('.nav-toggle');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  navToggle?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('.main-nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  /* ---------- Render de productos ---------- */
  const propTrack = $('#prop-track');
  if (propTrack) {
    propTrack.innerHTML = PRODUCTS.map((p) => `
      <article class="prop-card" data-type="${p.type}">
        <div class="prop-card__media">
          <img src="${p.img}" alt="${p.name}" loading="lazy" draggable="false">
          <span class="prop-card__tag">${p.tag}</span>
          <button type="button" class="prop-card__like" aria-pressed="false" aria-label="Guardar ${p.name} en favoritos">
            <svg class="ico"><use href="#i-heart"/></svg>
          </button>
        </div>
        <div class="prop-card__body">
          <div class="prop-card__row"><h3>${p.name}</h3></div>
          <p class="prop-card__loc"><svg class="ico ico--xs"><use href="#i-sparkle"/></svg>${p.service}</p>
          <div class="prop-card__foot">
            <ul class="svc-tags">${p.features.map((f) => `<li>${f}</li>`).join('')}</ul>
            <a href="#contacto" class="round-btn" data-service="${p.service}" aria-label="Cotizar ${p.name}"><svg class="ico"><use href="#i-arrow-ur"/></svg></a>
          </div>
        </div>
      </article>`).join('');
  }

  /* ---------- Carrusel (scroll-snap + arrastre + autoplay) ---------- */
  const initCarousel = (el) => {
    const track = $('.carousel__track', el);
    const dotsWrap = $('.carousel__dots', el);
    const prev = $('[data-prev]', el);
    const next = $('[data-next]', el);
    const delay = +el.dataset.autoplay || 0;
    let hovering = false, inView = false, lastInteract = 0;

    const visible = () => [...track.children].filter((c) => !c.hidden);
    const step = () => {
      const first = visible()[0];
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const pages = () => Math.max(1, Math.round(maxScroll() / step()) + 1);
    const current = () => clamp(Math.round(track.scrollLeft / step()), 0, pages() - 1);
    const goTo = (i) => track.scrollTo({ left: clamp(i, 0, pages() - 1) * step(), behavior: 'smooth' });

    const buildDots = () => {
      if (!dotsWrap) return;
      const n = pages();
      dotsWrap.innerHTML = Array.from({ length: n }, (_, i) =>
        `<button type="button" aria-label="Ir a ${i + 1} de ${n}"></button>`).join('');
      $$('button', dotsWrap).forEach((b, i) => b.addEventListener('click', () => { lastInteract = Date.now(); goTo(i); }));
      syncDots();
    };
    const syncDots = () => {
      const i = current();
      dotsWrap && $$('button', dotsWrap).forEach((b, j) => b.classList.toggle('is-active', i === j));
      if (prev) prev.disabled = false;
    };

    const advance = () => {
      if (track.scrollLeft >= maxScroll() - 4) track.scrollTo({ left: 0, behavior: 'smooth' });
      else goTo(current() + 1);
    };
    prev?.addEventListener('click', () => {
      lastInteract = Date.now();
      if (track.scrollLeft <= 4) track.scrollTo({ left: maxScroll(), behavior: 'smooth' });
      else goTo(current() - 1);
    });
    next?.addEventListener('click', () => { lastInteract = Date.now(); advance(); });

    let raf;
    track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(syncDots); }, { passive: true });

    // Arrastre con mouse (en táctil el scroll nativo ya funciona)
    let down = false, startX = 0, startLeft = 0, moved = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) {
        track.classList.add('is-dragging');
        track.scrollLeft = startLeft - dx;
      }
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (track.classList.contains('is-dragging')) {
        const target = track.scrollLeft;
        track.classList.remove('is-dragging');
        track.scrollLeft = target;
        goTo(Math.round(target / step()));
        lastInteract = Date.now();
      }
    });
    track.addEventListener('click', (e) => { if (moved > 4) { e.preventDefault(); e.stopPropagation(); } }, true);

    // Teclado
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); advance(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current() - 1); }
    });

    // Autoplay
    el.addEventListener('pointerenter', () => { hovering = true; });
    el.addEventListener('pointerleave', () => { hovering = false; });
    el.addEventListener('focusin', () => { hovering = true; });
    el.addEventListener('focusout', () => { hovering = false; });
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: .4 }).observe(el);
    if (delay && !reduceMotion) {
      setInterval(() => {
        if (hovering || !inView || document.hidden || down || Date.now() - lastInteract < delay) return;
        advance();
      }, delay);
    }

    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildDots, 150); });
    buildDots();
    return { refresh: () => { track.scrollTo({ left: 0 }); buildDots(); } };
  };

  const carousels = new Map();
  $$('[data-carousel]').forEach((el) => carousels.set(el, initCarousel(el)));

  /* ---------- Filtro por tipo (chips) ---------- */
  const chips = $$('.chip[data-type]');
  const filterProps = (type) => {
    chips.forEach((c) => {
      const on = c.dataset.type === type;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });
    let i = 0;
    $$('.prop-card', propTrack).forEach((card) => {
      const show = type === 'all' || card.dataset.type === type;
      card.hidden = !show;
      card.classList.remove('is-entering');
      if (show) {
        card.style.setProperty('--i', i++);
        void card.offsetWidth; // reinicia la animación
        card.classList.add('is-entering');
      }
    });
    const c = propTrack && carousels.get(propTrack.closest('[data-carousel]'));
    c && c.refresh();
  };
  chips.forEach((c) => c.addEventListener('click', () => filterProps(c.dataset.type)));

  /* ---------- Likes / guardar / compartir ---------- */
  const pop = (el) => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };
  document.addEventListener('click', (e) => {
    const like = e.target.closest('.prop-card__like');
    if (like) {
      const on = like.getAttribute('aria-pressed') !== 'true';
      like.setAttribute('aria-pressed', String(on));
      pop(like);
      toast(on ? 'Añadida a favoritos ♥' : 'Eliminada de favoritos');
    }
  });

  $$('[data-like], [data-save]').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    pop(b);
    if (b.hasAttribute('data-save')) toast(on ? 'Guardado en tu lista' : 'Quitado de tu lista');
  }));
  $$('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    pop(b);
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url);
      toast('Enlace copiado al portapapeles');
    } catch (err) { /* compartir cancelado */ }
  }));

  /* ---------- Filtros desplegables del hero ---------- */
  const filters = $$('.filter');
  const closeFilters = (except) => filters.forEach((f) => {
    if (f === except) return;
    f.classList.remove('is-open');
    $('.filter__btn', f).setAttribute('aria-expanded', 'false');
  });
  filters.forEach((f) => {
    const btn = $('.filter__btn', f);
    const value = $('.filter__value', f);
    const opts = $$('[role="option"]', f);
    opts.forEach((o) => o.setAttribute('tabindex', '-1'));

    const open = () => {
      closeFilters(f);
      f.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      (opts.find((o) => o.getAttribute('aria-selected') === 'true') || opts[0]).focus({ preventScroll: true });
    };
    const close = () => { f.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    const choose = (o) => {
      opts.forEach((x) => x.setAttribute('aria-selected', String(x === o)));
      value.textContent = o.textContent;
      close();
      btn.focus({ preventScroll: true });
    };

    btn.addEventListener('click', () => (f.classList.contains('is-open') ? close() : open()));
    opts.forEach((o, i) => {
      o.addEventListener('click', () => choose(o));
      o.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(o); }
        if (e.key === 'Escape') { close(); btn.focus(); }
      });
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.filter')) closeFilters(); });

  const filterBar = $('.filter-bar');
  filterBar?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (k) => $(`[data-filter="${k}"] .filter__value`).textContent.trim();
    const msg = $('#f-msg');
    if (msg) msg.value = `Hola, me interesa cotizar: ${val('service')} (formato ${val('type').toLowerCase()}) para ${val('for').toLowerCase()}.`;
    const seg = { Digital: 'digital', Impreso: 'impresion', Personalizado: 'personalizado' }[val('type')];
    const radio = seg && $(`.seg input[value="${seg}"]`);
    if (radio) radio.checked = true;
    $('#contacto').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    toast(`Cotización de ${val('service').toLowerCase()} lista para enviar ✦`);
  });

  // Pills "Digital" / "Física": llevan a servicios con el filtro aplicado
  $$('[data-svc-go]').forEach((a) => a.addEventListener('click', () => {
    $(`.chip[data-svc="${a.dataset.svcGo}"]`)?.click();
  }));

  /* ---------- Reveal al hacer scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach((el) => revealIO.observe(el));

  /* ---------- Contadores animados ---------- */
  const fmtNum = new Intl.NumberFormat('es-MX');
  const runCount = (el) => {
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = fmtNum.format(target); return; }
    const dur = 1800, t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmtNum.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        // pequeño retraso para el hero mientras entra la animación
        setTimeout(() => runCount(en.target), en.target.closest('.hero') ? 900 : 0);
        countIO.unobserve(en.target);
      }
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- Sección activa en la navegación ---------- */
  const navLinks = $$('.main-nav a, .rail-btn[href]');
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = '#' + en.target.id;
      navLinks.forEach((a) => {
        const on = a.getAttribute('href') === id;
        a.classList.toggle(a.classList.contains('rail-btn') ? 'is-active' : 'is-current', on);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionIO.observe(s));

  /* ---------- Galería horizontal fijada ---------- */
  const hs = $('.hscroll');
  const hsTrack = hs && $('.hscroll__track', hs);
  const hsView = hs && $('.hscroll__viewport', hs);
  const hsBar = hs && $('.hscroll__progress span', hs);
  let hsDist = 0;
  if (hs && reduceMotion) hs.classList.add('hscroll--native');
  const measureHs = () => {
    if (!hs || reduceMotion) return;
    hsDist = Math.max(0, hsTrack.scrollWidth - hsView.clientWidth);
    hs.style.height = (innerHeight + hsDist) + 'px';
  };
  const updateHs = () => {
    if (!hs || reduceMotion) return;
    const r = hs.getBoundingClientRect();
    const total = hs.offsetHeight - innerHeight;
    const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    hsTrack.style.transform = `translate3d(${-p * hsDist}px,0,0)`;
    hsBar.style.transform = `scaleX(${p})`;
  };
  measureHs();

  /* ---------- Header, progreso y parallax (un solo bucle rAF) ---------- */
  const header = $('.site-header');
  const progress = $('.scroll-progress span');
  const hero = $('.hero');
  const heroImg = $('.hero-media img');
  const depthEls = $$('[data-depth]');
  const parallaxEls = $$('[data-parallax]');
  let lastY = scrollY;
  let mx = 0, my = 0, tx = 0, ty = 0;
  let ticking = false;

  const frame = () => {
    ticking = false;
    const y = scrollY;
    const vh = innerHeight;

    // Header
    header.classList.toggle('is-scrolled', y > 20);
    const hide = y > lastY && y > 500 && !document.body.classList.contains('nav-open');
    header.classList.toggle('is-hidden', hide);
    lastY = y;

    // Barra de progreso
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    updateHs();
    if (reduceMotion) return;

    // Mouse suavizado
    mx += (tx - mx) * .08;
    my += (ty - my) * .08;
    const settling = Math.abs(tx - mx) > .001 || Math.abs(ty - my) > .001;

    // Parallax del hero
    if (y < vh * 1.6) {
      if (heroImg) heroImg.style.transform = `translate3d(${-mx * 14}px, ${y * .22 - my * 10}px, 0) scale(1.12)`;
      const isDesk = desktop.matches;
      depthEls.forEach((el) => {
        if (!isDesk) { el.style.transform = ''; return; }
        const d = +el.dataset.depth;
        const s = +(el.dataset.scroll || 0);
        el.style.transform = `translate3d(${mx * d}px, ${my * d + y * s}px, 0)`;
      });
    }

    // Parallax genérico: se mueve más lento que el contenido
    parallaxEls.forEach((img) => {
      const box = img.parentElement;
      const r = box.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const dist = r.top + r.height / 2 - vh / 2;
      const slack = (img.offsetHeight - box.offsetHeight) / 2;
      const off = clamp(-dist * +img.dataset.parallax, -slack, slack);
      img.style.transform = `translate3d(0, ${off}px, 0)`;
    });

    if (settling) kick();
  };
  const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { measureHs(); kick(); });
  addEventListener('load', () => { measureHs(); kick(); });
  kick();

  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
  }

  /* ---------- Microinteracciones (solo mouse) ---------- */
  if (finePointer && !reduceMotion) {
    // Tilt 3D con brillo
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.transform = `perspective(900px) rotateX(${(.5 - py) * 10}deg) rotateY(${(px - .5) * 12}deg) translateY(-6px)`;
        card.style.setProperty('--gx', `${px * 100}%`);
        card.style.setProperty('--gy', `${py * 100}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });

    // Botones magnéticos
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .22}px, ${y * .32}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // Efecto ripple en botones
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn || reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });

  /* ---------- Servicios: filtro por categoría ---------- */
  const svcChips = $$('.chip[data-svc]');
  svcChips.forEach((chip) => chip.addEventListener('click', () => {
    const cat = chip.dataset.svc;
    svcChips.forEach((c) => {
      const on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });
    let i = 0;
    $$('.services .service-card').forEach((card) => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.hidden = !show;
      card.classList.remove('is-entering');
      if (show) {
        card.classList.add('is-in'); // por si aún no había aparecido con el scroll
        card.style.setProperty('--i', i++);
        void card.offsetWidth;
        card.classList.add('is-entering');
      }
    });
  }));

  // "Cotizar": deja el servicio escrito en el formulario
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-service]');
    if (!link) return;
    const msg = $('#f-msg');
    if (msg) msg.value = `Hola, me interesa cotizar: ${link.dataset.service}.`;
    toast(`Cuéntanos más sobre: ${link.dataset.service}`);
  });

  /* ---------- Formulario de contacto ---------- */
  const form = $('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input[required]', form).forEach((input) => {
      const field = input.closest('.field');
      const valid = input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
      field.classList.toggle('is-invalid', !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    if (!ok) { toast('Revisa los campos marcados'); return; }
    // TODO: conectar con tu servicio de formularios (Formspree, Netlify Forms, EmailJS…)
    toast('¡Gracias! Te contactaremos muy pronto ✦');
    form.reset();
  });
  $$('.field input', form || document).forEach((i) =>
    i.addEventListener('input', () => i.closest('.field').classList.remove('is-invalid')));
})();

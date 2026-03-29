/* =============================================
   GAMEWIKI — MAIN.JS
   ============================================= */

// ── Search Index (global) ───────────────────
const SEARCH_INDEX = [
  // Comandos — Economía
  { title: '?tz / ?tz convert', desc: 'Ver tus truces o convertir puntos', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?market', desc: 'Muestra los precios del mercado', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?market top', desc: 'Top 10 productos más valorados', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?market best', desc: 'Qué vale más la pena vender ahora', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?sell', desc: 'Vende productos al precio mercado', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?buy', desc: 'Compra productos', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?buy list', desc: 'Lista de cultivos disponibles por tier y estación', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  { title: '?info', desc: 'Info de un crop, árbol o fertilizante', page: 'commands.html', tag: 'CMD · ECONOMÍA' },
  // Comandos — Granja
  { title: '?plant / ?pl', desc: 'Planta tus semillas', page: 'commands.html', tag: 'CMD · GRANJA' },
  { title: '?harvest / ?hv', desc: 'Comprueba o cosecha tus cultivos', page: 'commands.html', tag: 'CMD · GRANJA' },
  { title: '?convert / ?conv', desc: 'Convierte crops cosechados en semillas', page: 'commands.html', tag: 'CMD · GRANJA' },
  // Guías — Granja
  { title: 'Guía de Inicio: Tu Primer Cultivo', desc: 'Cómo empezar desde cero con ?inicio y ?plant', page: 'guides.html', tag: 'GUÍA · GRANJA' },
  { title: 'Guía de Inicio 2: Empezando a Acumular', desc: 'Convertir puntos, comprar semillas y acumular', page: 'guides.html', tag: 'GUÍA · GRANJA' },
  { title: 'El Mercado', desc: 'Calidades Nr/Co/Ag/Au/Pl y cómo usarlas', page: 'guides.html', tag: 'GUÍA · GRANJA' },
  { title: 'El Invernadero', desc: 'Mantenimiento, reparación y renovación', page: 'guides.html', tag: 'GUÍA · GRANJA' },
  // Mecánicas
  { title: 'Sistema de Mercado', desc: 'Lógica interna del mercado de cultivos', page: 'mechanics.html', tag: 'MECÁNICA · GRANJA' },
  { title: 'Sistema de Parcelas y Huertos', desc: 'Cómo funcionan las parcelas', page: 'mechanics.html', tag: 'MECÁNICA · GRANJA' },
  { title: 'Sistema de Invernadero', desc: 'Mecánicas del invernadero', page: 'mechanics.html', tag: 'MECÁNICA · GRANJA' },
];

document.addEventListener('DOMContentLoaded', () => {

  // ── Active nav link ─────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });

  // ── Global Search (home page) ───────────────
  const globalInput = document.getElementById('globalSearch');
  const dropdown = document.getElementById('searchDropdown');

  if (globalInput && dropdown) {
    globalInput.addEventListener('input', () => {
      const q = globalInput.value.toLowerCase().trim();
      dropdown.innerHTML = '';

      if (!q) {
        dropdown.classList.remove('open');
        return;
      }

      const matches = SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        dropdown.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
        dropdown.classList.add('open');
        return;
      }

      // Agrupar por tag
      const groups = {};
      matches.forEach(item => {
        if (!groups[item.tag]) groups[item.tag] = [];
        groups[item.tag].push(item);
      });

      Object.entries(groups).forEach(([groupName, items]) => {
        const groupTitle = document.createElement('div');
        groupTitle.className = 'search-result-group-title';
        groupTitle.textContent = groupName;
        dropdown.appendChild(groupTitle);

        items.forEach(item => {
          const a = document.createElement('a');
          a.href = item.page;
          a.className = 'search-result-item';
          a.innerHTML = `
            <span class="r-title">${item.title}</span>
            <span class="r-desc">${item.desc}</span>
            <span class="r-tag">${item.tag}</span>
          `;
          dropdown.appendChild(a);
        });
      });

      dropdown.classList.add('open');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', e => {
      if (!globalInput.closest('.global-search-wrap').contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  // ── Generic search + filter ─────────────────
  function setupSearch(inputId, itemSelector, textSelectors) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      document.querySelectorAll(itemSelector).forEach(el => {
        const text = textSelectors
          .map(sel => el.querySelector(sel)?.textContent || '')
          .join(' ').toLowerCase();
        el.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  setupSearch('gameSearch', '#gamesList .game-entry', ['.game-name', '.game-tags']);
  setupSearch('cmdSearch', '.cmd-table tbody tr', ['td']);
  setupSearch('guideSearch', '.guide-card', ['.guide-title', '.guide-desc', '.guide-meta']);
  setupSearch('glossSearch', '.glossary-entry', ['.glossary-term', '.glossary-def']);

  // ── Filter Buttons ──────────────────────────
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        document.querySelectorAll('.game-entry:not(.add-game)').forEach(el => {
          el.style.display = (filter === 'all' || (el.dataset.tags || '').toLowerCase().includes(filter)) ? '' : 'none';
        });

        document.querySelectorAll('.cmd-section').forEach(el => {
          el.style.display = (filter === 'all' || el.dataset.game === filter) ? '' : 'none';
        });

        document.querySelectorAll('[data-game]').forEach(el => {
          if (el.classList.contains('cmd-section')) return;
          el.style.display = (filter === 'all' || el.dataset.game === filter) ? '' : 'none';
        });

        document.querySelectorAll('.guide-card').forEach(el => {
          const game = (el.dataset.game || '').toLowerCase();
          const level = (el.dataset.level || '').toLowerCase();
          el.style.display = (filter === 'all' || game === filter || level === filter) ? '' : 'none';
        });
      });
    });
  });

  // ── Glossary Alpha Index ────────────────────
  const alphaIndex = document.getElementById('alphaIndex');
  if (alphaIndex) {
    const letters = [...new Set(
      [...document.querySelectorAll('.glossary-entry')]
        .map(el => el.dataset.letter?.toUpperCase()).filter(Boolean)
    )].sort();

    const allBtn = document.createElement('button');
    allBtn.className = 'alpha-btn active';
    allBtn.textContent = 'TODOS';
    allBtn.addEventListener('click', () => {
      alphaIndex.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
      document.querySelectorAll('.glossary-entry').forEach(el => el.style.display = '');
    });
    alphaIndex.appendChild(allBtn);

    letters.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'alpha-btn';
      btn.textContent = letter;
      btn.addEventListener('click', () => {
        alphaIndex.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.glossary-entry').forEach(el => {
          el.style.display = el.dataset.letter?.toUpperCase() === letter ? '' : 'none';
        });
      });
      alphaIndex.appendChild(btn);
    });
  }

  // ── Typing effect (home subtitle) ───────────
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    const type = () => { if (i < text.length) { subtitle.textContent += text[i++]; setTimeout(type, 45); } };
    setTimeout(type, 400);
  }

  // ── Pixel cursor trail ───────────────────────
  const trail = [];
  const TRAIL_LEN = 6;
  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `position:fixed;width:4px;height:4px;background:var(--accent);pointer-events:none;z-index:9997;opacity:0;box-shadow:0 0 4px var(--accent);transition:opacity 0.3s;`;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  let frame = 0;
  function animateTrail() {
    frame++;
    if (frame % 2 === 0) {
      trail.unshift({ x: mouseX, y: mouseY, el: trail[trail.length - 1].el });
      trail.pop();
    }
    trail.forEach((point, i) => {
      point.el.style.left = point.x + 'px';
      point.el.style.top = point.y + 'px';
      point.el.style.opacity = (1 - i / TRAIL_LEN) * 0.6;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

});

/* =============================================
   GAMEWIKI — MAIN.JS
   Interactividad: búsqueda, filtros, glosario
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Highlight active nav link ───────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ── Generic search + filter ─────────────────
  function setupSearch(inputId, itemSelector, textSelectors) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      document.querySelectorAll(itemSelector).forEach(el => {
        const text = textSelectors
          .map(sel => el.querySelector(sel)?.textContent || '')
          .join(' ')
          .toLowerCase();
        el.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // Games page search
  setupSearch('gameSearch', '#gamesList .game-entry', ['.game-name', '.game-tags']);

  // Commands page search
  setupSearch('cmdSearch', '.cmd-table tbody tr', ['td']);

  // Guides page search
  setupSearch('guideSearch', '.guide-card', ['.guide-title', '.guide-desc', '.guide-meta']);

  // Glossary search
  setupSearch('glossSearch', '.glossary-entry', ['.glossary-term', '.glossary-def']);

  // ── Filter Buttons ──────────────────────────
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // For game entries
        document.querySelectorAll('.game-entry:not(.add-game)').forEach(el => {
          if (filter === 'all') {
            el.style.display = '';
          } else {
            const tags = (el.dataset.tags || '').toLowerCase();
            el.style.display = tags.includes(filter) ? '' : 'none';
          }
        });

        // For cmd sections
        document.querySelectorAll('.cmd-section').forEach(el => {
          if (filter === 'all') {
            el.style.display = '';
          } else {
            el.style.display = el.dataset.game === filter ? '' : 'none';
          }
        });

        // For mechanic sections
        document.querySelectorAll('[data-game]').forEach(el => {
          if (el.classList.contains('cmd-section')) return; // handled above
          if (filter === 'all') {
            el.style.display = '';
          } else {
            el.style.display = el.dataset.game === filter ? '' : 'none';
          }
        });

        // For guide cards
        document.querySelectorAll('.guide-card').forEach(el => {
          if (filter === 'all') {
            el.style.display = '';
          } else {
            const game = (el.dataset.game || '').toLowerCase();
            const level = (el.dataset.level || '').toLowerCase();
            el.style.display = (game === filter || level === filter) ? '' : 'none';
          }
        });
      });
    });
  });

  // ── Glossary Alpha Index ────────────────────
  const alphaIndex = document.getElementById('alphaIndex');
  if (alphaIndex) {
    const letters = [...new Set(
      [...document.querySelectorAll('.glossary-entry')]
        .map(el => el.dataset.letter?.toUpperCase())
        .filter(Boolean)
    )].sort();

    // All button
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

  // ── Typing effect for hero subtitle ─────────
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        subtitle.textContent += text[i++];
        setTimeout(type, 40);
      }
    };
    setTimeout(type, 600);
  }

  // ── Pixel cursor trail ───────────────────────
  const trail = [];
  const TRAIL_LEN = 6;
  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: 4px; height: 4px;
      background: var(--accent);
      pointer-events: none;
      z-index: 9997;
      opacity: 0;
      box-shadow: 0 0 4px var(--accent);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let frame = 0;
  function animateTrail() {
    frame++;
    if (frame % 2 === 0) {
      trail.unshift({ x: mouseX, y: mouseY, el: trail[trail.length - 1].el });
      trail.pop();
    }
    trail.forEach((point, i) => {
      point.el.style.left = point.x + 'px';
      point.el.style.top  = point.y + 'px';
      point.el.style.opacity = (1 - i / TRAIL_LEN) * 0.6;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

});

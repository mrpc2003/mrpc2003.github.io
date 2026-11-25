(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  const syncThemeButton = (theme) => {
    if (!toggle) return;
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
  };

  if (toggle) {
    syncThemeButton(root.dataset.theme === 'dark' ? 'dark' : 'light');
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      syncThemeButton(next);
      try {
        localStorage.setItem('theme', next);
      } catch (_) {}
    });
  }

  const filters = document.querySelector('.filters');
  if (filters) {
    const buttons = Array.from(filters.querySelectorAll('button[data-filter]'));
    const cards = Array.from(document.querySelectorAll('#projects .card[data-cat]'));

    filters.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-filter]');
      if (!btn) return;
      const target = btn.dataset.filter;
      buttons.forEach((b) => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      cards.forEach((card) => {
        const cats = (card.dataset.cat || '').split(/\s+/);
        card.hidden = target !== 'all' && !cats.includes(target);
      });
    });
  }

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (navLinks.length > 0 && 'IntersectionObserver' in window) {
    const pairs = navLinks
      .map((link) => {
        const el = document.querySelector(link.getAttribute('href'));
        return el ? { link, el } : null;
      })
      .filter(Boolean);

    if (pairs.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length === 0) return;
          const activeId = visible[0].target.id;
          pairs.forEach(({ link, el }) => {
            link.dataset.active = el.id === activeId ? 'true' : 'false';
          });
        },
        { rootMargin: '-25% 0px -60% 0px', threshold: 0.01 }
      );
      pairs.forEach(({ el }) => observer.observe(el));
    }
  }
})();

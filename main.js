(() => {
  const root = document.documentElement;

  /* Theme toggle: the pre-paint script in <head> has already set data-theme. */
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

  /* Project filter: progressive enhancement; without JS every project stays visible. */
  const filters = document.querySelector('.filters');
  if (filters) {
    const buttons = Array.from(filters.querySelectorAll('button[data-filter]'));
    const items = Array.from(document.querySelectorAll('#projects [data-cat]'));
    filters.hidden = false;
    filters.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-filter]');
      if (!btn) return;
      const target = btn.dataset.filter;
      buttons.forEach((b) => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      items.forEach((item) => {
        const cats = (item.dataset.cat || '').split(/\s+/);
        item.hidden = target !== 'all' && !cats.includes(target);
      });
    });
  }

  /* Running head: mark the section currently being read. */
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (navLinks.length > 0 && 'IntersectionObserver' in window) {
    const pairs = navLinks
      .map((link) => {
        const el = document.getElementById(link.getAttribute('href').slice(1));
        return el ? { link, el } : null;
      })
      .filter(Boolean);
    /* Sections without a nav entry (title block, skills, contact) clear the mark. */
    const sections = Array.from(document.querySelectorAll('main section[id]'));

    if (pairs.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length === 0) return;
          const activeId = visible[0].target.id;
          pairs.forEach(({ link, el }) => {
            if (el.id === activeId) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        },
        { rootMargin: '-25% 0px -60% 0px', threshold: 0.01 }
      );
      sections.forEach((el) => observer.observe(el));
    }
  }
})();

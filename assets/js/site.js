(() => {
  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('.site-nav');

  if (header && nav && !header.querySelector('.support-utility')) {
    const homeHref = header.querySelector('.brand')?.getAttribute('href') || './';

    if (!document.querySelector('link[data-support-styles]')) {
      const supportStyles = document.createElement('link');
      supportStyles.rel = 'stylesheet';
      supportStyles.href = `${homeHref}assets/css/support.css`;
      supportStyles.dataset.supportStyles = '';
      document.head.append(supportStyles);
    }

    const actions = document.createElement('div');
    actions.className = 'header-actions';

    const support = document.createElement('a');
    support.className = 'support-utility';
    support.href = `${homeHref}apoyar/`;
    support.setAttribute('aria-label', 'invita un tecito');
    support.innerHTML = `
      <svg class="support-utility-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5.5 8.5h10v4.25a4.75 4.75 0 0 1-4.75 4.75h-.5a4.75 4.75 0 0 1-4.75-4.75V8.5Z" stroke="currentColor" stroke-width="1.25"/>
        <path d="M15.5 10h1.75a2.75 2.75 0 0 1 0 5.5H15" stroke="currentColor" stroke-width="1.25"/>
        <path d="M8.5 6.25c0-1.15 1.25-1.55 1.25-2.75M12.25 6.25c0-1.15 1.25-1.55 1.25-2.75" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
      </svg>
      <span>invita un tecito</span>
    `;

    nav.before(actions);
    actions.append(nav, support);
  }

  const progress = document.querySelector('.reading-progress');
  const sections = [...document.querySelectorAll('.essay-section[id]')];
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.width = `${ratio * 100}%`;
  };

  const updateActive = () => {
    if (!sections.length || !tocLinks.length) return;
    let current = sections[0].id;
    const threshold = window.innerHeight * 0.33;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    }
    tocLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };

  const update = () => {
    updateProgress();
    updateActive();
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

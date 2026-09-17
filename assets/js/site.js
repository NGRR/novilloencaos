(() => {
  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('.site-nav');

  if (header && nav && !header.querySelector('.support-utility')) {
    const homeHref = header.querySelector('.brand')?.getAttribute('href') || './';
    const actions = document.createElement('div');
    actions.className = 'header-actions';

    const support = document.createElement('a');
    support.className = 'support-utility';
    support.href = `${homeHref}apoyar/`;
    support.textContent = 'invita un tecito';

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

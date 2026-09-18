(() => {
  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('.site-nav');
  const homeHref = header?.querySelector('.brand')?.getAttribute('href') || './';
  const isSupportPage = Boolean(document.querySelector('.support-page'));
  const isQuoteStudioPage = document.body.classList.contains('quote-studio-page');

  const cupIcon = () => [
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">',
    '<path d="M5.5 8.5h10v4.25a4.75 4.75 0 0 1-4.75 4.75h-.5a4.75 4.75 0 0 1-4.75-4.75V8.5Z" stroke="currentColor" stroke-width="1.25"/>',
    '<path d="M15.5 10h1.75a2.75 2.75 0 0 1 0 5.5H15" stroke="currentColor" stroke-width="1.25"/>',
    '<path d="M8.5 6.25c0-1.15 1.25-1.55 1.25-2.75M12.25 6.25c0-1.15 1.25-1.55 1.25-2.75" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>',
    '</svg>'
  ].join('');

  const makeSupportLink = (extraClass = '') => {
    const link = document.createElement('a');
    link.className = ('support-cta ' + extraClass).trim();
    link.href = homeHref + 'apoyar/';
    link.setAttribute('aria-label', 'invita un tecito');
    link.innerHTML = cupIcon() + '<span>invita un tecito</span>';
    return link;
  };

  if (nav && !nav.querySelector('[data-quote-studio-nav]')) {
    const quoteNav = document.createElement('a');
    quoteNav.href = homeHref + 'citas/';
    quoteNav.textContent = 'Citas';
    quoteNav.setAttribute('data-quote-studio-nav', '');
    const gitLink = [...nav.querySelectorAll('a')].find(link => link.href.includes('github.com'));
    if (gitLink) nav.insertBefore(quoteNav, gitLink);
    else nav.append(quoteNav);
  }

  if (header && nav && !isSupportPage && !isQuoteStudioPage && !header.querySelector('.support-utility')) {
    header.append(makeSupportLink('support-utility'));
  }

  const essayBody = document.querySelector('.essay-body');
  if (essayBody && !essayBody.querySelector('.article-support')) {
    const wrap = document.createElement('div');
    wrap.className = 'article-support';
    wrap.append(makeSupportLink('article-support-button'));
    essayBody.append(wrap);
  }

  const archive = document.querySelector('.archive');
  const footer = document.querySelector('.site-footer');
  if (archive && footer && !footer.querySelector('.footer-support')) {
    footer.classList.add('has-support');
    const support = makeSupportLink('footer-support');
    footer.insertBefore(support, footer.lastElementChild);
  }

  if (essayBody && !isQuoteStudioPage) {
    const essayTitle = document.querySelector('.essay-hero h1')?.textContent.trim() || 'novilloencaos';
    const essayKicker = document.querySelector('.essay-kicker')?.textContent.trim() || 'FRAGMENTO';
    [...essayBody.querySelectorAll('.quote-axis')].forEach((quote, index) => {
      if (quote.querySelector('.quote-export-link')) return;
      const quoteText = quote.textContent.trim();
      const link = document.createElement('a');
      const target = new URL(homeHref + 'citas/', document.baseURI);
      target.searchParams.set('q', quoteText);
      target.searchParams.set('source', essayTitle);
      target.searchParams.set('meta', essayKicker);
      target.searchParams.set('n', String(index + 1).padStart(3, '0'));
      link.className = 'quote-export-link';
      link.href = target.toString();
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'llevar a cita';
      link.setAttribute('aria-label', 'Abrir este fragmento en el compositor de citas');
      quote.append(link);
    });
  }

  const progress = document.querySelector('.reading-progress');
  const sections = [...document.querySelectorAll('.essay-section[id]')];
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.width = (ratio * 100) + '%';
  };

  const updateActive = () => {
    if (!sections.length || !tocLinks.length) return;
    let current = sections[0].id;
    const threshold = window.innerHeight * 0.33;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    }
    tocLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
  };

  const update = () => {
    updateProgress();
    updateActive();
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

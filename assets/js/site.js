(() => {

  const GA_ID = 'G-30BXSNDWSS';
  const CONSENT_KEY = 'nvc_analytics_consent';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  window.gtag('consent', 'default', {
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    ad_storage: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  let analyticsEnabled = false;
  let analyticsLoaded = false;
  let trackingStarted = false;

  const readConsent = () => {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  };

  const writeConsent = value => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Si localStorage no está disponible, la decisión se mantiene sólo en esta carga.
    }
  };

  const ensureConsentStyles = () => {
    if (document.getElementById('nvc-consent-styles')) return;

    const style = document.createElement('style');
    style.id = 'nvc-consent-styles';
    style.textContent = `
      .nvc-consent{position:fixed;z-index:9999;left:0;right:0;bottom:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1.5rem;align-items:center;padding:.85rem max(1rem,calc((100vw - 1180px)/2));background:#fff;color:#111;border-top:1px solid #111;font:400 .68rem/1.45 var(--mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);letter-spacing:.01em}
      .nvc-consent[hidden]{display:none}
      .nvc-consent-copy{margin:0;max-width:760px}
      .nvc-consent-copy b{font-weight:600;text-transform:uppercase;letter-spacing:.05em}
      .nvc-consent-actions{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:flex-end}
      .nvc-consent button{appearance:none;border:1px solid #111;background:#fff;color:#111;padding:.48rem .68rem;font:inherit;cursor:pointer}
      .nvc-consent button:hover,.nvc-consent button:focus-visible{background:#111;color:#fff;outline:none}
      .nvc-consent-settings{appearance:none;border:0;border-bottom:1px solid currentColor;background:transparent;color:inherit;padding:0;font:inherit;cursor:pointer;text-transform:lowercase}
      .nvc-consent-settings:hover,.nvc-consent-settings:focus-visible{border-bottom-style:dashed;outline:none}
      @media(max-width:700px){.nvc-consent{grid-template-columns:1fr;gap:.7rem;padding:.8rem 1rem}.nvc-consent-actions{justify-content:flex-start}.nvc-consent button{flex:1 1 auto}}
    `;
    document.head.appendChild(style);
  };

  const consentPanel = () => {
    let panel = document.querySelector('.nvc-consent');
    if (panel) return panel;

    ensureConsentStyles();

    panel = document.createElement('section');
    panel.className = 'nvc-consent';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Preferencia de analítica');
    panel.innerHTML = `
      <p class="nvc-consent-copy"><b>analítica opcional</b> — se usa sólo para entender qué textos se leen y cómo se recorre el archivo. El contenido funciona igual sin ella.</p>
      <div class="nvc-consent-actions">
        <button type="button" data-consent-choice="granted">permitir analítica</button>
        <button type="button" data-consent-choice="denied">continuar sin analítica</button>
      </div>
    `;

    document.body.appendChild(panel);
    return panel;
  };

  const hideConsentPanel = () => {
    const panel = document.querySelector('.nvc-consent');
    if (panel) panel.hidden = true;
  };

  const showConsentPanel = () => {
    const panel = consentPanel();
    panel.hidden = false;
  };

  const loadGoogleAnalytics = () => {
    if (analyticsLoaded) return;

    analyticsEnabled = true;
    analyticsLoaded = true;

    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    if (!document.querySelector('script[data-nvc-ga="' + GA_ID + '"]')) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
      gaScript.dataset.nvcGa = GA_ID;
      document.head.appendChild(gaScript);
    }

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    startEditorialAnalytics();
  };

  const applyConsent = value => {
    const hadAnalyticsLoaded = analyticsLoaded;

    writeConsent(value);

    if (value === 'granted') {
      loadGoogleAnalytics();
      hideConsentPanel();
      return;
    }

    analyticsEnabled = false;
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    hideConsentPanel();

    if (hadAnalyticsLoaded) location.reload();
  };

  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('.site-nav');
  const homeHref = header?.querySelector('.brand')?.getAttribute('href') || './';
  const isSupportPage = Boolean(document.querySelector('.support-page'));
  const isEssayPage = Boolean(document.querySelector('.essay-body'));

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
    link.dataset.analytics = 'tea';
    link.innerHTML = cupIcon() + '<span>invita un tecito</span>';
    return link;
  };

  if (header && nav && !isSupportPage && !header.querySelector('.support-utility')) {
    const support = makeSupportLink('support-utility' + (isEssayPage ? ' support-utility--article' : ''));
    header.after(support);
  }

  const essayBody = document.querySelector('.essay-body');
  if (essayBody && !essayBody.querySelector('.article-support')) {
    const wrap = document.createElement('div');
    wrap.className = 'article-support';

    const prompt = document.createElement('span');
    prompt.className = 'article-support-copy';
    prompt.textContent = 'si esto movió algo de lugar';

    wrap.append(prompt, makeSupportLink('article-support-button support-cta--article'));
    essayBody.append(wrap);
  }

  const archive = document.querySelector('.archive');
  const footer = document.querySelector('.site-footer');
  if (archive && footer && !footer.querySelector('.footer-support')) {
    footer.classList.add('has-support');
    const support = makeSupportLink('footer-support');
    footer.insertBefore(support, footer.lastElementChild);
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

  const compact = object => Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

  const contentMeta = () => {
    if (!essayBody) return null;

    const body = document.body;
    const pathParts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const kicker = document.querySelector('.essay-kicker')?.textContent?.trim() || '';
    const typeMatch = kicker.match(/\s\/\s(ENSAYO|RELATO|APUNTE|COMENTARIO|FRAGMENTO)\s\/\s/i);
    const recordMatch = kicker.match(/REC:\/\/[A-Z0-9-]+/i);
    const topicsMatch = kicker.match(/\s\/\s(?:ENSAYO|RELATO|APUNTE|COMENTARIO|FRAGMENTO)\s\/\s(.+)$/i);

    return compact({
      content_id: body.dataset.contentId || pathParts.at(-1),
      content_type: body.dataset.contentType || typeMatch?.[1]?.toLowerCase(),
      content_title: document.querySelector('h1')?.textContent?.trim() || document.title,
      content_record: body.dataset.contentRecord || recordMatch?.[0],
      content_topics: body.dataset.contentTopics || topicsMatch?.[1]?.trim(),
      content_version: body.dataset.contentVersion,
      content_path: location.pathname
    });
  };

  const sendEvent = (name, params = {}) => {
    if (!analyticsEnabled || typeof window.gtag !== 'function') return;
    window.gtag('event', name, compact({ ...params, transport_type: 'beacon' }));
  };

  const startEditorialAnalytics = () => {
    if (trackingStarted || !analyticsEnabled) return;
    trackingStarted = true;

    const meta = contentMeta();

    if (meta) {
      sendEvent('article_view', meta);

      const scrollMilestones = [25, 50, 75, 90, 100];
      const reachedScroll = new Set();
      let scrollTicking = false;

      const evaluateArticleScroll = () => {
        const rect = essayBody.getBoundingClientRect();
        const articleTop = window.scrollY + rect.top;
        const articleHeight = Math.max(1, essayBody.offsetHeight);
        const viewportBottom = window.scrollY + window.innerHeight;
        const percent = Math.max(0, Math.min(100, Math.floor(((viewportBottom - articleTop) / articleHeight) * 100)));

        for (const milestone of scrollMilestones) {
          if (percent >= milestone && !reachedScroll.has(milestone)) {
            reachedScroll.add(milestone);
            sendEvent('article_scroll', { ...meta, scroll_percent: milestone });
            if (milestone === 100) sendEvent('article_complete', meta);
          }
        }
      };

      const requestScrollEvaluation = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(() => {
          evaluateArticleScroll();
          scrollTicking = false;
        });
      };

      window.addEventListener('scroll', requestScrollEvaluation, { passive: true });
      window.addEventListener('resize', requestScrollEvaluation);
      evaluateArticleScroll();

      const timeMilestones = [30, 60, 180, 300];
      const reachedTime = new Set();
      let activeSeconds = 0;

      window.setInterval(() => {
        const rect = essayBody.getBoundingClientRect();
        const articleVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (document.visibilityState !== 'visible' || !document.hasFocus() || !articleVisible) return;

        activeSeconds += 5;
        for (const seconds of timeMilestones) {
          if (activeSeconds >= seconds && !reachedTime.has(seconds)) {
            reachedTime.add(seconds);
            sendEvent('article_engaged', { ...meta, engaged_seconds: seconds });
          }
        }
      }, 5000);
    }

    const supportValues = {
      'luca': 1000,
      'dos luquini': 2000,
      'gabriela mistral': 5000
    };

    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      let url;
      try {
        url = new URL(link.href, location.href);
      } catch {
        return;
      }

      const label = link.textContent.trim().replace(/\s+/g, ' ').toLowerCase();
      const base = meta || { content_id: 'archive', content_type: 'archive', content_path: location.pathname };

      if (link.classList.contains('support-button') && url.hostname === 'pay.sumup.com') {
        sendEvent('support_payment_click', {
          ...base,
          support_label: label,
          value: supportValues[label],
          currency: 'CLP',
          link_url: url.href
        });
        return;
      }

      if (link.dataset.analytics === 'tea' || (url.origin === location.origin && /\/apoyar\/?$/.test(url.pathname))) {
        sendEvent('tea_click', { ...base, link_url: url.href });
        return;
      }

      if (url.origin === location.origin && /\/(ensayos|relatos|apuntes|comentarios|fragmentos)\//.test(url.pathname)) {
        sendEvent('internal_article_click', {
          ...base,
          destination_path: url.pathname
        });
        return;
      }

      if (url.origin !== location.origin && /^https?:$/.test(url.protocol)) {
        sendEvent('external_link_click', {
          ...base,
          link_url: url.href,
          link_domain: url.hostname
        });
      }
    });
  };

  const initConsent = () => {
    ensureConsentStyles();

    const footer = document.querySelector('.site-footer');
    if (footer && !footer.querySelector('.nvc-consent-settings')) {
      const settings = document.createElement('button');
      settings.type = 'button';
      settings.className = 'nvc-consent-settings';
      settings.textContent = 'analítica';
      settings.setAttribute('aria-label', 'Cambiar preferencia de analítica');
      settings.addEventListener('click', showConsentPanel);
      footer.appendChild(settings);
    }

    document.addEventListener('click', event => {
      const choice = event.target.closest('[data-consent-choice]')?.dataset.consentChoice;
      if (choice === 'granted' || choice === 'denied') applyConsent(choice);
    });

    const consent = readConsent();
    if (consent === 'granted') {
      loadGoogleAnalytics();
    } else if (!consent) {
      showConsentPanel();
    }
  };

  initConsent();

})();

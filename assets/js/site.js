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

  const COMMUNITY_CONFIG_PATH = 'assets/data/community-config.json';
  const VISITOR_KEY = 'nvc_community_visitor';
  const teaCounts = new Map();
  let communityConfig = null;
  let volatileVisitorId = '';

  const normalizeRecord = value => (value || '').trim().toUpperCase();
  const recordFromArchiveItem = item => normalizeRecord(item?.querySelector('.archive-code')?.textContent?.match(/REC:\/\/[A-Z0-9-]+/i)?.[0]);
  const articleRecord = () => normalizeRecord(contentMeta()?.content_record || document.querySelector('.essay-kicker')?.textContent?.match(/REC:\/\/[A-Z0-9-]+/i)?.[0]);

  const projectAssetUrl = path => new URL(homeHref + path, location.href);
  const teaCountUrl = () => projectAssetUrl('assets/data/tea-counts.json');
  const communityConfigUrl = () => projectAssetUrl(COMMUNITY_CONFIG_PATH);

  const loadTeaCounts = async () => {
    try {
      const response = await fetch(teaCountUrl(), { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      Object.entries(data).forEach(([record, count]) => teaCounts.set(normalizeRecord(record), Number(count) || 0));
      document.querySelectorAll('[data-tea-count-for]').forEach(node => {
        const record = normalizeRecord(node.dataset.teaCountFor);
        node.textContent = String(teaCounts.get(record) ?? 0);
      });
    } catch {
      // El contador de apoyo no bloquea la lectura ni la interacción.
    }
  };

  const loadCommunityConfig = async () => {
    if (communityConfig) return communityConfig;
    try {
      const response = await fetch(communityConfigUrl(), { cache: 'no-store' });
      if (!response.ok) throw new Error('community_config_http_' + response.status);
      const config = await response.json();
      const url = String(config.supabaseUrl || '').trim().replace(/\/$/, '');
      const key = String(config.supabasePublishableKey || config.supabaseAnonKey || '').trim();
      communityConfig = {
        supabaseUrl: url,
        apiKey: key,
        ready: /^https:\/\/.+\.supabase\.co$/i.test(url) && key.length > 20
      };
    } catch {
      communityConfig = { supabaseUrl: '', apiKey: '', ready: false };
    }
    return communityConfig;
  };

  const communityRpc = async (name, payload = {}) => {
    const config = await loadCommunityConfig();
    if (!config.ready) throw new Error('community_not_configured');

    const response = await fetch(config.supabaseUrl + '/rest/v1/rpc/' + encodeURIComponent(name), {
      method: 'POST',
      headers: {
        apikey: config.apiKey,
        Authorization: 'Bearer ' + config.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const raw = await response.text();
    let data = null;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }
    }

    if (!response.ok) {
      const detail = typeof data === 'object' && data
        ? [data.message, data.details, data.hint, data.code].filter(Boolean).join(' / ')
        : String(data || ('HTTP ' + response.status));
      throw new Error(detail || ('HTTP ' + response.status));
    }

    return data;
  };

  const validVisitorId = value => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');

  const readVisitorId = () => {
    if (validVisitorId(volatileVisitorId)) return volatileVisitorId;
    try {
      const stored = localStorage.getItem(VISITOR_KEY) || '';
      if (validVisitorId(stored)) {
        volatileVisitorId = stored;
        return stored;
      }
    } catch {
      // Puede operar durante esta carga aunque el almacenamiento esté bloqueado.
    }
    return '';
  };

  const createVisitorId = () => {
    if (crypto?.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20)
    ].join('-');
  };

  const ensureVisitorId = () => {
    const existing = readVisitorId();
    if (existing) return existing;

    volatileVisitorId = createVisitorId();
    try {
      localStorage.setItem(VISITOR_KEY, volatileVisitorId);
    } catch {
      // Identidad efímera para navegadores que bloquean almacenamiento local.
    }
    return volatileVisitorId;
  };

  const interactionErrorText = error => {
    const message = String(error?.message || error || '');
    if (message.includes('community_not_configured')) return 'INTERACCIÓN / configuración pendiente.';
    if (/failed to fetch|networkerror|load failed|fetch/i.test(message)) return 'INTERACCIÓN / no fue posible conectar con el servicio.';
    if (message.includes('rate_limit_short')) return 'Espera unos segundos antes de volver a publicar.';
    if (message.includes('rate_limit_hour')) return 'Límite temporal alcanzado. Intenta nuevamente más tarde.';
    if (message.includes('rate_limit_day')) return 'Límite diario alcanzado.';
    if (message.includes('duplicate_note')) return 'Esta nota ya fue publicada.';
    if (message.includes('blocked_user')) return 'Esta identidad no puede publicar notas.';
    if (message.includes('invalid_note')) return 'La nota debe tener entre 3 y 1200 caracteres.';
    if (message.includes('invalid_alias')) return 'El alias puede tener hasta 40 caracteres.';
    if (message.includes('invalid_visitor')) return 'INTERACCIÓN / identidad local no disponible.';
    return 'No fue posible completar la interacción.';
  };

  const setShellStatus = (shell, message = '', state = '') => {
    const node = shell?.querySelector('[data-community-status]');
    if (!node) return;
    node.textContent = message;
    node.dataset.state = state;
    node.hidden = !message;
  };

  const updateShellCounts = (record, values = {}) => {
    document.querySelectorAll('.nvc-interactions').forEach(shell => {
      if (normalizeRecord(shell.dataset.record) !== normalizeRecord(record)) return;
      if (values.resonance_count !== undefined) {
        const count = shell.querySelector('[data-resonance-count]');
        if (count) count.textContent = String(values.resonance_count);
      }
      if (values.note_count !== undefined) {
        const count = shell.querySelector('[data-notes-count]');
        if (count) count.textContent = String(values.note_count);
      }
      if (values.viewer_resonated !== undefined) {
        const button = shell.querySelector('[data-toggle-resonance]');
        if (button) {
          button.setAttribute('aria-pressed', String(Boolean(values.viewer_resonated)));
          button.classList.toggle('is-active', Boolean(values.viewer_resonated));
          const symbol = button.querySelector('.nvc-interaction-symbol');
          if (symbol) symbol.textContent = values.viewer_resonated ? '♥' : '♡';
        }
      }
    });
  };

  const fetchInteractionCounts = async records => {
    const unique = [...new Set(records.map(normalizeRecord).filter(Boolean))];
    if (!unique.length) return;
    try {
      const data = await communityRpc('nvc_get_interaction_counts', {
        p_records: unique,
        p_visitor_id: readVisitorId() || null
      });
      (data || []).forEach(row => updateShellCounts(row.record, row));
    } catch (error) {
      console.warn('[novilloencaos/community/counts]', error);
      document.querySelectorAll('.nvc-interactions').forEach(shell => shell.classList.add('is-pending'));
    }
  };

  const formatNoteDate = value => {
    try {
      return new Intl.DateTimeFormat('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(value));
    } catch {
      return '';
    }
  };

  const renderNotes = (shell, notes = []) => {
    const list = shell.querySelector('[data-notes-list]');
    if (!list) return;
    list.replaceChildren();

    if (!notes.length) {
      const empty = document.createElement('p');
      empty.className = 'nvc-notes-empty';
      empty.textContent = 'Todavía no hay notas en este registro.';
      list.appendChild(empty);
      return;
    }

    notes.forEach(note => {
      const article = document.createElement('article');
      article.className = 'nvc-note';

      const meta = document.createElement('div');
      meta.className = 'nvc-note-meta';

      const alias = document.createElement('span');
      alias.textContent = (note.alias || '').trim() || 'anónimo';

      const date = document.createElement('time');
      date.dateTime = note.created_at || '';
      date.textContent = formatNoteDate(note.created_at);

      const body = document.createElement('p');
      body.textContent = note.body || '';

      meta.append(alias, date);
      article.append(meta, body);
      list.appendChild(article);
    });
  };

  const loadNotes = async shell => {
    const record = normalizeRecord(shell.dataset.record);
    setShellStatus(shell, 'cargando notas…', 'loading');
    try {
      const data = await communityRpc('nvc_list_notes', { p_record: record });
      renderNotes(shell, data || []);
      setShellStatus(shell, '');
    } catch (error) {
      console.warn('[novilloencaos/community/notes]', error);
      renderNotes(shell, []);
      setShellStatus(shell, interactionErrorText(error), 'error');
    }
  };

  const toggleResonance = async shell => {
    const record = normalizeRecord(shell.dataset.record);
    const button = shell.querySelector('[data-toggle-resonance]');
    if (button?.disabled) return;

    if (button) button.disabled = true;
    setShellStatus(shell, 'registrando resonancia…', 'loading');

    try {
      const data = await communityRpc('nvc_toggle_resonance', {
        p_record: record,
        p_visitor_id: ensureVisitorId()
      });
      const row = Array.isArray(data) ? data[0] : data;
      if (row) updateShellCounts(record, row);
      setShellStatus(shell, '');
      sendEvent('article_resonance', {
        content_record: record,
        resonance_state: row?.viewer_resonated ? 'on' : 'off',
        content_path: location.pathname
      });
    } catch (error) {
      console.warn('[novilloencaos/community/resonance]', error);
      setShellStatus(shell, interactionErrorText(error), 'error');
    } finally {
      if (button) button.disabled = false;
    }
  };

  const submitNote = async (shell, form) => {
    const record = normalizeRecord(shell.dataset.record);
    const alias = form.elements.alias?.value?.trim() || '';
    const body = form.elements.body?.value?.trim() || '';
    const website = form.elements.website?.value || '';
    const submit = form.querySelector('[type="submit"]');

    if (submit?.disabled) return;
    if (submit) submit.disabled = true;
    setShellStatus(shell, 'publicando nota…', 'loading');

    try {
      const data = await communityRpc('nvc_add_note', {
        p_record: record,
        p_alias: alias,
        p_body: body,
        p_website: website,
        p_visitor_id: ensureVisitorId()
      });
      form.reset();
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.note_count !== undefined) updateShellCounts(record, { note_count: row.note_count });
      await loadNotes(shell);
      setShellStatus(shell, 'nota publicada', 'success');
      window.setTimeout(() => setShellStatus(shell, ''), 2400);
      sendEvent('article_note_submit', { content_record: record, content_path: location.pathname });
    } catch (error) {
      console.warn('[novilloencaos/community/submit-note]', error);
      setShellStatus(shell, interactionErrorText(error), 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  };

  const createInteractionShell = (record, articleHref, variant = 'archive') => {
    if (!record) return null;
    const shell = document.createElement('section');
    shell.className = 'nvc-interactions nvc-interactions--' + variant;
    shell.dataset.record = record;
    shell.innerHTML = [
      '<div class="nvc-interaction-bar">',
      '<button type="button" class="nvc-interaction" data-toggle-resonance aria-pressed="false">',
      '<span class="nvc-interaction-symbol" aria-hidden="true">♡</span><span>resonancias</span><span class="nvc-interaction-count" data-resonance-count>—</span>',
      '</button>',
      '<button type="button" class="nvc-interaction" data-open-notes aria-expanded="false">',
      '<span class="nvc-interaction-symbol" aria-hidden="true">◌</span><span>notas</span><span class="nvc-interaction-count" data-notes-count>—</span>',
      '</button>',
      '<a class="nvc-interaction nvc-tea-count" href="' + homeHref + 'apoyar/?ref=' + encodeURIComponent(record) + '" data-analytics="tea" aria-label="Invita un tecito">',
      cupIcon() + '<span class="nvc-interaction-count" data-tea-count-for="' + record + '">0</span>',
      '</a>',
      '</div>',
      '<div class="nvc-community-status" data-community-status hidden aria-live="polite"></div>',
      '<div class="nvc-notes-panel" hidden>',
      '<div class="nvc-discussion-head"><span>NOTAS / LECTORES</span><button type="button" data-close-notes aria-label="Cerrar notas">cerrar ×</button></div>',
      '<div class="nvc-notes-list" data-notes-list></div>',
      '<form class="nvc-note-form" data-note-form>',
      '<label><span>alias / opcional</span><input name="alias" type="text" maxlength="40" autocomplete="nickname"></label>',
      '<label><span>nota</span><textarea name="body" minlength="3" maxlength="1200" rows="5" required></textarea></label>',
      '<label class="nvc-honeypot" aria-hidden="true">sitio<input name="website" type="text" tabindex="-1" autocomplete="off"></label>',
      '<div class="nvc-note-form-foot"><span>sin cuenta · máximo 1200 caracteres</span><button type="submit">publicar nota</button></div>',
      '</form>',
      '</div>'
    ].join('');
    if (articleHref) shell.dataset.articleHref = articleHref;
    return shell;
  };

  const toggleNotes = async shell => {
    const panel = shell.querySelector('.nvc-notes-panel');
    const button = shell.querySelector('[data-open-notes]');
    if (!panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    if (button) button.setAttribute('aria-expanded', String(open));

    if (open) {
      sendEvent('comment_open', { content_record: shell.dataset.record, content_path: location.pathname });
      await loadNotes(shell);
      window.requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  };

  const initInteractions = async () => {
    document.querySelectorAll('.archive-item').forEach(item => {
      if (item.querySelector('.nvc-interactions')) return;
      const record = recordFromArchiveItem(item);
      const href = item.querySelector('.archive-title')?.getAttribute('href') || '';
      const shell = createInteractionShell(record, href, 'archive');
      if (shell) item.appendChild(shell);
    });

    if (essayBody && !essayBody.querySelector('.article-support')) {
      const wrap = document.createElement('div');
      wrap.className = 'article-support';

      const prompt = document.createElement('span');
      prompt.className = 'article-support-copy';
      prompt.textContent = 'si esto movió algo de lugar';

      wrap.append(prompt, makeSupportLink('article-support-button support-cta--article'));
      essayBody.appendChild(wrap);
    }

    if (essayBody && !essayBody.querySelector('.nvc-interactions')) {
      const record = articleRecord();
      const shell = createInteractionShell(record, location.pathname, 'article');
      if (shell) essayBody.appendChild(shell);
    }

    document.addEventListener('click', event => {
      const resonance = event.target.closest('[data-toggle-resonance]');
      if (resonance) {
        const shell = resonance.closest('.nvc-interactions');
        if (shell) toggleResonance(shell);
        return;
      }

      const notes = event.target.closest('[data-open-notes]');
      if (notes) {
        const shell = notes.closest('.nvc-interactions');
        if (shell) toggleNotes(shell);
        return;
      }

      const close = event.target.closest('[data-close-notes]');
      if (close) {
        const shell = close.closest('.nvc-interactions');
        const panel = shell?.querySelector('.nvc-notes-panel');
        if (panel) panel.hidden = true;
        shell?.querySelector('[data-open-notes]')?.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('submit', event => {
      const form = event.target.closest('[data-note-form]');
      if (!form) return;
      event.preventDefault();
      const shell = form.closest('.nvc-interactions');
      if (shell) submitNote(shell, form);
    });

    loadTeaCounts();

    const records = [...document.querySelectorAll('.nvc-interactions')]
      .map(shell => normalizeRecord(shell.dataset.record))
      .filter(Boolean);
    fetchInteractionCounts(records);
  };

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

  initInteractions();
  initConsent();

})();

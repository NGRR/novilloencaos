(() => {
  const STORAGE_KEY = 'novilloencaos.quote-studio.v1';
  const sample = {
    quote: 'Una inteligencia artificial verdaderamente formativa tendría que ir contra esa corriente. Su éxito no se mediría por frecuencia de uso ni por tiempo de permanencia, sino por una variable más exigente: cuánto pensamiento independiente deja después de ser usada.',
    source: 'Después del Vacío',
    meta: 'ENSAYO / 001 / 2026',
    ratio: '4:5',
    font: 48,
    grid: true,
    marks: true,
    n: '001'
  };

  const el = {
    quoteInput: document.querySelector('#quoteInput'),
    sourceInput: document.querySelector('#sourceInput'),
    metaInput: document.querySelector('#metaInput'),
    ratioInput: document.querySelector('#ratioInput'),
    fontInput: document.querySelector('#fontInput'),
    gridInput: document.querySelector('#gridInput'),
    marksInput: document.querySelector('#marksInput'),
    fitButton: document.querySelector('#fitButton'),
    captureButton: document.querySelector('#captureButton'),
    linkButton: document.querySelector('#linkButton'),
    resetButton: document.querySelector('#resetButton'),
    quoteCard: document.querySelector('#quoteCard'),
    quoteOutput: document.querySelector('#quoteOutput'),
    sourceOutput: document.querySelector('#sourceOutput'),
    metaOutput: document.querySelector('#metaOutput'),
    ratioOutput: document.querySelector('#ratioOutput'),
    countOutput: document.querySelector('#countOutput'),
    fontOutput: document.querySelector('#fontOutput'),
    fragmentNumber: document.querySelector('#fragmentNumber')
  };

  const parseStored = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  };

  const params = new URLSearchParams(location.search);
  const stored = parseStored();
  const state = Object.assign({}, sample, stored);

  if (params.has('q')) state.quote = params.get('q') || sample.quote;
  if (params.has('source')) state.source = params.get('source') || '';
  if (params.has('meta')) state.meta = params.get('meta') || '';
  if (params.has('ratio')) state.ratio = params.get('ratio') || '4:5';
  if (params.has('n')) state.n = params.get('n') || '001';

  const ratioLabel = ratio => {
    if (ratio === '1:1') return '1080 × 1080 / 1:1';
    if (ratio === '9:16') return '1080 × 1920 / 9:16';
    return '1080 × 1350 / 4:5';
  };

  const normalizeNumber = value => {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 3);
    return (digits || '1').padStart(3, '0');
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const render = () => {
    el.quoteInput.value = state.quote;
    el.sourceInput.value = state.source;
    el.metaInput.value = state.meta;
    el.ratioInput.value = state.ratio;
    el.fontInput.value = state.font;
    el.gridInput.checked = Boolean(state.grid);
    el.marksInput.checked = Boolean(state.marks);

    el.quoteOutput.textContent = state.quote;
    el.sourceOutput.textContent = state.source;
    el.metaOutput.textContent = state.meta;
    el.quoteCard.dataset.ratio = state.ratio;
    el.quoteCard.classList.toggle('no-grid', !state.grid);
    el.quoteCard.classList.toggle('no-marks', !state.marks);
    el.quoteCard.style.setProperty('--quote-size', state.font + 'px');

    el.fontOutput.textContent = state.font;
    el.ratioOutput.textContent = ratioLabel(state.ratio);
    el.fragmentNumber.textContent = normalizeNumber(state.n);

    const clean = state.quote.trim();
    const words = clean ? clean.split(/\s+/).length : 0;
    const chars = clean.length;
    el.countOutput.textContent = 'W / ' + String(words).padStart(3, '0') + ' · C / ' + String(chars).padStart(3, '0');
    save();
  };

  const autoFit = () => {
    const length = state.quote.trim().length;
    let size = 48;
    if (state.ratio === '9:16') {
      if (length < 110) size = 58;
      else if (length < 220) size = 52;
      else if (length < 360) size = 46;
      else size = 38;
    } else if (state.ratio === '1:1') {
      if (length < 100) size = 52;
      else if (length < 190) size = 46;
      else if (length < 300) size = 39;
      else size = 32;
    } else {
      if (length < 110) size = 58;
      else if (length < 220) size = 52;
      else if (length < 340) size = 46;
      else if (length < 520) size = 39;
      else size = 33;
    }
    state.font = Math.max(30, Math.min(68, size));
    render();
  };

  const syncFromInputs = () => {
    state.quote = el.quoteInput.value;
    state.source = el.sourceInput.value;
    state.meta = el.metaInput.value;
    state.ratio = el.ratioInput.value;
    state.font = Number(el.fontInput.value);
    state.grid = el.gridInput.checked;
    state.marks = el.marksInput.checked;
    render();
  };

  [el.quoteInput, el.sourceInput, el.metaInput, el.ratioInput, el.fontInput, el.gridInput, el.marksInput]
    .forEach(input => input.addEventListener('input', syncFromInputs));

  el.quoteOutput.addEventListener('input', () => {
    state.quote = el.quoteOutput.textContent || '';
    render();
  });

  el.fitButton.addEventListener('click', autoFit);

  el.captureButton.addEventListener('click', () => {
    document.body.classList.add('capture-mode');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.body.classList.remove('capture-mode');
  });

  el.linkButton.addEventListener('click', async () => {
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('q', state.quote);
    if (state.source) url.searchParams.set('source', state.source);
    if (state.meta) url.searchParams.set('meta', state.meta);
    url.searchParams.set('ratio', state.ratio);
    url.searchParams.set('n', normalizeNumber(state.n));
    try {
      await navigator.clipboard.writeText(url.toString());
      const previous = el.linkButton.textContent;
      el.linkButton.textContent = 'enlace copiado';
      setTimeout(() => { el.linkButton.textContent = previous; }, 1200);
    } catch (_) {
      prompt('Copia este enlace:', url.toString());
    }
  });

  el.resetButton.addEventListener('click', () => {
    Object.assign(state, sample);
    render();
  });

  render();
  if (params.has('q')) autoFit();
  if (params.get('capture') === '1') document.body.classList.add('capture-mode');
})();

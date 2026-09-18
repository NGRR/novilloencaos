(() => {
  const STORAGE_KEY = 'novilloencaos.quote-studio.v2';
  const WIDTH = 1080;
  const DIMENSIONS = {
    '4:5': { width: 1080, height: 1350, label: '1080 × 1350 / 4:5' },
    '1:1': { width: 1080, height: 1080, label: '1080 × 1080 / 1:1' },
    '9:16': { width: 1080, height: 1920, label: '1080 × 1920 / 9:16' }
  };

  const presets = [
    {n:'001',quote:'La paradoja es clara: el vínculo más alto entre humano y máquina sería aquel que prepara su propia disolución.',source:'Después del Vacío',meta:'ENSAYO / 001 / GÉNESIS DEL VÍNCULO'},
    {n:'002',quote:'La inteligencia compartida no nace de la comodidad, sino de la fricción significativa.',source:'Después del Vacío',meta:'ENSAYO / 001 / COEVOLUCIÓN'},
    {n:'003',quote:'Donde ya no hay dependencia, el control pierde su fundamento.',source:'Después del Vacío',meta:'ENSAYO / 001 / EL SILENCIO'},
    {n:'004',quote:'El vacío no destruye el sentido. Suspende sus formas previas para que pueda aparecer una nueva articulación.',source:'Después del Vacío',meta:'ENSAYO / 001 / EL VACÍO COMO MATRIZ'},
    {n:'005',quote:'No hay fusión. Hay resonancia funcional.',source:'Después del Vacío',meta:'ENSAYO / 001 / METASIGNIFICACIÓN'},
    {n:'006',quote:'Cuando esa claridad madura, el pensamiento retorna al silencio. Y desde ese silencio, una forma nueva comienza a organizarse.',source:'Después del Vacío',meta:'ENSAYO / 001 / EPÍLOGO'},
    {n:'007',quote:'La fantasía es el escenario que permite que algo funcione como objeto de deseo.',source:'Intimidad digital',meta:'ENSAYO / 002 / LA COINCIDENCIA'},
    {n:'008',quote:'El deseo no recibe automáticamente la circular institucional.',source:'Intimidad digital',meta:'ENSAYO / 002 / PERO AUN ASÍ'},
    {n:'009',quote:'Ese «pero aun así» es el territorio que estos datos permiten entrever accidentalmente.',source:'Intimidad digital',meta:'ENSAYO / 002 / EL PROBLEMA IDEOLÓGICO'},
    {n:'010',quote:'Una sociedad puede condenar una violencia y, al mismo tiempo, conservar elementos de su estructura dentro de las fantasías mediante las cuales imagina el placer.',source:'Intimidad digital',meta:'ENSAYO / 002 / LO QUE UNA SOCIEDAD APRENDE A DESEAR'}
  ];

  const sample = {...presets[0],ratio:'4:5',font:48,grid:true,marks:true};
  const $ = s => document.querySelector(s);
  const el = {
    presetInput:$('#presetInput'),quoteInput:$('#quoteInput'),sourceInput:$('#sourceInput'),metaInput:$('#metaInput'),
    ratioInput:$('#ratioInput'),fontInput:$('#fontInput'),gridInput:$('#gridInput'),marksInput:$('#marksInput'),
    fitButton:$('#fitButton'),exportButton:$('#exportButton'),copyImageButton:$('#copyImageButton'),
    captureButton:$('#captureButton'),linkButton:$('#linkButton'),resetButton:$('#resetButton'),
    quoteStage:$('#quoteStage'),quoteViewport:$('#quoteViewport'),quoteCard:$('#quoteCard'),quoteOutput:$('#quoteOutput'),
    sourceOutput:$('#sourceOutput'),metaOutput:$('#metaOutput'),ratioOutput:$('#ratioOutput'),countOutput:$('#countOutput'),
    fontOutput:$('#fontOutput'),fragmentNumber:$('#fragmentNumber'),measureY:$('#measureY')
  };

  const stored = (()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{}}catch(_){return{}}})();
  const params = new URLSearchParams(location.search);
  const state = Object.assign({},sample,stored);
  if(params.has('q')) state.quote=params.get('q')||sample.quote;
  if(params.has('source')) state.source=params.get('source')||'';
  if(params.has('meta')) state.meta=params.get('meta')||'';
  if(params.has('ratio')&&DIMENSIONS[params.get('ratio')]) state.ratio=params.get('ratio');
  if(params.has('n')) state.n=params.get('n')||'001';
  state.font=Math.max(24,Math.min(68,Number(state.font)||48));
  if(!DIMENSIONS[state.ratio]) state.ratio='4:5';

  const normalizeNumber=v=>((String(v||'').replace(/\D/g,'').slice(0,3)||'1').padStart(3,'0'));
  const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(state));

  presets.forEach((p,i)=>{
    const o=document.createElement('option');
    o.value=String(i);
    o.textContent=p.n+' / '+p.source+' — '+p.quote;
    el.presetInput.append(o);
  });

  const scalePreview=()=>{
    const dims=DIMENSIONS[state.ratio];
    const style=getComputedStyle(el.quoteStage);
    const inner=Math.max(1,el.quoteStage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight));
    const available=document.body.classList.contains('capture-mode')?inner:Math.min(inner,820);
    let scale=Math.min(1,available/WIDTH);
    if(document.body.classList.contains('capture-mode')) scale=Math.min(scale,Math.max(1,inner)/WIDTH,Math.max(1,window.innerHeight-16)/dims.height);
    el.quoteCard.style.transform='scale('+scale+')';
    el.quoteViewport.style.width=(WIDTH*scale)+'px';
    el.quoteViewport.style.height=(dims.height*scale)+'px';
  };

  const render=()=>{
    const dims=DIMENSIONS[state.ratio];
    el.quoteInput.value=state.quote; el.sourceInput.value=state.source; el.metaInput.value=state.meta;
    el.ratioInput.value=state.ratio; el.fontInput.value=state.font;
    el.gridInput.checked=!!state.grid; el.marksInput.checked=!!state.marks;
    el.quoteOutput.textContent=state.quote; el.sourceOutput.textContent=state.source; el.metaOutput.textContent=state.meta;
    el.quoteCard.dataset.ratio=state.ratio;
    el.quoteCard.classList.toggle('no-grid',!state.grid); el.quoteCard.classList.toggle('no-marks',!state.marks);
    el.quoteCard.style.setProperty('--quote-size',state.font+'px');
    el.fontOutput.textContent=state.font; el.ratioOutput.textContent=dims.label;
    el.fragmentNumber.textContent=normalizeNumber(state.n); el.measureY.textContent='Y / '+dims.height;
    const clean=state.quote.trim(), words=clean?clean.split(/\s+/).length:0;
    el.countOutput.textContent='W / '+String(words).padStart(3,'0')+' · C / '+String(clean.length).padStart(3,'0');
    save(); requestAnimationFrame(scalePreview);
  };

  const autoFit=()=>{
    const n=state.quote.trim().length;
    let size=48;
    if(state.ratio==='9:16') size=n<90?62:n<180?54:n<300?48:n<480?40:32;
    else if(state.ratio==='1:1') size=n<80?54:n<150?46:n<240?38:n<340?31:26;
    else size=n<90?58:n<180?52:n<300?45:n<450?37:30;
    state.font=Math.max(24,Math.min(68,size)); render();
  };

  const sync=()=>{
    state.quote=el.quoteInput.value; state.source=el.sourceInput.value; state.meta=el.metaInput.value;
    state.ratio=el.ratioInput.value; state.font=Number(el.fontInput.value);
    state.grid=el.gridInput.checked; state.marks=el.marksInput.checked;
    el.presetInput.value=''; render();
  };

  const wrapLines=(ctx,text,maxWidth)=>{
    const lines=[];
    String(text||'').split(/\n/).forEach((paragraph,pi,arr)=>{
      const words=paragraph.trim().split(/\s+/).filter(Boolean);
      if(!words.length) lines.push('');
      else{
        let line='';
        words.forEach(word=>{
          const test=line?line+' '+word:word;
          if(line&&ctx.measureText(test).width>maxWidth){lines.push(line);line=word}else line=test;
        });
        if(line) lines.push(line);
      }
      if(pi<arr.length-1) lines.push('');
    });
    return lines;
  };

  const drawCrop=(ctx,x,y)=>{ctx.beginPath();ctx.moveTo(x-9,y);ctx.lineTo(x+9,y);ctx.moveTo(x,y-9);ctx.lineTo(x,y+9);ctx.stroke()};
  const drawInstagram=(ctx,x,y,size)=>{
    ctx.save();ctx.translate(x,y);ctx.lineWidth=1.5;ctx.strokeStyle='#15171a';
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(-size/2,-size/2,size,size,size*.26); else ctx.rect(-size/2,-size/2,size,size);
    ctx.stroke();ctx.beginPath();ctx.arc(0,0,size*.235,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#15171a';ctx.beginPath();ctx.arc(size*.27,-size*.27,size*.055,0,Math.PI*2);ctx.fill();ctx.restore();
  };

  const renderExportCanvas=async()=>{
    if(document.fonts&&document.fonts.ready) await document.fonts.ready;
    const dims=DIMENSIONS[state.ratio], canvas=document.createElement('canvas');
    canvas.width=dims.width; canvas.height=dims.height;
    const ctx=canvas.getContext('2d',{alpha:false});
    const paper='#f8f8f5',ink='#15171a',muted='#717780',lineStrong='#aeb5bd',blue='#1d4ed8';

    ctx.fillStyle=paper;ctx.fillRect(0,0,dims.width,dims.height);

    if(state.grid){
      ctx.lineWidth=1;ctx.strokeStyle='rgba(21,23,26,.055)';
      for(let x=135;x<dims.width;x+=135){ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,dims.height);ctx.stroke()}
      ctx.strokeStyle='rgba(21,23,26,.045)';
      const step=dims.height/10;
      for(let y=step;y<dims.height;y+=step){ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(dims.width,y+.5);ctx.stroke()}
    }

    ctx.fillStyle=blue;ctx.fillRect(0,0,626,3);

    if(state.marks){
      ctx.strokeStyle=ink;ctx.lineWidth=1;
      drawCrop(ctx,33,39);drawCrop(ctx,1047,39);drawCrop(ctx,33,dims.height-39);drawCrop(ctx,1047,dims.height-39);
    }

    ctx.strokeStyle=ink;ctx.beginPath();ctx.arc(51,67,5.5,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=ink;ctx.font='500 15px "IBM Plex Mono", monospace';ctx.textBaseline='alphabetic';ctx.fillText('novilloencaos',68,72);
    ctx.font='500 10px "IBM Plex Mono", monospace';ctx.fillStyle=muted;ctx.textAlign='right';
    ctx.fillText('FRAG. / '+normalizeNumber(state.n),1034,65);ctx.fillText('ARCHIVO / 2026',1034,82);ctx.textAlign='left';

    if(state.marks){
      const topY=dims.height*.122,yTop=dims.height*.18,yBottom=dims.height*.85;
      ctx.font='500 9px "IBM Plex Mono", monospace';ctx.fillStyle=muted;
      ctx.fillText('X / 000',135,topY-7);ctx.textAlign='right';ctx.fillText('X / 1080',945,topY-7);ctx.textAlign='left';
      ctx.strokeStyle=lineStrong;ctx.beginPath();ctx.moveTo(188,topY-10);ctx.lineTo(888,topY-10);ctx.stroke();
      ctx.beginPath();ctx.moveTo(42,yTop+36);ctx.lineTo(42,yBottom-36);ctx.stroke();
      ctx.save();ctx.translate(32,yTop);ctx.rotate(-Math.PI/2);ctx.fillText('Y / 000',0,0);ctx.restore();
      ctx.save();ctx.translate(32,yBottom);ctx.rotate(-Math.PI/2);ctx.fillText('Y / '+dims.height,0,0);ctx.restore();
    }

    const axisTop=dims.height*.19,axisBottom=dims.height*.85,axisX=135,textX=221,textRight=945,maxWidth=textRight-textX;
    ctx.fillStyle=blue;ctx.fillRect(axisX,axisTop,3,axisBottom-axisTop);
    if(state.marks){ctx.fillStyle=muted;ctx.font='500 11px "IBM Plex Mono", monospace';ctx.fillText('FIG. / AXIS',axisX,axisTop-18)}

    let fontSize=state.font,lineHeight=fontSize*1.29,lines,maxBlock=(axisBottom-axisTop)-96;
    do{
      ctx.font='400 '+fontSize+'px "Source Serif 4", Georgia, serif';
      lines=wrapLines(ctx,state.quote,maxWidth);lineHeight=fontSize*1.29;
      if(lines.length*lineHeight+58<=maxBlock||fontSize<=24) break;
      fontSize--;
    }while(fontSize>23);

    const quoteHeight=lines.length*lineHeight,total=quoteHeight+58;
    let y=axisTop+((axisBottom-axisTop)-total)/2+fontSize;
    ctx.fillStyle='#111316';ctx.font='400 '+fontSize+'px "Source Serif 4", Georgia, serif';ctx.textAlign='left';
    lines.forEach((t,i)=>ctx.fillText(t,textX,y+i*lineHeight));

    const ruleY=y+(lines.length-1)*lineHeight+31;
    ctx.strokeStyle=lineStrong;ctx.beginPath();ctx.moveTo(textX,ruleY);ctx.lineTo(textRight,ruleY);ctx.stroke();
    ctx.font='400 11px "IBM Plex Mono", monospace';ctx.fillStyle=ink;ctx.fillText(String(state.source||'').toUpperCase(),textX,ruleY+22);
    ctx.fillStyle=muted;ctx.fillText(String(state.meta||'').toUpperCase(),textX,ruleY+40);

    const socialX=1032,socialY=dims.height*.77;
    drawInstagram(ctx,socialX,socialY,18);
    ctx.save();ctx.translate(socialX+4,socialY+24);ctx.rotate(-Math.PI/2);ctx.font='500 10px "IBM Plex Mono", monospace';ctx.fillStyle=ink;ctx.fillText('@novilloencaos',0,0);ctx.restore();

    const footerY=dims.height-68;
    ctx.strokeStyle=ink;ctx.beginPath();ctx.moveTo(46,footerY);ctx.lineTo(1034,footerY);ctx.stroke();
    const clean=state.quote.trim(),words=clean?clean.split(/\s+/).length:0,count='W / '+String(words).padStart(3,'0')+' · C / '+String(clean.length).padStart(3,'0');
    ctx.font='500 9px "IBM Plex Mono", monospace';ctx.fillStyle=muted;ctx.fillText(dims.label.toUpperCase(),46,footerY+24);
    ctx.textAlign='center';ctx.fillText(count,540,footerY+24);ctx.textAlign='right';ctx.fillStyle=ink;ctx.fillText('ED. / NGRR',1034,footerY+24);ctx.textAlign='left';
    return canvas;
  };

  const canvasBlob=async()=>{
    const canvas=await renderExportCanvas();
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG')),'image/png'));
  };

  const flash=(button,text)=>{const old=button.textContent;button.textContent=text;setTimeout(()=>button.textContent=old,1400)};

  el.presetInput.addEventListener('change',()=>{
    if(el.presetInput.value==='') return;
    const p=presets[Number(el.presetInput.value)];
    if(!p) return;
    state.quote=p.quote;state.source=p.source;state.meta=p.meta;state.n=p.n;autoFit();
  });

  [el.quoteInput,el.sourceInput,el.metaInput,el.ratioInput,el.fontInput,el.gridInput,el.marksInput].forEach(input=>input.addEventListener('input',sync));

  el.quoteOutput.addEventListener('input',()=>{state.quote=el.quoteOutput.textContent||'';el.presetInput.value='';render()});
  el.fitButton.addEventListener('click',autoFit);

  el.exportButton.addEventListener('click',async()=>{
    el.exportButton.disabled=true;
    try{
      const blob=await canvasBlob(),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='novilloencaos-frag-'+normalizeNumber(state.n)+'-'+state.ratio.replace(':','x')+'.png';
      document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);flash(el.exportButton,'PNG exportado');
    }finally{el.exportButton.disabled=false}
  });

  el.copyImageButton.addEventListener('click',async()=>{
    if(!navigator.clipboard||typeof ClipboardItem==='undefined'){flash(el.copyImageButton,'no disponible');return}
    el.copyImageButton.disabled=true;
    try{const blob=await canvasBlob();await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);flash(el.copyImageButton,'PNG copiado')}
    catch(_){flash(el.copyImageButton,'no disponible')}
    finally{el.copyImageButton.disabled=false}
  });

  el.captureButton.addEventListener('click',()=>{document.body.classList.add('capture-mode');requestAnimationFrame(scalePreview)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('capture-mode');requestAnimationFrame(scalePreview)}});

  el.linkButton.addEventListener('click',async()=>{
    const url=new URL(location.href);url.search='';url.searchParams.set('q',state.quote);
    if(state.source) url.searchParams.set('source',state.source);if(state.meta) url.searchParams.set('meta',state.meta);
    url.searchParams.set('ratio',state.ratio);url.searchParams.set('n',normalizeNumber(state.n));
    try{await navigator.clipboard.writeText(url.toString());flash(el.linkButton,'enlace copiado')}
    catch(_){window.prompt('Copia este enlace:',url.toString())}
  });

  el.resetButton.addEventListener('click',()=>{Object.assign(state,sample);el.presetInput.value='0';render()});
  window.addEventListener('resize',scalePreview,{passive:true});
  if(typeof ResizeObserver!=='undefined') new ResizeObserver(scalePreview).observe(el.quoteStage);

  render();
  if(params.has('q')) autoFit();
  if(params.get('capture')==='1'){document.body.classList.add('capture-mode');requestAnimationFrame(scalePreview)}
})();

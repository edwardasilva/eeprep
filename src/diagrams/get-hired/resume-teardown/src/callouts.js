// Scale the letter-size sheets, then place numbered callouts with leader lines.
(async function(){
  await document.fonts.ready;
  const NS='http://www.w3.org/2000/svg';
  document.querySelectorAll('.pagewrap').forEach(w=>{
    const s=w.clientWidth/816; w.style.height=(1056*s)+'px';
    w.querySelector('.page').style.transform=`scale(${s})`;
  });
  const stage=document.getElementById('stageB'), svg=document.getElementById('leaders');
  const sr=stage.getBoundingClientRect();
  const wrap=stage.querySelector('.pagewrap').getBoundingClientRect();
  const cs=getComputedStyle(document.body), accent=cs.getPropertyValue('--accent').trim(), surface=cs.getPropertyValue('--surface').trim();
  const gw=stage.querySelector('.gut').getBoundingClientRect().width;
  const R=document.body.classList.contains('mobile')?8:9.5, MIN=2*R+5;
  const items=[...stage.querySelectorAll('[data-co]')].map(el=>{
    const r=el.getBoundingClientRect(); const side=el.dataset.side; const n=+el.dataset.co;
    let tx,ty,gap=null;
    if(el.dataset.gap){ // dimension mark for the gap above this heading
      const prev=el.previousElementSibling.getBoundingClientRect();
      const y1=prev.bottom-sr.top, y2=r.top-sr.top, x=wrap.right-sr.left-6;
      gap={x,y1,y2}; tx=x; ty=(y1+y2)/2;
    } else {
      const rects=el.getClientRects(); const f=rects[0];
      ty=f.top+f.height/2-sr.top;
      const s=wrap.width/816;
      tx= side==='l' ? wrap.left-sr.left+(el.tagName==='LI'?34:47)*s : rects[rects.length-1].right-sr.left+2;
    }
    return {n,side,tx,ty,gap,y:ty};
  });
  for(const side of ['l','r']){
    const g=items.filter(i=>i.side===side).sort((a,b)=>a.ty-b.ty);
    for(let i=1;i<g.length;i++) if(g[i].y-g[i-1].y<MIN) g[i].y=g[i-1].y+MIN;
  }
  const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);svg.appendChild(e);return e};
  for(const it of items){
    const cx= it.side==='l' ? gw/2 - 2 : sr.width-gw/2 + 2;
    if(it.gap){
      const {x,y1,y2}=it.gap;
      mk('line',{x1:x,y1:y1,x2:x,y2:y2,stroke:accent,'stroke-width':1});
      mk('line',{x1:x-3,y1:y1,x2:x+3,y2:y1,stroke:accent,'stroke-width':1});
      mk('line',{x1:x-3,y1:y2,x2:x+3,y2:y2,stroke:accent,'stroke-width':1});
    }
    const dx=it.tx-cx, dy=it.ty-it.y, d=Math.hypot(dx,dy);
    if(d>R+1){
      const sx=cx+dx/d*R, sy=it.y+dy/d*R;
      mk('line',{x1:sx,y1:sy,x2:it.tx,y2:it.ty,stroke:accent,'stroke-width':1});
      if(!it.gap) mk('circle',{cx:it.tx,cy:it.ty,r:1.6,fill:accent});
    }
    mk('circle',{cx:cx,cy:it.y,r:R,fill:surface,stroke:accent,'stroke-width':1.75});
    const t=mk('text',{x:cx,y:it.y,'text-anchor':'middle','dominant-baseline':'central',fill:accent,
      'font-family':'JetBrains Mono','font-weight':600,'font-size':R>9?11:9.5});
    t.textContent=it.n;
  }
  document.body.dataset.ready='1';
})();

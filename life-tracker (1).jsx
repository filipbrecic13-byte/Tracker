import { useState, useEffect, useCallback, useRef } from "react";

const SK="ht-d",GK="gt-d",HK="he-d",NK="nt-d",BK="bg-d",C="#13131a",B="#1e1e2a";
const td=()=>new Date().toISOString().slice(0,10);
const fD=i=>{const d=new Date(i+"T12:00:00");return{d:["So","Mo","Di","Mi","Do","Fr","Sa"][d.getDay()],n:d.getDate(),m:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"][d.getMonth()]}};
const aD=(i,n)=>{const d=new Date(i+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const gL=n=>{const a=[];for(let i=n-1;i>=0;i--)a.push(aD(td(),-i));return a};

const DH=[{id:"h1",name:"Sport / Bewegung",icon:"🏋️",color:"#e85d75"},{id:"h2",name:"Wasser trinken (2L)",icon:"💧",color:"#5b9def"},{id:"h3",name:"Lesen (20 Min)",icon:"📖",color:"#f0a050"},{id:"h4",name:"Kein Social Media vor 10h",icon:"📵",color:"#8b6def"},{id:"h5",name:"Journaling",icon:"✏️",color:"#4ecda0"}];
const ICS=["🏋️","💧","📖","✏️","📵","🧘","💤","🥗","🚶","💊","🎯","🧠","🎵","🌅","🧹","💰","📞","🍎","⏰","🚫"];
const CLS=["#e85d75","#5b9def","#f0a050","#8b6def","#4ecda0","#d4a054","#ef6d6d","#6dcfef","#a0d050","#ef8fba"];
const PRI=[{k:"high",l:"Hoch",c:"#e85d75",i:"🔴"},{k:"medium",l:"Mittel",c:"#f0a050",i:"🟡"},{k:"low",l:"Normal",c:"#5b9def",i:"🔵"}];
const MDS=[{v:1,e:"😞",l:"Schlecht"},{v:2,e:"😕",l:"Meh"},{v:3,e:"😐",l:"Okay"},{v:4,e:"😊",l:"Gut"},{v:5,e:"🤩",l:"Super"}];
const ENG=[{v:1,l:"Leer",c:"#e85d75"},{v:2,l:"Müde",c:"#ef8f6d"},{v:3,l:"Okay",c:"#f0a050"},{v:4,l:"Fit",c:"#a0d050"},{v:5,l:"Voll da",c:"#4ecda0"}];
const BDS=[{id:"s7",n:"7-Tage Streak",i:"🔥",d:"Habit 7 Tage am Stück",c:"#f0a050"},{id:"s30",n:"30-Tage Streak",i:"🌟",d:"Habit 30 Tage am Stück",c:"#a78bfa"},{id:"pw",n:"Perfekte Woche",i:"💎",d:"7 Tage alle Habits",c:"#4ecda0"},{id:"pd",n:"Perfekter Tag",i:"⭐",d:"Alle Habits + Ziele",c:"#f0a050"},{id:"hw",n:"Health Freak",i:"💚",d:"7 Tage Health getrackt",c:"#4ecda0"},{id:"g10",n:"Zielstrebig",i:"🎯",d:"10 Ziele erreicht",c:"#5b9def"},{id:"g50",n:"Unstoppable",i:"🚀",d:"50 Ziele erreicht",c:"#e85d75"},{id:"fn",n:"Tagebuch",i:"📝",d:"Erste Notiz",c:"#f0a050"},{id:"w7",n:"Gewichts-Log",i:"⚖️",d:"7x Gewicht getrackt",c:"#8b6def"}];
const HF=["water","sleep","steps","mood","energy"];

const Btn=({children,on,color,style:s,...p})=><button {...p} style={{border:`1px solid ${on?color||"#e85d75":"#222"}`,background:on?(color||"#e85d75")+"18":"#0c0c10",color:on?color||"#e85d75":"#555",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit",borderRadius:10,padding:"8px 0",transition:"all 0.15s",...s}}>{children}</button>;

export default function App(){
  const[t,sT]=useState("dashboard"),[hb,sHb]=useState(DH),[cp,sCp]=useState({}),[gl,sGl]=useState({}),[he,sHe]=useState({}),[nt,sNt]=useState({}),[bg,sBg]=useState({}),[sel,sSel]=useState(td()),[sa,sSa]=useState(false),[nn,sNn]=useState(""),[ni,sNi]=useState("🎯"),[nc,sNc]=useState("#e85d75"),[ei,sEi]=useState(null),[eh,sEh]=useState(null),[ng,sNg]=useState(""),[np,sNp]=useState("medium"),[sag,sSag]=useState(false),[ld,sLd]=useState(false),[nb,sNb]=useState(null),[wi,sWi]=useState("");
  const br=useRef(bg);br.current=bg;

  useEffect(()=>{(async()=>{
    try{const r=await window.storage.get(SK);if(r?.value){const d=JSON.parse(r.value);if(d.habits)sHb(d.habits);if(d.completions)sCp(d.completions);}}catch{}
    try{const r=await window.storage.get(GK);if(r?.value)sGl(JSON.parse(r.value));}catch{}
    try{const r=await window.storage.get(HK);if(r?.value)sHe(JSON.parse(r.value));}catch{}
    try{const r=await window.storage.get(NK);if(r?.value)sNt(JSON.parse(r.value));}catch{}
    try{const r=await window.storage.get(BK);if(r?.value)sBg(JSON.parse(r.value));}catch{}
    sLd(true);
  })();},[]);

  const sv=useCallback(async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}},[]);
  useEffect(()=>{if(ld)sv(SK,{habits:hb,completions:cp});},[hb,cp,ld,sv]);
  useEffect(()=>{if(ld)sv(GK,gl);},[gl,ld,sv]);
  useEffect(()=>{if(ld)sv(HK,he);},[he,ld,sv]);
  useEffect(()=>{if(ld)sv(NK,nt);},[nt,ld,sv]);
  useEffect(()=>{if(ld)sv(BK,bg);},[bg,ld,sv]);

  const gS=id=>{let s=0,d=td();if(!cp[`${d}:${id}`])d=aD(d,-1);while(cp[`${d}:${id}`]){s++;d=aD(d,-1);}return s;};
  const ab=id=>{if(br.current[id])return;sBg(p=>p[id]?p:{...p,[id]:Date.now()});const df=BDS.find(b=>b.id===id);if(df)sNb(df);setTimeout(()=>sNb(null),3000);};

  useEffect(()=>{
    if(!ld)return;
    hb.forEach(h=>{const s=gS(h.id);if(s>=7)ab("s7");if(s>=30)ab("s30");});
    const l7=gL(7);if(hb.length>0&&l7.every(d=>hb.every(h=>cp[`${d}:${h.id}`])))ab("pw");
    if(hb.length>0&&hb.every(h=>cp[`${td()}:${h.id}`])){const tg=gl[td()]||[];if(tg.length>0&&tg.every(g=>g.done))ab("pd");}
    if(l7.every(d=>HF.every(f=>he[d]?.[f]!==undefined)))ab("hw");
    const td2=Object.values(gl).flat().filter(g=>g.done).length;
    if(td2>=10)ab("g10");if(td2>=50)ab("g50");
    if(Object.values(nt).some(n=>n?.trim()))ab("fn");
    if(Object.keys(he).filter(d=>he[d]?.weight!==undefined).length>=7)ab("w7");
  },[cp,gl,he,nt,hb,ld]);

  const togH=id=>sCp(p=>{const k=`${sel}:${id}`,n={...p};n[k]?delete n[k]:n[k]=true;return n;});
  const addH=()=>{if(!nn.trim())return;sHb(p=>[...p,{id:"h"+Date.now(),name:nn.trim(),icon:ni,color:nc}]);sNn("");sNi("🎯");sNc("#e85d75");sSa(false);};
  const delH=id=>{sHb(p=>p.filter(h=>h.id!==id));sCp(p=>{const n={...p};Object.keys(n).forEach(k=>{if(k.endsWith(`:${id}`))delete n[k]});return n;});sEi(null);sEh(null);};
  const svEh=()=>{if(!eh)return;sHb(p=>p.map(h=>h.id===eh.id?eh:h));sEh(null);sEi(null);};

  const dG=gl[sel]||[];
  const addG=()=>{if(!ng.trim())return;sGl(p=>({...p,[sel]:[...(p[sel]||[]),{id:"g"+Date.now(),text:ng.trim(),priority:np,done:false}]}));sNg("");sNp("medium");sSag(false);};
  const togG=id=>sGl(p=>({...p,[sel]:(p[sel]||[]).map(g=>g.id===id?{...g,done:!g.done}:g)}));
  const delG=id=>{sGl(p=>({...p,[sel]:(p[sel]||[]).filter(g=>g.id!==id)}));sEi(null);};
  const srtG=[...dG].sort((a,b)=>{if(a.done!==b.done)return a.done?1:-1;return({high:0,medium:1,low:2})[a.priority]-({high:0,medium:1,low:2})[b.priority];});

  const dH=he[sel]||{};
  const uH=(f,v)=>sHe(p=>({...p,[sel]:{...(p[sel]||{}),[f]:v}}));
  const svW=()=>{const w=parseFloat(wi);if(!isNaN(w)&&w>0&&w<500){uH("weight",w);sWi("");}};

  const wk=[];for(let i=-3;i<=3;i++)wk.push(aD(sel,i));
  const cH=hb.filter(h=>cp[`${sel}:${h.id}`]).length;
  const hP=hb.length>0?cH/hb.length:0;
  const cG=dG.filter(g=>g.done).length;
  const gP=dG.length>0?cG/dG.length:0;
  const fHc=HF.filter(f=>dH[f]!==undefined).length;
  const tc={dashboard:"#a78bfa",habits:"#e85d75",goals:"#f0a050",health:"#4ecda0"};
  const ac=tc[t];

  const l7=gL(7),l30=gL(30),p7=[];for(let i=13;i>=7;i--)p7.push(aD(td(),-i));
  const whr=l7.reduce((s,d)=>s+hb.filter(h=>cp[`${d}:${h.id}`]).length,0)/Math.max(1,l7.length*hb.length)*100;
  const pwhr=p7.reduce((s,d)=>s+hb.filter(h=>cp[`${d}:${h.id}`]).length,0)/Math.max(1,p7.length*hb.length)*100;
  const wgd=l7.reduce((s,d)=>s+(gl[d]||[]).filter(g=>g.done).length,0);
  const wgt=l7.reduce((s,d)=>s+(gl[d]||[]).length,0);
  const pgd=p7.reduce((s,d)=>s+(gl[d]||[]).filter(g=>g.done).length,0);
  const avg=(f,ds)=>{const v=ds.map(d=>he[d]?.[f]).filter(x=>x!==undefined);return v.length?v.reduce((a,b)=>a+Number(b),0)/v.length:null;};
  const as7=avg("sleep",l7),asp=avg("sleep",p7),am7=avg("mood",l7),amp=avg("mood",p7),aw7=avg("water",l7),ae7=avg("energy",l7);
  const stks=hb.map(h=>({...h,streak:gS(h.id)})).sort((a,b)=>b.streak-a.streak);
  const heat=l30.map(d=>{const hd=hb.filter(h=>cp[`${d}:${h.id}`]).length;const gd=(gl[d]||[]).filter(g=>g.done).length;const gt=(gl[d]||[]).length;const hf=HF.filter(f=>he[d]?.[f]!==undefined).length;return{date:d,score:(hb.length>0?hd/hb.length:0)*0.4+(gt>0?gd/gt:0)*0.3+(hf/5)*0.3};});
  const perfD=l30.filter(d=>hb.length>0&&hb.every(h=>cp[`${d}:${h.id}`])&&(gl[d]||[]).length>0&&(gl[d]||[]).every(g=>g.done)).length;
  const wD=l30.map(d=>({d,v:he[d]?.weight??null})).filter(x=>x.v!==null);
  const dl=(v,g="up")=>{if(v==null||isNaN(v))return null;const u=v>0,dn=v<0;return{a:u?"↑":dn?"↓":"→",c:(g==="up"?u:dn)?"#4ecda0":(u||dn)?"#e85d75":"#555",t:Math.abs(v)<1?Math.abs(v).toFixed(1):Math.round(Math.abs(v))}};

  if(!ld)return<div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#0c0c10",color:"#666",fontFamily:"Outfit"}}>Laden...</div>;

  const Card=({children,style:s,...p})=><div style={{background:C,borderRadius:16,border:`1px solid ${B}`,padding:"18px 20px",marginBottom:10,...s}} {...p}>{children}</div>;
  const inp={width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid #2a2a38",background:"#0c0c10",color:"#e8e6f0",fontSize:15,fontFamily:"Outfit",outline:"none",marginBottom:14,boxSizing:"border-box"};

  return(
    <div style={{minHeight:"100vh",background:"#0c0c10",color:"#e8e6f0",fontFamily:"'Outfit',sans-serif",padding:"0 0 100px",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes sD{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes fI{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}@keyframes bP{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}25%{transform:translate(-50%,-50%) scale(1)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(.8)}}input::placeholder,textarea::placeholder{color:#444}`}</style>

      {nb&&<div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:999,background:"#1a1a2e",border:`2px solid ${nb.c}`,borderRadius:20,padding:"28px 36px",textAlign:"center",animation:"bP 3s ease forwards",boxShadow:`0 0 60px ${nb.c}44`}}><div style={{fontSize:48,marginBottom:8}}>{nb.i}</div><div style={{fontSize:11,color:nb.c,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>NEUES BADGE</div><div style={{fontSize:18,fontWeight:800}}>{nb.n}</div><div style={{fontSize:13,color:"#666",marginTop:4}}>{nb.d}</div></div>}

      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,color:"#555",fontWeight:500,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>{sel===td()?"Heute":fD(sel).d+", "+fD(sel).n+" "+fD(sel).m}</div>
            <h1 style={{fontSize:28,fontWeight:800,margin:0,letterSpacing:-.5}}>{t==="dashboard"?"Dashboard":t==="habits"?"Gewohnheiten":t==="goals"?"Tagesziele":"Health"}</h1>
          </div>
          {(t==="habits"||t==="goals")&&<button onClick={()=>t==="habits"?sSa(!sa):sSag(!sag)} style={{width:44,height:44,borderRadius:14,border:"1px solid #222",background:(t==="habits"?sa:sag)?ac:"#161620",color:(t==="habits"?sa:sag)?"#fff":"#888",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{(t==="habits"?sa:sag)?"×":"+"}</button>}
        </div>
        <div style={{display:"flex",gap:3,marginTop:20,background:C,borderRadius:14,padding:4,border:`1px solid ${B}`}}>
          {[["dashboard","📊"],["habits","🔄"],["goals","🎯"],["health","❤️"]].map(([k,l])=><button key={k} onClick={()=>{sT(k);sSa(false);sSag(false);sEi(null);sEh(null);}} style={{flex:1,padding:"10px 0",borderRadius:11,border:"none",cursor:"pointer",background:t===k?"#1e1e2e":"transparent",color:t===k?"#fff":"#555",fontSize:16,fontWeight:t===k?700:500,fontFamily:"Outfit"}}>{l}</button>)}
        </div>
        {t!=="dashboard"&&<div style={{display:"flex",alignItems:"center",gap:16,marginTop:16,padding:"16px 20px",background:C,borderRadius:16,border:`1px solid ${B}`}}>
          <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke={B} strokeWidth="4"/><circle cx="28" cy="28" r="24" fill="none" stroke={ac} strokeWidth="4" strokeDasharray={`${(t==="habits"?hP:t==="goals"?gP:fHc/5)*150.8} 150.8`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{transition:"stroke-dasharray .4s"}}/><text x="28" y="32" textAnchor="middle" fill="#e8e6f0" fontSize="15" fontWeight="700" fontFamily="Outfit">{t==="habits"?`${cH}/${hb.length}`:t==="goals"?`${cG}/${dG.length}`:`${fHc}/5`}</text></svg>
          <div><div style={{fontSize:16,fontWeight:600}}>{t==="habits"?(hP===1?"Alles geschafft! 🔥":hP>=.5?"Guter Fortschritt!":"Los geht's!"):t==="goals"?(dG.length===0?"Keine Ziele":gP===1?"Alle erreicht! ⭐":"Fokus!"):(fHc===5?"Alles getrackt! 💚":fHc>0?"Weiter eintragen...":"Wie geht's dir?")}</div><div style={{fontSize:13,color:"#555",marginTop:2}}>{t==="habits"?`${cH} von ${hb.length}`:t==="goals"?`${cG} von ${dG.length}`:`${fHc} von 5 Werte`}</div></div>
        </div>}
      </div>

      {t!=="dashboard"&&<div style={{display:"flex",gap:6,padding:"20px 24px 8px",justifyContent:"space-between"}}>
        {wk.map(d=>{const f=fD(d),isS=d===sel,isT=d===td(),dHb=hb.filter(h=>cp[`${d}:${h.id}`]).length,dGl=gl[d]||[],hFl=HF.filter(f2=>he[d]?.[f2]!==undefined).length;
          const dot=t==="habits"?(dHb===hb.length&&hb.length>0?"#4ecda0":dHb>0?"#f0a050":"#222"):t==="goals"?(dGl.length>0&&dGl.every(g=>g.done)?"#4ecda0":dGl.some(g=>g.done)?"#f0a050":dGl.length>0?"#e85d75":"#222"):(hFl===5?"#4ecda0":hFl>0?"#f0a050":"#222");
          return<button key={d} onClick={()=>sSel(d)} style={{flex:1,padding:"10px 0",borderRadius:14,border:"none",cursor:"pointer",background:isS?"#1e1e2e":"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontSize:11,color:isT?ac:"#555",fontWeight:600,fontFamily:"Outfit"}}>{f.d}</span>
            <span style={{fontSize:16,fontWeight:isS?700:500,fontFamily:"Outfit",color:isS?"#fff":"#666",width:32,height:32,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:isS?ac:"transparent"}}>{f.n}</span>
            <div style={{width:5,height:5,borderRadius:"50%",background:dot}}/>
          </button>})}
      </div>}

      {/* DASHBOARD */}
      {t==="dashboard"&&<div style={{padding:"20px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[{l:"Habits heute",v:`${cH}/${hb.length}`,s:`${Math.round(hP*100)}%`,c:"#e85d75",i:"🔄"},{l:"Ziele heute",v:`${cG}/${dG.length}`,s:dG.length>0?`${Math.round(gP*100)}%`:"–",c:"#f0a050",i:"🎯"},{l:"Perfekte Tage",v:perfD,s:"letzte 30 Tage",c:"#a78bfa",i:"⭐"},{l:"Badges",v:`${Object.keys(bg).length}/${BDS.length}`,s:"freigeschaltet",c:"#4ecda0",i:"🏆"}].map((x,i)=><Card key={i} style={{padding:"18px 16px"}}><div style={{fontSize:12,color:"#555",fontWeight:500,marginBottom:8}}>{x.i} {x.l}</div><div style={{fontSize:28,fontWeight:800,color:x.c,lineHeight:1}}>{x.v}</div><div style={{fontSize:12,color:"#444",marginTop:4}}>{x.s}</div></Card>)}
        </div>
        <Card>
          <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>📈 Woche im Überblick</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[{l:"Habit-Quote",v:`${Math.round(whr)}%`,d:dl(whr-pwhr),bc:"#e85d75",bw:whr},{l:"Ziele erledigt",v:<>{wgd}<span style={{fontSize:14,color:"#555"}}>/{wgt}</span></>,d:dl(wgd-pgd)},{l:"⌀ Schlaf",v:<>{as7!==null?as7.toFixed(1):"–"}<span style={{fontSize:14,color:"#555"}}>h</span></>,d:dl(as7&&asp?as7-asp:null)},{l:"⌀ Stimmung",v:<>{am7!==null?MDS.find(m=>m.v===Math.round(am7))?.e||"–":"–"}<span style={{fontSize:14,color:"#555",marginLeft:4}}>{am7!==null?am7.toFixed(1):""}</span></>,d:dl(am7&&amp?am7-amp:null)},{l:"⌀ Wasser",v:<>{aw7!==null?aw7.toFixed(1):"–"}<span style={{fontSize:14,color:"#555"}}> Gl.</span></>},{l:"⌀ Energie",v:<>{ae7!==null?ENG.find(e=>e.v===Math.round(ae7))?.l||"–":"–"}</>}].map((x,i)=><div key={i}><div style={{fontSize:11,color:"#555",fontWeight:500,marginBottom:4}}>{x.l}</div><div style={{display:"flex",alignItems:"baseline",gap:6}}><div style={{fontSize:24,fontWeight:800,color:x.bc||"#e8e6f0"}}>{x.v}</div>{x.d&&<span style={{fontSize:13,fontWeight:700,color:x.d.c}}>{x.d.a}{x.d.t}</span>}</div>{x.bw!==undefined&&<div style={{width:"100%",height:4,background:B,borderRadius:2,marginTop:6}}><div style={{width:`${x.bw}%`,height:"100%",background:x.bc,borderRadius:2}}/></div>}</div>)}
          </div>
        </Card>
        <Card><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🔥 Streak Ranking</div>
          {stks.map((h,i)=><div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<stks.length-1?`1px solid ${B}`:"none"}}><div style={{width:28,fontSize:18,textAlign:"center",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span style={{fontSize:13,color:"#444"}}>{i+1}</span>}</div><span style={{fontSize:16}}>{h.icon}</span><div style={{flex:1,fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div><div style={{fontSize:16,fontWeight:800,color:h.streak>0?h.color:"#333"}}>{h.streak>0?`${h.streak}d`:"–"}</div></div>)}
        </Card>
        <Card><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🏆 Badges</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{BDS.map(b=>{const u=!!bg[b.id];return<div key={b.id} style={{textAlign:"center",padding:"14px 6px",borderRadius:12,background:u?`${b.c}12`:"#0c0c10",border:`1px solid ${u?b.c+"44":"#1a1a24"}`,opacity:u?1:.35}}><div style={{fontSize:28,filter:u?"none":"grayscale(1)"}}>{b.i}</div><div style={{fontSize:10,fontWeight:600,marginTop:4,color:u?b.c:"#444",fontFamily:"Outfit"}}>{b.n}</div></div>})}</div>
        </Card>
        <Card><div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🗓️ 30-Tage</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>{heat.map((d,i)=>{const f=fD(d.date),isT=d.date===td(),op=d.score>0?.25+d.score*.75:.08;return<div key={i} style={{aspectRatio:"1",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:d.score>.7?`rgba(78,205,160,${op})`:d.score>.3?`rgba(240,160,80,${op})`:d.score>0?`rgba(232,93,117,${op})`:"#141420",border:isT?"2px solid #a78bfa":"1px solid transparent",fontSize:10,color:isT?"#fff":"#444",fontWeight:isT?700:400,fontFamily:"Outfit"}}>{f.n}</div>})}</div>
        </Card>
        {wD.length>0&&<Card><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>⚖️ Gewicht</div><div style={{fontSize:12,color:"#555",marginBottom:14}}>Aktuell: <span style={{color:"#e8e6f0",fontWeight:700}}>{wD[wD.length-1].v} kg</span></div>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",height:48}}>{wD.slice(-14).map((d,i)=>{const mn=Math.min(...wD.slice(-14).map(x=>x.v)),mx=Math.max(...wD.slice(-14).map(x=>x.v)),r=mx-mn||1;return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{width:"100%",borderRadius:3,height:Math.max(6,((d.v-mn)/r)*48),background:"#8b6def",opacity:.7}}/><span style={{fontSize:8,color:"#444"}}>{fD(d.d).n}</span></div>})}</div>
        </Card>}
        <Card><div style={{fontSize:15,fontWeight:700,marginBottom:16}}>📊 Health Trends</div>
          {[{f:"water",l:"Wasser",mx:8,c:"#5b9def"},{f:"sleep",l:"Schlaf",mx:10,c:"#8b6def"},{f:"mood",l:"Stimmung",mx:5,c:"#f0a050"},{f:"energy",l:"Energie",mx:5,c:"#4ecda0"}].map(m=><div key={m.f} style={{marginBottom:14}}><div style={{fontSize:12,color:"#555",fontWeight:500,marginBottom:6}}>{m.l}</div><div style={{display:"flex",gap:4,alignItems:"flex-end",height:32}}>{l7.map((d,i)=>{const v=he[d]?.[m.f]??null,pct=v!==null?(Number(v)/m.mx)*100:0;return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:"100%",borderRadius:4,height:v!==null?Math.max(4,pct*.32):4,background:v!==null?m.c:B,opacity:v!==null?.8:.3}}/><span style={{fontSize:9,color:"#444",fontFamily:"Outfit"}}>{fD(d).d}</span></div>})}</div></div>)}
        </Card>
      </div>}

      {/* HABITS */}
      {t==="habits"&&<div>
        {sa&&<div style={{margin:"12px 24px",padding:20,background:C,borderRadius:16,border:`1px solid ${B}`,animation:"sD .2s ease"}}>
          <input value={nn} onChange={e=>sNn(e.target.value)} placeholder="Gewohnheit benennen..." onKeyDown={e=>e.key==="Enter"&&addH()} style={inp}/>
          <div style={{fontSize:12,color:"#555",marginBottom:8,fontWeight:600}}>ICON</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{ICS.map(ic=><button key={ic} onClick={()=>sNi(ic)} style={{width:36,height:36,borderRadius:10,border:ic===ni?"2px solid #e85d75":"1px solid #222",background:ic===ni?"rgba(232,93,117,.12)":"#0c0c10",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</button>)}</div>
          <div style={{fontSize:12,color:"#555",marginBottom:8,fontWeight:600}}>FARBE</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>{CLS.map(c=><button key={c} onClick={()=>sNc(c)} style={{width:28,height:28,borderRadius:8,border:c===nc?"2px solid #fff":"2px solid transparent",background:c,cursor:"pointer",transform:c===nc?"scale(1.15)":"scale(1)"}}/>)}</div>
          <button onClick={addH} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",background:nn.trim()?"#e85d75":"#2a2a38",color:nn.trim()?"#fff":"#555",fontSize:15,fontWeight:600,cursor:nn.trim()?"pointer":"default",fontFamily:"Outfit"}}>Hinzufügen</button>
        </div>}
        {eh&&<div style={{margin:"12px 24px",padding:20,background:C,borderRadius:16,border:`1px solid ${eh.color}44`,animation:"sD .2s ease"}}>
          <div style={{fontSize:12,color:"#555",marginBottom:8,fontWeight:600}}>BEARBEITEN</div>
          <input value={eh.name} onChange={e=>sEh({...eh,name:e.target.value})} style={inp}/>
          <div style={{fontSize:12,color:"#555",marginBottom:8,fontWeight:600}}>ICON</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{ICS.map(ic=><button key={ic} onClick={()=>sEh({...eh,icon:ic})} style={{width:36,height:36,borderRadius:10,border:ic===eh.icon?"2px solid #e85d75":"1px solid #222",background:ic===eh.icon?"rgba(232,93,117,.12)":"#0c0c10",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</button>)}</div>
          <div style={{fontSize:12,color:"#555",marginBottom:8,fontWeight:600}}>FARBE</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>{CLS.map(c=><button key={c} onClick={()=>sEh({...eh,color:c})} style={{width:28,height:28,borderRadius:8,border:c===eh.color?"2px solid #fff":"2px solid transparent",background:c,cursor:"pointer",transform:c===eh.color?"scale(1.15)":"scale(1)"}}/>)}</div>
          <div style={{display:"flex",gap:8}}><button onClick={svEh} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",background:"#4ecda0",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Outfit"}}>Speichern</button><button onClick={()=>{sEh(null);sEi(null);}} style={{padding:"12px 18px",borderRadius:12,border:"1px solid #2a2a38",background:"transparent",color:"#888",fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"Outfit"}}>Abb.</button></div>
        </div>}
        <div style={{padding:"8px 24px"}}>{hb.map((h,i)=>{const done=!!cp[`${sel}:${h.id}`],str=gS(h.id),isE=ei===h.id;
          return<div key={h.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",marginBottom:8,background:done?`${h.color}0D`:C,borderRadius:16,border:`1px solid ${done?h.color+"33":B}`,animation:`fI .3s ease ${i*.05}s both`}}>
            <button onClick={()=>togH(h.id)} style={{width:42,height:42,borderRadius:13,border:`2px solid ${done?h.color:"#2a2a38"}`,background:done?h.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,fontSize:20,color:"#fff"}}>{done?"✓":<span style={{fontSize:18}}>{h.icon}</span>}</button>
            <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(isE)sEi(null);else{sEi(h.id);sEh(null);}}}><div style={{fontSize:15,fontWeight:600,textDecoration:done?"line-through":"none",opacity:done?.6:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div>{str>0&&<div style={{fontSize:12,color:h.color,fontWeight:600,marginTop:2}}>🔥 {str} {str===1?"Tag":"Tage"}</div>}</div>
            {isE&&!eh&&<div style={{display:"flex",gap:6}}><button onClick={e=>{e.stopPropagation();sEh({...h});}} style={{padding:"6px 12px",borderRadius:10,border:"1px solid #2a2a38",background:"#1a1a2e",color:"#a78bfa",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit"}}>✏️</button><button onClick={e=>{e.stopPropagation();delH(h.id);}} style={{padding:"6px 12px",borderRadius:10,border:"1px solid #3a1a1a",background:"#2a1015",color:"#ef6d6d",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit"}}>🗑️</button></div>}
          </div>})}
          {hb.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:"#444"}}><div style={{fontSize:40,marginBottom:12}}>🔄</div><div style={{fontSize:15}}>Keine Gewohnheiten</div></div>}
        </div>
      </div>}

      {/* GOALS */}
      {t==="goals"&&<div>
        {sag&&<div style={{margin:"12px 24px",padding:20,background:C,borderRadius:16,border:`1px solid ${B}`,animation:"sD .2s ease"}}>
          <input value={ng} onChange={e=>sNg(e.target.value)} placeholder="Was willst du heute schaffen?" onKeyDown={e=>e.key==="Enter"&&addG()} style={inp}/>
          <div style={{fontSize:12,color:"#555",marginBottom:8,fontWeight:600}}>PRIORITÄT</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>{PRI.map(p=><Btn key={p.k} on={np===p.k} color={p.c} onClick={()=>sNp(p.k)} style={{flex:1}}>{p.i} {p.l}</Btn>)}</div>
          <button onClick={addG} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",background:ng.trim()?"#f0a050":"#2a2a38",color:ng.trim()?"#fff":"#555",fontSize:15,fontWeight:600,cursor:ng.trim()?"pointer":"default",fontFamily:"Outfit"}}>Ziel hinzufügen</button>
        </div>}
        <div style={{padding:"8px 24px"}}>{srtG.map((g,i)=>{const p=PRI.find(x=>x.k===g.priority),isE=ei===g.id;
          return<div key={g.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",marginBottom:8,background:g.done?`${p.c}0D`:C,borderRadius:16,border:`1px solid ${g.done?p.c+"33":B}`,animation:`fI .3s ease ${i*.05}s both`}}>
            <button onClick={()=>togG(g.id)} style={{width:42,height:42,borderRadius:13,border:`2px solid ${g.done?p.c:"#2a2a38"}`,background:g.done?p.c:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,fontSize:18,color:"#fff"}}>{g.done?"✓":p.i}</button>
            <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>sEi(isE?null:g.id)}><div style={{fontSize:15,fontWeight:600,textDecoration:g.done?"line-through":"none",opacity:g.done?.5:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.text}</div><div style={{fontSize:12,color:p.c,fontWeight:500,marginTop:2,opacity:.7}}>{p.l}</div></div>
            {isE&&<button onClick={e=>{e.stopPropagation();delG(g.id);}} style={{padding:"6px 14px",borderRadius:10,border:"1px solid #3a1a1a",background:"#2a1015",color:"#ef6d6d",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit"}}>Löschen</button>}
          </div>})}
          {dG.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:"#444"}}><div style={{fontSize:40,marginBottom:12}}>🎯</div><div style={{fontSize:15}}>Keine Ziele für {sel===td()?"heute":"diesen Tag"}</div></div>}
        </div>
      </div>}

      {/* HEALTH */}
      {t==="health"&&<div style={{padding:"12px 24px"}}>
        <Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:600}}>💧 Wasser</div><div style={{fontSize:22,fontWeight:800,color:"#5b9def"}}>{dH.water||0}<span style={{fontSize:13,fontWeight:500,color:"#555"}}> / 8</span></div></div><div style={{display:"flex",gap:6}}>{[1,2,3,4,5,6,7,8].map(g=><button key={g} onClick={()=>uH("water",g===dH.water?g-1:g)} style={{flex:1,height:36,borderRadius:8,border:"none",cursor:"pointer",background:g<=(dH.water||0)?"#5b9def":"#1e1e2a",opacity:g<=(dH.water||0)?1:.4}}/>)}</div></Card>
        <Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:600}}>😴 Schlaf</div><div style={{fontSize:22,fontWeight:800,color:"#8b6def"}}>{dH.sleep||"–"}<span style={{fontSize:13,fontWeight:500,color:"#555"}}> Std</span></div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10].map(h=><button key={h} onClick={()=>uH("sleep",h===dH.sleep?undefined:h)} style={{padding:"8px 0",borderRadius:8,border:`1px solid ${dH.sleep===h?"#8b6def":"#222"}`,background:dH.sleep===h?"rgba(139,109,239,.15)":"#0c0c10",color:dH.sleep===h?"#8b6def":"#555",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit",width:"calc(25% - 5px)"}}>{h}h</button>)}</div></Card>
        <Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:600}}>🚶 Schritte</div><div style={{fontSize:22,fontWeight:800,color:"#f0a050"}}>{dH.steps?dH.steps.toLocaleString("de"):"–"}</div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[2000,4000,6000,8000,10000,12000,15000].map(s=><button key={s} onClick={()=>uH("steps",s===dH.steps?undefined:s)} style={{padding:"8px 0",borderRadius:8,border:`1px solid ${dH.steps===s?"#f0a050":"#222"}`,background:dH.steps===s?"rgba(240,160,80,.15)":"#0c0c10",color:dH.steps===s?"#f0a050":"#555",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit",flex:1,minWidth:"calc(25% - 5px)"}}>{(s/1000).toFixed(0)}k</button>)}</div></Card>
        <Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:600}}>⚖️ Gewicht</div><div style={{fontSize:22,fontWeight:800,color:"#8b6def"}}>{dH.weight?dH.weight.toFixed(1):"–"}<span style={{fontSize:13,fontWeight:500,color:"#555"}}> kg</span></div></div><div style={{display:"flex",gap:8}}><input value={wi} onChange={e=>sWi(e.target.value)} placeholder="z.B. 75.5" type="number" step="0.1" onKeyDown={e=>e.key==="Enter"&&svW()} style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1px solid #2a2a38",background:"#0c0c10",color:"#e8e6f0",fontSize:15,fontFamily:"Outfit",outline:"none",boxSizing:"border-box"}}/><button onClick={svW} style={{padding:"10px 20px",borderRadius:10,border:"none",background:wi?"#8b6def":"#2a2a38",color:wi?"#fff":"#555",fontWeight:600,cursor:wi?"pointer":"default",fontFamily:"Outfit",fontSize:14}}>OK</button></div></Card>
        <Card><div style={{fontSize:15,fontWeight:600,marginBottom:14}}>🧠 Stimmung</div><div style={{display:"flex",gap:8}}>{MDS.map(m=><button key={m.v} onClick={()=>uH("mood",m.v===dH.mood?undefined:m.v)} style={{flex:1,padding:"12px 0",borderRadius:12,border:`1px solid ${dH.mood===m.v?"#f0a050":"#222"}`,background:dH.mood===m.v?"rgba(240,160,80,.12)":"#0c0c10",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{fontSize:24,filter:dH.mood===m.v?"none":"grayscale(1)"}}>{m.e}</span><span style={{fontSize:10,color:dH.mood===m.v?"#f0a050":"#444",fontWeight:600,fontFamily:"Outfit"}}>{m.l}</span></button>)}</div></Card>
        <Card><div style={{fontSize:15,fontWeight:600,marginBottom:14}}>⚡ Energielevel</div><div style={{display:"flex",gap:6}}>{ENG.map(e=><button key={e.v} onClick={()=>uH("energy",e.v===dH.energy?undefined:e.v)} style={{flex:1,padding:"14px 0",borderRadius:12,border:`1px solid ${dH.energy===e.v?e.c:"#222"}`,background:dH.energy===e.v?e.c+"20":"#0c0c10",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:dH.energy>=e.v?e.c:"#333"}}/><span style={{fontSize:10,color:dH.energy===e.v?e.c:"#444",fontWeight:600,fontFamily:"Outfit"}}>{e.l}</span></button>)}</div></Card>
      </div>}

      {/* NOTES */}
      {t!=="dashboard"&&<div style={{padding:"8px 24px 0"}}><Card><div style={{fontSize:15,fontWeight:600,marginBottom:10}}>📝 Tagesnotiz</div><textarea value={nt[sel]||""} onChange={e=>sNt(p=>({...p,[sel]:e.target.value}))} placeholder="Gedanken, Learnings, Reflexionen..." style={{width:"100%",minHeight:70,padding:"12px 14px",borderRadius:12,border:"1px solid #2a2a38",background:"#0c0c10",color:"#e8e6f0",fontSize:14,fontFamily:"Outfit",outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.5}}/></Card></div>}

      {t!=="dashboard"&&<div style={{display:"flex",justifyContent:"center",gap:12,padding:"20px 24px",flexWrap:"wrap"}}>
        <button onClick={()=>sSel(aD(sel,-7))} style={{padding:"10px 18px",borderRadius:12,border:`1px solid ${B}`,background:C,color:"#888",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"Outfit"}}>← Vorher</button>
        {sel!==td()&&<button onClick={()=>sSel(td())} style={{padding:"10px 18px",borderRadius:12,border:"none",background:ac,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit"}}>Heute</button>}
        <button onClick={()=>sSel(aD(sel,7))} style={{padding:"10px 18px",borderRadius:12,border:`1px solid ${B}`,background:C,color:"#888",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"Outfit"}}>Nächste →</button>
      </div>}
    </div>
  );
}

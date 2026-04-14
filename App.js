import { useState, useEffect, useCallback, useRef } from "react";

/* ── localStorage helpers ── */
const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } };
const store = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} };

/* ── Date helpers ── */
const now = () => new Date().toISOString().slice(0, 10);
const fmt = iso => { const d = new Date(iso + "T12:00:00"); return { wd: ["So","Mo","Di","Mi","Do","Fr","Sa"][d.getDay()], dd: d.getDate(), mm: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"][d.getMonth()] } };
const shift = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) };
const range = n => { const r = []; for (let i = n - 1; i >= 0; i--) r.push(shift(now(), -i)); return r };

/* ── Data ── */
const INIT_HABITS = [
  { id: "h1", name: "Sport / Bewegung", icon: "🏋️", color: "#e85d75" },
  { id: "h2", name: "Wasser trinken (2L)", icon: "💧", color: "#5b9def" },
  { id: "h3", name: "Lesen (20 Min)", icon: "📖", color: "#f0a050" },
  { id: "h4", name: "Kein Social Media vor 10h", icon: "📵", color: "#8b6def" },
  { id: "h5", name: "Journaling", icon: "✏️", color: "#4ecda0" },
];
const ICON_LIST = ["🏋️","💧","📖","✏️","📵","🧘","💤","🥗","🚶","💊","🎯","🧠","🎵","🌅","🧹","💰","📞","🍎","⏰","🚫"];
const COLOR_LIST = ["#e85d75","#5b9def","#f0a050","#8b6def","#4ecda0","#d4a054","#ef6d6d","#6dcfef","#a0d050","#ef8fba"];
const PRIOS = [{ k: "high", l: "Hoch", c: "#e85d75", i: "🔴" }, { k: "medium", l: "Mittel", c: "#f0a050", i: "🟡" }, { k: "low", l: "Normal", c: "#5b9def", i: "🔵" }];
const MOODS = [{ v: 1, e: "😞", l: "Schlecht" }, { v: 2, e: "😕", l: "Meh" }, { v: 3, e: "😐", l: "Okay" }, { v: 4, e: "😊", l: "Gut" }, { v: 5, e: "🤩", l: "Super" }];
const ENERGIES = [{ v: 1, l: "Leer", c: "#e85d75" }, { v: 2, l: "Müde", c: "#ef8f6d" }, { v: 3, l: "Okay", c: "#f0a050" }, { v: 4, l: "Fit", c: "#a0d050" }, { v: 5, l: "Voll da", c: "#4ecda0" }];
const BADGES = [
  { id: "s7", n: "7-Tage Streak", i: "🔥", d: "Habit 7 Tage am Stück", c: "#f0a050" },
  { id: "s30", n: "30-Tage Streak", i: "🌟", d: "Habit 30 Tage am Stück", c: "#a78bfa" },
  { id: "pw", n: "Perfekte Woche", i: "💎", d: "7 Tage alle Habits", c: "#4ecda0" },
  { id: "pd", n: "Perfekter Tag", i: "⭐", d: "Alle Habits + Ziele", c: "#f0a050" },
  { id: "hw", n: "Health Freak", i: "💚", d: "7 Tage Health komplett", c: "#4ecda0" },
  { id: "g10", n: "Zielstrebig", i: "🎯", d: "10 Ziele erreicht", c: "#5b9def" },
  { id: "g50", n: "Unstoppable", i: "🚀", d: "50 Ziele erreicht", c: "#e85d75" },
  { id: "fn", n: "Tagebuch", i: "📝", d: "Erste Notiz geschrieben", c: "#f0a050" },
  { id: "w7", n: "Gewichts-Log", i: "⚖️", d: "7x Gewicht eingetragen", c: "#8b6def" },
];
const HF = ["water", "sleep", "steps", "mood", "energy"];
const BG = "#0c0c10", CARD = "#13131a", BOR = "#1e1e2a";

const Box = ({ children, ...p }) => <div {...p} style={{ background: CARD, borderRadius: 16, border: `1px solid ${BOR}`, padding: "18px 20px", marginBottom: 10, ...(p.style || {}) }}>{children}</div>;

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [habits, setHabits] = useState(() => load("lt-habits", INIT_HABITS));
  const [checks, setChecks] = useState(() => load("lt-checks", {}));
  const [goals, setGoals] = useState(() => load("lt-goals", {}));
  const [health, setHealth] = useState(() => load("lt-health", {}));
  const [notes, setNotes] = useState(() => load("lt-notes", {}));
  const [badges, setBadges] = useState(() => load("lt-badges", {}));
  const [day, setDay] = useState(now());
  const [addMode, setAddMode] = useState(false);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("🎯");
  const [formColor, setFormColor] = useState("#e85d75");
  const [activeId, setActiveId] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [goalText, setGoalText] = useState("");
  const [goalPrio, setGoalPrio] = useState("medium");
  const [addGoalMode, setAddGoalMode] = useState(false);
  const [popup, setPopup] = useState(null);
  const [weightVal, setWeightVal] = useState("");

  const bRef = useRef(badges);
  bRef.current = badges;

  /* ── Auto-save on change ── */
  useEffect(() => { store("lt-habits", habits) }, [habits]);
  useEffect(() => { store("lt-checks", checks) }, [checks]);
  useEffect(() => { store("lt-goals", goals) }, [goals]);
  useEffect(() => { store("lt-health", health) }, [health]);
  useEffect(() => { store("lt-notes", notes) }, [notes]);
  useEffect(() => { store("lt-badges", badges) }, [badges]);

  /* ── Streak ── */
  const streak = id => { let s = 0, d = now(); if (!checks[`${d}:${id}`]) d = shift(d, -1); while (checks[`${d}:${id}`]) { s++; d = shift(d, -1) } return s };

  /* ── Badges ── */
  const award = id => { if (bRef.current[id]) return; setBadges(p => p[id] ? p : { ...p, [id]: Date.now() }); const b = BADGES.find(x => x.id === id); if (b) { setPopup(b); setTimeout(() => setPopup(null), 3000) } };

  useEffect(() => {
    habits.forEach(h => { const s = streak(h.id); if (s >= 7) award("s7"); if (s >= 30) award("s30") });
    const w = range(7);
    if (habits.length > 0 && w.every(d => habits.every(h => checks[`${d}:${h.id}`]))) award("pw");
    const tH = habits.length > 0 && habits.every(h => checks[`${now()}:${h.id}`]);
    const tG = goals[now()] || [];
    if (tH && tG.length > 0 && tG.every(g => g.done)) award("pd");
    if (w.every(d => HF.every(f => health[d]?.[f] !== undefined))) award("hw");
    const done = Object.values(goals).flat().filter(g => g.done).length;
    if (done >= 10) award("g10"); if (done >= 50) award("g50");
    if (Object.values(notes).some(n => n?.trim())) award("fn");
    if (Object.keys(health).filter(d => health[d]?.weight !== undefined).length >= 7) award("w7");
  }, [checks, goals, health, notes, habits]);

  /* ── Habit actions ── */
  const toggleHabit = id => setChecks(p => { const k = `${day}:${id}`, n = { ...p }; n[k] ? delete n[k] : n[k] = true; return n });
  const createHabit = () => { if (!formName.trim()) return; setHabits(p => [...p, { id: "h" + Date.now(), name: formName.trim(), icon: formIcon, color: formColor }]); setFormName(""); setFormIcon("🎯"); setFormColor("#e85d75"); setAddMode(false) };
  const removeHabit = id => { setHabits(p => p.filter(h => h.id !== id)); setChecks(p => { const n = { ...p }; Object.keys(n).forEach(k => { if (k.endsWith(`:${id}`)) delete n[k] }); return n }); setActiveId(null); setEditHabit(null) };
  const saveEdit = () => { if (!editHabit) return; setHabits(p => p.map(h => h.id === editHabit.id ? editHabit : h)); setEditHabit(null); setActiveId(null) };

  /* ── Goal actions ── */
  const dayGoals = goals[day] || [];
  const createGoal = () => { if (!goalText.trim()) return; setGoals(p => ({ ...p, [day]: [...(p[day] || []), { id: "g" + Date.now(), text: goalText.trim(), priority: goalPrio, done: false }] })); setGoalText(""); setGoalPrio("medium"); setAddGoalMode(false) };
  const toggleGoal = id => setGoals(p => ({ ...p, [day]: (p[day] || []).map(g => g.id === id ? { ...g, done: !g.done } : g) }));
  const removeGoal = id => { setGoals(p => ({ ...p, [day]: (p[day] || []).filter(g => g.id !== id) })); setActiveId(null) };
  const sorted = [...dayGoals].sort((a, b) => { if (a.done !== b.done) return a.done ? 1 : -1; return ({ high: 0, medium: 1, low: 2 })[a.priority] - ({ high: 0, medium: 1, low: 2 })[b.priority] });

  /* ── Health ── */
  const dH = health[day] || {};
  const setH = (f, v) => setHealth(p => ({ ...p, [day]: { ...(p[day] || {}), [f]: v } }));
  const saveWeight = () => { const w = parseFloat(weightVal); if (!isNaN(w) && w > 0) { setH("weight", w); setWeightVal("") } };

  /* ── Computed ── */
  const week = []; for (let i = -3; i <= 3; i++) week.push(shift(day, i));
  const doneH = habits.filter(h => checks[`${day}:${h.id}`]).length;
  const progH = habits.length ? doneH / habits.length : 0;
  const doneG = dayGoals.filter(g => g.done).length;
  const progG = dayGoals.length ? doneG / dayGoals.length : 0;
  const filledHe = HF.filter(f => dH[f] !== undefined).length;
  const colors = { dashboard: "#a78bfa", habits: "#e85d75", goals: "#f0a050", health: "#4ecda0" };
  const ac = colors[tab];

  const r7 = range(7), r30 = range(30);
  const p7 = []; for (let i = 13; i >= 7; i--) p7.push(shift(now(), -i));
  const rate = ds => ds.reduce((s, d) => s + habits.filter(h => checks[`${d}:${h.id}`]).length, 0) / Math.max(1, ds.length * habits.length) * 100;
  const wRate = rate(r7), pRate = rate(p7);
  const wGD = r7.reduce((s, d) => s + (goals[d] || []).filter(g => g.done).length, 0);
  const wGT = r7.reduce((s, d) => s + (goals[d] || []).length, 0);
  const pGD = p7.reduce((s, d) => s + (goals[d] || []).filter(g => g.done).length, 0);
  const avg = (f, ds) => { const v = ds.map(d => health[d]?.[f]).filter(x => x !== undefined); return v.length ? v.reduce((a, b) => a + Number(b), 0) / v.length : null };
  const aS = avg("sleep", r7), pS = avg("sleep", p7), aM = avg("mood", r7), pM = avg("mood", p7), aW = avg("water", r7), aE = avg("energy", r7);
  const streakList = habits.map(h => ({ ...h, s: streak(h.id) })).sort((a, b) => b.s - a.s);
  const heatmap = r30.map(d => { const h = habits.filter(x => checks[`${d}:${x.id}`]).length; const g = goals[d] || []; const gd = g.filter(x => x.done).length; const hf = HF.filter(f => health[d]?.[f] !== undefined).length; return { d, sc: (habits.length ? h / habits.length : 0) * .4 + (g.length ? gd / g.length : 0) * .3 + (hf / 5) * .3 } });
  const perfect = r30.filter(d => habits.length > 0 && habits.every(h => checks[`${d}:${h.id}`]) && (goals[d] || []).length > 0 && (goals[d] || []).every(g => g.done)).length;
  const weightPts = r30.map(d => ({ d, v: health[d]?.weight ?? null })).filter(x => x.v !== null);
  const arrow = (v, up = true) => { if (v == null || isNaN(v)) return null; const pos = v > 0; return { a: pos ? "↑" : v < 0 ? "↓" : "→", c: (up ? pos : v < 0) ? "#4ecda0" : (pos || v < 0) ? "#e85d75" : "#555", t: Math.abs(v) < 1 ? Math.abs(v).toFixed(1) : Math.round(Math.abs(v)) } };

  const iStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #2a2a38", background: BG, color: "#e8e6f0", fontSize: 15, fontFamily: "Outfit", outline: "none", marginBottom: 14, boxSizing: "border-box" };
  const IconPick = ({ val, set }) => <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>{ICON_LIST.map(ic => <button key={ic} onClick={() => set(ic)} style={{ width: 36, height: 36, borderRadius: 10, border: ic === val ? "2px solid #e85d75" : "1px solid #222", background: ic === val ? "rgba(232,93,117,.12)" : BG, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>)}</div>;
  const ColPick = ({ val, set }) => <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{COLOR_LIST.map(c => <button key={c} onClick={() => set(c)} style={{ width: 28, height: 28, borderRadius: 8, border: c === val ? "2px solid #fff" : "2px solid transparent", background: c, cursor: "pointer", transform: c === val ? "scale(1.15)" : "scale(1)" }} />)}</div>;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e6f0", fontFamily: "'Outfit',sans-serif", padding: "0 0 100px", maxWidth: 480, margin: "0 auto" }}>
      <style>{`@keyframes sd{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}@keyframes bp{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}25%{transform:translate(-50%,-50%) scale(1)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(.8)}}input::placeholder,textarea::placeholder{color:#444}`}</style>

      {popup && <div style={{ position: "fixed", top: "50%", left: "50%", zIndex: 999, background: "#1a1a2e", border: `2px solid ${popup.c}`, borderRadius: 20, padding: "28px 36px", textAlign: "center", animation: "bp 3s ease forwards", boxShadow: `0 0 60px ${popup.c}44`, transform: "translate(-50%,-50%)" }}><div style={{ fontSize: 48, marginBottom: 8 }}>{popup.i}</div><div style={{ fontSize: 11, color: popup.c, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>NEUES BADGE</div><div style={{ fontSize: 18, fontWeight: 800 }}>{popup.n}</div><div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{popup.d}</div></div>}

      {/* Header */}
      <div style={{ padding: "28px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: "#555", fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{day === now() ? "Heute" : fmt(day).wd + ", " + fmt(day).dd + " " + fmt(day).mm}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -.5 }}>{({ dashboard: "Dashboard", habits: "Gewohnheiten", goals: "Tagesziele", health: "Health" })[tab]}</h1>
          </div>
          {(tab === "habits" || tab === "goals") && <button onClick={() => tab === "habits" ? setAddMode(!addMode) : setAddGoalMode(!addGoalMode)} style={{ width: 44, height: 44, borderRadius: 14, border: "1px solid #222", background: (tab === "habits" ? addMode : addGoalMode) ? ac : "#161620", color: (tab === "habits" ? addMode : addGoalMode) ? "#fff" : "#888", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{(tab === "habits" ? addMode : addGoalMode) ? "×" : "+"}</button>}
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 20, background: CARD, borderRadius: 14, padding: 4, border: `1px solid ${BOR}` }}>
          {[["dashboard", "📊"], ["habits", "🔄"], ["goals", "🎯"], ["health", "❤️"]].map(([k, icon]) => <button key={k} onClick={() => { setTab(k); setAddMode(false); setAddGoalMode(false); setActiveId(null); setEditHabit(null) }} style={{ flex: 1, padding: "10px 0", borderRadius: 11, border: "none", cursor: "pointer", background: tab === k ? "#1e1e2e" : "transparent", color: tab === k ? "#fff" : "#555", fontSize: 16, fontWeight: tab === k ? 700 : 500, fontFamily: "Outfit" }}>{icon}</button>)}
        </div>
        {tab !== "dashboard" && <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, padding: "16px 20px", background: CARD, borderRadius: 16, border: `1px solid ${BOR}` }}>
          <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke={BOR} strokeWidth="4" /><circle cx="28" cy="28" r="24" fill="none" stroke={ac} strokeWidth="4" strokeDasharray={`${(tab === "habits" ? progH : tab === "goals" ? progG : filledHe / 5) * 150.8} 150.8`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{ transition: "stroke-dasharray .4s" }} /><text x="28" y="32" textAnchor="middle" fill="#e8e6f0" fontSize="15" fontWeight="700" fontFamily="Outfit">{tab === "habits" ? `${doneH}/${habits.length}` : tab === "goals" ? `${doneG}/${dayGoals.length}` : `${filledHe}/5`}</text></svg>
          <div><div style={{ fontSize: 16, fontWeight: 600 }}>{tab === "habits" ? (progH === 1 ? "Alles geschafft! 🔥" : progH >= .5 ? "Guter Fortschritt!" : "Los geht's!") : tab === "goals" ? (dayGoals.length === 0 ? "Keine Ziele" : progG === 1 ? "Alle erreicht! ⭐" : "Fokus!") : (filledHe === 5 ? "Komplett! 💚" : "Weiter eintragen...")}</div></div>
        </div>}
      </div>

      {/* Week */}
      {tab !== "dashboard" && <div style={{ display: "flex", gap: 6, padding: "20px 24px 8px", justifyContent: "space-between" }}>{week.map(d => {
        const f = fmt(d), sel = d === day, tod = d === now();
        const hD = habits.filter(h => checks[`${d}:${h.id}`]).length, gL = goals[d] || [], hFl = HF.filter(x => health[d]?.[x] !== undefined).length;
        const dot = tab === "habits" ? (hD === habits.length && habits.length > 0 ? "#4ecda0" : hD > 0 ? "#f0a050" : "#222") : tab === "goals" ? (gL.length > 0 && gL.every(g => g.done) ? "#4ecda0" : gL.some(g => g.done) ? "#f0a050" : gL.length > 0 ? "#e85d75" : "#222") : (hFl === 5 ? "#4ecda0" : hFl > 0 ? "#f0a050" : "#222");
        return <button key={d} onClick={() => setDay(d)} style={{ flex: 1, padding: "10px 0", borderRadius: 14, border: "none", cursor: "pointer", background: sel ? "#1e1e2e" : "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: tod ? ac : "#555", fontWeight: 600, fontFamily: "Outfit" }}>{f.wd}</span>
          <span style={{ fontSize: 16, fontWeight: sel ? 700 : 500, fontFamily: "Outfit", color: sel ? "#fff" : "#666", width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: sel ? ac : "transparent" }}>{f.dd}</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: dot }} />
        </button>
      })}</div>}

      {/* ════ DASHBOARD ════ */}
      {tab === "dashboard" && <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[{ l: "Habits heute", v: `${doneH}/${habits.length}`, s: `${Math.round(progH * 100)}%`, c: "#e85d75", ic: "🔄" }, { l: "Ziele heute", v: `${doneG}/${dayGoals.length}`, s: dayGoals.length ? `${Math.round(progG * 100)}%` : "–", c: "#f0a050", ic: "🎯" }, { l: "Perfekte Tage", v: perfect, s: "letzte 30 Tage", c: "#a78bfa", ic: "⭐" }, { l: "Badges", v: `${Object.keys(badges).length}/${BADGES.length}`, s: "freigeschaltet", c: "#4ecda0", ic: "🏆" }].map((x, i) => <Box key={i} style={{ padding: "18px 16px" }}><div style={{ fontSize: 12, color: "#555", fontWeight: 500, marginBottom: 8 }}>{x.ic} {x.l}</div><div style={{ fontSize: 28, fontWeight: 800, color: x.c, lineHeight: 1 }}>{x.v}</div><div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>{x.s}</div></Box>)}
        </div>
        <Box><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📈 Woche im Überblick</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[{ l: "Habit-Quote", v: `${Math.round(wRate)}%`, d: arrow(wRate - pRate), bc: "#e85d75", bw: wRate }, { l: "Ziele erledigt", v: <>{wGD}<span style={{ fontSize: 14, color: "#555" }}>/{wGT}</span></>, d: arrow(wGD - pGD) }, { l: "⌀ Schlaf", v: <>{aS != null ? aS.toFixed(1) : "–"}<span style={{ fontSize: 14, color: "#555" }}>h</span></>, d: arrow(aS != null && pS != null ? aS - pS : null) }, { l: "⌀ Stimmung", v: <>{aM != null ? MOODS.find(m => m.v === Math.round(aM))?.e : "–"}</>, d: arrow(aM != null && pM != null ? aM - pM : null) }, { l: "⌀ Wasser", v: <>{aW != null ? aW.toFixed(1) : "–"}<span style={{ fontSize: 14, color: "#555" }}> Gl.</span></> }, { l: "⌀ Energie", v: <>{aE != null ? ENERGIES.find(e => e.v === Math.round(aE))?.l : "–"}</> }].map((x, i) => <div key={i}><div style={{ fontSize: 11, color: "#555", fontWeight: 500, marginBottom: 4 }}>{x.l}</div><div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><div style={{ fontSize: 24, fontWeight: 800, color: x.bc || "#e8e6f0" }}>{x.v}</div>{x.d && <span style={{ fontSize: 13, fontWeight: 700, color: x.d.c }}>{x.d.a}{x.d.t}</span>}</div>{x.bw != null && <div style={{ width: "100%", height: 4, background: BOR, borderRadius: 2, marginTop: 6 }}><div style={{ width: `${x.bw}%`, height: "100%", background: x.bc, borderRadius: 2 }} /></div>}</div>)}
          </div>
        </Box>
        <Box><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🔥 Streaks</div>{streakList.map((h, i) => <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < streakList.length - 1 ? `1px solid ${BOR}` : "none" }}><div style={{ width: 28, fontSize: 18, textAlign: "center" }}>{i < 3 ? ["🥇", "🥈", "🥉"][i] : <span style={{ fontSize: 13, color: "#444" }}>{i + 1}</span>}</div><span style={{ fontSize: 16 }}>{h.icon}</span><div style={{ flex: 1, fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</div><div style={{ fontSize: 16, fontWeight: 800, color: h.s > 0 ? h.color : "#333" }}>{h.s > 0 ? h.s + "d" : "–"}</div></div>)}</Box>
        <Box><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🏆 Badges</div><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>{BADGES.map(b => { const u = !!badges[b.id]; return <div key={b.id} style={{ textAlign: "center", padding: "14px 6px", borderRadius: 12, background: u ? `${b.c}12` : BG, border: `1px solid ${u ? b.c + "44" : "#1a1a24"}`, opacity: u ? 1 : .35 }}><div style={{ fontSize: 28, filter: u ? "none" : "grayscale(1)" }}>{b.i}</div><div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: u ? b.c : "#444" }}>{b.n}</div></div> })}</div></Box>
        <Box><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🗓️ 30-Tage</div><div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>{heatmap.map((x, i) => { const f = fmt(x.d), t = x.d === now(), o = x.sc > 0 ? .25 + x.sc * .75 : .08; return <div key={i} style={{ aspectRatio: "1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: x.sc > .7 ? `rgba(78,205,160,${o})` : x.sc > .3 ? `rgba(240,160,80,${o})` : x.sc > 0 ? `rgba(232,93,117,${o})` : "#141420", border: t ? "2px solid #a78bfa" : "1px solid transparent", fontSize: 10, color: t ? "#fff" : "#444", fontWeight: t ? 700 : 400 }}>{f.dd}</div> })}</div></Box>
        {weightPts.length > 0 && <Box><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>⚖️ Gewicht</div><div style={{ fontSize: 12, color: "#555", marginBottom: 14 }}>Aktuell: <span style={{ color: "#e8e6f0", fontWeight: 700 }}>{weightPts[weightPts.length - 1].v} kg</span></div><div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 48 }}>{weightPts.slice(-14).map((x, i) => { const mn = Math.min(...weightPts.slice(-14).map(y => y.v)), mx = Math.max(...weightPts.slice(-14).map(y => y.v)), r = mx - mn || 1; return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><div style={{ width: "100%", borderRadius: 3, height: Math.max(6, ((x.v - mn) / r) * 48), background: "#8b6def", opacity: .7 }} /><span style={{ fontSize: 8, color: "#444" }}>{fmt(x.d).dd}</span></div> })}</div></Box>}
        <Box><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Health Trends</div>{[{ f: "water", l: "Wasser", mx: 8, c: "#5b9def" }, { f: "sleep", l: "Schlaf", mx: 10, c: "#8b6def" }, { f: "mood", l: "Stimmung", mx: 5, c: "#f0a050" }, { f: "energy", l: "Energie", mx: 5, c: "#4ecda0" }].map(m => <div key={m.f} style={{ marginBottom: 14 }}><div style={{ fontSize: 12, color: "#555", fontWeight: 500, marginBottom: 6 }}>{m.l}</div><div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 32 }}>{r7.map((d, i) => { const v = health[d]?.[m.f] ?? null, pct = v != null ? (Number(v) / m.mx) * 100 : 0; return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}><div style={{ width: "100%", borderRadius: 4, height: v != null ? Math.max(4, pct * .32) : 4, background: v != null ? m.c : BOR, opacity: v != null ? .8 : .3 }} /><span style={{ fontSize: 9, color: "#444" }}>{fmt(d).wd}</span></div> })}</div></div>)}</Box>
      </div>}

      {/* ════ HABITS ════ */}
      {tab === "habits" && <div>
        {addMode && <div style={{ margin: "12px 24px", padding: 20, background: CARD, borderRadius: 16, border: `1px solid ${BOR}`, animation: "sd .2s ease" }}>
          <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Gewohnheit benennen..." onKeyDown={e => e.key === "Enter" && createHabit()} style={iStyle} />
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>ICON</div><IconPick val={formIcon} set={setFormIcon} />
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>FARBE</div><ColPick val={formColor} set={setFormColor} />
          <button onClick={createHabit} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: formName.trim() ? "#e85d75" : "#2a2a38", color: formName.trim() ? "#fff" : "#555", fontSize: 15, fontWeight: 600, fontFamily: "Outfit", cursor: formName.trim() ? "pointer" : "default" }}>Hinzufügen</button>
        </div>}
        {editHabit && <div style={{ margin: "12px 24px", padding: 20, background: CARD, borderRadius: 16, border: `1px solid ${editHabit.color}44`, animation: "sd .2s ease" }}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>BEARBEITEN</div>
          <input value={editHabit.name} onChange={e => setEditHabit({ ...editHabit, name: e.target.value })} style={iStyle} />
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>ICON</div><IconPick val={editHabit.icon} set={v => setEditHabit({ ...editHabit, icon: v })} />
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>FARBE</div><ColPick val={editHabit.color} set={v => setEditHabit({ ...editHabit, color: v })} />
          <div style={{ display: "flex", gap: 8 }}><button onClick={saveEdit} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "#4ecda0", color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "Outfit", cursor: "pointer" }}>Speichern</button><button onClick={() => { setEditHabit(null); setActiveId(null) }} style={{ padding: "12px 18px", borderRadius: 12, border: "1px solid #2a2a38", background: "transparent", color: "#888", fontSize: 15, fontFamily: "Outfit", cursor: "pointer" }}>Abb.</button></div>
        </div>}
        <div style={{ padding: "8px 24px" }}>{habits.map((h, i) => { const done = !!checks[`${day}:${h.id}`], s = streak(h.id), act = activeId === h.id;
          return <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginBottom: 8, background: done ? `${h.color}0D` : CARD, borderRadius: 16, border: `1px solid ${done ? h.color + "33" : BOR}`, animation: `fi .3s ease ${i * .05}s both` }}>
            <button onClick={() => toggleHabit(h.id)} style={{ width: 42, height: 42, borderRadius: 13, border: `2px solid ${done ? h.color : "#2a2a38"}`, background: done ? h.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 20, color: "#fff" }}>{done ? "✓" : <span style={{ fontSize: 18 }}>{h.icon}</span>}</button>
            <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => { act ? setActiveId(null) : setActiveId(h.id); setEditHabit(null) }}><div style={{ fontSize: 15, fontWeight: 600, textDecoration: done ? "line-through" : "none", opacity: done ? .6 : 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</div>{s > 0 && <div style={{ fontSize: 12, color: h.color, fontWeight: 600, marginTop: 2 }}>🔥 {s} {s === 1 ? "Tag" : "Tage"}</div>}</div>
            {act && !editHabit && <div style={{ display: "flex", gap: 6 }}><button onClick={e => { e.stopPropagation(); setEditHabit({ ...h }) }} style={{ padding: "6px 12px", borderRadius: 10, border: "1px solid #2a2a38", background: "#1a1a2e", color: "#a78bfa", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏️</button><button onClick={e => { e.stopPropagation(); removeHabit(h.id) }} style={{ padding: "6px 12px", borderRadius: 10, border: "1px solid #3a1a1a", background: "#2a1015", color: "#ef6d6d", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑️</button></div>}
          </div> })}</div>
      </div>}

      {/* ════ GOALS ════ */}
      {tab === "goals" && <div>
        {addGoalMode && <div style={{ margin: "12px 24px", padding: 20, background: CARD, borderRadius: 16, border: `1px solid ${BOR}`, animation: "sd .2s ease" }}>
          <input value={goalText} onChange={e => setGoalText(e.target.value)} placeholder="Was willst du heute schaffen?" onKeyDown={e => e.key === "Enter" && createGoal()} style={iStyle} />
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600 }}>PRIORITÄT</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{PRIOS.map(p => <button key={p.k} onClick={() => setGoalPrio(p.k)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1px solid ${goalPrio === p.k ? p.c : "#222"}`, background: goalPrio === p.k ? p.c + "18" : BG, color: goalPrio === p.k ? p.c : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit" }}>{p.i} {p.l}</button>)}</div>
          <button onClick={createGoal} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: goalText.trim() ? "#f0a050" : "#2a2a38", color: goalText.trim() ? "#fff" : "#555", fontSize: 15, fontWeight: 600, fontFamily: "Outfit", cursor: goalText.trim() ? "pointer" : "default" }}>Ziel hinzufügen</button>
        </div>}
        <div style={{ padding: "8px 24px" }}>{sorted.map((g, i) => { const p = PRIOS.find(x => x.k === g.priority), act = activeId === g.id;
          return <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginBottom: 8, background: g.done ? `${p.c}0D` : CARD, borderRadius: 16, border: `1px solid ${g.done ? p.c + "33" : BOR}`, animation: `fi .3s ease ${i * .05}s both` }}>
            <button onClick={() => toggleGoal(g.id)} style={{ width: 42, height: 42, borderRadius: 13, border: `2px solid ${g.done ? p.c : "#2a2a38"}`, background: g.done ? p.c : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 18, color: "#fff" }}>{g.done ? "✓" : p.i}</button>
            <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setActiveId(act ? null : g.id)}><div style={{ fontSize: 15, fontWeight: 600, textDecoration: g.done ? "line-through" : "none", opacity: g.done ? .5 : 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.text}</div><div style={{ fontSize: 12, color: p.c, fontWeight: 500, marginTop: 2, opacity: .7 }}>{p.l}</div></div>
            {act && <button onClick={e => { e.stopPropagation(); removeGoal(g.id) }} style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid #3a1a1a", background: "#2a1015", color: "#ef6d6d", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Löschen</button>}
          </div> })}
          {dayGoals.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: "#444" }}><div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div><div style={{ fontSize: 15 }}>Keine Ziele für {day === now() ? "heute" : "diesen Tag"}</div></div>}
        </div>
      </div>}

      {/* ════ HEALTH ════ */}
      {tab === "health" && <div style={{ padding: "12px 24px" }}>
        <Box><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 15, fontWeight: 600 }}>💧 Wasser</span><span style={{ fontSize: 22, fontWeight: 800, color: "#5b9def" }}>{dH.water || 0}<span style={{ fontSize: 13, color: "#555" }}>/8</span></span></div><div style={{ display: "flex", gap: 6 }}>{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <button key={n} onClick={() => setH("water", n === dH.water ? n - 1 : n)} style={{ flex: 1, height: 36, borderRadius: 8, border: "none", cursor: "pointer", background: n <= (dH.water || 0) ? "#5b9def" : "#1e1e2a", opacity: n <= (dH.water || 0) ? 1 : .4 }} />)}</div></Box>
        <Box><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 15, fontWeight: 600 }}>😴 Schlaf</span><span style={{ fontSize: 22, fontWeight: 800, color: "#8b6def" }}>{dH.sleep || "–"}<span style={{ fontSize: 13, color: "#555" }}> Std</span></span></div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(h => <button key={h} onClick={() => setH("sleep", h === dH.sleep ? undefined : h)} style={{ padding: "8px 0", borderRadius: 8, border: `1px solid ${dH.sleep === h ? "#8b6def" : "#222"}`, background: dH.sleep === h ? "rgba(139,109,239,.15)" : BG, color: dH.sleep === h ? "#8b6def" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit", width: "calc(25% - 5px)" }}>{h}h</button>)}</div></Box>
        <Box><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 15, fontWeight: 600 }}>🚶 Schritte</span><span style={{ fontSize: 22, fontWeight: 800, color: "#f0a050" }}>{dH.steps ? dH.steps.toLocaleString("de") : "–"}</span></div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{[2000, 4000, 6000, 8000, 10000, 12000, 15000].map(s => <button key={s} onClick={() => setH("steps", s === dH.steps ? undefined : s)} style={{ padding: "8px 0", borderRadius: 8, border: `1px solid ${dH.steps === s ? "#f0a050" : "#222"}`, background: dH.steps === s ? "rgba(240,160,80,.15)" : BG, color: dH.steps === s ? "#f0a050" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit", flex: 1, minWidth: "calc(25% - 5px)" }}>{(s / 1000).toFixed(0)}k</button>)}</div></Box>
        <Box><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 15, fontWeight: 600 }}>⚖️ Gewicht</span><span style={{ fontSize: 22, fontWeight: 800, color: "#8b6def" }}>{dH.weight ? dH.weight.toFixed(1) : "–"}<span style={{ fontSize: 13, color: "#555" }}> kg</span></span></div><div style={{ display: "flex", gap: 8 }}><input value={weightVal} onChange={e => setWeightVal(e.target.value)} placeholder="z.B. 75.5" type="number" step="0.1" onKeyDown={e => e.key === "Enter" && saveWeight()} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #2a2a38", background: BG, color: "#e8e6f0", fontSize: 15, fontFamily: "Outfit", outline: "none", boxSizing: "border-box" }} /><button onClick={saveWeight} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: weightVal ? "#8b6def" : "#2a2a38", color: weightVal ? "#fff" : "#555", fontWeight: 600, cursor: weightVal ? "pointer" : "default", fontFamily: "Outfit" }}>OK</button></div></Box>
        <Box><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🧠 Stimmung</div><div style={{ display: "flex", gap: 8 }}>{MOODS.map(m => <button key={m.v} onClick={() => setH("mood", m.v === dH.mood ? undefined : m.v)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${dH.mood === m.v ? "#f0a050" : "#222"}`, background: dH.mood === m.v ? "rgba(240,160,80,.12)" : BG, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span style={{ fontSize: 24, filter: dH.mood === m.v ? "none" : "grayscale(1)" }}>{m.e}</span><span style={{ fontSize: 10, color: dH.mood === m.v ? "#f0a050" : "#444", fontWeight: 600 }}>{m.l}</span></button>)}</div></Box>
        <Box><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>⚡ Energie</div><div style={{ display: "flex", gap: 6 }}>{ENERGIES.map(e => <button key={e.v} onClick={() => setH("energy", e.v === dH.energy ? undefined : e.v)} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: `1px solid ${dH.energy === e.v ? e.c : "#222"}`, background: dH.energy === e.v ? e.c + "20" : BG, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: dH.energy >= e.v ? e.c : "#333" }} /><span style={{ fontSize: 10, color: dH.energy === e.v ? e.c : "#444", fontWeight: 600 }}>{e.l}</span></button>)}</div></Box>
      </div>}

      {/* Notes */}
      {tab !== "dashboard" && <div style={{ padding: "8px 24px 0" }}><Box><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>📝 Tagesnotiz</div><textarea value={notes[day] || ""} onChange={e => setNotes(p => ({ ...p, [day]: e.target.value }))} placeholder="Gedanken, Learnings, Reflexionen..." style={{ width: "100%", minHeight: 70, padding: "12px 14px", borderRadius: 12, border: "1px solid #2a2a38", background: BG, color: "#e8e6f0", fontSize: 14, fontFamily: "Outfit", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} /></Box></div>}

      {/* Nav */}
      {tab !== "dashboard" && <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "20px 24px", flexWrap: "wrap" }}>
        <button onClick={() => setDay(shift(day, -7))} style={{ padding: "10px 18px", borderRadius: 12, border: `1px solid ${BOR}`, background: CARD, color: "#888", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>← Vorher</button>
        {day !== now() && <button onClick={() => setDay(now())} style={{ padding: "10px 18px", borderRadius: 12, border: "none", background: ac, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit" }}>Heute</button>}
        <button onClick={() => setDay(shift(day, 7))} style={{ padding: "10px 18px", borderRadius: 12, border: `1px solid ${BOR}`, background: CARD, color: "#888", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>Nächste →</button>
      </div>}
    </div>
  );
}

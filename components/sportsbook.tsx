"use client";

import { useMemo, useState } from 'react';
import { Activity, ArrowDown, ChevronDown, CircleHelp, Clock3, Flame, Gamepad2, Menu, Search, ShieldCheck, Smartphone, Sparkles, Ticket, Trophy, Wallet, X, Zap } from 'lucide-react';

type Sport = 'Football' | 'Basketball' | 'Tennis';
type Match = { id: string; sport: Sport; league: string; region: string; start: string; live: boolean; home: string; away: string; odds: [string, string, string] };
type Pick = { key: string; matchId: string; selection: string; price: number; home: string; away: string; league: string };

const matches: Match[] = [
  { id:'m1', sport:'Football', league:'Premier League', region:'ENGLAND', start:'17:30', live:true, home:'Arsenal', away:'Manchester City', odds:['2.15','3.40','3.05'] },
  { id:'m2', sport:'Football', league:'La Liga', region:'SPAIN', start:'20:00', live:false, home:'Real Madrid', away:'Barcelona', odds:['2.05','3.65','3.20'] },
  { id:'m3', sport:'Football', league:'Serie A', region:'ITALY', start:'19:45', live:false, home:'Inter Milan', away:'Juventus', odds:['1.95','3.20','3.85'] },
  { id:'m4', sport:'Football', league:'Premier League', region:'UGANDA', start:'16:00', live:false, home:'Vipers SC', away:'Kampala City', odds:['1.78','3.25','4.10'] },
  { id:'m5', sport:'Football', league:'Champions League', region:'EUROPE', start:'21:00', live:true, home:'Bayern Munich', away:'Paris Saint-Germain', odds:['2.30','3.55','2.75'] },
  { id:'m6', sport:'Basketball', league:'NBA', region:'UNITED STATES', start:'22:30', live:false, home:'Boston Celtics', away:'Miami Heat', odds:['1.72','—','2.08'] },
  { id:'m7', sport:'Tennis', league:'ATP Singles', region:'TOUR', start:'14:30', live:true, home:'A. Player', away:'B. Player', odds:['1.85','—','1.95'] },
];

const sports: Array<{name: 'Football' | 'Basketball' | 'Tennis' | 'Live' | 'Virtuals'; icon: string}> = [
  {name:'Football',icon:'⚽'},{name:'Live',icon:'●'},{name:'Basketball',icon:'🏀'},{name:'Tennis',icon:'🎾'},{name:'Virtuals',icon:'✦'}
];

function Brand() {
  return <a href="#" aria-label="DailyBet home" className="flex shrink-0 flex-col leading-none no-underline">
    <span className="text-[25px] font-black tracking-[-1.4px] text-white">daily<span className="text-[#6aa4ff]">Bet</span></span>
    <span className="mt-1 text-[8px] font-bold tracking-[2.3px] text-blue-100/70">YOUR GAME. YOUR CALL.</span>
  </a>;
}

export default function Sportsbook() {
  const [sport, setSport] = useState<string>('Football');
  const [filter, setFilter] = useState<'all'|'live'|'upcoming'>('all');
  const [query, setQuery] = useState('');
  const [picks, setPicks] = useState<Pick[]>([]);
  const [stake, setStake] = useState('1000');
  const [multiple, setMultiple] = useState(true);
  const [slipOpen, setSlipOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  const shown = useMemo(() => matches.filter(m => {
    const search = (m.home+' '+m.away+' '+m.league+' '+m.region).toLowerCase().includes(query.toLowerCase());
    return search && (sport==='All' || sport===m.sport || (sport==='Live' && m.live)) && (filter==='all' || (filter==='live' && m.live) || (filter==='upcoming' && !m.live));
  }), [sport, filter, query]);
  const combined = picks.reduce((acc,p) => acc*p.price, 1);
  const stakeValue = Math.max(0, Number(stake) || 0);
  const payout = multiple ? stakeValue*combined : stakeValue*(picks[0]?.price ?? 0);

  function togglePick(match: Match, label: string, value: string) {
    const key = match.id+'-'+label;
    setPicks(old => old.some(p=>p.key===key) ? old.filter(p=>p.key!==key) : [...old.filter(p=>p.matchId!==match.id), {key,matchId:match.id,selection:label,price:Number(value),home:match.home,away:match.away,league:match.region+' · '+match.league}]);
  }
  function chooseSport(name: string) {
    setSport(name); setFilter('all'); setMobileMenu(false);
  }

  const slip = <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(7,27,73,.05)]">
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
      <div><h2 className="font-extrabold text-slate-900">Bet slip <span className="text-[#1769e0]">({picks.length})</span></h2><p className="mt-1 text-[11px] text-slate-500">Your selections</p></div>
      {picks.length>0 && <button onClick={()=>setPicks([])} className="text-xs font-bold text-slate-500 hover:text-[#1769e0]">Clear all</button>}
      {slipOpen && <button aria-label="Close bet slip" onClick={()=>setSlipOpen(false)} className="rounded-md p-1 text-slate-500"><X size={19}/></button>}
    </div>
    <div className="flex gap-1 bg-slate-50 p-1.5"><button onClick={()=>setMultiple(false)} className={'flex-1 rounded-md py-2 text-xs font-extrabold '+(!multiple?'bg-white text-[#1769e0] shadow-sm':'text-slate-500')}>Singles</button><button onClick={()=>setMultiple(true)} className={'flex-1 rounded-md py-2 text-xs font-extrabold '+(multiple?'bg-white text-[#1769e0] shadow-sm':'text-slate-500')}>Multiple</button></div>
    {picks.length===0 ? <div className="px-5 py-10 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#1769e0]"><Ticket size={22}/></div><p className="font-extrabold text-slate-700">Your bet slip is empty</p><p className="mx-auto mt-2 max-w-[220px] text-xs leading-5 text-slate-500">Select odds from a match to add your prediction here.</p></div> :
    <div className="p-4">
      <div className="space-y-3">{picks.map(p=><div key={p.key} className="rounded-lg border border-slate-200 p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-extrabold text-slate-800">{p.home} vs {p.away}</p><p className="mt-1 text-[10px] text-slate-500">{p.league} · Pick {p.selection}</p></div><button aria-label="Remove pick" onClick={()=>setPicks(old=>old.filter(x=>x.key!==p.key))} className="text-slate-400 hover:text-red-500"><X size={16}/></button></div><p className="mt-2 text-sm font-black text-[#1769e0]">{p.price.toFixed(2)}</p></div>)}</div>
      <label className="mt-4 block text-[10px] font-extrabold tracking-wide text-slate-500">STAKE · UGX</label><input type="number" min="0" step="500" value={stake} onChange={e=>setStake(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-3 font-bold outline-none focus:border-blue-500"/>
      <div className="mt-4 flex justify-between text-xs text-slate-500"><span>{multiple?'Combined odds':'Selected odds'}</span><b className="text-slate-800">{(multiple?combined:(picks[0]?.price??0)).toFixed(2)}</b></div>
      <div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-500">Potential return*</span><strong className="text-lg font-black text-[#16804a]">UGX {Math.round(payout).toLocaleString('en-UG')}</strong></div>
      <button onClick={()=>setNotice('Demo only: no real wager has been placed. A licensed sportsbook and verified account are required.')} className="mt-4 w-full rounded-lg bg-[#1769e0] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#0d54bd]">Continue to bet <span aria-hidden="true">→</span></button>
      <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">*Illustrative calculation only. Odds are sample data, not live prices.</p>
    </div>}
  </section>;

  return <div className="min-h-screen pb-20 md:pb-0">
    <header className="sticky top-0 z-30 bg-[#071b49] text-white shadow-md">
      <div className="mx-auto flex h-[62px] max-w-[1480px] items-center gap-4 px-3 sm:px-5 lg:gap-7">
        <button aria-label="Open menu" onClick={()=>setMobileMenu(v=>!v)} className="rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden"><Menu size={22}/></button>
        <Brand/>
        <div className="hidden max-w-[520px] flex-1 items-center rounded-lg border border-white/15 bg-white/[.08] px-3 md:flex"><Search size={17} className="shrink-0 text-blue-100/70"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search teams, leagues or matches…" className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-blue-100/60"/></div>
        <div className="ml-auto flex items-center gap-2"><button onClick={()=>setNotice('Login will be enabled when the authentication service is connected.')} className="rounded-lg border border-white/40 px-3 py-2 text-xs font-extrabold hover:bg-white/10 sm:px-4 sm:text-sm">Log in</button><button onClick={()=>setNotice('Registration will be enabled after secure account services are connected.')} className="rounded-lg bg-[#1769e0] px-3 py-2 text-xs font-extrabold hover:bg-[#0d54bd] sm:px-4 sm:text-sm">Join now</button></div>
      </div>
      {mobileMenu && <div className="border-t border-white/10 bg-[#0b2458] p-3 lg:hidden"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search teams or leagues" className="mb-2 w-full rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900"/>{sports.map(s=><button key={s.name} onClick={()=>chooseSport(s.name)} className="mr-2 mb-2 rounded-lg bg-white/10 px-3 py-2 text-sm">{s.icon} {s.name}</button>)}</div>}
      <div className="flex h-9 items-center gap-5 overflow-hidden bg-[#0c2458] px-4 text-[10px] font-bold text-blue-50/90 sm:gap-7 sm:px-6 sm:text-xs"><span className="flex shrink-0 items-center gap-1.5 text-[#8ebaff]"><span className="h-1.5 w-1.5 rounded-full bg-rose-400"/> DEMO MODE</span><span>Football <b className="text-white">124</b></span><span>Basketball <b className="text-white">32</b></span><span>Tennis <b className="text-white">46</b></span><span>Virtuals <b className="text-white">24/7</b></span><span className="ml-auto shrink-0">UGX · Uganda</span></div>
    </header>

    <div className="mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-4 px-2.5 py-4 sm:px-4 lg:grid-cols-[205px_minmax(0,1fr)_300px] lg:gap-4 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <aside className="sticky top-[118px] hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:block">
        <p className="px-3 pb-2 pt-3 text-[10px] font-black tracking-[1.4px] text-slate-400">MAIN MENU</p>
        {[{name:'Sports home',icon:<Trophy size={17}/>,action:()=>{setSport('Football');setFilter('all')}},{name:'Live now',icon:<Activity size={17}/>,action:()=>{setSport('All');setFilter('live')}},{name:'Upcoming',icon:<Clock3 size={17}/>,action:()=>{setSport('All');setFilter('upcoming')}},{name:'Popular',icon:<Flame size={17}/>,action:()=>{setSport('Football');setFilter('all')}}].map((item,i)=><button key={item.name} onClick={item.action} className={'mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-bold '+((i===0&&filter==='all'&&sport==='Football')?'bg-blue-50 text-[#1769e0]':'text-slate-600 hover:bg-slate-50')}><span>{item.icon}</span>{item.name}{i===1&&<span className="ml-auto rounded bg-rose-50 px-1.5 py-0.5 text-[10px] text-rose-500">LIVE</span>}</button>)}
        <p className="px-3 pb-2 pt-5 text-[10px] font-black tracking-[1.4px] text-slate-400">SPORTS</p>
        {sports.filter(s=>s.name!=='Live'&&s.name!=='Virtuals').map(s=><button key={s.name} onClick={()=>chooseSport(s.name)} className={'mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-bold '+(sport===s.name?'bg-blue-50 text-[#1769e0]':'text-slate-600 hover:bg-slate-50')}><span className="w-5 text-center text-base">{s.icon}</span>{s.name}</button>)}
        <p className="px-3 pb-2 pt-5 text-[10px] font-black tracking-[1.4px] text-slate-400">EXPLORE</p>
        <button onClick={()=>setNotice('Virtual sports require a connected and approved content provider.')} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50"><Gamepad2 size={17}/>Virtual sports</button>
        <div className="mt-4 rounded-lg bg-[#f1f6ff] p-3 text-[11px] leading-5 text-slate-500"><p className="font-extrabold text-[#071b49]">Play responsibly</p>Only bet what you can afford to lose. Take breaks and set limits.</div>
      </aside>

      <main className="min-w-0">
        <nav className="mb-3 flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">{sports.map(s=><button key={s.name} onClick={()=>chooseSport(s.name)} className={'shrink-0 rounded-lg px-3 py-2.5 text-xs font-extrabold transition sm:flex-1 sm:px-2 '+((sport===s.name||(s.name==='Live'&&filter==='live'))?'bg-[#1769e0] text-white':'text-slate-500 hover:bg-slate-100')}><span className="mr-1.5">{s.icon}</span>{s.name}</button>)}</nav>
        <section className="relative mb-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#071b49] via-[#103e8d] to-[#1769e0] px-4 py-5 text-white sm:px-6 sm:py-6"><div className="absolute -right-6 -top-20 h-56 w-56 rounded-full border-[24px] border-white/[.06]"/><div className="relative z-10 flex items-center justify-between gap-3"><div><p className="text-[9px] font-black tracking-[2px] text-blue-200 sm:text-[10px]">WELCOME TO DAILYBET</p><h1 className="mt-2 text-[21px] font-black tracking-tight sm:text-[27px]">Every match. Every moment.</h1><p className="mt-1.5 max-w-sm text-[11px] leading-5 text-blue-100 sm:text-xs">Follow the action, explore markets and build your bet slip.</p></div><div className="hidden rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-extrabold sm:block"><ShieldCheck className="mr-1.5 inline" size={15}/>DAILYBET</div></div></section>
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(7,27,73,.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-4 sm:px-4"><div><h2 className="text-sm font-black text-slate-900 sm:text-[15px]">{filter==='live'?'Live now':filter==='upcoming'?'Upcoming fixtures':sport==='All'?'All sports':sport==='Live'?'Live events':sport==='Football'?'Popular football':sport+' events'}</h2><p className="mt-1 text-[10px] text-slate-500">{shown.length} featured events <span className="text-slate-300">·</span> sample data for UI preview</p></div><button onClick={()=>setFilter(v=>v==='all'?'upcoming':v==='upcoming'?'live':'all')} className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-2.5 py-2 text-[10px] font-bold text-slate-600">{filter==='all'?'Top matches':filter==='upcoming'?'Upcoming':'Live'} <ChevronDown size={13}/></button></div>
          {shown.length===0 ? <div className="p-10 text-center text-sm text-slate-500">No events found. Try another sport or search.</div> : shown.map((m,index)=><div key={m.id}>
            {(index===0||shown[index-1].region!==m.region||shown[index-1].league!==m.league)&&<div className="flex items-center gap-2 border-b border-slate-100 bg-[#f8f9fc] px-3 py-2.5 text-[10px] font-black tracking-wide text-slate-600 sm:px-4"><span className="grid h-5 w-5 place-items-center rounded-full bg-blue-100 text-[10px] text-blue-700">★</span>{m.region} <span className="text-slate-300">/</span> {m.league}<span className="ml-auto text-[9px] font-bold tracking-normal text-slate-400">{m.sport}</span></div>}
            <article className="border-b border-slate-100 px-3 py-3.5 last:border-b-0 sm:px-4"><div className="mb-3 flex items-center justify-between gap-2 text-[10px]"><span className="font-bold text-slate-500">{m.live&&<span className="mr-1.5 inline-flex items-center gap-1 font-black text-rose-500"><span className="h-1.5 w-1.5 rounded-full bg-rose-500"/>LIVE</span>}{m.start}</span><span className="text-slate-400">Match winner</span></div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(130px,1fr)_minmax(190px,1.15fr)] sm:items-center sm:gap-3"><div className="space-y-2"><div className="flex items-center gap-2 text-xs font-bold text-slate-800"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500">{m.home.charAt(0)}</span>{m.home}</div><div className="flex items-center gap-2 text-xs font-bold text-slate-800"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500">{m.away.charAt(0)}</span>{m.away}</div></div><div><div className="grid grid-cols-3 gap-1.5">{m.odds.map((value,i)=>{const label=['1','X','2'][i];const active=picks.some(p=>p.key===m.id+'-'+label);return <button key={label} disabled={value==='—'} onClick={()=>togglePick(m,label,value)} className={'flex min-h-[47px] flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 transition '+(active?'border-[#1769e0] bg-[#1769e0] text-white':'border-slate-200 bg-[#f5f7fb] text-slate-800 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40')}><span className={'text-[9px] '+(active?'text-blue-100':'text-slate-500')}>{label}</span><strong className="text-xs font-black">{value}</strong></button>})}</div><button onClick={()=>setNotice('Additional markets will appear when a live sportsbook feed is integrated.')} className="mt-2 flex w-full items-center justify-end gap-1 text-[10px] font-extrabold text-[#1769e0] hover:underline">More markets <ArrowDown size={12}/></button></div></div>
            </article>
          </div>)}
        </section>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-[10px] leading-4 text-slate-500"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[#1769e0]"/><p><b className="text-slate-700">Preview environment.</b> Fixtures and prices are illustrative, not live. Real-time odds and bet placement are disabled until approved sportsbook infrastructure is connected.</p></div>
      </main>

      <aside className="sticky top-[118px] hidden space-y-3 lg:block">{slip}<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-sm font-extrabold"><Sparkles size={17} className="text-[#1769e0]"/>New to DailyBet?</div><p className="mt-2 text-[11px] leading-5 text-slate-500">A clear, mobile-friendly home for the sports and markets you follow. Account and payment features are being prepared.</p><button onClick={()=>setNotice('Secure registration will be available after the authentication service is connected.')} className="mt-3 text-xs font-extrabold text-[#1769e0]">Create an account →</button></section><section className="rounded-xl bg-[#071b49] p-4 text-white"><div className="flex items-center gap-2 text-xs font-extrabold"><Zap size={15} className="text-blue-300"/>DailyBet promise</div><p className="mt-2 text-[11px] leading-5 text-blue-100/75">A simple experience, transparent selections and responsible play at every step.</p></section></aside>
    </div>

    <footer className="mx-auto flex max-w-[1480px] flex-col gap-2 px-4 pb-8 pt-2 text-[10px] leading-5 text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 DailyBet · UI preview</span><span>Help · Terms · Privacy · Responsible play</span><span className="font-bold">18+ only · Play responsibly</span></footer>

    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white px-1 pb-[max(7px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_18px_rgba(7,27,73,.06)] lg:hidden">
      {[{label:'Home',icon:<Trophy size={19}/>,click:()=>{chooseSport('Football');setFilter('all')}},{label:'Live',icon:<Activity size={19}/>,click:()=>{setSport('All');setFilter('live')}},{label:'Sports',icon:<Flame size={19}/>,click:()=>{setSport('Football');setFilter('all')}},{label:'Bet slip',icon:<Ticket size={19}/>,click:()=>setSlipOpen(true)},{label:'Account',icon:<Wallet size={19}/>,click:()=>setNotice('Account and wallet features are not connected yet.')}].map((item,i)=><button key={item.label} onClick={item.click} className={'relative flex min-w-[54px] flex-col items-center gap-1 px-2 py-1 text-[9px] font-extrabold '+((i===3&&slipOpen)?'text-[#1769e0]':'text-slate-500 hover:text-[#1769e0]')}><span className="relative">{item.icon}{i===3&&picks.length>0&&<span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#1769e0] px-1 text-[9px] text-white">{picks.length}</span>}</span>{item.label}</button>)}
    </nav>

    {slipOpen&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#071b49]/55 sm:items-center lg:hidden" onClick={e=>{if(e.target===e.currentTarget)setSlipOpen(false)}}><div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white p-3 pb-[max(16px,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-2xl">{slip}</div></div>}
    {notice&&<div role="status" className="fixed bottom-20 left-1/2 z-[60] flex w-[calc(100%-24px)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl bg-[#071b49] px-4 py-3.5 text-xs leading-5 text-white shadow-xl lg:bottom-6"><Smartphone size={17} className="mt-0.5 shrink-0 text-blue-300"/><p className="flex-1">{notice}</p><button aria-label="Dismiss" onClick={()=>setNotice('')} className="shrink-0 text-white/70 hover:text-white"><X size={17}/></button></div>}
  </div>;
}

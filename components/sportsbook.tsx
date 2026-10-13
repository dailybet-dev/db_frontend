"use client";

import { useMemo, useRef, useState } from 'react';
import { Activity, ArrowDown, Award, ChevronDown, CircleHelp, Globe, Clock3, Dices, Flame, Gamepad2, Home, Menu, Search, ShieldCheck, Smartphone, Sparkles, Ticket, Trophy, Wallet, X, Zap } from 'lucide-react';

type Sport = 'Football' | 'Basketball' | 'eFootball' | 'Tennis';
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
  { id:'m8', sport:'eFootball', league:'eFootball Champions Cup', region:'GLOBAL', start:'15:15', live:true, home:'Team Alpha', away:'Team Omega', odds:['1.88','3.60','2.20'] },
  { id:'m9', sport:'eFootball', league:'eFootball International', region:'EUROPE', start:'16:00', live:false, home:'Pro United', away:'Digital FC', odds:['2.05','3.40','2.95'] },
];

const sports: Array<{name: 'Football' | 'Basketball' | 'eFootball' | 'Tennis' | 'Live' | 'Virtuals'; icon: string}> = [
  {name:'Football',icon:'⚽'},{name:'Live',icon:'●'},{name:'Basketball',icon:'🏀'},{name:'eFootball',icon:'🎮'},{name:'Tennis',icon:'🎾'},{name:'Virtuals',icon:'✦'}
];

function FlagBadge({ flag, icon }: { flag?: string; icon?: string }) {
  const codes: Record<string,string> = {'🇬🇧':'gb','🏴':'gb','🇪🇸':'es','🇮🇹':'it','🇺🇸':'us','🇹🇷':'tr','🇫🇷':'fr','🇩🇪':'de','🇦🇺':'au','🇺🇬':'ug','🇧🇷':'br','🇦🇷':'ar','🇯🇵':'jp','🇰🇷':'kr','🇵🇹':'pt','🇳🇱':'nl','🇿🇦':'za','🇰🇪':'ke','🇹🇿':'tz','🇳🇬':'ng','🇬🇭':'gh','🇨🇦':'ca'};
  const symbol = flag || icon || '🌐';
  return codes[symbol] ? <img src={`https://flagcdn.com/w40/${codes[symbol]}.png`} alt="" loading="lazy" className="h-5 w-6 object-contain" /> : <span>{symbol}</span>;
}

function Brand() {
  return <a href="#" aria-label="DailyBet home" className="flex shrink-0 items-center gap-2.5 no-underline">
    <img src="/images/dailybet-icon.svg" alt="" width="38" height="38" className="h-[38px] w-[38px] rounded-lg" />
    <span className="hidden flex-col leading-none sm:flex">
      <span className="text-[24px] font-black tracking-[-1.25px] text-white">daily<span className="text-[#6aa4ff]">Bet</span></span>
      <span className="mt-1 text-[8px] font-bold tracking-[2px] text-blue-100/70">YOUR GAME. YOUR CALL.</span>
    </span>
  </a>;
}

export default function Sportsbook() {
  const [sport, setSport] = useState<string>('Football');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [openSections, setOpenSections] = useState({leagues:true,popular:true,other:true});
  const mainRef = useRef<HTMLElement | null>(null);
  const [filter, setFilter] = useState<'all'|'live'|'upcoming'>('all');
  const [query, setQuery] = useState('');
  const [picks, setPicks] = useState<Pick[]>([]);
  const [stake, setStake] = useState('1000');
  const [slipOpen, setSlipOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const shown = useMemo(() => matches.filter(m => {
    const search = (m.home+' '+m.away+' '+m.league+' '+m.region).toLowerCase().includes(query.toLowerCase());
    return search && (!selectedLeague || m.league===selectedLeague) && (!selectedCountry || m.region===selectedCountry) && (sport==='All' || sport===m.sport || (sport==='Live' && m.live)) && (filter==='all' || (filter==='live' && m.live) || (filter==='upcoming' && !m.live));
  }), [sport, filter, query, selectedLeague, selectedCountry]);
  const combined = picks.reduce((acc,p) => acc*p.price, 1);
  const stakeValue = Math.max(0, Number(stake) || 0);
  const payout = stakeValue*combined;
  const winBonus = picks.length >= 5 ? 125 : picks.length === 4 ? 100 : picks.length === 3 ? 50 : picks.length === 2 ? 25 : 0;
  const sportCatalog = sport === 'Basketball' ? {
    leagues:[{name:'NBA',icon:'🇺🇸'},{name:'EuroLeague',icon:'🇪🇺'},{name:'WNBA',icon:'🇺🇸'},{name:'NCAA',icon:'🇺🇸'}],
    popular:[{name:'United States',region:'UNITED STATES',flag:'🇺🇸'},{name:'Spain',region:'SPAIN',flag:'🇪🇸'},{name:'Turkey',region:'TURKEY',flag:'🇹🇷'}],
    other:[{name:'France',region:'FRANCE',flag:'🇫🇷'},{name:'Italy',region:'ITALY',flag:'🇮🇹'},{name:'Germany',region:'GERMANY',flag:'🇩🇪'},{name:'Australia',region:'AUSTRALIA',flag:'🇦🇺'},{name:'Canada',region:'CANADA',flag:'🇨🇦'},{name:'Uganda',region:'UGANDA',flag:'🇺🇬'}]
  } : sport === 'eFootball' ? {
    leagues:[{name:'eFootball Champions Cup',icon:'🎮'},{name:'eFootball International',icon:'🌐'},{name:'eFootball Pro League',icon:'🏆'}],
    popular:[{name:'Global',region:'GLOBAL',flag:'🌐'},{name:'Europe',region:'EUROPE',flag:'🇪🇺'},{name:'Brazil',region:'BRAZIL',flag:'🇧🇷'}],
    other:[{name:'Japan',region:'JAPAN',flag:'🇯🇵'},{name:'South Korea',region:'SOUTH KOREA',flag:'🇰🇷'},{name:'Argentina',region:'ARGENTINA',flag:'🇦🇷'},{name:'United States',region:'UNITED STATES',flag:'🇺🇸'}]
  } : sport === 'Tennis' ? {
    leagues:[{name:'ATP Singles',icon:'🎾'},{name:'WTA Singles',icon:'🎾'},{name:'Grand Slam',icon:'🏆'},{name:'Challenger Tour',icon:'🌍'}],
    popular:[{name:'France',region:'FRANCE',flag:'🇫🇷'},{name:'United Kingdom',region:'UNITED KINGDOM',flag:'🇬🇧'},{name:'United States',region:'UNITED STATES',flag:'🇺🇸'},{name:'Australia',region:'AUSTRALIA',flag:'🇦🇺'}],
    other:[{name:'Spain',region:'SPAIN',flag:'🇪🇸'},{name:'Italy',region:'ITALY',flag:'🇮🇹'},{name:'Germany',region:'GERMANY',flag:'🇩🇪'},{name:'Uganda',region:'UGANDA',flag:'🇺🇬'}]
  } : {
    leagues:[{name:'Premier League',icon:'🇬🇧'},{name:'La Liga',icon:'🇪🇸'},{name:'Serie A',icon:'🇮🇹'},{name:'Champions League',icon:'🇪🇺'},{name:'Bundesliga',icon:'🇩🇪'},{name:'Ligue 1',icon:'🇫🇷'}],
    popular:[{name:'England',region:'ENGLAND',flag:'🇬🇧'},{name:'Spain',region:'SPAIN',flag:'🇪🇸'},{name:'Italy',region:'ITALY',flag:'🇮🇹'},{name:'Uganda',region:'UGANDA',flag:'🇺🇬'},{name:'United States',region:'UNITED STATES',flag:'🇺🇸'}],
    other:[{name:'Germany',region:'GERMANY',flag:'🇩🇪'},{name:'France',region:'FRANCE',flag:'🇫🇷'},{name:'Portugal',region:'PORTUGAL',flag:'🇵🇹'},{name:'Netherlands',region:'NETHERLANDS',flag:'🇳🇱'},{name:'Brazil',region:'BRAZIL',flag:'🇧🇷'},{name:'Argentina',region:'ARGENTINA',flag:'🇦🇷'},{name:'Japan',region:'JAPAN',flag:'🇯🇵'},{name:'Australia',region:'AUSTRALIA',flag:'🇦🇺'},{name:'South Africa',region:'SOUTH AFRICA',flag:'🇿🇦'},{name:'Kenya',region:'KENYA',flag:'🇰🇪'},{name:'Tanzania',region:'TANZANIA',flag:'🇹🇿'},{name:'Nigeria',region:'NIGERIA',flag:'🇳🇬'},{name:'Ghana',region:'GHANA',flag:'🇬🇭'}]
  };
  const leagueCount = (name: string) => matches.filter(m=>m.sport===sport && m.league===name).length;
  const countryCount = (region: string) => matches.filter(m=>m.sport===sport && m.region===region).length;
  const bonusPicks = picks.map(p => `${p.home} vs ${p.away} · ${p.selection} @ ${p.price.toFixed(2)}`);

  function togglePick(match: Match, label: string, value: string) {
    const key = match.id+'-'+label;
    setPicks(old => old.some(p=>p.key===key) ? old.filter(p=>p.key!==key) : [...old.filter(p=>p.matchId!==match.id), {key,matchId:match.id,selection:label,price:Number(value),home:match.home,away:match.away,league:match.region+' · '+match.league}]);
  }
  function chooseSport(name: string) {
    setSport(name); setFilter('all'); setSelectedLeague(''); setSelectedCountry(''); setMobileMenu(false);
  }
  function chooseLeague(name: string) {
    setSelectedLeague(name); setSelectedCountry(''); setSport('All'); setFilter('all'); setMobileMenu(false);
  }
  function chooseCountry(region: string) {
    setSelectedCountry(region); setSelectedLeague(''); setSport('All'); setFilter('all'); setMobileMenu(false);
  }

  const slip = <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(7,27,73,.05)]">
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
      <div><h2 className="font-extrabold text-slate-900">Bet slip <span className="text-[#1769e0]">({picks.length})</span></h2><p className="mt-1 text-[11px] text-slate-500">Your selections</p></div>
      {picks.length>0 && <button onClick={()=>setPicks([])} className="text-xs font-bold text-slate-500 hover:text-[#1769e0]">Clear all</button>}
      {slipOpen && <button aria-label="Close bet slip" onClick={()=>setSlipOpen(false)} className="rounded-md p-1 text-slate-500"><X size={19}/></button>}
    </div>
    {picks.length===0 ? <div className="px-5 py-10 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#1769e0]"><Ticket size={22}/></div><p className="font-extrabold text-slate-700">Your bet slip is empty</p><p className="mx-auto mt-2 max-w-[220px] text-xs leading-5 text-slate-500">Select odds from a match to add your prediction here.</p></div> :
    <div className="p-4">
      <div className="space-y-3">{picks.map(p=><div key={p.key} className="rounded-lg border border-slate-200 p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-extrabold text-slate-800">{p.home} vs {p.away}</p><p className="mt-1 text-[10px] text-slate-500">{p.league} · Pick {p.selection}</p></div><button aria-label="Remove pick" onClick={()=>setPicks(old=>old.filter(x=>x.key!==p.key))} className="text-slate-400 hover:text-red-500"><X size={16}/></button></div><p className="mt-2 text-sm font-black text-[#1769e0]">{p.price.toFixed(2)}</p></div>)}</div>
      <label className="mt-4 block text-[10px] font-extrabold tracking-wide text-slate-500">STAKE · UGX</label><input type="number" min="0" step="500" value={stake} onChange={e=>setStake(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-3 font-bold outline-none focus:border-blue-500"/>
      <div className="mt-4 flex justify-between text-xs text-slate-500"><span>Combined odds</span><b className="text-slate-800">{combined.toFixed(2)}</b></div>
      <div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-500">Potential return*</span><strong className="text-lg font-black text-[#16804a]">UGX {Math.round(payout).toLocaleString('en-UG')}</strong></div>
      <button onClick={()=>setNotice('Demo only: no real wager has been placed. A licensed sportsbook and verified account are required.')} className="mt-4 w-full rounded-lg bg-[#1769e0] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#0d54bd]">Continue to bet <span aria-hidden="true">→</span></button>
      <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">*Illustrative calculation only. Odds are sample data, not live prices.</p>
    </div>}
  </section>;

  return <div className="min-h-screen pb-40 md:pb-0">
    <header className="sticky top-0 z-30 bg-[#071b49] text-white shadow-md">
      <div className="mx-auto flex h-[62px] max-w-[1480px] items-center gap-4 px-3 sm:px-5 lg:gap-7">
        <button aria-label="Open menu" onClick={()=>setMobileMenu(v=>!v)} className="rounded-md p-1.5 text-white/80 hover:bg-white/10 lg:hidden"><Menu size={22}/></button>
        <Brand/>
        <div className="hidden max-w-[520px] flex-1 items-center rounded-full border border-white/15 bg-white/[.08] px-3 md:flex"><Search size={17} className="shrink-0 text-blue-100/70"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search teams, leagues or matches…" className="w-full rounded-full bg-transparent px-3 py-2.5 text-sm text-white outline-none ring-0 focus:rounded-full focus:outline-none focus:ring-0 placeholder:text-blue-100/60"/></div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2"><button onClick={()=>setNotice('Login will be enabled when the authentication service is connected.')} className="rounded-full border border-white/25 bg-white/[.06] px-3 py-2 text-[11px] font-extrabold tracking-wide text-white shadow-sm transition hover:border-white/50 hover:bg-white/10 sm:px-4 sm:text-sm">Log in</button><button onClick={()=>setNotice('Registration will be enabled after secure account services are connected.')} className="rounded-full bg-gradient-to-r from-[#2d7df0] to-[#1769e0] px-3.5 py-2 text-[11px] font-black tracking-wide text-white shadow-[0_4px_12px_rgba(23,105,224,.35)] ring-1 ring-white/10 transition hover:brightness-110 sm:px-5 sm:text-sm">Join now <span className="ml-0.5 hidden xs:inline">↗</span></button></div>
      </div>
      <nav aria-label="Main navigation" className="flex h-12 items-center gap-1 overflow-x-auto border-t border-white/10 bg-[#091f50] px-3 text-xs font-bold sm:gap-2 sm:px-6">
        <button aria-label="Home" title="Home" onClick={()=>{chooseSport('Football');setFilter('all')}} className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-white/10"><Home size={18}/></button>
        {[
          {label:'Sports',icon:<Trophy size={15}/>,count:'24',click:()=>chooseSport('Football')},
          {label:'Live',icon:<Activity size={15}/>,count:'8',click:()=>{setSport('All');setSelectedLeague('');setSelectedCountry('');setFilter('live');setMobileMenu(false)}},
          {label:'Casino',icon:<Dices size={15}/>,count:'12',click:()=>setNotice('Casino games will be available when an approved casino provider is connected.')},
          {label:'Virtuals',icon:<Gamepad2 size={15}/>,count:'6',click:()=>setNotice('Virtual games will be available when an approved virtual sports provider is connected.')},
          {label:'Popular',icon:<Flame size={15}/>,count:'10',click:()=>{chooseSport('Football');setFilter('all')}},
          {label:'Outrights',icon:<Award size={15}/>,count:'4',click:()=>setNotice('Outright markets will appear when a live sportsbook feed is integrated.')}
        ].map(item=><button key={item.label} onClick={item.click} className="flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-blue-50 transition hover:bg-white/10 sm:px-3"><span className="text-blue-200">{item.icon}</span><span>{item.label}</span><span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-extrabold leading-none text-blue-100">{item.count}</span></button>)}
      </nav>
    </header>

    {mobileMenu && <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Sports menu"><button aria-label="Close menu" onClick={()=>setMobileMenu(false)} className="absolute inset-0 h-full w-full bg-[#04112f]/65 backdrop-blur-[2px]"/><aside className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col overflow-hidden rounded-r-2xl border-r border-white/20 bg-[#f7f9fd] shadow-2xl"><div className="flex items-center justify-between bg-[#071b49] px-4 py-4 text-white"><div className="flex items-center gap-3"><img src="/images/dailybet-icon.svg" alt="" className="h-9 w-9 rounded-lg"/><div><p className="text-sm font-black">Sports menu</p><p className="mt-0.5 text-[10px] text-blue-100/70">Find your next match</p></div></div><button aria-label="Close menu" onClick={()=>setMobileMenu(false)} className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"><X size={19}/></button></div><div className="flex-1 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><label className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Search size={16} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search teams or leagues…" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"/></label><div className="mb-4 grid grid-cols-2 gap-2">{[{name:"Football",icon:"⚽"},{name:"Basketball",icon:"🏀"},{name:"eFootball",icon:"🎮"},{name:"Tennis",icon:"🎾"}].map(item=><button key={item.name} onClick={()=>chooseSport(item.name)} className={"flex min-h-[66px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-extrabold transition "+(sport===item.name?"border-[#1769e0] bg-blue-50 text-[#1769e0] shadow-sm":"border-slate-200 bg-white text-slate-600 hover:border-blue-200")}><span className="text-xl leading-none">{item.icon}</span>{item.name}</button>)}</div>{[{key:"leagues",title:"LEAGUES",icon:<Trophy size={14}/>,items:sportCatalog.leagues,type:"league"},{key:"popular",title:"POPULAR COUNTRIES",icon:<Flame size={14}/>,items:sportCatalog.popular,type:"country"},{key:"other",title:"OTHER COUNTRIES",icon:<Globe size={14}/>,items:sportCatalog.other,type:"country"}].map(section=><section key={section.key} className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-white"><button onClick={()=>setOpenSections(old=>({...old,[section.key]:!old[section.key as keyof typeof old]}))} aria-expanded={openSections[section.key as keyof typeof openSections]} className="flex w-full items-center justify-between bg-slate-50 px-3 py-3 text-left"><span className="flex items-center gap-2 text-[10px] font-black tracking-[1.2px] text-slate-600"><span className="text-[#1769e0]">{section.icon}</span>{section.title}</span><ChevronDown size={15} className={"text-slate-400 transition-transform "+(openSections[section.key as keyof typeof openSections]?"":"-rotate-90")}/></button>{openSections[section.key as keyof typeof openSections]&&<div className="space-y-0.5 p-1.5">{section.items.map((item:any)=>{const count=section.type==="league"?leagueCount(item.name):countryCount(item.region);const active=section.type==="league"?selectedLeague===item.name:selectedCountry===item.region;return <button key={item.name} onClick={()=>section.type==="league"?chooseLeague(item.name):chooseCountry(item.region)} className={"group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition "+(active?"bg-blue-50 text-[#1769e0]":"text-slate-600 hover:bg-slate-50")}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-100 bg-white text-base shadow-sm"><FlagBadge flag={item.flag||item.icon} icon={item.icon}/></span><span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{item.name}</span><span className="min-w-[21px] rounded-full bg-slate-100 px-1.5 py-1 text-center text-[9px] font-extrabold tabular-nums text-slate-500">{count}</span><ChevronDown size={13} className="-rotate-90 text-slate-300 transition group-hover:text-[#1769e0]"/></button>})}</div>}</section>)}{(selectedLeague||selectedCountry)&&<button onClick={()=>{setSelectedLeague("");setSelectedCountry("");setSport("Football");setFilter("all");setMobileMenu(false)}} className="mb-3 w-full rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-[11px] font-extrabold text-[#1769e0]">Clear selection</button>}<div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3"><p className="text-[10px] font-extrabold text-emerald-800">Play responsibly</p><p className="mt-1 text-[10px] leading-4 text-emerald-800/70">Only bet what you can afford to lose.</p></div></div><div className="border-t border-slate-200 bg-white p-3"><button onClick={()=>{setMobileMenu(false);setNotice("Account and wallet features are not connected yet.")}} className="w-full rounded-xl bg-[#071b49] px-4 py-3 text-xs font-extrabold text-white">Account & wallet <span className="float-right">→</span></button></div></aside></div>}

    <div className="mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-4 px-2.5 py-4 sm:px-4 lg:grid-cols-[205px_minmax(0,1fr)_300px] lg:gap-4 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <aside className="hidden max-h-[calc(100vh-140px)] overflow-y-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_8px_28px_rgba(7,27,73,.06)] hover:overflow-y-auto lg:block">
        <div className="mb-4 grid grid-cols-2 gap-2">
          {[{name:'Football',icon:'⚽'},{name:'Basketball',icon:'🏀'},{name:'eFootball',icon:'🎮'},{name:'Tennis',icon:'🎾'}].map(item=><button key={item.name} onClick={()=>chooseSport(item.name)} className={'flex min-h-[66px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-extrabold transition '+(sport===item.name?'border-[#1769e0] bg-blue-50 text-[#1769e0] shadow-sm':'border-slate-100 bg-slate-50/80 text-slate-600 hover:border-blue-200 hover:bg-blue-50/60')}><span className="text-xl leading-none">{item.icon}</span>{item.name}</button>)}
        </div>
        {[
          {key:'leagues',title:'LEAGUES',icon:<Trophy size={14}/>,items:sportCatalog.leagues,type:'league'},
          {key:'popular',title:'POPULAR COUNTRIES',icon:<Flame size={14}/>,items:sportCatalog.popular,type:'country'},
          {key:'other',title:'OTHER COUNTRIES',icon:<Globe size={14}/>,items:sportCatalog.other,type:'country'}
        ].map(section=><section key={section.key} className="mb-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <button onClick={()=>setOpenSections(old=>({...old,[section.key]:!old[section.key as keyof typeof old]}))} aria-expanded={openSections[section.key as keyof typeof openSections]} className="flex w-full items-center justify-between bg-slate-50/80 px-3 py-3 text-left"><span className="flex items-center gap-2 text-[10px] font-black tracking-[1.2px] text-slate-600"><span className="text-[#1769e0]">{section.icon}</span>{section.title}</span><ChevronDown size={15} className={'text-slate-400 transition-transform '+(openSections[section.key as keyof typeof openSections]?'':'-rotate-90')}/></button>
          {openSections[section.key as keyof typeof openSections]&&<div className="space-y-0.5 p-1.5">{section.items.map((item:any)=>{const count=section.type==='league'?leagueCount(item.name):countryCount(item.region);const active=section.type==='league'?selectedLeague===item.name:selectedCountry===item.region;return <button key={item.name} onClick={()=>section.type==='league'?chooseLeague(item.name):chooseCountry(item.region)} className={'group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition '+(active?'bg-blue-50 text-[#1769e0]':'text-slate-600 hover:bg-slate-50')}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-100 bg-white text-base shadow-sm"><FlagBadge flag={item.flag||item.icon} icon={item.icon}/></span><span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{item.name}</span><span className="min-w-[21px] rounded-full bg-slate-100 px-1.5 py-1 text-center text-[9px] font-extrabold tabular-nums text-slate-500">{count}</span><ChevronDown size={13} className="-rotate-90 text-slate-300 transition group-hover:text-[#1769e0]"/></button>})}</div>}
        </section>)}
        {(selectedLeague||selectedCountry)&&<button onClick={()=>{setSelectedLeague('');setSelectedCountry('');setSport('Football');setFilter('all')}} className="mb-3 w-full rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-[11px] font-extrabold text-[#1769e0] transition hover:bg-blue-100">Clear selection</button>}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3"><p className="text-[10px] font-extrabold text-emerald-800">Play responsibly</p><p className="mt-1 text-[10px] leading-4 text-emerald-800/70">Only bet what you can afford to lose.</p></div>
      </aside>

      <main ref={mainRef} className="min-w-0 lg:max-h-[calc(100vh-140px)] lg:overflow-y-hidden lg:overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hover:overflow-y-auto">
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
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-[10px] leading-4 text-slate-500"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[#1769e0]"/><p><b className="text-slate-700">Preview environment.</b> Fixtures and prices are illustrative, not live. Real-time odds and bet placement are disabled until approved sportsbook infrastructure is connected.</p></div><div className="flex justify-center py-6"><button onClick={()=>mainRef.current?.scrollTo({top:0,behavior:"smooth"})} className="inline-flex items-center gap-2 rounded-full border border-[#d7e5ff] bg-white px-5 py-2.5 text-xs font-extrabold text-[#1769e0] shadow-[0_4px_16px_rgba(7,27,73,.08)] transition hover:border-[#1769e0] hover:bg-blue-50"><ArrowDown size={14} className="rotate-180"/>Back to top</button></div>
      </main>

      <aside className="hidden max-h-[calc(100vh-140px)] space-y-3 overflow-y-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden hover:overflow-y-auto lg:block">        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <label htmlFor="booking-code" className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-wide text-slate-600"><Search size={14}/>BOOKING CODE SEARCH</label>
          <div className="flex gap-2">
            <input id="booking-code" value={bookingCode} onChange={e=>setBookingCode(e.target.value)} placeholder="Enter booking code" className="min-w-0 w-full rounded-full border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:rounded-full focus:border-blue-400 focus:outline-none focus:ring-0"/>
            <button onClick={()=>setNotice(bookingCode.trim() ? 'Booking code lookup will be enabled when the sportsbook provider is connected.' : 'Enter a booking code to search.')} className="shrink-0 rounded-full bg-[#1769e0] px-3 py-2 text-[10px] font-extrabold text-white hover:bg-[#0d54bd]">Search</button>
          </div>
        </section>
{slip}<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-sm font-extrabold"><Sparkles size={17} className="text-[#1769e0]"/>New to DailyBet?</div><p className="mt-2 text-[11px] leading-5 text-slate-500">A clear, mobile-friendly home for the sports and markets you follow. Account and payment features are being prepared.</p><button onClick={()=>setNotice('Secure registration will be available after the authentication service is connected.')} className="mt-3 text-xs font-extrabold text-[#1769e0]">Create an account →</button></section><section className="rounded-xl bg-[#071b49] p-4 text-white"><div className="flex items-center gap-2 text-xs font-extrabold"><Zap size={15} className="text-blue-300"/>DailyBet promise</div><p className="mt-2 text-[11px] leading-5 text-blue-100/75">A simple experience, transparent selections and responsible play at every step.</p></section></aside>
    </div>

    <footer className="mx-auto flex max-w-[1480px] flex-col gap-2 px-4 pb-8 pt-2 text-[10px] leading-5 text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 DailyBet · UI preview</span><span>Help · Terms · Privacy · Responsible play</span><span className="font-bold">18+ only · Play responsibly</span></footer>

    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <section aria-live="polite" className="border-t border-blue-300/20 bg-[#0b2458] px-3 pb-2 pt-2 text-white shadow-[0_-6px_24px_rgba(7,27,73,.25)]">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold leading-4">{picks.length===0 ? 'Add legs for up to a 125% Win Bonus' : `Combined odds: ${combined.toFixed(2)} · Win bonus: ${winBonus}%`}</p>
          {picks.length>0 && <button onClick={()=>setSlipOpen(true)} className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-blue-100">View slip ({picks.length})</button>}
        </div>
        {picks.length>0 && <div className="max-h-14 overflow-y-auto text-[10px] leading-4 text-blue-100/80">{bonusPicks.join('  •  ')}</div>}
      </section>
      <nav aria-label="Mobile navigation" className="flex justify-around border-t border-white/10 bg-[#071b49]/95 px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_28px_rgba(7,27,73,.32)] backdrop-blur-xl">
        {[{label:"Menu",icon:<Menu size={19}/>,click:()=>setMobileMenu(true)},{label:"Live",icon:<Activity size={19}/>,click:()=>{setSport("All");setFilter("live");setMobileMenu(false)}},{label:"Sports",icon:<Flame size={19}/>,click:()=>{chooseSport("Football");setFilter("all")}},{label:"Bet slip",icon:<Ticket size={19}/>,click:()=>setSlipOpen(true)},{label:"Account",icon:<Wallet size={19}/>,click:()=>setNotice("Account and wallet features are not connected yet.")}].map((item,i)=><button key={item.label} onClick={item.click} className={"relative flex min-w-[54px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[9px] font-extrabold transition "+((i===0&&mobileMenu)||(i===3&&slipOpen)?"bg-white/10 text-white":"text-blue-100/75 hover:bg-white/[.07] hover:text-white")}><span className="relative">{item.icon}{i===3&&picks.length>0&&<span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#1769e0] px-1 text-[9px] text-white">{picks.length}</span>}</span>{item.label}</button>)}
      </nav>
    </div>

    {slipOpen&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#071b49]/55 sm:items-center lg:hidden" onClick={e=>{if(e.target===e.currentTarget)setSlipOpen(false)}}><div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white p-3 pb-[max(16px,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-2xl">{slip}</div></div>}
    {notice&&<div role="status" className="fixed bottom-20 left-1/2 z-[60] flex w-[calc(100%-24px)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl bg-[#071b49] px-4 py-3.5 text-xs leading-5 text-white shadow-xl lg:bottom-6"><Smartphone size={17} className="mt-0.5 shrink-0 text-blue-300"/><p className="flex-1">{notice}</p><button aria-label="Dismiss" onClick={()=>setNotice('')} className="shrink-0 text-white/70 hover:text-white"><X size={17}/></button></div>}
  </div>;
}

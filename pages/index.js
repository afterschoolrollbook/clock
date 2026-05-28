import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

// ─── 번역 ───────────────────────────────────────────
const T = {
  ko: {
    metaTitle: 'Clock-Down — 무료 온라인 시계 | 알람·타이머·스탑워치·세계시각·포모도로',
    metaDesc: '알람, 타이머, 스탑워치, 세계시각, 포모도로가 모두 있는 무료 온라인 시계.',
    badge: '무료 · 알람 · 타이머 · 포모도로',
    logoText: 'CLOCK',
    langBtn: '🇺🇸 EN',
    tabs: ['시계','스탑워치','타이머','알람','세계시각','포모도로'],
    tabIcons: ['🕐','⏱','⏳','🔔','🌍','🍅'],
    digital: '디지털', analog: '아날로그',
    start: '시작', pause: '일시정지', resume: '계속', stop: '정지', reset: '초기화', lap: '랩', add: '추가', skip: '건너뛰기',
    hours: '시간', mins: '분', secs: '초',
    noAlarm: '등록된 알람이 없습니다',
    once: '반복 없음', everyday: '매일 반복', weekly: '매주 ',
    days: ['월','화','수','목','금','토','일'],
    weekdays: ['일','월','화','수','목','금','토'],
    best: '최고', worst: '최저',
    presets: [['1시간',3600],['30분',1800],['10분',600],['5분',300],['3분',180],['1분',60]],
    regions: ['전체','아시아','유럽','아메리카','오세아니아','중동·아프리카'],
    diffFrom: '서울 기준',
    pomModes: ['집중','짧은 휴식','긴 휴식'],
    pomPhase: ['FOCUS','SHORT BREAK','LONG BREAK'],
    pomFocus: '집중 (분)', pomShort: '짧은 휴식 (분)', pomLong: '긴 휴식 (분)', pomSessions: '세션 수',
    pomStats: '오늘 통계', sessions: '완료 세션', focusMins: '집중 분', sets: '완료 세트',
    alarmLabel: '알람 이름 (선택)', alarmDismiss: '끄기', alarmTag: '알람',
    footer: '© 2024 Clock-Down. 무료 온라인 시계.',
    adLabel: '광고',
    settings: '시간 설정',
  },
  en: {
    metaTitle: 'Clock-Down — Free Online Clock | Alarm · Timer · Stopwatch · World Clock · Pomodoro',
    metaDesc: 'Free online clock with alarm, timer, stopwatch, world clock, and pomodoro.',
    badge: 'Free · Alarm · Timer · Pomodoro',
    logoText: 'CLOCK',
    langBtn: '🇰🇷 한국어',
    tabs: ['Clock','Stopwatch','Timer','Alarm','World','Pomodoro'],
    tabIcons: ['🕐','⏱','⏳','🔔','🌍','🍅'],
    digital: 'Digital', analog: 'Analog',
    start: 'Start', pause: 'Pause', resume: 'Resume', stop: 'Stop', reset: 'Reset', lap: 'Lap', add: 'Add', skip: 'Skip',
    hours: 'Hours', mins: 'Min', secs: 'Sec',
    noAlarm: 'No alarms set',
    once: 'Once', everyday: 'Every day', weekly: 'Every ',
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    best: 'Best', worst: 'Worst',
    presets: [['1hr',3600],['30m',1800],['10m',600],['5m',300],['3m',180],['1m',60]],
    regions: ['All','Asia','Europe','Americas','Oceania','Mid East·Africa'],
    diffFrom: 'from Seoul',
    pomModes: ['Focus','Short Break','Long Break'],
    pomPhase: ['FOCUS','SHORT BREAK','LONG BREAK'],
    pomFocus: 'Focus (min)', pomShort: 'Short break (min)', pomLong: 'Long break (min)', pomSessions: 'Sessions',
    pomStats: 'Today', sessions: 'Sessions', focusMins: 'Focus min', sets: 'Sets',
    alarmLabel: 'Label (optional)', alarmDismiss: 'Dismiss', alarmTag: 'ALARM',
    footer: '© 2024 Clock-Down. Free Online Clock.',
    adLabel: 'Ad',
    settings: 'Settings',
  },
}

const CITIES = [
  {ko:'서울',en:'Seoul',tz:'Asia/Seoul',r:0},{ko:'도쿄',en:'Tokyo',tz:'Asia/Tokyo',r:0},
  {ko:'베이징',en:'Beijing',tz:'Asia/Shanghai',r:0},{ko:'방콕',en:'Bangkok',tz:'Asia/Bangkok',r:0},
  {ko:'싱가포르',en:'Singapore',tz:'Asia/Singapore',r:0},{ko:'뭄바이',en:'Mumbai',tz:'Asia/Kolkata',r:0},
  {ko:'런던',en:'London',tz:'Europe/London',r:1},{ko:'파리',en:'Paris',tz:'Europe/Paris',r:1},
  {ko:'베를린',en:'Berlin',tz:'Europe/Berlin',r:1},{ko:'모스크바',en:'Moscow',tz:'Europe/Moscow',r:1},
  {ko:'이스탄불',en:'Istanbul',tz:'Europe/Istanbul',r:1},
  {ko:'뉴욕',en:'New York',tz:'America/New_York',r:2},{ko:'LA',en:'Los Angeles',tz:'America/Los_Angeles',r:2},
  {ko:'시카고',en:'Chicago',tz:'America/Chicago',r:2},{ko:'토론토',en:'Toronto',tz:'America/Toronto',r:2},
  {ko:'상파울루',en:'São Paulo',tz:'America/Sao_Paulo',r:2},
  {ko:'시드니',en:'Sydney',tz:'Australia/Sydney',r:3},{ko:'오클랜드',en:'Auckland',tz:'Pacific/Auckland',r:3},
  {ko:'두바이',en:'Dubai',tz:'Asia/Dubai',r:4},{ko:'카이로',en:'Cairo',tz:'Africa/Cairo',r:4},
]

const pad = (n, d=2) => String(Math.floor(n)).padStart(d,'0')
const CIRC = 2 * Math.PI * 96

function AdSlot({ slot, tall=false, label='광고' }) {
  const ref = useRef(null)
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  useEffect(() => {
    if (!client || !ref.current) return
    try { ;(window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [client])
  if (!client) return (
    <div className={`ad-slot${tall?' tall':''}`}>
      <span>📢</span><span style={{fontSize:11}}>{label} 영역</span>
    </div>
  )
  return (
    <div>
      <p className="ad-tag">{label}</p>
      <ins ref={ref} className="adsbygoogle" style={{display:'block'}}
        data-ad-client={client} data-ad-slot={slot}
        data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  )
}

// ─── 아날로그 시계 SVG ───────────────────────────────
function AnalogClock({ now }) {
  const h = now.getHours()%12, m = now.getMinutes(), s = now.getSeconds()
  const ha = (h/12 + m/720)*360 - 90
  const ma = (m/60 + s/3600)*360 - 90
  const sa = (s/60)*360 - 90
  const handEnd = (angle, len) => ({
    x: (150 + len * Math.cos(angle*Math.PI/180)).toFixed(1),
    y: (150 + len * Math.sin(angle*Math.PI/180)).toFixed(1),
  })
  const handTail = (angle, tail) => ({
    x: (150 + tail * Math.cos((angle+180)*Math.PI/180)).toFixed(1),
    y: (150 + tail * Math.sin((angle+180)*Math.PI/180)).toFixed(1),
  })
  const ticks = Array.from({length:60},(_,i)=>{
    const a = (i/60)*360-90, big=i%5===0
    const r1=big?128:134, r2=138
    return { x1:(150+r1*Math.cos(a*Math.PI/180)).toFixed(1), y1:(150+r1*Math.sin(a*Math.PI/180)).toFixed(1), x2:(150+r2*Math.cos(a*Math.PI/180)).toFixed(1), y2:(150+r2*Math.sin(a*Math.PI/180)).toFixed(1), big }
  })
  const nums = Array.from({length:12},(_,i)=>{
    const a=((i+1)/12)*360-90, r=112
    return { x:(150+r*Math.cos(a*Math.PI/180)).toFixed(1), y:(150+r*Math.sin(a*Math.PI/180)).toFixed(1), n:i+1 }
  })
  return (
    <svg width="300" height="300" viewBox="0 0 300 300" style={{filter:'drop-shadow(0 0 20px rgba(255,255,255,0.06))'}}>
      <circle cx="150" cy="150" r="145" fill="#1c1914" stroke="#2e2820" strokeWidth="2"/>
      <circle cx="150" cy="150" r="138" fill="none" stroke="#252118" strokeWidth="1"/>
      {ticks.map((t,i)=><line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.big?'#3a3a3a':'#222'} strokeWidth={t.big?2:1}/>)}
      <g fontFamily="Orbitron,monospace" fontSize="12" fill="#5a4f3a" textAnchor="middle" dominantBaseline="central">
        {nums.map(n=><text key={n.n} x={n.x} y={n.y}>{n.n}</text>)}
      </g>
      <line x1={handTail(ha,15).x} y1={handTail(ha,15).y} x2={handEnd(ha,70).x} y2={handEnd(ha,70).y} stroke="#c9a84c" strokeWidth="5" strokeLinecap="round"/>
      <line x1={handTail(ma,15).x} y1={handTail(ma,15).y} x2={handEnd(ma,55).x} y2={handEnd(ma,55).y} stroke="#9a8a6a" strokeWidth="3" strokeLinecap="round"/>
      <line x1={handTail(sa,18).x} y1={handTail(sa,18).y} x2={handEnd(sa,42).x} y2={handEnd(sa,42).y} stroke="#5a4f3a" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="150" cy="150" r="5" fill="#12100d"/>
      <circle cx="150" cy="150" r="2" fill="#12100d"/>
    </svg>
  )
}

export default function Home() {
  const [lang, setLang] = useState('ko')
  const [tab, setTab] = useState(0)
  const [now, setNow] = useState(new Date())
  const [adsOn, setAdsOn] = useState(true)
  const t = T[lang]

  // clock mode
  const [cMode, setCMode] = useState('digital')

  // stopwatch
  const [swEl, setSwEl] = useState(0)
  const [swRun, setSwRun] = useState(false)
  const swTs = useRef(0); const swIv = useRef(null)
  const [swLaps, setSwLaps] = useState([])
  const swLastLap = useRef(0)

  // timer
  const [tH, setTH] = useState(0); const [tM, setTM] = useState(0); const [tS, setTS] = useState(0)
  const [tLeft, setTLeft] = useState(0); const [tTotal, setTTotal] = useState(0)
  const [tRun, setTRun] = useState(false)
  const tIv = useRef(null); const tLeftRef = useRef(0); const tTotalRef = useRef(0)

  // alarm
  const [alarms, setAlarms] = useState([])
  const [aTime, setATime] = useState('')
  const [aLabel, setALabel] = useState('')
  const [selDays, setSelDays] = useState([])
  const [ringingId, setRingingId] = useState(null)
  const beepLp = useRef(null)

  // world
  const [region, setRegion] = useState(-1)
  const [wcTimes, setWcTimes] = useState({})

  // pomodoro
  const [pomPhase, setPomPhase] = useState(0)
  const [pomSet, setPomSet] = useState(0)
  const [pomLeft, setPomLeft] = useState(25*60)
  const [pomTotal, setPomTotal] = useState(25*60)
  const [pomRun, setPomRun] = useState(false)
  const pomIv = useRef(null)
  const [pomFocusMin, setPomFocusMin] = useState(25)
  const [pomShortMin, setPomShortMin] = useState(5)
  const [pomLongMin, setPomLongMin] = useState(15)
  const [pomSessions, setPomSessions] = useState(4)
  const [pomTotalFocus, setPomTotalFocus] = useState(0)
  const [pomTotalMins, setPomTotalMins] = useState(0)
  const [pomTotalSets, setPomTotalSets] = useState(0)
  const pomPhaseRef = useRef(0); const pomSetRef = useRef(0)
  const pomLeftRef = useRef(25*60); const pomTotalRef = useRef(25*60)
  const pomRunRef = useRef(false)

  // audio
  const audioCtx = useRef(null)
  const beep = useCallback((f=880,d=.4,v=.25) => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext||window.webkitAudioContext)()
      const o=audioCtx.current.createOscillator(), g=audioCtx.current.createGain()
      o.connect(g); g.connect(audioCtx.current.destination)
      o.frequency.value=f
      g.gain.setValueAtTime(v, audioCtx.current.currentTime)
      g.gain.exponentialRampToValueAtTime(.001, audioCtx.current.currentTime+d)
      o.start(); o.stop(audioCtx.current.currentTime+d)
    } catch {}
  }, [])
  const alarmBeep = useCallback(() => {
    [880,1100,880].forEach((f,i) => setTimeout(()=>beep(f,.3,.35), i*380))
  }, [beep])

  // main tick
  useEffect(() => {
    const iv = setInterval(() => {
      const n = new Date()
      setNow(n)
      // check alarms
      if (n.getSeconds() === 0) {
        const hh=pad(n.getHours()), mm=pad(n.getMinutes()), cur=`${hh}:${mm}`
        const di = n.getDay()===0?6:n.getDay()-1
        setAlarms(prev => {
          prev.forEach(a => {
            if (!a.on || a.time!==cur) return
            if (a.days?.length && !a.days.includes(di)) return
            setRingingId(a.id)
          })
          return prev
        })
      }
      // world clock
      setWcTimes(prev => {
        const next = {...prev}
        CITIES.forEach(c => {
          next[c.tz] = n.toLocaleTimeString('ko-KR',{timeZone:c.tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})
        })
        return next
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  // alarm ring
  useEffect(() => {
    if (ringingId !== null) {
      alarmBeep()
      beepLp.current = setInterval(alarmBeep, 1500)
    }
    return () => clearInterval(beepLp.current)
  }, [ringingId, alarmBeep])

  // load alarms + settings
  useEffect(() => {
    const saved = localStorage.getItem('clkdown_alarms')
    if (saved) setAlarms(JSON.parse(saved))
    const l = localStorage.getItem('clkdown_lang')
    if (l) setLang(l)
    fetch('/api/settings/get').then(r=>r.json()).then(d=>{if(d.adsOn!==undefined)setAdsOn(d.adsOn)}).catch(()=>{})
  }, [])

  const saveAlarms = (list) => localStorage.setItem('clkdown_alarms', JSON.stringify(list))

  const toggleLang = () => {
    const next = lang==='ko'?'en':'ko'
    setLang(next); localStorage.setItem('clkdown_lang', next)
  }

  // ── STOPWATCH ──
  const swToggle = () => {
    if (!swRun) {
      swTs.current = Date.now() - swEl
      swIv.current = setInterval(() => setSwEl(Date.now()-swTs.current), 31)
      setSwRun(true)
    } else {
      clearInterval(swIv.current); setSwRun(false)
    }
  }
  const swLap = () => {
    if (!swRun) return
    const lt = swEl - swLastLap.current; swLastLap.current = swEl
    setSwLaps(prev => [...prev, {total:swEl, lap:lt}])
    beep(1320,.1,.2)
  }
  const swReset = () => {
    clearInterval(swIv.current); setSwRun(false); setSwEl(0); setSwLaps([]); swLastLap.current=0
  }
  const swFmt = (ms) => `${pad(Math.floor(ms/60000))}:${pad(Math.floor(ms%60000/1000))}.${String(ms%1000).padStart(3,'0')}`

  // ── TIMER ──
  const tToggle = () => {
    if (!tRun) {
      let left = tLeftRef.current
      if (left === 0) {
        const total = tH*3600+tM*60+tS
        if (!total) return
        left = total; tTotalRef.current = total; tLeftRef.current = total
        setTTotal(total); setTLeft(total)
      }
      setTRun(true)
      tIv.current = setInterval(() => {
        tLeftRef.current--
        setTLeft(tLeftRef.current)
        if (tLeftRef.current <= 0) {
          clearInterval(tIv.current); setTRun(false)
          for(let i=0;i<6;i++) setTimeout(()=>beep(660,.5,.4), i*650)
        }
      }, 1000)
    } else {
      clearInterval(tIv.current); setTRun(false)
    }
  }
  const tReset = () => {
    clearInterval(tIv.current); setTRun(false)
    tLeftRef.current=0; setTLeft(0); setTTotal(0); tTotalRef.current=0
  }
  const setPreset = (sec) => { tReset(); setTH(Math.floor(sec/3600)); setTM(Math.floor(sec%3600/60)); setTS(sec%60) }

  // ── ALARM ──
  const addAlarm = () => {
    if (!aTime) return
    const label = aLabel.trim() || (lang==='ko'?'알람':'Alarm')
    const next = [...alarms, {id:Date.now(), time:aTime, label, on:true, days:[...selDays]}]
    setAlarms(next); saveAlarms(next)
    setATime(''); setALabel(''); setSelDays([])
  }
  const toggleDay = (d) => setSelDays(prev => prev.includes(d)?prev.filter(x=>x!==d):[...prev,d])
  const togAlarm = (id) => { const next=alarms.map(a=>a.id===id?{...a,on:!a.on}:a); setAlarms(next); saveAlarms(next) }
  const delAlarm = (id) => { const next=alarms.filter(a=>a.id!==id); setAlarms(next); saveAlarms(next) }
  const stopAlarm = () => {
    clearInterval(beepLp.current)
    const a = alarms.find(x=>x.id===ringingId)
    if (a && (!a.days?.length)) { const next=alarms.map(x=>x.id===ringingId?{...x,on:false}:x); setAlarms(next); saveAlarms(next) }
    setRingingId(null)
  }
  const repLabel = (days) => {
    if (!days?.length) return t.once
    if (days.length===7) return t.everyday
    return t.weekly + [...days].sort().map(d=>t.days[d]).join(' ')
  }

  // ── WORLD ──
  const getTzOff = (tz) => {
    try {
      const s = now.toLocaleString('en-US',{timeZone:tz,timeZoneName:'shortOffset'})
      const m = s.match(/GMT([+-]\d+(?::\d+)?)/)
      if (m){const p=m[1].split(':');return parseInt(p[0])*60+(parseInt(p[1]||0)*(parseInt(p[0])<0?-1:1))}
    } catch {}
    return 0
  }
  const seoulOff = getTzOff('Asia/Seoul')
  const filteredCities = region===-1?CITIES:CITIES.filter(c=>c.r===region)

  // ── POMODORO ──
  const pomSec = useCallback((phase) => {
    return [pomFocusMin*60, pomShortMin*60, pomLongMin*60][phase]
  }, [pomFocusMin, pomShortMin, pomLongMin])

  const pomAdvance = useCallback(() => {
    const maxS = pomSessions
    clearInterval(pomIv.current); pomRunRef.current=false
    let nextPhase, nextSet=pomSetRef.current
    if (pomPhaseRef.current===0) {
      setPomTotalFocus(p=>p+1); setPomTotalMins(p=>p+pomFocusMin)
      nextSet++
      if (nextSet>=maxS) { nextSet=0; setPomTotalSets(p=>p+1); nextPhase=2 }
      else nextPhase=1
    } else { nextPhase=0 }
    pomPhaseRef.current=nextPhase; pomSetRef.current=nextSet
    setPomPhase(nextPhase); setPomSet(nextSet)
    const left=pomFocusMin*60*[1,pomShortMin/pomFocusMin,pomLongMin/pomFocusMin][nextPhase]
    const sec=[pomFocusMin*60,pomShortMin*60,pomLongMin*60][nextPhase]
    pomLeftRef.current=sec; pomTotalRef.current=sec
    setPomLeft(sec); setPomTotal(sec); setPomRun(true); pomRunRef.current=true
    pomIv.current = setInterval(() => {
      pomLeftRef.current--; setPomLeft(pomLeftRef.current)
      if (pomLeftRef.current<=0) pomAdvance()
    },1000)
    for(let i=0;i<4;i++) setTimeout(()=>beep(nextPhase===0?880:660,.3,.3),i*500)
  }, [pomSessions, pomFocusMin, pomShortMin, pomLongMin, beep])

  const pomToggle = () => {
    if (!pomRun) {
      setPomRun(true); pomRunRef.current=true
      pomIv.current = setInterval(()=>{
        pomLeftRef.current--; setPomLeft(pomLeftRef.current)
        if(pomLeftRef.current<=0) pomAdvance()
      },1000)
    } else {
      clearInterval(pomIv.current); setPomRun(false); pomRunRef.current=false
    }
  }
  const pomSkip = () => { clearInterval(pomIv.current); pomAdvance() }
  const pomReset = () => {
    clearInterval(pomIv.current); setPomRun(false); pomRunRef.current=false
    pomPhaseRef.current=0; pomSetRef.current=0
    setPomPhase(0); setPomSet(0)
    const sec=pomFocusMin*60; pomLeftRef.current=sec; pomTotalRef.current=sec
    setPomLeft(sec); setPomTotal(sec)
  }
  const pomJump = (i) => {
    clearInterval(pomIv.current); setPomRun(false); pomRunRef.current=false
    pomPhaseRef.current=i; setPomPhase(i)
    const sec=pomSec(i); pomLeftRef.current=sec; pomTotalRef.current=sec
    setPomLeft(sec); setPomTotal(sec)
  }

  // date format
  const dateStr = lang==='ko'
    ? `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 (${t.weekdays[now.getDay()]})`
    : now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  const pomArcOffset = pomTotal>0 ? CIRC*(1-pomLeft/pomTotal) : 0

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`} crossOrigin="anonymous" />
        )}
      </Head>

      {/* 알람 배너 */}
      {ringingId !== null && (
        <div className="ring-banner show">
          <div className="rb-tag">{t.alarmTag}</div>
          <div className="rb-name">{alarms.find(a=>a.id===ringingId)?.label || t.alarmTag}</div>
          <button className="rb-stop" onClick={stopAlarm}>{t.alarmDismiss}</button>
        </div>
      )}

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <div className="logo-icon">⏱</div>
            <span className="logo-text">{t.logoText}<span>-DOWN</span></span>
          </a>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <a href="/blog" style={{color:'#9a8a6a',fontSize:13,fontWeight:600,textDecoration:'none'}}>
              {lang==='ko'?'블로그':'Blog'}
            </a>
            <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
          </div>
        </div>
      </header>

      {/* 상단 광고 */}
      {adsOn && (
        <div style={{maxWidth:1400,margin:'0 auto',padding:'12px 20px'}}>
          <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP||'1111111111'} label={t.adLabel} />
        </div>
      )}

      <div className="page-layout">
        {/* 사이드바 네비 */}
        <nav className="sidebar-nav">
          {t.tabs.map((name,i) => (
            <div key={i} className={`nav-item${tab===i?' active':''}`} onClick={()=>setTab(i)}>
              <span className="nav-icon">{t.tabIcons[i]}</span>
              <span className="nav-label">{name}</span>
            </div>
          ))}
        </nav>

        {/* 메인 */}
        <div className="main-content">

          {/* ── 시계 ── */}
          <div className={`panel${tab===0?' active':''}`}>
            <div className="clock-mode-row">
              <button className={`cmode-btn${cMode==='digital'?' active':''}`} onClick={()=>setCMode('digital')}>{t.digital}</button>
              <button className={`cmode-btn${cMode==='analog'?' active':''}`} onClick={()=>setCMode('analog')}>{t.analog}</button>
            </div>
            {cMode==='digital' && (
              <div className="digital-clock">
                <div className="dig-time">
                  <span>{pad(now.getHours())}</span>
                  <span className="dig-sep">:</span>
                  <span>{pad(now.getMinutes())}</span>
                  <span className="dig-sec">:<span>{pad(now.getSeconds())}</span></span>
                </div>
                <div className="dig-date">{dateStr}</div>
              </div>
            )}
            {cMode==='analog' && (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <AnalogClock now={now} />
                <div className="dig-date" style={{marginTop:16}}>{dateStr}</div>
              </div>
            )}
          </div>

          {/* ── 스탑워치 ── */}
          <div className={`panel${tab===1?' active':''}`}>
            <div className="card">
              <div className={`big-num${swRun?' running':''}`}>{swFmt(swEl)}</div>
              <div className="btn-row" style={{marginBottom:14}}>
                <button className={`btn${swRun?' stop':' go'}`} onClick={swToggle}>
                  {swRun ? t.stop : (swEl>0 ? t.resume : t.start)}
                </button>
                <button className="btn" onClick={swLap} disabled={!swRun}>{t.lap}</button>
                <button className="btn" onClick={swReset}>{t.reset}</button>
              </div>
              {swLaps.length>0 && (
                <div className="lap-list">
                  {[...swLaps].reverse().map((l,ri)=>{
                    const i=swLaps.length-1-ri
                    const times=swLaps.map(x=>x.lap)
                    const best=Math.min(...times),worst=Math.max(...times)
                    const cls=swLaps.length>1?(l.lap===best?' best':l.lap===worst?' worst':''):''
                    return (
                      <div key={i} className={`lap-row${cls}`}>
                        <span className="lap-n">Lap {i+1}{l.lap===best&&swLaps.length>1?` (${t.best})`:''}{l.lap===worst&&swLaps.length>1?` (${t.worst})`:''}</span>
                        <span>{swFmt(l.lap)}</span>
                        <span style={{color:'#9a8a6a',fontSize:11}}>{swFmt(l.total)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── 타이머 ── */}
          <div className={`panel${tab===2?' active':''}`}>
            <div className="card">
              <div className="t-inputs">
                <div className="t-field">
                  <input type="number" value={tH} min="0" max="23" onChange={e=>setTH(+e.target.value)} />
                  <label>{t.hours}</label>
                </div>
                <div className="t-sep">:</div>
                <div className="t-field">
                  <input type="number" value={tM} min="0" max="59" onChange={e=>setTM(+e.target.value)} />
                  <label>{t.mins}</label>
                </div>
                <div className="t-sep">:</div>
                <div className="t-field">
                  <input type="number" value={tS} min="0" max="59" onChange={e=>setTS(+e.target.value)} />
                  <label>{t.secs}</label>
                </div>
              </div>
              <div className="presets">
                {t.presets.map(([lbl,sec])=>(
                  <button key={sec} className="btn sm" onClick={()=>setPreset(sec)}>{lbl}</button>
                ))}
              </div>
              <div className={`big-num${tLeft===0&&tTotal>0?' done':''}`}>
                {`${pad(Math.floor(tLeft/3600))}:${pad(Math.floor(tLeft%3600/60))}:${pad(tLeft%60)}`}
              </div>
              <div className="prog">
                <div className="prog-fill" style={{width: tTotal>0?`${((tTotal-tLeft)/tTotal)*100}%`:'0%'}} />
              </div>
              <div className="btn-row">
                <button className={`btn${tRun?' stop':' go'}`} onClick={tToggle}>
                  {tRun ? t.pause : (tLeft>0 ? t.resume : t.start)}
                </button>
                <button className="btn" onClick={tReset}>{t.reset}</button>
              </div>
            </div>
          </div>

          {/* ── 알람 ── */}
          <div className={`panel${tab===3?' active':''}`}>
            <div className="card">
              <div className="card-title">{lang==='ko'?'알람 추가':'Add Alarm'}</div>
              <div className="alarm-add">
                <input type="time" value={aTime} onChange={e=>setATime(e.target.value)} />
                <input type="text" value={aLabel} onChange={e=>setALabel(e.target.value)} placeholder={t.alarmLabel} />
                <button className="btn go" onClick={addAlarm}>{t.add}</button>
              </div>
              <div className="days-row">
                {t.days.map((d,i)=>(
                  <button key={i} className={`day-btn${selDays.includes(i)?' sel':''}`} onClick={()=>toggleDay(i)}>{d}</button>
                ))}
              </div>
              <div className="rep-lbl">{repLabel(selDays)}</div>
            </div>
            <div className="card">
              <div className="card-title">{lang==='ko'?'알람 목록':'Alarms'}</div>
              {alarms.length===0 ? (
                <div className="empty">{t.noAlarm}</div>
              ) : (
                <div className="alarm-list">
                  {alarms.map(a=>(
                    <div key={a.id} className={`a-item${a.id===ringingId?' ring':''}`}>
                      <div className="a-time">{a.time}</div>
                      <div className="a-meta">
                        <div className="a-lbl">{a.label}</div>
                        <div className="a-days">{repLabel(a.days)}</div>
                      </div>
                      <button className={`tog${a.on?' on':''}`} onClick={()=>togAlarm(a.id)} />
                      <button className="del-btn" onClick={()=>delAlarm(a.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 세계시각 ── */}
          <div className={`panel${tab===4?' active':''}`}>
            <div className="card">
              <div className="country-select">
                <select value={region} onChange={e=>setRegion(+e.target.value)}>
                  {t.regions.map((r,i)=><option key={i} value={i-1}>{r}</option>)}
                </select>
              </div>
              <div className="wc-grid">
                {filteredCities.map(c=>{
                  const off=getTzOff(c.tz), diff=Math.round((off-seoulOff)/60)
                  const name=lang==='ko'?c.ko:c.en
                  const di=now.toLocaleDateString(lang==='ko'?'ko-KR':'en-US',{timeZone:c.tz,month:'numeric',day:'numeric',weekday:'short'})
                  return (
                    <div key={c.tz} className="wc-card">
                      <div className="wc-city">{name}</div>
                      <div className="wc-t">{wcTimes[c.tz]||'--:--:--'}</div>
                      <div className="wc-d">{di}</div>
                      <div className="wc-diff">{diff===0?'—':`${t.diffFrom} ${diff>0?'+':''}${diff}h`}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── 포모도로 ── */}
          <div className={`panel${tab===5?' active':''}`}>
            <div className="pom-mode-row">
              {t.pomModes.map((m,i)=>(
                <button key={i} className={`pom-mode-btn${pomPhase===i?' active':''}`} onClick={()=>pomJump(i)}>{m}</button>
              ))}
            </div>
            <div className="card">
              <div className="pom-ring">
                <div className="pom-svg-wrap">
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="96" fill="none" stroke="#2e2820" strokeWidth="8"/>
                    <circle cx="110" cy="110" r="96" fill="none"
                      stroke="#c9a84c" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={CIRC} strokeDashoffset={pomArcOffset}
                      transform="rotate(-90 110 110)"
                      style={{transition:'stroke-dashoffset .9s linear'}}
                    />
                  </svg>
                  <div className="pom-center-text">
                    <div className="pom-time">{`${pad(Math.floor(pomLeft/60))}:${pad(pomLeft%60)}`}</div>
                    <div className="pom-phase">{t.pomPhase[pomPhase]}</div>
                  </div>
                </div>
              </div>
              <div className="pom-sets">
                {Array.from({length:pomSessions},(_,i)=>(
                  <div key={i} className={`pom-dot${i<pomSet?' done':i===pomSet&&pomPhase===0?' current':''}`} />
                ))}
              </div>
              <div className="btn-row">
                <button className={`btn${pomRun?' stop':' go'}`} onClick={pomToggle}>
                  {pomRun ? t.pause : t.start}
                </button>
                <button className="btn" onClick={pomSkip}>{t.skip}</button>
                <button className="btn" onClick={pomReset}>{t.reset}</button>
              </div>
            </div>
            <div className="card">
              <div className="card-title">{t.settings}</div>
              <div className="pom-settings">
                {[
                  [t.pomFocus, pomFocusMin, setPomFocusMin],
                  [t.pomShort, pomShortMin, setPomShortMin],
                  [t.pomLong, pomLongMin, setPomLongMin],
                  [t.pomSessions, pomSessions, setPomSessions],
                ].map(([lbl,val,set])=>(
                  <div key={lbl} className="pom-set-item">
                    <label>{lbl}</label>
                    <input type="number" value={val} min="1" max="90" onChange={e=>set(+e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-title">{t.pomStats}</div>
              <div className="pom-stat-row">
                {[[pomTotalFocus,t.sessions],[pomTotalMins,t.focusMins],[pomTotalSets,t.sets]].map(([n,l])=>(
                  <div key={l} className="pom-stat">
                    <div className="pom-stat-n">{n}</div>
                    <div className="pom-stat-l">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 우측 광고 */}
        {adsOn && (
          <div className="ad-sidebar">
            <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_RIGHT||'6666666666'} label={t.adLabel} />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          {adsOn && <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER||'4444444444'} label={t.adLabel} />}
          <p className="footer-text">{t.footer}</p>
          <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:10}}>
            <a href="/privacy" style={{color:'#5a4f3a',fontSize:12,textDecoration:'none'}}>개인정보처리방침</a>
            <a href="/terms" style={{color:'#5a4f3a',fontSize:12,textDecoration:'none'}}>이용약관</a>
            <a href="/faq" style={{color:'#5a4f3a',fontSize:12,textDecoration:'none'}}>FAQ</a>
          </div>
          <a href="/admin" className="admin-link">admin</a>
        </div>
      </footer>
    </>
  )
}

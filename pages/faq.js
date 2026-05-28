import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CONTENT = {
  ko: {
    metaTitle: 'FAQ | Clock-Down — 자주 묻는 질문',
    desc: '알람, 타이머, 스탑워치, 세계시각, 포모도로 등 자주 묻는 질문을 확인하세요.',
    title: 'FAQ',
    sub: 'Clock-Down 온라인 시계 서비스에 대해 자주 묻는 질문들입니다.',
    faqs: [
      { q: '완전 무료인가요?', a: '네, 완전 무료입니다. 회원가입도 필요 없습니다.' },
      { q: '알람이 소리가 안 나요.', a: '브라우저에서 소리 권한을 허용해야 해요. 주소창 왼쪽 자물쇠 아이콘 클릭 → 소리 허용으로 변경해주세요. 또한 첫 클릭(상호작용) 이후에만 소리가 재생됩니다.' },
      { q: '알람이 탭을 닫으면 울리지 않아요.', a: '브라우저 탭이 열려 있어야 알람이 작동합니다. 탭을 닫으면 알람이 울리지 않아요. 탭을 백그라운드로 유지해주세요.' },
      { q: '포모도로가 뭔가요?', a: '25분 집중 + 5분 휴식을 반복하는 시간 관리 기법이에요. 집중력 향상에 효과적입니다. Clock-Down에서는 집중/휴식 시간을 자유롭게 설정할 수 있어요.' },
      { q: '세계시각은 몇 개 도시를 지원하나요?', a: '아시아, 유럽, 아메리카, 오세아니아, 중동·아프리카 등 20개 주요 도시를 지원합니다.' },
      { q: '설정한 알람이 새로고침하면 사라져요.', a: '알람은 브라우저 로컬스토리지에 저장됩니다. 같은 브라우저에서는 새로고침해도 유지되지만, 다른 기기나 시크릿 모드에서는 저장되지 않아요.' },
    ],
    footer: '© 2024 Clock-Down. 무료 온라인 시계.',
    langBtn: '🇺🇸 English',
    linkPrivacy: '개인정보처리방침',
    linkTerms: '이용약관',
  },
  en: {
    metaTitle: 'FAQ | Clock-Down — Frequently Asked Questions',
    desc: 'Find answers about alarm, timer, stopwatch, world clock, and pomodoro.',
    title: 'FAQ',
    sub: 'Frequently asked questions about Clock-Down.',
    faqs: [
      { q: 'Is it completely free?', a: 'Yes, completely free. No sign-up required.' },
      { q: 'The alarm has no sound.', a: 'You need to allow sound permissions in your browser. Click the lock icon in the address bar and set Sound to Allow. Note that sound only plays after your first interaction with the page.' },
      { q: 'The alarm doesn\'t ring when I close the tab.', a: 'The browser tab must remain open for alarms to work. Keep the tab open in the background.' },
      { q: 'What is Pomodoro?', a: 'Pomodoro is a time management technique: 25 minutes of focus followed by a 5-minute break. Clock-Down lets you customize the focus and break durations freely.' },
      { q: 'How many cities does World Clock support?', a: 'We support 20 major cities across Asia, Europe, the Americas, Oceania, and the Middle East & Africa.' },
      { q: 'My alarms disappear after refresh.', a: 'Alarms are saved in your browser\'s local storage. They persist across refreshes in the same browser, but won\'t carry over to other devices or incognito mode.' },
    ],
    footer: '© 2024 Clock-Down. Free Online Clock.',
    langBtn: '🇰🇷 한국어',
    linkPrivacy: 'Privacy Policy',
    linkTerms: 'Terms of Service',
  },
}

export default function Faq() {
  const [lang, setLang] = useState('ko')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('cd_lang')
    if (saved && CONTENT[saved]) setLang(saved)
  }, [])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('cd_lang', next)
  }

  const t = CONTENT[lang]

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">⏱</div>
            <span className="logo-text">Clock<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 680 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 6 }}>
            {t.title}
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 40 }}>{t.sub}</p>

          {t.faqs.map((faq, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '16px 20px',
                  color: 'var(--text)', fontFamily: 'inherit',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                {faq.q}
                <span style={{ color: 'var(--accent)', fontSize: 18 }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderTop: 'none', borderRadius: '0 0 10px 10px',
                  padding: '14px 20px', color: 'var(--text2)', fontSize: 14, lineHeight: 1.8,
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: 48, display: 'flex', gap: 20 }}>
            <Link href="/privacy" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkPrivacy}</Link>
            <Link href="/terms" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkTerms}</Link>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">{t.footer}</p>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>
    </>
  )
}

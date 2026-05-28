import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CONTENT = {
  ko: {
    metaTitle: 'FAQ | Clock-Down — 자주 묻는 질문',
    desc: '온라인 시계, 지원 언어, 브라우저 호환성 등 자주 묻는 질문을 확인하세요.',
    title: 'FAQ',
    sub: 'Clock-Down 온라인 시계 서비스에 대해 자주 묻는 질문들입니다.',
    faqs: [
      { q: '완전 무료인가요?', a: '네, 완전 무료입니다. 회원가입도 필요 없습니다.' },
      { q: '어떤 언어를 지원하나요?', a: '한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어를 지원합니다. 앞으로 더 추가될 예정입니다.' },
      { q: '어떤 브라우저에서 사용 가능한가요?', a: '크롬(Chrome)과 엣지(Edge)에서 사용 가능합니다. 사파리나 파이어폭스는 음성 인식 API를 지원하지 않습니다.' },
      { q: '음성 데이터가 저장되나요?', a: '아니요, 모든 음성 처리는 브라우저 내에서만 이루어지며 서버에 저장되지 않습니다.' },
      { q: '변환된 텍스트를 어떻게 사용하나요?', a: '복사 버튼을 눌러 클립보드에 복사한 뒤, 원하는 곳에 붙여넣기(Ctrl+V) 하시면 됩니다.' },
      { q: '스페이스바로도 시작/중지 가능한가요?', a: '네, 텍스트 입력창 외부에서 스페이스바를 누르면 녹음을 시작하거나 중지할 수 있습니다.' },
    ],
    footer: '© 2024 Clock-Down. 무료 온라인 시계 도구.',
    langBtn: '🇺🇸 English',
    linkPrivacy: '개인정보처리방침',
    linkTerms: '이용약관',
  },
  en: {
    metaTitle: 'FAQ | Clock-Down — Frequently Asked Questions',
    desc: 'Find answers about voice typing, supported languages, browser compatibility, and more.',
    title: 'FAQ',
    sub: 'Frequently asked questions about the Clock-Down voice typing service.',
    faqs: [
      { q: 'Is it completely free?', a: 'Yes, completely free. No sign-up required.' },
      { q: 'What languages are supported?', a: 'Korean, English, Japanese, Chinese, Spanish, and French are supported. More languages will be added.' },
      { q: 'Which browsers are supported?', a: 'Chrome and Edge are supported. Safari and Firefox do not support the Web Speech Recognition API.' },
      { q: 'Is my voice data stored?', a: 'No. All voice processing happens entirely in your browser and is never stored on any server.' },
      { q: 'How do I use the converted text?', a: 'Click the Copy button to copy to clipboard, then paste (Ctrl+V) wherever you need it.' },
      { q: 'Can I use the spacebar to start/stop?', a: 'Yes! Press the spacebar (outside the text area) to start or stop recording.' },
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
            <span className="logo-text">Voice<span>-Down</span></span>
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

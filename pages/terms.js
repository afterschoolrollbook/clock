import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CONTENT = {
  ko: {
    metaTitle: '이용약관 | Clock-Down',
    metaDesc: 'Clock-Down 이용약관 — 서비스 이용 조건과 규정을 안내합니다.',
    title: '이용약관',
    updated: '최종 업데이트: 2025년 1월 1일',
    sections: [
      {
        title: '1. 서비스 소개',
        content: 'Clock-Down(clock-down.com)은 음성을 텍스트로 변환해주는 무료 웹 도구입니다. 본 서비스를 이용함으로써 아래 약관에 동의한 것으로 간주합니다.',
      },
      {
        title: '2. 서비스 이용 조건',
        items: [
          '본 서비스는 만 14세 이상 누구나 무료로 이용할 수 있습니다.',
          '상업적 목적을 포함한 모든 용도로 자유롭게 사용 가능합니다.',
          '불법적인 용도로 사용하는 것은 금지됩니다.',
        ],
      },
      {
        title: '3. 음성 데이터',
        content: '입력된 음성 데이터는 브라우저 내에서만 처리되며, 서버에 저장되지 않습니다. 변환된 텍스트는 사용자 책임 하에 사용하시기 바랍니다.',
      },
      {
        title: '4. 서비스 변경 및 중단',
        content: 'Clock-Down은 사전 고지 없이 서비스 내용을 변경하거나 일시 중단할 수 있습니다.',
      },
      {
        title: '5. 면책 조항',
        content: 'Clock-Down은 음성 인식 오류, 서비스 중단 등으로 인한 손해에 대해 책임을 지지 않습니다.',
      },
      {
        title: '6. 문의',
        items: ['이메일: minsiljjag@gmail.com'],
      },
    ],
    linkPrivacy: '개인정보처리방침 →',
    linkFaq: '자주 묻는 질문 →',
    footer: '© 2024 Clock-Down. 무료 온라인 시계 도구.',
    langBtn: '🇺🇸 English',
  },
  en: {
    metaTitle: 'Terms of Service | Clock-Down',
    metaDesc: 'Clock-Down Terms of Service — conditions and rules for using the service.',
    title: 'Terms of Service',
    updated: 'Last updated: January 1, 2025',
    sections: [
      {
        title: '1. About the Service',
        content: 'Clock-Down (clock-down.com) is a free web tool that converts speech to text. By using this service, you agree to the terms below.',
      },
      {
        title: '2. Terms of Use',
        items: [
          'This service is free to use for anyone aged 14 or older.',
          'You may use it freely for any purpose, including commercial use.',
          'Use for illegal purposes is strictly prohibited.',
        ],
      },
      {
        title: '3. Voice Data',
        content: 'Voice input is processed entirely within your browser and is never stored on any server. You are responsible for how you use the converted text.',
      },
      {
        title: '4. Service Changes & Suspension',
        content: 'Clock-Down may modify or temporarily suspend the service without prior notice.',
      },
      {
        title: '5. Disclaimer',
        content: 'Clock-Down is not responsible for any damages caused by speech recognition errors or service interruptions.',
      },
      {
        title: '6. Contact',
        items: ['Email: minsiljjag@gmail.com'],
      },
    ],
    linkPrivacy: 'Privacy Policy →',
    linkFaq: 'FAQ →',
    footer: '© 2024 Clock-Down. Free Online Clock.',
    langBtn: '🇰🇷 한국어',
  },
}

export default function Terms() {
  const [lang, setLang] = useState('ko')

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
        <meta name="description" content={t.metaDesc} />
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
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 48 }}>{t.updated}</p>

          {t.sections.map((s, i) => (
            <div key={i} className="section">
              <h2 className="section-title">{s.title}</h2>
              <div className="section-body">
                {s.content && <p>{s.content}</p>}
                {s.items && (
                  <ul>
                    {s.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
            <Link href="/privacy" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkPrivacy}</Link>
            <Link href="/faq" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkFaq}</Link>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">{t.footer}</p>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>

      <style jsx>{`
        .section { margin-bottom: 40px; }
        .section-title {
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 14px; padding-left: 12px;
          border-left: 3px solid var(--accent);
        }
        .section-body { color: var(--text2); font-size: 14px; line-height: 1.85; }
        .section-body p { margin-bottom: 8px; }
        .section-body ul { list-style: disc; padding-left: 20px; margin-top: 8px; }
        .section-body ul li { margin-bottom: 4px; }
      `}</style>
    </>
  )
}

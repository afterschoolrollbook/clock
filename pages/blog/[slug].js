import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { marked } from 'marked'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [lang, setLang] = useState('ko')
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('cd_lang')
    if (saved) setLang(saved)
  }, [])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blog/posts?slug=${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('cd_lang', next)
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return lang === 'ko'
      ? `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const HeaderComp = () => (
    <header className="header">
      <div className="wrap header-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">⏱</div>
          <span className="logo-text">Voice<span>-Down</span></span>
        </Link>
        <button className="lang-btn" onClick={toggleLang}>
          {lang === 'ko' ? '🇺🇸 English' : '🇰🇷 한국어'}
        </button>
      </div>
    </header>
  )

  if (loading) return (<><HeaderComp /><main className="wrap" style={{ paddingTop: 80, color: 'var(--text3)', fontSize: 14 }}>불러오는 중...</main></>)
  if (!post) return (
    <><HeaderComp />
      <main className="wrap" style={{ paddingTop: 80 }}>
        <p style={{ color: 'var(--text3)' }}>글을 찾을 수 없어요.</p>
        <Link href="/blog" style={{ color: 'var(--accent)', fontSize: 14, marginTop: 16, display: 'block' }}>← 블로그 목록</Link>
      </main>
    </>
  )

  const title = lang === 'ko' ? post.title_ko : (post.title_en || post.title_ko)
  const rawContent = lang === 'ko' ? post.content_ko : (post.content_en || post.content_ko)
  const content = rawContent ? marked(rawContent) : ''
  const description = lang === 'ko' ? post.description_ko : (post.description_en || post.description_ko)

  return (
    <>
      <Head>
        <title>{title} | Clock-Down</title>
        <meta name="description" content={description || title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description || title} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: description,
          datePublished: post.created_at,
          author: { '@type': 'Organization', name: 'Clock-Down' },
          publisher: { '@type': 'Organization', name: 'Clock-Down', url: 'https://clock-down.vercel.app' },
        })}} />
      </Head>

      <HeaderComp />

      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <article style={{ maxWidth: 720 }}>
          <Link href="/blog" className="back-link">← 블로그 목록</Link>
          <div className="post-meta">
            <span className="post-date">{formatDate(post.created_at)}</span>
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="post-tag">{tag}</span>
            ))}
          </div>
          <h1 className="post-title">{title}</h1>
          {description && <p className="post-desc">{description}</p>}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="cta-box">
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              {lang === 'ko' ? '지금 바로 온라인 시계을 시작하세요!' : 'Start voice typing right now!'}
            </p>
            <Link href="/" className="cta-btn">
              {lang === 'ko' ? '⏱ Clock-Down 사용하기' : '⏱ Use Clock-Down'}
            </Link>
          </div>
        </article>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">© 2024 Clock-Down. 무료 온라인 시계 도구.</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
            <Link href="/privacy" style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none' }}>개인정보처리방침</Link>
            <Link href="/terms" style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none' }}>이용약관</Link>
            <Link href="/faq" style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none' }}>FAQ</Link>
          </div>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>

      <style jsx>{`
        .back-link { color: var(--text3); font-size: 13px; text-decoration: none; display: block; margin-bottom: 28px; }
        .back-link:hover { color: var(--text2); }
        .post-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .post-date { color: var(--text3); font-size: 12px; }
        .post-tag { background: rgba(0,212,170,0.1); color: var(--accent); border: 1px solid rgba(0,212,170,0.2); border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; }
        .post-title { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.3; margin-bottom: 12px; }
        .post-desc { font-size: 16px; color: var(--text2); line-height: 1.7; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
        .post-content { color: var(--text2); font-size: 15px; line-height: 1.9; }
        :global(.post-content h2) { font-size: 20px; font-weight: 700; color: var(--text); margin: 32px 0 12px; }
        :global(.post-content h3) { font-size: 17px; font-weight: 700; color: var(--text); margin: 24px 0 10px; }
        :global(.post-content p) { margin-bottom: 16px; }
        :global(.post-content ul, .post-content ol) { padding-left: 20px; margin-bottom: 16px; }
        :global(.post-content li) { margin-bottom: 6px; }
        :global(.post-content strong) { color: var(--text); font-weight: 700; }
        :global(.post-content a) { color: var(--accent); text-decoration: none; }
        :global(.post-content a:hover) { text-decoration: underline; }
        :global(.post-content code) { background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .cta-box { margin-top: 48px; padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); text-align: center; }
        .cta-btn { display: inline-block; margin-top: 4px; background: var(--accent); color: #000; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; transition: background 0.2s; }
        .cta-btn:hover { background: var(--accent2); }
      `}</style>
    </>
  )
}

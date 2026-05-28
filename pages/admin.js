import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

// ===== 스타일 =====
const S = {
  page: { minHeight: '100vh', background: '#0d0b14', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#f0ecff', padding: '0 0 60px' },
  wrap: { maxWidth: 820, margin: '0 auto', padding: '0 20px' },
  card: { background: '#141020', border: '1px solid #251f35', borderRadius: 14, padding: 28, marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 },
  row: { background: '#1c1728', border: '1px solid #251f35', borderRadius: 10, padding: '14px 18px', marginBottom: 8 },
  code: { color: '#b48ef0', fontFamily: 'monospace', fontSize: 13 },
  label: { color: '#5a5080', fontSize: 13, marginTop: 3 },
  input: {
    background: '#1c1728', border: '1px solid #251f35', borderRadius: 8,
    padding: '10px 14px', color: '#f0ecff',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15,
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  btn: (color = '#b48ef0') => ({
    background: color, color: color === '#b48ef0' ? '#000' : '#fff',
    border: 'none', borderRadius: 9, padding: '11px 28px',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer',
  }),
}

// ===== 토글 =====
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 50, height: 28, borderRadius: 14,
      background: value ? '#b48ef0' : '#251f35',
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', position: 'absolute', top: 3, left: value ? 25 : 3, transition: 'left 0.2s' }} />
    </div>
  )
}

// ===== 로그인 화면 =====
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/settings/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error || '비밀번호가 틀렸습니다'); setTimeout(() => setErr(''), 2500) }
      else { sessionStorage.setItem('admin_token', data.token); onLogin(data.token) }
    } catch { setErr('서버 연결 실패') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0b14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: '#141020', border: '1px solid #251f35', borderRadius: 14, padding: 40, width: 360 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, background: '#b48ef0', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>⏱</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f0ecff' }}>Admin</h1>
          <p style={{ color: '#5a5080', fontSize: 14, marginTop: 4 }}>Clock-Down 관리자 패널</p>
        </div>
        <form onSubmit={submit}>
          <input type="password" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)}
            style={{ ...S.input, borderColor: err ? '#b48ef0' : '#251f35', marginBottom: 8 }} />
          {err && <p style={{ color: '#b48ef0', fontSize: 13, marginBottom: 8 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ ...S.btn(), width: '100%', marginTop: 8, opacity: loading ? 0.6 : 1 }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ===== 대시보드 =====
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [loading, setLoading] = useState(true)

  // 설정값
  const [adsOn, setAdsOn] = useState(true)
  const [soundDownBanner, setSoundDownBanner] = useState(false)
  const [saved, setSaved] = useState(false)

  // 블로그
  const [blogTab, setBlogTab] = useState('write')
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogSaved, setBlogSaved] = useState(false)
  const [blogError, setBlogError] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [blogForm, setBlogForm] = useState({
    slug: '', title_ko: '', title_en: '',
    content_ko: '', content_en: '',
    description_ko: '', description_en: '',
    tags: '', published: true,
  })

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPwConfirm, setNewPwConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/get')
      if (!res.ok) return
      const data = await res.json()
      setAdsOn(data.adsOn ?? true)
      setSoundDownBanner(data.soundDownBanner ?? false)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) { setAdminToken(token); setAuthed(true) }
    else setLoading(false)
    fetchSettings()
  }, [fetchSettings])

  const kvSave = async (body) => {
    const res = await fetch('/api/settings/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('저장 실패')
  }

  const handleSave = async () => {
    try {
      await kvSave({ adsOn, soundDownBanner })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch { alert('저장 실패. 다시 시도해주세요.') }
  }

  // 블로그
  const fetchBlogPosts = async () => {
    setBlogLoading(true)
    try {
      const res = await fetch('/api/blog/posts', { headers: { 'x-admin-token': adminToken } })
      const data = await res.json()
      setBlogPosts(Array.isArray(data) ? data : [])
    } catch {}
    setBlogLoading(false)
  }

  const handleTogglePublished = async (post) => {
    await fetch('/api/blog/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    })
    fetchBlogPosts()
  }

  const handleBlogSubmit = async () => {
    if (!blogForm.slug || !blogForm.title_ko || !blogForm.content_ko) {
      setBlogError('슬러그, 제목(한국어), 내용(한국어)은 필수입니다.')
      setTimeout(() => setBlogError(''), 3000); return
    }
    setBlogLoading(true)
    try {
      const body = { ...blogForm, tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
      const method = editingPost ? 'PUT' : 'POST'
      if (editingPost) body.id = editingPost.id
      const res = await fetch('/api/blog/posts', {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setBlogSaved(true); setTimeout(() => setBlogSaved(false), 2500)
      setBlogForm({ slug:'', title_ko:'', title_en:'', content_ko:'', content_en:'', description_ko:'', description_en:'', tags:'', published:true })
      setEditingPost(null)
      fetchBlogPosts()
    } catch { setBlogError('저장 실패. 다시 시도해주세요.'); setTimeout(() => setBlogError(''), 3000) }
    setBlogLoading(false)
  }

  const handleBlogDelete = async (id) => {
    if (!confirm('삭제할까요?')) return
    await fetch('/api/blog/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
      body: JSON.stringify({ id }),
    })
    fetchBlogPosts()
  }

  const handleBlogEdit = (post) => {
    setEditingPost(post)
    setBlogForm({
      slug: post.slug, title_ko: post.title_ko || '', title_en: post.title_en || '',
      content_ko: post.content_ko || '', content_en: post.content_en || '',
      description_ko: post.description_ko || '', description_en: post.description_en || '',
      tags: post.tags ? post.tags.join(', ') : '', published: post.published,
    })
    setBlogTab('write')
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPw.length < 6) { setPwMsg({ type:'error', text:'새 비밀번호는 6자 이상이어야 합니다.' }); setTimeout(() => setPwMsg(null), 3000); return }
    if (newPw !== newPwConfirm) { setPwMsg({ type:'error', text:'새 비밀번호가 일치하지 않습니다.' }); setTimeout(() => setPwMsg(null), 3000); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPw, newPw }),
      })
      const data = await res.json()
      if (!res.ok) { setPwMsg({ type:'error', text: data.error || '변경 실패' }) }
      else { setCurrentPw(''); setNewPw(''); setNewPwConfirm(''); setPwMsg({ type:'success', text:'✅ 비밀번호가 변경되었습니다!' }) }
      setTimeout(() => setPwMsg(null), 4000)
    } catch { setPwMsg({ type:'error', text:'서버 오류. 다시 시도해주세요.' }) }
    finally { setPwLoading(false) }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0d0b14', display:'flex', alignItems:'center', justifyContent:'center', color:'#5a5080', fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      불러오는 중...
    </div>
  )
  if (!authed) return <LoginScreen onLogin={(token) => { setAdminToken(token); setAuthed(true) }} />

  return (
    <>
      <Head>
        <title>Admin · Clock-Down</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        {/* 헤더 */}
        <div style={{ borderBottom:'1px solid #141020', padding:'18px 0', marginBottom:36 }}>
          <div style={{ ...S.wrap, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800 }}>관리자 대시보드</h1>
              <p style={{ color:'#5a5080', fontSize:13, marginTop:2 }}>Clock-Down Admin Panel · Supabase 연동</p>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <a href="/" style={{ color:'#5a5080', fontSize:13, textDecoration:'none' }}>← 사이트 보기</a>
              <button onClick={() => { sessionStorage.removeItem('admin_token'); setAuthed(false); setAdminToken('') }}
                style={{ background:'none', border:'1px solid #333', color:'#5a5080', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
                로그아웃
              </button>
            </div>
          </div>
        </div>

        <div style={S.wrap}>

          {/* ===== 섹션 1: 환경변수 가이드 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>⚙️ 환경변수 설정 가이드</h2>
            <p style={{ color:'#5a5080', fontSize:14, marginBottom:20 }}>
              Vercel 대시보드 → 프로젝트 → Settings → Environment Variables 에서 아래 값을 추가하세요.
            </p>
            {[
              { key:'SUPABASE_URL', desc:'Supabase 프로젝트 URL', example:'https://xxxxxx.supabase.co', important:true },
              { key:'SUPABASE_SERVICE_ROLE_KEY', desc:'Supabase Service Role Key', example:'eyJhbGci...', important:true },
              { key:'NEXT_PUBLIC_ADSENSE_CLIENT', desc:'애드센스 게시자 ID', example:'ca-pub-1234567890123456', important:true },
              { key:'NEXT_PUBLIC_AD_SLOT_TOP', desc:'상단 배너 광고 슬롯 ID', example:'1111111111' },
              { key:'NEXT_PUBLIC_AD_SLOT_LEFT', desc:'왼쪽 사이드바 슬롯 ID (PC 전용)', example:'5555555555' },
              { key:'NEXT_PUBLIC_AD_SLOT_RIGHT', desc:'오른쪽 사이드바 슬롯 ID (PC 전용)', example:'6666666666' },
              { key:'NEXT_PUBLIC_AD_SLOT_MIDDLE', desc:'중간 광고 슬롯 ID', example:'3333333333' },
              { key:'NEXT_PUBLIC_AD_SLOT_FOOTER', desc:'하단 광고 슬롯 ID', example:'4444444444' },
              { key:'ADMIN_SECRET_TOKEN', desc:'서버 API 보안 토큰 (랜덤 문자열)', example:'random_secret_32자_이상', important:true },
              { key:'NEXT_PUBLIC_ADMIN_PASSWORD', desc:'관리자 초기 비밀번호 (최초 1회)', example:'admin1234', important:true },
            ].map(({ key, desc, example, important }) => (
              <div key={key} style={{ ...S.row, borderColor: important ? '#1e1040' : '#251f35', borderLeftColor: important ? '#b48ef0' : '#251f35', borderLeftWidth: important ? 3 : 1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                  <div><span style={S.code}>{key}</span><p style={S.label}>{desc}</p></div>
                  <span style={{ color:'#3d3060', fontSize:12, fontFamily:'monospace' }}>{example}</span>
                </div>
              </div>
            ))}
            <div style={{ background:'#140f28', border:'1px solid #2a1a4a', borderRadius:10, padding:16, marginTop:16 }}>
              <p style={{ color:'#7a5aaa', fontSize:13, lineHeight:1.7 }}>
                ✅ <strong>Supabase 테이블 생성 SQL:</strong><br />
                <code style={{ color:'#b48ef0' }}>CREATE TABLE clockdown_settings (key TEXT PRIMARY KEY, value JSONB);</code><br /><br />
                블로그 기능 사용 시 blog_posts 테이블도 필요합니다. (Sound-Down과 공유 가능)
              </p>
            </div>
          </div>

          {/* ===== 섹션 2: 수익화 전략 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>📊 수익화 전략</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14 }}>
              {[
                { icon:'📍', title:'6개 광고 슬롯', accent:'#b48ef0', desc:'상단/중간/하단/좌우사이드바 배치. 페이지뷰당 최대 수익.' },
                { icon:'🌐', title:'한/영 이중 언어', accent:'#4a9aff', desc:'영어권 트래픽 확보. 영어권 CPC가 3~5배 높음.' },
                { icon:'⏱', title:'6개 언어 음성인식', accent:'#4aaa6a', desc:'한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어 지원.' },
                { icon:'🔁', title:'복사 후 붙여넣기', accent:'#aaaa4a', desc:'키보드 없이 누워서 음성으로 타이핑. 차별화된 UX.' },
              ].map(({ icon, title, desc, accent }) => (
                <div key={title} style={{ background:'#100c1c', border:`1px solid ${accent}33`, borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{icon}</div>
                  <div style={{ fontWeight:700, marginBottom:6, color:accent }}>{title}</div>
                  <div style={{ color:'#5a5080', fontSize:13, lineHeight:1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 섹션 3: 사이트 설정 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>⚙️ 사이트 설정</h2>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:600 }}>광고 활성화</div>
                  <div style={{ color:'#5a5080', fontSize:13, marginTop:2 }}>{adsOn ? '광고가 표시됩니다' : '광고가 숨겨집니다'}</div>
                </div>
                <Toggle value={adsOn} onChange={setAdsOn} />
              </div>
            </div>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:600 }}>🔊 Voice-Down 링크 배너</div>
                  <div style={{ color:'#5a5080', fontSize:13, marginTop:2 }}>
                    {soundDownBanner ? '헤더에 Sound-Down 링크가 표시됩니다' : '배너가 숨겨집니다'}
                  </div>
                </div>
                <Toggle value={soundDownBanner} onChange={setSoundDownBanner} />
              </div>
            </div>
            <button onClick={handleSave} style={{ ...S.btn(saved ? '#3a1a6a' : '#b48ef0'), transition:'background 0.3s' }}>
              {saved ? '✅ Supabase 저장 완료!' : '설정 저장'}
            </button>
          </div>

          {/* ===== 섹션 4: 블로그 글 관리 ===== */}
          <div style={S.card}>
            <h2 style={{ ...S.cardTitle, justifyContent:'space-between' }}>
              <span>✍️ 블로그 글 관리</span>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { setBlogTab('write'); setEditingPost(null); setBlogForm({ slug:'',title_ko:'',title_en:'',content_ko:'',content_en:'',description_ko:'',description_en:'',tags:'',published:true }) }}
                  style={{ ...S.btn(blogTab==='write'?'#b48ef0':'#251f35'), padding:'7px 16px', fontSize:13 }}>✏️ 글쓰기</button>
                <button onClick={() => { setBlogTab('list'); fetchBlogPosts() }}
                  style={{ ...S.btn(blogTab==='list'?'#b48ef0':'#251f35'), padding:'7px 16px', fontSize:13 }}>📋 글 목록</button>
              </div>
            </h2>

            {blogTab === 'write' && (
              <div>
                {editingPost && (
                  <div style={{ background:'#0d1f1a', border:'1px solid #1a4a3a', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#b48ef0' }}>
                    ✏️ 수정 중: <strong>{editingPost.title_ko}</strong>
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>슬러그 * (URL: /blog/슬러그)</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm(p => ({...p, slug: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}))}
                      placeholder="voice-typing-tips" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>태그 (쉼표로 구분)</label>
                    <input value={blogForm.tags} onChange={e => setBlogForm(p => ({...p, tags: e.target.value}))}
                      placeholder="음성타이핑, 생산성, 팁" style={S.input} />
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>제목 (한국어) *</label>
                    <input value={blogForm.title_ko} onChange={e => setBlogForm(p => ({...p, title_ko: e.target.value}))}
                      placeholder="온라인 시계 활용법 5가지" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>제목 (English)</label>
                    <input value={blogForm.title_en} onChange={e => setBlogForm(p => ({...p, title_en: e.target.value}))}
                      placeholder="5 Ways to Use Voice Typing" style={S.input} />
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>요약설명 (한국어) — SEO</label>
                    <input value={blogForm.description_ko} onChange={e => setBlogForm(p => ({...p, description_ko: e.target.value}))}
                      placeholder="온라인 시계으로 생산성을 높이는 방법" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>요약설명 (English)</label>
                    <input value={blogForm.description_en} onChange={e => setBlogForm(p => ({...p, description_en: e.target.value}))}
                      placeholder="How to boost productivity with voice typing" style={S.input} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>본문 (한국어) * — Markdown 사용 가능</label>
                  <textarea value={blogForm.content_ko} onChange={e => setBlogForm(p => ({...p, content_ko: e.target.value}))}
                    placeholder="## 온라인 시계이란?&#10;&#10;클릭 한 번으로 말하면 자동으로 텍스트가 입력됩니다..."
                    style={{ ...S.input, height:220, resize:'vertical', fontFamily:'monospace', fontSize:13 }} />
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={{ color:'#9b8fc0', fontSize:12, display:'block', marginBottom:4 }}>본문 (English) — Markdown 사용 가능</label>
                  <textarea value={blogForm.content_en} onChange={e => setBlogForm(p => ({...p, content_en: e.target.value}))}
                    placeholder="## What is Voice Typing?&#10;&#10;Click once and speak — text appears automatically..."
                    style={{ ...S.input, height:220, resize:'vertical', fontFamily:'monospace', fontSize:13 }} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <Toggle value={blogForm.published} onChange={v => setBlogForm(p => ({...p, published: v}))} />
                  <span style={{ fontSize:14, color:'#9b8fc0' }}>{blogForm.published ? '공개' : '비공개'}</span>
                </div>
                {blogError && <p style={{ color:'#c97aff', fontSize:13, marginBottom:10 }}>{blogError}</p>}
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={handleBlogSubmit} disabled={blogLoading}
                    style={{ ...S.btn(blogSaved?'#9b6de0':'#b48ef0'), color:'#000', opacity:blogLoading?0.6:1, transition:'background 0.3s' }}>
                    {blogLoading ? '저장 중...' : blogSaved ? '✅ 저장 완료!' : editingPost ? '✏️ 수정 저장' : '📝 발행'}
                  </button>
                  {editingPost && (
                    <button onClick={() => { setEditingPost(null); setBlogForm({ slug:'',title_ko:'',title_en:'',content_ko:'',content_en:'',description_ko:'',description_en:'',tags:'',published:true }) }}
                      style={{ ...S.btn('#251f35'), fontSize:14 }}>취소</button>
                  )}
                </div>
                <p style={{ color:'#5a5080', fontSize:12, marginTop:10 }}>
                  발행된 글: <a href="/blog" target="_blank" style={{ color:'#b48ef0' }}>/blog</a>
                </p>
              </div>
            )}

            {blogTab === 'list' && (
              <div>
                {blogLoading && <p style={{ color:'#5a5080', fontSize:14 }}>불러오는 중...</p>}
                {!blogLoading && blogPosts.length === 0 && <p style={{ color:'#5a5080', fontSize:14 }}>아직 글이 없어요.</p>}
                {blogPosts.map(post => (
                  <div key={post.id} style={{ ...S.row, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                        <span style={{ fontWeight:600, fontSize:14 }}>{post.title_ko}</span>
                        <span style={{ fontSize:10, padding:'2px 6px', borderRadius:4, fontWeight:600,
                          background: post.published?'#1a0a30':'#2a1040', color: post.published?'#b48ef0':'#c97aff' }}>
                          {post.published?'공개':'비공개'}
                        </span>
                      </div>
                      <div style={{ color:'#5a5080', fontSize:12 }}>/blog/{post.slug} · {new Date(post.created_at).toLocaleDateString('ko-KR')}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                      <button onClick={() => handleTogglePublished(post)}
                        style={{ ...S.btn(post.published?'#241040':'#1a0a30'), padding:'6px 12px', fontSize:12 }}>
                        {post.published?'비공개로':'공개로'}
                      </button>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                        style={{ ...S.btn('#1a1030'), padding:'6px 12px', fontSize:12, textDecoration:'none', color:'#b48ef0' }}>보기</a>
                      <button onClick={() => handleBlogEdit(post)}
                        style={{ ...S.btn('#1e1040'), padding:'6px 12px', fontSize:12 }}>수정</button>
                      <button onClick={() => handleBlogDelete(post.id)}
                        style={{ ...S.btn('#2a0d0d'), padding:'6px 12px', fontSize:12 }}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== 섹션 5: 비밀번호 변경 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>🔒 비밀번호 변경</h2>
            <p style={{ color:'#5a5080', fontSize:14, marginBottom:20 }}>
              변경된 비밀번호는 <strong style={{ color:'#9b8fc0' }}>Supabase에 SHA-256 해시 저장</strong>되어 모든 기기에서 영구 적용됩니다.
            </p>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom:12 }}>
                <label style={{ color:'#5a5080', fontSize:13, display:'block', marginBottom:6 }}>현재 비밀번호</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="현재 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ color:'#5a5080', fontSize:13, display:'block', marginBottom:6 }}>새 비밀번호 (6자 이상)</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ color:'#5a5080', fontSize:13, display:'block', marginBottom:6 }}>새 비밀번호 확인</label>
                <input type="password" value={newPwConfirm} onChange={e => setNewPwConfirm(e.target.value)} placeholder="새 비밀번호 재입력" style={S.input} />
              </div>
              {pwMsg && (
                <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:12, fontSize:13,
                  background: pwMsg.type==='success'?'#140f28':'#200a30',
                  border: `1px solid ${pwMsg.type==='success'?'#2a1a4a':'#3a1a50'}`,
                  color: pwMsg.type==='success'?'#b48ef0':'#c97aff' }}>{pwMsg.text}</div>
              )}
              <button type="submit" disabled={pwLoading} style={{ ...S.btn('#7a5aff'), opacity:pwLoading?0.6:1 }}>
                {pwLoading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

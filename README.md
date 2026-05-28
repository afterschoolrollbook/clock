# Clock-Down ⏱

알람, 타이머, 스탑워치, 세계시각, 포모도로가 모두 있는 무료 온라인 시계

## 배포 (Vercel)

### 1. GitHub에 올리기
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/afterschoolrollbook/Clock-Down.git
git push -u origin main
```

### 2. Vercel 환경변수
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_TOP=
NEXT_PUBLIC_AD_SLOT_RIGHT=
NEXT_PUBLIC_AD_SLOT_FOOTER=
ADMIN_SECRET_TOKEN=랜덤문자열
```

### 3. Supabase 테이블 생성
```sql
CREATE TABLE clockdown_settings (key TEXT PRIMARY KEY, value JSONB);
```

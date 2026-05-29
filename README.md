# TechStore Next.js

Amplitude·Braze SDK 및 REST API 연동을 테스트할 수 있는 Next.js 테크 쇼핑몰 **데모**입니다.

> **API 키는 저장소에 포함되지 않습니다.** [`.env.example`](./.env.example)을 복사해 본인의 Amplitude/Braze 키를 입력한 뒤 사용하세요.

## 문서 안내

| 문서 | 내용 |
|------|------|
| **이 README** | 로컬 실행, GTM·Vercel/Netlify 배포, npm·Git 명령어 |
| **[docs/PROJECT.md](./docs/PROJECT.md)** | 프로젝트 구조, 프론트/백엔드 구분, 환경 변수·Analytics 상세, Next.js/Jest 설명 |
| **[docs/ADMIN-PROXY.md](./docs/ADMIN-PROXY.md)** | `/api/admin/proxy` 동작 원리 (CORS, 릴레이 역할, 다른 API와 차이) |
| **[.env.example](./.env.example)** | 환경 변수 키 목록 (값은 로컬 `.env.local` 또는 배포 플랫폼에만 입력) |

상세한 아키텍처·환경 변수 설명은 README보다 **`docs/PROJECT.md`** 에 두는 것을 권장합니다. GitHub 저장소 첫 화면은 README만 보이므로, 여기서는 실행·배포 중심으로 정리합니다.

---

## 생성 위치 (로컬 예시)

```
/Users/bluejunha/Documents/git/techstore-nextjs
```

같은 상위 폴더에 Flutter 버전 [`techstore-flutter`](https://github.com/devbyjunha/techstore-flutter)가 있습니다.

---

## 요구 사항

- **Node.js** 18.18 이상 (권장 **20 LTS**)
- **npm** 9 이상 (Node 설치 시 기본 포함)

이 저장소에는 **앱 소스만** 있습니다. `node`, `npm`, `npx` 명령은 Node.js를 별도로 설치해야 사용할 수 있습니다.

## Node.js 설치 (필수)

### 설치 확인

```bash
node -v && npm -v
```

정상이면 예: `v20.x.x`, `10.x.x` 형태로 버전이 출력됩니다. 아래처럼 나오면 Node.js가 없거나 PATH에 등록되지 않은 상태입니다.

```text
zsh: command not found: node
zsh: command not found: npm
```

### 설치 방법 (macOS)

**방법 A — Homebrew (간단)**

```bash
brew install node@20
brew link --overwrite node@20   # 필요 시
```

**방법 B — nvm (여러 Node 버전 관리)**

```bash
# nvm 설치: https://github.com/nvm-sh/nvm#installing-and-updating
nvm install 20
nvm use 20
```

**방법 C — 공식 설치 프로그램**

- https://nodejs.org/ 에서 **LTS** 설치 파일 다운로드 후 실행

### 설치 후

```bash
node -v    # v18.18.0 이상인지 확인
npm -v
```

> PATH를 수정했다면 **새 터미널**을 열거나 `source ~/.zshrc` 후 다시 시도하세요.

Next.js 16은 프로젝트 의존성으로 `npm install` 시 함께 설치됩니다. 전역 `npm install -g next`는 **필수가 아닙니다**.

---

## 로컬 환경에서 실행하기

### 1. 저장소 클론 및 의존성 설치

> 아래 명령은 **Node.js 설치가 완료된 뒤** 실행하세요.

```bash
git clone https://github.com/devbyjunha/techstore-nextjs.git
cd techstore-nextjs
npm install
```

### 2. 환경 변수 설정

API 키는 Git에 올라가지 않습니다. 템플릿을 복사한 뒤 본인 키를 입력합니다.

```bash
cp .env.example .env.local
```

`.env.local`을 열어 필요한 값을 채웁니다. **키 없이도 쇼핑몰 UI는 실행**되며, Analytics 연동만 비활성화됩니다.

| 기능 | 필요한 변수 | 비고 |
|------|-------------|------|
| Amplitude Browser SDK | `NEXT_PUBLIC_AMPLITUDE_API_KEY` | 브라우저에 노출됨 |
| Amplitude 서버 API (`/api/2/httpapi`) | `AMPLITUDE_API_KEY` | 미설정 시 `NEXT_PUBLIC_*` fallback |
| Braze Web SDK | `NEXT_PUBLIC_BRAZE_API_KEY`, `NEXT_PUBLIC_BRAZE_SDK_ENDPOINT` | endpoint는 **sdk.*** URL |
| Braze REST API (`/api/users/track`) | `BRAZE_REST_API_KEY`, `BRAZE_REST_API_URL` | endpoint는 **rest.*** URL |
| Public API 인증 (`/api/v1/*`) | `TECHSTORE_API_KEY` | 선택 |
| Braze Webhook 검증 | `BRAZE_WEBHOOK_SECRET` | 선택 |
| Google Tag Manager | `NEXT_PUBLIC_GTM_ID` | 선택 — `GTM-XXXXXXX` 형식 |

키 발급 위치·상세 설명 → [docs/PROJECT.md#환경-변수](./docs/PROJECT.md#환경-변수)

**Braze endpoint 주의:** Web SDK에는 `https://sdk.iad-01.braze.com` 형태의 **sdk.*** URL을, REST API에는 **rest.*** URL을 사용합니다. 둘을 바꾸면 SDK가 동작하지 않습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

- **Admin 패널:** [http://localhost:3000/admin](http://localhost:3000/admin) — 상품 관리, Braze/Amplitude API 테스트
- **로그인 데모:** 아무 이메일·이름으로 로그인 가능 (실제 인증 없음)

### 4. 프로덕션 모드로 로컬 실행 (선택)

배포 전 동작을 확인할 때 사용합니다.

```bash
npm run build
npm run start   # http://localhost:3000
```

빌드 시점에 `.env.local`의 `NEXT_PUBLIC_*` 값이 번들에 포함됩니다. 키를 변경했다면 **반드시 `npm run build`를 다시** 실행하세요.

### 5. 로컬 실행 확인 체크리스트

| 확인 항목 | 방법 |
|-----------|------|
| 홈·상품·장바구니 UI | `/`, `/product/1`, `/cart` 접속 |
| Amplitude 이벤트 | 브라우저 DevTools Network 또는 Amplitude Live View |
| Braze 이벤트 | Braze Dashboard → Analytics → Custom Events |
| 서버 API 프록시 | Admin → Braze/Amplitude API 테스트 메뉴 |
| GTM dataLayer | 브라우저 콘솔 `dataLayer` 또는 GTM Preview 모드 |
| 테스트 통과 | `npm run test` |

---

## GTM(Google Tag Manager) 연동

Braze·Amplitude를 **앱 SDK에 직접 넣지 않고 GTM 태그로 배포**하거나, **직접 SDK와 GTM을 병행**해 테스트할 수 있습니다.

### 연동 방식 선택

| 방식 | 설정 | 용도 |
|------|------|------|
| **A. 직접 SDK** (기본) | `NEXT_PUBLIC_BRAZE_*`, `NEXT_PUBLIC_AMPLITUDE_*` | 앱 코드에서 SDK 초기화·이벤트 전송 |
| **B. GTM 경유** | `NEXT_PUBLIC_GTM_ID` + GTM 태그 설정 | 태그·트리거를 GTM UI에서 관리 |
| **C. 병행** | A + B 동시 설정 | GTM dataLayer와 SDK 이벤트 비교·검증 |

> **중복 이벤트 주의:** A와 B를 동시에 켜면 Braze/Amplitude에 **같은 액션이 두 번** 들어갈 수 있습니다. GTM만 쓸 때는 Braze/Amplitude `NEXT_PUBLIC_*` 키를 비워 두세요.

### 1. GTM 컨테이너 준비

1. [Google Tag Manager](https://tagmanager.google.com/) → **Create Account / Container**
2. Container type: **Web**
3. Container ID 확인 (예: `GTM-ABC1234`)

### 2. 환경 변수 설정

`.env.local` (또는 Vercel/Netlify Environment Variables)에 추가:

```bash
NEXT_PUBLIC_GTM_ID=GTM-ABC1234
```

설정 후 `npm run dev` (또는 재배포). `NEXT_PUBLIC_GTM_ID`가 없으면 GTM 스니펫은 로드되지 않습니다.

### 3. 앱에서 dataLayer로 전달되는 이벤트

쇼핑몰 액션 시 `window.dataLayer`에 아래 형식으로 push 됩니다 (`src/lib/gtm/analytics.ts`).

| dataLayer `event` | 발생 시점 | 주요 필드 |
|-------------------|-----------|-----------|
| `product_viewed` | 상품 상세 조회 | `product_id`, `product_name`, `product_category`, `product_price`, `currency` |
| `added_to_cart` | 장바구니 추가 | 위 상품 필드 |
| `removed_from_cart` | 장바구니 삭제 | `product_id` |
| `added_to_wishlist` | 위시리스트 추가 | 상품 필드 |
| `removed_from_wishlist` | 위시리스트 삭제 | `product_id` |
| `user_login` | 로그인 | `user_id`, `email`, `name` |
| `user_logout` | 로그아웃 | — |
| `cart_cleared` | 장바구니 비우기 | — |

예시 (장바구니 추가):

```json
{
  "event": "added_to_cart",
  "product_id": "1",
  "product_name": "MacBook Pro",
  "product_category": "laptop",
  "product_price": 2490000,
  "currency": "KRW"
}
```

브라우저 DevTools 콘솔에서 확인:

```javascript
window.dataLayer
```

### 4. GTM에서 Braze 태그 설정

1. **Tags → New**
2. Tag type: **Braze Web SDK** (Community Template) 또는 **Custom HTML**
3. API Key / SDK Endpoint: Braze Dashboard → App Settings 값 입력
4. **Trigger:** Custom Event
   - Event name: `added_to_cart` (또는 위 표의 event명)
5. 태그에서 dataLayer 변수(`product_id`, `product_name` 등)를 Braze Custom Event 속성에 매핑
6. **Submit → Publish**

Braze Custom Event 이름 예: dataLayer `event` 값(`added_to_cart`)을 그대로 쓰거나, GTM Lookup Table로 Amplitude/Braze 각각 다른 이름으로 변환.

### 5. GTM에서 Amplitude 태그 설정

1. **Tags → New**
2. Tag type: **Amplitude Analytics** (Gallery Template) 또는 **Custom HTML**
3. API Key: Amplitude Project API Key
4. **Trigger:** Custom Event — `added_to_cart` 등
5. Event Properties에 dataLayer 변수 매핑 (`product_id`, `product_price` …)
6. **Submit → Publish**

Amplitude 이벤트명을 앱 SDK와 맞추려면 GTM **Tag configuration → Event Name**을 `Added to Cart` 등으로 지정하세요 (직접 SDK 이벤트명과 [docs/PROJECT.md](./docs/PROJECT.md) 참고).

### 6. GTM 변수 설정 (권장)

**Variables → New → Data Layer Variable**

| 변수 이름 (예) | Data Layer Variable Name |
|----------------|--------------------------|
| `dlv - product_id` | `product_id` |
| `dlv - product_name` | `product_name` |
| `dlv - email` | `email` |

태그·트리거에서 `{{dlv - product_id}}` 형태로 참조합니다.

### 7. 로컬 테스트 (GTM Preview)

1. GTM UI → **Preview** → 사이트 URL `http://localhost:3000` 입력
2. Tag Assistant 연결 후 상품 조회·장바구니 추가 등 수행
3. 어떤 **Trigger**가 firing 되고 **Tag**가 전송됐는지 확인

로컬에서 GTM Preview가 안 붙으면 브라우저 확장 프로그램·팝업 차단을 확인하세요.

### 8. Vercel / Netlify에 GTM 배포

| 변수 | Environment | 설명 |
|------|-------------|------|
| `NEXT_PUBLIC_GTM_ID` | Production, Preview | `GTM-XXXXXXX` |

`NEXT_PUBLIC_*` 이므로 **변경 후 재배포**가 필요합니다. Braze/Amplitude를 GTM으로만 쓸 경우 서버 REST 키(`BRAZE_REST_API_KEY`, `AMPLITUDE_API_KEY`)는 Admin API 테스트용으로만 선택 설정하면 됩니다.

### 9. GTM 연동 확인 체크리스트

| 확인 항목 | 방법 |
|-----------|------|
| GTM 스니펫 로드 | DevTools → Network → `gtm.js` 요청 |
| dataLayer push | 콘솔 `window.dataLayer` 또는 GTM Preview |
| Braze 수신 | Braze Dashboard → Custom Events |
| Amplitude 수신 | Amplitude → Live Events |
| 중복 없음 | GTM-only vs SDK-only 중 하나만 활성화했는지 확인 |

---

## Vercel 배포

Next.js App Router + API Routes 구조라 **Vercel에서 가장 간단**하게 배포할 수 있습니다.

### 1. Vercel에 프로젝트 연결

1. [vercel.com](https://vercel.com) 로그인
2. **Add New → Project**
3. GitHub 저장소 `techstore-nextjs` Import
4. Framework Preset: **Next.js** (자동 감지)

기본 빌드 설정은 그대로 두면 됩니다.

| 항목 | 값 |
|------|-----|
| Build Command | `npm run build` (기본값) |
| Output Directory | (기본값 — Vercel이 처리) |
| Install Command | `npm install` (기본값) |
| Node.js Version | **20.x** 권장 (Project Settings → General) |

### 2. 환경 변수 등록

Vercel Dashboard → **Project → Settings → Environment Variables** 에 [`.env.example`](./.env.example) 항목을 추가합니다.

| 변수 | Environment | 설명 |
|------|-------------|------|
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | Production, Preview | Browser SDK |
| `NEXT_PUBLIC_AMPLITUDE_SERVER_ZONE` | Production, Preview | `US` 또는 `EU` |
| `NEXT_PUBLIC_BRAZE_API_KEY` | Production, Preview | Web SDK |
| `NEXT_PUBLIC_BRAZE_SDK_ENDPOINT` | Production, Preview | `https://sdk.*.braze.com` |
| `AMPLITUDE_API_KEY` | Production, Preview | 서버 HTTP API (선택) |
| `BRAZE_REST_API_KEY` | Production, Preview | Braze REST (선택) |
| `BRAZE_REST_API_URL` | Production, Preview | `https://rest.*.braze.com` (선택) |
| `TECHSTORE_API_KEY` | Production, Preview | Public API 인증 (선택) |
| `BRAZE_WEBHOOK_SECRET` | Production | Webhook 검증 (선택) |
| `NEXT_PUBLIC_GTM_ID` | Production, Preview | Google Tag Manager Container ID (선택) |

> **`NEXT_PUBLIC_*` 변수는 빌드 시 번들에 포함됩니다.** 값을 추가·변경한 뒤에는 **Redeploy**가 필요합니다.

### 3. 배포

- **Git push** → `main` 브랜치 push 시 Production 자동 배포
- 또는 Vercel Dashboard에서 **Deploy** 클릭

배포 URL 예: `https://techstore-nextjs.vercel.app`

### 4. Vercel CLI로 배포 (선택)

```bash
npm i -g vercel
vercel login
vercel          # Preview
vercel --prod   # Production
```

CLI 사용 시에도 Dashboard와 동일하게 Environment Variables를 미리 등록해 두세요.

### 5. Vercel 배포 후 확인

- 쇼핑몰 페이지가 정상 렌더링되는지
- Admin (`/admin`) 접근 가능 여부
- Amplitude/Braze 키 설정 시 이벤트가 각 대시보드에 수집되는지
- Braze Webhook을 쓸 경우 Webhook URL을 `https://<your-domain>/api/v1/webhooks/braze` 로 설정

---

## Netlify 배포

Netlify도 Next.js App Router를 지원합니다. **Next.js Runtime 플러그인**이 API Routes·SSR을 처리합니다.

### 1. Netlify에 프로젝트 연결

1. [netlify.com](https://www.netlify.com) 로그인
2. **Add new site → Import an existing project**
3. GitHub 저장소 `techstore-nextjs` 선택
4. 빌드 설정 확인

| 항목 | 값 |
|------|-----|
| Build command | `npm run build` |
| Publish directory | (비워 두거나 Netlify Next.js 플러그인 기본값 사용) |
| Node version | **20** (Site settings → Environment → `NODE_VERSION=20`) |

Netlify가 Next.js를 감지하면 `@netlify/plugin-nextjs`가 자동 적용됩니다.

### 2. (선택) `netlify.toml` 추가

팀원이 동일한 빌드 설정을 쓰려면 저장소 루트에 아래 파일을 추가할 수 있습니다.

```toml
[build]
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. 환경 변수 등록

Netlify Dashboard → **Site configuration → Environment variables** 에 Vercel과 동일한 키를 등록합니다.

- `NEXT_PUBLIC_*` → **Build time** 및 **Runtime** 모두 필요 (Netlify UI에서 Scopes 확인)
- `BRAZE_REST_API_KEY`, `AMPLITUDE_API_KEY` 등 서버 전용 변수 → Runtime
- `NEXT_PUBLIC_GTM_ID` → Build time 및 Runtime (GTM 스니펫 로드)

변수 추가 후 **Trigger deploy → Clear cache and deploy site** 로 재배포하세요.

### 4. 배포

- `main` 브랜치 push → 자동 배포
- 또는 Netlify Dashboard → **Deploy site**

배포 URL 예: `https://techstore-nextjs.netlify.app`

### 5. Netlify 배포 후 확인

Vercel과 동일하게 UI, Admin, Analytics 이벤트 수집, Webhook URL을 점검합니다.

> Netlify Functions 타임아웃(기본 10초) 안에서 Admin API 프록시가 동작합니다. 대용량 Braze/Amplitude 호출은 타임아웃에 주의하세요.

---

## 코드 변경 후

```bash
git pull origin main
npm install
npm run lint          # 선택
npm run test
npm run build
# EC2: pm2 restart techstore 등
```

---

## npm 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm install` | 의존성 설치 |
| `npm run dev` | 개발 서버 (Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 (포트 3000) |
| `npm run lint` | ESLint |
| `npm run test` | Jest 테스트 |
| `npm run test:watch` | 테스트 watch |
| `npm run test:coverage` | 커버리지 포함 테스트 |

---

## EC2 / VPS 배포 (요약)

Vercel·Netlify 대신 자체 서버에서 실행할 때 참고합니다.

```bash
# Node 설치 후
git clone https://github.com/devbyjunha/techstore-nextjs.git
cd techstore-nextjs
npm install
# .env 작성
npm run build && npm run test

npm install -g pm2
pm2 start npm --name "techstore" -- start
pm2 save
```

업데이트: `git pull` → `npm install` → `npm run build` → `pm2 restart techstore`

자세한 내용 → [docs/PROJECT.md](./docs/PROJECT.md)

---

## Git 치트시트

원격: `https://github.com/devbyjunha/techstore-nextjs.git` · 브랜치: `main`

```bash
git status
git add .
git commit -m "설명: 변경 요약"
git push origin main

git pull origin main
git log --oneline -10
```

`git push` 503 → GitHub 일시 장애 가능, 몇 분 후 재시도.

커밋 전: `.env`가 스테이징되지 않았는지 `git status`로 확인.

---

## 프로젝트 한 줄 구조

```
src/app/          페이지 + API Routes (프론트 UI + 백엔드 API)
src/components/   UI 컴포넌트
src/context/      장바구니·로그인 상태
src/lib/          Amplitude / Braze (client=브라우저, server=API)
src/data/         정적 상품 데이터
```

프론트/백엔드 구분·데이터 흐름·이벤트 목록 → **[docs/PROJECT.md](./docs/PROJECT.md)**

---

## 저장소

https://github.com/devbyjunha/techstore-nextjs

---

## 문제 해결

### `zsh: command not found: node` / `npm`

| 원인 | 해결 |
|------|------|
| Node.js 미설치 | 위 [Node.js 설치](#nodejs-설치-필수) 절차 진행 |
| PATH 미등록 (nvm 등) | `nvm use 20` 또는 Homebrew 경로가 `~/.zshrc`에 있는지 확인 |
| 설치 직후에도 동일 | 터미널 앱을 완전히 종료 후 다시 실행 |

프로젝트 코드 오류가 아니라 **로컬 개발 환경** 문제입니다.

### `npm install` / `npm run dev` 실패

- Node 버전: `node -v` → 18.18 미만이면 20 LTS로 업그레이드
- 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`
- 포트 충돌: 3000번 사용 중이면 다른 프로세스 종료 후 `npm run dev` 재시도
- 환경 변수: Analytics 없이도 실행 가능. 키는 `.env.local` 참고 → [.env.example](./.env.example)

### Vercel / Netlify 배포 후 Analytics 미동작

- `NEXT_PUBLIC_*` 변수가 **배포 플랫폼에 등록**되어 있는지 확인
- 변수 추가·변경 후 **재배포(Redeploy)** 했는지 확인 (`NEXT_PUBLIC_*`는 빌드 시 반영)
- Braze Web SDK endpoint가 **sdk.*** 인지, REST URL(**rest.***)과 혼동하지 않았는지 확인
- Amplitude `SERVER_ZONE`이 프로젝트 리전(US/EU)과 일치하는지 확인

### GTM / dataLayer 미동작

- `NEXT_PUBLIC_GTM_ID` 형식이 `GTM-XXXXXXX` 인지 확인
- GTM Preview 모드에서 `dataLayer` push는 되는데 태그가 안 뜨면 **Trigger Event name**이 dataLayer `event` 값과 일치하는지 확인
- Braze/Amplitude 태그와 **직접 SDK를 동시에** 켜 두지 않았는지 확인 (중복·충돌 방지)

### `next: command not found`

개발 시에는 **전역 Next.js가 필요 없습니다**. 프로젝트 루트에서 `npm run dev`를 사용하세요 (`package.json`의 `next`가 `node_modules`에서 실행됩니다).

# 이다연의 포트폴리오 (자소서 웹앱)

한양대 ERICA 클라우드 데이터베이스 과목 실습 과제 — AWS 기반 자기소개 웹앱.
**React + Vite**로 빌드했으며, S3 정적 웹 호스팅 + API Gateway(HTTP API) + Lambda + Amazon Bedrock 구조로 배포합니다.

## 폴더 구조

```
.
├── index.html              # Vite 엔트리
├── src/
│   ├── main.jsx
│   ├── App.jsx              # React Router 라우트 정의
│   ├── components/
│   │   ├── Layout.jsx        # Nav + Footer + Outlet
│   │   ├── Nav.jsx           # 상단 네비게이션 (모바일 햄버거 포함)
│   │   ├── Card.jsx          # 하나의 카드 시스템
│   │   ├── Button.jsx        # 하나의 버튼 시스템 (primary / secondary)
│   │   └── ProjectCard.jsx   # 프로젝트 아코디언
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Spec.jsx
│   │   ├── Project.jsx
│   │   ├── Chatbot.jsx
│   │   └── Contact.jsx
│   ├── data/content.js       # 더미 콘텐츠 (한 곳에서 관리)
│   ├── lib/chatApi.js        # API Gateway 연동 fetch 함수
│   └── styles/
│       ├── tokens.css        # 디자인 토큰 (색상·타입·여백·radius)
│       └── global.css        # 레이아웃 + 버튼/카드/네비 시스템
├── .env.example
└── package.json
```

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # 정적 빌드 → dist/
npm run preview     # 빌드 결과 미리보기
```

> 이 세션의 샌드박스는 외부 네트워크(npm 레지스트리)에 접근할 수 없어 `npm install`을 직접 실행해 보지 못했습니다.
> 로컬 환경에서 Node 18+ 로 위 명령을 실행해 빌드가 정상적으로 되는지 확인해 주세요.

## 콘텐츠 채워 넣기

`src/data/content.js` 한 파일에 모든 더미 텍스트(`[이름]`, `[자격증명]`, `[프로젝트명]` 등)가 모여 있습니다.
이 파일만 수정하면 5개 페이지 전체에 반영됩니다.

## AI 챗봇 연동 (API Gateway + Lambda + Bedrock)

1. Lambda(Bedrock 호출용)와 API Gateway(HTTP API, POST 전용)를 배포합니다.
2. `.env.example`을 `.env`로 복사하고 `VITE_CHAT_API_URL`에 배포된 엔드포인트를 입력합니다.
   ```bash
   cp .env.example .env
   # VITE_CHAT_API_URL=https://xxxxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/chat
   ```
3. 요청/응답 형식: 요청 `{ "message": "..." }` → 응답 `{ "reply": "..." }`.

`.env`가 비어 있으면 `src/lib/chatApi.js`가 자동으로 데모(목업) 응답을 보여줍니다.

## UI 디자인 — 일관성 개선 사항

`github.com/Leonxlnx/taste-skill`의 디자인 원칙 중, 개인 포트폴리오 규모에 맞게 적용한 부분입니다
(실사 촬영·셰이더 효과·자동 체크 파이프라인 등 랜딩페이지/상업 사이트용 항목은 과제 범위상 제외했습니다).

- **하나의 버튼 시스템**: `.btn--primary` / `.btn--secondary` 두 종류만 사용 (전송 버튼, 향후 추가 CTA 모두 동일 규칙)
- **하나의 카드 시스템**: 모든 카드가 `border + radius-lg`를 공유, `card--hover`로 호버 시 2px 상승 + 그림자 (틸트/스티커 효과 없음)
- **좌우 여백 통일**: 모든 섹션이 `.container`(최대 960px, 좌우 동일 패딩)를 공유 — 섹션마다 제각각이던 정렬을 제거
- **하나의 radius / 타입 스케일**: `--radius-sm/md/lg/pill` 4단계, `display/h1/h2/body/caption` 타입 스케일을 전 페이지에서 동일하게 사용
- **호버·포커스 마이크로 인터랙션**: 버튼 hover 시 1px 상승 + active 시 살짝 축소, 카드 hover 시 상승 + 테두리 강조, 키보드 포커스 링(`:focus-visible`) 명시
- **접근성/반응형**: `prefers-reduced-motion` 대응, 탭 영역 44px 이상, 760px 이하에서 네비게이션이 전체 화면 드롭다운으로 전환

## S3 정적 웹 호스팅 배포

```bash
# 0) 빌드
npm run build   # dist/ 폴더 생성

# 1) 버킷 생성 (버킷명은 전역에서 유일해야 함)
aws s3 mb s3://이다연-포트폴리오-버킷이름

# 2) 정적 웹 호스팅 활성화 (SPA이므로 404도 index.html로)
aws s3 website s3://이다연-포트폴리오-버킷이름 \
  --index-document index.html \
  --error-document index.html

# 3) 빌드 결과물 업로드
aws s3 sync dist/ s3://이다연-포트폴리오-버킷이름

# 4) 버킷 웹사이트 엔드포인트로 접속 확인
# http://이다연-포트폴리오-버킷이름.s3-website.<region>.amazonaws.com
```

버킷을 public으로 열 수 없는 조직 정책이라면, S3 버킷 정책에서 `s3:GetObject`를 `*`에게 허용하거나
CloudFront + OAC(Origin Access Control)를 추가로 구성하세요 (이번 과제 규모에서는 필수는 아닙니다).

## 배포 체크리스트

- [ ] `src/data/content.js`를 실제 콘텐츠로 교체
- [ ] `.env`에 API Gateway 엔드포인트 반영
- [ ] 로컬에서 `npm install && npm run build` 정상 동작 확인
- [ ] S3 버킷 생성 + 정적 웹 호스팅 설정
- [ ] `aws s3 sync dist/`로 업로드
- [ ] (선택) 커스텀 도메인 / HTTPS가 필요하면 CloudFront 추가 검토

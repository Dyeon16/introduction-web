# 이다연의 포트폴리오 (자소서 웹앱)

한양대 ERICA 클라우드 데이터베이스 과목 실습 과제 — AWS 기반 자기소개 웹앱.
순수 HTML / CSS / Vanilla JS로 제작했으며, S3 정적 웹 호스팅 + API Gateway(HTTP API) + Lambda + Amazon Bedrock 구조로 배포합니다.

## 폴더 구조

```
.
├── index.html        # 홈
├── spec.html          # 스펙(자격증·기술스택)
├── project.html       # 프로젝트
├── chatbot.html       # AI 챗봇
├── contact.html       # 연락처
├── assets/
│   ├── css/
│   │   └── styles.css # 디자인 토큰 + 전체 스타일 (반응형)
│   └── js/
│       ├── nav.js      # 모바일 네비게이션 토글
│       ├── project.js  # 프로젝트 아코디언
│       ├── config.js   # API 엔드포인트 설정
│       └── chatbot.js  # 챗봇 UI 로직 (fetch 연동)
└── README.md
```

## 로컬에서 미리보기

별도 빌드 과정이 필요 없습니다. 아래 중 하나로 확인하세요.

```bash
# 방법 1: 파이썬 내장 서버
python3 -m http.server 5500
# 브라우저에서 http://localhost:5500 접속

# 방법 2: VS Code의 Live Server 확장 사용
```

## 콘텐츠 채워 넣기

`[이름]`, `[자격증명]`, `[프로젝트명]` 처럼 대괄호로 표시된 부분이 더미 텍스트입니다.
각 `.html` 파일을 열어 본인 정보로 교체하세요.

## AI 챗봇 연동 (API Gateway + Lambda + Bedrock)

1. Lambda(Bedrock 호출용)와 API Gateway(HTTP API, POST 전용)를 배포합니다.
2. `assets/js/config.js`의 `CHAT_API_URL` 값을 배포된 API Gateway 엔드포인트로 교체합니다.
   ```js
   window.APP_CONFIG = {
     CHAT_API_URL: 'https://xxxxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/chat',
   };
   ```
3. 요청/응답 형식은 다음과 같이 가정합니다.
   - 요청: `{ "message": "사용자가 입력한 텍스트" }`
   - 응답: `{ "reply": "챗봇 답변 텍스트" }`

엔드포인트가 비어 있으면 `chatbot.js`가 자동으로 데모(목업) 응답을 보여줍니다 — 프론트엔드만 먼저 확인할 때 유용합니다.

## S3 정적 웹 호스팅 배포

```bash
# 1) 버킷 생성 (버킷명은 전역에서 유일해야 함)
aws s3 mb s3://이다연-포트폴리오-버킷이름

# 2) 정적 웹 호스팅 활성화
aws s3 website s3://이다연-포트폴리오-버킷이름 \
  --index-document index.html \
  --error-document index.html

# 3) 파일 업로드 (public-read 또는 버킷 정책으로 공개 설정)
aws s3 sync . s3://이다연-포트폴리오-버킷이름 \
  --exclude ".git/*" \
  --exclude "README.md"

# 4) 버킷 웹사이트 엔드포인트로 접속 확인
# http://이다연-포트폴리오-버킷이름.s3-website.<region>.amazonaws.com
```

버킷을 public으로 열 수 없는 조직 정책이라면, S3 버킷 정책에서 `s3:GetObject`를 `*`에게 허용하거나
CloudFront + OAC(Origin Access Control)를 추가로 구성하세요 (이번 과제 규모에서는 필수는 아닙니다).

## 배포 체크리스트

- [ ] 실제 콘텐츠로 `[ ]` 더미 텍스트 교체
- [ ] `config.js`에 API Gateway 엔드포인트 반영
- [ ] S3 버킷 생성 + 정적 웹 호스팅 설정
- [ ] `aws s3 sync`로 업로드
- [ ] (선택) 커스텀 도메인 / HTTPS가 필요하면 CloudFront 추가 검토

# DynamoDB 데이터 입력 가이드

테이블: `introduction-webapp-resume` (ap-northeast-2) · 파티션 키 `PK` · 정렬 키 `SK`

## 키 설계 (기획서 기준)

| PK | SK 형식 | 화면 | 필드 |
|---|---|---|---|
| `PROFILE` | `MAIN` | Home | `name`, `school`, `intro`, `about`, `photoUrl`, `facts[{label,value}]` |
| `SPEC` | `CERT#번호#약어` | 스펙 > 자격증 | `title`, `issuer`, `date` (`YYYY.MM`, 최신순 정렬 기준) |
| `SPEC` | `SKILL#번호#이름` | 스펙 > 기술 스택 | `name`, `category` (번호 순서대로 표시, 새 기술은 다음 번호로) |
| `SPEC` | `LANG#번호#시험` / `AWARD#번호#대회` | 스펙 > 어학·수상 | `title`, `issuer`, `detail`, `date` |
| `PROJECT` | `PROJECT#번호#약어` | 프로젝트 | `title`, `period`, `role`, `stack[]`, `description`, `link`, `linkLabel` (번호가 클수록 최신 → 위에 표시) |
| `CONTACT` | `EMAIL`, `GITHUB`, … | 연락처 | `label`, `value`, `href`(`mailto:` 또는 `https://`), `icon`, `order` |

번호는 `001`, `002`처럼 세 자리로 맞춰야 정렬이 올바르게 됩니다.

## 방법 1 — 스크립트로 한 번에 넣기 (추천)

```bash
# 1) 샘플을 복사해서 [ ] 부분을 실제 내용으로 수정
cp backend/data/sample-items.json backend/data/items.json

# 2) 형식 검사만 (실제로 넣지 않음)
node backend/data/seed.mjs --dry-run

# 3) 업로드 (같은 PK+SK는 덮어쓰기 → 수정할 때도 다시 실행)
node backend/data/seed.mjs
```

## 방법 2 — AWS 콘솔에서 직접

DynamoDB → 테이블 → `introduction-webapp-resume` → **항목 탐색** → **항목 생성** → **JSON 보기**에서
"DynamoDB JSON 보기" 토글을 **끄고** 아래처럼 일반 JSON을 붙여넣기:

```json
{ "PK": "SPEC", "SK": "CERT#006#CLF", "title": "AWS Certified Cloud Practitioner (CLF-C02)", "issuer": "Amazon Web Services", "date": "2026.10" }
```

## 방법 3 — AWS CLI 한 건씩

```bash
aws dynamodb put-item --table-name introduction-webapp-resume --item '{
  "PK": {"S": "SPEC"}, "SK": {"S": "SKILL#004#DOCKER"},
  "name": {"S": "Docker"}, "category": {"S": "인프라"}
}'
```
(CLI는 `{"S": "..."}` 형식의 DynamoDB JSON이 필요해서 방법 1이 더 편합니다.)

## 참고

- **프로필 사진**: 이미지를 `public/profile.jpg`에 넣고 push 하면 S3에 같이 배포됩니다. `photoUrl`은 `/profile.jpg`.
- **삭제**: 콘솔 항목 탐색에서 선택 → 작업 → 삭제
- **반영 시점**: 웹페이지는 새로고침하면 바로 반영, 챗봇은 Lambda 캐시 때문에 최대 5분 뒤 반영

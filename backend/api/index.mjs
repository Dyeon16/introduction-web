// introduction-webapp API Lambda (Node.js 22, AWS SDK v3는 런타임 내장)
// CloudFront(/api/*) → API Gateway(HTTP API) → 이 함수
//
//   GET  /api/profile   → DynamoDB Query(PK=PROFILE)
//   GET  /api/spec      → DynamoDB Query(PK=SPEC)     자격증: 취득일 최신순 / 기술스택: 추가 순서
//   GET  /api/projects  → DynamoDB Query(PK=PROJECT)  최신 프로젝트부터
//   GET  /api/contacts  → DynamoDB Query(PK=CONTACT)
//   POST /api/chat      → PROFILE+SPEC+PROJECT 조회 → 답변 범위 제한 프롬프트 → Bedrock(Converse)
//
// 단일 테이블 설계 (기획서): PK = PROFILE | SPEC | PROJECT | CONTACT
//   PROFILE / MAIN, SPEC / CERT#006#CLF, SPEC / SKILL#001#REACT, PROJECT / PROJECT#001#DARTOO,
//   CONTACT / EMAIL, CONTACT / GITHUB
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME || 'introduction-webapp-resume';
const MODEL_ID = process.env.MODEL_ID || 'global.anthropic.claude-haiku-4-5-20251001-v1:0';
const MAX_MESSAGE_LENGTH = 500;

export const FALLBACK =
  '죄송해요, 그 부분은 제가 가진 정보로는 답변드리기 어려워요. 직접 연락처로 문의해주세요!';

const bedrock = new BedrockRuntimeClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ---------- DynamoDB ----------
async function queryPartition(pk) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: { ':pk': pk },
        ExclusiveStartKey,
      })
    );
    items.push(...(res.Items ?? []));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

const strip = ({ PK, ...rest }) => rest; // 응답에서 PK는 제외, SK는 식별자로 유지

async function getProfile() {
  const items = await queryPartition('PROFILE');
  const main = items.find((i) => i.SK === 'MAIN');
  return { profile: main ? strip(main) : null };
}

async function getSpec() {
  const items = (await queryPartition('SPEC')).map(strip);
  const certificates = items
    .filter((i) => i.SK.startsWith('CERT#'))
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))); // 취득일 최신순
  const skills = items
    .filter((i) => i.SK.startsWith('SKILL#'))
    .sort((a, b) => a.SK.localeCompare(b.SK)); // SKILL#001, #002 ... 추가된 순서(마지막에 추가)
  const others = items.filter((i) => !i.SK.startsWith('CERT#') && !i.SK.startsWith('SKILL#'));
  return { certificates, skills, others };
}

async function getProjects() {
  const projects = (await queryPartition('PROJECT'))
    .map(strip)
    .sort((a, b) => b.SK.localeCompare(a.SK)); // PROJECT#번호가 클수록 최신
  return { projects };
}

async function getContacts() {
  const contacts = (await queryPartition('CONTACT'))
    .map(strip)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.SK.localeCompare(b.SK)); // order 필드 순
  return { contacts };
}

const ROUTES = {
  profile: getProfile,
  spec: getSpec,
  projects: getProjects,
  contacts: getContacts,
};

// ---------- Chat ----------
let contextCache = { at: 0, text: '' }; // 웜 컨테이너에서 5분간 재사용
async function loadResumeContext() {
  if (contextCache.text && Date.now() - contextCache.at < 5 * 60 * 1000) return contextCache.text;
  const [profile, spec, project] = await Promise.all(
    ['PROFILE', 'SPEC', 'PROJECT'].map((pk) => queryPartition(pk))
  );
  const label = (pk, sk) =>
    pk === 'PROFILE' ? '프로필'
      : pk === 'PROJECT' ? '프로젝트'
      : sk.startsWith('CERT#') ? '자격증'
      : sk.startsWith('SKILL#') ? '기술 스택'
      : sk.startsWith('LANG#') ? '어학'
      : sk.startsWith('AWARD#') ? '수상'
      : '기타';
  // 키(SK)는 내부 식별자라 모델에 넘기지 않고, 항목 종류만 한국어로 표시
  const text = [...profile, ...spec, ...project]
    .map(({ PK, SK, ...rest }) => `- (${label(PK, SK)}) ${JSON.stringify(rest)}`)
    .join('\n');
  contextCache = { at: Date.now(), text };
  return text;
}

function systemPrompt(context) {
  return [
    '너는 이다연의 자기소개 웹앱에 있는 AI 안내 챗봇이야. 방문자는 채용 담당자, 교수, 동료 개발자야.',
    '',
    '답변 규칙:',
    '1. 아래 <자기소개_정보>에 있는 사실만 근거로, 한국어 존댓말로 자연스럽게 답해.',
    '   주어는 대부분 생략해(예: "Python과 SQL을 학습했어요"). 주어가 꼭 필요할 때만 "다연 님"이라고 쓰고, "이다연은"처럼 성까지 붙인 이름은 쓰지 마.',
    '   문장 끝은 "~했어요", "~있어요"처럼 부드러운 해요체로 써.',
    '2. 질문에 바로 답하고 2~4문장으로 짧게 써. 인사말, 자기소개, 이모지, 마크다운(굵게·목록·제목)은 쓰지 마.',
    '3. 질문과 딱 맞는 항목이 없어도 직접 관련된 정보가 있으면 그것으로 답해. 항목의 detail에 질문 대상이 포함돼 있으면 그 항목이 바로 답이니 "정보는 없지만"이라고 하지 말고 그 항목으로 답해.',
    '   관련성이 약한 다른 자격증·도구·프로젝트는 덧붙이지 마.',
    `4. 관련 정보가 전혀 없거나, 자기소개와 무관한 요청(코드 작성, 일반 상식, 다른 사람 이야기 등)이면 다른 말 없이 이 문장 하나만 그대로 출력해: ${FALLBACK}`,
    '5. 정보에 없는 내용은 추측하거나 지어내지 마. 숙련도나 활용 경험을 부풀리지 말고 정보에 적힌 만큼만 말해.',
    '6. 발급기관·날짜·기간 같은 값은 반드시 해당 항목에 적힌 값을 그대로 써. 다른 항목의 값과 섞지 마.',
    '',
    '<자기소개_정보>',
    context || '(등록된 정보 없음)',
    '</자기소개_정보>',
  ].join('\n');
}

async function chat(body) {
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message) return json(400, { error: '"message" is required' });
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(400, { error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
  }

  const context = await loadResumeContext().catch((err) => {
    console.error('DynamoDB query failed', err);
    return '';
  });
  // 등록된 정보가 하나도 없으면 Bedrock을 호출하지 않고 안내 문구 반환 (비용 절감)
  if (!context) return json(200, { reply: FALLBACK });

  try {
    const result = await bedrock.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: systemPrompt(context) }],
        messages: [{ role: 'user', content: [{ text: message }] }],
        inferenceConfig: { maxTokens: 400, temperature: 0 },
      })
    );
    const reply = result.output?.message?.content?.map((c) => c.text ?? '').join('').trim();
    return json(200, { reply: reply || FALLBACK });
  } catch (err) {
    console.error('Bedrock call failed', err);
    return json(200, { reply: FALLBACK, degraded: true });
  }
}

// ---------- HTTP ----------
function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

function parseBody(event) {
  if (!event?.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body;
  return JSON.parse(raw);
}

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method ?? 'GET';
  // /api/spec, /spec 모두 허용 (CloudFront 경유 / API Gateway 직접 호출)
  const resource = (event?.rawPath ?? '').replace(/^\/api/, '').replace(/^\/|\/$/g, '');

  try {
    if (method === 'POST' && resource === 'chat') {
      let body;
      try {
        body = parseBody(event);
      } catch {
        return json(400, { error: 'Invalid JSON body' });
      }
      return await chat(body);
    }

    if (method === 'GET' && ROUTES[resource]) {
      return json(200, await ROUTES[resource]());
    }

    // 404 대신 400: CloudFront의 SPA 에러 매핑(403/404 → index.html)에 걸리지 않도록
    return json(400, { error: `Unsupported route: ${method} /${resource}` });
  } catch (err) {
    console.error('Request failed', err);
    return json(500, { error: 'Internal error' });
  }
};

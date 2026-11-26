// DynamoDB(introduction-webapp-resume)에 JSON 파일의 항목들을 넣는 스크립트
//   node backend/data/seed.mjs                      → backend/data/items.json 업로드
//   node backend/data/seed.mjs path/to/file.json    → 지정한 파일 업로드
//   node backend/data/seed.mjs --dry-run            → 실제로 넣지 않고 검사만
//
// 같은 PK+SK가 이미 있으면 덮어씁니다(수정할 때도 같은 방법으로 다시 실행).
// AWS CLI 로그인 상태(aws sts get-caller-identity)가 필요합니다.
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const TABLE = process.env.TABLE_NAME || 'introduction-webapp-resume';
const REGION = process.env.AWS_REGION || 'ap-northeast-2';
const VALID_PK = ['PROFILE', 'SPEC', 'PROJECT', 'CONTACT'];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const here = dirname(fileURLToPath(import.meta.url));
const file = args.find((a) => !a.startsWith('--')) || join(here, 'items.json');

// Windows에서 PATH에 aws가 없을 때 기본 설치 경로 사용
const AWS =
  process.env.AWS_CLI ||
  (process.platform === 'win32' && existsSync('C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe')
    ? 'C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe'
    : 'aws');

// 일반 JSON 값 → DynamoDB JSON ({ "S": ... }, { "N": ... } ...)
function toAttr(v) {
  if (v === null) return { NULL: true };
  if (Array.isArray(v)) return { L: v.map(toAttr) };
  if (typeof v === 'object') return { M: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toAttr(x)])) };
  if (typeof v === 'number') return { N: String(v) };
  if (typeof v === 'boolean') return { BOOL: v };
  return { S: String(v) };
}

const items = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(items)) throw new Error('JSON 파일은 항목 배열([ {...}, {...} ])이어야 해요.');

const errors = [];
items.forEach((it, i) => {
  if (!VALID_PK.includes(it.PK)) errors.push(`#${i}: PK는 ${VALID_PK.join(' / ')} 중 하나여야 해요 (현재: ${it.PK})`);
  if (!it.SK) errors.push(`#${i}: SK가 비어 있어요`);
  if (it.PK === 'SPEC' && it.SK && !/^(CERT|SKILL|LANG|AWARD)#/.test(it.SK)) {
    errors.push(`#${i}: SPEC의 SK는 CERT# / SKILL# / LANG# / AWARD# 로 시작해야 해요 (현재: ${it.SK})`);
  }
});
if (errors.length) {
  console.error('입력 오류:\n' + errors.join('\n'));
  process.exit(1);
}

console.log(`${file} → ${TABLE} (${items.length}개 항목)${dryRun ? ' [dry-run]' : ''}`);
const tmp = mkdtempSync(join(tmpdir(), 'seed-'));
try {
  for (const it of items) {
    const label = `${it.PK} / ${it.SK}`;
    if (dryRun) {
      console.log(`  검사 OK  ${label}`);
      continue;
    }
    const itemFile = join(tmp, 'item.json');
    writeFileSync(itemFile, JSON.stringify(Object.fromEntries(Object.entries(it).map(([k, v]) => [k, toAttr(v)]))));
    execFileSync(AWS, ['dynamodb', 'put-item', '--region', REGION, '--table-name', TABLE, '--item', `file://${itemFile}`], {
      stdio: ['ignore', 'ignore', 'inherit'],
      env: { ...process.env, AWS_CLI_FILE_ENCODING: 'UTF-8' }, // Windows에서 한글 JSON 파일 읽기
    });
    console.log(`  업로드  ${label}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log('완료. 챗봇은 최대 5분 뒤(Lambda 캐시) 새 데이터를 반영해요.');

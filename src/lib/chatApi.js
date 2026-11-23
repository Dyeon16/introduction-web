// CloudFront(/api/chat) → API Gateway(HTTP API) → Lambda → DynamoDB + Bedrock
// 요청: { message: string } → 응답: { reply: string }
// 같은 도메인의 상대 경로라 CORS 설정이 필요 없음. 다른 주소를 쓰려면 VITE_CHAT_API_URL로 덮어쓰기.
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || '/api/chat';

export async function askBot(message) {
  const res = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (res.status === 429) {
    throw new Error('요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.');
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.reply ?? null;
}

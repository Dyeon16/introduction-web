// API Gateway(HTTP API) + Lambda + Bedrock 연동
// 요청: { message: string } → 응답: { reply: string }
// VITE_CHAT_API_URL이 비어 있으면 데모(목업) 응답을 돌려줍니다.
export async function askBot(message) {
  const apiUrl = import.meta.env.VITE_CHAT_API_URL;

  if (!apiUrl) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return '[데모 응답] 아직 API 엔드포인트가 연결되지 않았어요. .env의 VITE_CHAT_API_URL을 배포된 API Gateway 주소로 교체해 주세요.';
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.reply ?? null;
}

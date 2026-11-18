// AWS 배포 설정
// API Gateway(HTTP API) 배포 후, 아래 URL을 실제 엔드포인트로 교체하세요.
// 예: https://abc123.execute-api.ap-northeast-2.amazonaws.com/chat
window.APP_CONFIG = {
  CHAT_API_URL: '', // 비어 있으면 chatbot.js가 데모(목업) 응답으로 동작합니다.
};

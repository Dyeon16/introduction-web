// 프로필/스펙/프로젝트/연락처 데이터는 DynamoDB(introduction-webapp-resume)에서 API로 불러옵니다.
// 샘플 데이터와 입력 방법은 backend/data/README.md 참고.
// 이 파일에는 화면에 고정으로 쓰이는 문구만 남겨둡니다.

export const initialChatMessages = [
  {
    role: 'bot',
    text: '안녕하세요! 이다연의 자기소개 AI 챗봇이에요. 자격증, 기술 스택, 프로젝트 경험 등 궁금한 점을 물어봐 주세요.',
  },
];

export const CHAT_FALLBACK_MESSAGE =
  '죄송해요, 그 부분은 제가 가진 정보로는 답변드리기 어려워요. 직접 연락처로 문의해주세요!';

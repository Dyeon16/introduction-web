// 자리표시용 더미 콘텐츠 — 대괄호 [ ] 부분을 본인 정보로 교체하세요.
export const profile = {
  school: '[소속대학 · 학과]',
  name: '[이름]',
  intro: '[한줄소개 — 방문자에게 보여줄 핵심 한 문장]',
  about:
    '[자기소개서 본문 — 학업, 프로젝트, 실무 경험과 기술 역량을 소개하는 문단이 여기에 들어갑니다. 실제 콘텐츠 확정 전까지는 자리만 잡아둔 더미 텍스트입니다.]',
};

export const quickFacts = [
  { label: '소속', value: '[대학교 · 학과]' },
  { label: '관심 분야', value: '[프론트엔드 · 클라우드]' },
  { label: '목표', value: '[한 줄 목표]' },
];

export const certificates = [
  { title: 'AWS Certified Cloud Practitioner (CLF-C02)', issuer: 'Amazon Web Services', date: '2026.10' },
  { title: '[자격증명]', issuer: '[발급기관]', date: '[취득일]' },
];

export const skills = ['React', 'AWS', 'Python', '[기술명]', '[기술명]'];

export const projects = [
  {
    id: 'p1',
    title: '부스 재고관리 앱',
    period: '2026',
    role: '기획 · 프론트엔드 개발',
    description:
      '오프라인 동인행사 부스에서 포스기 대신 쓰는 경량 재고관리/계산 앱. 로컬 스토리지 기반으로 동작하며 구글플레이 출시를 목표로 개발.',
    stack: ['React', 'Capacitor'],
    defaultOpen: true,
  },
  {
    id: 'p2',
    title: '[프로젝트명]',
    period: '[기간]',
    role: '[담당 역할]',
    description: '[프로젝트 설명이 여기에 들어갑니다.]',
    stack: ['[기술]', '[기술]'],
    defaultOpen: false,
  },
];

export const contacts = [
  { icon: '@', label: 'Email', value: '[email@example.com]', href: 'mailto:example@email.com' },
  { icon: 'GH', label: 'GitHub', value: 'github.com/Dyeon16', href: 'https://github.com/Dyeon16' },
  { icon: '+', label: '[추가 연락처]', value: '[값]', href: '#' },
];

export const initialChatMessages = [
  { role: 'user', text: '주로 어떤 프로젝트를 진행하셨나요?' },
  {
    role: 'bot',
    text: '동인행사 부스용 재고관리 앱을 React와 Capacitor로 개발했어요. 로컬 스토리지 기반으로 동작하고, 구글플레이 출시를 목표로 하고 있습니다.',
  },
];

export const CHAT_FALLBACK_MESSAGE =
  '죄송해요, 그 부분은 제가 가진 정보로는 답변드리기 어려워요. 직접 연락처로 문의해주세요!';

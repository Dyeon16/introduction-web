// 모바일 상단 네비게이션 토글
(function () {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // 화면을 다시 넓혔을 때 모바일 메뉴 상태 초기화
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

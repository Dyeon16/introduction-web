// 프로젝트 아코디언 토글
(function () {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card) => {
    const btn = card.querySelector('.project-card__toggle');
    const detail = card.querySelector('.project-card__detail');
    const chip = card.querySelector('.project-card__chip');
    if (!btn || !detail) return;

    const setOpen = (open) => {
      detail.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (chip) chip.textContent = open ? '접기 ▴' : '펼치기 ▾';
    };

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });
  });
})();

(function () {
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Анимация первого экрана: выключена при reduce motion, ?motion=1 включает принудительно
  const motion = params.get('motion') === '1' || (!reduced && params.get('motion') !== '0');
  if (motion) html.classList.add('motion');

  // Гигантская надпись всегда ровно во всю ширину блока
  const mark = document.querySelector('.wordmark');
  function fitWordmark() {
    if (!mark) return;
    mark.style.fontSize = '';
    const parent = mark.parentElement;
    const pcs = getComputedStyle(parent);
    const content = parent.clientWidth - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight);
    const bleed = -parseFloat(getComputedStyle(mark).marginLeft) || 0;
    const box = content + bleed * 2;
    const natural = Array.from(mark.children).reduce(function (s, el) { return s + el.getBoundingClientRect().width; }, 0);
    if (!box || !natural) return;
    const fs = parseFloat(getComputedStyle(mark).fontSize);
    mark.style.fontSize = (fs * box / natural).toFixed(2) + 'px';
  }
  let raf = 0;
  function onResize() { cancelAnimationFrame(raf); raf = requestAnimationFrame(fitWordmark); }
  window.addEventListener('resize', onResize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
  fitWordmark();

  // Статус подключения: «подключаем» → «на связи»
  const status = document.querySelector('.status');
  const statusText = document.querySelector('.status__text');
  function connected() {
    if (!status) return;
    status.classList.add('status--on');
    if (statusText) statusText.textContent = statusText.dataset.on || statusText.textContent;
  }
  if (motion) {
    status && status.classList.remove('status--on');
    if (statusText) statusText.textContent = statusText.dataset.off || statusText.textContent;
    setTimeout(connected, 1400);
  } else {
    connected();
  }

  // Вопросы: открыт только один
  const faq = document.querySelector('.faq');
  if (faq) {
    faq.addEventListener('toggle', function (e) {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.open) return;
      faq.querySelectorAll('details[open]').forEach(function (o) { if (o !== d) o.open = false; });
    }, true);
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();

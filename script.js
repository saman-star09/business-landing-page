(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Tonal silhouette placeholders behind every photo slot
  $$('.img[data-sil]').forEach(el => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', el.dataset.sil === 'bag' ? '0 0 200 200' : '0 0 200 400');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<use href="#sil-${el.dataset.sil}"/>`;
    el.prepend(svg);
  });

  // Nav: transparent -> solid ivory
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Bag + toast
  let count = 0;
  const toast = $('#toast');
  const notify = msg => {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(notify.t); notify.t = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const addToBag = name => {
    $('#bagCount').textContent = ++count;
    $('#bagCount').classList.add('bump'); setTimeout(() => $('#bagCount').classList.remove('bump'), 300);
    notify(`${name} added to your bag`);
  };
  $$('.product').forEach(p => {
    $('.add', p).addEventListener('click', () => addToBag(p.dataset.name));
    $('.qv', p).addEventListener('click', () => openModal(p));
  });

  // Quick view
  const modal = $('#modal'); let current;
  function openModal(p) {
    current = p;
    $('#mName').textContent = p.dataset.name;
    $('#mPrice').textContent = $('.price', p).textContent;
    const src = $('.img', p), dst = $('#mImg');
    dst.dataset.tone = src.dataset.tone;
    dst.innerHTML = ''; 
    const svg = $('svg', src).cloneNode(true); dst.append(svg);
    const img = $('img', src); if (img) { const c = img.cloneNode(); c.removeAttribute('loading'); c.onerror = () => c.remove(); dst.append(c); }
    modal.hidden = false; $('#mClose').focus();
  }
  const closeModal = () => { modal.hidden = true; };
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  $('#mAdd').addEventListener('click', () => { addToBag(current.dataset.name); closeModal(); });
  $$('#sizes button').forEach(b => b.addEventListener('click', () => {
    $$('#sizes button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  }));

  // Hotspots (tap support)
  $$('.hotspot').forEach(h => h.addEventListener('click', e => {
    e.stopPropagation(); const was = h.classList.contains('open');
    $$('.hotspot').forEach(x => x.classList.remove('open')); h.classList.toggle('open', !was);
  }));
  document.addEventListener('click', () => $$('.hotspot').forEach(x => x.classList.remove('open')));

  // Newsletter
  $('#newsForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#email').value.trim(), msg = $('#newsMsg');
    if (/^\S+@\S+\.\S+$/.test(v)) { msg.textContent = 'Welcome to AYRA. Your first letter is on its way.'; e.target.reset(); }
    else msg.textContent = 'Please enter a valid email address.';
  });
})();

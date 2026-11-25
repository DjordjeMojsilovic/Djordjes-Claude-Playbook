// Navigation: hides on scroll down, comes back on a small scroll up; the veil shows once the page has moved.
(function () {
  var nav = document.querySelector('[data-nav]');
  var menu = nav.querySelector('details.menu');
  var HIDE_AFTER = 24, DELTA = 4, SCROLLED = 8, lastY = scrollY;
  menu.addEventListener('toggle', function () { if (menu.open) nav.removeAttribute('data-hidden'); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.open = false; }); });
  document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
  function onScroll() {
    var y = scrollY;
    nav.toggleAttribute('data-scrolled', y > SCROLLED);
    if (menu.open) { lastY = y; return; }
    var dy = y - lastY;
    if (Math.abs(dy) < DELTA) return;
    nav.toggleAttribute('data-hidden', dy > 0 && y > HIDE_AFTER);
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Code blocks get a copy button. Success is quiet: the label says "Copied" for a moment.
(function () {
  if (!navigator.clipboard) return;
  document.querySelectorAll('.prose pre').forEach(function (pre) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'copy'; b.textContent = 'Copy';
    b.setAttribute('aria-label', 'Copy code');
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(pre.querySelector('code').innerText.replace(/\n$/, '')).then(function () {
        b.textContent = 'Copied';
        clearTimeout(b.t); b.t = setTimeout(function () { b.textContent = 'Copy'; }, 1600);
      }, function () { b.textContent = 'Press Ctrl+C'; });
    });
    pre.appendChild(b);
  });
})();

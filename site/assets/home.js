// The home page's opening: the headline lifts away, then who I am and why arrive in the same sky, then they leave
// the same way and the cards come onto the clean picture. The picture itself never moves.
(function () {
  var root = document.documentElement;
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!root.classList.contains('motion') || !gsap || !ScrollTrigger) { root.classList.remove('motion'); return; }
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  // Scroll-linked exits accelerate away (power2.in); arrivals settle (power2.out). The scrub smooths the wheel.
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.intro', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  })
    .to('.hero-h .line', { yPercent: -110, opacity: 0, filter: 'blur(6px)', duration: 0.26, stagger: 0.05, ease: 'power2.in' }, 0)
    .to('.hero-foot', { y: -40, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.02)
    .fromTo('.hello-name', { yPercent: 70, opacity: 0, filter: 'blur(6px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.24, ease: 'power2.out' }, 0.34)
    .fromTo('.hello-what', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.42)
    .fromTo('.why', { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, ease: 'power2.out' }, 0.5)
    .to({}, { duration: 0.3 })
    .to(['.hello-name', '.hello-what', '.why'], { y: -64, opacity: 0, filter: 'blur(6px)', duration: 0.2, stagger: 0.03, ease: 'power2.in' });

  // Cards and panels rise into place once. Text never depends on this to be readable.
  gsap.utils.toArray('[data-rg]').forEach(function (g) {
    gsap.fromTo(g.querySelectorAll('[data-r]'), { y: 28 }, {
      y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: g, start: 'top 88%', once: true },
    });
  });

  window.motionReady = true;
})();

// Gray Oak Advisory — minimal site behavior (no build tools required)

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('nav-links--open');
    });
  }

  // Scroll-grown tree: the root path "draws" itself in as the visitor
  // scrolls down the page, finishing right around the footer.
  var wrap = document.querySelector('.tree-scroll-wrap');
  var trunk = document.getElementById('tree-trunk-path');

  if (wrap && trunk && 'getTotalLength' in trunk) {
    var pathLength = trunk.getTotalLength();
    trunk.style.strokeDasharray = pathLength;
    trunk.style.strokeDashoffset = pathLength;

    var ticking = false;

    function updateTreeGrowth() {
      var rect = wrap.getBoundingClientRect();
      var wrapHeight = wrap.offsetHeight || 1;
      var scrolledInto = window.innerHeight - rect.top;
      var progress = Math.min(Math.max(scrolledInto / wrapHeight, 0), 1);
      trunk.style.strokeDashoffset = pathLength * (1 - progress);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateTreeGrowth);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateTreeGrowth();
  }

  // Back to top: small round button, bottom-right, appears once the
  // visitor has scrolled down a bit and scrolls smoothly to the top.
  var backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    var backToTopTicking = false;

    function updateBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
      backToTopTicking = false;
    }

    function onBackToTopScroll() {
      if (!backToTopTicking) {
        window.requestAnimationFrame(updateBackToTop);
        backToTopTicking = true;
      }
    }

    window.addEventListener('scroll', onBackToTopScroll, { passive: true });
    updateBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

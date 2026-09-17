// Gray Oak Advisory — minimal site behavior (no build tools required)

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('nav-links--open');
    });
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

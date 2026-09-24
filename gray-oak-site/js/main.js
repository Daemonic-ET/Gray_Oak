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
  //
  // It's position:fixed by default so it stays pinned to the viewport
  // while scrolling through the (white) page content. But once the dark
  // footer scrolls into view, a plain fixed position would leave the
  // button floating on top of the footer instead of the content behind
  // it (2026-09-17 fix). So on every scroll/resize we check whether the
  // footer has reached the button's fixed vertical position; once it
  // has, we switch to position:absolute with an explicit top computed
  // from the footer's document-coordinate offset, docking the button
  // just above the footer — back on the white background — where it
  // then stays put (in document coordinates) for the rest of the scroll.
  var backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    var backToTopTicking = false;
    var footerEl = document.querySelector('.site-footer');

    function updateBackToTop() {
      // Read the button's own fixed-mode margin/height from CSS so this
      // stays correct at the 480px breakpoint's smaller size/spacing
      // without duplicating those numbers here.
      var wasDocked = backToTop.classList.contains('is-docked');
      if (wasDocked) {
        backToTop.classList.remove('is-docked');
        backToTop.style.top = '';
      }
      var cs = window.getComputedStyle(backToTop);
      var margin = parseFloat(cs.bottom) || 24;
      var buttonHeight = backToTop.offsetHeight;
      var fixedTopInViewport = window.innerHeight - margin - buttonHeight;
      var footerTopInViewport = footerEl ? footerEl.getBoundingClientRect().top : null;
      var nearFooter = footerEl ? footerTopInViewport <= fixedTopInViewport : false;

      // Visible once scrolled down 400px — OR, on a page too short to
      // ever reach 400px of scroll (most of the interior pages, which
      // are much shorter than the homepage), once the footer has come
      // into view. Without the second condition the button could never
      // appear at all on a short page, even scrolled all the way to the
      // bottom (2026-09-21 fix).
      if (window.scrollY > 400 || nearFooter) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }

      if (footerEl && nearFooter) {
        var dockedTop = footerTopInViewport + window.scrollY - buttonHeight - margin;
        backToTop.style.top = dockedTop + 'px';
        backToTop.classList.add('is-docked');
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
    window.addEventListener('resize', onBackToTopScroll);
    updateBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Card click-to-expand: any .card that has a [tabindex] attribute AND a
  // nested <template class="card-detail"> is treated as interactive.
  // Clicking it (or pressing Enter/Space while it's focused) clones that
  // template's content into the shared #card-modal-overlay and shows it.
  // The homepage's own Insight cards have neither attribute, so they're
  // untouched by this code (querySelectorAll below simply finds none there).
  var modalOverlay = document.getElementById('card-modal-overlay');
  var modalBody = document.getElementById('card-modal-body');
  var modalClose = document.querySelector('.card-modal-close');

  if (modalOverlay && modalBody && modalClose) {
    var lastFocusedCard = null;

    function openCardModal(card) {
      var template = card.querySelector('.card-detail');
      if (!template) return;

      lastFocusedCard = card;
      modalBody.innerHTML = '';
      modalBody.appendChild(template.content.cloneNode(true));

      modalOverlay.hidden = false;
      document.body.classList.add('modal-open');
      modalClose.focus();
    }

    function closeCardModal() {
      modalOverlay.hidden = true;
      document.body.classList.remove('modal-open');
      modalBody.innerHTML = '';

      if (lastFocusedCard) {
        lastFocusedCard.focus();
        lastFocusedCard = null;
      }
    }

    var interactiveCards = document.querySelectorAll('.card[tabindex]');
    interactiveCards.forEach(function (card) {
      // Hover-to-expand popover (2026-09-23): clone this card's own
      // <template class="card-detail"> — the same one openCardModal()
      // reads from above — into a .card-popover panel appended to the
      // card, once, at page load. It reuses .card-modal-body for its
      // internal heading/paragraph/list styling, so the content reads
      // identically whether it's reached by hovering or by opening the
      // full modal. Showing/hiding it is pure CSS, gated to hover-capable
      // pointers only (see the (hover: hover) rule in css/style.css), so
      // touchscreens never render it and fall through to the tap-to-open
      // modal below instead.
      var detailTemplate = card.querySelector('.card-detail');
      if (detailTemplate) {
        var popover = document.createElement('div');
        popover.className = 'card-popover card-modal-body';
        popover.setAttribute('aria-hidden', 'true');
        popover.appendChild(detailTemplate.content.cloneNode(true));
        card.appendChild(popover);
      }

      card.addEventListener('click', function () {
        openCardModal(card);
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          openCardModal(card);
        }
      });
    });

    modalClose.addEventListener('click', closeCardModal);

    modalOverlay.addEventListener('click', function (event) {
      if (event.target === modalOverlay) {
        closeCardModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modalOverlay.hidden) {
        closeCardModal();
      }
    });
  }
});

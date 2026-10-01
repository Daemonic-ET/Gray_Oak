// Gray Oak Advisory — minimal site behavior (no build tools required)

// Contact page form (2026-09-28, preliminary): the site is static with no
// backend, so there's nowhere for a real form submission to post yet.
// CONTACT_EMAIL below is a placeholder — replace it with the real inbox
// this should reach before the contact page goes live.
var CONTACT_EMAIL = 'ask@grayoakadvisory.com';

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

  // Contact form (2026-09-28, preliminary): with no backend to post to,
  // "Send" instead opens the visitor's own email app with their answers
  // already filled into a message addressed to CONTACT_EMAIL above. Only
  // runs on contact.html — every other page has no #contact-form, so
  // this block is skipped everywhere else.
  //
  // All four fields (Name, Organization, Email, "What are you working
  // on?") are `required` in the HTML, and the form no longer carries
  // `novalidate` (2026-10-01, client request — it previously did, which
  // made `required` purely decorative and let an empty or malformed
  // submission through regardless). With `novalidate` gone, the browser
  // now runs its own native constraint validation on submit — blocking
  // it, focusing the first invalid field, and showing its built-in
  // "please fill out this field" messaging for an empty field — and
  // only dispatches this 'submit' event once every field passes,
  // including the Email field's built-in type="email" format check. No
  // extra validation code is needed here as a result; every value read
  // below is guaranteed non-empty and, for email, already address-
  // shaped by the time this handler runs.
  var contactForm = document.getElementById('contact-form');

  // Email field's own browser-default format message ("Please include
  // an '@' in the email address", wording varies by browser) replaced
  // with a plain, consistent one (2026-10-01, client request): the
  // 'invalid' event fires whenever this field fails constraint
  // validation — on an empty field that's the `required` check
  // (validity.valueMissing), on a non-empty but malformed one it's the
  // `type="email"` format check (validity.typeMismatch). Only the
  // format case gets the custom message; an empty field still falls
  // through to the browser's own "please fill out this field" wording,
  // same as every other required field on the form. The 'input'
  // listener clears any custom message on every keystroke, which is
  // required by the Constraint Validation API — setCustomValidity()
  // otherwise keeps a field invalid even after it's corrected, since
  // the browser doesn't clear a custom message on its own.
  var emailInput = document.getElementById('contact-email');

  if (emailInput) {
    emailInput.addEventListener('invalid', function () {
      if (emailInput.validity.typeMismatch) {
        emailInput.setCustomValidity('Please provide a valid email address.');
      } else {
        emailInput.setCustomValidity('');
      }
    });

    emailInput.addEventListener('input', function () {
      emailInput.setCustomValidity('');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = document.getElementById('contact-name').value.trim();
      var organization = document.getElementById('contact-org').value.trim();
      var email = document.getElementById('contact-email').value.trim();
      var message = document.getElementById('contact-message').value.trim();

      var subject = 'New inquiry from ' + name;
      var body = [
        'Name: ' + name,
        'Organization: ' + organization,
        'Email: ' + email,
        '',
        message
      ].join('\n');

      window.location.href = 'mailto:' + CONTACT_EMAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }
});

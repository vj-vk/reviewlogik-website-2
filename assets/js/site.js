// ReviewLogik — shared site behavior: scroll reveals, stat counters, mobile nav.
// Loaded on every page. No framework, no dependencies.
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll reveal --------------------------------------------------
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // --- Stat counters ----------------------------------------------------
  // Usage: <span class="counter" data-target="84" data-suffix="%">0</span>
  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-target') || '0');
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var counterIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterIo.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  // --- Mobile nav toggle --------------------------------------------------
  var navToggle = document.querySelector('.nav-toggle');
  var navMobile = document.querySelector('.nav-mobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // --- Pillar tabs (Protect/Grow/Improve, rater8-style selector) ---------
  // Markup contract: a container with [data-pillar-tabs] holding
  // .pillar-tab-list buttons (each with data-pillar="key") and sibling
  // .pillar-panel elements (each with data-pillar="key"). Clicking a tab
  // shows the matching panel and hides the rest.
  var tabGroups = document.querySelectorAll('[data-pillar-tabs]');
  tabGroups.forEach(function (group) {
    var buttons = group.querySelectorAll('.pillar-tab-btn');
    var panels = group.querySelectorAll('.pillar-panel');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-pillar');
        buttons.forEach(function (b) { b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
        panels.forEach(function (p) {
          if (p.getAttribute('data-pillar') === key) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
      });
    });
  });

  // --- Sequential fade-in for the homepage AI insight panel --------------
  var insightLines = document.querySelectorAll('.insight-line');
  if (insightLines.length) {
    if (prefersReducedMotion) {
      insightLines.forEach(function (el) { el.classList.add('in'); });
    } else if ('IntersectionObserver' in window) {
      var panelIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            insightLines.forEach(function (el, i) {
              setTimeout(function () { el.classList.add('in'); }, i * 260);
            });
            panelIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      var panel = document.querySelector('.insight-panel');
      if (panel) panelIo.observe(panel);
    }
  }
})();

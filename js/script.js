/**
 * Richie Rich - Luxury Redesign Script
 * Pan, Coffee & Essentials | 24x7 Ahmedabad
 */

(function () {
  'use strict';

  /* ============================================================
     1. LUXURY PRELOADER CONTROLLER (DELIBERATE PACING)
     ============================================================ */
  function initPreloader() {
    var bar = document.getElementById('preloaderBar');
    var circleBar = document.getElementById('preloaderCircleBar');
    var counter = document.getElementById('preloaderCounter');
    var status = document.getElementById('preloaderStatus');
    var preloader = document.getElementById('preloader');

    if (!bar && !circleBar && !preloader) return;

    var progress = 0;
    var isLoaded = false;
    var startTime = Date.now();
    var totalDuration = 3400; // Deliberate luxury duration (~3.4 seconds)
    var circumference = 515.22; // 2 * Math.PI * 82

    var stages = [
      { at: 0,  text: 'Preparing experience' },
      { at: 30, text: 'Brewing aura' },
      { at: 65, text: 'Calibrating 24x7 dial' },
      { at: 96, text: 'Welcome to Richie Rich' }
    ];

    function updateStatus(val) {
      if (!status) return;
      for (var i = stages.length - 1; i >= 0; i--) {
        if (val >= stages[i].at) {
          if (status.textContent !== stages[i].text) {
            status.textContent = stages[i].text;
          }
          break;
        }
      }
    }

    function render() {
      if (bar) bar.style.width = progress + '%';
      if (circleBar) {
        var offset = circumference - (circumference * progress / 100);
        circleBar.style.strokeDashoffset = offset;
      }
      if (counter) {
        counter.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
      }
      updateStatus(progress);
    }

    var timer = setInterval(function () {
      var elapsed = Date.now() - startTime;
      var timeFraction = Math.min(1, elapsed / totalDuration);

      // Smooth luxury ease-in-out curve
      var naturalProgress;
      if (timeFraction < 0.5) {
        naturalProgress = 2 * timeFraction * timeFraction * 100;
      } else {
        naturalProgress = (-1 + (4 - 2 * timeFraction) * timeFraction) * 100;
      }

      if (!isLoaded && naturalProgress > 90) {
        progress = Math.min(progress + 0.1, 92);
      } else {
        progress = naturalProgress;
      }

      if (progress >= 100) {
        progress = 100;
        render();
        clearInterval(timer);
        dismiss();
      } else {
        render();
      }
    }, 30);

    function markReady() {
      isLoaded = true;
    }

    function dismiss() {
      // Hold briefly at 100% so user enjoys the complete circle and 100% count
      setTimeout(function () {
        preloader.classList.add('loaded');
        document.documentElement.classList.remove('is-loading');
        document.documentElement.classList.add('hero-visible');
        setTimeout(function () {
          if (preloader.parentNode) {
            preloader.style.display = 'none';
          }
        }, 900);
      }, 400);
    }

    if (document.readyState === 'complete') {
      markReady();
    } else {
      window.addEventListener('load', markReady, { once: true });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(markReady).catch(function () {});
    }

    // Safety fallback
    setTimeout(function () {
      isLoaded = true;
    }, 4500);
  }

  /* ============================================================
     2. RESPONSIVE MOBILE NAVIGATION DRAWER
     ============================================================ */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('mobileDrawer');
    var overlay = document.getElementById('drawerOverlay');
    var closeBtn = document.getElementById('drawerClose');

    if (!toggle || !drawer) return;

    function openDrawer() {
      toggle.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Close when clicking nav links
    var links = drawer.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
      }
    });
  }

  /* ============================================================
     3. 24-HOUR HOROLOGICAL DIAL (AHMEDABAD TIME)
     ============================================================ */
  function initDial() {
    var t = document.getElementById('ticks');
    if (t) {
      var s = '';
      for (var i = 0; i < 24; i++) {
        var a = (i / 24) * 2 * Math.PI;
        var major = i % 6 === 0;
        var r1 = major ? 150 : 160;
        var r2 = 172;
        s += '<line x1="' + (250 + Math.sin(a) * r1) + '" y1="' + (250 - Math.cos(a) * r1) +
          '" x2="' + (250 + Math.sin(a) * r2) + '" y2="' + (250 - Math.cos(a) * r2) +
          '" stroke-width="' + (major ? 2.5 : 1) + '"/>';
      }
      t.innerHTML = s;
    }

    var fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    });

    function tick() {
      var d = new Date();
      var p = parts.formatToParts(d);
      var hItem = p.find(function (x) { return x.type === 'hour'; });
      var mItem = p.find(function (x) { return x.type === 'minute'; });
      var h = hItem ? +hItem.value : 0;
      var m = mItem ? +mItem.value : 0;

      var hand = document.getElementById('hand');
      var timeEl = document.getElementById('time');

      if (hand) {
        hand.style.transform = 'rotate(' + (((h + m / 60) / 24) * 360 + 180) + 'deg)';
      }
      if (timeEl) {
        timeEl.textContent = fmt.format(d).toUpperCase();
      }
    }

    tick();
    setInterval(tick, 30000);
  }

  /* ============================================================
     4. HEADER SCROLL & HERO SPOTLIGHT
     ============================================================ */
  function initVisualEffects() {
    var hd = document.getElementById('hd');
    if (hd) {
      window.addEventListener('scroll', function () {
        hd.classList.toggle('solid', window.scrollY > 40);
      }, { passive: true });
    }

    var hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }

    // Marquee text generator
    var tk = document.getElementById('tk');
    if (tk) {
      var phrase = 'Pan \u2726 Coffee \u2726 Essentials \u2726 Open 24x7 \u2726 ';
      tk.textContent = phrase.repeat(10);
    }
  }

  /* ============================================================
     5. STORES TAB SWITCHER
     ============================================================ */
  function initStores() {
    var stores = [
      {
        n: 'Sindhubhavan',
        d: 'Our signature pan and cafe experience at the heart of Sindhu Bhavan Road.',
        u: 'https://maps.app.goo.gl/Gkbc3uVHPLafqgB16'
      },
      {
        n: 'Bopal',
        d: 'The finest blends and everyday essentials for the Bopal community, around the clock.',
        u: 'https://maps.app.goo.gl/wA2YBsK2nWhjoj437'
      },
      {
        n: 'Gota',
        d: 'Our newest flagship, now open and serving Gota day and night.',
        u: 'https://maps.app.goo.gl/Te8ErYyw6rZcx8ry6'
      },
      {
        n: 'SG Highway',
        d: 'Premium pan, coffee and essentials on Ahmedabad\u2019s busiest corridor.',
        u: 'https://www.google.com/maps/place/Richie+Rich+Pan+House+%7C+SG+Highway/@23.0525616,72.5187365,17z'
      }
    ];

    var tabs = document.getElementById('tabs');
    var panel = document.getElementById('panel');
    if (!tabs || !panel) return;

    function show(i, animate) {
      Array.prototype.forEach.call(tabs.children, function (b, j) {
        b.setAttribute('aria-selected', j === i);
        b.tabIndex = (j === i) ? 0 : -1;
      });

      var s = stores[i];
      panel.innerHTML =
        '<div>' +
          '<span class="pill"><i></i>OPEN NOW, 24X7</span>' +
          '<h3>' + s.n + '</h3>' +
          '<p>' + s.d + '</p>' +
        '</div>' +
        '<div>' +
          '<a class="btn line" href="' + s.u + '" target="_blank" rel="noopener">Get directions</a>' +
        '</div>';

      if (animate) {
        panel.classList.remove('swap');
        void panel.offsetWidth;
        panel.classList.add('swap');
      }
    }

    stores.forEach(function (s, i) {
      var b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.innerHTML = '<span>' + s.n + '</span><small>Open 24x7</small>';
      b.onclick = function () { show(i, true); };
      b.onkeydown = function (e) {
        var k = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
        if (!k) return;
        e.preventDefault();
        var n = (i + k + stores.length) % stores.length;
        show(n, true);
        tabs.children[n].focus();
      };
      tabs.appendChild(b);
    });

    show(0, false);
  }

  /* ============================================================
     6. CONTACT FORM VALIDATION & SUBMISSION
     ============================================================ */
  function initContactForm() {
    var form = document.getElementById('form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      var ok = document.getElementById('ok');
      if (!ok) return;

      if (!f.name.value.trim() || !/^\S+@\S+\.\S+$/.test(f.email.value) || !f.msg.value.trim()) {
        ok.textContent = 'Please fill in your name, a valid email and a message.';
        ok.style.color = '#e07a7a';
        return;
      }

      var body = 'Name: ' + f.name.value + '\nEmail: ' + f.email.value + '\n\n' + f.msg.value;
      window.location.href = 'mailto:hello@richierich24x7.com?subject=' +
        encodeURIComponent('Website message from ' + f.name.value) +
        '&body=' + encodeURIComponent(body);

      ok.style.color = 'var(--lgold)';
      ok.textContent = 'Opening your email client. Thank you for reaching out.';
    });
  }

  // Initialize all modules on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initMobileNav();
    initDial();
    initVisualEffects();
    initStores();
    initContactForm();
  });
})();


/**
 * BECKER Hörakustik – Shared Navigation JS
 * Handles: nav scroll, dropdown menus (gap-bug-free), mobile menu,
 *          search overlay, cookie consent, reveal animations.
 */
(function () {
  'use strict';

  var searchOverlay;
  var searchInput;
  var searchCloseBtn;
  var searchResults;
  var cookieBanner;

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function removeAllById(id) {
    queryAll('#' + id).forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function getRootPrefix() {
    var navScript = document.querySelector('script[src$="nav.js"], script[src$="/nav.js"], script[src*="nav.js?"]');
    if (!navScript) return '';
    return (navScript.getAttribute('src') || '').replace(/nav\.js(?:\?.*)?$/, '');
  }

  function makeHref(path) {
    return getRootPrefix() + path;
  }

  function applyTextReplacements(value) {
    var result = value;
    [
      [/BECKER Hoerakustik/g, 'BECKER Hörakustik'],
      [/Becker Hoerakustik/g, 'Becker Hörakustik'],
      [/Fachgeschaefte/g, 'Fachgeschäfte'],
      [/Fachgeschaeft/g, 'Fachgeschäft'],
      [/Hauptgeschaeft/g, 'Hauptgeschäft'],
      [/Geschaeft/g, 'Geschäft'],
      [/geschaeft/g, 'geschäft'],
      [/Naechster/g, 'Nächster'],
      [/naechster/g, 'nächster'],
      [/Oeffnungszeiten/g, 'Öffnungszeiten'],
      [/oeffnungszeiten/g, 'öffnungszeiten'],
      [/Schliessen/g, 'Schließen'],
      [/schliessen/g, 'schließen'],
      [/Menue/g, 'Menü'],
      [/Schillerstrasse/g, 'Schillerstraße'],
      [/Marktstrasse/g, 'Marktstraße'],
      [/Langendorfer Strasse/g, 'Langendorfer Straße'],
      [/Bahnhofstrasse/g, 'Bahnhofstraße'],
      [/Kirchstrasse/g, 'Kirchstraße'],
      [/Burgstrasse/g, 'Burgstraße'],
      [/Fliehburgstrasse/g, 'Fliehburgstraße'],
      [/strasse/g, 'straße'],
      [/Strasse/g, 'Straße'],
      [/Praezision/g, 'Präzision'],
      [/Erklaerungen/g, 'Erklärungen'],
      [/erklaert/g, 'erklärt'],
      [/verstaendlich/g, 'verständlich'],
      [/Fuehrt/g, 'Führt'],
      [/fuehrt/g, 'führt'],
      [/Rueck/g, 'Rück'],
      [/rueck/g, 'rück'],
      [/laeng/g, 'läng'],
      [/\bPaed/g, 'Päd'],
      [/\bpaed/g, 'päd'],
      [/\bHoer/g, 'Hör'],
      [/\bhoer/g, 'hör']
    ].forEach(function (replacement) {
      result = result.replace(replacement[0], replacement[1]);
    });
    return result;
  }

  function normalizeSiteCopy(root) {
    var attrNames = ['title', 'alt', 'placeholder', 'aria-label'];
    var walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (!node.parentNode) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE|PRE|SVG|PATH)$/i.test(node.parentNode.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var current;

    while ((current = walker.nextNode())) {
      current.nodeValue = applyTextReplacements(current.nodeValue);
    }

    queryAll('*', root || document.body).forEach(function (element) {
      attrNames.forEach(function (attrName) {
        if (!element.hasAttribute(attrName)) return;
        element.setAttribute(attrName, applyTextReplacements(element.getAttribute(attrName)));
      });
    });
  }

  function standardizeHeaderCtas() {
    queryAll('.nav-actions .btn.btn-primary').forEach(function (link) {
      link.textContent = 'Termin vereinbaren';
      link.classList.add('nav-cta');
    });
  }

  function ensureDropdown(selector, label, items) {
    queryAll(selector).forEach(function (link) {
      var item = link.parentNode;
      if (!item || item.querySelector(':scope > .dropdown-menu')) return;

      link.innerHTML = label + ' <svg class="nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg>';
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      var menu = document.createElement('ul');
      menu.className = 'dropdown-menu';
      menu.innerHTML = items.join('');
      item.appendChild(menu);
    });
  }

  function ensureSharedDropdowns() {
    ensureDropdown('.nav-links .nav-item > a[href$="hoertest.html"]', 'Leistungen', [
      '<li><a href="' + makeHref('leistungen/audio-therapie.html') + '">Audio-Therapie</a></li>',
      '<li><a href="' + makeHref('leistungen/hoergeraetehersteller-partner.html') + '">Hörgerätehersteller &amp; Partner</a></li>',
      '<li><a href="' + makeHref('leistungen/hoertest.html') + '">Hörtest</a></li>',
      '<li><a href="' + makeHref('leistungen/hoertraining.html') + '">Hörtraining</a></li>',
      '<li><a href="' + makeHref('leistungen/paedakustik.html') + '">Pädakustik</a></li>',
      '<li><a href="' + makeHref('leistungen/kinderhoerzentrum.html') + '">Kinderhörzentrum</a></li>',
      '<li><a href="' + makeHref('leistungen/remote-fitting.html') + '">Remote Fitting</a></li>',
      '<li><a href="' + makeHref('leistungen/serviceleistung.html') + '">Serviceleistungen</a></li>',
      '<li><a href="' + makeHref('leistungen/tinnitusberatung.html') + '">Tinnitusberatung</a></li>',
      '<li><a href="' + makeHref('leistungen/gehoerschutz.html') + '">Gehörschutz</a></li>',
      '<li><a href="' + makeHref('leistungen/treffpunkt-ohr.html') + '">Treffpunkt Ohr e.V.</a></li>'
    ]);

    ensureDropdown('.nav-links .nav-item > a[href$="ratgeber/index.html"]', 'Ratgeber', [
      '<li><a href="' + makeHref('ratgeber/index.html') + '">Informationen zum guten Hören</a></li>',
      '<li><a href="' + makeHref('ratgeber/index.html#faq') + '">Ihre Fragen, unsere Antworten</a></li>'
    ]);

    ensureDropdown('.nav-links .nav-item > a[href$="firmengeschichte.html"]', 'Unternehmen', [
      '<li><a href="' + makeHref('unternehmen/karriere.html') + '">Karriere - jetzt bewerben</a></li>',
      '<li><a href="' + makeHref('unternehmen/firmenchronik.html') + '">Firmenchronik</a></li>',
      '<li><a href="' + makeHref('unternehmen/firmengeschichte.html') + '">Firmengeschichte</a></li>',
      '<li><a href="' + makeHref('unternehmen/unsere-werte.html') + '">Unsere Werte</a></li>',
      '<li><a href="' + makeHref('unternehmen/linksammlung.html') + '">Linksammlung</a></li>',
      '<li><a href="' + makeHref('unternehmen/rein-romantik.html') + '">Rein Romantik</a></li>',
      '<li><a href="' + makeHref('unternehmen/hauszeitschrift.html') + '">Unsere Hauszeitschrift</a></li>'
    ]);
  }

  function ensureSearchOverlay() {
    var overlay;
    removeAllById('searchOverlay');
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'searchOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Suche');
    overlay.innerHTML = [
      '<div class="search-overlay-inner">',
      '  <div class="search-bar-row">',
      '    <div class="search-input-wrap">',
      '      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
      '      <input type="text" id="searchInput" placeholder="Suchen auf BECKER Hörakustik ..." autocomplete="off" />',
      '    </div>',
      '    <button class="search-close-btn" id="searchClose" aria-label="Suche schließen">×</button>',
      '  </div>',
      '  <div class="search-results" id="searchResults" aria-live="polite"></div>',
      '  <p class="search-hint">ESC drücken oder × klicken zum Schließen</p>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);
    return overlay;
  }

  function ensureCookieBanner() {
    var banner;
    removeAllById('cookieBanner');
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML = [
      '<div class="cookie-text">',
      '  <strong>Wir verwenden Cookies</strong> - für eine bessere Website-Erfahrung und zur Analyse unseres Angebots. Mehr dazu auf der <a href="' + makeHref('kontakt.html') + '">Kontaktseite</a>.',
      '</div>',
      '<div class="cookie-actions">',
      '  <button class="btn btn-secondary" style="font-size:14px;padding:10px 20px;" data-cookie-choice="essential">Nur notwendige</button>',
      '  <button class="btn btn-primary" style="font-size:14px;padding:10px 20px;" data-cookie-choice="all">Alle akzeptieren</button>',
      '</div>'
    ].join('');
    document.body.appendChild(banner);
    return banner;
  }

  function applyLocalImageFallbacks() {
    /* Allow remote images (Unsplash etc.) to load freely. */
  }

  /* Lightweight lightbox: any element with data-lightbox-src opens a fullscreen overlay. */
  function ensureLightbox() {
    if (document.getElementById('bkLightbox')) return document.getElementById('bkLightbox');
    var lb = document.createElement('div');
    lb.id = 'bkLightbox';
    lb.className = 'bk-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="bk-lightbox-close" aria-label="Schließen">&times;</button><img alt="" />';
    document.body.appendChild(lb);
    var style = document.createElement('style');
    style.textContent = '.bk-lightbox{position:fixed;inset:0;z-index:1500;background:rgba(15,5,20,0.92);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;padding:32px;cursor:zoom-out;animation:bkFade .25s ease}.bk-lightbox.active{display:flex}.bk-lightbox img{max-width:min(1100px,92vw);max-height:88vh;border-radius:14px;box-shadow:0 30px 90px rgba(0,0,0,.5);object-fit:contain;animation:bkPop .3s cubic-bezier(.2,.7,.3,1)}.bk-lightbox-close{position:absolute;top:22px;right:26px;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:28px;line-height:1;cursor:pointer;border:1px solid rgba(255,255,255,.2);transition:background .2s}.bk-lightbox-close:hover{background:rgba(255,255,255,.22)}@keyframes bkFade{from{opacity:0}to{opacity:1}}@keyframes bkPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}';
    document.head.appendChild(style);
    var img = lb.querySelector('img');
    var closeBtn = lb.querySelector('.bk-lightbox-close');
    function close() { lb.classList.remove('active'); document.body.style.overflow = ''; }
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === closeBtn) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    lb._open = function (src, alt) { img.src = src; img.alt = alt || ''; lb.classList.add('active'); document.body.style.overflow = 'hidden'; };
    return lb;
  }
  var lightbox = ensureLightbox();
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-lightbox-src]');
    if (!trigger) return;
    e.preventDefault();
    lightbox._open(trigger.getAttribute('data-lightbox-src'), trigger.getAttribute('data-lightbox-alt') || '');
  });

  function closeAllMenus(exceptItem) {
    queryAll('.nav-item.is-open').forEach(function (item) {
      if (item !== exceptItem) {
        item.classList.remove('is-open');
        var trigger = item.querySelector(':scope > a');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function isMobileNavViewport() {
    return window.matchMedia('(max-width: 1024px)').matches;
  }

  /* Nav scroll shadow */
  var nav = document.getElementById('nav');
  standardizeHeaderCtas();
  normalizeSiteCopy(document.body);
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* Dropdown menus */
  ensureSharedDropdowns();
  queryAll('.nav-item').forEach(function (item) {
    var menu = item.querySelector(':scope > .dropdown-menu');
    var trigger = item.querySelector(':scope > a');
    if (!menu || !trigger) return;

    var closeTimer = null;

    function openMenu() {
      window.clearTimeout(closeTimer);
      closeAllMenus(item);
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function delayedClose(nextTarget) {
      if (isMobileNavViewport()) return;
      if (nextTarget && item.contains(nextTarget)) return;
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(closeMenu, 220);
    }

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    item.addEventListener('pointerenter', function () {
      if (isMobileNavViewport()) return;
      openMenu();
    });
    item.addEventListener('pointerleave', function (event) {
      delayedClose(event.relatedTarget);
    });
    item.addEventListener('focusin', function () {
      if (isMobileNavViewport()) return;
      openMenu();
    });
    item.addEventListener('focusout', function (event) {
      delayedClose(event.relatedTarget);
    });
    menu.addEventListener('pointerenter', function () {
      if (isMobileNavViewport()) return;
      window.clearTimeout(closeTimer);
    });
    menu.addEventListener('pointerleave', function (event) {
      delayedClose(event.relatedTarget);
    });

    trigger.addEventListener('click', function (event) {
      var isDesktopNav = !isMobileNavViewport();
      if (!isDesktopNav) {
        event.preventDefault();
        item.classList.contains('is-open') ? closeMenu() : openMenu();
        return;
      }
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.classList.contains('is-open') ? closeMenu() : openMenu();
      }
      if (event.key === 'Escape') {
        closeMenu();
        trigger.focus();
      }
    });
  });

  document.addEventListener('pointerdown', function (event) {
    if (isMobileNavViewport()) {
      if (navLinks && navLinks.classList.contains('mobile-open') && !event.target.closest('.nav-inner')) {
        closeMobileMenu();
      }
      return;
    }
    if (!event.target.closest('.nav-item')) closeAllMenus();
  });

  /* Mobile menu toggle */
  var mobileToggle = document.querySelector('.mobile-toggle');
  var navLinks = document.querySelector('.nav-links');
  function closeMobileMenu() {
    if (!mobileToggle || !navLinks) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('mobile-open');
    document.body.classList.remove('nav-open');
    closeAllMenus();
  }
  if (mobileToggle && navLinks) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.addEventListener('click', function () {
      var isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('mobile-open', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);
    });

    queryAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        var parentItem = link.parentNode;
        var isMobileDropdownTrigger = parentItem && parentItem.classList.contains('nav-item') && parentItem.querySelector(':scope > .dropdown-menu');
        if (isMobileNavViewport()) {
          if (isMobileDropdownTrigger) return;
          closeMobileMenu();
        }
      });
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 1025px)').matches) closeMobileMenu();
    });
  }

  /* Search overlay + real search */
  searchOverlay = ensureSearchOverlay();
  searchInput = searchOverlay.querySelector('#searchInput');
  searchCloseBtn = searchOverlay.querySelector('#searchClose');
  searchResults = searchOverlay.querySelector('#searchResults');

  function uniqueResults(results) {
    var seen = {};
    return results.filter(function (result) {
      var key = result.title + '|' + result.url;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function buildSearchIndex() {
    var items = [
      { title: 'Startseite', url: makeHref('index.html'), text: 'Hero Leistungen Termin Hoertest Hoerexperten Botschafter Veranstaltungen Fachgeschaefte' },
      { title: 'Fachgeschäfte', url: makeHref('fachgeschaefte.html'), text: 'Standorte Karte Suche Stadt in der Nähe Öffnungszeiten Route Fachgeschäfte' },
      { title: 'Fachgeschäft Andernach', url: makeHref('fachgeschaefte/andernach.html'), text: 'Andernach Team Öffnungszeiten Parken Karte Termin Beratung' },
      { title: 'Fachgeschäft Mainz', url: makeHref('fachgeschaefte/mainz.html'), text: 'Mainz Team Öffnungszeiten Innenstadt Termin Hörberatung' },
      { title: 'Fachgeschäft Neuwied', url: makeHref('fachgeschaefte/neuwied.html'), text: 'Neuwied Team Kinderhörzentrum Öffnungszeiten Termin Beratung' },
      { title: 'Kontakt', url: makeHref('kontakt.html'), text: 'Kontakt Termin Anfrage Karte Telefon E-Mail Hausbesuch' },
      { title: 'Veranstaltungen', url: makeHref('veranstaltungen.html'), text: 'Events Vorträge Informationen Termine' },
      { title: 'News', url: makeHref('news.html'), text: 'Neuigkeiten Magazin Ratgeber' },
      { title: 'Hörtest', url: makeHref('leistungen/hoertest.html'), text: 'Kostenfreier Hörtest Termin Beratung' },
      { title: 'Kinderhoerzentrum', url: makeHref('leistungen/kinderhoerzentrum.html'), text: 'Kindgerecht kompetent liebevoll Kinder Pädakustik' },
      { title: 'Remote Fitting', url: makeHref('leistungen/remote-fitting.html'), text: 'Anpassung Zuhause digital Service' },
      { title: 'Tinnitusberatung', url: makeHref('leistungen/tinnitusberatung.html'), text: 'Tinnitus Beratung Therapie Hilfe' },
      { title: 'Ratgeber und FAQ', url: makeHref('ratgeber/index.html#faq'), text: 'Antworten FAQ gutes Hören Fragen Ratgeber' }
    ];

    queryAll('section[id], [id].content-section, header[id], .hero, .page-hero').forEach(function (section) {
      var heading = section.querySelector('h1, h2, h3');
      if (!heading) return;
      var id = section.id;
      var text = section.textContent.replace(/\s+/g, ' ').trim().slice(0, 220);
      var pageName = window.location.pathname.split('/').pop() || 'index.html';
      items.push({
        title: heading.textContent.trim(),
        url: id ? pageName + '#' + id : pageName,
        text: text
      });
    });

    queryAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      var title = link.textContent.replace(/\s+/g, ' ').trim();
      if (!href || !title || href === '#' || href.indexOf('javascript:') === 0) return;
      items.push({ title: title, url: href, text: title + ' ' + href });
    });

    return uniqueResults(items);
  }

  var searchIndex = buildSearchIndex();

  function renderSearchResults(query) {
    if (!searchResults) return;

    var normalized = (query || '').toLowerCase().trim();
    var matches = searchIndex;

    if (normalized) {
      matches = searchIndex.map(function (item) {
        var haystack = (item.title + ' ' + item.text + ' ' + item.url).toLowerCase();
        var score = 0;
        if (item.title.toLowerCase().indexOf(normalized) !== -1) score += 5;
        if (item.url.toLowerCase().indexOf(normalized) !== -1) score += 3;
        if (haystack.indexOf(normalized) !== -1) score += 1;
        item._score = score;
        return item;
      }).filter(function (item) {
        return item._score > 0;
      }).sort(function (a, b) {
        return b._score - a._score;
      });
    }

    matches = matches.slice(0, 8);

    if (!matches.length) {
      searchResults.innerHTML = '<div class="search-empty">Keine Treffer gefunden. Versuchen Sie Begriffe wie Hörtest, Kontakt, Fachgeschäfte oder Kinderhörzentrum.</div>';
      return;
    }

    searchResults.innerHTML = matches.map(function (item) {
      var teaser = item.text.replace(/\s+/g, ' ').trim().slice(0, 120);
      return [
        '<a class="search-result-card" href="' + item.url + '">',
        '  <span class="search-result-kicker">Treffer</span>',
        '  <strong>' + item.title + '</strong>',
        '  <span class="search-result-copy">' + teaser + '</span>',
        '  <span class="search-result-url">' + item.url + '</span>',
        '</a>'
      ].join('');
    }).join('');
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderSearchResults(searchInput ? searchInput.value : '');
    if (searchInput) {
      window.setTimeout(function () {
        searchInput.focus();
        searchInput.select();
      }, 60);
    }
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.bkOpenSearch = openSearch;

  queryAll('.nav-search-btn').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      openSearch();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderSearchResults(searchInput.value);
    });
  }
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (event) {
      if (event.target === searchOverlay) closeSearch();
    });
    searchOverlay.addEventListener('click', function (event) {
      if (event.target.closest('.search-result-card')) closeSearch();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSearch();
      closeAllMenus();
    }
  });

  /* Cookie consent */
  cookieBanner = ensureCookieBanner();
  applyLocalImageFallbacks();
  if (cookieBanner && localStorage.getItem('bkCookieConsent')) {
    cookieBanner.classList.add('hidden');
  }
  window.bkAcceptCookies = function (type) {
    localStorage.setItem('bkCookieConsent', type);
    if (cookieBanner) cookieBanner.classList.add('hidden');
  };
  queryAll('[data-cookie-choice]', cookieBanner).forEach(function (button) {
    button.addEventListener('click', function () {
      window.bkAcceptCookies(button.getAttribute('data-cookie-choice'));
    });
  });

  /* FAQ accordion */
  queryAll('.faq-item').forEach(function (item) {
    var button = item.querySelector('.faq-q');
    if (!button) return;
    button.addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });

  /* Reveal on scroll */
  var revealEls = queryAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in');
    });
  }

  /* Staggered animation delays */
  function stagger(selector, delayMs) {
    queryAll(selector).forEach(function (el, index) {
      el.style.transitionDelay = (index * delayMs) + 'ms';
    });
  }
  stagger('.leistungen-grid .service-card', 55);
  stagger('.cards-grid .card', 80);
  stagger('.testimonials .testimonial', 100);
  stagger('.events-grid .event-card', 100);
  stagger('.store-grid .store-card', 50);
})();

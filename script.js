/* ==========================================================================
   Dr. Zelalem Teshome Wale — Portfolio interactions
   Vanilla JS only, no build step, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navAnchors.forEach(function (a) {
      var match = a.getAttribute("href") === "#" + current.id;
      a.classList.toggle("active", match);
    });
  }
  if (sections.length) {
    window.addEventListener("scroll", throttle(setActiveLink, 120), { passive: true });
    setActiveLink();
  }

  /* ---------- Header shadow / border on scroll ---------- */
  var header = document.querySelector(".site-header");
  function setHeaderState() {
    if (!header) return;
    header.style.borderBottomColor = window.scrollY > 20 ? "var(--line-strong)" : "var(--line)";
  }
  window.addEventListener("scroll", throttle(setHeaderState, 120), { passive: true });
  setHeaderState();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Publications search ---------- */
  var pubSearch = document.getElementById("pubSearch");
  var pubCount = document.getElementById("pubCount");
  var pubEmpty = document.getElementById("pubEmpty");
  var pubItems = Array.prototype.slice.call(document.querySelectorAll(".pub-item"));
  var pubYearGroups = Array.prototype.slice.call(document.querySelectorAll(".pub-year-group"));
  var totalPubs = pubItems.length;

  function updatePubCount(n) {
    if (!pubCount) return;
    pubCount.textContent = n + " of " + totalPubs + " publications";
  }
  updatePubCount(totalPubs);

  function filterPubs() {
    var q = (pubSearch.value || "").trim().toLowerCase();
    var visible = 0;

    pubItems.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = q === "" || text.indexOf(q) !== -1;
      item.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    pubYearGroups.forEach(function (group) {
      var anyVisible = group.querySelectorAll(".pub-item:not(.is-hidden)").length > 0;
      group.style.display = anyVisible ? "" : "none";
    });

    updatePubCount(visible);
    if (pubEmpty) pubEmpty.classList.toggle("show", visible === 0);
  }

  if (pubSearch) {
    pubSearch.addEventListener("input", debounce(filterPubs, 120));
  }

  /* ---------- Lattice diagram hero background (Hasse diagram, B3) ---------- */
  var latticeBg = document.getElementById("latticeBg");
  if (latticeBg) {
    latticeBg.innerHTML = buildLatticeSVG();
  }

  function buildLatticeSVG() {
    var W = 1000, H = 700;
    // Boolean lattice B3: bottom, 3 atoms, 3 coatoms, top
    var bottom = { x: 500, y: 610 };
    var atoms = [
      { x: 260, y: 430 },
      { x: 500, y: 430 },
      { x: 740, y: 430 }
    ];
    var coatoms = [
      { x: 260, y: 220 },
      { x: 500, y: 220 },
      { x: 740, y: 220 }
    ];
    var top = { x: 500, y: 60 };

    var edges = [];
    atoms.forEach(function (a) { edges.push([bottom, a]); });
    // cube covering relations between atoms and coatoms
    edges.push([atoms[0], coatoms[0]]);
    edges.push([atoms[0], coatoms[1]]);
    edges.push([atoms[1], coatoms[0]]);
    edges.push([atoms[1], coatoms[2]]);
    edges.push([atoms[2], coatoms[1]]);
    edges.push([atoms[2], coatoms[2]]);
    coatoms.forEach(function (c) { edges.push([c, top]); });

    var nodes = [bottom].concat(atoms, coatoms, [top]);

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">';
    svg += '<g stroke="var(--paper, #F3F1E7)" stroke-opacity="0.16" stroke-width="1.4" fill="none">';
    edges.forEach(function (e, i) {
      var len = Math.hypot(e[1].x - e[0].x, e[1].y - e[0].y);
      svg += '<line x1="' + e[0].x + '" y1="' + e[0].y + '" x2="' + e[1].x + '" y2="' + e[1].y + '" ' +
        'stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '">' +
        '<animate attributeName="stroke-dashoffset" from="' + len + '" to="0" dur="1.1s" ' +
        'begin="' + (i * 0.09) + 's" fill="freeze" />' +
        '</line>';
    });
    svg += '</g>';

    svg += '<g fill="var(--ink, #0E1726)" stroke="var(--brass, #C9A24B)" stroke-width="1.4">';
    nodes.forEach(function (n, i) {
      svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="0" >' +
        '<animate attributeName="r" from="0" to="6.5" dur="0.5s" ' +
        'begin="' + (0.9 + i * 0.06) + 's" fill="freeze" />' +
        '</circle>';
    });
    svg += '</g>';
    svg += '</svg>';
    return svg;
  }

  /* ---------- Utilities ---------- */
  function throttle(fn, wait) {
    var t = null, lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (t) return;
      t = setTimeout(function () {
        fn.apply(null, lastArgs);
        t = null;
      }, wait);
    };
  }

  function debounce(fn, wait) {
    var t = null;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }
})();

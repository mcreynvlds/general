/* DDN Construction — site scripts (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: solid background once scrolled ---------- */
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--solid")) {
    var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    var setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 960) setOpen(false); });
  }

  /* ---------- Reveal on scroll + animated counters ---------- */
  var animateCount = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target) || reduceMotion) { el.textContent = target; return; }
    var start = null, duration = 1600;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        if (entry.target.hasAttribute("data-count")) animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal, .count-group").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Gallery filters ---------- */
  var filters = document.querySelectorAll(".filter");
  var items = document.querySelectorAll(".gallery__item");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      items.forEach(function (item) {
        item.hidden = !(cat === "all" || item.getAttribute("data-cat") === cat);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (links.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Project photo viewer");
    var arrow = function (d) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
    };
    box.innerHTML =
      '<div class="lightbox__bar"><span class="lightbox__count"></span>' +
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close">' + arrow("M18 6 6 18M6 6l12 12") + "</button></div>" +
      '<div class="lightbox__stage">' +
      '<button class="lightbox__btn lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">' + arrow("m15 18-6-6 6-6") + "</button>" +
      '<img alt="">' +
      '<button class="lightbox__btn lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">' + arrow("m9 18 6-6-6-6") + "</button>" +
      "</div>" +
      '<div class="lightbox__caption"></div>';
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var count = box.querySelector(".lightbox__count");
    var caption = box.querySelector(".lightbox__caption");
    var closeBtn = box.querySelector(".lightbox__close");
    var visible = [], index = 0, lastFocus = null;

    var show = function (i) {
      index = (i + visible.length) % visible.length;
      var a = visible[index];
      var thumb = a.querySelector("img");
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = a.getAttribute("data-caption") || (thumb ? thumb.alt : "");
      count.textContent = (index + 1) + " / " + visible.length;
      // Preload neighbours
      [index + 1, index - 1].forEach(function (n) {
        var next = visible[(n + visible.length) % visible.length];
        if (next) { var pre = new Image(); pre.src = next.getAttribute("href"); }
      });
    };
    var open = function (a) {
      visible = links.filter(function (l) {
        var g = a.getAttribute("data-lightbox");
        return l.getAttribute("data-lightbox") === g && !l.closest("[hidden]");
      });
      lastFocus = document.activeElement;
      show(visible.indexOf(a));
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    var close = function () {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    links.forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(a); });
    });
    closeBtn.addEventListener("click", close);
    box.querySelector(".lightbox__nav--prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lightbox__nav--next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("lightbox__stage")) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "Tab") {
        var f = box.querySelectorAll("button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // Swipe support
    var sx = null;
    box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* ==========================================================================
   STACKWELL LIBRARY — SHARED SCRIPTS
   ICT726 Assignment 3 — vanilla JS, no frameworks, no server calls.
   Each feature checks for its elements before running, so this one file
   can be safely included on every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initContactForm();
  initCatalogFilter();
  initGalleryLightbox();
});

/* --------------------------- Mobile hamburger nav -------------------------- */
function initMobileNav() {
  var toggle = document.querySelector(".hamburger");
  var panel = document.querySelector(".mobile-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var isOpen = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the panel when a link is chosen, so navigating feels immediate
  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ------------------------------ Contact form -------------------------------
   Static-site rule: nothing is actually transmitted. We validate on the
   client, then simulate a successful submission via DOM manipulation. */
function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var fields = {
    name: { el: document.getElementById("cf-name"), validate: function (v) { return v.trim().length >= 2; }, message: "Please enter your full name (at least 2 characters)." },
    email: { el: document.getElementById("cf-email"), validate: function (v) { return emailPattern.test(v.trim()); }, message: "Please enter a valid email address, e.g. name@example.com." },
    subject: { el: document.getElementById("cf-subject"), validate: function (v) { return v !== ""; }, message: "Please choose a subject for your message." },
    message: { el: document.getElementById("cf-message"), validate: function (v) { return v.trim().length >= 10; }, message: "Please enter a message of at least 10 characters." }
  };

  function showFieldError(key) {
    var field = fields[key];
    var wrapper = field.el.closest(".field");
    wrapper.classList.add("has-error");
    var errorEl = document.getElementById(key + "-error");
    if (errorEl) errorEl.textContent = field.message;
    field.el.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(key) {
    var field = fields[key];
    var wrapper = field.el.closest(".field");
    wrapper.classList.remove("has-error");
    field.el.setAttribute("aria-invalid", "false");
  }

  // live-clear a field's error once the user starts fixing it
  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    if (!field.el) return;
    field.el.addEventListener("input", function () {
      if (field.validate(field.el.value)) clearFieldError(key);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var allValid = true;

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field.el) return;
      if (field.validate(field.el.value)) {
        clearFieldError(key);
      } else {
        showFieldError(key);
        allValid = false;
      }
    });

    status.classList.remove("is-success", "is-error");

    if (!allValid) {
      status.textContent = "There are a few things to fix before we can send your message — check the fields highlighted below.";
      status.classList.add("is-visible", "is-error");
      status.setAttribute("role", "alert");
      var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    // Simulated success — this is a static prototype, so nothing is sent anywhere.
    var name = fields.name.el.value.trim().split(" ")[0];
    status.textContent = "Thanks, " + name + " — your message has been received. A librarian usually replies within two business days.";
    status.classList.add("is-visible", "is-success");
    status.setAttribute("role", "status");
    form.reset();
  });
}

/* -------------------------------- Catalog filter ---------------------------- */
function initCatalogFilter() {
  var filterBar = document.querySelector(".filter-bar");
  var cards = document.querySelectorAll("[data-genre]");
  if (!filterBar || cards.length === 0) return;

  var buttons = filterBar.querySelectorAll("button");

  filterBar.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;

    buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    button.setAttribute("aria-pressed", "true");

    var genre = button.getAttribute("data-filter");
    cards.forEach(function (card) {
      var matches = genre === "all" || card.getAttribute("data-genre") === genre;
      card.style.display = matches ? "" : "none";
    });
  });
}

/* -------------------------------- Gallery lightbox --------------------------- */
function initGalleryLightbox() {
  var thumbs = document.querySelectorAll(".thumb-btn");
  var lightbox = document.getElementById("lightbox");
  if (thumbs.length === 0 || !lightbox) return;

  var mainDisplay = document.getElementById("main-display");
  var caption = document.getElementById("lightbox-caption-text");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var lastFocused = null;

  function openLightbox(thumb) {
    var fullSrc = thumb.getAttribute("data-full") || thumb.querySelector("img").src;
    var alt = thumb.querySelector("img").alt;
    var cap = thumb.getAttribute("data-caption") || alt;

    mainDisplay.src = fullSrc;
    mainDisplay.alt = alt;
    caption.textContent = cap;

    lastFocused = thumb;
    lightbox.classList.add("is-open");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    mainDisplay.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () { openLightbox(thumb); });
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

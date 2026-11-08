(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  const header = document.querySelector(".site-header");
  const brand = document.querySelector(".brand");

  brand?.addEventListener("click", (event) => {
    event.preventDefault();
    if (window.location.hash !== "#haut") window.history.replaceState(null, "", "#haut");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Ouvrir le menu");
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    menuButton.addEventListener("click", () => {
      const opening = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(opening));
      menuButton.setAttribute("aria-label", opening ? "Fermer le menu" : "Ouvrir le menu");
      navigation.classList.toggle("is-open", opening);
      document.body.classList.toggle("menu-open", opening);
    });

    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
    const counter = gallery.querySelector(".gallery-counter");
    const caption = gallery.querySelector(".gallery-caption");
    const previous = gallery.querySelector(".gallery-prev");
    const next = gallery.querySelector(".gallery-next");
    let activeIndex = 0;

    const show = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      const currentSlide = slides[activeIndex];
      const slideCaption = currentSlide.dataset.caption || "";
      if (counter) counter.innerHTML = String(activeIndex + 1).padStart(2, "0") + " <i>/</i> " + String(slides.length).padStart(2, "0");
      if (caption) caption.textContent = slideCaption;
    };

    previous?.addEventListener("click", () => show(activeIndex - 1));
    next?.addEventListener("click", () => show(activeIndex + 1));
    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(activeIndex - 1);
      if (event.key === "ArrowRight") show(activeIndex + 1);
    });

    let touchStart = null;
    gallery.addEventListener("touchstart", (event) => {
      touchStart = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });
    gallery.addEventListener("touchend", (event) => {
      if (touchStart === null) return;
      const touchEnd = event.changedTouches[0]?.clientX ?? touchStart;
      const distance = touchEnd - touchStart;
      if (Math.abs(distance) > 45) show(activeIndex + (distance < 0 ? 1 : -1));
      touchStart = null;
    }, { passive: true });
    show(0);
  });

  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const name = String(values.get("name") || "").trim();
      const senderEmail = String(values.get("email") || "").trim();
      const message = String(values.get("message") || "").trim();
      const subject = "Prise de contact — " + name;
      const body = "Bonjour Angélina,\n\n" + message + "\n\n" + name + "\n" + senderEmail;
      const mailto = "mailto:angelina.favier.interiordesign@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (formStatus) formStatus.textContent = "Votre application e-mail va s’ouvrir avec le message prérempli.";
      window.location.href = mailto;
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();

// ============================================================
// SoccR – Interaktion
// 1) Burger-Menü für die Sticky-Navigation auf dem Smartphone
// 2) Aktives Handy-Icon in der Navigation je nach sichtbarem Artikel
// 3) 3D-Handys: rotieren frei, "fangen" sich sobald ihr Artikel
//    im Viewport aktiv ist
// 4) Aufklappbare TrackR-Stat-Kategorien (Akkordeon)
// 5) Gratis/Pro-Umschalter mit Hervorhebung in Karten & Tabelle
// 6) Hochzählende SP-Punkte-Zahlen im Profil-Artikel
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".quicknav");
  const burger = document.getElementById("navburger");
  const navLinks = document.querySelectorAll(".quicknav__link");
  const main = document.getElementById("main");
  const articles = document.querySelectorAll("main .feature");

  // ---- 1) Burger-Menü (mobil) ----
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- 2) Aktives Nav-Icon je nach sichtbarem Artikel ----
  if ("IntersectionObserver" in window && articles.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.target === id);
      });
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { root: window.innerWidth > 720 ? main : null, threshold: 0.55 }
    );

    articles.forEach((article) => navObserver.observe(article));
  }

  // ---- 4) TrackR-Stat-Akkordeon ----
  const accordion = document.getElementById("stat-accordion");
  if (accordion) {
    const triggers = accordion.querySelectorAll(".stat-item__trigger");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        trigger.setAttribute("aria-expanded", String(!isOpen));
        if (panel) {
          panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
        }
      });
    });
  }

  // ---- 5) Gratis/Pro-Umschalter ----
  const toggle = document.querySelector(".pro__toggle");
  const proSplit = document.getElementById("pro-split");
  const proTableWrap = document.getElementById("pro-table-wrap");

  if (toggle && proSplit && proTableWrap) {
    proSplit.dataset.active = "free";
    proTableWrap.dataset.active = "free";

    const toggleBtns = toggle.querySelectorAll(".pro__toggle-btn");
    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const plan = btn.dataset.plan;

        toggleBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        toggle.dataset.active = plan;
        proSplit.dataset.active = plan;
        proTableWrap.dataset.active = plan;
      });
    });
  }

  // ---- 6) Hochzählende Stat-Zahlen (Profil-Artikel) ----
  const counters = document.querySelectorAll(".stat-num[data-count-to]");
  if ("IntersectionObserver" in window && counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.countTo, 10) || 0;
      const duration = 900;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { root: window.innerWidth > 720 ? main : null, threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }
});

const businessInfo = {
  name: "Morocco Culture Tours",
  tagline: "Experiences marocaines authentiques",
  description:
    "Voyages authentiques entre deserts, montagnes et villes anciennes, crees par des experts locaux.",
  address: "Marrakech, Maroc",
  phone: "+212(0) 6 64 35 03 04",
  email: "info@moroccoculturetours.com",
};

const mainNavItems = [
  { href: "index.html", label: "Accueil", page: "index.html" },
  { href: "about.html", label: "A propos", page: "about.html" },
  { href: "services.html", label: "Services", page: "services.html" },
  { href: "contact.html", label: "Contact", page: "contact.html", className: "mct-contact-btn" },
];

const legalNavItems = [
  { href: "privacy-policy.html", label: "Privacy Policy" },
  { href: "terms.html", label: "Terms &amp; Conditions" },
  { href: "cancellation-policy.html", label: "Cancellation Policy" },
];

const getCurrentPage = () => {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
};

const renderSiteHeader = () => {
  const target = document.getElementById("site-header");
  if (!target) return;

  const currentPage = getCurrentPage();
  const isPremiumLayout =
    document.body.classList.contains("premium-home") || document.body.classList.contains("premium-page");
  target.innerHTML = `
    <header class="mct-header${isPremiumLayout ? " premium-header" : ""}">
      <a class="mct-brand" href="index.html" aria-label="Accueil ${businessInfo.name}">
        <img src="assets/img/logo.png" alt="Logo ${businessInfo.name}" width="64" height="64" />
        <span class="mct-site-name">
          <span class="main-name">${businessInfo.name}</span>
          <span class="sub-name">${businessInfo.tagline}</span>
        </span>
      </a>
      <button class="mct-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mainNav">
        <span></span><span></span><span></span>
      </button>
      <nav aria-label="Navigation principale">
        <ul class="mct-nav" id="mainNav">
          ${mainNavItems
            .map((item) => {
              const isActive = item.page === currentPage;
              const linkClass = item.className ? ` class="${item.className}"` : "";
              return `<li${isActive ? ' class="active"' : ""}><a href="${item.href}"${linkClass}>${item.label}</a></li>`;
            })
            .join("")}
        </ul>
      </nav>
    </header>
  `;
};

const renderSiteFooter = () => {
  const target = document.getElementById("site-footer");
  if (!target) return;

  const isPremiumLayout =
    document.body.classList.contains("premium-home") || document.body.classList.contains("premium-page");
  target.innerHTML = `
    <footer class="mct-footer${isPremiumLayout ? " premium-footer" : ""}">
      <div class="mct-footer-container">
        <div class="mct-footer-grid">
          <div class="mct-footer-brand">
            <div class="mct-footer-logo">
              <img src="assets/img/logo.png" alt="Logo ${businessInfo.name}" />
              <span class="site-name">${businessInfo.name}</span>
            </div>
            <div class="mct-footer-tagline">${businessInfo.description}</div>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul class="mct-footer-links">
              ${mainNavItems.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul class="mct-footer-links">
              <li><a href="services.html">Aventures dans le Sahara</a></li>
              <li><a href="services.html">Escapades dans l'Atlas</a></li>
              <li><a href="services.html">Circuits des villes imperiales</a></li>
              <li><a href="services.html">Sejours sur la cote</a></li>
            </ul>
          </div>
          <div class="mct-footer-contact">
            <h4>Contact</h4>
            <p>${businessInfo.address}</p>
            <p>${businessInfo.phone}</p>
            <p>${businessInfo.email}</p>
          </div>
          <nav aria-label="Informations legales">
            <h3>Informations</h3>
            ${legalNavItems.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
            <a href="contact.html">Contact</a>
          </nav>
        </div>
        <div class="mct-footer-bottom">
          <div>&copy; 2026 ${businessInfo.name}. Tous droits reserves.</div>
          <div class="mct-footer-bottom-links">
            ${legalNavItems.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
          </div>
        </div>
      </div>
    </footer>
  `;
};

renderSiteHeader();
renderSiteFooter();

const toggle = document.querySelector(".mct-toggle");
const nav = document.querySelector(".mct-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Ouvrir le menu" : "Fermer le menu");
    nav.classList.toggle("show-mobile", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      nav.classList.remove("show-mobile");
    });
  });
}

const programModal = document.getElementById("programDetailsModal");
const programModalDialog = programModal?.querySelector(".program-modal__dialog");
const programModalContent = programModal?.querySelector(".program-modal__content");
let activeDetailsButton = null;

const closeProgramModal = () => {
  if (!programModal || !programModalContent) return;

  programModal.classList.remove("is-open");
  programModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  programModalContent.innerHTML = "";

  if (activeDetailsButton) {
    activeDetailsButton.setAttribute("aria-expanded", "false");
    activeDetailsButton.focus();
    activeDetailsButton = null;
  }
};

const openProgramModal = (button, target) => {
  if (!programModal || !programModalDialog || !programModalContent) return;

  const detailsClone = target.cloneNode(true);
  detailsClone.removeAttribute("id");
  const title = detailsClone.querySelector("h3, h2");
  if (title) title.id = "programModalTitle";

  programModalContent.innerHTML = "";
  programModalContent.appendChild(detailsClone);
  activeDetailsButton = button;

  document.querySelectorAll("[data-details-target]").forEach((detailsButton) => {
    detailsButton.setAttribute("aria-expanded", String(detailsButton === button));
  });

  programModal.classList.add("is-open");
  programModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  programModalDialog.focus({ preventScroll: true });
};

document.querySelectorAll("[data-details-target]").forEach((button) => {
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "programDetailsModal");
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.detailsTarget);
    if (!target) return;
    openProgramModal(button, target);
  });
});

programModal?.querySelectorAll("[data-modal-close]").forEach((control) => {
  control.addEventListener("click", closeProgramModal);
});

document.addEventListener("keydown", (event) => {
  if (!programModal?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeProgramModal();
    return;
  }

  if (event.key === "Tab" && programModalDialog) {
    const focusable = programModalDialog.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const siteHeader = document.querySelector(".mct-header");
if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

document.querySelectorAll(".custom-cf7").forEach((form) => {
  const submit = form.querySelector('input[type="submit"]');
  const status = form.querySelector(".form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearError = (field) => {
    field.setAttribute("aria-invalid", "false");
    const error = field.closest("p")?.querySelector(".field-error");
    if (error) error.remove();
  };

  const showError = (field, message) => {
    field.setAttribute("aria-invalid", "true");
    const wrapper = field.closest("p");
    if (!wrapper) return;
    let error = wrapper.querySelector(".field-error");
    if (!error) {
      error = document.createElement("span");
      error.className = "field-error";
      wrapper.appendChild(error);
    }
    error.textContent = message;
  };

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => clearError(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = {
      name: form.querySelector('[name="your-name"]'),
      email: form.querySelector('[name="your-email"]'),
      date: form.querySelector('[name="arrival"]'),
      passengers: form.querySelector('[name="passenger"]'),
    };

    Object.values(fields).forEach(clearError);
    if (status) status.textContent = "";

    const firstInvalid = [];
    if (!fields.name.value.trim()) {
      showError(fields.name, "Please enter your name.");
      firstInvalid.push(fields.name);
    }
    if (!emailPattern.test(fields.email.value.trim())) {
      showError(fields.email, "Please enter a valid email address.");
      firstInvalid.push(fields.email);
    }
    if (!fields.date.value) {
      showError(fields.date, "Please choose a travel date.");
      firstInvalid.push(fields.date);
    }
    if (!fields.passengers.value || Number(fields.passengers.value) < 1) {
      showError(fields.passengers, "Please enter at least one passenger.");
      firstInvalid.push(fields.passengers);
    }

    if (firstInvalid.length) {
      firstInvalid[0].focus();
      return;
    }

    form.classList.add("is-loading");
    if (submit) {
      submit.dataset.defaultValue = submit.value;
      submit.value = "Sending...";
      submit.disabled = true;
    }

    window.setTimeout(() => {
      form.reset();
      form.classList.remove("is-loading");
      form.querySelectorAll("[aria-invalid]").forEach((field) => field.setAttribute("aria-invalid", "false"));
      if (submit) {
        submit.disabled = false;
        submit.value = submit.dataset.defaultValue || "Book Now";
      }
      if (status) status.textContent = "Thank you. Your request has been sent successfully.";
    }, 700);
  });
});

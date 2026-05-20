const toggle = document.querySelector(".mct-toggle");
const nav = document.querySelector(".mct-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    nav.classList.toggle("show-mobile", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
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

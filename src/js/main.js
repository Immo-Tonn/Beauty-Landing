import "../scss/main.scss";

// =========================
// Кнопка "Оставить заявку"
// =========================
const ctaButton = document.querySelector("#cta-button");
const contactSection = document.querySelector("#contact");

// Плавный скролл к форме
if (ctaButton && contactSection) {
  ctaButton.addEventListener("click", () => {
    contactSection.scrollIntoView({
      behavior: "smooth",
    });
  });
}

// =========================
// Форма обратной связи
// =========================
const contactForm = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");

if (contactForm) {
  const lang = document.documentElement.lang || "de";

  // ===== 1️⃣ Обработка обязательных полей через invalid =====
  const requiredInputs = contactForm.querySelectorAll("input[required]");
  requiredInputs.forEach((input) => {
    input.addEventListener("invalid", (e) => {
      e.preventDefault();
      statusMessage.textContent =
        lang === "de"
          ? "Bitte geben Sie Name, E-Mail und Telefon ein."
          : lang === "ru"
            ? "Введите имя, email и телефон."
            : "Please enter name, email, and phone.";
    });

    input.addEventListener("input", () => {
      statusMessage.textContent = "";
    });
  });

  // ===== 2️⃣ Отправка формы =====
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const message = document.querySelector("#message").value.trim();
    const company = document.querySelector("#company").value.trim();

    if (company) {
      statusMessage.textContent =
        lang === "de"
          ? "Fehler: Spam erkannt."
          : lang === "ru"
            ? "Ошибка: Спам обнаружен."
            : "Error: Spam detected.";
      return;
    }

    statusMessage.textContent =
      lang === "de" ? "Sende..." : lang === "ru" ? "Отправка..." : "Sending...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, company, lang }),
      });

      let data = { error: "Server error" };
      try {
        data = await response.json();
      } catch {}

      if (!response.ok) {
        statusMessage.textContent = data.error || "Server error";
      } else {
        statusMessage.textContent =
          lang === "de"
            ? "Danke! Anfrage gesendet."
            : lang === "ru"
              ? "Спасибо! Заявка отправлена."
              : "Thank you! Request sent.";
        contactForm.reset();
      }
    } catch (err) {
      statusMessage.textContent =
        lang === "de"
          ? "Serverfehler."
          : lang === "ru"
            ? "Сервер недоступен."
            : "Server unavailable.";
      console.error(err);
    }
  });
}

// =========================
// Мобильное выпадающее меню
// =========================
const navToggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".menu");

if (navToggle && menu) {
  // 🔁 Открыть / закрыть по бургеру
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // чтобы не сработал document click
    menu.classList.toggle("active");
  });

  // 🔗 Закрытие при клике на пункт
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        menu.classList.remove("active");
      }, 500); // задержка в миллисекундах (300ms = 0.3 секунды)
    });
  });

  // ❌ Закрытие при клике вне меню
  document.addEventListener("click", (e) => {
    const isClickInsideMenu = menu.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      menu.classList.remove("active");
    }
  });

  // ❌ Закрытие пл ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.classList.remove("active");
    }
  });
}

// =========================
// Карусель отзывов
// =========================
const reviewsTrack = document.querySelector(".reviews-track");
const reviewCards = document.querySelectorAll(".review-item");

let carouselPaused = false;

reviewCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!carouselPaused) {
      reviewsTrack.style.animationPlayState = "paused";
      card.classList.add("active");
      carouselPaused = true;
    } else {
      reviewsTrack.style.animationPlayState = "running";
      reviewCards.forEach((c) => c.classList.remove("active"));
      carouselPaused = false;
    }
  });
});

// =========================
// Модальные окна
// =========================
let scrollPosition = 0;

const datenschutzModal = document.getElementById("datenschutz-modal");
const impressumModal = document.getElementById("impressum-modal");

const datenschutzLink = document.getElementById("datenschutz-link");
const impressumLink = document.getElementById("impressum-link");

const closeButtons = document.querySelectorAll(".modal .close");

// Функции открытия/закрытия с сохранением позиции
const openModal = (modal) => {
  scrollPosition = window.scrollY;
  modal.style.display = "block";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
};

const closeModal = (modal) => {
  modal.style.display = "none";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
};

// Открытие модалок
datenschutzLink.onclick = (e) => {
  e.preventDefault();
  openModal(datenschutzModal);
};

impressumLink.onclick = (e) => {
  e.preventDefault();
  openModal(impressumModal);
};

// Закрытие по крестику
closeButtons.forEach((btn) => {
  btn.onclick = () => closeModal(btn.parentElement.parentElement);
});

// Закрытие по клику вне окна
window.onclick = (event) => {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
};

// =========================
// Смена языка с сохранением позиции (через якоря)
// =========================
const languageLinks = document.querySelectorAll(".language-switcher a");
const sections = document.querySelectorAll("section[id]");

languageLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    let currentSection = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= 120 && rect.bottom >= 120) {
        currentSection = section.id;
      }
    });

    const baseUrl = link.getAttribute("href").split("#")[0];

    if (currentSection) {
      window.location.href = `${baseUrl}#${currentSection}`;
    } else {
      window.location.href = baseUrl;
    }
  });
});

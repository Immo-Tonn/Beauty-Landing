import "../scss/main.scss";

// Кнопка "Оставить заявку"
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

// Форма
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

  // ===== Мобильное выпадающее меню =====
  const navToggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".menu");

  if (navToggle && menu) {
    navToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    });
  }
}

/* =====================================================
   КАРУСЕЛЬ ОТЗЫВОВ
===================================================== */

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

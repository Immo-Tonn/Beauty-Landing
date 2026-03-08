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
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.querySelector("#name").value.trim(),
      email: document.querySelector("#email").value.trim(),
      phone: document.querySelector("#phone").value.trim(),
      message: document.querySelector("#message").value.trim(),
      company: document.querySelector("#company").value.trim(), // honeypot
    };

    // Проверяем honeypot на фронтенде (дополнительно)
    if (formData.company) {
      statusMessage.textContent = "Ошибка: Спам обнаружен.";
      return;
    }

    statusMessage.textContent = "Отправка...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        statusMessage.textContent = "Спасибо! Заявка отправлена.";
        contactForm.reset();
      } else {
        const data = await response.json();
        statusMessage.textContent =
          data.error || "Ошибка при отправке. Попробуйте позже.";
      }
    } catch (error) {
      statusMessage.textContent = "Сервер недоступен.";
      console.error(error);
    }
  });
}

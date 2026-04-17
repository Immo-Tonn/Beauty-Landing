import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Безопасный парсинг body (важно для Vercel)
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const { name, email, phone, message, company, lang } = body;

  // Honeypot (анти-бот)
  if (company) {
    return res.status(400).json({ error: "Spam detected" });
  }

  // Сообщения по языкам
  const messages = {
    de: "Bitte geben Sie Name, E-Mail und Telefon ein",
    ru: "Введите имя, email и телефон",
    en: "Please enter name, email, and phone",
  };

  const language = messages[lang] ? lang : "de";

  // Валидация
  if (!name || !email || !phone) {
    return res.status(400).json({ error: messages[language] });
  }

  try {
    // Создание транспорта
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Отправка письма с таймаутом
    await Promise.race([
      transporter.sendMail({
        from: `"BeautyTime Kontaktformular" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Neue BeautyTime Anfrage von ${name}`,
        text: `Name: ${name}
E-Mail: ${email}
Telefon: ${phone}
Nachricht: ${message || "-"}`,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000),
      ),
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    return res.status(500).json({ error: "Mail error" });
  }
}

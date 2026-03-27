import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

// ⚠️ простой rate limit (будет работать ограниченно в serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

// обёртка, чтобы использовать limiter без express app
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // rate limit (как у тебя было)
  await runMiddleware(req, res, limiter);

  const { name, email, phone, message, company, lang } = req.body;

  // Honeypot
  if (company) {
    return res.status(400).json({ error: "Spam detected" });
  }

  const messages = {
    de: "Bitte geben Sie Name, E-Mail und Telefon ein",
    ru: "Введите имя, email и телефон",
    en: "Please enter name, email, and phone",
  };

  const language = messages[lang] ? lang : "de";

  if (!name || !email || !phone) {
    return res.status(400).json({ error: messages[language] });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BeautyTime Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Neue BeautyTime Anfrage von ${name}`,
      text: `Name: ${name}
E-Mail: ${email}
Telefon: ${phone}
Nachricht: ${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    return res.status(500).json({ error: "Mail error" });
  }
}

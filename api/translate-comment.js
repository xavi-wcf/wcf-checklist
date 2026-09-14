// /api/translate-comment.js
// Traduce el texto de un comentario al idioma actual de la app, usando DeepL.
// La clave de API vive solo en el servidor (variable de entorno DEEPL_API_KEY),
// nunca se expone al navegador.

const LANG_MAP = {
  es: "ES",
  en: "EN-US",
  th: "TH",
  fr: "FR",
  vi: "VI",
  ja: "JA",
  zh: "ZH",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, targetLang } = req.body || {};
  if (!text || typeof text !== "string" || !targetLang) {
    return res.status(400).json({ error: "Missing text or targetLang" });
  }

  const deeplLang = LANG_MAP[targetLang] || "EN-US";

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      // Límite de seguridad: nunca mandamos más de 1000 caracteres a la API,
      // aunque el comentario ya está limitado a 500 en el propio formulario.
      body: JSON.stringify({ text: [text.slice(0, 1000)], target_lang: deeplLang }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({ error: "DeepL request failed", detail });
    }

    const data = await response.json();
    const translated = data?.translations?.[0]?.text ?? text;
    return res.status(200).json({ translated });
  } catch (e) {
    return res.status(500).json({ error: "Translation failed" });
  }
}

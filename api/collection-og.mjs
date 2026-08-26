// ============================================================
//  /api/collection-og.mjs
//  Genera una versión del index.html con meta tags Open Graph
//  dinámicos (título, descripción, imagen) según el usuario cuya
//  colección se está compartiendo. Así WhatsApp/Twitter/Facebook
//  muestran una vista previa descriptiva en vez de un genérico
//  "WCF Checklist" sin contexto.
//
//  Se sirve a través de la ruta /c/<código corto> (ver vercel.json).
// ============================================================

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://odtcnomhpvxhgzbpaevh.supabase.co",
  "sb_publishable_AQN2HtfIBlrI8cmQYDZOuw_vaUyOL8u"
);

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function handler(req, res) {
  const code = req.query.userId; // el segmento de la URL /c/<code>; ahora es el código corto, no el user_id

  let title = "WCF Checklist";
  let description = "Gestiona tu colección de figuras WCF y descubre las de otros coleccionistas de todo el mundo.";
  let image = "https://www.wcfchecklist.com/icons/icon-512x512.png";

  if (code) {
    try {
      // Primero resolvemos el código corto al user_id real
      const { data: settingsRow } = await supabase
        .from("wcf_collection_settings")
        .select("user_id")
        .eq("share_code", code)
        .maybeSingle();

      if (settingsRow?.user_id) {
        const { data } = await supabase
          .from("wcf_collection_photos")
          .select("uploader_name,url")
          .eq("user_id", settingsRow.user_id)
          .eq("approved", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const name = data[0].uploader_name || "un coleccionista";
          title = `¡Mira la colección de ${name} en WCF Checklist!`;
          description = `Descubre las figuras WCF de ${name} y explora las colecciones de coleccionistas de todo el mundo.`;
          image = data[0].url;
        }
      }
    } catch (err) {
      console.error("Error obteniendo datos para OG tags:", err);
    }
  }

  try {
    // Traemos el index.html real ya compilado, para no tener que
    // hardcodear los nombres de los archivos JS/CSS (cambian en cada deploy)
    const origin = `https://${req.headers.host}`;
    const baseHtml = await fetch(`${origin}/index.html`).then(r => r.text());

    const html = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(
        /<\/head>/,
        `<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
</head>`
      );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err) {
    console.error("Error generando página con OG tags:", err);
    res.redirect(302, `https://www.wcfchecklist.com/c/${code ?? ""}`);
  }
}

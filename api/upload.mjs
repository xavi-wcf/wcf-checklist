// ============================================================
//  /api/upload.mjs
//  Función serverless (Vercel) que sube la imagen a Cloudflare R2
//  DESDE EL SERVIDOR, en vez de darle al navegador una URL firmada
//  para que suba él mismo directamente a R2.
//
//  Por qué el cambio: la URL firmada apuntaba a
//  https://<account_id>.r2.cloudflarestorage.com, un dominio
//  genérico compartido por miles de proyectos R2 — igual que pasaba
//  con *.vercel.app, este tipo de dominio compartido puede estar
//  bloqueado o ser muy inestable desde China. Al subir desde aquí,
//  el navegador del usuario solo habla con tu propio dominio
//  (wcfchecklist.com), que ya confirmamos que funciona bien allí.
//
//  El cliente ahora manda la imagen en base64 dentro del JSON,
//  en vez de pedir una URL firmada y subir en un segundo paso.
//
//  Variables de entorno necesarias en Vercel (sin cambios):
//    R2_ACCOUNT_ID
//    R2_ACCESS_KEY_ID
//    R2_SECRET_ACCESS_KEY
//    R2_BUCKET
//    R2_PUBLIC_BASE_URL
// ============================================================

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// Por defecto, Vercel corta las funciones serverless a los pocos segundos.
// Con usuarios en países con conexión más lenta/inestable hacia servidores
// internacionales (ej. China), una subida de imagen puede tardar más de eso
// y cortarse a medias. Ampliamos el margen a 60s (máximo permitido en el
// plan Hobby) para darle tiempo de sobra a esas conexiones más lentas.
export const config = {
  maxDuration: 60,
};

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Vercel limita a 4.5MB el tamaño total de una petición a una función
// serverless. Como el base64 infla el tamaño real ~33%, ponemos el
// límite de la imagen ya decodificada bastante por debajo de eso.
const MAX_BYTES = 3 * 1024 * 1024; // 3MB de imagen real como tope

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { contentType, imageBase64 } = req.body ?? {};

    if (!imageBase64 || typeof imageBase64 !== "string") {
      res.status(400).json({ error: "Falta imageBase64 en el body" });
      return;
    }

    // Admite tanto "data:image/jpeg;base64,AAAA..." como el base64 puro
    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length > MAX_BYTES) {
      res.status(413).json({ error: "Imagen demasiado grande" });
      return;
    }

    const ext = (contentType || "").includes("png") ? "png"
      : (contentType || "").includes("webp") ? "webp"
      : (contentType || "").includes("gif") ? "gif"
      : "jpg";

    const key = `figures/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType || "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }));

    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;

    res.status(200).json({ publicUrl });
  } catch (err) {
    console.error("Error subiendo imagen a R2:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
}

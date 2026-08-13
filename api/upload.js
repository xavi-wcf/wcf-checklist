// ============================================================
//  /api/upload.js
//  Función serverless (Vercel) que genera una URL firmada
//  para subir una imagen directamente a Cloudflare R2.
//
//  El navegador NUNCA ve el Secret Access Key — solo pide esta
//  URL temporal (válida 60s) y sube el archivo directo a R2.
//
//  Requiere estas variables de entorno en el dashboard de Vercel
//  (Settings → Environment Variables), SIN el prefijo VITE_
//  para que no se expongan al frontend:
//
//    R2_ACCOUNT_ID
//    R2_ACCESS_KEY_ID
//    R2_SECRET_ACCESS_KEY
//    R2_BUCKET
//    R2_PUBLIC_BASE_URL     (ej: https://pub-xxxxxxxx.r2.dev)
//
//  Requiere instalar en el proyecto (no solo en scripts sueltos):
//    npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
// ============================================================

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { contentType } = req.body ?? {};

    const ext = (contentType || "").includes("png") ? "png"
      : (contentType || "").includes("webp") ? "webp"
      : (contentType || "").includes("gif") ? "gif"
      : "jpg";

    // Nombre único por subida -> evita cualquier problema de caché
    // si el usuario reemplaza la imagen de una figura más tarde.
    const key = `figures/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType || "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    });

    // URL válida solo 60 segundos, solo para ESTA subida concreta
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;

    res.status(200).json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("Error generando URL firmada:", err);
    res.status(500).json({ error: "No se pudo generar la URL de subida" });
  }
};

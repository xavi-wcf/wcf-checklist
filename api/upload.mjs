// ============================================================
//  /api/upload.mjs
//  Función serverless (Vercel) que genera una URL firmada
//  para subir una imagen directamente a Cloudflare R2.
//
//  Usamos extensión .mjs para forzar formato ESM sin importar
//  la configuración "type" de package.json (evita crashes por
//  mezclar require()/module.exports con proyectos ESM).
//
//  Variables de entorno necesarias en Vercel:
//    R2_ACCOUNT_ID
//    R2_ACCESS_KEY_ID
//    R2_SECRET_ACCESS_KEY
//    R2_BUCKET
//    R2_PUBLIC_BASE_URL
// ============================================================

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
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

    const key = `figures/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType || "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;

    res.status(200).json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("Error generando URL firmada:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
}

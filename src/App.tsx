import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ============================================================
//  CHANGELOG — añade aquí las novedades antes de hacer push
// ============================================================
const CHANGELOG = [
  {
    id: 14,
    date: "2026-09-23",
    entries: [
      "🔔 New: figure announcements — new figures marked by the team now pop up in a quick story-style view when you open the app",
      "⭐ Filter announcements by your favourite series only, or switch to see all of them — your choice is remembered",
      "👆 Missed one? Tap the bell icon in the header anytime to see recent announcements again, and open the full figure details straight from there",
      "🎉 15 WCF added to Lupin the 3rd",
      "🎉 228 WCF added to Kamen Rider",
    ]
  },
  {
    id: 13,
    date: "2026-09-14",
    entries: [
      "💬 New: comment on collection photos, just like you can already like them",
      "🌐 Translate any comment into your own language with one tap",
      "🔴 New activity indicator on your profile picture when someone likes or comments on your photos",
      "🐛 Fixed: some collection photos got stuck \"under review\" longer than they should have due to a permissions bug — sorted now, thanks for your patience!",
      "🎉 89 WCF added to JoJo's Bizarre Adventure",
      "🎉 32 WCF added to Mobile Suit Gundam",
      "🎉 22 WCF added to Gintama",
      "🎉 11 WCF added to Full Metal Alchemist (Resin):",
      "　　A+ studio → 11",
    ]
  },
  {
    id: 12,
    date: "2026-08-27",
    entries: [
      "🖼️ New: My Collection — upload photos of your full display case (not just single figures) and share them with the community",
      "🔗 Share your collection outside the app with a simple link, no account needed to view it",
      "❤️ Like other collectors' collections",
      "⚙️ New Settings menu — change your display name and upload a profile photo",
      "✉️ New login option: sign in with just your email, no Google account needed",
      "🔀 Figures with interchangeable parts (e.g. multiple heads) can now show all versions — look for the A/B/C selector",
      "📦 \"My WCF\" tab redesigned: figures are now grouped by franchise and split into Owned/Wishlist tabs for much easier browsing",
      "🎉 39 WCF added to Kingdom",
      "🎉 48 WCF added to Tiger & Bunny",
    ]
  },
  {
    id: 11,
    date: "2025-08-14",
    entries: [
      "🌍 New Community tab: Top Photo Uploaders & Top Collections rankings",
      "🎖️ New rank badges by franchise (Dragon Ball, One Piece, Naruto, MHA, Hunter x Hunter, Kimetsu no Yaiba, Bleach)",
      "🏅 'My Badges' added to My Stats, based on your favourite series",
      "📸 Community photos now show who uploaded them, with swipe navigation",
      "⚡ Faster, more reliable image loading thanks to a hosting upgrade",
    ]
  },
  {
    id: 10,
    date: "2025-08-12",
    entries: [
      "🎉 1376 WCF added to One Piece (Resin):",
      "　　Yz studio → 737",
      "　　A+ studio → 512",
      "　　MDS studio → 127",
    ]
  },
  {
    id: 9,
    date: "2025-07-09",
    entries: [
      "🎉 320 WCF added to Bleach (Resin):",
      "　　Yz studio → 223",
      "　　C studio → 97",
      "🎉 284 WCF added to Naruto (Resin):",
      "　　Power studio → 170",
      "　　League studio → 114",
      "🎉 19 WCF added to Kimetsu no Yaiba (Resin):",
      "　　V8 studio → 19",
    ]
  },
  {
    id: 8,
    date: "2025-07-01",
    entries: [
      "📸 New feature: upload your own photos for any figure! Tap the magnifier and share your collection with the community",
      "🎉 165 WCF added to Naruto (Resin):",
      "　　Power studio → 165",
      "🎉 69 WCF added to Hunter x Hunter (Resin):",
      "　　Power studio → 69",
      "🎉 23 WCF added to Yu Yu Hakusho (Resin):",
      "　　Power studio → 23",
    ]
  },
  {
    id: 7,
    date: "2025-06-27",
    entries: [
      "🔍 Figure detail modal — tap the magnifier to see full image, info and community stats",
      "🏆 Community ranking in My Stats: top 5 most collected and most wished figures",
      "🎨 New color scheme — blue #0196e3 throughout the app, yellow #fbd100 as accent",
      "🌐 Added 2 new languages: Japanese 🇯🇵 and Chinese 🇨🇳",
      "🇫🇷 Improved French translations",
    ]
  },
  {
    id: 6,
    date: "2025-06-19",
    entries: [
      "🎉 809 WCF added to Dragon Ball (Resin):",
      "　　League studio → 397",
      "　　Power studio → 97",
      "　　C studio → 202",
      "　　AGO studio → 51",
      "　　WooHoo studio → 16",
      "　　Temps studio → 42",
    ]
  },
  {
    id: 5,
    date: "2025-06-12",
    entries: [
      "🎉 1485 WCF added to One Piece (Official)",
      "🎉 118 WCF added to Kimetsu no Yaiba (Official)",
    ]
  },
  {
    id: 4,
    date: "2025-06-10",
    entries: [
      "🎉 111 WCF added to Shonen Jump (Official)",
      "🎉 60 WCF added to Tokyo Revengers (Official)",
      "🎉 24 WCF added to Kaiju nº8 (Official)",
    ]
  },
  {
    id: 3,
    date: "2025-06-09",
    entries: [
      "🎉 58 WCF added to My Hero Academia (Official)",
      "🎉 45 WCF added to Naruto (Official)",
      "🎉 15 WCF added to Hunter x Hunter (Official)",
      "🎉 10 WCF added to Chainsaw Man (Official)",
      "🎉 22 WCF added to Others (Official)",
    ]
  },
  {
    id: 2,
    date: "2025-06-05",
    entries: [
      "🎉 644 WCF added to Dragon Ball (Official)",
      "🎉 104 WCF added to Shonen Jump (Official)",
    ]
  },
  {
    id: 1,
    date: "2025-06-01",
    entries: [
      "🎉 App launched — welcome to WCF Checklist",
    ]
  },
];
// ── Fin del changelog ────────────────────────────────────────

// ============================================================
//  DARK MODE CSS VARIABLES
// ============================================================
const LIGHT_THEME = `
  --bg: #ffffff;
  --bg2: #fafaf8;
  --bg3: #f5f5f3;
  --border: #e8e8e4;
  --border2: #d4d4d0;
  --text: #1a1a1a;
  --text2: #555555;
  --text3: #888888;
  --text4: #aaaaaa;
  --card-bg: #ffffff;
  --input-bg: #fafaf8;
  --missing-bg: #f5f5f3;
`;

const DARK_THEME = `
  --bg: #1a1a1a;
  --bg2: #242424;
  --bg3: #2e2e2e;
  --border: #3a3a3a;
  --border2: #4a4a4a;
  --text: #f0f0f0;
  --text2: #cccccc;
  --text3: #999999;
  --text4: #666666;
  --card-bg: #242424;
  --input-bg: #2e2e2e;
  --missing-bg: #2e2e2e;
`;

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem("wcf_dark") === "true");
  useEffect(() => {
    document.documentElement.style.cssText = dark ? DARK_THEME : LIGHT_THEME;
    localStorage.setItem("wcf_dark", String(dark));
  }, [dark]);
  // Apply immediately on mount
  useEffect(() => {
    document.documentElement.style.cssText = localStorage.getItem("wcf_dark") === "true" ? DARK_THEME : LIGHT_THEME;
  }, []);
  return { dark, toggleDark: () => setDark(d => !d) };
}

const SUPABASE_URL = "https://odtcnomhpvxhgzbpaevh.supabase.co";

// Global style for search placeholder
const style = document.createElement("style");
style.textContent = `.search-input::placeholder { color: rgba(255,255,255,0.75); }`;
document.head.appendChild(style);
const SUPABASE_KEY = "sb_publishable_AQN2HtfIBlrI8cmQYDZOuw_vaUyOL8u";

// Dominio fijo para enlaces que se comparten fuera de la app (no depende
// de si el visitante está en wcfchecklist.com o en el .vercel.app viejo)
const CANONICAL_ORIGIN = "https://www.wcfchecklist.com";

// Redes sociales
const INSTAGRAM_URL = "https://www.instagram.com/wcfchecklist/";
const FACEBOOK_URL = "https://www.facebook.com/wcfchecklist";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="30%" stopColor="#FF543E" />
          <stop offset="60%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#5851DB" />
        </linearGradient>
      </defs>
      <path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// Imagen 1x1 transparente para ocultar la miniatura fantasma que el
// navegador dibuja por defecto al arrastrar (drag-and-drop más limpio)
const TRANSPARENT_DRAG_IMG = new Image();
TRANSPARENT_DRAG_IMG.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7";

async function sbGet(table: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.main`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const rows = await res.json();
  return rows[0] ?? null;
}

async function sbUpsert(table: string, data: object) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ id: "main", ...data, updated_at: new Date().toISOString() }),
  });
}

// ============================================================
//  I18N
// ============================================================
type LangCode = "es" | "en" | "th" | "fr" | "vi" | "ja" | "zh";
const LANGUAGES: { code: LangCode; flag: string; label: string }[] = [
  { code: "en", flag: "https://flagcdn.com/us.svg", label: "EN" },
  { code: "es", flag: "https://flagcdn.com/es.svg", label: "ES" },
  { code: "fr", flag: "https://flagcdn.com/fr.svg", label: "FR" },
  { code: "vi", flag: "https://flagcdn.com/vn.svg", label: "VI" },
  { code: "ja", flag: "https://flagcdn.com/jp.svg", label: "JA" },
  { code: "zh", flag: "https://flagcdn.com/cn.svg", label: "ZH" },
  { code: "th", flag: "https://flagcdn.com/th.svg", label: "TH" },
];

const T = {
  appTitle:         { es: "WCF Checklist",            en: "WCF Checklist",              th: "WCF Checklist" , fr: "WCF Checklist" , vi: "WCF Checklist" , ja: "WCF チェックリスト", zh: "WCF 收藏清单" },
  appSubtitle:      { es: "World Collectable Figure",  en: "World Collectable Figure",   th: "World Collectable Figure" , fr: "World Collectable Figure" , vi: "World Collectable Figure" , ja: "ワールドコレクタブルフィギュア", zh: "世界收藏人偶" },
  searchPH:         { es: "Buscar figura, serie o set...", en: "Search figure, series or set...", th: "ค้นหาตัวเลข ซีรีส์ หรือชุด..." , fr: "Chercher figurine, série ou set..." , vi: "Tìm kiếm nhân vật, series hoặc bộ..." , ja: "フィギュア、シリーズ、セットを検索...", zh: "搜索人偶、系列或套装..." },
  allCategories:    { es: "Todas las categorías",      en: "All categories",             th: "ทุกหมวดหมู่" , fr: "Toutes les catégories" , vi: "Tất cả danh mục" , ja: "すべてのカテゴリ", zh: "所有类别" },
  official:         { es: "🏷️ Oficiales",              en: "🏷️ Official",                th: "🏷️ ทางการ" , fr: "🏷️ Officielles" , vi: "🏷️ Chính thức" , ja: "🏷️ 公式", zh: "🏷️ 官方" },
  resin:            { es: "🎨 Resinas",                en: "🎨 Resin",                   th: "🎨 เรซิน" , fr: "🎨 Résines" , vi: "🎨 Nhựa" , ja: "🎨 レジン", zh: "🎨 树脂" },
  officialBadge:    { es: "Oficial",                   en: "Official",                   th: "ทางการ" , fr: "Officiel" , vi: "Chính thức" , ja: "公式", zh: "官方" },
  resinBadge:       { es: "Resina",                    en: "Resin",                      th: "เรซิน" , fr: "Résine" , vi: "Nhựa" , ja: "レジン", zh: "树脂" },
  seriesLabel:      { es: "Series",                    en: "Series",                     th: "ซีรีส์" , fr: "Séries" , vi: "Series" , ja: "シリーズ", zh: "系列" },
  newSeries:        { es: "+ Nueva serie",             en: "+ New series",               th: "+ ซีรีส์ใหม่" , fr: "+ Nouvelle série" , vi: "+ Series mới" , ja: "+ 新シリーズ", zh: "+ 新系列" },
  newSet:           { es: "+ Nuevo set",               en: "+ New set",                  th: "+ ชุดใหม่" , fr: "+ Nouveau set" , vi: "+ Bộ mới" , ja: "+ 新セット", zh: "+ 新套装" },
  noSeries:         { es: "Sin series aún",            en: "No series yet",              th: "ยังไม่มีซีรีส์" , fr: "Aucune série" , vi: "Không có series" , ja: "シリーズなし", zh: "没有系列" },
  noSets1:          { es: "Esta serie no tiene sets aún.", en: "This series has no sets yet.", th: "ซีรีส์นี้ยังไม่มีชุด" , fr: "Cette série n'a pas encore de sets." , vi: "Series này chưa có bộ nào." , ja: "このシリーズにはまだセットがありません。", zh: "这个系列还没有套装。" },
  noSets2:          { es: "Pulsa \"+ Nuevo set\" para empezar.", en: "Press \"+ New set\" to start.", th: "กด \"+ ชุดใหม่\" เพื่อเริ่มต้น" },
  noSeriesCat1:     { es: "No hay series en esta categoría.", en: "No series in this category.", th: "ไม่มีซีรีส์ในหมวดหมู่นี้" , fr: "Aucune série dans cette catégorie." , vi: "Không có series trong danh mục này." , ja: "このカテゴリにシリーズがありません。", zh: "此类别中没有系列。" },
  noSeriesCat2:     { es: "Pulsa \"+ Nueva serie\" para empezar.", en: "Press \"+ New series\" to start.", th: "กด \"+ ซีรีส์ใหม่\" เพื่อเริ่มต้น" },
  wishlist:         { es: "Wishlist",                  en: "Wishlist",                   th: "รายการปรารถนา" , fr: "Liste de souhaits" , vi: "Danh sách yêu thích" , ja: "ウィッシュリスト", zh: "愿望清单" },
  wishlistEmpty:    { es: "Tu wishlist está vacía",    en: "Your wishlist is empty",      th: "รายการปรารถนาของคุณว่างเปล่า" , fr: "Ta wishlist est vide" , vi: "Danh sách yêu thích của bạn trống" , ja: "ウィッシュリストは空です", zh: "您的愿望清单是空的" },
  wishlistHint:     { es: "Pasa el ratón sobre cualquier figura y pulsa 🤍 para añadirla", en: "Hover over any figure and press 🤍 to add it", th: "วางเมาส์เหนือตัวเลขแล้วกด 🤍 เพื่อเพิ่ม" , fr: "Survole une figurine et appuie sur 🤍 pour l'ajouter" , vi: "Di chuột qua nhân vật và nhấn 🤍 để thêm" , ja: "フィギュアにカーソルを合わせて🤍を押して追加", zh: "将鼠标悬停在人偶上并按🤍添加" },
  owned:            { es: "Obtenida",                  en: "Owned",                      th: "มีแล้ว" , fr: "Possédées" , vi: "Đã có" , ja: "所持済み", zh: "已拥有" },
  missing:          { es: "Me falta",                  en: "Missing",                    th: "ยังขาด" , fr: "Manquante" , vi: "Chưa có" , ja: "未所持", zh: "未拥有" },
  inWishlist:       { es: "En wishlist",               en: "In wishlist",                th: "ในรายการ" , fr: "Désirée" , vi: "Trong danh sách" , ja: "ウィッシュリスト中", zh: "在愿望清单中" },
  tapToOwn:         { es: "Toca para obtener",         en: "Tap to own",                 th: "แตะเพื่อรับ" , fr: "Appuyer pour obtenir" , vi: "Nhấn để đánh dấu" , ja: "タップして所持済みに", zh: "点击标记为已拥有" },
  complete:         { es: "✓ Completo",                en: "✓ Complete",                 th: "✓ ครบ" , fr: "✓ Complet" , vi: "✓ Hoàn thành" , ja: "✓ コンプリート", zh: "✓ 完整" },
  markAll:          { es: "Marcar todo",               en: "Mark all",                   th: "ทำเครื่องหมายทั้งหมด" , fr: "Tout cocher" , vi: "Đánh dấu tất cả" , ja: "すべてにチェック", zh: "全部标记" },
  unmarkAll:        { es: "Desmarcar todo",            en: "Unmark all",                 th: "ยกเลิกทั้งหมด" , fr: "Tout décocher" , vi: "Bỏ đánh dấu tất cả" , ja: "すべてのチェックを外す", zh: "全部取消标记" },
  addFigure:        { es: "+ Añadir figura",           en: "+ Add figure",               th: "+ เพิ่มตัวเลข" , fr: "+ Ajouter figurine" , vi: "+ Thêm nhân vật" , ja: "+ フィギュア追加", zh: "+ 添加人偶" },
  editSetBtn:       { es: "✏️ Editar set",             en: "✏️ Edit set",                th: "✏️ แก้ไขชุด" , fr: "✏️ Modifier set" , vi: "✏️ Sửa bộ" , ja: "✏️ セット編集", zh: "✏️ 编辑套装" },
  deleteSetBtn:     { es: "🗑 Eliminar set",           en: "🗑 Delete set",              th: "🗑 ลบชุด" , fr: "🗑 Supprimer set" , vi: "🗑 Xóa bộ" , ja: "🗑 セット削除", zh: "🗑 删除套装" },
  noResults:        { es: "No se encontraron figuras con esos filtros.", en: "No figures found with those filters.", th: "ไม่พบตัวเลขที่ตรงกับตัวกรองเหล่านั้น" , fr: "Aucune figurine trouvée avec ces filtres." , vi: "Không tìm thấy nhân vật nào với bộ lọc này." , ja: "このフィルターでフィギュアが見つかりません。", zh: "没有找到符合筛选条件的人偶。" },
  searchResults:    { es: "🔍 Resultados",             en: "🔍 Results",                 th: "🔍 ผลลัพธ์" , fr: "🔍 Résultats" , vi: "🔍 Kết quả" , ja: "🔍 検索結果", zh: "🔍 搜索结果" },
  allSeries:        { es: "Todas las series",          en: "All series",                 th: "ทุกซีรีส์" , fr: "Toutes les séries" , vi: "Tất cả series" , ja: "すべてのシリーズ", zh: "所有系列" },
  loading:          { es: "Cargando colección...",     en: "Loading collection...",      th: "กำลังโหลดคอลเลกชัน..." , fr: "Chargement..." , vi: "Đang tải..." , ja: "読み込み中...", zh: "加载中..." },
  adjustImage:      { es: "Ajustar imagen",            en: "Adjust image",               th: "ปรับรูปภาพ" , fr: "Ajuster l'image" , vi: "Điều chỉnh hình ảnh" , ja: "画像を調整", zh: "调整图片" },
  cropHint:         { es: "Arrastra el recuadro · Esquinas para redimensionar · Slider para zoom", en: "Drag the box · Corners to resize · Slider for zoom", th: "ลากกรอบ · มุมเพื่อปรับขนาด · สไลเดอร์สำหรับซูม" , fr: "Déplacer le cadre · Coins pour redimensionner · Slider pour zoomer" , vi: "Di chuyển khung · Góc để thay đổi kích thước · Thanh trượt để zoom" , ja: "枠を移動 · 角でサイズ変更 · スライダーでズーム", zh: "移动框架 · 拖动角落调整大小 · 滑块缩放" },
  confirmUpload:    { es: "Confirmar y subir",         en: "Confirm & upload",           th: "ยืนยันและอัปโหลด" , fr: "Confirmer et envoyer" , vi: "Xác nhận và tải lên" , ja: "確認してアップロード", zh: "确认并上传" },
  uploading:        { es: "⏳ Subiendo imagen...",     en: "⏳ Uploading image...",      th: "⏳ กำลังอัปโหลด..." , fr: "⏳ Envoi en cours..." , vi: "⏳ Đang tải lên..." , ja: "⏳ アップロード中...", zh: "⏳ 上传中..." },
  uploadClick:      { es: "📁 Clic para subir imagen", en: "📁 Click to upload image",  th: "📁 คลิกเพื่ออัปโหลดรูป" , fr: "📁 Cliquer pour envoyer" , vi: "📁 Nhấn để tải lên" , ja: "📁 クリックしてアップロード", zh: "📁 点击上传" },
  uploadChange:     { es: "Clic para cambiar",         en: "Click to change",            th: "คลิกเพื่อเปลี่ยน" , fr: "Cliquer pour changer" , vi: "Nhấn để thay đổi" , ja: "クリックして変更", zh: "点击更改" },
  uploadError:      { es: "Error al subir. Comprueba la API key.", en: "Upload error. Check your API key.", th: "เกิดข้อผิดพลาด ตรวจสอบ API key" , fr: "Erreur d'envoi. Vérifie la clé API." , vi: "Lỗi tải lên. Kiểm tra API key." , ja: "アップロードエラー。APIキーを確認してください。", zh: "上传错误。请检查API密钥。" },
  uploadedBy:       { es: "Subida por", en: "Uploaded by", th: "อัปโหลดโดย" , fr: "Envoyée par" , vi: "Được tải lên bởi" , ja: "アップロード者:", zh: "上传者：" },
  communityMember:  { es: "un coleccionista", en: "a collector", th: "นักสะสม" , fr: "un collectionneur" , vi: "một nhà sưu tầm" , ja: "コレクター", zh: "一位收藏家" },
  noApiKey:         { es: "Añade tu API key de ImgBB en ⚙️ Ajustes", en: "Add your ImgBB API key in ⚙️ Settings", th: "เพิ่ม API key ของ ImgBB ใน ⚙️ การตั้งค่า" , fr: "Ajoute ta clé API ImgBB dans ⚙️ Paramètres" , vi: "Thêm API key ImgBB trong ⚙️ Cài đặt" , ja: "⚙️ 設定でImgBB APIキーを追加してください", zh: "请在⚙️设置中添加ImgBB API密钥" },
  apiKeyWarning:    { es: "Añade tu API key de ImgBB en", en: "Add your ImgBB API key in", th: "เพิ่ม API key ของ ImgBB ใน" , fr: "Ajoute ta clé API ImgBB dans" , vi: "Thêm API key ImgBB trong" , ja: "ImgBB APIキーを追加してください", zh: "请添加ImgBB API密钥" },
  noImage:          { es: "sin imagen",                en: "no image",                   th: "ไม่มีรูป" , fr: "sans image" , vi: "chưa có hình" , ja: "画像なし", zh: "无图片" },
  zoom:             { es: "🔍 Zoom",                   en: "🔍 Zoom",                    th: "🔍 ซูม" , fr: "🔍 Zoom" , vi: "🔍 Zoom" , ja: "🔍 ズーム", zh: "🔍 缩放" },
  cancel:           { es: "Cancelar",                  en: "Cancel",                     th: "ยกเลิก" , fr: "Annuler" , vi: "Hủy" , ja: "キャンセル", zh: "取消" },
  save:             { es: "Guardar",                   en: "Save",                       th: "บันทึก" , fr: "Enregistrer" , vi: "Lưu" , ja: "保存", zh: "保存" },
  settings:         { es: "Ajustes",                   en: "Settings",                   th: "การตั้งค่า" , fr: "Paramètres" , vi: "Cài đặt" , ja: "設定", zh: "设置" },
  imgbbKey:         { es: "API Key de ImgBB",          en: "ImgBB API Key",              th: "ImgBB API Key" , fr: "Clé API ImgBB" , vi: "API Key ImgBB" , ja: "ImgBB APIキー", zh: "ImgBB API密钥" },
  imgbbHint:        { es: "Consíguela gratis en imgbb.com/api", en: "Get it free at imgbb.com/api", th: "รับได้ฟรีที่ imgbb.com/api" , fr: "Obtiens-la gratuitement sur imgbb.com/api" , vi: "Lấy miễn phí tại imgbb.com/api" , ja: "imgbb.com/apiで無料取得", zh: "在imgbb.com/api免费获取" },
  nameLabel:        { es: "Nombre",                    en: "Name",                       th: "ชื่อ" , fr: "Nom" , vi: "Tên" , ja: "名前", zh: "名称" },
  emojiLabel:       { es: "Emoji",                     en: "Emoji",                      th: "อีโมจิ" , fr: "Emoji" , vi: "Emoji" , ja: "絵文字", zh: "表情符号" },
  emojiFallback:    { es: "Emoji (fallback si no hay icono)", en: "Emoji (fallback if no icon)", th: "อีโมจิ (สำรองถ้าไม่มีไอคอน)" , fr: "Emoji (secours si pas d'icône)" , vi: "Emoji (dự phòng nếu không có icon)" , ja: "絵文字（アイコンがない場合のフォールバック）", zh: "表情符号（无图标时的备用）" },
  colorLabel:       { es: "Color",                     en: "Color",                      th: "สี" , fr: "Couleur" , vi: "Màu sắc" , ja: "カラー", zh: "颜色" },
  figureImage:      { es: "Imagen de la figura",       en: "Figure image",               th: "รูปตัวเลข" , fr: "Image de la figurine" , vi: "Hình ảnh nhân vật" , ja: "フィギュア画像", zh: "人偶图片" },
  sidebarIcon:      { es: "Icono para barra lateral (cuadrado)", en: "Sidebar icon (square)", th: "ไอคอนแถบด้านข้าง" , fr: "Icône barre latérale (carré)" , vi: "Icon thanh bên (vuông)" , ja: "サイドバーアイコン（正方形）", zh: "侧边栏图标（正方形）" },
  headerLogo:       { es: "Logo para encabezado (sin recorte)", en: "Header logo (no crop)", th: "โลโก้ส่วนหัว (ไม่ตัด)" , fr: "Logo en-tête (sans recadrage)" , vi: "Logo tiêu đề (không cắt xén)" , ja: "ヘッダーロゴ（トリミングなし）", zh: "页眉标志（无裁剪）" },
  setNameLabel:     { es: "Nombre del set",            en: "Set name",                   th: "ชื่อชุด" , fr: "Nom du set" , vi: "Tên bộ" , ja: "セット名", zh: "套装名称" },
  releaseDateLabel: { es: "Fecha de lanzamiento (mes/año)", en: "Release date (month/year)", th: "วันวางจำหน่าย (เดือน/ปี)" , fr: "Date de sortie (mois/année)" , vi: "Ngày phát hành (tháng/năm)" , ja: "発売日（月/年）", zh: "发布日期（月/年）" },
  setLogoLabel:     { es: "Logo de la serie (ej: Dragon Ball Z)", en: "Series logo (e.g. Dragon Ball Z)", th: "โลโก้ซีรีส์" , fr: "Logo de la série (ex: Dragon Ball Z)" , vi: "Logo series (vd: Dragon Ball Z)" , ja: "シリーズロゴ（例：ドラゴンボールZ）", zh: "系列标志（例如：龙珠Z）" },
  newFigureTitle:   { es: "Nueva figura",              en: "New figure",                 th: "ตัวเลขใหม่" , fr: "Nouvelle figurine" , vi: "Nhân vật mới" , ja: "新しいフィギュア", zh: "新人偶" },
  editFigureTitle:  { es: "Editar figura",             en: "Edit figure",                th: "แก้ไขตัวเลข" , fr: "Modifier figurine" , vi: "Sửa nhân vật" , ja: "フィギュア編集", zh: "编辑人偶" },
  editSetTitle:     { es: "Editar set",                en: "Edit set",                   th: "แก้ไขชุด" , fr: "Modifier set" , vi: "Sửa bộ" , ja: "セット編集", zh: "编辑套装" },
  editSeriesTitle:  { es: "Editar serie",              en: "Edit series",                th: "แก้ไขซีรีส์" , fr: "Modifier série" , vi: "Sửa series" , ja: "シリーズ編集", zh: "编辑系列" },
  months: {
    es: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    fr: ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"],
    vi: ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"],
    ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    zh: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    th: ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],
  },
  wishlistCount: {
    es: (n: number) => `${n} figura${n !== 1 ? "s" : ""} en tu wishlist`,
    en: (n: number) => `${n} figure${n !== 1 ? "s" : ""} in your wishlist`,
    fr: (n: number) => `${n} figurine${n !== 1 ? "s" : ""} dans ta wishlist`,
    vi: (n: number) => `${n} nhân vật trong danh sách`,
    ja: (n: number) => `ウィッシュリストに${n}体`,
    zh: (n: number) => `愿望清单中有${n}个人偶`,
    th: (n: number) => `${n} ตัวเลขในรายการปรารถนา`,
  },
  resultsCount: {
    es: (n: number) => `${n} figura${n !== 1 ? "s" : ""} encontrada${n !== 1 ? "s" : ""}`,
    en: (n: number) => `${n} figure${n !== 1 ? "s" : ""} found`,
    fr: (n: number) => `${n} figurine${n !== 1 ? "s" : ""} trouvée${n !== 1 ? "s" : ""}`,
    vi: (n: number) => `Tìm thấy ${n} nhân vật`,
    ja: (n: number) => `${n}体見つかりました`,
    zh: (n: number) => `找到${n}个人偶`,
    th: (n: number) => `พบ ${n} ตัวเลข`,
  },
  newSeriesTitle: {
    es: (cat: string) => `Nueva serie — ${cat}`,
    en: (cat: string) => `New series — ${cat}`,
    fr: (cat: string) => `Nouvelle série — ${cat}`,
    vi: (cat: string) => `Series mới — ${cat}`,
    ja: (cat: string) => `新シリーズ — ${cat}`,
    zh: (cat: string) => `新系列 — ${cat}`,
    th: (cat: string) => `ซีรีส์ใหม่ — ${cat}`,
  },
  sortDate:       { es: "📅 Fecha",               en: "📅 Date",                    th: "📅 วันที่" , fr: "📅 Date" , vi: "📅 Ngày" , ja: "📅 日付", zh: "📅 日期" },
  sortAZ:         { es: "A-Z",                    en: "A-Z",                        th: "A-Z" , fr: "A-Z" , vi: "A-Z" , ja: "A-Z", zh: "A-Z" },
  searchCol:      { es: "Buscar en mi colección...", en: "Search my collection...", th: "ค้นหาคอลเลกชัน..." , fr: "Chercher dans ma collection..." , vi: "Tìm trong bộ sưu tập..." , ja: "コレクションを検索...", zh: "搜索我的收藏..." },
  searchDb:       { es: "Buscar en el catálogo...", en: "Search the catalog...",    th: "ค้นหาแคตตาล็อก..." , fr: "Chercher dans le catalogue..." , vi: "Tìm trong danh mục..." , ja: "カタログを検索...", zh: "搜索目录..." },
  tabCollection:  { es: "Mis WCF",               en: "My WCF",                     th: "WCF ของฉัน" , fr: "Mes WCF" , vi: "WCF của tôi" , ja: "マイWCF", zh: "我的WCF" },
  tabDatabase:    { es: "Catálogo",               en: "Catalog",                    th: "แคตตาล็อก" , fr: "Catalogue" , vi: "Danh mục" , ja: "カタログ", zh: "目录" },
  filterAll:      { es: "Todas",                  en: "All",                        th: "ทั้งหมด" , fr: "Toutes" , vi: "Tất cả" , ja: "すべて", zh: "全部" },
  moveToWishlist: { es: "💛 Wishlist",            en: "💛 Wishlist",                th: "💛 รายการ" , fr: "💛 Wishlist" , vi: "💛 Yêu thích" , ja: "💛 ウィッシュリスト", zh: "💛 愿望清单" },
  moveToOwned:    { es: "✓ Obtenida",             en: "✓ Owned",                   th: "✓ มีแล้ว" , fr: "✓ Obtenue" , vi: "✓ Đã có" , ja: "✓ 所持済み", zh: "✓ 已拥有" },
  removeItem:     { es: "✕ Quitar",               en: "✕ Remove",                  th: "✕ ลบ" , fr: "✕ Retirer" , vi: "✕ Xóa" , ja: "✕ 削除", zh: "✕ 移除" },
  cancelBtn:      { es: "Cancelar",               en: "Cancel",                     th: "ยกเลิก" , fr: "Annuler" , vi: "Hủy" , ja: "キャンセル", zh: "取消" },
  noFiguresOwned: { es: "Aún no has marcado ninguna figura.", en: "You haven't marked any figures yet.", th: "ยังไม่ได้ทำเครื่องหมายตัวเลขใดๆ" , fr: "Tu n'as encore marqué aucune figurine." , vi: "Bạn chưa đánh dấu nhân vật nào." , ja: "まだフィギュアにチェックしていません。", zh: "您还没有标记任何人偶。" },
  back:           { es: "← Volver",               en: "← Back",                     th: "← กลับ" , fr: "← Retour" , vi: "← Quay lại" , ja: "← 戻る", zh: "← 返回" },
  changelogTitle: { es: "Novedades",              en: "What's new",                  th: "อัปเดต" , fr: "Nouveautés" , vi: "Cập nhật" , ja: "更新情報", zh: "更新内容" },
  newsLabel:       { es: "Nueva figura",           en: "New addition",                th: "ฟิกเกอร์ใหม่" , fr: "Nouvelle figurine" , vi: "Mô hình mới" , ja: "新着フィギュア", zh: "新手办" },
  newsButtonTitle: { es: "Nuevas figuras",         en: "New additions",               th: "ฟิกเกอร์ใหม่" , fr: "Nouvelles figurines" , vi: "Mô hình mới" , ja: "新着フィギュア", zh: "新手办" },
  newsSeeDetail:   { es: "Ver ficha completa",     en: "View full details",           th: "ดูรายละเอียด" , fr: "Voir la fiche" , vi: "Xem chi tiết" , ja: "詳細を見る", zh: "查看详情" },
  newsDownloadStory: { es: "Descargar story",      en: "Download story",              th: "ดาวน์โหลดสตอรี่" , fr: "Télécharger la story" , vi: "Tải story" , ja: "ストーリーを保存", zh: "下载故事图" },
  newsStoryError:  { es: "No se pudo generar la imagen. Inténtalo de nuevo.", en: "Couldn't generate the image. Please try again.", th: "สร้างรูปภาพไม่สำเร็จ ลองอีกครั้ง", fr: "Impossible de générer l'image. Réessayez.", vi: "Không thể tạo hình ảnh. Vui lòng thử lại.", ja: "画像を生成できませんでした。もう一度お試しください。", zh: "生成图片失败，请重试。" },
  newsWeeklySummary: { es: "Resumen semanal", en: "Weekly summary", th: "สรุปประจำสัปดาห์", fr: "Résumé hebdomadaire", vi: "Tổng kết tuần", ja: "週間まとめ", zh: "每周汇总" },
  newsWeeklyEmpty: { es: "No se ha marcado ninguna figura como novedad esta semana.", en: "No figures were marked as new this week.", th: "ยังไม่มีการทำเครื่องหมายฟิกเกอร์ใหม่ในสัปดาห์นี้", fr: "Aucune figurine marquée comme nouvelle cette semaine.", vi: "Chưa có mô hình nào được đánh dấu là mới trong tuần này.", ja: "今週新着としてマークされたフィギュアはありません。", zh: "本周还没有标记为新品的手办。" },
  newsWeeklyError: { es: "No se pudo generar la imagen. Inténtalo de nuevo.", en: "Couldn't generate the image. Please try again.", th: "สร้างรูปภาพไม่สำเร็จ ลองอีกครั้ง", fr: "Impossible de générer l'image. Réessayez.", vi: "Không thể tạo hình ảnh. Vui lòng thử lại.", ja: "画像を生成できませんでした。もう一度お試しください。", zh: "生成图片失败，请重试。" },
  newsFilterFavs:  { es: "Favoritas",              en: "Favorites",                    th: "รายการโปรด" , fr: "Favoris" , vi: "Yêu thích" , ja: "お気に入り", zh: "收藏" },
  newsFilterAll:   { es: "Todas",                  en: "All",                          th: "ทั้งหมด" , fr: "Toutes" , vi: "Tất cả" , ja: "すべて", zh: "全部" },
  newsEmptyFavs:   { es: "No hay novedades en tus series favoritas ahora mismo.", en: "No news in your favorite series right now.", th: "ตอนนี้ยังไม่มีของใหม่ในซีรีส์โปรดของคุณ", fr: "Aucune nouveauté dans vos séries favorites pour le moment.", vi: "Hiện chưa có tin mới trong các series yêu thích của bạn.", ja: "現在お気に入りのシリーズに新着はありません。", zh: "你收藏的系列目前没有新品。" },
  newsEmptyAll:    { es: "No hay novedades en este momento.", en: "No news right now.", th: "ยังไม่มีข่าวสารในตอนนี้", fr: "Aucune nouveauté pour le moment.", vi: "Hiện chưa có tin mới.", ja: "現在お知らせはありません。", zh: "目前没有新品资讯。" },
  changelogHistory:{ es: "Ver historial completo", en: "Full history",               th: "ประวัติทั้งหมด" , fr: "Historique complet" , vi: "Lịch sử đầy đủ" , ja: "全履歴", zh: "完整历史" },
  changelogClose: { es: "Entendido",              en: "Got it",                      th: "เข้าใจแล้ว" , fr: "Compris" , vi: "Đã hiểu" , ja: "了解", zh: "明白了" },
  followUs:       { es: "Síguenos:", en: "Follow us:", th: "ติดตามเรา:", fr: "Suivez-nous :", vi: "Theo dõi chúng tôi:", ja: "フォローする：", zh: "关注我们：" },
  tabStats:       { es: "Mis Stats",              en: "My Stats",                    th: "สถิติของฉัน" , fr: "Mes Stats" , vi: "Thống kê" , ja: "マイ統計", zh: "我的统计" },
  tabCommunity:   { es: "Comunidad",               en: "Community",                   th: "ชุมชน" , fr: "Communauté" , vi: "Cộng đồng" , ja: "コミュニティ", zh: "社区" },
  topUploaders:   { es: "Top subidas de fotos",    en: "Top photo uploaders",          th: "ผู้อัปโหลดรูปสูงสุด" , fr: "Top contributeurs photo" , vi: "Người tải ảnh nhiều nhất" , ja: "写真投稿トップ", zh: "上传照片排行榜" },
  topCollectors:  { es: "Top colecciones",         en: "Top collections",              th: "คอลเลกชันยอดนิยม" , fr: "Meilleures collections" , vi: "Bộ sưu tập hàng đầu" , ja: "コレクション数ランキング", zh: "收藏排行榜" },
  photosCount:    { es: "fotos",                   en: "photos",                       th: "รูปภาพ" , fr: "photos" , vi: "ảnh" , ja: "枚", zh: "张照片" },
  figuresCount:   { es: "figuras",                 en: "figures",                      th: "ฟิกเกอร์" , fr: "figurines" , vi: "mô hình" , ja: "体", zh: "个手办" },
  noLeaderboardData: { es: "Todavía no hay datos suficientes", en: "Not enough data yet", th: "ยังไม่มีข้อมูลเพียงพอ" , fr: "Pas encore assez de données" , vi: "Chưa đủ dữ liệu" , ja: "まだデータがありません", zh: "暂无足够数据" },
  mostCollected:  { es: "Top más coleccionadas",   en: "Top most collected",           th: "Top ที่สะสมมากที่สุด" , fr: "Top les plus collectionnées" , vi: "Top được sưu tầm nhiều nhất" , ja: "Top 最も集められた", zh: "Top 收藏最多" },
  mostWished:     { es: "Top más deseadas",        en: "Top most wished",              th: "Top ที่ต้องการมากที่สุด" , fr: "Top les plus désirées" , vi: "Top được mong muốn nhiều nhất" , ja: "Top 最も欲しい", zh: "Top 最想要" },
  badgeLegendTitle: { es: "¿Cómo funcionan las medallas?", en: "How do badges work?", th: "เหรียญตราทำงานอย่างไร" , fr: "Comment fonctionnent les badges ?" , vi: "Huy hiệu hoạt động thế nào?" , ja: "バッジの仕組み", zh: "徽章如何运作？" },
  badgeLegendDesc:  { es: "Cada serie tiene 5 niveles según cuántas figuras tengas de ella. También hay una medalla global según tu total de figuras.", en: "Each series has 5 levels based on how many figures you own from it. There's also a global badge based on your total figure count.", th: "แต่ละซีรีส์มี 5 ระดับตามจำนวนฟิกเกอร์ที่คุณมี นอกจากนี้ยังมีเหรียญรวมตามจำนวนฟิกเกอร์ทั้งหมดของคุณ" , fr: "Chaque série a 5 niveaux selon le nombre de figurines que tu possèdes. Il y a aussi un badge global basé sur ton total de figurines." , vi: "Mỗi series có 5 cấp độ dựa trên số mô hình bạn sở hữu. Cũng có huy hiệu toàn cầu dựa trên tổng số mô hình của bạn." , ja: "各シリーズには所持数に応じた5段階のレベルがあります。所持総数に応じたグローバルバッジもあります。", zh: "每个系列根据你拥有的手办数量分为5个等级。还有一个基于总手办数量的全局徽章。" },
  globalBadgeLabel: { es: "Total (todas las series)", en: "Total (all series)", th: "รวมทั้งหมด (ทุกซีรีส์)" , fr: "Total (toutes séries)" , vi: "Tổng (tất cả series)" , ja: "合計（全シリーズ）", zh: "总计（所有系列）" },
  // ── Nombres de rango de badges (8 grupos × 5 niveles) ──
  badgeTier_global_1: { es:"Bronce", en:"Bronze", th:"บรอนซ์", fr:"Bronze", vi:"Đồng", ja:"ブロンズ", zh:"青铜" },
  badgeTier_global_2: { es:"Plata", en:"Silver", th:"เงิน", fr:"Argent", vi:"Bạc", ja:"シルバー", zh:"白银" },
  badgeTier_global_3: { es:"Oro", en:"Gold", th:"ทอง", fr:"Or", vi:"Vàng", ja:"ゴールド", zh:"黄金" },
  badgeTier_global_4: { es:"Platino", en:"Platinum", th:"แพลตินัม", fr:"Platine", vi:"Bạch kim", ja:"プラチナ", zh:"铂金" },
  badgeTier_global_5: { es:"Diamante", en:"Diamond", th:"เพชร", fr:"Diamant", vi:"Kim cương", ja:"ダイヤモンド", zh:"钻石" },
  badgeTier_dbz_1: { es:"Guerrero Z", en:"Z Fighter", th:"นักสู้ Z", fr:"Guerrier Z", vi:"Chiến Binh Z", ja:"Z戦士", zh:"Z战士" },
  badgeTier_dbz_2: { es:"Super Saiyan", en:"Super Saiyan", th:"ซูเปอร์ไซย่า", fr:"Super Saiyan", vi:"Super Saiyan", ja:"スーパーサイヤ人", zh:"超级赛亚人" },
  badgeTier_dbz_3: { es:"Super Saiyan 3", en:"Super Saiyan 3", th:"ซูเปอร์ไซย่า 3", fr:"Super Saiyan 3", vi:"Super Saiyan 3", ja:"スーパーサイヤ人3", zh:"超级赛亚人3" },
  badgeTier_dbz_4: { es:"Super Saiyan 4", en:"Super Saiyan 4", th:"ซูเปอร์ไซย่า 4", fr:"Super Saiyan 4", vi:"Super Saiyan 4", ja:"スーパーサイヤ人4", zh:"超级赛亚人4" },
  badgeTier_dbz_5: { es:"Super Saiyan God", en:"Super Saiyan God", th:"ซูเปอร์ไซย่าก็อด", fr:"Super Saiyan God", vi:"Super Saiyan God", ja:"スーパーサイヤ人ゴッド", zh:"超级赛亚人神" },
  badgeTier_op_1: { es:"Novato", en:"Rookie", th:"มือใหม่", fr:"Novice", vi:"Tân Binh", ja:"新世代", zh:"新人" },
  badgeTier_op_2: { es:"Supernova", en:"Supernova", th:"ซูเปอร์โนวา", fr:"Supernova", vi:"Siêu Tân Tinh", ja:"超新星", zh:"超新星" },
  badgeTier_op_3: { es:"Shichibukai", en:"Warlord", th:"ชิจิบุไก", fr:"Shichibukai", vi:"Thất Vũ Hải", ja:"七武海", zh:"七武海" },
  badgeTier_op_4: { es:"Yonkō", en:"Emperor", th:"ยงโค", fr:"Yonkō", vi:"Tứ Hoàng", ja:"四皇", zh:"四皇" },
  badgeTier_op_5: { es:"Rey Pirata", en:"Pirate King", th:"ราชาโจรสลัด", fr:"Roi des Pirates", vi:"Vua Hải Tặc", ja:"海賊王", zh:"海贼王" },
  badgeTier_naruto_1: { es:"Academia Ninja", en:"Ninja Academy", th:"โรงเรียนนินจา", fr:"Académie Ninja", vi:"Học Viện Ninja", ja:"忍者学校", zh:"忍者学校" },
  badgeTier_naruto_2: { es:"Genin", en:"Genin", th:"เก็นนิน", fr:"Genin", vi:"Genin", ja:"下忍", zh:"下忍" },
  badgeTier_naruto_3: { es:"Chūnin", en:"Chūnin", th:"จูนิน", fr:"Chūnin", vi:"Chūnin", ja:"中忍", zh:"中忍" },
  badgeTier_naruto_4: { es:"Jōnin", en:"Jōnin", th:"โจนิน", fr:"Jōnin", vi:"Jōnin", ja:"上忍", zh:"上忍" },
  badgeTier_naruto_5: { es:"Kage", en:"Kage", th:"คาเงะ", fr:"Kage", vi:"Kage", ja:"影", zh:"影" },
  badgeTier_mha_1: { es:"Estudiante", en:"Student", th:"นักเรียน", fr:"Étudiant", vi:"Học Sinh", ja:"生徒", zh:"学生" },
  badgeTier_mha_2: { es:"Héroe Novato", en:"Rookie Hero", th:"ฮีโร่มือใหม่", fr:"Héros Débutant", vi:"Anh Hùng Mới", ja:"新人ヒーロー", zh:"新人英雄" },
  badgeTier_mha_3: { es:"Héroe Pro", en:"Pro Hero", th:"ฮีโร่มืออาชีพ", fr:"Héros Pro", vi:"Anh Hùng Chuyên Nghiệp", ja:"プロヒーロー", zh:"职业英雄" },
  badgeTier_mha_4: { es:"Top 10", en:"Top 10", th:"ท็อป 10", fr:"Top 10", vi:"Top 10", ja:"トップ10", zh:"前十强" },
  badgeTier_mha_5: { es:"Símbolo de Paz", en:"Symbol of Peace", th:"สัญลักษณ์แห่งสันติ", fr:"Symbole de la Paix", vi:"Biểu Tượng Hòa Bình", ja:"平和の象徴", zh:"和平的象征" },
  badgeTier_hxh_1: { es:"Aspirante", en:"Applicant", th:"ผู้สมัคร", fr:"Candidat", vi:"Ứng Viên", ja:"受験者", zh:"考生" },
  badgeTier_hxh_2: { es:"Hunter", en:"Hunter", th:"ฮันเตอร์", fr:"Hunter", vi:"Hunter", ja:"ハンター", zh:"猎人" },
  badgeTier_hxh_3: { es:"Especialista", en:"Specialist", th:"ผู้เชี่ยวชาญ", fr:"Spécialiste", vi:"Chuyên Gia", ja:"特質系", zh:"特质系" },
  badgeTier_hxh_4: { es:"Zodiaco", en:"Zodiac", th:"ราศี", fr:"Zodiaque", vi:"Hoàng Đạo", ja:"十二支ん", zh:"十二支阿" },
  badgeTier_hxh_5: { es:"Presidente", en:"Chairman", th:"ประธาน", fr:"Président", vi:"Chủ Tịch", ja:"会長", zh:"会长" },
  badgeTier_kny_1: { es:"Mizunoto", en:"Mizunoto", th:"มิซึโนโตะ", fr:"Mizunoto", vi:"Mizunoto", ja:"癸", zh:"癸" },
  badgeTier_kny_2: { es:"Cazademonios", en:"Demon Slayer", th:"นักล่าปีศาจ", fr:"Pourfendeur de Démons", vi:"Diệt Quỷ", ja:"鬼殺隊士", zh:"鬼杀队士" },
  badgeTier_kny_3: { es:"Luna Superior", en:"Upper Moon", th:"จันทร์ข้างขึ้นสูงสุด", fr:"Lune Supérieure", vi:"Thượng Huyền", ja:"上弦", zh:"上弦" },
  badgeTier_kny_4: { es:"Hashira", en:"Hashira", th:"ฮาชิระ", fr:"Hashira", vi:"Trụ Cột", ja:"柱", zh:"柱" },
  badgeTier_kny_5: { es:"Rey Demonio", en:"Demon King", th:"ราชาปีศาจ", fr:"Roi Démon", vi:"Quỷ Vương", ja:"鬼舞辻無惨", zh:"鬼王" },
  badgeTier_bleach_1: { es:"Sustituto", en:"Substitute", th:"ตัวแทน", fr:"Remplaçant", vi:"Người Thay Thế", ja:"代行", zh:"代理" },
  badgeTier_bleach_2: { es:"Shinigami", en:"Shinigami", th:"ชินิงามิ", fr:"Shinigami", vi:"Shinigami", ja:"死神", zh:"死神" },
  badgeTier_bleach_3: { es:"Espada", en:"Espada", th:"เอสปาดา", fr:"Espada", vi:"Espada", ja:"エスパーダ", zh:"十刃" },
  badgeTier_bleach_4: { es:"Resurrección", en:"Resurrección", th:"การคืนชีพ", fr:"Resurrección", vi:"Resurrección", ja:"レスレクシオン", zh:"卍解昇格" },
  badgeTier_bleach_5: { es:"Dios de la Traición", en:"God of Betrayal", th:"เทพแห่งการทรยศ", fr:"Dieu de la Trahison", vi:"Thần Phản Bội", ja:"裏切りの神", zh:"背叛之神" },
  close:            { es: "Cerrar",                  en: "Close",                        th: "ปิด" , fr: "Fermer" , vi: "Đóng" , ja: "閉じる", zh: "关闭" },
  yourPosition:     { es: "Tu posición",              en: "Your position",                th: "อันดับของคุณ" , fr: "Ta position" , vi: "Vị trí của bạn" , ja: "あなたの順位", zh: "你的排名" },
  myBadges:         { es: "Mis medallas",             en: "My badges",                    th: "เหรียญตราของฉัน" , fr: "Mes badges" , vi: "Huy hiệu của tôi" , ja: "マイバッジ", zh: "我的徽章" },
  maxLevelReached:  { es: "¡Nivel máximo!",           en: "Max level!",                    th: "ระดับสูงสุด!" , fr: "Niveau max !" , vi: "Cấp độ tối đa!" , ja: "最大レベル！", zh: "最高等级！" },
  toNextLevel:      { es: "para el siguiente nivel",  en: "to next level",                 th: "สู่ระดับถัดไป" , fr: "avant le niveau suivant" , vi: "để lên cấp tiếp theo" , ja: "次のレベルまで", zh: "距下一等级" },
  favSeries:      { es: "⭐ Series favoritas",    en: "⭐ Favourite series",          th: "⭐ ซีรีส์โปรด" , fr: "⭐ Séries favorites" , vi: "⭐ Series yêu thích" , ja: "⭐ お気に入りシリーズ", zh: "⭐ 喜爱系列" },
  noFavSeries:    { es: "Selecciona tus series favoritas para ver tus estadísticas.", en: "Select your favourite series to see your stats.", th: "เลือกซีรีส์โปรดเพื่อดูสถิติ" , fr: "Sélectionne tes séries favorites pour voir tes statistiques." , vi: "Chọn series yêu thích để xem thống kê." , ja: "お気に入りシリーズを選んで統計を確認しましょう。", zh: "选择您喜爱的系列以查看统计数据。" },
  statsTotalOwned:{ es: "Figuras obtenidas",      en: "Figures owned",               th: "ตัวเลขที่มี" , fr: "Figurines obtenues" , vi: "Nhân vật đã có" , ja: "所持フィギュア数", zh: "已拥有人偶" },
  statsTotalWish: { es: "En wishlist",            en: "In wishlist",                 th: "ในรายการ" , fr: "Désirée" , vi: "Trong danh sách" , ja: "ウィッシュリスト", zh: "愿望清单" },
  statsCompletion:{ es: "Completado",             en: "Completion",                  th: "ความสมบูรณ์" , fr: "Complété" , vi: "Hoàn thành" , ja: "コンプリート率", zh: "完成度" },
  selectFavTitle: { es: "Seleccionar series favoritas", en: "Select favourite series", th: "เลือกซีรีส์โปรด" , fr: "Sélectionner séries favorites" , vi: "Chọn series yêu thích" , ja: "お気に入りシリーズを選択", zh: "选择喜爱系列" },
  crossoverTitle: { es: "Figuras de otras series", en: "Figures from other series", th: "ตัวเลขจากซีรีส์อื่น" , fr: "Figurines d'autres séries" , vi: "Nhân vật từ series khác" , ja: "他シリーズのフィギュア", zh: "来自其他系列的人偶" },
  crossoverSub:   { es: "crossover",               en: "crossover",                 th: "ครอสโอเวอร์" , fr: "crossover" , vi: "crossover" , ja: "クロスオーバー", zh: "跨系列" },
  feedbackTitle:  { es: "💬 Sugerencias y errores", en: "💬 Feedback",              th: "💬 ข้อเสนอแนะ" , fr: "💬 Suggestions et erreurs" , vi: "💬 Góp ý và lỗi" , ja: "💬 ご意見・バグ報告", zh: "💬 建议与错误" },
  feedbackType:   { es: "Tipo",                     en: "Type",                      th: "ประเภท" , fr: "Type" , vi: "Loại" , ja: "種類", zh: "类型" },
  feedbackTypeBug:{ es: "🐛 Error / Fallo",         en: "🐛 Bug / Issue",            th: "🐛 ข้อผิดพลาด" , fr: "🐛 Bug / Erreur" , vi: "🐛 Lỗi" , ja: "🐛 バグ", zh: "🐛 错误" },
  feedbackTypeSug:{ es: "💡 Sugerencia",            en: "💡 Suggestion",             th: "💡 ข้อเสนอแนะ" , fr: "💡 Suggestion" , vi: "💡 Góp ý" , ja: "💡 提案", zh: "💡 建议" },
  feedbackTypeOth:{ es: "💬 Otro",                  en: "💬 Other",                  th: "💬 อื่นๆ" , fr: "💬 Autre" , vi: "💬 Khác" , ja: "💬 その他", zh: "💬 其他" },
  feedbackMsg:    { es: "Mensaje",                  en: "Message",                   th: "ข้อความ" , fr: "Message" , vi: "Tin nhắn" , ja: "メッセージ", zh: "消息" },
  feedbackPH:     { es: "Describe el error o sugerencia...", en: "Describe the issue or suggestion...", th: "อธิบายปัญหาหรือข้อเสนอแนะ..." , fr: "Décris le problème ou la suggestion..." , vi: "Mô tả vấn đề hoặc góp ý..." , ja: "問題や提案を説明してください...", zh: "描述问题或建议..." },
  feedbackSend:   { es: "Enviar",                   en: "Send",                      th: "ส่ง" , fr: "Envoyer" , vi: "Gửi" , ja: "送信", zh: "发送" },
  feedbackOk:     { es: "¡Gracias! Tu mensaje ha sido enviado.", en: "Thanks! Your message has been sent.", th: "ขอบคุณ! ส่งข้อความแล้ว" , fr: "Merci ! Ton message a été envoyé." , vi: "Cảm ơn! Tin nhắn của bạn đã được gửi." , ja: "ありがとうございます！メッセージが送信されました。", zh: "感谢！您的消息已发送。" },
  iosBanner:      { es: "¿iPhone o iPad? Abre en Safari → pulsa ⬆️ → Añadir a pantalla de inicio", en: "iPhone or iPad? Open in Safari → tap ⬆️ → Add to Home Screen", fr: "iPhone ou iPad ? Ouvre dans Safari → tape ⬆️ → Sur l'écran d'accueil", vi: "iPhone hoặc iPad? Mở trong Safari → nhấn ⬆️ → Thêm vào màn hình chính", ja: "iPhoneまたはiPadの場合：Safariで開き⬆️→「ホーム画面に追加」", zh: "iPhone或iPad用户：在Safari中打开→点击⬆️→添加到主屏幕", th: "iPhone หรือ iPad? เปิดใน Safari → แตะ ⬆️ → เพิ่มไปที่หน้าจอหลัก" },
  emptyColTitle:  { es: "Tu colección está vacía",      en: "Your collection is empty",       th: "คอลเลกชันของคุณว่างเปล่า", fr: "Ta collection est vide",           vi: "Bộ sưu tập của bạn trống" , ja: "コレクションが空です", zh: "您的收藏是空的" },
  emptyColDesc:   { es: "¡Explora el catálogo y marca las figuras que tienes!", en: "Explore the catalogue and mark the figures you own!", th: "สำรวจแคตตาล็อกและทำเครื่องหมายตัวเลขที่คุณมี!", fr: "Explore le catalogue et marque les figurines que tu as !", vi: "Khám phá danh mục và đánh dấu các nhân vật bạn có!" , ja: "カタログを探索して所持フィギュアにチェックしましょう！", zh: "探索目录并标记您拥有的人偶！" },
  emptyColBtn:    { es: "→ Ir al Catálogo",             en: "→ Go to Catalogue",              th: "→ ไปที่แคตตาล็อก", fr: "→ Aller au Catalogue",             vi: "→ Đến Danh mục" , ja: "→ カタログへ", zh: "→ 前往目录" },
  communityTitle: { es: "Comunidad",              en: "Community",                   th: "ชุมชน" , fr: "Communauté" , vi: "Cộng đồng" , ja: "コミュニティ", zh: "社区" },
  communityUsers: { es: "Coleccionistas",          en: "Collectors",                  th: "นักสะสม" , fr: "Collectionneurs" , vi: "Người sưu tập" , ja: "コレクター", zh: "收藏家" },
  communityFigs:  { es: "Figuras obtenidas",       en: "Figures owned",               th: "ตัวเลขที่มี" , fr: "Figurines obtenues" , vi: "Nhân vật đã có" , ja: "所持フィギュア数", zh: "已拥有人偶" },
  onboardTitle:   { es: "¡Bienvenido a WCF Checklist!", en: "Welcome to WCF Checklist!", th: "ยินดีต้อนรับสู่ WCF Checklist!" , fr: "Bienvenue sur WCF Checklist !" , vi: "Chào mừng đến WCF Checklist!" , ja: "WCF チェックリストへようこそ！", zh: "欢迎来到WCF收藏清单！" },
  onboardDesc:    { es: "El lugar para gestionar tu colección de World Collectable Figures. Explora el catálogo, marca tus figuras y lleva el control de tu wishlist.", en: "The place to manage your World Collectable Figure collection. Browse the catalogue, mark your figures and track your wishlist.", th: "สถานที่จัดการคอลเลกชัน World Collectable Figure ของคุณ" , fr: "L'endroit pour gérer ta collection de World Collectable Figures. Parcours le catalogue, marque tes figurines et suis ta wishlist." , vi: "Nơi quản lý bộ sưu tập World Collectable Figure của bạn. Duyệt danh mục, đánh dấu nhân vật và theo dõi danh sách yêu thích." , ja: "ワールドコレクタブルフィギュアのコレクションを管理する場所。カタログを閲覧し、フィギュアにチェックしてウィッシュリストを追跡しましょう。", zh: "管理您的世界收藏人偶收藏。浏览目录，标记您拥有的人偶，追踪您的愿望清单。" },
  onboardLogin:   { es: "Iniciar sesión con Google", en: "Sign in with Google",        th: "เข้าสู่ระบบด้วย Google" , fr: "Se connecter avec Google" , vi: "Đăng nhập bằng Google" , ja: "Googleでログイン", zh: "使用Google登录" },
  onboardGuest:   { es: "Explorar sin cuenta",     en: "Explore without account",     th: "เรียกดูโดยไม่มีบัญชี" , fr: "Explorer sans compte" , vi: "Khám phá không cần tài khoản" , ja: "アカウントなしで探索", zh: "无账户浏览" },
  onboardNote:    { es: "Con cuenta, tu colección se guarda y sincroniza entre dispositivos.", en: "With an account, your collection is saved and synced across devices.", th: "ด้วยบัญชี คอลเลกชันของคุณจะถูกบันทึกและซิงค์" , fr: "Avec un compte, ta collection est sauvegardée et synchronisée entre appareils." , vi: "Với tài khoản, bộ sưu tập của bạn được lưu và đồng bộ giữa các thiết bị." , ja: "アカウントがあれば、コレクションが保存されてデバイス間で同期されます。", zh: "有了账户，您的收藏将在设备间保存和同步。" },
  onboardIos:     { es: "En iPhone: pulsa el botón compartir (⬆️) en Safari y selecciona 'Añadir a pantalla de inicio'.", en: "On iPhone: tap the share button (⬆️) in Safari and select 'Add to Home Screen'.", th: "บน iPhone: แตะปุ่มแชร์ (⬆️) ใน Safari แล้วเลือก 'เพิ่มไปที่หน้าจอหลัก'" , fr: "Sur iPhone : appuie sur le bouton partager (⬆️) dans Safari et sélectionne 'Sur l'écran d'accueil'." , vi: "Trên iPhone: nhấn nút chia sẻ (⬆️) trong Safari và chọn 'Thêm vào màn hình chính'." , ja: "iPhoneの場合：Safariで共有ボタン（⬆️）をタップし、「ホーム画面に追加」を選択してください。", zh: "iPhone用户：在Safari中点击分享按钮（⬆️），选择\"添加到主屏幕\"。" },
  installBanner:  { es: "Instala WCF Checklist en tu dispositivo", en: "Install WCF Checklist on your device", th: "ติดตั้ง WCF Checklist บนอุปกรณ์ของคุณ" , fr: "Installe WCF Checklist sur ton appareil" , vi: "Cài đặt WCF Checklist trên thiết bị của bạn" , ja: "WCF チェックリストをデバイスにインストール", zh: "在您的设备上安装WCF收藏清单" },
  installBtn:     { es: "Instalar",                en: "Install",                     th: "ติดตั้ง" , fr: "Installer" , vi: "Cài đặt" , ja: "インストール", zh: "安装" },
  signIn:         { es: "Iniciar sesión",          en: "Sign in",                     th: "เข้าสู่ระบบ" , fr: "Se connecter" , vi: "Đăng nhập" , ja: "ログイン", zh: "登录" },
  signInGoogle:   { es: "Continuar con Google",    en: "Continue with Google",        th: "ดำเนินการต่อด้วย Google" , fr: "Continuer avec Google" , vi: "Tiếp tục với Google" , ja: "Googleで続ける", zh: "使用Google继续" },
  redirecting:    { es: "Redirigiendo…",           en: "Redirecting…",                th: "กำลังเปลี่ยนเส้นทาง…" , fr: "Redirection…" , vi: "Đang chuyển hướng…" , ja: "リダイレクト中…", zh: "正在跳转…" },
  signOut:        { es: "Cerrar sesión",          en: "Sign out",                    th: "ออกจากระบบ" , fr: "Se déconnecter" , vi: "Đăng xuất" , ja: "ログアウト", zh: "退出登录" },
  signInToMark:   { es: "Inicia sesión para marcar figuras", en: "Sign in to mark figures", th: "เข้าสู่ระบบเพื่อทำเครื่องหมาย" , fr: "Connecte-toi pour marquer des figurines" , vi: "Đăng nhập để đánh dấu nhân vật" , ja: "フィギュアにチェックするにはログインしてください", zh: "请登录以标记人偶" },
  guestMode:      { es: "Modo invitado",          en: "Guest mode",                  th: "โหมดผู้เยี่ยมชม" , fr: "Mode invité" , vi: "Chế độ khách" , ja: "ゲストモード", zh: "访客模式" },
  communityOwnLabel:   { es: "coleccionistas la tienen", en: "collectors own this", th: "นักสะสมมีตัวนี้", fr: "collectionneurs l'ont", vi: "nhà sưu tầm sở hữu", ja: "コレクターが所持", zh: "收藏家拥有" },
  communityWishLabel:  { es: "en wishlists", en: "on wishlists", th: "ในรายการปรารถนา", fr: "en liste de souhaits", vi: "trong danh sách yêu thích", ja: "ウィッシュリストに登録", zh: "在愿望清单中" },
  figureOwnedBtn:      { es: "✓ Obtenida", en: "✓ Owned", th: "✓ มีแล้ว", fr: "✓ Possédée", vi: "✓ Đã có", ja: "✓ 所持済み", zh: "✓ 已拥有" },
  figureMarkOwnedBtn:  { es: "Marcar como obtenida", en: "Mark as owned", th: "ทำเครื่องหมายว่ามีแล้ว", fr: "Marquer comme possédée", vi: "Đánh dấu đã có", ja: "所持済みにする", zh: "标记为已拥有" },
  communityPhotosHeader: {
    es: (n: number) => `📸 Fotos de la comunidad (${n})`,
    en: (n: number) => `📸 Community photos (${n})`,
    th: (n: number) => `📸 รูปภาพจากชุมชน (${n})`,
    fr: (n: number) => `📸 Photos de la communauté (${n})`,
    vi: (n: number) => `📸 Ảnh từ cộng đồng (${n})`,
    ja: (n: number) => `📸 コミュニティの写真 (${n})`,
    zh: (n: number) => `📸 社区照片 (${n})`,
  },
  photoSubmitted:      { es: "✅ ¡Foto enviada! Aparecerá tras revisarla.", en: "✅ Photo submitted! It will appear after review.", th: "✅ ส่งรูปภาพแล้ว! จะปรากฏหลังตรวจสอบ", fr: "✅ Photo envoyée ! Elle apparaîtra après validation.", vi: "✅ Đã gửi ảnh! Ảnh sẽ hiện sau khi được duyệt.", ja: "✅ 写真を送信しました！審査後に表示されます。", zh: "✅ 照片已提交！审核后将会显示。" },
  sharePhotoPrompt:    { es: "Comparte tu foto de esta figura:", en: "Share your photo of this figure:", th: "แชร์รูปตัวเลขนี้ของคุณ:", fr: "Partage ta photo de cette figurine :", vi: "Chia sẻ ảnh của nhân vật này:", ja: "このフィギュアの写真をシェア：", zh: "分享你这个人偶的照片：" },
  galleryBtn:          { es: "🖼️ Galería", en: "🖼️ Gallery", th: "🖼️ แกลเลอรี", fr: "🖼️ Galerie", vi: "🖼️ Thư viện", ja: "🖼️ ギャラリー", zh: "🖼️ 相册" },
  cameraBtn:           { es: "📷 Cámara", en: "📷 Camera", th: "📷 กล้อง", fr: "📷 Appareil photo", vi: "📷 Máy ảnh", ja: "📷 カメラ", zh: "📷 相机" },
  photosReviewedNote:  { es: "Las fotos se revisan antes de publicarse", en: "Photos are reviewed before appearing", th: "รูปภาพจะถูกตรวจสอบก่อนแสดง", fr: "Les photos sont vérifiées avant publication", vi: "Ảnh sẽ được duyệt trước khi hiển thị", ja: "写真は表示前に審査されます", zh: "照片在显示前会经过审核" },
  uploadNetworkError:  { es: "Error de red al subir. Inténtalo de nuevo.", en: "Network error while uploading. Try again.", th: "เกิดข้อผิดพลาดเครือข่ายขณะอัปโหลด ลองใหม่อีกครั้ง", fr: "Erreur réseau lors de l'envoi. Réessaie.", vi: "Lỗi mạng khi tải lên. Vui lòng thử lại.", ja: "アップロード中にネットワークエラーが発生しました。再試行してください。", zh: "上传时发生网络错误，请重试。" },
  loginToSharePhoto:   { es: "Inicia sesión para compartir tu foto de esta figura", en: "Log in to share your photo of this figure", th: "เข้าสู่ระบบเพื่อแชร์รูปตัวเลขนี้", fr: "Connecte-toi pour partager ta photo de cette figurine", vi: "Đăng nhập để chia sẻ ảnh của nhân vật này", ja: "ログインしてこのフィギュアの写真をシェア", zh: "登录以分享你这个人偶的照片" },
  orContinueWithEmail: { es: "o continúa con tu email", en: "or continue with email", th: "หรือดำเนินการต่อด้วยอีเมล", fr: "ou continue avec ton email", vi: "hoặc tiếp tục bằng email", ja: "またはメールで続ける", zh: "或使用邮箱继续" },
  continueWithEmail: { es: "Continuar con email", en: "Continue with email", th: "ดำเนินการต่อด้วยอีเมล", fr: "Continuer avec l'email", vi: "Tiếp tục bằng email", ja: "メールで続ける", zh: "使用邮箱继续" },
  backToOptions: { es: "Volver", en: "Back", th: "กลับ", fr: "Retour", vi: "Quay lại", ja: "戻る", zh: "返回" },
  emailPlaceholder:    { es: "Tu dirección de email", en: "Your email address", th: "ที่อยู่อีเมลของคุณ", fr: "Ton adresse email", vi: "Địa chỉ email của bạn", ja: "メールアドレス", zh: "你的邮箱地址" },
  sendMagicLink:       { es: "📧 Enviar enlace de acceso", en: "📧 Send login link", th: "📧 ส่งลิงก์เข้าสู่ระบบ", fr: "📧 Envoyer le lien de connexion", vi: "📧 Gửi liên kết đăng nhập", ja: "📧 ログインリンクを送信", zh: "📧 发送登录链接" },
  sendingLink:         { es: "Enviando...", en: "Sending...", th: "กำลังส่ง...", fr: "Envoi...", vi: "Đang gửi...", ja: "送信中...", zh: "发送中..." },
  magicLinkSent:       { es: "✅ Revisa tu correo: te hemos enviado un enlace para entrar.", en: "✅ Check your email: we've sent you a login link.", th: "✅ ตรวจสอบอีเมลของคุณ: เราได้ส่งลิงก์เข้าสู่ระบบให้แล้ว", fr: "✅ Vérifie tes emails : on t'a envoyé un lien de connexion.", vi: "✅ Kiểm tra email của bạn: chúng tôi đã gửi liên kết đăng nhập.", ja: "✅ メールをご確認ください：ログインリンクを送信しました。", zh: "✅ 请查收邮箱：我们已发送登录链接。" },
  invalidEmail:        { es: "Introduce un email válido", en: "Enter a valid email", th: "กรุณากรอกอีเมลที่ถูกต้อง", fr: "Entre un email valide", vi: "Nhập email hợp lệ", ja: "有効なメールアドレスを入力してください", zh: "请输入有效邮箱" },
  chooseNameTitle:     { es: "Elige un nombre público", en: "Choose a display name", th: "เลือกชื่อที่แสดงต่อสาธารณะ", fr: "Choisis un nom public", vi: "Chọn tên hiển thị", ja: "表示名を選んでください", zh: "选择一个公开显示的名字" },
  chooseNameDesc:      { es: "Se mostrará en las fotos que compartas y en los rankings, en vez de tu email.", en: "This will show on photos you share and on rankings, instead of your email.", th: "จะแสดงบนรูปภาพที่คุณแชร์และในการจัดอันดับ แทนอีเมลของคุณ", fr: "Il apparaîtra sur les photos que tu partages et dans les classements, à la place de ton email.", vi: "Tên này sẽ hiển thị trên ảnh bạn chia sẻ và trong bảng xếp hạng, thay vì email của bạn.", ja: "共有した写真やランキングにメールアドレスの代わりに表示されます。", zh: "将显示在你分享的照片和排行榜上，而不是你的邮箱。" },
  namePlaceholder:     { es: "Tu nombre o apodo", en: "Your name or nickname", th: "ชื่อหรือชื่อเล่นของคุณ", fr: "Ton nom ou pseudo", vi: "Tên hoặc biệt danh của bạn", ja: "名前またはニックネーム", zh: "你的名字或昵称" },
  saveName:            { es: "Continuar", en: "Continue", th: "ดำเนินการต่อ", fr: "Continuer", vi: "Tiếp tục", ja: "続ける", zh: "继续" },
  nameRequired:        { es: "Escribe un nombre para continuar", en: "Enter a name to continue", th: "กรอกชื่อเพื่อดำเนินการต่อ", fr: "Entre un nom pour continuer", vi: "Nhập tên để tiếp tục", ja: "続けるには名前を入力してください", zh: "请输入名字以继续" },
  checkSpamNote:       { es: "¿No lo ves? Revisa también la carpeta de spam / no deseado.", en: "Don't see it? Check your spam / junk folder too.", th: "ไม่เห็นอีเมล? ลองตรวจสอบโฟลเดอร์สแปมด้วย", fr: "Tu ne le vois pas ? Vérifie aussi ton dossier spam.", vi: "Không thấy email? Hãy kiểm tra cả thư mục spam.", ja: "届かない場合は迷惑メールフォルダもご確認ください。", zh: "没收到？也请检查一下垃圾邮件文件夹。" },
  enterCodeTitle:      { es: "Introduce el código", en: "Enter the code", th: "กรอกรหัส", fr: "Entre le code", vi: "Nhập mã", ja: "コードを入力", zh: "输入验证码" },
  enterCodeDesc:       { es: (email: string) => `Hemos enviado un código de 6 dígitos a ${email}`, en: (email: string) => `We've sent a 6-digit code to ${email}`, th: (email: string) => `เราได้ส่งรหัส 6 หลักไปที่ ${email}`, fr: (email: string) => `On a envoyé un code à 6 chiffres à ${email}`, vi: (email: string) => `Chúng tôi đã gửi mã 6 chữ số đến ${email}`, ja: (email: string) => `${email} に6桁のコードを送信しました`, zh: (email: string) => `我们已向 ${email} 发送了6位数验证码` },
  codePlaceholder:     { es: "123456", en: "123456", th: "123456", fr: "123456", vi: "123456", ja: "123456", zh: "123456" },
  verifyCode:          { es: "Verificar código", en: "Verify code", th: "ยืนยันรหัส", fr: "Vérifier le code", vi: "Xác nhận mã", ja: "コードを確認", zh: "验证代码" },
  verifyingCode:       { es: "Verificando...", en: "Verifying...", th: "กำลังยืนยัน...", fr: "Vérification...", vi: "Đang xác nhận...", ja: "確認中...", zh: "验证中..." },
  invalidCode:         { es: "Código incorrecto o caducado. Inténtalo de nuevo.", en: "Incorrect or expired code. Try again.", th: "รหัสไม่ถูกต้องหรือหมดอายุ ลองใหม่อีกครั้ง", fr: "Code incorrect ou expiré. Réessaie.", vi: "Mã không đúng hoặc đã hết hạn. Vui lòng thử lại.", ja: "コードが正しくないか期限切れです。もう一度お試しください。", zh: "验证码错误或已过期，请重试。" },
  backToEmail:         { es: "← Usar otro email", en: "← Use a different email", th: "← ใช้อีเมลอื่น", fr: "← Utiliser un autre email", vi: "← Dùng email khác", ja: "← 別のメールを使う", zh: "← 使用其他邮箱" },
  resendCode:          { es: "Reenviar código", en: "Resend code", th: "ส่งรหัสอีกครั้ง", fr: "Renvoyer le code", vi: "Gửi lại mã", ja: "コードを再送信", zh: "重新发送验证码" },
  altVersionsLabel:    { es: "Otras versiones (opcional)", en: "Other versions (optional)", th: "เวอร์ชันอื่น (ไม่บังคับ)", fr: "Autres versions (facultatif)", vi: "Phiên bản khác (không bắt buộc)", ja: "他のバージョン（任意）", zh: "其他版本（可选）" },
  versionLabel:        { es: "Versión", en: "Version", th: "เวอร์ชัน", fr: "Version", vi: "Phiên bản", ja: "バージョン", zh: "版本" },
  addVersionBtn:       { es: "Añadir versión", en: "Add version", th: "เพิ่มเวอร์ชัน", fr: "Ajouter une version", vi: "Thêm phiên bản", ja: "バージョンを追加", zh: "添加版本" },
  altVersionsHint:     { es: "Para figuras con piezas intercambiables (ej. 2 cabezas). Aparecerán como botones A/B/C en la ficha.", en: "For figures with interchangeable parts (e.g. 2 heads). They'll appear as A/B/C buttons on the figure page.", th: "สำหรับฟิกเกอร์ที่มีชิ้นส่วนสลับได้ (เช่น 2 หัว) จะแสดงเป็นปุ่ม A/B/C ในหน้ารายละเอียด", fr: "Pour les figurines avec pièces interchangeables (ex. 2 têtes). Elles apparaîtront comme boutons A/B/C sur la fiche.", vi: "Dành cho mô hình có bộ phận thay thế (ví dụ 2 đầu). Sẽ hiện thành nút A/B/C trên trang chi tiết.", ja: "パーツ交換可能なフィギュア用（例：頭2種）。詳細ページにA/B/Cボタンとして表示されます。", zh: "适用于可更换部件的人偶（例如2个头）。将在详情页显示为A/B/C按钮。" },
  moveFigureBtn:       { es: "Mover a otro set", en: "Move to another set", th: "ย้ายไปยังชุดอื่น", fr: "Déplacer vers un autre set", vi: "Chuyển sang bộ khác", ja: "他のセットに移動", zh: "移动到其他套装" },
  moveFigureTitle:     { es: "Mover figura a...", en: "Move figure to...", th: "ย้ายฟิกเกอร์ไปที่...", fr: "Déplacer la figurine vers...", vi: "Chuyển mô hình đến...", ja: "フィギュアを移動...", zh: "将人偶移动到..." },
  moveFigureUngrouped: { es: "Sin grupo", en: "Ungrouped", th: "ไม่มีกลุ่ม", fr: "Sans groupe", vi: "Không nhóm", ja: "グループなし", zh: "未分组" },
  moveFigureDone:      { es: "Figura movida correctamente", en: "Figure moved successfully", th: "ย้ายฟิกเกอร์เรียบร้อยแล้ว", fr: "Figurine déplacée avec succès", vi: "Đã chuyển mô hình thành công", ja: "フィギュアを移動しました", zh: "人偶已成功移动" },
  myCollectionTitle:   { es: "Mi colección", en: "My collection", th: "คอลเลกชันของฉัน", fr: "Ma collection", vi: "Bộ sưu tập của tôi", ja: "マイコレクション", zh: "我的收藏" },
  myCollectionDesc:    { es: "Sube fotos de tu vitrina o tu colección para que otros coleccionistas las vean.", en: "Upload photos of your display case or collection for other collectors to see.", th: "อัปโหลดรูปตู้โชว์หรือคอลเลกชันของคุณให้นักสะสมคนอื่นเห็น", fr: "Ajoute des photos de ta vitrine ou de ta collection pour que les autres collectionneurs les voient.", vi: "Tải lên ảnh tủ trưng bày hoặc bộ sưu tập của bạn để người khác xem.", ja: "コレクションケースやコレクションの写真をアップロードして他のコレクターに見てもらいましょう。", zh: "上传你的展示柜或收藏照片，让其他收藏家看到。" },
  addCollectionPhoto:  { es: "+ Añadir foto", en: "+ Add photo", th: "+ เพิ่มรูปภาพ", fr: "+ Ajouter une photo", vi: "+ Thêm ảnh", ja: "+ 写真を追加", zh: "+ 添加照片" },
  collectionPhotoLimit:{ es: (n:number)=>`${n}/15 fotos`, en: (n:number)=>`${n}/15 photos`, th: (n:number)=>`${n}/15 รูป`, fr: (n:number)=>`${n}/15 photos`, vi: (n:number)=>`${n}/15 ảnh`, ja: (n:number)=>`${n}/15枚`, zh: (n:number)=>`${n}/15 张照片` },
  collectionLimitReached:{ es: "Has alcanzado el límite de 15 fotos. Borra alguna para subir otra.", en: "You've reached the 15-photo limit. Delete one to upload another.", th: "คุณถึงขีดจำกัด 15 รูปแล้ว ลบรูปใดรูปหนึ่งเพื่ออัปโหลดเพิ่ม", fr: "Tu as atteint la limite de 15 photos. Supprime-en une pour en ajouter une autre.", vi: "Bạn đã đạt giới hạn 15 ảnh. Xóa một ảnh để tải lên ảnh khác.", ja: "15枚の上限に達しました。追加するには削除してください。", zh: "已达到15张照片上限，请先删除一张再上传。" },
  pendingReviewLabel:  { es: "En revisión", en: "Under review", th: "กำลังตรวจสอบ", fr: "En cours de vérification", vi: "Đang chờ duyệt", ja: "審査中", zh: "审核中" },
  setAsCover:          { es: "Portada", en: "Cover", th: "ภาพปก", fr: "Couverture", vi: "Ảnh bìa", ja: "カバー", zh: "封面" },
  isCoverLabel:         { es: "✓ Portada", en: "✓ Cover", th: "✓ ภาพปก", fr: "✓ Couverture", vi: "✓ Ảnh bìa", ja: "✓ カバー", zh: "✓ 封面" },
  removePhotoConfirm:  { es: "¿Borrar esta foto?", en: "Delete this photo?", th: "ลบรูปนี้หรือไม่?", fr: "Supprimer cette photo ?", vi: "Xóa ảnh này?", ja: "この写真を削除しますか？", zh: "删除这张照片？" },
  myWcfOwnedTab:       { es: "✅ Obtenidas", en: "✅ Owned", th: "✅ มีแล้ว", fr: "✅ Possédées", vi: "✅ Đã có", ja: "✅ 所持済み", zh: "✅ 已拥有" },
  myWcfWishlistTab:    { es: "💛 Wishlist", en: "💛 Wishlist", th: "💛 รายการที่อยากได้", fr: "💛 Liste de souhaits", vi: "💛 Danh sách mong muốn", ja: "💛 ウィッシュリスト", zh: "💛 愿望清单" },
  collectionsTitle:    { es: "🖼️ Colecciones de la comunidad", en: "🖼️ Community collections", th: "🖼️ คอลเลกชันของชุมชน", fr: "🖼️ Collections de la communauté", vi: "🖼️ Bộ sưu tập cộng đồng", ja: "🖼️ コミュニティのコレクション", zh: "🖼️ 社区收藏" },
  noCollectionsYet:    { es: "Aún no hay colecciones compartidas. ¡Sé el primero!", en: "No shared collections yet. Be the first!", th: "ยังไม่มีคอลเลกชันที่แชร์ มาเป็นคนแรกสิ!", fr: "Pas encore de collections partagées. Sois le premier !", vi: "Chưa có bộ sưu tập nào được chia sẻ. Hãy là người đầu tiên!", ja: "まだ共有されたコレクションはありません。最初の投稿者になりましょう！", zh: "还没有人分享收藏，快来当第一个吧！" },
  backToCollections:   { es: "← Colecciones", en: "← Collections", th: "← คอลเลกชัน", fr: "← Collections", vi: "← Bộ sưu tập", ja: "← コレクション", zh: "← 收藏" },
  collectionOf:        { es: (name:string)=>`La colección de ${name}`, en: (name:string)=>`${name}'s collection`, th: (name:string)=>`คอลเลกชันของ ${name}`, fr: (name:string)=>`La collection de ${name}`, vi: (name:string)=>`Bộ sưu tập của ${name}`, ja: (name:string)=>`${name}のコレクション`, zh: (name:string)=>`${name}的收藏` },
  commentsTitle:       { es: (n:number)=>`${n} comentario${n===1?"":"s"}`, en: (n:number)=>`${n} comment${n===1?"":"s"}`, th: (n:number)=>`${n} ความคิดเห็น`, fr: (n:number)=>`${n} commentaire${n===1?"":"s"}`, vi: (n:number)=>`${n} bình luận`, ja: (n:number)=>`コメント${n}件`, zh: (n:number)=>`${n}条评论` },
  noCommentsYet:       { es: "Sé el primero en comentar", en: "Be the first to comment", th: "เป็นคนแรกที่แสดงความคิดเห็น", fr: "Sois le premier à commenter", vi: "Hãy là người đầu tiên bình luận", ja: "最初のコメントを投稿しよう", zh: "抢先评论吧" },
  addCommentPlaceholder: { es: "Añade un comentario…", en: "Add a comment…", th: "แสดงความคิดเห็น…", fr: "Ajoute un commentaire…", vi: "Thêm bình luận…", ja: "コメントを追加…", zh: "添加评论…" },
  loginToComment:      { es: "Inicia sesión para comentar", en: "Sign in to comment", th: "เข้าสู่ระบบเพื่อแสดงความคิดเห็น", fr: "Connecte-toi pour commenter", vi: "Đăng nhập để bình luận", ja: "コメントするにはログイン", zh: "登录后评论" },
  send:                { es: "Enviar", en: "Send", th: "ส่ง", fr: "Envoyer", vi: "Gửi", ja: "送信", zh: "发送" },
  deleteCommentAction: { es: "Eliminar", en: "Delete", th: "ลบ", fr: "Supprimer", vi: "Xóa", ja: "削除", zh: "删除" },
  translateAction:     { es: "Traducir", en: "Translate", th: "แปล", fr: "Traduire", vi: "Dịch", ja: "翻訳", zh: "翻译" },
  seeOriginalAction:   { es: "Ver original", en: "See original", th: "ดูต้นฉบับ", fr: "Voir l'original", vi: "Xem bản gốc", ja: "元のテキストを見る", zh: "查看原文" },
  translatingAction:   { es: "Traduciendo…", en: "Translating…", th: "กำลังแปล…", fr: "Traduction…", vi: "Đang dịch…", ja: "翻訳中…", zh: "翻译中…" },
  myCollectionMenuItem:{ es: "🖼️ Mi colección", en: "🖼️ My collection", th: "🖼️ คอลเลกชันของฉัน", fr: "🖼️ Ma collection", vi: "🖼️ Bộ sưu tập của tôi", ja: "🖼️ マイコレクション", zh: "🖼️ 我的收藏" },
  deleteBtn:           { es: "Borrar", en: "Delete", th: "ลบ", fr: "Supprimer", vi: "Xóa", ja: "削除", zh: "删除" },
  settingsMenuItem:    { es: "⚙️ Ajustes", en: "⚙️ Settings", th: "⚙️ ตั้งค่า", fr: "⚙️ Paramètres", vi: "⚙️ Cài đặt", ja: "⚙️ 設定", zh: "⚙️ 设置" },
  settingsTitle:       { es: "Ajustes de perfil", en: "Profile settings", th: "การตั้งค่าโปรไฟล์", fr: "Paramètres du profil", vi: "Cài đặt hồ sơ", ja: "プロフィール設定", zh: "个人资料设置" },
  displayNameLabel:    { es: "Nombre público", en: "Display name", th: "ชื่อที่แสดง", fr: "Nom public", vi: "Tên hiển thị", ja: "表示名", zh: "显示名称" },
  avatarLabel:         { es: "Foto de perfil", en: "Profile photo", th: "รูปโปรไฟล์", fr: "Photo de profil", vi: "Ảnh đại diện", ja: "プロフィール写真", zh: "头像" },
  changeAvatarBtn:     { es: "Cambiar foto", en: "Change photo", th: "เปลี่ยนรูป", fr: "Changer la photo", vi: "Đổi ảnh", ja: "写真を変更", zh: "更换照片" },
  removeAvatarBtn:     { es: "Quitar foto", en: "Remove photo", th: "ลบรูป", fr: "Retirer la photo", vi: "Xóa ảnh", ja: "写真を削除", zh: "移除照片" },
  saveSettings:        { es: "Guardar cambios", en: "Save changes", th: "บันทึกการเปลี่ยนแปลง", fr: "Enregistrer", vi: "Lưu thay đổi", ja: "変更を保存", zh: "保存更改" },
  settingsSaved:       { es: "✅ Cambios guardados", en: "✅ Changes saved", th: "✅ บันทึกการเปลี่ยนแปลงแล้ว", fr: "✅ Modifications enregistrées", vi: "✅ Đã lưu thay đổi", ja: "✅ 変更を保存しました", zh: "✅ 更改已保存" },
  shareCollectionBtn: { es: "🔗 Compartir mi colección", en: "🔗 Share my collection", th: "🔗 แชร์คอลเลกชันของฉัน", fr: "🔗 Partager ma collection", vi: "🔗 Chia sẻ bộ sưu tập", ja: "🔗 コレクションをシェア", zh: "🔗 分享我的收藏" },
  shareCollectionText: { es: (name:string)=>`¡Mira la colección de figuras WCF de ${name}!`, en: (name:string)=>`Check out ${name}'s WCF figure collection!`, th: (name:string)=>`ดูคอลเลกชันฟิกเกอร์ WCF ของ ${name}!`, fr: (name:string)=>`Découvre la collection de figurines WCF de ${name} !`, vi: (name:string)=>`Xem bộ sưu tập mô hình WCF của ${name}!`, ja: (name:string)=>`${name}のWCFフィギュアコレクションをチェック！`, zh: (name:string)=>`快来看看${name}的WCF人偶收藏吧！` },
  shareLinkCopied:     { es: "✅ Enlace copiado al portapapeles", en: "✅ Link copied to clipboard", th: "✅ คัดลอกลิงก์แล้ว", fr: "✅ Lien copié", vi: "✅ Đã sao chép liên kết", ja: "✅ リンクをコピーしました", zh: "✅ 链接已复制" },
  publicCollectionNotFound: { es: "No se ha encontrado esta colección o no tiene fotos públicas.", en: "This collection wasn't found or has no public photos.", th: "ไม่พบคอลเลกชันนี้หรือไม่มีรูปภาพสาธารณะ", fr: "Cette collection est introuvable ou n'a pas de photos publiques.", vi: "Không tìm thấy bộ sưu tập này hoặc chưa có ảnh công khai.", ja: "このコレクションが見つからないか、公開写真がありません。", zh: "未找到此收藏，或没有公开照片。" },
  goToApp:             { es: "Ir a WCF Checklist →", en: "Go to WCF Checklist →", th: "ไปที่ WCF Checklist →", fr: "Aller sur WCF Checklist →", vi: "Đến WCF Checklist →", ja: "WCF Checklistへ →", zh: "前往 WCF Checklist →" },
  likesCount:          { es: (n:number)=>`${n}`, en: (n:number)=>`${n}`, th: (n:number)=>`${n}`, fr: (n:number)=>`${n}`, vi: (n:number)=>`${n}`, ja: (n:number)=>`${n}`, zh: (n:number)=>`${n}` },
} as const;

type TKey = keyof typeof T;
const LangCtx = createContext<{ t: (key: TKey, ...args: unknown[]) => string; lang: LangCode }>({
  t: (key) => key as string, lang: "es",
});
function LangProvider({ value, children }: { value: { t: (key: TKey, ...args: unknown[]) => string; lang: LangCode }; children: React.ReactNode }) {
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}
const useTr = () => useContext(LangCtx);

const AdminCtx = createContext(false);
const useAdmin = () => useContext(AdminCtx);

const UserInfoCtx = createContext<{email:string|null; name:string|null; avatar:string|null}>({email:null, name:null, avatar:null});
const useUserInfo = () => useContext(UserInfoCtx);

const SeriesDataCtx = createContext<Series[]>([]);
const useSeriesData = () => useContext(SeriesDataCtx);

// Global drag context for cross-set image swapping
type DragFigure = { figureId: number; image: string };
const DragCtx = createContext<{
  dragging: DragFigure|null;
  setDragging: (f:DragFigure|null)=>void;
}>({ dragging: null, setDragging: ()=>{} });
const useDragCtx = () => useContext(DragCtx);

function useLang() {
  const [lang, setLang] = useState<LangCode>(() => (localStorage.getItem("wcf_lang") as LangCode) ?? "en");
  const saveLang = (l: LangCode) => { setLang(l); localStorage.setItem("wcf_lang", l); };
  const t = (key: TKey, ...args: unknown[]): string => {
    const entry = T[key] as Record<LangCode, unknown>;
    const val = entry[lang];
    if (typeof val === "function") return (val as (...a: unknown[]) => string)(...args);
    if (Array.isArray(val)) return (val as string[]).join(",");
    return val as string;
  };
  return { lang, setLang: saveLang, t };
}

// ============================================================
//  TYPES
// ============================================================
type CategoryType = "oficial" | "resina";
interface Figure { id: number; name: string; emoji: string; image?: string; tags?: string; altImages?: string[]; }
interface FigureSet { id: number; name: string; releaseDate?: string; seriesLogo?: string; figures: Figure[]; }
interface FigureGroup { id: number; name: string; logo?: string; sets: FigureSet[]; }
interface Series { id: number; name: string; emoji: string; logo?: string; logoHeader?: string; bgImage?: string; color: string; category: CategoryType; sets: FigureSet[]; groups: FigureGroup[]; }

// ============================================================
//  INITIAL DATA
// ============================================================
const INITIAL_DATA: Series[] = [
  { id: 1, name: "Dragon Ball", emoji: "🐉", color: "#f97316", category: "oficial", groups: [], sets: [
    { id: 101, name: "Extra Costume Vol. 1", releaseDate: "2021-09", figures: [
      { id: 10101, name: "Goku SSJ", emoji: "🟠", image: "" },
      { id: 10102, name: "Gohan SSJ", emoji: "🟡", image: "" },
      { id: 10103, name: "Trunks", emoji: "💜", image: "" },
      { id: 10104, name: "Vegeta", emoji: "🔵", image: "" },
      { id: 10105, name: "Goku (chaqueta)", emoji: "🟠", image: "" },
      { id: 10106, name: "Goku (dogi)", emoji: "🟠", image: "" },
    ]},
  ]},
  { id: 2, name: "Hunter x Hunter", emoji: "🎯", color: "#8b5cf6", category: "oficial", groups: [], sets: [
    { id: 201, name: "Vol. 1", figures: [
      { id: 20101, name: "Gon", emoji: "🟢", image: "" },
      { id: 20102, name: "Killua", emoji: "⚪", image: "" },
      { id: 20103, name: "Kurapika", emoji: "🔴", image: "" },
      { id: 20104, name: "Leorio", emoji: "🔵", image: "" },
      { id: 20105, name: "Hisoka", emoji: "🃏", image: "" },
      { id: 20106, name: "Illumi", emoji: "🖤", image: "" },
    ]},
  ]},
  { id: 3, name: "My Hero Academia", emoji: "💥", color: "#ef4444", category: "oficial", groups: [], sets: [
    { id: 301, name: "Vol. 1", figures: [
      { id: 30101, name: "Deku", emoji: "💚", image: "" },
      { id: 30102, name: "Bakugo", emoji: "💥", image: "" },
      { id: 30103, name: "Todoroki", emoji: "🔥", image: "" },
      { id: 30104, name: "All Might", emoji: "💪", image: "" },
      { id: 30105, name: "Uraraka", emoji: "🩷", image: "" },
      { id: 30106, name: "Iida", emoji: "⚙️", image: "" },
    ]},
  ]},
  { id: 4, name: "Kimetsu no Yaiba", emoji: "🗡️", color: "#06b6d4", category: "oficial", groups: [], sets: [
    { id: 401, name: "Vol. 1", figures: [
      { id: 40101, name: "Tanjiro", emoji: "🟢", image: "" },
      { id: 40102, name: "Nezuko", emoji: "🩷", image: "" },
      { id: 40103, name: "Zenitsu", emoji: "🟡", image: "" },
      { id: 40104, name: "Inosuke", emoji: "🐗", image: "" },
      { id: 40105, name: "Giyu", emoji: "🔵", image: "" },
      { id: 40106, name: "Shinobu", emoji: "🦋", image: "" },
    ]},
  ]},
  { id: 5, name: "One Piece", emoji: "☠️", color: "#eab308", category: "oficial", groups: [], sets: [
    { id: 501, name: "Mugiwara Vol. 1", figures: [
      { id: 50101, name: "Luffy", emoji: "👒", image: "" },
      { id: 50102, name: "Zoro", emoji: "🗡️", image: "" },
      { id: 50103, name: "Nami", emoji: "🍊", image: "" },
      { id: 50104, name: "Usopp", emoji: "🎯", image: "" },
      { id: 50105, name: "Sanji", emoji: "🦵", image: "" },
      { id: 50106, name: "Chopper", emoji: "🦌", image: "" },
    ]},
  ]},
  { id: 6, name: "Dragon Ball (Resina)", emoji: "🐉", color: "#b45309", category: "resina", groups: [], sets: [
    { id: 601, name: "Ejemplo Estudio Vol. 1", figures: [
      { id: 60101, name: "Goku Ultra Instinct", emoji: "⚪", image: "" },
      { id: 60102, name: "Vegeta Blue", emoji: "🔵", image: "" },
      { id: 60103, name: "Broly DBS", emoji: "💚", image: "" },
    ]},
  ]},
];

const SERIES_COLORS = ["#f97316","#8b5cf6","#ef4444","#06b6d4","#eab308","#0174b0","#e11d48","#0ea5e9","#84cc16","#f43f5e","#b45309","#7c3aed","#0891b2","#dc2626"];
const EMOJIS = ["⭐","🔥","💥","🎯","🐉","☠️","🗡️","💜","🟢","🔵","🟡","🟠","🟣","⚡","💚","🩷","🖤","⚪","🃏","🐗","👒","🦌","💪","🦋","🎭","👑","🌸","🦊","🐺","🏮"];
let _idCounter = Date.now();
function newId() { return ++_idCounter; }

// Convierte un Blob/File a un string base64 puro (sin el prefijo "data:...;base64,")
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function uploadToR2(blob: Blob | File): Promise<string> {
  const contentType = (blob as File).type || "image/jpeg";
  const imageBase64 = await blobToBase64(blob);

  // Subimos la imagen a través de nuestro propio backend (Vercel),
  // que la reenvía a Cloudflare R2 desde el servidor. Así el navegador
  // del usuario nunca tiene que hablar directamente con el dominio
  // genérico de R2 (r2.cloudflarestorage.com), que puede ser inestable
  // o estar bloqueado en algunos países (igual que pasaba con *.vercel.app).
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, imageBase64 }),
  });
  if (!res.ok) throw new Error("Error subiendo la imagen");
  const { publicUrl } = await res.json();
  return publicUrl as string;
}

// Redimensiona/comprime una imagen antes de subirla, para que las fotos
// que la gente sube desde la cámara del móvil (que pueden pesar varios MB)
// no se acerquen al límite de la función serverless ni tarden de más en subir.
function compressImageForUpload(file: File, maxDimension = 1280, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Error loading image")); };
    img.src = url;
  });
}

// ImgBB key from environment variable (set in Vercel dashboard)
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY as string ?? "";

// ============================================================
//  HOOKS
// ============================================================
// ============================================================
//  SUPABASE AUTH CLIENT
// ============================================================
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type AuthUser = { id: string; email?: string; name?: string; avatar?: string };

function useAuth() {
  const [user, setUser] = useState<AuthUser|null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      }
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Guard contra doble disparo: sin esto, un usuario que pulsa el botón
  // de Google varias veces seguidas (p.ej. en móvil con red lenta, mientras
  // espera a que aparezca la redirección) dispara múltiples peticiones
  // /authorize en paralelo, ninguna de las cuales llega a completarse
  // (visto en los logs de Supabase: 6 intentos en <90s, sin login exitoso).
  const googleSignInInFlight = useRef(false);
  const signInWithGoogle = async () => {
    if (googleSignInInFlight.current) return { error: null };
    googleSignInInFlight.current = true;
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    // Si signInWithOAuth devuelve error (en vez de redirigir), liberamos el
    // guard para permitir reintentar. Si tiene éxito, la página va a
    // navegar fuera de la app en breve, así que no hace falta liberarlo.
    if (result.error) googleSignInInFlight.current = false;
    return result;
  };
  const signInWithEmail = (email: string) => supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });
  const verifyEmailCode = (email: string, token: string) => supabase.auth.verifyOtp({
    email, token, type: "email"
  });
  const updateName = async (name: string) => {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (!error) setUser(u => u ? { ...u, name } : u);
    return { error };
  };
  const updateAvatar = async (avatarUrl: string | null) => {
    const { error } = await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
    if (!error) setUser(u => u ? { ...u, avatar: avatarUrl ?? undefined } : u);
    return { error };
  };
  const signOut = () => supabase.auth.signOut();

  return { user, authReady, signInWithGoogle, signInWithEmail, verifyEmailCode, updateName, updateAvatar, signOut };
}

function useOwned(userId: string|null, userName?: string|null, userEmail?: string|null, userAvatar?: string|null) {
  const [owned, setOwned] = useState<Set<number>>(new Set());
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const [lastSeenAnnouncementId, setLastSeenAnnouncementId] = useState<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (userId) {
      supabase.from("wcf_progress").select("owned,wishlist,favourites,last_seen_announcement_id").eq("user_id", userId).maybeSingle()
        .then(({ data, error }) => {
          if (error) console.error("Load error:", error);
          if (data) {
            if (data.owned?.length > 0) setOwned(new Set(data.owned));
            if (data.wishlist?.length > 0) setWishlist(new Set(data.wishlist));
            if (data.favourites?.length > 0) setFavourites(new Set(data.favourites));
            setLastSeenAnnouncementId(data.last_seen_announcement_id ?? 0);
          } else {
            try {
              const o = JSON.parse(localStorage.getItem("wcf_owned") ?? "[]");
              const w = JSON.parse(localStorage.getItem("wcf_wishlist") ?? "[]");
              setOwned(new Set(o)); setWishlist(new Set(w));
              if (o.length > 0 || w.length > 0) {
                supabase.from("wcf_progress").upsert({
                  user_id: userId, owned: o, wishlist: w,
                  owner_name: userName ?? null, owner_email: userEmail ?? null, owner_avatar: userAvatar ?? null,
                  updated_at: new Date().toISOString()
                }, { onConflict: "user_id", ignoreDuplicates: false });
              }
            } catch {}
          }
          setReady(true);
        });
    } else {
      try {
        const o = JSON.parse(localStorage.getItem("wcf_owned") ?? "[]");
        const w = JSON.parse(localStorage.getItem("wcf_wishlist") ?? "[]");
        setOwned(new Set(o)); setWishlist(new Set(w));
      } catch {}
      setReady(true);
    }
  }, [userId]);

  const saveProgress = useCallback((o: Set<number>, w: Set<number>) => {
    if (userId) {
      supabase.from("wcf_progress")
        .upsert({
          user_id: userId,
          owned: [...o],
          wishlist: [...w],
          owner_name: userName ?? null,
          owner_email: userEmail ?? null,
          owner_avatar: userAvatar ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id", ignoreDuplicates: false })
        .then(({ error }) => { if (error) console.error("Save error:", error); });
    }
    // Always save to localStorage as fallback
    localStorage.setItem("wcf_owned", JSON.stringify([...o]));
    localStorage.setItem("wcf_wishlist", JSON.stringify([...w]));
  }, [userId, userName, userEmail, userAvatar]);

  const toggle = (id: number) => setOwned(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id);
    saveProgress(n, wishlist); return n;
  });
  const toggleWish = (id: number) => setWishlist(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id);
    saveProgress(owned, n); return n;
  });

  const toggleFavourite = (id: number) => setFavourites(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id);
    localStorage.setItem("wcf_favourites", JSON.stringify([...n]));
    if (userId) supabase.from("wcf_progress")
      .update({ favourites: [...n], updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .then(({ error }) => { if (error) console.error("Fav save error:", error); });
    return n;
  });

  const markAnnouncementsSeen = (id: number) => {
    setLastSeenAnnouncementId(id);
    if (userId) supabase.from("wcf_progress")
      .update({ last_seen_announcement_id: id })
      .eq("user_id", userId)
      .then(({ error }) => { if (error) console.error("Seen save error:", error); });
  };

  return { owned, toggle, wishlist, toggleWish, favourites, toggleFavourite, lastSeenAnnouncementId, markAnnouncementsSeen, imgbbKey: IMGBB_KEY, ready };
}

function useCommunityStats() {
  const [figureOwned, setFigureOwned] = useState<Record<number,number>>({});
  const [figureWished, setFigureWished] = useState<Record<number,number>>({});
  const [users, setUsers] = useState(0);
  const [totalOwned, setTotalOwned] = useState(0);
  const [topOwned, setTopOwned] = useState<{id:number;count:number}[]>([]);
  const [topWished, setTopWished] = useState<{id:number;count:number}[]>([]);

  useEffect(() => {
    supabase.from("wcf_progress").select("owned,wishlist")
      .then(({ data: rows, error }) => {
        if (error || !rows) return;
        const oc: Record<number,number> = {};
        const wc: Record<number,number> = {};
        let tot = 0;
        for(const r of rows) {
          const o = Array.isArray(r.owned) ? r.owned : [];
          const w = Array.isArray(r.wishlist) ? r.wishlist : [];
          tot += o.length;
          for(const id of o) oc[id] = (oc[id]??0) + 1;
          for(const id of w) wc[id] = (wc[id]??0) + 1;
        }
        setFigureOwned(oc);
        setFigureWished(wc);
        setUsers(rows.length);
        setTotalOwned(tot);
        setTopOwned(Object.entries(oc).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,count])=>({id:Number(id),count})));
        setTopWished(Object.entries(wc).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,count])=>({id:Number(id),count})));
      });
  }, []);

  return { figureOwned, figureWished, users, totalOwned, topOwned, topWished };
}

type LeaderboardEntry = { userId: string; name: string; count: number; ownedIds?: number[]; avatar?: string|null };

function usePendingPhotosCount(isAdmin: boolean) {
  const [count, setCount] = useState(0);
  const load = useCallback(() => {
    Promise.all([
      supabase.from("wcf_photos").select("id", { count: "exact", head: true }).eq("approved", false),
      supabase.from("wcf_collection_photos").select("id", { count: "exact", head: true }).eq("approved", false),
    ]).then(([figuresRes, collectionsRes]) => {
      setCount((figuresRes.count ?? 0) + (collectionsRes.count ?? 0));
    });
  }, []);
  useEffect(() => {
    if (!isAdmin) return;
    load();
    const interval = setInterval(load, 60000); // refresca cada minuto
    return () => clearInterval(interval);
  }, [isAdmin, load]);
  return { count, refresh: load };
}

function useCommunityLeaderboards(currentUserId?: string|null) {
  const [topUploaders, setTopUploaders] = useState<LeaderboardEntry[]>([]);
  const [topCollectors, setTopCollectors] = useState<LeaderboardEntry[]>([]);
  const [myUploaderRank, setMyUploaderRank] = useState<number|null>(null);
  const [myCollectorRank, setMyCollectorRank] = useState<number|null>(null);
  const [myUploaderEntry, setMyUploaderEntry] = useState<LeaderboardEntry|null>(null);
  const [myCollectorEntry, setMyCollectorEntry] = useState<LeaderboardEntry|null>(null);

  useEffect(() => {
    supabase.from("wcf_photos").select("user_id,uploader_name,uploader_email,uploader_avatar").eq("approved", true)
      .then(({ data: rows, error }) => {
        if (error || !rows) return;
        const counts: Record<string, { name: string; count: number; avatar: string|null }> = {};
        for (const r of rows) {
          if (!r.user_id) continue;
          if (!counts[r.user_id]) counts[r.user_id] = { name: r.uploader_name || r.uploader_email || "Anonymous", count: 0, avatar: r.uploader_avatar ?? null };
          counts[r.user_id].count++;
          if (!counts[r.user_id].name || counts[r.user_id].name === "Anonymous") {
            counts[r.user_id].name = r.uploader_name || r.uploader_email || "Anonymous";
          }
          if (r.uploader_avatar) counts[r.user_id].avatar = r.uploader_avatar;
        }
        const full = Object.entries(counts)
          .map(([userId, v]) => ({ userId, name: v.name, count: v.count, avatar: v.avatar }))
          .sort((a, b) => b.count - a.count);
        setTopUploaders(full.slice(0, 10));
        if (currentUserId) {
          const idx = full.findIndex(e => e.userId === currentUserId);
          setMyUploaderRank(idx >= 0 ? idx + 1 : null);
          setMyUploaderEntry(idx >= 0 ? full[idx] : null);
        }
      });

    supabase.from("wcf_progress").select("user_id,owned,owner_name,owner_email,owner_avatar")
      .then(({ data: rows, error }) => {
        if (error || !rows) return;
        const full = rows
          .filter(r => r.user_id && Array.isArray(r.owned) && r.owned.length > 0)
          .map(r => ({ userId: r.user_id as string, name: (r.owner_name || r.owner_email || "Anonymous") as string, count: (r.owned as unknown[]).length, ownedIds: r.owned as number[], avatar: (r.owner_avatar ?? null) as string|null }))
          .sort((a, b) => b.count - a.count);
        setTopCollectors(full.slice(0, 10));
        if (currentUserId) {
          const idx = full.findIndex(e => e.userId === currentUserId);
          setMyCollectorRank(idx >= 0 ? idx + 1 : null);
          setMyCollectorEntry(idx >= 0 ? full[idx] : null);
        }
      });
  }, [currentUserId]);

  return { topUploaders, topCollectors, myUploaderRank, myCollectorRank, myUploaderEntry, myCollectorEntry };
}

function useData() {
  const [data, setDataState] = useState<Series[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    sbGet("wcf_data").then(row => {
      if (row && Array.isArray(row.data) && row.data.length > 0) {
        const migrated = row.data.map((s: Series) => ({ ...s, groups: s.groups ?? [] }));
        setDataState(migrated);
      } else {
        setDataState(INITIAL_DATA);
        sbUpsert("wcf_data", { data: INITIAL_DATA });
      }
      setReady(true);
    });
  }, []);
  const setData = (updater: Series[] | ((prev: Series[]) => Series[])) => {
    setDataState(prev => { const next = typeof updater === "function" ? updater(prev) : updater; sbUpsert("wcf_data", { data: next }); return next; });
  };
  return { data, setData, ready };
}


// ============================================================
//  CROP MODAL — fixed crop box, image moves underneath
// ============================================================
function CropModal({ imageSrc, aspectRatio, onConfirm, onClose, format = "jpeg", freeWidth = false }: {
  imageSrc: string; aspectRatio: number | null; onConfirm: (b: Blob) => void; onClose: () => void; format?: "jpeg" | "png"; freeWidth?: boolean;
}) {
  const { t } = useTr();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Container size
  const CW = Math.min(window.innerWidth - 56, 440);
  const CH = 340;

  // Crop box: fixed in center, resizable
  const initCrop = useCallback(() => {
    const cw = freeWidth ? Math.round(CW * 0.9) : Math.round(CW * 0.75);
    const ch = aspectRatio ? Math.round(cw / aspectRatio) : Math.round(CH * 0.75);
    return { x: Math.round((CW - cw) / 2), y: Math.round((CH - ch) / 2), w: cw, h: Math.min(ch, CH - 20) };
  }, [freeWidth, aspectRatio, CW, CH]);

  const [cropBox, setCropBox] = useState(initCrop);
  // Image position and scale
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  const MIN_ZOOM = 0.2, MAX_ZOOM = 5;

  // Base scale: fit image to container
  const baseScale = naturalSize.w > 0 ? Math.min(CW / naturalSize.w, CH / naturalSize.h) : 1;
  const imgW = naturalSize.w * baseScale * zoom;
  const imgH = naturalSize.h * baseScale * zoom;

  // Load image
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      const scale = Math.min(CW / img.naturalWidth, CH / img.naturalHeight);
      setImgPos({ x: (CW - img.naturalWidth * scale) / 2, y: (CH - img.naturalHeight * scale) / 2 });
      setZoom(1);
      setCropBox(initCrop());
      setLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc, initCrop]);

  // Dragging state
  const dragging = useRef<{ mode: "img" | "crop" | string; startX: number; startY: number; startPos: {x:number;y:number}; startCrop: typeof cropBox } | null>(null);

  const getPos = (e: MouseEvent | TouchEvent) => {
    const t2 = "touches" in e ? e.touches[0] : e;
    return { x: t2.clientX, y: t2.clientY };
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const { x, y } = getPos(e);
      const dx = x - dragging.current.startX, dy = y - dragging.current.startY;
      const { mode, startPos, startCrop } = dragging.current;

      if (mode === "img") {
        setImgPos({ x: startPos.x + dx, y: startPos.y + dy });
      } else if (mode === "crop") {
        setCropBox(prev => ({
          ...prev,
          x: Math.max(0, Math.min(startCrop.x + dx, CW - prev.w)),
          y: Math.max(0, Math.min(startCrop.y + dy, CH - prev.h)),
        }));
      } else {
        // resize handles — no aspect ratio enforcement, free resize
        setCropBox(() => {
          let { x, y, w, h } = startCrop;
          if (mode.includes("e")) w = Math.max(20, startCrop.w + dx);
          if (mode.includes("s")) h = Math.max(20, startCrop.h + dy);
          if (mode.includes("w")) { x = startCrop.x + dx; w = Math.max(20, startCrop.w - dx); }
          if (mode.includes("n")) { y = startCrop.y + dy; h = Math.max(20, startCrop.h - dy); }
          x = Math.max(0, Math.min(x, CW - w));
          y = Math.max(0, Math.min(y, CH - h));
          w = Math.min(w, CW - x); h = Math.min(h, CH - y);
          return { x, y, w, h };
        });
      }
    };
    const onUp = () => { dragging.current = null; };
    const onMouseMove = (e: MouseEvent) => onMove(e);
    const onTouchMove = (e: TouchEvent) => {
      // Only intercept touches that started on the crop container, not the slider
      if (!dragging.current) return;
      e.preventDefault();
      onMove(e);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [CW, CH]);

  const startDrag = (mode: string, clientX: number, clientY: number) => {
    dragging.current = { mode, startX: clientX, startY: clientY, startPos: { ...imgPos }, startCrop: { ...cropBox } };
  };

  const handleZoom = (newZoom: number) => {
    const nz = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    // Zoom centered on crop box center
    const cx = cropBox.x + cropBox.w / 2;
    const cy = cropBox.y + cropBox.h / 2;
    const ratio = nz / zoom;
    setImgPos(prev => ({ x: cx - (cx - prev.x) * ratio, y: cy - (cy - prev.y) * ratio }));
    setZoom(nz);
  };

  const handleConfirm = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const outSize = 600;
    const canvas = canvasRef.current;
    canvas.width = outSize; canvas.height = outSize;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outSize, outSize);
    // Scale so the longest side of the crop box fits in outSize
    const scale = outSize / Math.max(cropBox.w, cropBox.h);
    // Center the crop box content in the square output
    const drawW = cropBox.w * scale;
    const drawH = cropBox.h * scale;
    const padX = (outSize - drawW) / 2;
    const padY = (outSize - drawH) / 2;
    // Where the image sits relative to crop box, scaled to output
    const destX = padX + (imgPos.x - cropBox.x) * scale;
    const destY = padY + (imgPos.y - cropBox.y) * scale;
    const destW = imgW * scale;
    const destH = imgH * scale;
    // Clip to the crop box area so nothing outside it bleeds in
    ctx.save();
    ctx.beginPath();
    ctx.rect(padX, padY, drawW, drawH);
    ctx.clip();
    ctx.drawImage(img, destX, destY, destW, destH);
    ctx.restore();
    canvas.toBlob(b => { if (b) onConfirm(b); }, format === "png" ? "image/png" : "image/jpeg", format === "jpeg" ? 0.92 : undefined);
  };

  const handles = ["nw","n","ne","e","se","s","sw","w"];
  const hPos: Record<string, React.CSSProperties> = { nw:{top:-6,left:-6},n:{top:-6,left:"50%",transform:"translateX(-50%)"},ne:{top:-6,right:-6},e:{top:"50%",right:-6,transform:"translateY(-50%)"},se:{bottom:-6,right:-6},s:{bottom:-6,left:"50%",transform:"translateX(-50%)"},sw:{bottom:-6,left:-6},w:{top:"50%",left:-6,transform:"translateY(-50%)"} };
  const hCursor: Record<string,string> = { nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize",n:"ns-resize",s:"ns-resize",e:"ew-resize",w:"ew-resize" };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:12}}>
      <div style={{background:"var(--bg)",borderRadius:14,padding:16,width:"100%",maxWidth:460}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontWeight:600,fontSize:15}}>{t("adjustImage")}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        <p style={{fontSize:11,color:"var(--text4)",marginBottom:10}}>Arrastra la imagen para moverla · Arrastra el borde del recuadre para redimensionar · Zoom con el slider</p>

        {/* Crop container */}
        <div ref={containerRef} style={{width:CW,height:CH,background:"#888",borderRadius:8,position:"relative",overflow:"hidden",userSelect:"none",margin:"0 auto"}}>
          {/* Image — draggable */}
          {loaded && (
            <img src={imageSrc}
              onMouseDown={e=>{e.preventDefault();startDrag("img",e.clientX,e.clientY);}}
              onTouchStart={e=>{startDrag("img",e.touches[0].clientX,e.touches[0].clientY);}}
              style={{position:"absolute",left:imgPos.x,top:imgPos.y,width:imgW,height:imgH,cursor:"grab",touchAction:"none",userSelect:"none"}}
              draggable={false}
            />
          )}
          {/* Dark overlay outside crop box */}
          {loaded && <>
            <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2}}>
              {/* top */}
              <div style={{position:"absolute",left:0,top:0,right:0,height:cropBox.y,background:"rgba(0,0,0,0.5)"}} />
              {/* bottom */}
              <div style={{position:"absolute",left:0,top:cropBox.y+cropBox.h,right:0,bottom:0,background:"rgba(0,0,0,0.5)"}} />
              {/* left */}
              <div style={{position:"absolute",left:0,top:cropBox.y,width:cropBox.x,height:cropBox.h,background:"rgba(0,0,0,0.5)"}} />
              {/* right */}
              <div style={{position:"absolute",left:cropBox.x+cropBox.w,top:cropBox.y,right:0,height:cropBox.h,background:"rgba(0,0,0,0.5)"}} />
            </div>
            {/* Crop box border */}
            <div
              onMouseDown={e=>{e.stopPropagation();e.preventDefault();startDrag("crop",e.clientX,e.clientY);}}
              onTouchStart={e=>{e.stopPropagation();startDrag("crop",e.touches[0].clientX,e.touches[0].clientY);}}
              style={{position:"absolute",left:cropBox.x,top:cropBox.y,width:cropBox.w,height:cropBox.h,border:"2px solid #fff",boxSizing:"border-box",cursor:"move",zIndex:3,touchAction:"none"}}>
              {/* Grid lines */}
              <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
                {[1,2].map(i=><div key={i} style={{position:"absolute",left:`${i*33.33}%`,top:0,bottom:0,borderLeft:"1px solid rgba(255,255,255,0.4)"}} />)}
                {[1,2].map(i=><div key={i} style={{position:"absolute",top:`${i*33.33}%`,left:0,right:0,borderTop:"1px solid rgba(255,255,255,0.4)"}} />)}
              </div>
              {/* Resize handles */}
              {handles.map(h => {
                if (aspectRatio===1 && ["n","s"].includes(h)) return null;
                if (freeWidth && ["n","s","nw","ne","sw","se"].includes(h)) return null;
                return <div key={h}
                  onMouseDown={e=>{e.stopPropagation();e.preventDefault();startDrag(h,e.clientX,e.clientY);}}
                  onTouchStart={e=>{e.stopPropagation();startDrag(h,e.touches[0].clientX,e.touches[0].clientY);}}
                  style={{position:"absolute",width:12,height:12,background:"#fff",borderRadius:2,cursor:hCursor[h],...hPos[h],zIndex:4,touchAction:"none"}} />;
              })}
            </div>
          </>}
        </div>

        {/* Zoom slider */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
          <span style={{fontSize:13,color:"var(--text3)",flexShrink:0}}>{t("zoom")}</span>
          <input type="range" min={Math.round(MIN_ZOOM*100)} max={Math.round(MAX_ZOOM*100)} step="5"
            value={Math.round(zoom*100)}
            onChange={e=>handleZoom(Number(e.target.value)/100)}
            onMouseDown={e=>e.stopPropagation()}
            onTouchStart={e=>{e.stopPropagation(); dragging.current=null;}}
            style={{flex:1,cursor:"pointer",touchAction:"pan-x"}} />
          <span style={{fontSize:12,color:"var(--text3)",minWidth:36,textAlign:"right"}}>{Math.round(zoom*100)}%</span>
        </div>

        <canvas ref={canvasRef} style={{display:"none"}} />
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
          <button onClick={onClose} style={{padding:"7px 14px",fontSize:13,border:"1px solid var(--border)",borderRadius:8,background:"var(--bg3)",cursor:"pointer"}}>{t("cancel")}</button>
          <button onClick={handleConfirm} style={{padding:"7px 14px",fontSize:13,border:"none",borderRadius:8,background:"#1a1a1a",color:"#fff",cursor:"pointer",fontWeight:500}}>{t("confirmUpload")}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  IMAGE UPLOADER
// ============================================================
function ImageUploader({ apiKey: _apiKey, currentUrl, onUploaded, label, aspectRatio, format="jpeg", freeWidth=false, skipCrop=false }: {
  apiKey:string; currentUrl?:string; onUploaded:(url:string)=>void; label:string; aspectRatio:number|null; format?:"jpeg"|"png"; freeWidth?:boolean; skipCrop?:boolean;
}) {
  const { t } = useTr();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [cropSrc, setCropSrc] = useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (skipCrop) {
      setUploading(true); setError("");
      uploadToR2(file).then(url=>onUploaded(url)).catch(()=>setError(t("uploadError"))).finally(()=>setUploading(false));
    } else {
      const r = new FileReader(); r.onload = e => setCropSrc(e.target?.result as string); r.readAsDataURL(file);
    }
  };
  const handleCropConfirm = async (blob: Blob) => {
    setCropSrc(null); setUploading(true); setError("");
    try { onUploaded(await uploadToR2(blob)); } catch { setError(t("uploadError")); } finally { setUploading(false); }
  };

  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div>
      <div style={{fontSize:12,color:"var(--text3)",marginBottom:5,fontWeight:500}}>{label}</div>
      <div
        onClick={()=>!uploading&&inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{border:`1.5px dashed ${dragOver?"#0174b0":"var(--border)"}`,borderRadius:10,padding:12,cursor:uploading?"wait":"pointer",textAlign:"center",background:dragOver?"#e6f4fd":"var(--bg2)",marginBottom:4,transition:"border-color 0.2s, background 0.2s"}}>
        {currentUrl
          ? <div><img src={currentUrl} alt="" style={{maxHeight:80,maxWidth:"100%",borderRadius:6,marginBottom:6,objectFit:"contain"}} /><div style={{fontSize:12,color:"var(--text3)"}}>{uploading ? t("uploading") : t("uploadChange")}</div></div>
          : <div style={{color:dragOver?"#0174b0":"var(--text4)",fontSize:13}}>{uploading ? t("uploading") : dragOver ? "Suelta la imagen aquí" : t("uploadClick")}</div>
        }
        <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])} />
      </div>
      {error && <div style={{fontSize:12,color:"#dc2626"}}>{error}</div>}
      {cropSrc && <CropModal imageSrc={cropSrc} aspectRatio={aspectRatio} format={format} freeWidth={freeWidth} onConfirm={handleCropConfirm} onClose={()=>setCropSrc(null)} />}
    </div>
  );
}

// ============================================================
//  UI HELPERS
// ============================================================
function ProgressBar({ value, total, color }: { value:number; total:number; color:string }) {
  const pct = total ? Math.round(value/total*100) : 0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:5,background:"#e8e8e4",borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:color,borderRadius:4,transition:"width 0.4s"}} />
      </div>
      <span style={{fontSize:12,color:"var(--text3)",minWidth:36,textAlign:"right"}}>{value}/{total}</span>
    </div>
  );
}
function Btn({ onClick, children, variant="default", small=false }: { onClick:()=>void; children:React.ReactNode; variant?:"default"|"primary"|"danger"; small?:boolean }) {
  const bg = variant==="primary"?"#0196e3":variant==="danger"?"#fee2e2":"#f5f5f3";
  const color = variant==="primary"?"#fff":variant==="danger"?"#dc2626":"#1a1a1a";
  return <button onClick={onClick} style={{padding:small?"4px 10px":"7px 14px",fontSize:small?12:13,fontWeight:500,border:"1px solid "+(variant==="danger"?"#fca5a5":"#e8e8e4"),borderRadius:8,background:bg,color,cursor:"pointer"}}>{children}</button>;
}
function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:14,padding:24,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <span style={{fontWeight:600,fontSize:16}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={{marginBottom:14}}><div style={{fontSize:12,color:"var(--text3)",marginBottom:5,fontWeight:500}}>{label}</div>{children}</div>;
}
function Input({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder?:string }) {
  return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"8px 10px",fontSize:14,border:"1px solid var(--border)",borderRadius:8,outline:"none",boxSizing:"border-box"}} />;
}
function EmojiPicker({ value, onChange }: { value:string; onChange:(e:string)=>void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={()=>setShow(!show)} style={{fontSize:24,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>{value}</button>
      {show && <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,padding:10,background:"var(--bg3)",borderRadius:8}}>{EMOJIS.map(e=><span key={e} onClick={()=>{onChange(e);setShow(false);}} style={{fontSize:22,cursor:"pointer",padding:4,borderRadius:6,background:value===e?"#e8e8e4":"transparent"}}>{e}</span>)}</div>}
    </div>
  );
}

// ============================================================
//  MODALS
// ============================================================
function AltImagesEditor({ altImages, onChange, apiKey }: { altImages: string[]; onChange:(imgs:string[])=>void; apiKey:string }) {
  const { t } = useTr();
  const letters = ["B","C"]; // "A" is the main image, handled outside this component
  const updateAt = (i:number, url:string) => { const next=[...altImages]; next[i]=url; onChange(next); };
  const removeAt = (i:number) => onChange(altImages.filter((_,idx)=>idx!==i));

  return (
    <Field label={t("altVersionsLabel")}>
      {altImages.map((img,i) => (
        <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
          <div style={{flex:1}}>
            <ImageUploader apiKey={apiKey} currentUrl={img} onUploaded={(url)=>updateAt(i,url)} label={`${t("versionLabel")} ${letters[i] ?? "?"}`} aspectRatio={1} />
          </div>
          <button onClick={()=>removeAt(i)} style={{marginTop:22,background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,padding:"6px 8px",fontSize:12,cursor:"pointer",color:"#dc2626"}}>🗑</button>
        </div>
      ))}
      {altImages.length < letters.length && (
        <ImageUploader apiKey={apiKey} currentUrl="" onUploaded={(url)=>onChange([...altImages, url])} label={`+ ${t("addVersionBtn")} ${letters[altImages.length]}`} aspectRatio={1} />
      )}
      <div style={{fontSize:11,color:"var(--text4)",marginTop:4}}>{t("altVersionsHint")}</div>
    </Field>
  );
}

function FigureModal({ title, initial, apiKey, onSave, onClose }: { title:string; initial?:Partial<Figure>; apiKey:string; onSave:(f:Omit<Figure,"id">, markAsNews?:boolean, wasNews?:boolean)=>void; onClose:()=>void }) {
  const { t } = useTr();
  const seriesList = useSeriesData();
  const [name, setName] = useState(initial?.name??"");
  const [emoji, setEmoji] = useState(initial?.emoji??"⭐");
  const [image, setImage] = useState(initial?.image??"");
  const [altImages, setAltImages] = useState<string[]>(initial?.altImages??[]);
  // Parse existing tags into selected series ids and free text
  const parseTags = (tags?: string) => {
    if (!tags) return { seriesIds: [] as number[], freeText: "" };
    const parts = tags.split(",").map(s=>s.trim()).filter(Boolean);
    const ids: number[] = [];
    const free: string[] = [];
    parts.forEach(p => {
      const match = seriesList.find(s=>s.name.toLowerCase()===p.toLowerCase());
      if (match) ids.push(match.id); else free.push(p);
    });
    return { seriesIds: ids, freeText: free.join(", ") };
  };
  const parsed = parseTags(initial?.tags);
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<number[]>(parsed.seriesIds);
  const [freeText, setFreeText] = useState(parsed.freeText);
  const [markAsNews, setMarkAsNews] = useState(false);
  const [wasNewsInitial, setWasNewsInitial] = useState(false);
  const [newsChecked, setNewsChecked] = useState(!initial);
  useEffect(() => {
    if (initial?.id) {
      supabase.from("wcf_announcements").select("id").eq("figure_id", String(initial.id)).eq("active", true).limit(1)
        .then(({ data }) => { const isNews = (data?.length ?? 0) > 0; setMarkAsNews(isNews); setWasNewsInitial(isNews); setNewsChecked(true); });
    }
  }, [initial?.id]);

  const toggleSeries = (id: number) => setSelectedSeriesIds(prev =>
    prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
  );

  const buildTags = () => {
    const seriesNames = selectedSeriesIds.map(id=>seriesList.find(s=>s.id===id)?.name??"").filter(Boolean);
    const all = [...seriesNames, ...freeText.split(",").map(s=>s.trim()).filter(Boolean)];
    return all.join(", ");
  };

  // Unique series names for selector
  const uniqSeries = seriesList.filter((s,i,arr)=>arr.findIndex(x=>x.name===s.name)===i);

  return (
    <Modal title={title} onClose={onClose}>
      <Field label={t("nameLabel")}><Input value={name} onChange={setName} placeholder="Ej: Goku SSJ" /></Field>
      <Field label={t("emojiLabel")}><EmojiPicker value={emoji} onChange={setEmoji} /></Field>
      <ImageUploader apiKey={apiKey} currentUrl={image} onUploaded={setImage} label={t("figureImage")} aspectRatio={1} />
      <AltImagesEditor altImages={altImages} onChange={setAltImages} apiKey={apiKey} />
      <Field label="También pertenece a... (opcional)">
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
          {uniqSeries.map(s=>{
            const sel = selectedSeriesIds.includes(s.id);
            return (
              <button key={s.id} onClick={()=>toggleSeries(s.id)}
                style={{padding:"4px 10px",borderRadius:16,fontSize:12,border:`1px solid ${sel?s.color:"var(--border)"}`,background:sel?s.color+"22":"var(--bg2)",color:sel?s.color:"var(--text3)",cursor:"pointer",fontWeight:sel?600:400}}>
                {s.emoji} {s.name}
              </button>
            );
          })}
        </div>
        <Input value={freeText} onChange={setFreeText} placeholder="Otras series (separadas por comas)" />
        <div style={{fontSize:11,color:"var(--text4)",marginTop:4}}>Para series que no están en el catálogo.</div>
      </Field>
      {newsChecked && (
        <Field label="">
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
            <input type="checkbox" checked={markAsNews} onChange={e=>setMarkAsNews(e.target.checked)} />
            📢 Marcar como novedad
          </label>
        </Field>
      )}
      <div style={{marginTop:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{if(name.trim()){onSave({name:name.trim(),emoji,image,tags:buildTags(),altImages:altImages.filter(Boolean)}, markAsNews, wasNewsInitial);onClose();}}} variant="primary">{t("save")}</Btn>
      </div>
    </Modal>
  );
}

function SetModal({ title, initial, apiKey, onSave, onClose }: { title:string; initial?:Partial<FigureSet>; apiKey:string; onSave:(n:string,rd:string,sl:string)=>void; onClose:()=>void }) {
  const { t } = useTr();
  const [name, setName] = useState(initial?.name??"");
  const [releaseDate, setReleaseDate] = useState(initial?.releaseDate??"");
  const [seriesLogo, setSeriesLogo] = useState(initial?.seriesLogo??"");
  return (
    <Modal title={title} onClose={onClose}>
      <Field label={t("setNameLabel")}><Input value={name} onChange={setName} placeholder="Ej: Vol. 1" /></Field>
      <Field label={t("releaseDateLabel")}>
        <input type="month" value={releaseDate} onChange={e=>setReleaseDate(e.target.value)}
          style={{width:"100%",padding:"8px 10px",fontSize:14,border:"1px solid var(--border)",borderRadius:8,outline:"none",boxSizing:"border-box" as const}} />
      </Field>
      <ImageUploader apiKey={apiKey} currentUrl={seriesLogo} onUploaded={setSeriesLogo} label={t("setLogoLabel")} aspectRatio={null} format="png" skipCrop />
      <div style={{marginTop:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{if(name.trim()){onSave(name.trim(),releaseDate,seriesLogo);onClose();}}} variant="primary">{t("save")}</Btn>
      </div>
    </Modal>
  );
}

function SeriesModal({ onSave, onClose, category, initial, apiKey }: { onSave:(n:string,e:string,c:string,lh:string,bg:string)=>void; onClose:()=>void; category:CategoryType; initial?:Partial<Series>; apiKey:string }) {
  const { t } = useTr();
  const [name,setName]=useState(initial?.name??""); const [emoji,setEmoji]=useState(initial?.emoji??"⭐");
  const [color,setColor]=useState(initial?.color??SERIES_COLORS[0]); const [logoHeader,setLogoHeader]=useState(initial?.logoHeader??"");
  const [bgImage,setBgImage]=useState(initial?.bgImage??"");
  const catLabel = category==="oficial" ? t("officialBadge") : t("resinBadge");
  return (
    <Modal title={initial ? t("editSeriesTitle") : t("newSeriesTitle", catLabel)} onClose={onClose}>
      <Field label={t("nameLabel")}><Input value={name} onChange={setName} placeholder="Ej: Naruto" /></Field>
      <ImageUploader apiKey={apiKey} currentUrl={bgImage} onUploaded={setBgImage} label="Imagen de fondo de la serie" aspectRatio={null} skipCrop />
      <div style={{marginTop:12}} />
      <ImageUploader apiKey={apiKey} currentUrl={logoHeader} onUploaded={setLogoHeader} label={t("headerLogo")} aspectRatio={null} format="png" skipCrop />
      <Field label={t("emojiFallback")}><EmojiPicker value={emoji} onChange={setEmoji} /></Field>
      <Field label={t("colorLabel")}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{SERIES_COLORS.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:color===c?"3px solid var(--text)":"3px solid transparent"}} />)}</div>
      </Field>
      <div style={{marginTop:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{if(name.trim()){onSave(name.trim(),emoji,color,logoHeader,bgImage);onClose();}}} variant="primary">{t("save")}</Btn>
      </div>
    </Modal>
  );
}

// ============================================================
//  FIGURE CARD
// ============================================================
function FigureCard({ figure, color, isOwned, isWished, onToggle, onToggleWish, onEdit, onDelete, onQuickUpload, onSwapImage, onReorderStart, onMove, onDetail, userPhotoCount }: {
  figure:Figure; color:string; isOwned:boolean; isWished:boolean;
  onToggle:()=>void; onToggleWish:()=>void; onEdit:()=>void; onDelete:()=>void;
  onQuickUpload?:(file:File)=>void;
  onSwapImage?:(fromId:number)=>void;
  onReorderStart?:()=>void;
  onMove?:()=>void;
  onDetail?:()=>void;
  userPhotoCount?:number;
}) {
  const { t } = useTr();
  const isAdmin = useAdmin();
  const [imgError,setImgError]=useState(false); const [hover,setHover]=useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const retryCount = useRef(0);
  const [dragOver,setDragOver]=useState(false);
  const [popping, setPopping] = useState(false);
  const isMobileDevice = window.innerWidth < 768;
  const hasImage = !!figure.image && !imgError;
  const statusText = isOwned ? t("owned") : isWished ? t("inWishlist") : t("missing");
  const statusColor = isOwned ? color : isWished ? "#d97706" : "#aaa";
  const dotColor = isOwned ? color : isWished ? "#f59e0b" : "#ccc";

  const handleToggle = () => {
    if (!isOwned) { setPopping(true); setTimeout(()=>setPopping(false), 400); }
    onToggle();
  };

  const { dragging, setDragging } = useDragCtx();

  const handleDragStart = (e:React.DragEvent) => {
    if(!isAdmin || !figure.image) return;
    e.dataTransfer.setData("wcf_figure_id", String(figure.id));
    e.dataTransfer.effectAllowed = "move";
    setDragging({ figureId: figure.id, image: figure.image ?? "" });
  };

  const handleDragOver = (e:React.DragEvent) => {
    if(!isAdmin) return;
    if(!dragging && !e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e:React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if(!isAdmin) return;
    // Figure swap from global drag context
    if(dragging && dragging.figureId !== figure.id && onSwapImage) {
      onSwapImage(dragging.figureId);
      setDragging(null);
      return;
    }
    // File upload from disk
    if(!onQuickUpload) return;
    const file = e.dataTransfer.files?.[0];
    if(file && file.type.startsWith("image/")) onQuickUpload(file);
  };
  const handleDragEnd = () => setDragging(null);

  return (
    <div
      draggable={isAdmin && !!figure.image}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{border:`1px solid ${popping?"#4ade80":dragOver?"#0174b0":isOwned?color:isWished?"#f59e0b":"#e8e8e4"}`,borderRadius:10,background:popping?"#e6f4fd":dragOver?"#e6f4fd":isOwned?color+"18":isWished?"#fffbeb":"#fff",overflow:"hidden",position:"relative",outline:dragOver?"2px dashed #0174b0":"none",cursor:isAdmin&&figure.image?"grab":"default",
        transform: popping ? "scale(1.12)" : "scale(1)",
        transition: popping ? "transform 0.2s cubic-bezier(0.36,0.07,0.19,0.97), border 0.1s, background 0.1s" : "transform 0.2s ease-in, border 0.3s, background 0.3s",
        boxShadow: popping ? `0 0 12px ${color}99` : "none"
      }}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false);setShowAdminMenu(false);}}
      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {dragOver && <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(225,245,238,0.85)",fontSize:24,pointerEvents:"none"}}>🔄</div>}
      {/* Reorder handle */}
      {isAdmin && onReorderStart && hover && (
        <div draggable
          onDragStart={(e)=>{ e.stopPropagation(); e.dataTransfer.setData("wcf_reorder_id", String(figure.id)); e.dataTransfer.effectAllowed="move"; onReorderStart(); }}
          style={{position:"absolute",bottom:4,right:4,zIndex:5,cursor:"grab",fontSize:13,color:"rgba(0,0,0,0.4)",padding:"2px 4px",borderRadius:4,background:"rgba(255,255,255,0.8)",lineHeight:1}}
          title="Reorder">⠿</div>
      )}
      {isAdmin && hover && onEdit && (
        <button onClick={e=>{e.stopPropagation();onEdit();}}
          style={{position:"absolute",bottom:4,left:4,zIndex:5,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>✏️</button>
      )}
      {(hover || isMobileDevice) && <div style={{position:"absolute",top:4,left:4,zIndex:3,display:"flex",gap:4}}>
        {isAdmin && hover && (
          <button onClick={e=>{e.stopPropagation();setShowAdminMenu(m=>!m);}}
            style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 7px",fontSize:12,cursor:"pointer",lineHeight:1,fontWeight:700}}>⋮</button>
        )}
        {!isOwned && <button onClick={e=>{e.stopPropagation();onToggleWish();}} style={{background:isWished?"#fef3c7":"rgba(255,255,255,0.85)",border:"1px solid "+(isWished?"#fcd34d":"#e8e8e4"),borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>{isWished?"💛":"🤍"}</button>}
      </div>}
      <div onClick={handleToggle} style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:isOwned?color+"30":isWished?"#fef9c3":"var(--missing-bg)",overflow:"hidden",cursor:"pointer",opacity:isOwned?1:isWished?0.75:0.45,transition:"opacity 0.3s",position:"relative"}}>
        {hasImage ? <img src={figure.image} alt={figure.name} loading="lazy" onError={(e)=>{
            if (retryCount.current < 2) {
              retryCount.current++;
              const img = e.currentTarget;
              setTimeout(()=>{ img.src = figure.image + (figure.image!.includes("?") ? "&" : "?") + "retry=" + Date.now(); }, 600 * retryCount.current);
            } else {
              setImgError(true);
            }
          }} style={{width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none"}} />
          : <div style={{textAlign:"center"}}><div style={{fontSize:36}}>{figure.emoji}</div><div style={{fontSize:10,color:"var(--text4)",marginTop:4}}>{t("noImage")}</div></div>}
        {/* Zoom button - top right */}
        {onDetail && hasImage && (hover || isMobileDevice) && (
          <button onClick={e=>{e.stopPropagation();onDetail();}}
            style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.45)",border:"none",borderRadius:6,color:"#fff",width:24,height:24,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4}}>🔍</button>
        )}
        {/* Owned check - bottom left */}
        {isOwned && <div style={{position:"absolute",bottom:4,left:4,zIndex:2,width:20,height:20,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>✓</div>}
        {/* Wished heart - bottom left */}
        {isWished && !isOwned && <div style={{position:"absolute",bottom:4,left:4,zIndex:2,fontSize:14}}>💛</div>}
        {/* User photos badge - bottom right of image */}
        {(userPhotoCount??0) > 0 && (
          <div style={{position:"absolute",bottom:4,right:4,zIndex:3,background:color,borderRadius:10,padding:"1px 5px",display:"flex",alignItems:"center",gap:2,fontSize:9,color:"#fff",fontWeight:700,lineHeight:1}}>
            <span style={{fontSize:10,lineHeight:1,display:"flex",alignItems:"center"}}>📷</span>
            <span>+{userPhotoCount}</span>
          </div>
        )}
        {showAdminMenu && (
          <div style={{position:"absolute",inset:0,borderRadius:8,background:"rgba(0,0,0,0.75)",zIndex:10,display:"flex",flexDirection:"column",justifyContent:"center",gap:4,padding:6}}>
            {onMove && (
              <button onClick={e=>{e.stopPropagation();setShowAdminMenu(false);onMove();}}
                style={{padding:"5px 4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.9)",color:"#0196e3",cursor:"pointer",fontSize:9,fontWeight:700}}>
                🗂️ Move to set
              </button>
            )}
            <button onClick={e=>{e.stopPropagation();setShowAdminMenu(false);onDelete();}}
              style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontSize:9,fontWeight:700}}>
              🗑 Delete
            </button>
            <button onClick={e=>{e.stopPropagation();setShowAdminMenu(false);}}
              style={{padding:"4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer",fontSize:9}}>
              {t("cancelBtn")}
            </button>
          </div>
        )}
      </div>
      <div style={{padding:"8px 10px 10px"}}>
        <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,marginBottom:(figure.altImages?.length ?? 0) > 0 ? 4 : 5}}>{figure.name}</div>
        {(figure.altImages?.length ?? 0) > 0 && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3,marginBottom:5}}>
            {["A", ...(figure.altImages ?? []).map((_,i)=>["B","C"][i])].map(letter => (
              <span key={letter} style={{fontSize:9,fontWeight:700,color:"#fff",background:"#6ec98a",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                {letter}
              </span>
            ))}
          </div>
        )}
        <div onClick={handleToggle} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:statusColor,fontWeight:(isOwned||isWished)?600:400,cursor:"pointer"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:dotColor,flexShrink:0}} />{statusText}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  BULK ADD MODAL
// ============================================================
function BulkAddModal({ onSave, onClose }: { onSave:(names:string[])=>void; onClose:()=>void }) {
  const { t } = useTr();
  const [text, setText] = useState("");
  const lines = text.split("\n").map(l=>l.trim()).filter(Boolean);
  const handleSave = () => { if (lines.length > 0) { onSave(lines); onClose(); } };
  return (
    <Modal title="➕ Añadir varias figuras" onClose={onClose}>
      <p style={{fontSize:13,color:"var(--text3)",marginBottom:12}}>
        Escribe un nombre por línea. Se crearán todas con emoji ⭐ por defecto — luego puedes editar cada una para añadir imagen y emoji.
      </p>
      <textarea
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder={"Goku SSJ\nGohan SSJ\nTrunks\nVegeta"}
        rows={8}
        style={{width:"100%",padding:"10px",fontSize:14,border:"1px solid var(--border)",borderRadius:8,outline:"none",resize:"vertical",fontFamily:"system-ui,sans-serif",boxSizing:"border-box" as const}}
        autoFocus
      />
      {lines.length > 0 && (
        <div style={{marginTop:10,padding:"8px 12px",background:"var(--bg3)",borderRadius:8,fontSize:12,color:"var(--text2)"}}>
          {lines.length} figura{lines.length!==1?"s":""} a añadir: {lines.slice(0,5).join(", ")}{lines.length>5?` y ${lines.length-5} más`:""}
        </div>
      )}
      <div style={{marginTop:16,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={handleSave} variant="primary" >{t("save")} ({lines.length})</Btn>
      </div>
    </Modal>
  );
}

// ============================================================
//  SET CARD
// ============================================================
function MoveFigureModal({ figure, series, currentSetId, onMove, onClose }: { figure: Figure; series: Series; currentSetId: number; onMove:(destSetId:number,destGroupId?:number)=>void; onClose:()=>void }) {
  const { t } = useTr();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:20,width:"100%",maxWidth:360,maxHeight:"75vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{t("moveFigureTitle")}</div>
        <div style={{fontSize:12,color:"var(--text3)",marginBottom:16}}>{figure.emoji} {figure.name}</div>

        {series.sets.length > 0 && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text4)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{t("moveFigureUngrouped")}</div>
            {series.sets.filter(st=>st.id!==currentSetId).map(st => (
              <button key={st.id} onClick={()=>onMove(st.id)}
                style={{display:"block",width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:13,marginBottom:6,color:"var(--text)"}}>
                {st.name}
              </button>
            ))}
          </div>
        )}

        {series.groups.map(g => (
          <div key={g.id} style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text4)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{g.name}</div>
            {g.sets.filter(st=>st.id!==currentSetId).map(st => (
              <button key={st.id} onClick={()=>onMove(st.id, g.id)}
                style={{display:"block",width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:13,marginBottom:6,color:"var(--text)"}}>
                {st.name}
              </button>
            ))}
            {g.sets.filter(st=>st.id!==currentSetId).length === 0 && (
              <div style={{fontSize:11,color:"var(--text4)",fontStyle:"italic"}}>—</div>
            )}
          </div>
        ))}

        <button onClick={onClose} style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:"transparent",color:"var(--text3)",cursor:"pointer",fontSize:13,marginTop:4}}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

function SetCard({ set, color, series, owned, wishlist, apiKey, onToggle, onToggleWish, onToggleAll, onUpdateSet, onDeleteSet, onDuplicate, onMoveToGroup, groups, onAddFigure, onAddFigures, onUpdateFigure, onDeleteFigure, onReorderFigures, onSwapCross, onMoveFigure, communityOwned, communityWished, figuresWithPhotos, userId, cardSize }: {
  set:FigureSet; color:string; series:Series; owned:Set<number>; wishlist:Set<number>; apiKey:string;
  onToggle:(id:number)=>void; onToggleWish:(id:number)=>void; onToggleAll:(ids:number[],markAs:boolean)=>void;
  onUpdateSet:(n:string,rd:string,sl:string)=>void; onDeleteSet:()=>void; onDuplicate:()=>void;
  onMoveToGroup?:(gid:number)=>void; groups?:FigureGroup[];
  onAddFigure:(f:Omit<Figure,"id">&{id?:number})=>void; onAddFigures:(fs:Omit<Figure,"id">[])=>void; onUpdateFigure:(id:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(id:number)=>void;
  onReorderFigures:(setId:number, figures:Figure[])=>void;
  onSwapCross?:(fromId:number,toId:number)=>void;
  onMoveFigure?:(figureId:number,destSetId:number,destGroupId?:number)=>void;
  communityOwned?:Record<number,number>; communityWished?:Record<number,number>;
  figuresWithPhotos?:Record<number,number>; userId?:string;
  cardSize?:"s"|"m"|"l";
}) {
  const { t, lang } = useTr();
  const isAdmin = useAdmin();
  const [movingFigure, setMovingFigure] = useState<Figure | null>(null);
  const [open,setOpen]=useState(false); const [editSet,setEditSet]=useState(false);
  const [addFigure,setAddFigure]=useState(false); const [bulkAdd,setBulkAdd]=useState(false);
  const [editFigure,setEditFigure]=useState<Figure|null>(null);
  const [showMoveMenu,setShowMoveMenu]=useState(false);
  const [quickCrop,setQuickCrop]=useState<{file:File;figureId:number}|null>(null);
  const [uploading,setUploading]=useState(false);
  const [reorderFromId,setReorderFromId]=useState<number|null>(null);
  void reorderFromId;
  const [detailFigure,setDetailFigure]=useState<Figure|null>(null);
  const ownedCount = set.figures.filter(f=>owned.has(f.id)).length;
  const total = set.figures.length; const complete = ownedCount===total && total>0;

  const formatDate = (d?: string) => {
    if (!d) return null;
    const [y, m] = d.split("-");
    const months = T.months[lang];
    return `${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div style={{marginBottom:12,border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",background:"var(--bg)"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:open?"var(--bg2)":"var(--bg)"}}>
        <div style={{flex:1,marginRight:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
            {set.seriesLogo && <img src={set.seriesLogo} alt="" style={{height:20,maxWidth:80,objectFit:"contain"}} />}
            <span style={{fontSize:15,fontWeight:600}}>{set.name}</span>
            {set.releaseDate && <span style={{fontSize:11,color:"var(--text4)"}}>📅 {formatDate(set.releaseDate)}</span>}
            <span style={{fontSize:12,padding:"2px 10px",borderRadius:20,background:complete?"#e6f4fd":"#f0f0ec",color:complete?"#0174b0":"#888",fontWeight:complete?600:400}}>
              {complete ? t("complete") : `${ownedCount}/${total}`}
            </span>
            <button onClick={e=>{e.stopPropagation();onToggleAll(set.figures.map(f=>f.id),!complete);}}
              style={{fontSize:11,padding:"2px 8px",borderRadius:12,border:"1px solid "+(complete?"#fca5a5":"#0174b0"),background:complete?"#fee2e2":"#e6f4fd",color:complete?"#dc2626":"#0174b0",cursor:"pointer",fontWeight:500}}>
              {complete ? t("unmarkAll") : t("markAll")}
            </button>
          </div>
          <ProgressBar value={ownedCount} total={total} color={color} />
        </div>
        <span style={{fontSize:18,color:"var(--text4)",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>⌄</span>
      </div>
      {open && <div style={{padding:"12px 16px 16px",borderTop:"1px solid var(--border)"}}>
        {isAdmin && <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",position:"relative"}}>
          <Btn small onClick={()=>setAddFigure(true)} variant="primary">{t("addFigure")}</Btn>
          <Btn small onClick={()=>setBulkAdd(true)} variant="primary">➕ Añadir varias</Btn>
          <Btn small onClick={()=>setEditSet(true)}>{t("editSetBtn")}</Btn>
          <Btn small onClick={onDuplicate}>📋 Duplicar</Btn>
          {!!onMoveToGroup && !!groups && groups.length > 0 && (
            <div style={{position:"relative"}}>
              <Btn small onClick={()=>setShowMoveMenu(m=>!m)}>📂 Mover a...</Btn>
              {showMoveMenu && (
                <div style={{position:"absolute",bottom:"100%",left:0,zIndex:50,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,boxShadow:"0 -4px 12px rgba(0,0,0,0.15)",minWidth:160,marginBottom:4,maxHeight:240,overflowY:"auto"}}>
                  {groups.map(g=>(
                    <div key={g.id} onClick={()=>{onMoveToGroup(g.id);setShowMoveMenu(false);}}
                      style={{padding:"8px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",display:"flex",alignItems:"center",gap:8}}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {g.logo && <img src={g.logo} alt="" style={{height:16,maxWidth:40,objectFit:"contain"}} />}
                      {g.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <Btn small onClick={onDeleteSet} variant="danger">{t("deleteSetBtn")}</Btn>
        </div>}
        <div style={{display:"grid",gridTemplateColumns: cardSize==="s"?"repeat(auto-fill, minmax(90px, 1fr))" : cardSize==="l"?"repeat(auto-fill, minmax(160px, 1fr))" : "repeat(auto-fill, minmax(120px, 1fr))",gap:10}}>
          {set.figures.map(f=>(
            <div key={f.id}
              onDragOver={(e)=>{ if(e.dataTransfer.types.includes("wcf_reorder_id")) e.preventDefault(); }}
              onDrop={(e)=>{ const fromId = parseInt(e.dataTransfer.getData("wcf_reorder_id")); if(!fromId||fromId===f.id) return; e.preventDefault(); e.stopPropagation();
                const figs=[...set.figures]; const fi=figs.findIndex(x=>x.id===fromId); const ti=figs.findIndex(x=>x.id===f.id);
                if(fi===-1||ti===-1) return; const [m]=figs.splice(fi,1); figs.splice(ti,0,m); onReorderFigures(set.id,figs); setReorderFromId(null);
              }}>
              <FigureCard figure={f} color={color} isOwned={owned.has(f.id)} isWished={wishlist.has(f.id)}
              onToggle={()=>onToggle(f.id)} onToggleWish={()=>onToggleWish(f.id)} onEdit={()=>setEditFigure(f)} onDelete={()=>onDeleteFigure(f.id)}
              onQuickUpload={isAdmin ? (file)=>setQuickCrop({file,figureId:f.id}) : undefined}
              onSwapImage={isAdmin ? (fromId)=>{
                const fromFig = set.figures.find(x=>x.id===fromId);
                if(fromFig) {
                  onUpdateFigure(fromFig.id, {...fromFig, image: f.image??""});
                  onUpdateFigure(f.id, {...f, image: fromFig.image??""});
                } else if(onSwapCross) {
                  onSwapCross(fromId, f.id);
                }
              } : undefined}
              onReorderStart={isAdmin ? ()=>setReorderFromId(f.id) : undefined}
              onMove={isAdmin && onMoveFigure ? ()=>setMovingFigure(f) : undefined}
              onDetail={()=>setDetailFigure(f)}
              userPhotoCount={figuresWithPhotos?.[f.id]??0}
            />
            </div>
          ))}
        </div>
      </div>}
      {editSet && <SetModal title={t("editSetTitle")} initial={set} apiKey={apiKey} onSave={(n,rd,sl)=>{onUpdateSet(n,rd,sl);setEditSet(false);}} onClose={()=>setEditSet(false)} />}
      {addFigure && <FigureModal title={t("newFigureTitle")} apiKey={apiKey} onSave={(f, markAsNews)=>{
        const newFigureId = newId();
        onAddFigure({...f, id: newFigureId});
        if (markAsNews) {
          supabase.from("wcf_announcements").insert({
            figure_id: String(newFigureId),
            image_url: f.image,
            title: f.name,
            franchise_id: String(series.id),
            active: true,
          }).then(({ error }) => { if (error) console.error("Error guardando novedad:", error); });
        }
        setAddFigure(false);
      }} onClose={()=>setAddFigure(false)} />}
      {bulkAdd && <BulkAddModal onSave={names=>{
        onAddFigures(names.map(name=>({name,emoji:"⭐",image:""})));
        setBulkAdd(false);
      }} onClose={()=>setBulkAdd(false)} />}
      {detailFigure && (() => {
        const idx = set.figures.findIndex(f=>f.id===detailFigure.id);
        return (
          <FigureDetailModal
            figure={detailFigure} set={set} series={series}
            isOwned={owned.has(detailFigure.id)} isWished={wishlist.has(detailFigure.id)&&!owned.has(detailFigure.id)}
            onToggle={()=>onToggle(detailFigure.id)} onToggleWish={()=>onToggleWish(detailFigure.id)}
            onClose={()=>setDetailFigure(null)}
            onPrev={idx>0?()=>setDetailFigure(set.figures[idx-1]):undefined}
            onNext={idx<set.figures.length-1?()=>setDetailFigure(set.figures[idx+1]):undefined}
            communityOwned={communityOwned?.[detailFigure.id]??0}
            communityWished={communityWished?.[detailFigure.id]??0}
            userId={userId}
          />
        );
      })()}
      {editFigure && <FigureModal title={t("editFigureTitle")} initial={editFigure} apiKey={apiKey} onSave={(f, markAsNews, wasNews)=>{
        onUpdateFigure(editFigure.id, f);
        if (markAsNews && !wasNews) {
          supabase.from("wcf_announcements").insert({
            figure_id: String(editFigure.id),
            image_url: f.image,
            title: f.name,
            franchise_id: String(series.id),
            active: true,
          }).then(({ error }) => { if (error) console.error("Error guardando novedad:", error); });
        } else if (!markAsNews && wasNews) {
          supabase.from("wcf_announcements").update({ active: false }).eq("figure_id", String(editFigure.id)).eq("active", true)
            .then(({ error }) => { if (error) console.error("Error quitando novedad:", error); });
        }
        setEditFigure(null);
      }} onClose={()=>setEditFigure(null)} />}
      {movingFigure && onMoveFigure && (
        <MoveFigureModal
          figure={movingFigure}
          series={series}
          currentSetId={set.id}
          onMove={(destSetId, destGroupId) => { onMoveFigure(movingFigure.id, destSetId, destGroupId); setMovingFigure(null); }}
          onClose={()=>setMovingFigure(null)}
        />
      )}
      {quickCrop && (
        <CropModal
          imageSrc={URL.createObjectURL(quickCrop.file)}
          aspectRatio={1}
          onConfirm={async(blob)=>{
            setQuickCrop(null); setUploading(true);
            try {
              const url = await uploadToR2(blob);
              const fig = set.figures.find(f=>f.id===quickCrop.figureId);
              if(fig) onUpdateFigure(quickCrop.figureId, {...fig, image:url});
            } catch(e){ console.error(e); }
            setUploading(false);
          }}
          onClose={()=>setQuickCrop(null)}
        />
      )}
      {uploading && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>⏳ {t("uploading")}</div>}
    </div>
  );
}

// ============================================================
//  SEARCH RESULT CARD
// ============================================================
function SearchResultCard({ figure, series, set, groupName, isOwned, isWished, onToggle, onToggleWish, onEdit, compact=false, hideIcons=false, communityOwned=0, communityWished=0, userId, userPhotoCount=0 }: { figure:Figure; series:Series; set:FigureSet; groupName?:string; isOwned:boolean; isWished:boolean; onToggle:()=>void; onToggleWish:()=>void; onEdit?:(f:Omit<Figure,"id">)=>void; compact?:boolean; hideIcons?:boolean; communityOwned?:number; communityWished?:number; userId?:string; userPhotoCount?:number }) {
  const { t, lang } = useTr();
  const isAdmin = useAdmin();
  const [imgError,setImgError]=useState(false); const hasImage = !!figure.image && !imgError;
  const retryCount = useRef(0);
  const [hover, setHover]=useState(false);
  const [editing, setEditing]=useState(false);
  const [showDetail, setShowDetail]=useState(false);
  const formatDate = (d?: string) => { if (!d) return null; const [y, m] = d.split("-"); return `${T.months[lang][parseInt(m)-1]} ${y}`; };
  const MONTHS_FULL: Record<LangCode, string[]> = {
    es: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    fr: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    vi: ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"],
    ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    zh: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    th: ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
  };
  const formatDateFull = (d?: string) => { if (!d) return null; const [y, m] = d.split("-"); return `${MONTHS_FULL[lang][parseInt(m)-1]} ${y}`; };
  return (
    <>
    <div style={{border:"1px solid "+(isOwned?series.color:isWished?"#f59e0b":"var(--border)"),borderRadius:8,background:isOwned?series.color+"18":isWished?"#fffbeb":"var(--card-bg)",overflow:"hidden",transition:"transform 0.15s",position:"relative"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";setHover(true);}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";setHover(false);}}>
      {isAdmin && hover && !compact && (
        <button onClick={e=>{e.stopPropagation();setEditing(true);}}
          style={{position:"absolute",bottom:4,left:4,zIndex:5,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>✏️</button>
      )}
      {!hideIcons && !isOwned && (
        <button onClick={e=>{e.stopPropagation();onToggleWish();}}
          style={{position:"absolute",top:4,left:4,zIndex:3,background:isWished?"#fef3c7":"rgba(255,255,255,0.85)",border:"1px solid "+(isWished?"#fcd34d":"#e8e8e4"),borderRadius:5,padding:"1px 4px",fontSize:11,cursor:"pointer",lineHeight:1}}>
          {isWished?"💛":"🤍"}
        </button>
      )}
      <div onClick={onToggle} style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:isOwned?series.color+"30":"var(--missing-bg)",overflow:"hidden",position:"relative",opacity:isOwned?1:isWished?0.75:0.45,transition:"opacity 0.3s",cursor:"pointer"}}>
        {hasImage ? <img src={figure.image} alt={figure.name} loading="lazy" onError={(e)=>{
            if (retryCount.current < 2) {
              retryCount.current++;
              const img = e.currentTarget;
              setTimeout(()=>{ img.src = figure.image + (figure.image!.includes("?") ? "&" : "?") + "retry=" + Date.now(); }, 600 * retryCount.current);
            } else {
              setImgError(true);
            }
          }} style={{width:"100%",height:"100%",objectFit:"cover"}} />
          : <div style={{textAlign:"center"}}><div style={{fontSize:compact?24:34}}>{figure.emoji}</div></div>}
        {!hideIcons && isOwned && <div style={{position:"absolute",bottom:4,left:4,zIndex:2,width:16,height:16,borderRadius:"50%",background:series.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>✓</div>}
        {!hideIcons && isWished && !isOwned && <div style={{position:"absolute",bottom:4,left:4,zIndex:2,fontSize:12}}>💛</div>}
        {/* User photos badge */}
        {userPhotoCount > 0 && (
          <div style={{position:"absolute",bottom:4,right:4,zIndex:3,background:series.color,borderRadius:10,padding:"1px 5px",display:"flex",alignItems:"center",gap:2,fontSize:8,color:"#fff",fontWeight:700,lineHeight:1}}>
            <span style={{fontSize:9,lineHeight:1,display:"flex",alignItems:"center"}}>📷</span>
            <span>+{userPhotoCount}</span>
          </div>
        )}
        {/* Zoom button */}
        {hasImage && !compact && (
          <button onClick={e=>{e.stopPropagation();setShowDetail(true);}}
            style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.45)",border:"none",borderRadius:6,color:"#fff",width:22,height:22,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5}}>🔍</button>
        )}
      </div>
      <div style={{padding:compact?"4px 6px 6px":"8px 10px 10px"}}>
        {/* Line 1 — series + category tag (always) */}
        <div style={{fontSize:10,color:"var(--text4)",marginBottom:2,display:"flex",alignItems:"center",gap:3,flexWrap:"nowrap",overflow:"hidden"}}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{series.name}</span>
          <span style={{flexShrink:0,padding:"1px 4px",borderRadius:5,fontSize:9,fontWeight:600,background:series.category==="oficial"?"#e6f4fd":"#ede9fe",color:series.category==="oficial"?"#0174b0":"#7c3aed",whiteSpace:"nowrap"}}>
            {series.category==="oficial" ? t("officialBadge") : t("resinBadge")}
          </span>
          {figure.tags && <span style={{flexShrink:0,fontSize:9,color:"var(--text4)"}} title={figure.tags}>🏷️</span>}
        </div>
        {compact ? <>
          {/* Line 2 — figure name, 1 line, shrinking font */}
          <div style={{fontWeight:600,lineHeight:1.3,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:figure.name.length>14?9:figure.name.length>10?10:11}}>{figure.name}</div>
          {/* Line 3 — group (resina) or set name */}
          <div style={{fontSize:9,color:"var(--text4)",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {series.category==="resina" && groupName ? groupName : set.name}
          </div>
          {/* Line 4 — set name with calendar (resina) or full date with calendar (oficial) */}
          <div style={{fontSize:9,color:"var(--text4)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {series.category==="resina" ? `📅 ${set.name}` : (set.releaseDate ? `📅 ${formatDateFull(set.releaseDate)}` : "")}
          </div>
        </> : <>
          <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,marginBottom:3,height:"2.6em",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{figure.name}</div>
          <div style={{fontSize:11,color:"var(--text4)",marginBottom:2}}>{groupName && series.category==="resina" ? `${groupName} ${set.name}` : set.name}</div>
          {set.releaseDate && <div style={{fontSize:11,color:"var(--text4)",marginBottom:4}}>📅 {formatDate(set.releaseDate)}</div>}
          <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:isOwned?series.color:isWished?"#d97706":"var(--text4)",fontWeight:(isOwned||isWished)?600:400,cursor:"pointer"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:isOwned?series.color:isWished?"#f59e0b":"#ccc",flexShrink:0}} />
            {isOwned ? t("owned") : isWished ? t("inWishlist") : t("missing")}
          </div>
        </>}
      </div>
    </div>
    {editing && onEdit && <FigureModal title={t("editFigureTitle")} initial={figure} apiKey={IMGBB_KEY} onSave={(f, markAsNews, wasNews)=>{
      onEdit(f);
      if (markAsNews && !wasNews) {
        supabase.from("wcf_announcements").insert({
          figure_id: String(figure.id),
          image_url: f.image,
          title: f.name,
          franchise_id: String(series.id),
          active: true,
        }).then(({ error }) => { if (error) console.error("Error guardando novedad:", error); });
      } else if (!markAsNews && wasNews) {
        supabase.from("wcf_announcements").update({ active: false }).eq("figure_id", String(figure.id)).eq("active", true)
          .then(({ error }) => { if (error) console.error("Error quitando novedad:", error); });
      }
      setEditing(false);
    }} onClose={()=>setEditing(false)} />}
    {showDetail && <FigureDetailModal figure={figure} set={set} series={series} isOwned={isOwned} isWished={isWished} onToggle={onToggle} onToggleWish={onToggleWish} onClose={()=>setShowDetail(false)} communityOwned={communityOwned} communityWished={communityWished} userId={userId} />}
    </> 
  );
}

// ============================================================
//  SEARCH RESULTS


// ============================================================
//  GROUP MODAL
// ============================================================
function GroupModal({ title, initial, apiKey, onSave, onClose }: {
  title:string; initial?:Partial<FigureGroup>; apiKey:string;
  onSave:(name:string,logo:string)=>void; onClose:()=>void;
}) {
  const { t } = useTr();
  const [name,setName]=useState(initial?.name??"");
  const [logo,setLogo]=useState(initial?.logo??"");
  return (
    <Modal title={title} onClose={onClose}>
      <Field label={t("nameLabel")}><Input value={name} onChange={setName} placeholder="Ej: Dragon Ball Z" /></Field>
      <ImageUploader apiKey={apiKey} currentUrl={logo} onUploaded={setLogo} label="Logo del grupo (opcional)" aspectRatio={null} format="png" skipCrop />
      <div style={{marginTop:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{if(name.trim()){onSave(name.trim(),logo);onClose();}}} variant="primary">{t("save")}</Btn>
      </div>
    </Modal>
  );
}

// ============================================================
//  GROUP CARD
// ============================================================
function GroupCard({ group, color, series, owned, wishlist, apiKey, onToggle, onToggleWish, onToggleAll, onUpdateGroup, onDeleteGroup, onAddSet, onUpdateSet, onDeleteSet, onDuplicateSet, onAddFigure, onAddFigures, onReorderFigures, onReorderSets, onUpdateFigure, onDeleteFigure, onSwapCross, onMoveFigure, communityOwned, communityWished, figuresWithPhotos, userId, cardSize }: {
  group:FigureGroup; color:string; series:Series; owned:Set<number>; wishlist:Set<number>; apiKey:string;
  onToggle:(id:number)=>void; onToggleWish:(id:number)=>void; onToggleAll:(ids:number[],markAs:boolean)=>void;
  onUpdateGroup:(name:string,logo:string)=>void; onDeleteGroup:()=>void; onAddSet:()=>void;
  onUpdateSet:(stid:number,n:string,rd:string,sl:string)=>void; onDeleteSet:(stid:number)=>void; onDuplicateSet:(stid:number)=>void;
  onAddFigure:(stid:number,f:Omit<Figure,"id">&{id?:number})=>void; onAddFigures:(stid:number,fs:Omit<Figure,"id">[])=>void; onUpdateFigure:(stid:number,fid:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(stid:number,fid:number)=>void;
  onReorderFigures:(stid:number,figures:Figure[])=>void;
  onReorderSets?:(sets:FigureSet[])=>void;
  onSwapCross?:(fromId:number,toId:number)=>void;
  onMoveFigure?:(figureId:number,destSetId:number,destGroupId?:number)=>void;
  communityOwned?:Record<number,number>; communityWished?:Record<number,number>;
  figuresWithPhotos?:Record<number,number>; userId?:string;
  cardSize?:"s"|"m"|"l";
}) {
  const { t } = useTr();
  const isAdmin = useAdmin();
  const [open,setOpen]=useState(false);
  const [editGroup,setEditGroup]=useState(false);
  const [imgError,setImgError]=useState(false);

  const allFigs = group.sets.flatMap(st=>st.figures);
  const ownedCount = allFigs.filter(f=>owned.has(f.id)).length;
  const total = allFigs.length;
  const complete = ownedCount===total && total>0;

  const moveSet = (idx:number, dir:-1|1) => {
    const to = idx+dir;
    if(to<0 || to>=group.sets.length || !onReorderSets) return;
    const sets = [...group.sets];
    const [m] = sets.splice(idx,1);
    sets.splice(to,0,m);
    onReorderSets(sets);
  };

  return (
    <div style={{marginBottom:16,border:"2px solid var(--border2)",borderRadius:14,overflow:"hidden",background:"var(--bg2)"}}>
      {/* Group header */}
      <div onClick={()=>setOpen(!open)} style={{padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:"var(--bg3)"}}>
        {group.logo && !imgError && <img src={group.logo} alt={group.name} onError={()=>setImgError(true)} style={{height:24,maxWidth:80,objectFit:"contain"}} />}
        <span style={{fontSize:15,fontWeight:700,flex:1,color:"var(--text)"}}>{group.name} <span style={{fontSize:12,color:"var(--text4)",fontWeight:400}}>({group.sets.length} set{group.sets.length!==1?"s":""})</span></span>
        <span style={{fontSize:12,padding:"2px 10px",borderRadius:20,background:complete?"#e6f4fd":"var(--bg)",color:complete?"#0174b0":"var(--text3)",fontWeight:complete?600:400}}>
          {complete ? t("complete") : `${ownedCount}/${total}`}
        </span>
        <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
          {isAdmin && <>
            <button onClick={()=>setEditGroup(true)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 7px",fontSize:11,cursor:"pointer",color:"var(--text3)"}}>✏️</button>
            <button onClick={onAddSet} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 7px",fontSize:11,cursor:"pointer",color:"var(--text3)"}}>+ Set</button>
            <button onClick={onDeleteGroup} style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"2px 7px",fontSize:11,cursor:"pointer",color:"#dc2626"}}>🗑</button>
          </>}
        </div>
        <span style={{fontSize:16,color:"var(--text4)",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",marginLeft:4}}>⌄</span>
      </div>
      {/* Group sets */}
      {open && (
        <div style={{padding:"8px 12px 12px"}}>
          {group.sets.length===0 && <div style={{textAlign:"center",padding:"1.5rem",color:"var(--text4)",fontSize:13}}>Sin sets. Pulsa "+ Set" para añadir.</div>}
          {group.sets.map((st,idx)=>(
            <div key={st.id} style={{display:"flex",alignItems:"flex-start",gap:6}}>
              {isAdmin && onReorderSets && group.sets.length>1 && (
                <div style={{display:"flex",flexDirection:"column",gap:2,paddingTop:14}}>
                  <button onClick={()=>moveSet(idx,-1)} disabled={idx===0}
                    style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 5px",fontSize:11,cursor:idx===0?"default":"pointer",color:idx===0?"var(--text4)":"var(--text3)",opacity:idx===0?0.4:1}}>▲</button>
                  <button onClick={()=>moveSet(idx,1)} disabled={idx===group.sets.length-1}
                    style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 5px",fontSize:11,cursor:idx===group.sets.length-1?"default":"pointer",color:idx===group.sets.length-1?"var(--text4)":"var(--text3)",opacity:idx===group.sets.length-1?0.4:1}}>▼</button>
                </div>
              )}
              <div style={{flex:1}}>
                <SetCard set={st} color={color} owned={owned} wishlist={wishlist} apiKey={apiKey}
                  onToggle={onToggle} onToggleWish={onToggleWish} onToggleAll={onToggleAll}
                  onUpdateSet={(n,rd,sl)=>onUpdateSet(st.id,n,rd,sl)}
                  onDeleteSet={()=>onDeleteSet(st.id)}
                  onDuplicate={()=>onDuplicateSet(st.id)}
                  series={series}
                  onAddFigure={(f)=>onAddFigure(st.id,f)}
                  onAddFigures={(fs)=>onAddFigures(st.id,fs)}
                  onReorderFigures={(_, figs)=>onReorderFigures(st.id, figs)}
                  onUpdateFigure={(fid,f)=>onUpdateFigure(st.id,fid,f)}
                  onDeleteFigure={(fid)=>onDeleteFigure(st.id,fid)}
                  onSwapCross={onSwapCross}
                  onMoveFigure={onMoveFigure}
                  communityOwned={communityOwned} communityWished={communityWished}
                  figuresWithPhotos={figuresWithPhotos} userId={userId}
                  cardSize={cardSize}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {editGroup && <GroupModal title="Editar grupo" initial={group} apiKey={apiKey} onSave={(n,l)=>{onUpdateGroup(n,l);setEditGroup(false);}} onClose={()=>setEditGroup(false)} />}
    </div>
  );
}

// ============================================================
//  DRAGGABLE GROUP LIST
// ============================================================

// ============================================================
//  DRAGGABLE SET LIST
// ============================================================

// ============================================================
//  APP
// ============================================================
// ============================================================
//  DRAGGABLE SERIES LIST
// ============================================================

// ============================================================
//  APP
// ============================================================
// ============================================================
//  STATS TAB
// ============================================================
function StatsTab({ data, owned, wishlist, favourites, allFlat, seriesOwned, seriesTotal, onOpenPicker }: {
  data:Series[]; owned:Set<number>; wishlist:Set<number>; favourites:Set<number>;
  allFlat:{figure:Figure;series:Series}[]; seriesOwned:(s:Series)=>number; seriesTotal:(s:Series)=>number;
  onOpenPicker:()=>void;
}) {
  const { t } = useTr();
  const figureFranchiseMap = useFigureFranchiseMap(data);
  const ownedIdsArr = useMemo(() => [...owned], [owned]);

  const favSeries = data.filter(s=>favourites.has(s.id));
  const favOficial = favSeries.filter(s=>s.category==="oficial");
  const favResina = favSeries.filter(s=>s.category==="resina");
  // Use allFlat (with tags) to count figures per fav series
  const favFlat = allFlat.filter(({series})=>favourites.has(series.id));
  const totalFavFigs = favFlat.length;
  const ownedFavFigs = favFlat.filter(({figure})=>owned.has(figure.id)).length;
  const wishFavFigs = favFlat.filter(({figure})=>wishlist.has(figure.id)&&!owned.has(figure.id)).length;
  const pct = totalFavFigs ? Math.round(ownedFavFigs/totalFavFigs*100) : 0;

  // Solo mostramos badges de las franquicias presentes entre tus series favoritas
  const favFranchiseKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const s of favSeries) {
      const f = FRANCHISES.find(fr => fr.match(s.name));
      if (f) keys.add(f.key);
    }
    return keys;
  }, [favSeries]);

  const myBadgeProgress = useMemo(() => {
    const counts: Record<string,number> = {};
    for (const id of ownedIdsArr) {
      const key = figureFranchiseMap.get(id);
      if (key) counts[key] = (counts[key] ?? 0) + 1;
    }
    const rows = FRANCHISES.filter(f => favFranchiseKeys.has(f.key)).map(f => {
      const count = counts[f.key] ?? 0;
      const tier = tierForCount(count, f.thresholds);
      const nextThreshold = tier < f.thresholds.length ? f.thresholds[tier] : null;
      return {
        key: f.key, label: f.label, color: f.color, count, tier,
        icon: tier > 0 ? f.icons[tier-1] : f.icons[0],
        tierName: tier > 0 ? t(f.tierNames[tier-1] as TKey) : null,
        nextThreshold, remaining: nextThreshold !== null ? nextThreshold - count : 0,
      };
    });
    const globalTier = tierForCount(ownedIdsArr.length, GLOBAL_BADGE.thresholds);
    const globalNext = globalTier < GLOBAL_BADGE.thresholds.length ? GLOBAL_BADGE.thresholds[globalTier] : null;
    const global = {
      key:"global", label: t("globalBadgeLabel"), color: GLOBAL_BADGE.color, count: ownedIdsArr.length, tier: globalTier,
      icon: globalTier > 0 ? GLOBAL_BADGE.icons[globalTier-1] : GLOBAL_BADGE.icons[0],
      tierName: globalTier > 0 ? t(GLOBAL_BADGE.tierNames[globalTier-1] as TKey) : null,
      nextThreshold: globalNext, remaining: globalNext !== null ? globalNext - ownedIdsArr.length : 0,
    };
    return [global, ...rows];
  }, [ownedIdsArr, figureFranchiseMap, favFranchiseKeys, t]);

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:10}}>🎖️ {t("myBadges")}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {myBadgeProgress.map(b => (
            <div key={b.key} style={{minWidth:0,borderRadius:12,padding:"12px 10px",background:"var(--bg2)",border:"1px solid var(--border)",textAlign:"center",opacity:b.tier>0?1:0.5}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
                <BadgeIcon icon={b.icon} size={28} />
              </div>
              <div style={{fontSize:12,fontWeight:700,color:b.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.tierName ?? "—"}</div>
              <div style={{fontSize:9,color:"var(--text3)",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.label}</div>
              <div style={{fontSize:9,color:"var(--text4)",marginTop:4}}>
                {b.nextThreshold !== null ? `${b.remaining} ${t("toNextLevel")}` : `✨ ${t("maxLevelReached")}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onOpenPicker}
        style={{width:"100%",padding:"12px",borderRadius:12,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        ⭐ {t("favSeries")} <span style={{fontSize:12,color:"var(--text3)",fontWeight:400}}>({favSeries.length})</span>
      </button>
      {favSeries.length===0 ? (
        <div style={{textAlign:"center",padding:"4rem 1rem",color:"var(--text4)",fontSize:14}}>{t("noFavSeries")}</div>
      ) : (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
            {[
              {label:t("statsTotalOwned"), value:`${ownedFavFigs}/${totalFavFigs}`, sub:`${pct}%`, color:"#0174b0"},
              {label:t("statsTotalWish"), value:String(wishFavFigs), sub:"💛", color:"#f59e0b"},
              {label:t("statsCompletion"), value:`${pct}%`, sub:`${favSeries.length} series`, color:"#6366f1"},
            ].map(card=>(
              <div key={card.label} style={{borderRadius:12,padding:"12px 10px",background:"var(--bg2)",border:"1px solid var(--border)",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:card.color}}>{card.value}</div>
                <div style={{fontSize:9,color:"var(--text3)",marginTop:2}}>{card.sub}</div>
                <div style={{fontSize:10,color:"var(--text4)",marginTop:4}}>{card.label}</div>
              </div>
            ))}
          </div>
          {(["oficial","resina"] as CategoryType[]).map(cat=>{
            const catFav = cat==="oficial"?favOficial:favResina;
            if(catFav.length===0) return null;
            const sorted2 = [...catFav].sort((a,b)=>{
              const pa=seriesTotal(a)?seriesOwned(a)/seriesTotal(a):0;
              const pb=seriesTotal(b)?seriesOwned(b)/seriesTotal(b):0;
              return pb-pa;
            });
            return (
              <div key={cat} style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>
                  {cat==="oficial"?t("officialBadge"):t("resinBadge")}
                </div>
                {cat==="oficial" ? (
                  // Oficial — progress bar list
                  sorted2.map(s=>{
                    const ow=seriesOwned(s), tot=seriesTotal(s), wi=allFlat.filter(x=>x.series.id===s.id&&wishlist.has(x.figure.id)&&!owned.has(x.figure.id)).length;
                    const p=tot?Math.round(ow/tot*100):0;
                    return (
                      <div key={s.id} style={{marginBottom:12,padding:"12px 14px",borderRadius:12,background:"var(--bg2)",border:"1px solid var(--border)"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            {s.logo ? <img src={s.logo} alt={s.name} style={{height:18,maxWidth:80,objectFit:"contain"}} /> : <span style={{fontSize:14}}>{s.emoji}</span>}
                            <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{s.name}</span>
                          </div>
                          <span style={{fontSize:13,fontWeight:700,color:p===100?"#4ade80":s.color}}>{p}%</span>
                        </div>
                        <div style={{height:6,background:"var(--border)",borderRadius:4,overflow:"hidden",marginBottom:6}}>
                          <div style={{height:"100%",width:p+"%",background:p===100?"#4ade80":s.color,borderRadius:4,transition:"width 0.4s"}} />
                        </div>
                        <div style={{display:"flex",gap:12,fontSize:11,color:"var(--text3)"}}>
                          <span>✅ {ow}/{tot}</span>
                          {wi>0 && <span>💛 {wi}</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Resina — card grid without progress bar
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
                    {sorted2.map(s=>{
                      const ow=seriesOwned(s), wi=allFlat.filter(x=>x.series.id===s.id&&wishlist.has(x.figure.id)&&!owned.has(x.figure.id)).length;
                      return (
                        <div key={s.id} style={{position:"relative",borderRadius:12,overflow:"hidden",aspectRatio:"1",background:s.color+"33",border:`1px solid ${s.color}44`}}>
                          {s.bgImage && <img src={s.bgImage} alt={s.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />}
                          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.2) 55%,rgba(0,0,0,0) 100%)"}} />
                          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 10px"}}>
                            {s.logo
                              ? <img src={s.logo} alt={s.name} style={{height:16,maxWidth:"100%",objectFit:"contain",objectPosition:"left",marginBottom:6,display:"block"}} />
                              : <div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.2}}>{s.name}</div>
                            }
                            <div style={{display:"flex",gap:10,fontSize:12}}>
                              <span style={{color:"#fff",fontWeight:600}}>✅ {ow}</span>
                              {wi>0 && <span style={{color:"#fcd34d",fontWeight:600}}>💛 {wi}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  COMMUNITY TAB — global rankings (figures, uploaders, collectors)
// ============================================================
// Franquicias con badge propio. El "cap" limita el total de referencia usado
// para calcular el % (así Dragon Ball/One Piece no necesitan miles de figuras
// para alcanzar el nivel máximo).
// Umbrales ABSOLUTOS por franquicia (mínimo para alcanzar cada nivel), y nombre
// temático de cada nivel. El campo "icon" es un emoji de MARCADOR TEMPORAL —
// cuando tengas las imágenes propias, basta con poner aquí la URL de cada una
// (el render ya detecta si es una URL http y muestra <img> en vez del emoji).
const FRANCHISES: { key:string; label:string; match:(name:string)=>boolean; color:string; thresholds:number[]; tierNames:string[]; icons:string[] }[] = [
  { key:"dbz", label:"Dragon Ball", match:n=>n.includes("Dragon Ball"), color:"#f59e0b",
    thresholds:[1,50,150,300,500],
    tierNames:["badgeTier_dbz_1","badgeTier_dbz_2","badgeTier_dbz_3","badgeTier_dbz_4","badgeTier_dbz_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/normal64.png",
      "https://img.wcfchecklist.com/badges/ss1-64.png",
      "https://img.wcfchecklist.com/badges/ss3-64.png",
      "https://img.wcfchecklist.com/badges/ss4-64.png",
      "https://img.wcfchecklist.com/badges/ssg-64.png"
    ] },
  { key:"op", label:"One Piece", match:n=>n.includes("One Piece"), color:"#0174b0",
    thresholds:[1,100,300,600,1000],
    tierNames:["badgeTier_op_1","badgeTier_op_2","badgeTier_op_3","badgeTier_op_4","badgeTier_op_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/One%20Piece/luffy64.png",
      "https://img.wcfchecklist.com/badges/One%20Piece/supernova64.png",
      "https://img.wcfchecklist.com/badges/One%20Piece/shichibukai64.png",
      "https://img.wcfchecklist.com/badges/One%20Piece/yonko64.png",
      "https://img.wcfchecklist.com/badges/One%20Piece/king64.png"
    ] },
  { key:"naruto", label:"Naruto", match:n=>n.includes("Naruto"), color:"#f97316",
    thresholds:[1,15,45,90,150],
    tierNames:["badgeTier_naruto_1","badgeTier_naruto_2","badgeTier_naruto_3","badgeTier_naruto_4","badgeTier_naruto_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/Naruto/konohamaru64.png",
      "https://img.wcfchecklist.com/badges/Naruto/naruto64.png",
      "https://img.wcfchecklist.com/badges/Naruto/rocklee64.png",
      "https://img.wcfchecklist.com/badges/Naruto/kakashi64.png",
      "https://img.wcfchecklist.com/badges/Naruto/hokage64.png"
    ] },
  { key:"mha", label:"My Hero Academia", match:n=>n.includes("My Hero Academia"), color:"#dc2626",
    thresholds:[1,5,15,30,50],
    tierNames:["badgeTier_mha_1","badgeTier_mha_2","badgeTier_mha_3","badgeTier_mha_4","badgeTier_mha_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/My%20Hero%20Academia/midoriya64.png",
      "https://img.wcfchecklist.com/badges/My%20Hero%20Academia/mirio64.png",
      "https://img.wcfchecklist.com/badges/My%20Hero%20Academia/mount64.png",
      "https://img.wcfchecklist.com/badges/My%20Hero%20Academia/hawks64.png",
      "https://img.wcfchecklist.com/badges/My%20Hero%20Academia/allmight64.png"
    ] },
  { key:"hxh", label:"Hunter x Hunter", match:n=>n.includes("Hunter"), color:"#059669",
    thresholds:[1,10,30,60,100],
    tierNames:["badgeTier_hxh_1","badgeTier_hxh_2","badgeTier_hxh_3","badgeTier_hxh_4","badgeTier_hxh_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/Hunter/tonpa64.png",
      "https://img.wcfchecklist.com/badges/Hunter/gon64.png",
      "https://img.wcfchecklist.com/badges/Hunter/hisoka64.png",
      "https://img.wcfchecklist.com/badges/Hunter/ging64.png",
      "https://img.wcfchecklist.com/badges/Hunter/netero64.png"
    ] },
  { key:"kny", label:"Kimetsu no Yaiba", match:n=>n.includes("Kimetsu"), color:"#7c3aed",
    thresholds:[1,10,30,60,100],
    tierNames:["badgeTier_kny_1","badgeTier_kny_2","badgeTier_kny_3","badgeTier_kny_4","badgeTier_kny_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/Kimetsu%20no%20Yaiba/inosuke64.png",
      "https://img.wcfchecklist.com/badges/Kimetsu%20no%20Yaiba/tanjiro64.png",
      "https://img.wcfchecklist.com/badges/Kimetsu%20no%20Yaiba/akaza64.png",
      "https://img.wcfchecklist.com/badges/Kimetsu%20no%20Yaiba/rengoku64.png",
      "https://img.wcfchecklist.com/badges/Kimetsu%20no%20Yaiba/muzan64.png"
    ] },
  { key:"bleach", label:"Bleach", match:n=>n.includes("Bleach"), color:"#6366f1",
    thresholds:[1,10,30,60,100],
    tierNames:["badgeTier_bleach_1","badgeTier_bleach_2","badgeTier_bleach_3","badgeTier_bleach_4","badgeTier_bleach_5"],
    icons:[
      "https://img.wcfchecklist.com/badges/Bleach/ichigo64.png",
      "https://img.wcfchecklist.com/badges/Bleach/rukia64.png",
      "https://img.wcfchecklist.com/badges/Bleach/nelliel.png",
      "https://img.wcfchecklist.com/badges/Bleach/ulquiorra.png",
      "https://img.wcfchecklist.com/badges/Bleach/aizen64.png"
    ] },
];

// Badge global (todas las series juntas, no una franquicia concreta)
const GLOBAL_BADGE = {
  color:"#94a3b8",
  thresholds:[1,100,300,600,1000],
  tierNames:["badgeTier_global_1","badgeTier_global_2","badgeTier_global_3","badgeTier_global_4","badgeTier_global_5"],
  icons:["🥉","🥈","🥇","💎","👑"],
};

function tierForCount(count:number, thresholds:number[]): number {
  let tier = 0;
  for (let i=0;i<thresholds.length;i++) if (count >= thresholds[i]) tier = i+1;
  return tier;
}

// Renderiza un icono de badge: emoji tal cual, o <img> si en su día pones una URL
function BadgeIcon({ icon, size=12 }: { icon:string; size?:number }) {
  if (/^https?:\/\//.test(icon)) return <img src={icon} alt="" style={{width:size,height:size,objectFit:"contain",verticalAlign:"middle"}} />;
  return <span>{icon}</span>;
}


// Mapa figureId -> clave de franquicia (reutilizable desde cualquier pestaña)
function useFigureFranchiseMap(data: Series[]) {
  return useMemo(() => {
    const map = new Map<number,string>();
    for (const s of data) {
      const franchise = FRANCHISES.find(f => f.match(s.name));
      if (!franchise) continue;
      const figs = [...s.sets, ...s.groups.flatMap(g=>g.sets)].flatMap(st=>st.figures);
      for (const f of figs) map.set(f.id, franchise.key);
    }
    return map;
  }, [data]);
}

function getBadgesForOwnedIds(ownedIds: number[]|undefined, figureFranchiseMap: Map<number,string>, t: (key: TKey, ...args: unknown[]) => string) {
  if (!ownedIds || ownedIds.length === 0) return [];
  const counts: Record<string,number> = {};
  for (const id of ownedIds) {
    const key = figureFranchiseMap.get(id);
    if (key) counts[key] = (counts[key] ?? 0) + 1;
  }
  const badges = FRANCHISES.map(f => {
    const count = counts[f.key] ?? 0;
    const tier = tierForCount(count, f.thresholds);
    if (tier === 0) return null;
    return { key:f.key, icon:f.icons[tier-1], color:f.color, title:`${f.label}: ${count} — ${t(f.tierNames[tier-1] as TKey)}` };
  }).filter(Boolean) as {key:string;icon:string;color:string;title:string}[];

  const globalTier = tierForCount(ownedIds.length, GLOBAL_BADGE.thresholds);
  if (globalTier > 0) {
    badges.unshift({ key:"global", icon:GLOBAL_BADGE.icons[globalTier-1], color:GLOBAL_BADGE.color, title:`${t("globalBadgeLabel")}: ${ownedIds.length} — ${t(GLOBAL_BADGE.tierNames[globalTier-1] as TKey)}` });
  }
  return badges;
}

// ============================================================
//  MY COLLECTION — manage own collection photos (upload, delete, set cover)
// ============================================================
function MyCollectionPanel({ userId, uploaderName, uploaderAvatar, onClose }: { userId:string; uploaderName:string; uploaderAvatar?:string|null; onClose:()=>void }) {
  const { t } = useTr();
  const { photos, coverId, shareCode, loading, reload } = useMyCollectionPhotos(userId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string|null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const photoIds = useMemo(() => photos.filter(p=>p.approved).map(p=>p.id), [photos]);
  const { counts: likeCounts } = useCollectionLikes(photoIds, userId);
  const { counts: commentCounts } = useCollectionCommentCounts(photoIds);

  const approvedCount = photos.length; // pending also counts toward the limit to prevent gaming it
  const canAddMore = approvedCount < 15;

  const handleFile = async (file: File) => {
    if (!canAddMore) { setError(t("collectionLimitReached")); return; }
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImageForUpload(file);
      let url: string;
      try { url = await uploadToR2(compressed); }
      catch { url = await uploadToR2(compressed); } // reintento automático
      const nextOrder = photos.length; // se añade al final del orden actual
      await supabase.from("wcf_collection_photos").insert({ user_id: userId, url, uploader_name: uploaderName, uploader_avatar: uploaderAvatar ?? null, approved: false, sort_order: nextOrder });
      reload();
    } catch (e) {
      setError(t("uploadNetworkError"));
      console.error(e);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("wcf_collection_photos").delete().eq("id", id);
    if (coverId === id) await supabase.from("wcf_collection_settings").delete().eq("user_id", userId);
    setConfirmDeleteId(null);
    reload();
  };

  const handleSetCover = async (id: string) => {
    await supabase.from("wcf_collection_settings").upsert({ user_id: userId, cover_photo_id: id });
    reload();
  };

  const [dragPhotoId, setDragPhotoId] = useState<string|null>(null);
  const handleDropReorder = async (targetId: string) => {
    if (!dragPhotoId || dragPhotoId === targetId) { setDragPhotoId(null); return; }
    const arr = [...photos];
    const fi = arr.findIndex(p => p.id === dragPhotoId);
    const ti = arr.findIndex(p => p.id === targetId);
    setDragPhotoId(null);
    if (fi === -1 || ti === -1) return;
    const [moved] = arr.splice(fi, 1);
    arr.splice(ti, 0, moved);
    // Persistimos el nuevo orden completo (0,1,2...) para todas las fotos
    await Promise.all(arr.map((p, i) => supabase.from("wcf_collection_photos").update({ sort_order: i }).eq("id", p.id)));
    reload();
  };

  const handleShare = async () => {
    let code = shareCode;
    if (!code) {
      // Primera vez que comparte: generamos un código corto y lo guardamos.
      // Reintentamos por si hubiera una colisión rarísima con otro usuario.
      for (let attempt = 0; attempt < 3 && !code; attempt++) {
        const candidate = generateShareCode();
        const { error } = await supabase.from("wcf_collection_settings").upsert({ user_id: userId, share_code: candidate }, { onConflict: "user_id" });
        if (!error) code = candidate;
      }
      if (!code) code = userId; // fallback improbable: usamos el id largo si algo falla
    }
    const url = `${CANONICAL_ORIGIN}/c/${code}`;
    if (navigator.share) {
      try { await navigator.share({ url, title: t("collectionOf", uploaderName), text: t("shareCollectionText", uploaderName) }); return; } catch { /* cancelado, seguimos con el fallback */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch { /* no-op */ }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:520,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:20,width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontWeight:700,fontSize:16}}>🖼️ {t("myCollectionTitle")}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--text3)",lineHeight:1}}>✕</button>
        </div>
        <div style={{fontSize:12,color:"var(--text3)",marginBottom:6}}>{t("myCollectionDesc")}</div>
        <div style={{fontSize:11,color:"var(--text4)",fontWeight:600,marginBottom:12}}>{t("collectionPhotoLimit", approvedCount)}</div>

        <button onClick={handleShare}
          style={{width:"100%",fontSize:12,fontWeight:700,color:"#0196e3",background:"var(--bg2)",border:"1px solid #0196e3",borderRadius:10,padding:"9px 10px",cursor:"pointer",marginBottom:16}}>
          {shareCopied ? t("shareLinkCopied") : t("shareCollectionBtn")}
        </button>

        {loading ? (
          <div style={{textAlign:"center",padding:"24px 0",color:"var(--text4)",fontSize:12}}>...</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
            {photos.map((p) => (
              <div key={p.id}
                draggable
                onDragStart={e=>{ e.dataTransfer.setDragImage(TRANSPARENT_DRAG_IMG, 0, 0); setDragPhotoId(p.id); }}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();handleDropReorder(p.id);}}
                onDragEnd={()=>setDragPhotoId(null)}
                style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",background:"var(--bg2)",cursor:"grab",opacity:dragPhotoId===p.id?0.4:1,outline:dragPhotoId&&dragPhotoId!==p.id?"2px dashed #0196e3":"none"}}>
                <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:p.approved?1:0.5,pointerEvents:"none"}} />
                {photos.length > 1 && (
                  <div style={{position:"absolute",top:4,left:4,background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:6,width:18,height:18,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                    ⠿
                  </div>
                )}
                {!p.approved && (
                  <div style={{position:"absolute",top:4,left:photos.length>1?26:4,background:"rgba(0,0,0,0.7)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6}}>
                    {t("pendingReviewLabel")}
                  </div>
                )}
                {p.approved && (likeCounts[p.id] ?? 0) > 0 && (
                  <div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.65)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:6,display:"flex",alignItems:"center",gap:3}}>
                    ❤️ {likeCounts[p.id]}
                  </div>
                )}
                {p.approved && (commentCounts[p.id] ?? 0) > 0 && (
                  <div style={{position:"absolute",bottom:4,left:(likeCounts[p.id] ?? 0) > 0 ? 44 : 4,background:"rgba(0,0,0,0.65)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:6,display:"flex",alignItems:"center",gap:3}}>
                    💬 {commentCounts[p.id]}
                  </div>
                )}
                {p.approved && (
                  <button onClick={()=>handleSetCover(p.id)}
                    style={{position:"absolute",bottom:4,right:4,background:coverId===p.id?"#0196e3":"rgba(0,0,0,0.6)",color:"#fff",border:"none",borderRadius:6,fontSize:9,fontWeight:700,padding:"3px 5px",cursor:"pointer"}}>
                    {coverId===p.id ? "★" : "☆"}
                  </button>
                )}
                <button onClick={()=>setConfirmDeleteId(p.id)}
                  style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",borderRadius:"50%",width:20,height:20,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  ✕
                </button>
              </div>
            ))}
            {canAddMore && (
              <label style={{aspectRatio:"1",borderRadius:10,border:"1.5px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,color:"var(--text4)",background:"var(--bg2)",textAlign:"center",flexDirection:"column",gap:4}}>
                {uploading ? "⏳" : <>➕<span>{t("addCollectionPhoto")}</span></>}
                <input type="file" accept="image/*" style={{display:"none"}} disabled={uploading}
                  onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFile(f); }} />
              </label>
            )}
          </div>
        )}

        {error && <div style={{fontSize:11,color:"#dc2626",marginBottom:12,textAlign:"center"}}>{error}</div>}

        {confirmDeleteId && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:530,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setConfirmDeleteId(null)}>
            <div style={{background:"var(--bg)",borderRadius:14,padding:20,maxWidth:300,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:13,marginBottom:16}}>{t("removePhotoConfirm")}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setConfirmDeleteId(null)} style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:12}}>{t("cancel")}</button>
                <button onClick={()=>handleDelete(confirmDeleteId)} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>{t("deleteBtn")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
//  COLLECTIONS DIRECTORY + individual gallery — inside Community tab
// ============================================================
function CollectionPhotoZoom({ photos, index, onClose, onNav, currentUserId, currentUserName, currentUserAvatar, likeCounts, likedByMe, onToggleLike, onRequireLogin }: {
  photos: CollectionPhoto[]; index: number; onClose:()=>void; onNav:(i:number)=>void;
  currentUserId?: string|null; currentUserName?: string|null; currentUserAvatar?: string|null;
  likeCounts: Record<string,number>; likedByMe: Set<string>;
  onToggleLike:(id:string)=>void; onRequireLogin:()=>void;
}) {
  const { t, lang } = useTr();
  const photo = photos[index];
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const { comments, addComment, deleteComment } = useCollectionPhotoComments(photo?.id ?? null);
  const [translations, setTranslations] = useState<Record<string,string>>({});
  const [translating, setTranslating] = useState<Set<string>>(new Set());
  const [showingTranslation, setShowingTranslation] = useState<Set<string>>(new Set());

  const handleTranslate = async (commentId: string, text: string) => {
    // Si ya la tenemos traducida, solo alterna mostrar/ocultar sin volver a llamar a la API
    if (translations[commentId] !== undefined) {
      setShowingTranslation(prev => { const n = new Set(prev); n.has(commentId) ? n.delete(commentId) : n.add(commentId); return n; });
      return;
    }
    setTranslating(prev => new Set(prev).add(commentId));
    try {
      const res = await fetch("/api/translate-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: lang }),
      });
      const data = await res.json();
      if (data.translated) {
        setTranslations(prev => ({ ...prev, [commentId]: data.translated }));
        setShowingTranslation(prev => new Set(prev).add(commentId));
      }
    } catch {
      // Fallo silencioso: si la traducción no funciona, el comentario original sigue visible igualmente
    }
    setTranslating(prev => { const n = new Set(prev); n.delete(commentId); return n; });
  };

  if (!photo) return null;
  const liked = likedByMe.has(photo.id);

  const handleSend = async () => {
    if (!currentUserId) { onRequireLogin(); return; }
    if (!commentText.trim() || sending) return;
    setSending(true);
    await addComment(currentUserId, currentUserName, currentUserAvatar, commentText);
    setCommentText("");
    setSending(false);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:420,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <button onClick={e=>{e.stopPropagation();onClose();}}
        style={{position:"absolute",top:16,right:16,zIndex:421,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
        ✕
      </button>

      {/* Tarjeta general: columna, altura máx. 90vh — la foto ocupa el espacio
          disponible arriba, los comentarios van SIEMPRE debajo, sin tapar nada */}
      <div onClick={e=>e.stopPropagation()}
        style={{display:"flex",flexDirection:"column",width:"100%",maxWidth:520,maxHeight:"90vh",borderRadius:12,overflow:"hidden",background:"var(--bg)"}}>

        {/* Zona de la foto */}
        <div style={{position:"relative",flex:"1 1 auto",minHeight:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#000"}}>
          <img src={photo.url} alt="" style={{display:"block",maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} />
          {photos.length > 1 && (
            <>
              <button onClick={()=>onNav((index-1+photos.length)%photos.length)} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
              <button onClick={()=>onNav((index+1)%photos.length)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            </>
          )}
          <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.65)",color:"#fff",fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:8}}>
            {t("uploadedBy")} {photo.uploader_name ?? t("communityMember")}
          </div>
        </div>

        {/* Barra de like + contador de comentarios, entre la foto y la lista */}
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 14px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
          <button onClick={()=>currentUserId ? onToggleLike(photo.id) : onRequireLogin()}
            style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"var(--text)",padding:0}}>
            <span style={{fontSize:16}}>{liked ? "❤️" : "🤍"}</span>
            {likeCounts[photo.id] ?? 0}
          </button>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{t("commentsTitle", comments.length)}</div>
        </div>

        {/* Comentarios — siempre visibles, alineados a la izquierda estilo Facebook */}
        <div style={{overflowY:"auto",flexShrink:1,minHeight:80,maxHeight:220,padding:"10px 14px"}}>
          {comments.length === 0 ? (
            <div style={{color:"var(--text4)",fontSize:12,padding:"8px 0",textAlign:"left"}}>{t("noCommentsYet")}</div>
          ) : comments.map(c => (
            <div key={c.id} style={{display:"flex",gap:8,marginBottom:10,textAlign:"left"}}>
              {c.commenter_avatar ? (
                <img src={c.commenter_avatar} alt="" style={{width:30,height:30,borderRadius:"50%",flexShrink:0,objectFit:"cover"}} />
              ) : (
                <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,background:"var(--bg2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
                  {(c.commenter_name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{minWidth:0}}>
                <div style={{display:"inline-block",background:"var(--bg2)",borderRadius:14,padding:"6px 12px",textAlign:"left"}}>
                  <span style={{fontSize:12,fontWeight:700,marginRight:6}}>{c.commenter_name ?? t("communityMember")}</span>
                  <span style={{fontSize:13,color:"var(--text2)",wordBreak:"break-word"}}>
                    {showingTranslation.has(c.id) ? translations[c.id] : c.text}
                  </span>
                </div>
                <div style={{display:"flex",gap:10,marginTop:2}}>
                  {currentUserId === c.user_id && (
                    <button onClick={()=>deleteComment(c.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:11,padding:"2px 4px 0",textAlign:"left"}}>{t("deleteCommentAction")}</button>
                  )}
                  <button onClick={()=>handleTranslate(c.id, c.text)} disabled={translating.has(c.id)}
                    style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:11,padding:"2px 4px 0",textAlign:"left"}}>
                    {translating.has(c.id) ? t("translatingAction") : showingTranslation.has(c.id) ? t("seeOriginalAction") : t("translateAction")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Campo para añadir comentario */}
        <div style={{display:"flex",gap:8,padding:"10px 14px",borderTop:"1px solid var(--border)",flexShrink:0}}>
          <input
            value={commentText}
            onChange={e=>setCommentText(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") handleSend(); }}
            placeholder={currentUserId ? t("addCommentPlaceholder") : t("loginToComment")}
            maxLength={500}
            style={{flex:1,padding:"9px 12px",borderRadius:20,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",fontSize:13}}
          />
          <button onClick={handleSend} disabled={sending || !commentText.trim()}
            style={{padding:"9px 16px",borderRadius:20,border:"none",background:"#0196e3",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,opacity:(sending||!commentText.trim())?0.6:1,flexShrink:0}}>
            {t("send")}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserCollectionView({ userId, name, currentUserId, currentUserName, currentUserAvatar, onRequireLogin, onBack }: { userId:string; name:string; currentUserId?:string|null; currentUserName?:string|null; currentUserAvatar?:string|null; onRequireLogin:()=>void; onBack:()=>void }) {
  const { t } = useTr();
  const { photos, loading } = useUserCollectionGallery(userId);
  const [zoomIndex, setZoomIndex] = useState<number|null>(null);
  const photoIds = useMemo(() => photos.map(p=>p.id), [photos]);
  const { counts: likeCounts, likedByMe, toggleLike } = useCollectionLikes(photoIds, currentUserId);
  const { counts: commentCounts } = useCollectionCommentCounts(photoIds);
  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",fontSize:12,color:"#0196e3",cursor:"pointer",padding:0,marginBottom:12}}>
        {t("backToCollections")}
      </button>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>{t("collectionOf", name)}</div>
      {loading ? (
        <div style={{textAlign:"center",padding:"24px 0",color:"var(--text4)",fontSize:12}}>...</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {photos.map((p,i) => (
            <div key={p.id} onClick={()=>setZoomIndex(i)} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",cursor:"pointer",background:"var(--bg2)"}}>
              <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              <div style={{position:"absolute",bottom:3,left:3,right:3,display:"flex",gap:4}}>
                <button onClick={e=>{e.stopPropagation(); currentUserId ? toggleLike(p.id) : onRequireLogin();}}
                  style={{background:"rgba(0,0,0,0.6)",border:"none",borderRadius:10,padding:"2px 6px",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:10,fontWeight:700,color:"#fff"}}>
                  {likedByMe.has(p.id) ? "❤️" : "🤍"} {likeCounts[p.id] ?? 0}
                </button>
                {(commentCounts[p.id] ?? 0) > 0 && (
                  <div style={{background:"rgba(0,0,0,0.6)",borderRadius:10,padding:"2px 6px",display:"flex",alignItems:"center",gap:3,fontSize:10,fontWeight:700,color:"#fff"}}>
                    💬 {commentCounts[p.id]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {zoomIndex !== null && (
        <CollectionPhotoZoom photos={photos} index={zoomIndex} onClose={()=>setZoomIndex(null)} onNav={setZoomIndex}
          currentUserId={currentUserId} currentUserName={currentUserName} currentUserAvatar={currentUserAvatar}
          likeCounts={likeCounts} likedByMe={likedByMe} onToggleLike={toggleLike} onRequireLogin={onRequireLogin} />
      )}
    </div>
  );
}

// Vista previa ligera: solo trae unas pocas portadas recientes para decorar
// el botón de entrada, sin cargar el directorio completo hasta que se abra.
// Vista previa ligera: trae un grupo de portadas aprobadas y elige 4 al azar
// cada vez que se carga, para decorar el botón de entrada.
function useCollectionsPreviewCovers() {
  const [covers, setCovers] = useState<string[]>([]);
  useEffect(() => {
    supabase.from("wcf_collection_photos").select("url").eq("approved", true).limit(100)
      .then(({ data }) => {
        const urls = (data ?? []).map((d:any) => d.url);
        // Fisher-Yates shuffle
        for (let i = urls.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [urls[i], urls[j]] = [urls[j], urls[i]];
        }
        setCovers(urls.slice(0, 4));
      });
  }, []);
  return covers;
}

function CollectionsEntryButton({ onOpenMyCollection, currentUserId, currentUserName, currentUserAvatar, onRequireLogin }: { onOpenMyCollection:()=>void; currentUserId?:string|null; currentUserName?:string|null; currentUserAvatar?:string|null; onRequireLogin:()=>void }) {
  const { t } = useTr();
  const [showDirectory, setShowDirectory] = useState(false);
  const covers = useCollectionsPreviewCovers();
  return (
    <>
      <button onClick={()=>setShowDirectory(true)}
        style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"18px 14px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#0196e3,#6366f1)",cursor:"pointer",marginBottom:24,boxShadow:"0 4px 14px rgba(1,150,227,0.3)"}}>
        {covers.length > 0 ? (
          <div style={{display:"flex"}}>
            {covers.map((url,i) => (
              <img key={i} src={url} alt="" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2.5px solid #fff",marginLeft:i===0?0:-14,boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}} />
            ))}
          </div>
        ) : (
          <div style={{fontSize:32}}>🖼️</div>
        )}
        <span style={{fontSize:14,fontWeight:800,color:"#fff",textAlign:"center"}}>{t("collectionsTitle")}</span>
      </button>
      {showDirectory && (
        <CollectionsDirectoryModal onClose={()=>setShowDirectory(false)} onOpenMyCollection={onOpenMyCollection} currentUserId={currentUserId} currentUserName={currentUserName} currentUserAvatar={currentUserAvatar} onRequireLogin={onRequireLogin} />
      )}
    </>
  );
}

function CollectionsDirectoryModal({ onClose, onOpenMyCollection, currentUserId, currentUserName, currentUserAvatar, onRequireLogin }: { onClose:()=>void; onOpenMyCollection:()=>void; currentUserId?:string|null; currentUserName?:string|null; currentUserAvatar?:string|null; onRequireLogin:()=>void }) {
  const { t } = useTr();
  const { entries, loading } = useCollectionsDirectory();
  const [viewing, setViewing] = useState<{ userId:string; name:string }|null>(null);
  const AVATAR_PALETTE = ["#0174b0","#f59e0b","#10b981","#8b5cf6","#ec4899","#ef4444","#14b8a6","#6366f1"];
  const colorForUser = (id: string) => {
    let hash = 0;
    for (let i=0;i<id.length;i++) hash = (hash*31 + id.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg)",borderRadius:18,width:"100%",maxWidth:440,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 12px 40px rgba(0,0,0,0.4)"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:700}}>{t("collectionsTitle")}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:16}}>
          {viewing ? (
            <UserCollectionView userId={viewing.userId} name={viewing.name} currentUserId={currentUserId} currentUserName={currentUserName} currentUserAvatar={currentUserAvatar} onRequireLogin={onRequireLogin} onBack={()=>setViewing(null)} />
          ) : (
            <>
              <button onClick={onOpenMyCollection}
                style={{width:"100%",fontSize:12,fontWeight:700,color:"#0196e3",background:"var(--bg2)",border:"1px solid #0196e3",borderRadius:10,padding:"9px 10px",cursor:"pointer",marginBottom:16}}>
                {t("myCollectionMenuItem")}
              </button>
              {loading ? (
                <div style={{textAlign:"center",padding:"12px 0",color:"var(--text4)",fontSize:12}}>...</div>
              ) : entries.length === 0 ? (
                <div style={{fontSize:12,color:"var(--text4)",textAlign:"center",padding:"16px 0"}}>{t("noCollectionsYet")}</div>
              ) : (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {entries.map(e => (
                    <div key={e.userId} onClick={()=>setViewing({userId:e.userId,name:e.name})}
                      style={{borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",cursor:"pointer",background:"var(--bg2)"}}>
                      <div style={{aspectRatio:"1.4",background:colorForUser(e.userId),display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                        {e.coverUrl
                          ? <img src={e.coverUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                          : <div style={{fontSize:28,fontWeight:700,color:"#fff"}}>{e.name[0]?.toUpperCase() ?? "?"}</div>}
                      </div>
                      <div style={{padding:"8px 10px"}}>
                        <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t("collectionOf", e.name)}</div>
                        <div style={{fontSize:10,color:"var(--text4)"}}>{e.count} {t("photosCount")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CommunityTab({ data, communityUsers, communityTotal, topOwned, topWished, currentUserId, currentUserName, currentUserAvatar, onOpenMyCollection, onRequireLogin }: {
  data: Series[]; communityUsers:number; communityTotal:number;
  topOwned:{id:number;count:number}[]; topWished:{id:number;count:number}[];
  currentUserId?: string|null;
  currentUserName?: string|null;
  currentUserAvatar?: string|null;
  onOpenMyCollection:()=>void;
  onRequireLogin:()=>void;
}) {
  const { t } = useTr();
  const [zoomImg, setZoomImg] = useState<{src:string;name:string}|null>(null);
  const { topUploaders, topCollectors, myUploaderRank, myCollectorRank, myUploaderEntry, myCollectorEntry } = useCommunityLeaderboards(currentUserId);
  const [showBadgeLegend, setShowBadgeLegend] = useState(false);
  const figureFranchiseMap = useFigureFranchiseMap(data);
  const getBadgesForUser = (ownedIds?: number[]) => getBadgesForOwnedIds(ownedIds, figureFranchiseMap, t);


  const allFigs = data.flatMap(s=>[...s.sets,...s.groups.flatMap(g=>g.sets)].flatMap(st=>st.figures.map(f=>({figure:f,series:s,set:st}))));
  const findFig = (id:number) => allFigs.find(x=>x.figure.id===id);

  const RankRow = ({item,i,color}:{item:{id:number;count:number};i:number;color:string}) => {
    const found = findFig(item.id);
    if(!found) return null;
    return (
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:"var(--bg2)",border:"1px solid var(--border)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text3)",width:16,textAlign:"center"}}>{i+1}</div>
        <div onClick={()=>found.figure.image&&setZoomImg({src:found.figure.image,name:found.figure.name})}
          style={{width:36,height:36,borderRadius:6,overflow:"hidden",flexShrink:0,background:"var(--missing-bg)",cursor:found.figure.image?"zoom-in":"default"}}>
          {found.figure.image ? <img src={found.figure.image} alt={found.figure.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:18}}>{found.figure.emoji}</div>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{found.figure.name}</div>
          <div style={{fontSize:10,color:"var(--text4)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{found.series.name} — {found.set.name}</div>
        </div>
        <div style={{fontSize:11,fontWeight:700,color}}>{item.count}×</div>
      </div>
    );
  };

  const AVATAR_PALETTE = ["#0174b0","#f59e0b","#10b981","#8b5cf6","#ec4899","#ef4444","#14b8a6","#6366f1"];
  const colorForUser = (id: string) => {
    let hash = 0;
    for (let i=0;i<id.length;i++) hash = (hash*31 + id.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  };

  const UserRankRow = ({entry,i,rankColor,unitLabel,badges,highlight}:{entry:LeaderboardEntry;i:number;rankColor:string;unitLabel:string;badges?:{key:string;icon:string;color:string;title:string}[];highlight?:boolean}) => {
    const avatarColor = colorForUser(entry.userId);
    const [activeBadge, setActiveBadge] = useState<string|null>(null);
    return (
      <div style={{padding:"8px 10px",borderRadius:10,background:"var(--bg2)",border:highlight?`1.5px solid ${rankColor}`:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--text3)",width:16,textAlign:"center"}}>{i+1}</div>
          <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:avatarColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",overflow:"hidden"}}>
            {entry.avatar
              ? <img src={entry.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              : (entry.name?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div style={{flex:1,minWidth:0,fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{entry.name}</div>
          <div style={{fontSize:11,fontWeight:700,color:rankColor}}>{entry.count} {unitLabel}</div>
        </div>
        {badges && badges.length > 0 && (
          <>
            <div style={{display:"flex",gap:8,marginTop:6,justifyContent:"center",flexWrap:"wrap"}}>
              {badges.map(b=>(
                <span key={b.key} title={b.title} onClick={()=>setActiveBadge(prev=>prev===b.key?null:b.key)} style={{cursor:"pointer",display:"inline-flex",alignItems:"center"}}>
                  <BadgeIcon icon={b.icon} size={20} />
                </span>
              ))}
            </div>
            {activeBadge && (
              <div style={{fontSize:10,color:"var(--text4)",textAlign:"center",marginTop:4}}>
                {badges.find(b=>b.key===activeBadge)?.title}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      {zoomImg && (
        <div onClick={()=>setZoomImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:24,cursor:"zoom-out"}}>
          <div style={{maxWidth:340,width:"100%",textAlign:"center"}}>
            <img src={zoomImg.src} alt={zoomImg.name} style={{width:"100%",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}} />
            <div style={{color:"#fff",marginTop:12,fontWeight:600,fontSize:14}}>{zoomImg.name}</div>
          </div>
        </div>
      )}

      {showBadgeLegend && (
        <div onClick={()=>setShowBadgeLegend(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg)",borderRadius:14,padding:18,maxWidth:420,width:"100%",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>🏅 {t("badgeLegendTitle")}</div>
            <div style={{fontSize:12,color:"var(--text4)",marginBottom:16,lineHeight:1.4}}>{t("badgeLegendDesc")}</div>

            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>🌐 {t("globalBadgeLabel")}</div>
              <div style={{display:"flex",gap:10}}>
                {GLOBAL_BADGE.icons.map((icon,idx)=>(
                  <div key={idx} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
                    <BadgeIcon icon={icon} size={26} />
                    <div style={{fontSize:9,textAlign:"center",color:"var(--text4)"}}>{t(GLOBAL_BADGE.tierNames[idx] as TKey)}</div>
                    <div style={{fontSize:9,color:"var(--text4)",opacity:0.7}}>{GLOBAL_BADGE.thresholds[idx]}+</div>
                  </div>
                ))}
              </div>
            </div>

            {FRANCHISES.map(f=>(
              <div key={f.key} style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:6,color:f.color}}>{f.label}</div>
                <div style={{display:"flex",gap:10}}>
                  {f.icons.map((icon,idx)=>(
                    <div key={idx} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
                      <BadgeIcon icon={icon} size={26} />
                      <div style={{fontSize:9,textAlign:"center",color:"var(--text4)"}}>{t(f.tierNames[idx] as TKey)}</div>
                      <div style={{fontSize:9,color:"var(--text4)",opacity:0.7}}>{f.thresholds[idx]}+</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={()=>setShowBadgeLegend(false)} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",fontWeight:600,fontSize:13,cursor:"pointer",marginTop:4}}>
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {communityUsers > 0 ? (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
            <div style={{borderRadius:12,padding:"12px 10px",background:"var(--bg2)",border:"1px solid var(--border)",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:700,color:"#6366f1"}}>{communityUsers}</div>
              <div style={{fontSize:11,color:"var(--text4)",marginTop:4}}>{t("communityUsers")}</div>
            </div>
            <div style={{borderRadius:12,padding:"12px 10px",background:"var(--bg2)",border:"1px solid var(--border)",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:700,color:"#0174b0"}}>{communityTotal.toLocaleString()}</div>
              <div style={{fontSize:11,color:"var(--text4)",marginTop:4}}>{t("communityFigs")}</div>
            </div>
          </div>

          <CollectionsEntryButton onOpenMyCollection={onOpenMyCollection} currentUserId={currentUserId} currentUserName={currentUserName} currentUserAvatar={currentUserAvatar} onRequireLogin={onRequireLogin} />

          <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:8}}>📸 {t("topUploaders")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {topUploaders.length > 0
              ? topUploaders.map((entry,i)=><UserRankRow key={entry.userId} entry={entry} i={i} rankColor="#8b5cf6" unitLabel={t("photosCount")} />)
              : <div style={{fontSize:12,color:"var(--text4)",textAlign:"center",padding:"12px 0"}}>{t("noLeaderboardData")}</div>}
            {myUploaderRank !== null && myUploaderRank > 10 && myUploaderEntry && (
              <>
                <div style={{textAlign:"center",fontSize:12,color:"var(--text4)",letterSpacing:2}}>···</div>
                <UserRankRow entry={myUploaderEntry} i={myUploaderRank-1} rankColor="#8b5cf6" unitLabel={t("photosCount")} highlight />
              </>
            )}
          </div>

          <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            📦 {t("topCollectors")}
            <span onClick={()=>setShowBadgeLegend(true)} title={t("badgeLegendTitle")} style={{cursor:"pointer",width:16,height:16,borderRadius:"50%",border:"1px solid var(--text4)",color:"var(--text4)",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>?</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {topCollectors.length > 0
              ? topCollectors.map((entry,i)=><UserRankRow key={entry.userId} entry={entry} i={i} rankColor="#10b981" unitLabel={t("figuresCount")} badges={getBadgesForUser(entry.ownedIds)} />)
              : <div style={{fontSize:12,color:"var(--text4)",textAlign:"center",padding:"12px 0"}}>{t("noLeaderboardData")}</div>}
            {myCollectorRank !== null && myCollectorRank > 10 && myCollectorEntry && (
              <>
                <div style={{textAlign:"center",fontSize:12,color:"var(--text4)",letterSpacing:2}}>···</div>
                <UserRankRow entry={myCollectorEntry} i={myCollectorRank-1} rankColor="#10b981" unitLabel={t("figuresCount")} badges={getBadgesForUser(myCollectorEntry.ownedIds)} highlight />
              </>
            )}
          </div>

          <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:8}}>🏆 {t("mostCollected")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
            {topOwned.map((item,i)=><RankRow key={item.id} item={item} i={i} color="#0174b0" />)}
          </div>

          <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:8}}>💛 {t("mostWished")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {topWished.map((item,i)=><RankRow key={item.id} item={item} i={i} color="#f59e0b" />)}
          </div>
        </>
      ) : (
        <div style={{textAlign:"center",padding:"4rem 1rem",color:"var(--text4)",fontSize:14}}>{t("noLeaderboardData")}</div>
      )}
    </div>
  );
}

// ============================================================
//  SERIES GRID — draggable card grid
// ============================================================
function SeriesGrid({ series, seriesOwned, seriesTotal, onSelect, onReorder }: {
  series: Series[]; seriesOwned:(s:Series)=>number; seriesTotal:(s:Series)=>number;
  onSelect:(id:number)=>void; onReorder:(from:number,to:number)=>void;
}) {
  const isAdmin = useAdmin();
  const gridRef = useRef<HTMLDivElement>(null);
  const dragIdx = useRef<number|null>(null);
  const [dragOver, setDragOver] = useState<number|null>(null);
  const [dragging, setDragging] = useState<number|null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const touchStartPos = useRef({x:0,y:0});
  const lastReorder = useRef(0);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (dragIdx.current !== null) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  const handleDragStart = (idx:number) => { dragIdx.current=idx; setDragging(idx); };
  const handleDragOver = (e:React.DragEvent, idx:number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx:number) => { if(dragIdx.current!==null&&dragIdx.current!==idx){onReorder(dragIdx.current,idx);} dragIdx.current=null; setDragging(null); setDragOver(null); };
  const handleDragEnd = () => { dragIdx.current=null; setDragging(null); setDragOver(null); };

  const touchMoved = useRef(false);

  const handleTouchStart = (e:React.TouchEvent, idx:number) => {
    if(Date.now()-lastReorder.current<1000) return;
    touchMoved.current = false;
    touchStartPos.current={x:e.touches[0].clientX,y:e.touches[0].clientY};
    longPressTimer.current = setTimeout(()=>{ setDragging(idx); dragIdx.current=idx; }, 500);
  };
  const handleTouchMove = (e:React.TouchEvent, _idx:number) => {
    const dx=Math.abs(e.touches[0].clientX-touchStartPos.current.x);
    const dy=Math.abs(e.touches[0].clientY-touchStartPos.current.y);
    if(dx>5||dy>5){
      touchMoved.current = true;
      if(longPressTimer.current){clearTimeout(longPressTimer.current);longPressTimer.current=null;}
    }
    if(dragIdx.current===null) return;
    const el=document.elementFromPoint(e.touches[0].clientX,e.touches[0].clientY);
    const card=el?.closest("[data-seriesidx]");
    if(card){ const to=parseInt(card.getAttribute("data-seriesidx")!); if(!isNaN(to)) setDragOver(to); }
  };
  const handleTouchEnd = (_e:React.TouchEvent) => {
    if(longPressTimer.current){clearTimeout(longPressTimer.current);longPressTimer.current=null;}
    if(dragIdx.current!==null){
      if(dragOver!==null&&dragOver!==dragIdx.current){ onReorder(dragIdx.current,dragOver); lastReorder.current=Date.now(); }
    }
    dragIdx.current=null; setDragging(null); setDragOver(null);
  };

  return (
    <div ref={gridRef} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
      {series.map((s,idx)=>{
        const ownedC=seriesOwned(s), totalC=seriesTotal(s);
        const pct=totalC?Math.round(ownedC/totalC*100):0;
        const isDragging=dragging===idx, isOver=dragOver===idx&&dragging!==idx;
        return (
          <div key={s.id}
            data-seriesidx={idx}
            data-seriesid={s.id}
            draggable={isAdmin}
            onDragStart={isAdmin?()=>handleDragStart(idx):undefined}
            onDragOver={isAdmin?e=>handleDragOver(e,idx):undefined}
            onDrop={isAdmin?()=>handleDrop(idx):undefined}
            onDragEnd={isAdmin?handleDragEnd:undefined}
            onTouchStart={isAdmin?e=>handleTouchStart(e,idx):undefined}
            onTouchMove={isAdmin?e=>handleTouchMove(e,idx):undefined}
            onTouchEnd={isAdmin?e=>handleTouchEnd(e):undefined}
            onClick={()=>{ if(!touchMoved.current && dragIdx.current===null) onSelect(s.id); }}
            style={{position:"relative",borderRadius:12,overflow:"hidden",cursor:isAdmin?"grab":"pointer",aspectRatio:"1",background:s.color+"33",border:isOver?`2px solid ${s.color}`:`1px solid ${s.color}44`,opacity:isDragging?0.4:1,transition:"transform 0.15s,box-shadow 0.15s,opacity 0.15s",touchAction:dragging!==null?"none":"auto"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            {s.bgImage
              ? <img src={s.bgImage} alt={s.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none"}} />
              : <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,opacity:0.6,pointerEvents:"none"}}>{s.emoji}</div>
            }
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0) 100%)",pointerEvents:"none"}} />
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 10px",pointerEvents:"none"}}>
              {s.logo
                ? <img src={s.logo} alt={s.name} style={{height:20,maxWidth:"100%",objectFit:"contain",objectPosition:"left",marginBottom:4,display:"block"}} />
                : <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:4,lineHeight:1.2,textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>{s.name}</div>
              }
              <div style={{height:3,background:"rgba(255,255,255,0.25)",borderRadius:2,overflow:"hidden",marginBottom:2}}>
                <div style={{height:"100%",width:pct+"%",background:pct===100?"#4ade80":s.color,borderRadius:2}} />
              </div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.7)"}}>{ownedC}/{totalC}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
//  CHANGELOG MODAL
// ============================================================
function ChangelogModal({ onClose }: { onClose:()=>void }) {
  const { t, lang } = useTr();
  const [showAll, setShowAll] = useState(false);
  const sorted = [...CHANGELOG].sort((a,b)=>b.id-a.id);
  const latest = sorted[0];
  const MONTHS_FULL: Record<string,string[]> = {
    es:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    en:["January","February","March","April","May","June","July","August","September","October","November","December"],
    fr:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    vi:["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"],
    ja:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    zh:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    th:["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
  };
  const formatDate = (d:string) => { const [y,m,day]=d.split("-"); return `${parseInt(day)} ${MONTHS_FULL[lang][parseInt(m)-1]} ${y}`; };
  const items = showAll ? sorted : [latest];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:20,width:"100%",maxWidth:360,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>🎉</span>
            <span style={{fontWeight:700,fontSize:16}}>{t("changelogTitle")}</span>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {items.map(entry=>(
            <div key={entry.id} style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--text3)",marginBottom:6,fontWeight:600}}>{formatDate(entry.date)}</div>
              {entry.entries.map((e,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{color:"#0174b0",flexShrink:0,marginTop:1}}>•</span>
                  <span style={{fontSize:13,color:"var(--text)",lineHeight:1.4}}>{e}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)",flexShrink:0}}>
          <span style={{fontSize:11,color:"var(--text4)"}}>{t("followUs")}</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{display:"flex",textDecoration:"none"}} title="Instagram"><InstagramIcon size={20} /></a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" style={{display:"flex",textDecoration:"none"}} title="Facebook"><FacebookIcon size={20} /></a>
        </div>
        <div style={{display:"flex",gap:8,marginTop:12,flexShrink:0}}>
          {!showAll && CHANGELOG.length>1 && (
            <button onClick={()=>setShowAll(true)}
              style={{flex:1,padding:"9px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text3)",cursor:"pointer",fontSize:12}}>
              {t("changelogHistory")}
            </button>
          )}
          <button onClick={onClose}
            style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:"#0196e3",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>
            {t("changelogClose")}
          </button>
        </div>
      </div>
    </div>
  );
}

const STORY_STAMP_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAACWCAYAAAAmC+ydAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGcWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI3LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNi0wNi0yMVQxMjoxMzo0NSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNi0wNi0yMVQxMjoxMzo0NSswMjowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjYtMDYtMjFUMTI6MTM6NDUrMDI6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODE2ZDBmNzItYWU1MS0xMDQ1LWIzZjktMzBkODQyYjI2YTZhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDk4ZmNmYzYtNjdkNi05YjQwLTgxZDctOWVjZjEzNDI1NTIxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDliM2RkNDYtNzc2ZC1kMDQwLThmNWMtZTU5NjgwNmExMjMyIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDliM2RkNDYtNzc2ZC1kMDQwLThmNWMtZTU5NjgwNmExMjMyIiBzdEV2dDp3aGVuPSIyMDI2LTA2LTIxVDEyOjEzOjQ1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjcuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgxNmQwZjcyLWFlNTEtMTA0NS1iM2Y5LTMwZDg0MmIyNmE2YSIgc3RFdnQ6d2hlbj0iMjAyNi0wNi0yMVQxMjoxMzo0NSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI3LjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IkFEREVEIFRPIFdDRiBDSEVDS0xJU1QiIHBob3Rvc2hvcDpMYXllclRleHQ9IkFEREVEIFRPIFdDRiBDSEVDS0xJU1QiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpPUDAcAAC4gSURBVHic7d0HeBVl1gfwfygJMQQIEFroNZESQi9LUVERFwuigq4KNrDr8n2W1RVdO66ioAgqdldZy6osYkFBEOkhCSV0QkLoaSQhIaR8zzvm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";

const APP_LOGO_URL = "data:image/png;base64,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";

function loadImageAsync(src: string, crossOrigin?: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    // Cache-busting query param when loading cross-origin: some browsers reuse
    // an "opaque" cache entry from an earlier plain (non-CORS) <img> load of the
    // same exact URL, which then fails CORS validation. A unique query string
    // forces a fresh network fetch under CORS mode every time.
    img.src = crossOrigin ? src + (src.includes("?") ? "&" : "?") + "cb=" + Date.now() : src;
  });
}

function roundRectPath(c: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
  c.beginPath();
  c.moveTo(x+r, y);
  c.arcTo(x+w, y, x+w, y+h, r);
  c.arcTo(x+w, y+h, x, y+h, r);
  c.arcTo(x, y+h, x, y, r);
  c.arcTo(x, y, x+w, y, r);
  c.closePath();
}

function wrapTextLines(c: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (c.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

async function generateStoryImage(item: Announcement, ctx: { figure: Figure; set: FigureSet; series: Series; group?: FigureGroup }) {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Canvas not supported");

  const grad = c.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0196e3");
  grad.addColorStop(1, "#6366f1");
  c.fillStyle = grad;
  c.fillRect(0, 0, W, H);

  c.save();
  c.globalAlpha = 0.08;
  c.fillStyle = "#ffffff";
  c.beginPath(); c.arc(W*0.85, H*0.1, 260, 0, Math.PI*2); c.fill();
  c.beginPath(); c.arc(W*0.08, H*0.92, 220, 0, Math.PI*2); c.fill();
  c.restore();

  let logoTop = 100;
  let seriesLogoCenterY = logoTop + 75;
  const seriesLogoSrc = ctx.series.logoHeader || ctx.series.logo;
  try {
    if (seriesLogoSrc) {
      const seriesLogo = await loadImageAsync(seriesLogoSrc, true);
      const maxW = 480, maxH = 150;
      const scale = Math.min(maxW/seriesLogo.width, maxH/seriesLogo.height, 1);
      const w = seriesLogo.width*scale, h = seriesLogo.height*scale;
      c.drawImage(seriesLogo, (W-w)/2, logoTop, w, h);
      seriesLogoCenterY = logoTop + h/2;
      logoTop += h + 24;
    }
  } catch {}
  try {
    // App logo (transparent PNG), top-right, vertically centred with the franchise logo.
    const appLogo = await loadImageAsync(APP_LOGO_URL);
    const lw = 210, lh = lw * appLogo.height / appLogo.width;
    c.drawImage(appLogo, W - 50 - lw, Math.max(20, seriesLogoCenterY - lh/2), lw, lh);
  } catch {}
  try {
    // Studio logo when the figure belongs to a resin group; otherwise fall back to
    // the set's own logo, but only if it actually differs from the franchise logo
    // above (most official sets just reuse the same one, so skip the duplicate).
    const secondaryLogoSrc = ctx.group?.logo || (ctx.set.seriesLogo && ctx.set.seriesLogo !== seriesLogoSrc ? ctx.set.seriesLogo : undefined);
    if (secondaryLogoSrc) {
      const secondaryLogo = await loadImageAsync(secondaryLogoSrc, true);
      const maxW = 320, maxH = 100;
      const scale = Math.min(maxW/secondaryLogo.width, maxH/secondaryLogo.height, 1);
      const w = secondaryLogo.width*scale, h = secondaryLogo.height*scale;
      c.drawImage(secondaryLogo, (W-w)/2, logoTop, w, h);
      logoTop += h + 16;
    }
  } catch {}

  const cardW = 820, cardH = 820;
  const cardX = (W - cardW)/2;
  const cardY = Math.max(logoTop + 30, 420);
  const cardRadius = 32;
  c.save();
  c.shadowColor = "rgba(0,0,0,0.28)";
  c.shadowBlur = 44;
  c.shadowOffsetY = 14;
  roundRectPath(c, cardX, cardY, cardW, cardH, cardRadius);
  c.fillStyle = "#ffffff";
  c.fill();
  c.restore();

  if (item.image_url) {
    try {
      const figImg = await loadImageAsync(item.image_url, true);
      const pad = 28;
      const innerW = cardW - pad*2, innerH = cardH - pad*2;
      const scale = Math.min(innerW/figImg.width, innerH/figImg.height);
      const w = figImg.width*scale, h = figImg.height*scale;
      c.save();
      roundRectPath(c, cardX, cardY, cardW, cardH, cardRadius);
      c.clip();
      c.drawImage(figImg, cardX + (cardW-w)/2, cardY + (cardH-h)/2, w, h);
      c.restore();
    } catch {}
  }

  const textY = cardY + cardH + 96;
  c.textAlign = "center";
  c.fillStyle = "#ffffff";
  c.font = "700 58px Arial, sans-serif";
  const titleLines = wrapTextLines(c, item.title, 940).slice(0, 2);
  titleLines.forEach((l,i) => c.fillText(l, W/2, textY + i*66));
  const afterTitleY = textY + titleLines.length*66 + 22;

  c.font = "500 34px Arial, sans-serif";
  c.fillStyle = "rgba(255,255,255,0.85)";
  const subtitle = `${ctx.series.name}${ctx.group ? " — " + ctx.group.name : ""} — ${ctx.set.name}`;
  const subtitleLines = wrapTextLines(c, subtitle, 900).slice(0, 2);
  subtitleLines.forEach((l,i) => c.fillText(l, W/2, afterTitleY + i*44));

  try {
    const stamp = await loadImageAsync(STORY_STAMP_URL);
    const stampW = 620;
    const scale = stampW / stamp.width;
    const stampH = stamp.height * scale;
    c.drawImage(stamp, (W-stampW)/2, H - stampH - 110, stampW, stampH);
  } catch {}

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wcf-story-${item.title.replace(/[^a-z0-9]+/gi,"-").toLowerCase()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

async function generateWeeklySummaryImage(weekItems: Announcement[], data: Series[]) {
  type Entry = { item: Announcement; ctx: { figure: Figure; set: FigureSet; series: Series; group?: FigureGroup } };
  const entries: Entry[] = [];
  for (const item of weekItems) {
    const ctx = findFigureContext(data, Number(item.figure_id));
    if (ctx) entries.push({ item, ctx });
  }
  if (entries.length === 0) throw new Error("No figures resolved for this week");

  const byFranchise = new Map<number, { series: Series; entries: Entry[] }>();
  for (const e of entries) {
    const bucket = byFranchise.get(e.ctx.series.id) ?? { series: e.ctx.series, entries: [] };
    bucket.entries.push(e);
    byFranchise.set(e.ctx.series.id, bucket);
  }

  // A figure's own "studio" logo: the group's logo when it belongs to a resin
  // group, or the set's own logo when that differs from the franchise logo
  // already shown in the block header (skip it when it's just a duplicate).
  const studioLogoFor = (e: Entry, seriesLogoSrc?: string): string | undefined => {
    if (e.ctx.group?.logo) return e.ctx.group.logo;
    if (e.ctx.set.seriesLogo && e.ctx.set.seriesLogo !== seriesLogoSrc) return e.ctx.set.seriesLogo;
    return undefined;
  };

  const W = 1080;
  const contentPad = 40;
  const contentTop = 130;
  const footerH = 96;
  const contentWidth = W - contentPad*2;
  const standardH = 1080;
  const standardContentHeight = standardH - footerH - contentTop - 10;

  // Fixed, readable tile size: always 5 per row, sized to fill the width.
  const cols = 5;
  const gap = 22;
  const size = (contentWidth - (cols - 1) * gap) / cols;
  const tileLogoGap = 6;
  const tileLogoH = 26;
  const cellH = size + tileLogoGap + tileLogoH;
  const franchiseHeaderH = 54;
  const blockGap = 26;

  const blockHeight = (bucket: { entries: Entry[] }) => {
    const rows = Math.ceil(bucket.entries.length / cols);
    return franchiseHeaderH + rows * (cellH + gap) - gap;
  };

  // Paginate: keep adding franchises to the current post while they still fit
  // the fixed tile size within one standard square canvas; start a new post
  // otherwise. A franchise is NEVER split across two posts — if one alone is
  // too tall even for a page by itself, it gets its own dedicated (taller, 4:5)
  // page instead of being cropped or split. Biggest franchises first so a
  // single big one doesn't awkwardly strand a tiny leftover sliver of another.
  const franchiseList = [...byFranchise.values()].sort((a, b) => b.entries.length - a.entries.length);
  const pages: { blocks: typeof franchiseList; contentH: number }[] = [];
  for (const bucket of franchiseList) {
    const h = blockHeight(bucket) + blockGap;
    if (h > standardContentHeight) {
      // Doesn't fit a standard page even alone \u2014 give it its own dedicated
      // (taller) page rather than cropping or splitting it.
      pages.push({ blocks: [bucket], contentH: h });
      continue;
    }
    // First-fit: drop it into the first already-started page that still has
    // room, so small leftover franchises fill gaps instead of each starting a
    // near-empty page of their own.
    let placed = false;
    for (const page of pages) {
      if (page.contentH + h <= standardContentHeight) {
        page.blocks.push(bucket);
        page.contentH += h;
        placed = true;
        break;
      }
    }
    if (!placed) pages.push({ blocks: [bucket], contentH: h });
  }

  const now = new Date();
  const weekAgoDate = new Date(Date.now() - 7*24*60*60*1000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const { blocks: pageBlocks, contentH } = pages[pageIndex];
    const pageEntryCount = pageBlocks.reduce((n, b) => n + b.entries.length, 0);
    // Cap page height at a 4:5 portrait (Instagram's tallest feed-friendly
    // ratio) so an oversized single-franchise page still fits a normal post,
    // extending only as far as actually needed for its content either way.
    const maxH = Math.round(W * 5 / 4);
    const H = Math.min(maxH, Math.max(standardH, contentTop + contentH + footerH + 10));
    const contentHeight = H - footerH - contentTop - 10;

    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const c = canvas.getContext("2d");
    if (!c) throw new Error("Canvas not supported");

    const grad = c.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0196e3");
    grad.addColorStop(1, "#6366f1");
    c.fillStyle = grad;
    c.fillRect(0, 0, W, H);

    c.save();
    c.globalAlpha = 0.07;
    c.fillStyle = "#ffffff";
    c.beginPath(); c.arc(W*0.9, H*0.05, 200, 0, Math.PI*2); c.fill();
    c.beginPath(); c.arc(W*0.05, H*0.98, 180, 0, Math.PI*2); c.fill();
    c.restore();

    c.textAlign = "center";
    c.fillStyle = "#ffffff";
    c.font = "700 46px Arial, sans-serif";
    c.fillText("New This Week", W/2, 66);
    c.font = "500 24px Arial, sans-serif";
    c.fillStyle = "rgba(255,255,255,0.85)";
    const pageTag = pages.length > 1 ? `  ·  Part ${pageIndex+1}/${pages.length}` : "";
    c.fillText(`${fmt(weekAgoDate)} – ${fmt(now)}  ·  ${pageEntryCount} figures${pageTag}`, W/2, 98);

    // App logo (transparent PNG), overlaid top-right on the gradient.
    try {
      const appLogo = await loadImageAsync(APP_LOGO_URL);
      const lw = 190, lh = lw * appLogo.height / appLogo.width;
      c.drawImage(appLogo, W - contentPad - lw, 16, lw, lh);
    } catch {}

    let y = contentTop + Math.max(0, (contentHeight - contentH) / 2);

    for (const bucket of pageBlocks) {
      const seriesLogoSrc = bucket.series.logoHeader || bucket.series.logo;
      let drewSeriesLogo = false;
      if (seriesLogoSrc) {
        try {
          const logo = await loadImageAsync(seriesLogoSrc, true);
          const lh = 44, lw = Math.min(220, logo.width * (lh/logo.height));
          c.drawImage(logo, contentPad, y, lw, lh);
          drewSeriesLogo = true;
        } catch {}
      }
      if (!drewSeriesLogo) {
        c.textAlign = "left";
        c.fillStyle = "#ffffff";
        c.font = "700 26px Arial, sans-serif";
        c.fillText(bucket.series.name, contentPad, y + 28);
      }
      y += franchiseHeaderH;

      let col = 0;
      for (const e of bucket.entries) {
        const tx = contentPad + col * (size + gap);
        roundRectPath(c, tx, y, size, size, 14);
        c.fillStyle = "#ffffff";
        c.fill();
        if (e.item.image_url) {
          try {
            const img = await loadImageAsync(e.item.image_url, true);
            const pad = size * 0.08;
            const innerW = size - pad*2, innerH = size - pad*2;
            const scale = Math.min(innerW/img.width, innerH/img.height);
            const w = img.width*scale, h = img.height*scale;
            c.save();
            roundRectPath(c, tx, y, size, size, 14);
            c.clip();
            c.drawImage(img, tx + (size-w)/2, y + (size-h)/2, w, h);
            c.restore();
          } catch {}
        }
        const studioLogoSrc = studioLogoFor(e, seriesLogoSrc);
        if (studioLogoSrc) {
          try {
            const slogo = await loadImageAsync(studioLogoSrc, true);
            const slh = tileLogoH, slw = Math.min(size, slogo.width * (slh/slogo.height));
            c.drawImage(slogo, tx + (size-slw)/2, y + size + tileLogoGap, slw, slh);
          } catch {}
        }
        col++;
        if (col >= cols) { col = 0; y += cellH + gap; }
      }
      if (col !== 0) y += cellH + gap;
      y += blockGap - gap;
    }

    try {
      const stamp = await loadImageAsync(STORY_STAMP_URL);
      const stampW = 420;
      const scale = stampW / stamp.width;
      const stampH = stamp.height * scale;
      c.drawImage(stamp, (W - stampW)/2, H - stampH - 26, stampW, stampH);
    } catch {}

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const suffix = pages.length > 1 ? `-part${pageIndex+1}` : "";
    a.download = `wcf-weekly-${now.toISOString().slice(0,10)}${suffix}.png`;
    a.click();
    URL.revokeObjectURL(url);
    if (pageIndex < pages.length - 1) await new Promise(r => setTimeout(r, 350));
  }
}

type Announcement = { id:number; figure_id:string; image_url:string; title:string; franchise_id:string; created_at:string };

function useAnnouncements(favourites: Set<number>, favouritesReady: boolean) {
  const [all, setAll] = useState<Announcement[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    supabase.from("wcf_announcements")
      .select("id,figure_id,image_url,title,franchise_id,created_at")
      .eq("active", true)
      .gte("created_at", new Date(Date.now() - 7*24*60*60*1000).toISOString())
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Announcements load error:", error);
        if (!error && data) setAll(data as Announcement[]);
        setLoaded(true);
      });
  }, []);
  const favItems = !favouritesReady ? [] : (favourites.size === 0 ? all : all.filter(a => favourites.has(Number(a.franchise_id))));
  const allItems = !favouritesReady ? [] : all;
  const maxId = all.reduce((m,a)=>Math.max(m,a.id), 0);
  return { favItems, allItems, maxId, loaded: loaded && favouritesReady };
}

function NewsModal({ favItems, allItems, data, onOpenDetail, onClose }: { favItems: Announcement[]; allItems: Announcement[]; data: Series[]; onOpenDetail: (figureId:string)=>void; onClose: ()=>void }) {
  const { t } = useTr();
  const isAdmin = useAdmin();
  const showSwitch = allItems.length > favItems.length;
  const [showAll, setShowAllState] = useState(() => {
    const saved = localStorage.getItem("wcf_news_filter");
    if (saved === "all") return true;
    if (saved === "favs") return false;
    return favItems.length === 0 && allItems.length > 0;
  });
  const setShowAll = (v: boolean) => { setShowAllState(v); localStorage.setItem("wcf_news_filter", v ? "all" : "favs"); };
  const items = showAll ? allItems : favItems;
  const [index, setIndex] = useState(0);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatingWeekly, setGeneratingWeekly] = useState(false);
  useEffect(() => { setIndex(0); }, [showAll]);
  const item = items[index] ?? null;
  const ctx = item ? findFigureContext(data, Number(item.figure_id)) : null;
  const next = () => { if (!item) return; if (index < items.length-1) setIndex(index+1); else onClose(); };
  const prev = () => { if (index > 0) setIndex(index-1); };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:310,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{position:"relative",width:"100%",maxWidth:360,maxHeight:"85vh",background:"var(--bg)",borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
        {showSwitch && (
          <div style={{display:"flex",gap:6,padding:"10px 12px 0",flexShrink:0}}>
            <button onClick={()=>setShowAll(false)} style={{flex:1,padding:"7px",borderRadius:8,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:!showAll?"#0196e3":"var(--bg2)",color:!showAll?"#fff":"var(--text3)"}}>{t("newsFilterFavs")}</button>
            <button onClick={()=>setShowAll(true)} style={{flex:1,padding:"7px",borderRadius:8,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:showAll?"#0196e3":"var(--bg2)",color:showAll?"#fff":"var(--text3)"}}>{t("newsFilterAll")}</button>
          </div>
        )}
        {isAdmin && (
          <div style={{padding:"10px 12px 0",flexShrink:0}}>
            <button disabled={generatingWeekly} onClick={async()=>{
                const weekAgo = Date.now() - 7*24*60*60*1000;
                const weekItems = allItems.filter(a => new Date(a.created_at).getTime() >= weekAgo);
                if (weekItems.length === 0) { alert(t("newsWeeklyEmpty")); return; }
                setGeneratingWeekly(true);
                try { await generateWeeklySummaryImage(weekItems, data); }
                catch (e) { console.error("Weekly summary error:", e); alert(t("newsWeeklyError")); }
                setGeneratingWeekly(false);
              }}
              style={{width:"100%",padding:"7px",borderRadius:8,border:"1px dashed rgba(255,255,255,0.35)",background:"rgba(255,255,255,0.06)",color:"var(--text3)",fontSize:11,fontWeight:600,cursor:generatingWeekly?"default":"pointer",opacity:generatingWeekly?0.6:1}}>
              {generatingWeekly ? "…" : `📅 ${t("newsWeeklySummary")}`}
            </button>
          </div>
        )}
        {item && (
          <div style={{display:"flex",gap:4,padding:"10px 12px 0",flexShrink:0}}>
            {items.map((_,i)=>(
              <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=index?"#0196e3":"var(--border)"}} />
            ))}
          </div>
        )}
        <button onClick={onClose} style={{position:"absolute",top:8,right:10,background:"none",border:"none",fontSize:22,color:item?"#fff":"var(--text3)",cursor:"pointer",zIndex:2,textShadow:item?"0 1px 3px rgba(0,0,0,0.5)":"none"}}>×</button>
        {item ? (
          <>
            <div style={{position:"relative",flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#000",minHeight:220}}>
              {items.length>1 && (
                <div style={{position:"absolute",top:8,left:12,background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:10,zIndex:2}}>
                  {index+1} / {items.length}
                </div>
              )}
              {index > 0 && <div onClick={prev} style={{position:"absolute",left:0,top:0,bottom:0,width:"35%",cursor:"pointer",zIndex:1}} />}
              <div onClick={next} style={{position:"absolute",right:0,top:0,bottom:0,width:"35%",cursor:"pointer",zIndex:1}} />
              {index > 0 && <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.85)",fontSize:30,fontWeight:700,pointerEvents:"none",textShadow:"0 1px 3px rgba(0,0,0,0.6)"}}>‹</div>}
              {items.length>1 && <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.85)",fontSize:30,fontWeight:700,pointerEvents:"none",textShadow:"0 1px 3px rgba(0,0,0,0.6)"}}>›</div>}
              {item.image_url && <img src={item.image_url} alt={item.title} style={{maxWidth:"100%",maxHeight:"60vh",objectFit:"contain",pointerEvents:"none"}} />}
            </div>
            <div style={{padding:16,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:12,color:"#0196e3",fontWeight:700,marginBottom:4}}>🎉 {t("newsLabel")}</div>
              <div style={{fontSize:16,fontWeight:700}}>{item.title}</div>
              {ctx && (
                <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>
                  {ctx.series.emoji} {ctx.series.name}{ctx.group ? ` — ${ctx.group.name}` : ""} — {ctx.set.name}
                </div>
              )}
              {ctx && (
                <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
                  <button onClick={()=>{ onOpenDetail(item.figure_id); onClose(); }}
                    style={{padding:"7px 16px",borderRadius:20,border:"none",background:"#0196e3",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                    {t("newsSeeDetail")}
                  </button>
                  {isAdmin && (
                    <button disabled={generatingStory} onClick={async()=>{
                        setGeneratingStory(true);
                        try { await generateStoryImage(item, ctx); }
                        catch (e) { console.error("Story image error:", e); alert(t("newsStoryError")); }
                        setGeneratingStory(false);
                      }}
                      style={{padding:"7px 16px",borderRadius:20,border:"1px solid #0196e3",background:"transparent",color:"#0196e3",fontSize:12,fontWeight:600,cursor:generatingStory?"default":"pointer",opacity:generatingStory?0.6:1}}>
                      {generatingStory ? "…" : `🖼️ ${t("newsDownloadStory")}`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{padding:"44px 24px",textAlign:"center"}}>
            <div style={{fontSize:34,marginBottom:10}}>🗂️</div>
            <div style={{fontSize:13,color:"var(--text3)",lineHeight:1.4}}>{showAll ? t("newsEmptyAll") : t("newsEmptyFavs")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

type ConfirmFigure = { figure:Figure; series:Series; set:FigureSet; mode:"owned"|"wishlist" };

type TabType = "collection" | "database" | "community" | "stats";

// ============================================================
//  FEEDBACK MODAL
// ============================================================
function FeedbackModal({ onClose, data, userEmail }: { onClose:()=>void; data?:object; userEmail?:string }) {
  const { t } = useTr();
  const [type, setType] = useState("bug");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/wcf_feedback`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          type,
          message: msg.trim(),
          email: userEmail ?? null,
          created_at: new Date().toISOString(),
        })
      });
    } catch(e) { console.error(e); }
    setSending(false);
    setSent(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:20,width:"100%",maxWidth:360,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <span style={{fontWeight:700,fontSize:16}}>{t("feedbackTitle")}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        {sent ? (
          <div style={{textAlign:"center",padding:"2rem",fontSize:14,color:"#0174b0",fontWeight:600}}>{t("feedbackOk")}</div>
        ) : <>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,color:"var(--text3)",marginBottom:6,fontWeight:500}}>{t("feedbackType")}</div>
            <div style={{display:"flex",gap:6}}>
              {[["bug",t("feedbackTypeBug")],["suggestion",t("feedbackTypeSug")],["other",t("feedbackTypeOth")]].map(([val,label])=>(
                <button key={val} onClick={()=>setType(val)}
                  style={{flex:1,padding:"6px 4px",borderRadius:8,border:`1px solid ${type===val?"#0174b0":"var(--border)"}`,background:type===val?"#e6f4fd":"var(--bg2)",color:type===val?"#0174b0":"var(--text3)",cursor:"pointer",fontSize:11,fontWeight:type===val?600:400}}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:"var(--text3)",marginBottom:6,fontWeight:500}}>{t("feedbackMsg")}</div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder={t("feedbackPH")} rows={4}
              style={{width:"100%",padding:"10px",fontSize:13,border:"1px solid var(--border)",borderRadius:8,outline:"none",resize:"none",fontFamily:"system-ui,sans-serif",boxSizing:"border-box" as const,background:"var(--bg2)",color:"var(--text)"}} />
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
            {data && <button onClick={()=>{
              const json = JSON.stringify(data, null, 2);
              const blob = new Blob([json], {type:"application/json"});
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `wcf_backup_${new Date().toISOString().slice(0,10)}.json`;
              a.click(); URL.revokeObjectURL(url);
            }} style={{padding:"8px 14px",borderRadius:8,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:13,color:"var(--text3)"}}>💾 Backup</button>}
            <button onClick={onClose} style={{padding:"8px 14px",borderRadius:8,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:13,color:"var(--text3)"}}>{t("cancelBtn")}</button>
            <button onClick={send} disabled={!msg.trim()||sending}
              style={{padding:"8px 14px",borderRadius:8,border:"none",background:msg.trim()?"#0196e3":"#ccc",color:"#fff",cursor:msg.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:600}}>
              {sending?"...":t("feedbackSend")}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ============================================================
//  ONBOARDING MODAL
// ============================================================
function OnboardingModal({ onLogin, onSendCode, onVerifyCode, onEmailSuccess, onGuest }: { onLogin:()=>Promise<{error:unknown}>; onSendCode:(email:string)=>Promise<{error:unknown}>; onVerifyCode:(email:string,code:string)=>Promise<{error:unknown}>; onEmailSuccess:()=>void; onGuest:()=>void }) {
  const { t } = useTr();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false); // igual que en LoginModal: 2 opciones con el mismo peso, no una principal y otra secundaria
  const handleGoogleClick = async () => {
    if (googleLoading) return; // ignora clics mientras ya hay uno en curso
    setGoogleLoading(true);
    const { error } = await onLogin();
    if (error) setGoogleLoading(false); // solo si falla; si tiene éxito, la página navega fuera
  };

  const equalOptionStyle: React.CSSProperties = {width:"100%",padding:"13px",borderRadius:12,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:10};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:20,padding:28,width:"100%",maxWidth:360,boxShadow:"0 12px 40px rgba(0,0,0,0.3)",textAlign:"center"}}>
        <img src="/icons/icon-96x96.png" alt="WCF" style={{width:72,height:72,borderRadius:16,marginBottom:16}} />
        <div style={{fontWeight:800,fontSize:20,marginBottom:10,color:"var(--text)"}}>{t("onboardTitle")}</div>
        <div style={{fontSize:13,color:"var(--text3)",lineHeight:1.6,marginBottom:8}}>{t("onboardDesc")}</div>
        <div style={{fontSize:11,color:"var(--text4)",marginBottom:24,padding:"8px 12px",background:"var(--bg2)",borderRadius:8,lineHeight:1.5}}>
          💡 {t("onboardNote")}
        </div>
        {/iphone|ipad|ipod/i.test(navigator.userAgent) && (
          <div style={{fontSize:11,color:"var(--text4)",marginBottom:16,padding:"8px 12px",background:"var(--bg2)",borderRadius:8,lineHeight:1.5,textAlign:"left"}}>
            📱 {t("onboardIos")}
          </div>
        )}

        {!showEmail ? (
          <>
            <button onClick={handleGoogleClick} disabled={googleLoading}
              style={{...equalOptionStyle,cursor:googleLoading?"default":"pointer",opacity:googleLoading?0.7:1,marginBottom:10}}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{width:18,height:18}} />
              {googleLoading ? t("redirecting") : t("onboardLogin")}
            </button>
            <button onClick={()=>setShowEmail(true)} style={{...equalOptionStyle,marginBottom:16}}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6.5v11a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-11M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5m-18 0 9 6.5 9-6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("continueWithEmail")}
            </button>
          </>
        ) : (
          <>
            <button onClick={()=>setShowEmail(false)}
              style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--text4)",cursor:"pointer",padding:0,marginBottom:16}}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M19 12H5m6-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("backToOptions")}
            </button>
            <EmailCodeLogin
              onSendCode={onSendCode}
              onVerifyCode={onVerifyCode}
              onSuccess={()=>{ localStorage.setItem("wcf_onboarded","1"); onEmailSuccess(); }}
              buttonStyle={{width:"100%",padding:"11px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:16}}
            />
          </>
        )}

        <button onClick={onGuest}
          style={{width:"100%",padding:"11px",borderRadius:12,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--text3)"}}>
          {t("onboardGuest")}
        </button>
      </div>
    </div>
  );
}

// ============================================================
//  FIGURE DETAIL MODAL
// ============================================================
type UserPhoto = { id: string; figure_id: number; user_id: string; url: string; approved: boolean; created_at: string; uploader_email?: string|null; uploader_name?: string|null; uploader_avatar?: string|null; };
type CollectionPhoto = { id: string; user_id: string; url: string; approved: boolean; created_at: string; uploader_name?: string|null; uploader_avatar?: string|null; };

function useFigurePhotos(figureId: number) {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    supabase.from("wcf_photos").select("*").eq("figure_id", figureId).eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setPhotos(data ?? []); setLoading(false); });
  }, [figureId]);
  return { photos, setPhotos, loading };
}

// Fotos de "mi colección" del propio usuario (incluye pendientes de aprobar)
function useMyCollectionPhotos(userId?: string) {
  const [photos, setPhotos] = useState<CollectionPhoto[]>([]);
  const [coverId, setCoverId] = useState<string|null>(null);
  const [shareCode, setShareCode] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    if (!userId) { setPhotos([]); setLoading(false); return; }
    setLoading(true);
    Promise.all([
      supabase.from("wcf_collection_photos").select("*").eq("user_id", userId).order("sort_order", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false }),
      supabase.from("wcf_collection_settings").select("cover_photo_id,share_code").eq("user_id", userId).maybeSingle(),
    ]).then(([photosRes, settingsRes]) => {
      setPhotos(photosRes.data ?? []);
      setCoverId(settingsRes.data?.cover_photo_id ?? null);
      setShareCode(settingsRes.data?.share_code ?? null);
      setLoading(false);
    });
  }, [userId]);
  useEffect(() => { reload(); }, [reload]);
  return { photos, coverId, shareCode, loading, reload };
}

// Genera un código corto y legible para enlaces de colección (sin 0/O/1/l/I, que se confunden)
function generateShareCode(length = 7): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => chars[n % chars.length]).join("");
}

// Likes de un conjunto de fotos de colección: cuenta por foto + cuáles ha dado like el usuario actual
function useCollectionLikes(photoIds: string[], currentUserId?: string | null) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [likedByMe, setLikedByMe] = useState<Set<string>>(new Set());
  const idsKey = photoIds.join(",");

  const reload = useCallback(() => {
    if (photoIds.length === 0) { setCounts({}); setLikedByMe(new Set()); return; }
    supabase.from("wcf_collection_likes").select("photo_id,user_id").in("photo_id", photoIds)
      .then(({ data }) => {
        const c: Record<string, number> = {};
        const mine = new Set<string>();
        for (const row of data ?? []) {
          c[row.photo_id] = (c[row.photo_id] ?? 0) + 1;
          if (currentUserId && row.user_id === currentUserId) mine.add(row.photo_id);
        }
        setCounts(c);
        setLikedByMe(mine);
      });
  }, [idsKey, currentUserId]);

  useEffect(() => { reload(); }, [reload]);

  const toggleLike = async (photoId: string) => {
    if (!currentUserId) return;
    const alreadyLiked = likedByMe.has(photoId);
    // Optimista: actualiza local al instante, sin esperar al servidor
    setLikedByMe(prev => { const n = new Set(prev); alreadyLiked ? n.delete(photoId) : n.add(photoId); return n; });
    setCounts(prev => ({ ...prev, [photoId]: (prev[photoId] ?? 0) + (alreadyLiked ? -1 : 1) }));
    if (alreadyLiked) {
      await supabase.from("wcf_collection_likes").delete().eq("photo_id", photoId).eq("user_id", currentUserId);
    } else {
      await supabase.from("wcf_collection_likes").insert({ photo_id: photoId, user_id: currentUserId });
    }
  };

  return { counts, likedByMe, toggleLike };
}

// Recuento de comentarios por foto para la cuadrícula (miniaturas) — solo
// necesita el número total, no el contenido, así que es una consulta ligera
// separada del hook que carga los comentarios completos de una foto abierta.
function useCollectionCommentCounts(photoIds: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const idsKey = photoIds.join(",");

  const reload = useCallback(() => {
    if (photoIds.length === 0) { setCounts({}); return; }
    supabase.from("wcf_collection_comments").select("photo_id").in("photo_id", photoIds)
      .then(({ data }) => {
        const c: Record<string, number> = {};
        for (const row of data ?? []) c[row.photo_id] = (c[row.photo_id] ?? 0) + 1;
        setCounts(c);
      });
  }, [idsKey]);

  useEffect(() => { reload(); }, [reload]);

  return { counts, reload };
}

// Comentarios de una foto de colección concreta — a diferencia de los likes
// (que cargan contadores de varias fotos a la vez para la cuadrícula), los
// comentarios solo hacen falta cuando el usuario abre una foto en grande,
// así que se cargan bajo demanda para esa única foto.
type PhotoComment = { id: string; photo_id: string; user_id: string; commenter_name: string|null; commenter_avatar: string|null; text: string; created_at: string };

function useCollectionPhotoComments(photoId: string|null) {
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(() => {
    if (!photoId) { setComments([]); return; }
    setLoading(true);
    supabase.from("wcf_collection_comments").select("*").eq("photo_id", photoId)
      .order("created_at", { ascending: true })
      .then(({ data }) => { setComments(data ?? []); setLoading(false); });
  }, [photoId]);

  useEffect(() => { reload(); }, [reload]);

  const addComment = async (userId: string, name: string|null|undefined, avatar: string|null|undefined, text: string) => {
    if (!photoId || !text.trim()) return;
    const trimmed = text.trim().slice(0, 500); // límite razonable, evita comentarios kilométricos
    // Optimista: lo añadimos localmente al instante con un id temporal, y lo
    // sustituimos por la fila real en cuanto Supabase responde.
    const tempId = `temp-${Date.now()}`;
    const optimistic: PhotoComment = { id: tempId, photo_id: photoId, user_id: userId, commenter_name: name ?? null, commenter_avatar: avatar ?? null, text: trimmed, created_at: new Date().toISOString() };
    setComments(prev => [...prev, optimistic]);
    const { data, error } = await supabase.from("wcf_collection_comments")
      .insert({ photo_id: photoId, user_id: userId, commenter_name: name ?? null, commenter_avatar: avatar ?? null, text: trimmed })
      .select().single();
    if (error || !data) { setComments(prev => prev.filter(c => c.id !== tempId)); return; }
    setComments(prev => prev.map(c => c.id === tempId ? data : c));
  };

  const deleteComment = async (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id)); // optimista
    await supabase.from("wcf_collection_comments").delete().eq("id", id);
  };

  return { comments, loading, addComment, deleteComment };
}

// Directorio de todos los usuarios con al menos una foto de colección aprobada
function useCollectionsDirectory() {
  const [entries, setEntries] = useState<{ userId:string; name:string; count:number; coverUrl:string|null }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    type DirPhoto = { id:string; user_id:string; url:string; uploader_name:string|null };
    Promise.all([
      supabase.from("wcf_collection_photos").select("id,user_id,url,uploader_name").eq("approved", true),
      supabase.from("wcf_collection_settings").select("user_id,cover_photo_id"),
    ]).then(([photosRes, settingsRes]) => {
      const photos = (photosRes.data ?? []) as DirPhoto[];
      const coverMap = new Map<string, string|null>((settingsRes.data ?? []).map((s:any) => [s.user_id, s.cover_photo_id]));
      const byUser = new Map<string, { name:string; photos: DirPhoto[] }>();
      for (const p of photos) {
        const entry = byUser.get(p.user_id) ?? { name: p.uploader_name ?? "?", photos: [] as DirPhoto[] };
        entry.photos.push(p);
        byUser.set(p.user_id, entry);
      }
      const result = Array.from(byUser.entries()).map(([userId, { name, photos }]) => {
        const coverId = coverMap.get(userId);
        const cover = photos.find(p => p.id === coverId) ?? photos[0];
        return { userId, name, count: photos.length, coverUrl: cover?.url ?? null };
      }).sort((a,b) => b.count - a.count);
      setEntries(result);
      setLoading(false);
    });
  }, []);
  return { entries, loading };
}

// Galería pública (solo aprobadas) de un usuario concreto
function useUserCollectionGallery(userId: string) {
  const [photos, setPhotos] = useState<CollectionPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    supabase.from("wcf_collection_photos").select("*").eq("user_id", userId).eq("approved", true)
      .order("sort_order", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false })
      .then(({ data }) => { setPhotos(data ?? []); setLoading(false); });
  }, [userId]);
  return { photos, loading };
}

function FigureDetailModal({ figure, set, series, isOwned, isWished, onToggle, onToggleWish, onClose, onPrev, onNext, communityOwned, communityWished, userId }: {
  figure: Figure; set: FigureSet; series: Series;
  isOwned: boolean; isWished: boolean;
  onToggle: ()=>void; onToggleWish: ()=>void; onClose: ()=>void;
  onPrev?: ()=>void; onNext?: ()=>void;
  communityOwned: number; communityWished: number;
  userId?: string;
}) {
  const { t, lang } = useTr();
  const formatDate = (d?: string) => { if(!d) return null; const [y,m]=d.split("-"); return `${T.months[lang][parseInt(m)-1]} ${y}`; };
  const { photos } = useFigurePhotos(figure.id);
  const [uploading, setUploading] = useState(false);
  const [zoomPhotoIndex, setZoomPhotoIndex] = useState<number|null>(null);
  const zoomPhoto = zoomPhotoIndex !== null ? photos[zoomPhotoIndex] : null;
  const zoomPrev = () => setZoomPhotoIndex(i => i===null ? null : (i - 1 + photos.length) % photos.length);
  const zoomNext = () => setZoomPhotoIndex(i => i===null ? null : (i + 1) % photos.length);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState<string|null>(null);

  // Variantes A/B/C (piezas intercambiables, ej. figuras con 2 cabezas).
  // "A" es siempre la imagen principal (figure.image); B, C... vienen de altImages.
  const variantImages = [figure.image, ...(figure.altImages ?? [])].filter(Boolean) as string[];
  const variantLetters = ["A","B","C"];
  const [activeVariant, setActiveVariant] = useState(0);
  useEffect(() => { setActiveVariant(0); }, [figure.id]);
  const displayedImage = variantImages[activeVariant] ?? figure.image;

  const { email: uploaderEmail, name: uploaderName, avatar: uploaderAvatar } = useUserInfo();

  const handleUpload = async (file: File) => {
    if (!userId || !file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const compressed = await compressImageForUpload(file);
      let url: string;
      try {
        url = await uploadToR2(compressed);
      } catch {
        // Reintento automático: en conexiones lentas/inestables (ej. redes
        // internacionales desde algunos países), un fallo puntual de red no
        // significa que la subida no vaya a funcionar en un segundo intento.
        url = await uploadToR2(compressed);
      }
      await supabase.from("wcf_photos").insert({ figure_id: figure.id, user_id: userId, url, uploader_email: uploaderEmail, uploader_name: uploaderName, uploader_avatar: uploaderAvatar, approved: false });
      setUploadDone(true);
    } catch(e) {
      setUploadError(t("uploadNetworkError"));
      console.error(e);
    }
    setUploading(false);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}}>
      {zoomPhoto && (
        <div onClick={e=>{e.stopPropagation();setZoomPhotoIndex(null);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <button onClick={e=>{e.stopPropagation();setZoomPhotoIndex(null);}}
            style={{position:"absolute",top:16,right:16,zIndex:401,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}
            aria-label="Close">
            ✕
          </button>
          <div style={{position:"relative",maxWidth:"100%",maxHeight:"90vh"}} onClick={e=>e.stopPropagation()}>
            <img src={zoomPhoto.url} alt="zoom" style={{display:"block",maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}} />
            {photos.length > 1 && (
              <>
                <button onClick={zoomPrev} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                <button onClick={zoomNext} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20}}>
                  {(zoomPhotoIndex??0)+1} / {photos.length}
                </div>
              </>
            )}
            <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.65)",color:"#fff",fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:8,maxWidth:"80%",textAlign:"right"}}>
              {t("uploadedBy")} {zoomPhoto.uploader_name ?? zoomPhoto.uploader_email ?? t("communityMember")}
            </div>
          </div>
        </div>
      )}
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg)",borderRadius:18,width:"100%",maxWidth:340,overflow:"hidden",boxShadow:"0 12px 40px rgba(0,0,0,0.4)",marginTop:"auto",marginBottom:"auto"}}>
        {/* Image */}
        <div style={{width:"100%",aspectRatio:"1",background:isOwned?series.color+"30":isWished?"#fef9c3":"var(--missing-bg)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          {displayedImage
            ? <img src={displayedImage} alt={figure.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
            : <div style={{fontSize:64}}>{figure.emoji}</div>}
          {onPrev && <button onClick={onPrev} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>}
          {onNext && <button onClick={onNext} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>}
          <button onClick={onClose} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.4)",border:"none",color:"#fff",borderRadius:"50%",width:30,height:30,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {/* Variant selector A/B/C — only shown when the figure has alternate images */}
        {variantImages.length > 1 && (
          <div style={{display:"flex",justifyContent:"center",gap:6,padding:"10px 0 0"}}>
            {variantImages.map((_,i) => (
              <button key={i} onClick={()=>setActiveVariant(i)}
                style={{width:30,height:30,borderRadius:"50%",border:`1.5px solid ${activeVariant===i?series.color:"var(--border)"}`,background:activeVariant===i?series.color:"var(--bg2)",color:activeVariant===i?"#fff":"var(--text3)",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                {variantLetters[i]}
              </button>
            ))}
          </div>
        )}
        {/* Info */}
        <div style={{padding:"14px 16px 16px"}}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:2}}>{figure.name}</div>
          <div style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>{series.name} — {set.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            {set.releaseDate && <span style={{fontSize:11,color:"var(--text4)"}}>📅 {formatDate(set.releaseDate)}</span>}
            <span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:5,background:series.category==="oficial"?"#e6f4fd":"#ede9fe",color:series.category==="oficial"?"#0174b0":"#7c3aed"}}>{series.category==="oficial"?t("officialBadge"):t("resinBadge")}</span>
          </div>
          {/* Community stats */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1,background:"var(--bg2)",borderRadius:8,padding:"8px 10px",textAlign:"center",border:"1px solid var(--border)"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#0196e3"}}>{communityOwned}</div>
              <div style={{fontSize:10,color:"var(--text4)"}}>{t("communityOwnLabel")}</div>
            </div>
            <div style={{flex:1,background:"var(--bg2)",borderRadius:8,padding:"8px 10px",textAlign:"center",border:"1px solid var(--border)"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#f59e0b"}}>{communityWished}</div>
              <div style={{fontSize:10,color:"var(--text4)"}}>{t("communityWishLabel")}</div>
            </div>
          </div>
          {/* Actions */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={onToggle} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:isOwned?series.color:"#0196e3",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700}}>
              {isOwned ? t("figureOwnedBtn") : t("figureMarkOwnedBtn")}
            </button>
            <button onClick={onToggleWish} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${isWished?"#f59e0b":"var(--border)"}`,background:isWished?"#fef3c7":"var(--bg2)",cursor:"pointer",fontSize:16}}>
              {isWished ? "💛" : "🤍"}
            </button>
          </div>

          {/* Community photos */}
          {photos.length > 0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--text3)",marginBottom:8}}>{t("communityPhotosHeader", photos.length)}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                {photos.map((p,i)=>(
                  <div key={p.id} onClick={()=>setZoomPhotoIndex(i)} style={{aspectRatio:"1",borderRadius:8,overflow:"hidden",cursor:"zoom-in",background:"var(--missing-bg)"}}>
                    <img src={p.url} alt="community" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload */}
          {userId && (
            <div style={{borderTop:"1px solid var(--border)",paddingTop:12}}>
              {uploadDone ? (
                <div style={{fontSize:12,color:"#0196e3",textAlign:"center",padding:"8px 0"}}>
                  {t("photoSubmitted")}
                </div>
              ) : (
                <>
                  <div style={{fontSize:11,color:"var(--text4)",marginBottom:8}}>{t("sharePhotoPrompt")}</div>
                  <div style={{display:"flex",gap:8}}>
                    <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,border:"1px dashed var(--border)",cursor:"pointer",fontSize:12,color:"var(--text3)",background:"var(--bg2)"}}>
                      {uploading ? "⏳" : t("galleryBtn")}
                      <input type="file" accept="image/*" style={{display:"none"}} disabled={uploading}
                        onChange={e=>{ const f=e.target.files?.[0]; if(f) handleUpload(f); }} />
                    </label>
                    <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:10,border:"1px dashed var(--border)",cursor:"pointer",fontSize:12,color:"var(--text3)",background:"var(--bg2)"}}>
                      {uploading ? "⏳" : t("cameraBtn")}
                      <input type="file" accept="image/*" capture="environment" style={{display:"none"}} disabled={uploading}
                        onChange={e=>{ const f=e.target.files?.[0]; if(f) handleUpload(f); }} />
                    </label>
                  </div>
                  <div style={{fontSize:10,color:"var(--text4)",marginTop:6,textAlign:"center"}}>{t("photosReviewedNote")}</div>
                  {uploadError && (
                    <div style={{fontSize:11,color:"#dc2626",marginTop:8,textAlign:"center",background:"#fee2e2",borderRadius:8,padding:"6px 8px"}}>
                      ⚠️ {uploadError}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {!userId && (
            <div style={{borderTop:"1px solid var(--border)",paddingTop:12,fontSize:11,color:"var(--text4)",textAlign:"center"}}>
              {t("loginToSharePhoto")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  ADMIN PHOTO MODERATION
// ============================================================
function buildFigureNameMap(data: Series[]): Record<number, string> {
  const map: Record<number, string> = {};
  data.forEach(series => {
    const allSets: FigureSet[] = [
      ...(series.sets ?? []),
      ...(series.groups ?? []).flatMap(g => g.sets ?? []),
    ];
    allSets.forEach(set => {
      (set.figures ?? []).forEach(fig => {
        map[fig.id] = `${fig.name} — ${series.name} (${set.name})`;
      });
    });
  });
  return map;
}

function findFigureContext(data: Series[], figureId: number): { figure: Figure; set: FigureSet; series: Series; group?: FigureGroup } | null {
  for (const series of data) {
    for (const set of series.sets ?? []) {
      const figure = (set.figures ?? []).find(f => f.id === figureId);
      if (figure) return { figure, set, series };
    }
    for (const group of series.groups ?? []) {
      for (const set of group.sets ?? []) {
        const figure = (set.figures ?? []).find(f => f.id === figureId);
        if (figure) return { figure, set, series, group };
      }
    }
  }
  return null;
}

// ============================================================
//  ADMIN ANALYTICS PANEL
// ============================================================
function useAdminAnalytics(data: Series[]) {
  const [rows, setRows] = useState<{ created_at: string|null; last_seen: string|null; owned: number[]; wishlist: number[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("wcf_progress").select("created_at,last_seen,owned,wishlist")
      .then(({ data: rows_ }) => { setRows((rows_ as any) ?? []); setLoading(false); });
  }, []);

  const totalUsers = rows.length;
  const now = Date.now();
  const activeLast7 = rows.filter(r => r.last_seen && now - new Date(r.last_seen).getTime() < 7 * 86400000).length;
  const activeLast30 = rows.filter(r => r.last_seen && now - new Date(r.last_seen).getTime() < 30 * 86400000).length;
  const convertedUsers = rows.filter(r => (r.owned?.length ?? 0) > 0 || (r.wishlist?.length ?? 0) > 0).length;
  const conversionRate = totalUsers > 0 ? Math.round((convertedUsers / totalUsers) * 100) : 0;

  // Altas por semana, últimas 12 semanas
  const weeklySignups = useMemo(() => {
    const buckets: { label: string; count: number }[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const start = new Date(today);
      start.setHours(0,0,0,0);
      start.setDate(today.getDate() - i * 7 - today.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      const label = `${start.getDate()}/${start.getMonth() + 1}`;
      const count = rows.filter(r => {
        if (!r.created_at) return false;
        const d = new Date(r.created_at);
        return d >= start && d < end;
      }).length;
      buckets.push({ label, count });
    }
    return buckets;
  }, [rows]);

  // Franquicias más marcadas (por número de figuras obtenidas)
  const topFranchises = useMemo(() => {
    const figureToSeriesName = new Map<number, string>();
    for (const s of data) {
      for (const st of [...s.sets, ...s.groups.flatMap(g => g.sets)]) {
        for (const f of st.figures) figureToSeriesName.set(f.id, s.name);
      }
    }
    const counts: Record<string, number> = {};
    for (const r of rows) {
      for (const fid of r.owned ?? []) {
        const name = figureToSeriesName.get(fid);
        if (name) counts[name] = (counts[name] ?? 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, [rows, data]);

  return { loading, totalUsers, activeLast7, activeLast30, conversionRate, convertedUsers, weeklySignups, topFranchises };
}

function AdminAnalyticsPanel({ onClose, data }: { onClose: ()=>void; data: Series[] }) {
  const { loading, totalUsers, activeLast7, activeLast30, conversionRate, convertedUsers, weeklySignups, topFranchises } = useAdminAnalytics(data);

  const MetricCard = ({ label, value }: { label:string; value:string|number }) => (
    <div style={{flex:1,minWidth:110,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 14px"}}>
      <div style={{fontSize:22,fontWeight:800,color:"var(--text)"}}>{value}</div>
      <div style={{fontSize:11,color:"var(--text4)",marginTop:2}}>{label}</div>
    </div>
  );

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg)",borderRadius:18,width:"100%",maxWidth:520,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 12px 40px rgba(0,0,0,0.4)"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:700}}>📊 Analytics</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:16}}>
          {loading ? (
            <div style={{textAlign:"center",padding:"40px 0",color:"var(--text4)",fontSize:13}}>Loading...</div>
          ) : (
            <>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:24}}>
                <MetricCard label="Total users" value={totalUsers} />
                <MetricCard label="Active (7d)" value={activeLast7} />
                <MetricCard label="Active (30d)" value={activeLast30} />
                <MetricCard label={`Conversion (${convertedUsers}/${totalUsers})`} value={`${conversionRate}%`} />
              </div>

              <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:8}}>New signups — last 12 weeks</div>
              <div style={{width:"100%",height:180,marginBottom:24}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySignups} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#888" }} interval={1} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#888" }} width={28} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#0196e3" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{fontSize:12,fontWeight:700,color:"var(--text3)",marginBottom:8}}>Top franchises (figures owned)</div>
              <div style={{width:"100%",height:Math.max(180, topFranchises.length*32),marginBottom:8}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topFranchises} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#888" }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#888" }} width={90} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PhotoModerationPanel({ onClose, data }: { onClose: ()=>void; data: Series[] }) {
  const [source, setSource] = useState<"figures"|"collections">("figures");
  const [tab, setTab] = useState<"pending"|"approved">("pending");
  const [pending, setPending] = useState<(UserPhoto|CollectionPhoto)[]>([]);
  const [approved, setApproved] = useState<(UserPhoto|CollectionPhoto)[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string|null>(null);

  const figureNameMap = useMemo(() => buildFigureNameMap(data), [data]);
  const tableName = source === "figures" ? "wcf_photos" : "wcf_collection_photos";

  const loadPending = () => {
    setLoading(true);
    supabase.from(tableName).select("*").eq("approved", false).order("created_at", { ascending: true })
      .then(({ data }) => { setPending(data ?? []); setLoading(false); });
  };

  const loadApproved = () => {
    setLoading(true);
    supabase.from(tableName).select("*").eq("approved", true).order("created_at", { ascending: false })
      .then(({ data }) => { setApproved(data ?? []); setLoading(false); });
  };

  useEffect(() => {
    if (tab === "pending") loadPending();
    else loadApproved();
  }, [tab, source]);

  const approve = async (id: string) => {
    await supabase.from(tableName).update({ approved: true }).eq("id", id);
    setPending(p => p.filter(x => x.id !== id));
  };

  const reject = async (id: string) => {
    await supabase.from(tableName).delete().eq("id", id);
    setPending(p => p.filter(x => x.id !== id));
  };

  const deleteApproved = async (id: string) => {
    await supabase.from(tableName).delete().eq("id", id);
    if (source === "collections") {
      // Si esa foto era la portada de alguien, hay que limpiar la referencia
      await supabase.from("wcf_collection_settings").delete().eq("cover_photo_id", id);
    }
    setApproved(p => p.filter(x => x.id !== id));
    setConfirmDeleteId(null);
  };

  const list = tab === "pending" ? pending : approved;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg)",borderRadius:18,width:"100%",maxWidth:400,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 12px 40px rgba(0,0,0,0.4)"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:15,fontWeight:700}}>📸 Photo moderation</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--text3)"}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid var(--border)",padding:"8px 12px 0",gap:6}}>
          <button onClick={()=>{setSource("figures");setTab("pending");}} style={{flex:1,padding:"7px",borderRadius:"8px 8px 0 0",border:"none",background:source==="figures"?"var(--bg2)":"transparent",cursor:"pointer",fontWeight:700,fontSize:11,color:source==="figures"?"var(--text)":"var(--text4)"}}>
            🧩 Figures
          </button>
          <button onClick={()=>{setSource("collections");setTab("pending");}} style={{flex:1,padding:"7px",borderRadius:"8px 8px 0 0",border:"none",background:source==="collections"?"var(--bg2)":"transparent",cursor:"pointer",fontWeight:700,fontSize:11,color:source==="collections"?"var(--text)":"var(--text4)"}}>
            🖼️ Collections
          </button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid var(--border)"}}>
          <button onClick={()=>setTab("pending")} style={{flex:1,padding:"10px",border:"none",background:tab==="pending"?"var(--bg2)":"transparent",cursor:"pointer",fontWeight:700,fontSize:12,color:tab==="pending"?"var(--text)":"var(--text4)",borderBottom:tab==="pending"?"2px solid #0196e3":"2px solid transparent"}}>
            Pending {pending.length>0 && tab==="pending" ? `(${pending.length})` : ""}
          </button>
          <button onClick={()=>setTab("approved")} style={{flex:1,padding:"10px",border:"none",background:tab==="approved"?"var(--bg2)":"transparent",cursor:"pointer",fontWeight:700,fontSize:12,color:tab==="approved"?"var(--text)":"var(--text4)",borderBottom:tab==="approved"?"2px solid #0196e3":"2px solid transparent"}}>
            Approved
          </button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:16}}>
          {loading && <div style={{textAlign:"center",color:"var(--text4)"}}>Loading...</div>}
          {!loading && list.length === 0 && (
            <div style={{textAlign:"center",color:"var(--text4)"}}>
              {tab==="pending" ? "No pending photos 🎉" : "No approved photos yet"}
            </div>
          )}
          {list.map(p=>(
            <div key={p.id} style={{marginBottom:16,border:"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
              <img src={p.url} alt="figure" style={{width:"100%",maxHeight:280,objectFit:"contain",background:"var(--missing-bg)"}} />
              <div style={{padding:"10px 12px"}}>
                {source === "figures" && (
                  <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>
                    {figureNameMap[(p as UserPhoto).figure_id] ?? `Figure ID: ${(p as UserPhoto).figure_id}`}
                  </div>
                )}
                <div style={{fontSize:11,color:"var(--text4)",marginBottom:8}}>
                  👤 {p.uploader_name ?? (p as UserPhoto).uploader_email ?? "Unknown (uploaded before tracking was added)"}
                </div>
                {tab === "pending" ? (
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>approve(p.id)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"#0196e3",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>✅ Approve</button>
                    <button onClick={()=>reject(p.id)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontWeight:700,fontSize:12}}>🗑 Reject</button>
                  </div>
                ) : confirmDeleteId === p.id ? (
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>deleteApproved(p.id)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>Confirm delete</button>
                    <button onClick={()=>setConfirmDeleteId(null)} style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--text3)",cursor:"pointer",fontWeight:700,fontSize:12}}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={()=>setConfirmDeleteId(p.id)} style={{width:"100%",padding:"8px",borderRadius:8,border:"none",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontWeight:700,fontSize:12}}>🗑 Delete photo</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  LOGIN MODAL
// ============================================================
// ============================================================
//  EMAIL + CODE LOGIN — reusable across LoginModal and OnboardingModal
// ============================================================
function EmailCodeLogin({ onSendCode, onVerifyCode, onSuccess, buttonStyle }: {
  onSendCode:(email:string)=>Promise<{error:unknown}>;
  onVerifyCode:(email:string,code:string)=>Promise<{error:unknown}>;
  onSuccess:()=>void;
  buttonStyle?: React.CSSProperties;
}) {
  const { t } = useTr();
  const [step, setStep] = useState<"email"|"code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle");

  const handleSendCode = async () => {
    if (!email.includes("@") || !email.includes(".")) { setStatus("error"); return; }
    setStatus("loading");
    const { error } = await onSendCode(email);
    if (error) { setStatus("error"); return; }
    setStatus("idle");
    setStep("code");
  };

  const handleVerify = async () => {
    if (code.trim().length < 6) { setStatus("error"); return; }
    setStatus("loading");
    const { error } = await onVerifyCode(email, code.trim());
    if (error) { setStatus("error"); return; }
    onSuccess();
  };

  const defaultBtnStyle: React.CSSProperties = {width:"100%",padding:"11px",borderRadius:10,border:"none",background:"#0196e3",color:"#fff",cursor:status==="loading"?"default":"pointer",fontSize:13,fontWeight:700,marginBottom:12,opacity:status==="loading"?0.7:1};

  if (step === "code") {
    return (
      <>
        <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{t("enterCodeTitle")}</div>
        <div style={{fontSize:11,color:"var(--text4)",marginBottom:12}}>{t("enterCodeDesc", email)}</div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={e=>{ setCode(e.target.value.replace(/\D/g,"")); if(status==="error") setStatus("idle"); }}
          onKeyDown={e=>{ if(e.key==="Enter") handleVerify(); }}
          placeholder={t("codePlaceholder")}
          autoFocus
          style={{width:"100%",padding:"11px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",fontSize:20,letterSpacing:6,textAlign:"center",marginBottom:8,boxSizing:"border-box"}}
        />
        {status === "error" && (
          <div style={{fontSize:11,color:"#dc2626",marginBottom:8}}>{t("invalidCode")}</div>
        )}
        <button onClick={handleVerify} disabled={status==="loading"}
          style={buttonStyle ?? defaultBtnStyle}>
          {status==="loading" ? t("verifyingCode") : t("verifyCode")}
        </button>
        <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:12}}>
          <button onClick={()=>{ setStep("email"); setCode(""); setStatus("idle"); }}
            style={{background:"none",border:"none",fontSize:11,color:"var(--text4)",cursor:"pointer",padding:0}}>
            {t("backToEmail")}
          </button>
          <button onClick={handleSendCode} disabled={status==="loading"}
            style={{background:"none",border:"none",fontSize:11,color:"#0196e3",cursor:"pointer",padding:0}}>
            {t("resendCode")}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={e=>{ setEmail(e.target.value); if(status==="error") setStatus("idle"); }}
        onKeyDown={e=>{ if(e.key==="Enter") handleSendCode(); }}
        placeholder={t("emailPlaceholder")}
        style={{width:"100%",padding:"11px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",fontSize:13,marginBottom:8,boxSizing:"border-box"}}
      />
      {status === "error" && (
        <div style={{fontSize:11,color:"#dc2626",marginBottom:8}}>{t("invalidEmail")}</div>
      )}
      <button onClick={handleSendCode} disabled={status==="loading"}
        style={buttonStyle ?? defaultBtnStyle}>
        {status==="loading" ? t("sendingLink") : t("sendMagicLink")}
      </button>
    </>
  );
}

function LoginModal({ onClose, onGoogle, onSendCode, onVerifyCode }: { onClose:()=>void; onGoogle:()=>Promise<{error:unknown}>; onSendCode:(email:string)=>Promise<{error:unknown}>; onVerifyCode:(email:string,code:string)=>Promise<{error:unknown}> }) {
  const { t } = useTr();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false); // alterna entre las 2 opciones iguales y el formulario de email
  const handleGoogleClick = async () => {
    if (googleLoading) return; // ignora clics mientras ya hay uno en curso
    setGoogleLoading(true);
    // No cerramos el modal aquí: la página va a redirigir a Google en breve.
    // Si el usuario sigue viendo el modal unos instantes, el botón ya
    // aparece deshabilitado/"Redirigiendo...", así que no vuelve a pulsar.
    const { error } = await onGoogle();
    if (error) setGoogleLoading(false); // solo si falla; si tiene éxito, la página navega fuera
  };

  // Mismo estilo exacto para ambas opciones — ninguna debe parecer "la principal"
  // y la otra "la alternativa de segunda categoría" (esto era justo el problema:
  // usuarios en China se quedaban atascados en Google sin darse cuenta de que
  // el email era una opción igual de válida).
  const equalOptionStyle: React.CSSProperties = {width:"100%",padding:"14px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:28,width:"100%",maxWidth:340,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>📦</div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>WCF Checklist</div>
        <div style={{fontSize:13,color:"var(--text3)",marginBottom:24}}>{t("signInToMark")}</div>

        {!showEmail ? (
          <>
            <button onClick={handleGoogleClick} disabled={googleLoading}
              style={{...equalOptionStyle,cursor:googleLoading?"default":"pointer",opacity:googleLoading?0.6:1,marginBottom:10}}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{width:18,height:18}} />
              {googleLoading ? t("redirecting") : t("signInGoogle")}
            </button>
            <button onClick={()=>setShowEmail(true)}
              style={{...equalOptionStyle,marginBottom:16}}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6.5v11a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-11M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5m-18 0 9 6.5 9-6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("continueWithEmail")}
            </button>
          </>
        ) : (
          <>
            <button onClick={()=>setShowEmail(false)}
              style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--text4)",cursor:"pointer",padding:0,marginBottom:16}}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M19 12H5m6-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("backToOptions")}
            </button>
            <EmailCodeLogin onSendCode={onSendCode} onVerifyCode={onVerifyCode} onSuccess={onClose} />
          </>
        )}

        <button onClick={onClose}
          style={{width:"100%",padding:"10px",borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--text3)"}}>
          {t("guestMode")}
        </button>
      </div>
    </div>
  );
}

// ============================================================
//  CHOOSE NAME MODAL — shown once when a user has no display name yet
// ============================================================
function SettingsModal({ userId, currentName, currentAvatar, onSaveName, onSaveAvatar, onClose }: {
  userId: string;
  currentName: string;
  currentAvatar?: string|null;
  onSaveName:(name:string)=>Promise<{error:unknown}>;
  onSaveAvatar:(url:string|null)=>Promise<{error:unknown}>;
  onClose:()=>void;
}) {
  const { t } = useTr();
  const [name, setName] = useState(currentName);
  const [avatarPreview, setAvatarPreview] = useState<string|null|undefined>(currentAvatar);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleAvatarFile = async (file: File) => {
    setUploadingAvatar(true);
    setError(null);
    try {
      const compressed = await compressImageForUpload(file, 400, 0.85);
      const url = await uploadToR2(compressed);
      setAvatarPreview(url);
    } catch {
      setError(t("uploadNetworkError"));
    }
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setError(t("nameRequired")); return; }
    setSaving(true);
    setError(null);
    const [nameRes, avatarRes] = await Promise.all([
      trimmed !== currentName ? onSaveName(trimmed) : Promise.resolve({ error: null }),
      avatarPreview !== currentAvatar ? onSaveAvatar(avatarPreview ?? null) : Promise.resolve({ error: null }),
    ]);
    if (nameRes.error || avatarRes.error) {
      setSaving(false);
      setError(t("uploadNetworkError"));
      return;
    }
    // Sincroniza el nombre/avatar nuevo en todo el historial ya guardado
    // (fotos subidas, progreso), para que rankings y colecciones se
    // actualicen al instante sin esperar a la próxima acción del usuario.
    const finalAvatar = avatarPreview ?? null;
    await Promise.all([
      supabase.from("wcf_progress").update({ owner_name: trimmed, owner_avatar: finalAvatar }).eq("user_id", userId),
      supabase.from("wcf_photos").update({ uploader_name: trimmed, uploader_avatar: finalAvatar }).eq("user_id", userId),
      supabase.from("wcf_collection_photos").update({ uploader_name: trimmed, uploader_avatar: finalAvatar }).eq("user_id", userId),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:24,width:"100%",maxWidth:340,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:18}}>{t("settingsTitle")}</div>

        <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
          <div style={{position:"relative",width:76,height:76}}>
            <div style={{width:76,height:76,borderRadius:"50%",overflow:"hidden",background:"#0196e3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:700,color:"#fff"}}>
              {uploadingAvatar ? "⏳" : avatarPreview
                ? <img src={avatarPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : (name[0]?.toUpperCase() ?? "?")}
            </div>
            <label style={{position:"absolute",bottom:-2,right:-2,width:26,height:26,borderRadius:"50%",background:"var(--bg)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:"pointer"}}>
              ✏️
              <input type="file" accept="image/*" style={{display:"none"}} disabled={uploadingAvatar}
                onChange={e=>{ const f=e.target.files?.[0]; if(f) handleAvatarFile(f); }} />
            </label>
          </div>
        </div>
        {avatarPreview && (
          <button onClick={()=>setAvatarPreview(null)} style={{background:"none",border:"none",color:"#dc2626",fontSize:11,cursor:"pointer",marginBottom:16}}>
            {t("removeAvatarBtn")}
          </button>
        )}
        {!avatarPreview && <div style={{marginBottom:16}} />}

        <div style={{textAlign:"left",marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--text3)",marginBottom:6}}>{t("displayNameLabel")}</div>
          <input
            type="text"
            value={name}
            onChange={e=>{ setName(e.target.value); setError(null); }}
            style={{width:"100%",padding:"11px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",fontSize:14,boxSizing:"border-box"}}
          />
        </div>

        {error && <div style={{fontSize:11,color:"#dc2626",marginTop:8,textAlign:"center"}}>{error}</div>}
        {saved && <div style={{fontSize:12,color:"#0196e3",marginTop:10,textAlign:"center"}}>{t("settingsSaved")}</div>}

        <button onClick={handleSave} disabled={saving || uploadingAvatar}
          style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"#0196e3",color:"#fff",cursor:saving?"default":"pointer",fontSize:14,fontWeight:700,marginTop:16,opacity:saving||uploadingAvatar?0.7:1}}>
          {t("saveSettings")}
        </button>
        <button onClick={onClose} style={{width:"100%",padding:"10px",borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--text3)",marginTop:4}}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}


function ChooseNameModal({ onSave }: { onSave:(name:string)=>Promise<{error:unknown}> }) {
  const { t } = useTr();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setError(true); return; }
    setSaving(true);
    await onSave(trimmed);
    setSaving(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:28,width:"100%",maxWidth:340,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:10}}>👋</div>
        <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{t("chooseNameTitle")}</div>
        <div style={{fontSize:12,color:"var(--text3)",marginBottom:18}}>{t("chooseNameDesc")}</div>
        <input
          type="text"
          value={name}
          onChange={e=>{ setName(e.target.value); if(error) setError(false); }}
          onKeyDown={e=>{ if(e.key==="Enter") handleSave(); }}
          placeholder={t("namePlaceholder")}
          autoFocus
          style={{width:"100%",padding:"11px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",fontSize:14,marginBottom:8,boxSizing:"border-box",textAlign:"center"}}
        />
        {error && <div style={{fontSize:11,color:"#dc2626",marginBottom:8}}>{t("nameRequired")}</div>}
        <button onClick={handleSave} disabled={saving}
          style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"#0196e3",color:"#fff",cursor:saving?"default":"pointer",fontSize:14,fontWeight:700,opacity:saving?0.7:1}}>
          {t("saveName")}
        </button>
      </div>
    </div>
  );
}

// ============================================================
//  ADMIN EMAILS — añade aquí los emails con acceso admin
// ============================================================
const ADMIN_EMAILS = [
  "xavoroolz@gmail.com",
];



// ============================================================
//  PUBLIC COLLECTION PAGE — /c/<userId>, sin necesitar cuenta ni login
// ============================================================
function PublicCollectionPage({ code }: { code: string }) {
  const { lang, t } = useLang();
  const langValue = useMemo(() => ({ t, lang }), [t, lang]);
  const [resolvedUserId, setResolvedUserId] = useState<string | null | undefined>(undefined); // undefined = resolviendo, null = no encontrado
  useEffect(() => {
    supabase.from("wcf_collection_settings").select("user_id").eq("share_code", code).maybeSingle()
      .then(({ data }) => setResolvedUserId(data?.user_id ?? null));
  }, [code]);
  const { photos, loading: photosLoading } = useUserCollectionGallery(resolvedUserId ?? "");
  const loading = resolvedUserId === undefined || (resolvedUserId !== null && photosLoading);
  const [zoomIndex, setZoomIndex] = useState<number|null>(null);
  const name = photos[0]?.uploader_name ?? "?";
  const notFound = resolvedUserId === null || (!loading && photos.length === 0);

  return (
    <LangProvider value={langValue}>
      <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",padding:"24px 16px"}}>
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <img src="/icons/icon-96x96.png" alt="WCF" style={{width:36,height:36,borderRadius:9}} />
            <div style={{fontWeight:800,fontSize:16}}>WCF Checklist</div>
          </div>

          {loading ? (
            <div style={{textAlign:"center",padding:"48px 0",color:"var(--text4)",fontSize:13}}>...</div>
          ) : notFound ? (
            <div style={{textAlign:"center",padding:"48px 16px"}}>
              <div style={{fontSize:40,marginBottom:12}}>🖼️</div>

              <div style={{fontSize:13,color:"var(--text3)",marginBottom:20}}>{t("publicCollectionNotFound")}</div>
              <a href={CANONICAL_ORIGIN} style={{display:"inline-block",padding:"10px 20px",borderRadius:10,background:"#0196e3",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:13}}>
                {t("goToApp")}
              </a>
            </div>
          ) : (
            <>
              <div style={{fontSize:17,fontWeight:700,marginBottom:16}}>{t("collectionOf", name)}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:24}}>
                {photos.map((p,i) => (
                  <div key={p.id} onClick={()=>setZoomIndex(i)} style={{aspectRatio:"1",borderRadius:10,overflow:"hidden",cursor:"pointer",background:"var(--bg2)"}}>
                    <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center"}}>
                <a href={CANONICAL_ORIGIN} style={{display:"inline-block",padding:"10px 20px",borderRadius:10,background:"#0196e3",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:13}}>
                  {t("goToApp")}
                </a>
              </div>
            </>
          )}
        </div>
        {zoomIndex !== null && (
          <div onClick={()=>setZoomIndex(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:420,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
            <button onClick={e=>{e.stopPropagation();setZoomIndex(null);}}
              style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
              ✕
            </button>
            <img src={photos[zoomIndex].url} alt="" onClick={e=>e.stopPropagation()} style={{display:"block",maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}} />
          </div>
        )}
      </div>
    </LangProvider>
  );
}

// Punto rojo de "hay actividad nueva" — compara la fecha del último vistazo
// del usuario (guardada en wcf_collection_settings) contra los likes/comentarios
// más recientes en SUS PROPIAS fotos de colección, excluyendo sus propias
// acciones. Sin Service Worker ni notificaciones push: solo una comprobación
// ligera que se repite cada vez que se abre la app o se marca como vista.
function useHasNewCollectionActivity(userId?: string | null) {
  const [hasNew, setHasNew] = useState(false);

  const check = useCallback(async () => {
    if (!userId) { setHasNew(false); return; }

    const { data: settings } = await supabase.from("wcf_collection_settings")
      .select("notifications_last_seen_at").eq("user_id", userId).maybeSingle();
    const lastSeen = settings?.notifications_last_seen_at ?? "1970-01-01T00:00:00Z";

    const { data: myPhotos } = await supabase.from("wcf_collection_photos").select("id").eq("user_id", userId);
    const photoIds = (myPhotos ?? []).map(p => p.id);
    if (photoIds.length === 0) { setHasNew(false); return; }

    const [{ count: likeCount }, { count: commentCount }] = await Promise.all([
      supabase.from("wcf_collection_likes").select("id", { count: "exact", head: true })
        .in("photo_id", photoIds).gt("created_at", lastSeen).neq("user_id", userId),
      supabase.from("wcf_collection_comments").select("id", { count: "exact", head: true })
        .in("photo_id", photoIds).gt("created_at", lastSeen).neq("user_id", userId),
    ]);
    setHasNew((likeCount ?? 0) + (commentCount ?? 0) > 0);
  }, [userId]);

  useEffect(() => { check(); }, [check]);

  const markSeen = async () => {
    if (!userId) return;
    setHasNew(false); // optimista
    await supabase.from("wcf_collection_settings").upsert({ user_id: userId, notifications_last_seen_at: new Date().toISOString() }, { onConflict: "user_id" });
  };

  return { hasNew, markSeen, recheck: check };
}

function MainApp() {
  const { user, authReady, signInWithGoogle, signInWithEmail, verifyEmailCode, updateName, updateAvatar, signOut } = useAuth();
  const { hasNew: hasNewCollectionActivity, markSeen: markCollectionActivitySeen } = useHasNewCollectionActivity(user?.id ?? null);
  const { owned, toggle, wishlist, toggleWish, favourites, toggleFavourite, lastSeenAnnouncementId, markAnnouncementsSeen, imgbbKey, ready: ownedReady } = useOwned(user?.id ?? null, user?.name ?? null, user?.email ?? null, user?.avatar ?? null);
  const { data, setData, ready: dataReady } = useData();
  const { figureOwned: communityOwned, figureWished: communityWished, users: communityUsers, totalOwned: communityTotal, topOwned, topWished } = useCommunityStats();
  const [figuresWithPhotos, setFiguresWithPhotos] = useState<Record<number,number>>({});

  // Registra la última visita real (abrió la app, marque algo o no), una vez por sesión de navegador
  useEffect(() => {
    if (!user?.id) return;
    const flagKey = "wcf_last_seen_pinged";
    if (sessionStorage.getItem(flagKey) === user.id) return;
    sessionStorage.setItem(flagKey, user.id);
    supabase.from("wcf_progress").update({ last_seen: new Date().toISOString() }).eq("user_id", user.id)
      .then(({ error }) => { if (error) console.error("last_seen ping error:", error); });
  }, [user?.id]);

  useEffect(() => {
    supabase.from("wcf_photos").select("figure_id").eq("approved", true)
      .then(({ data }) => {
        if (data) { const counts: Record<number,number> = {}; data.forEach((r: {figure_id:number}) => { counts[r.figure_id] = (counts[r.figure_id]??0)+1; }); setFiguresWithPhotos(counts); }
      });
  }, []);
  const { lang, setLang, t } = useLang();
  const { dark, toggleDark } = useDarkMode();
  const ready = ownedReady && dataReady && authReady;

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email ?? "") : false;
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [editSeriesData, setEditSeriesData] = useState<Series|null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding only once for new users
  useEffect(() => {
    if (authReady && !user && !localStorage.getItem("wcf_onboarded")) {
      setShowOnboarding(true);
    }
  }, [authReady, user]);
  const [installPrompt, setInstallPrompt] = useState<Event|null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const [showIOSBanner, setShowIOSBanner] = useState(() => isIOS && !localStorage.getItem("wcf_ios_banner_dismissed") && !window.matchMedia('(display-mode: standalone)').matches);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const latestId = Math.max(...CHANGELOG.map(c=>c.id));
  const [showChangelog, setShowChangelog] = useState(() => {
    const seen = parseInt(localStorage.getItem("wcf_changelog_seen") ?? "0");
    return seen < latestId;
  });
  const { favItems: newsItems, allItems: newsAllItems, maxId: newsMaxId, loaded: newsLoaded } = useAnnouncements(favourites, ownedReady);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showNewsHistory, setShowNewsHistory] = useState(false);
  const newsAutoChecked = useRef(false);
  useEffect(() => {
    if (newsLoaded && !newsAutoChecked.current) {
      newsAutoChecked.current = true;
      if (newsItems.some(a => a.id > lastSeenAnnouncementId)) setShowNewsModal(true);
    }
  }, [newsLoaded]);
  const closeNewsModal = () => { markAnnouncementsSeen(newsMaxId); setShowNewsModal(false); };
  const apiKey = imgbbKey;

  const requireLogin = (fn: ()=>void) => {
    if (!user) { setShowLogin(true); return; }
    fn();
  };
  const toggleWithAuth = (id: number) => requireLogin(()=>toggle(id));
  const toggleWishWithAuth = (id: number) => requireLogin(()=>toggleWish(id));

  const addSeries = (name:string,emoji:string,color:string,logoHeader:string,bgImage:string,category:CategoryType="oficial") => { const s:Series={id:newId(),name,emoji,logoHeader,bgImage,color,category,sets:[],groups:[]}; setData(d=>[...d,s]); };
  const updateSeries = (sid:number,name:string,emoji:string,color:string,logoHeader:string,bgImage:string) => setData(d=>d.map(s=>s.id===sid?{...s,name,emoji,color,logoHeader,bgImage}:s));
  const deleteSeries = (sid:number) => setData(d=>d.filter(s=>s.id!==sid));
  const addSet = (sid:number, gid?:number) => {
    const newSet:FigureSet = {id:newId(),name:"Nuevo set",releaseDate:"",seriesLogo:"",figures:[]};
    setData(d=>d.map(s=>{ if(s.id!==sid) return s;
      if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:[...g.sets,newSet]}:g)};
      return {...s,sets:[...s.sets,newSet]};
    }));
  };
  const duplicateSet = (sid:number, stid:number, gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const findSet = (sets:FigureSet[]) => sets.find(x=>x.id===stid);
    const dupSet = (sets:FigureSet[]) => { const st=findSet(sets); if(!st) return sets; return [...sets,{...st,id:newId(),name:st.name+" - copia",figures:[]}]; };
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:dupSet(g.sets)}:g)};
    return {...s,sets:dupSet(s.sets)};
  }));
  const updateSet = (sid:number,stid:number,name:string,releaseDate:string,seriesLogo:string,gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,name,releaseDate,seriesLogo}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
  }));
  const deleteSet = (sid:number,stid:number,gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:g.sets.filter(st=>st.id!==stid)}:g)};
    return {...s,sets:s.sets.filter(st=>st.id!==stid)};
  }));
  // Group mutations
  const addGroup = (sid:number) => setData(d=>d.map(s=>s.id===sid?{...s,groups:[...s.groups,{id:newId(),name:"Nuevo grupo",logo:"",sets:[]}]}:s));
  const updateGroup = (sid:number,gid:number,name:string,logo:string) => setData(d=>d.map(s=>s.id===sid?{...s,groups:s.groups.map(g=>g.id===gid?{...g,name,logo}:g)}:s));
  const deleteGroup = (sid:number,gid:number) => setData(d=>d.map(s=>s.id===sid?{...s,groups:s.groups.filter(g=>g.id!==gid)}:s));
  const moveSetToGroup = (sid:number, stid:number, gid:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const st = s.sets.find(x=>x.id===stid); if(!st) return s;
    return {...s, sets:s.sets.filter(x=>x.id!==stid), groups:s.groups.map(g=>g.id===gid?{...g,sets:[...g.sets,st]}:g)};
  }));
  const addFigure = (sid:number,stid:number,f:Omit<Figure,"id">&{id?:number},gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures:[...st.figures,{...f,id:f.id??newId()}]}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
  }));
  const addFigures = (sid:number,stid:number,fs:Omit<Figure,"id">[],gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const newFigs = fs.map(f=>({...f,id:newId()}));
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures:[...st.figures,...newFigs]}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
  }));

  const reorderFigures = (sid:number,stid:number,figures:Figure[],gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
  }));
  const reorderSets = (sid:number,gid:number,sets:FigureSet[]) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets}:g)};
  }));
  const updateFigure = (sid:number,stid:number,fid:number,f:Omit<Figure,"id">,gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures:st.figures.map(fig=>fig.id===fid?{...fig,...f}:fig)}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
  }));
  const deleteFigure = (sid:number,stid:number,fid:number,gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures:st.figures.filter(f=>f.id!==fid)}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
  }));

  const langValue = { t, lang };

  // ── Tab state ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>("collection");

  // ── Filter/sort/size state (independent per tab) ───────────
  const [colSearch,  setColSearch]  = useState("");
  const [colSort,    setColSort]    = useState<"alpha"|"date">("date");
  const [colSize,    setColSize]    = useState<"s"|"m"|"l">("m");
  const [colSubTab,  setColSubTab]  = useState<"owned"|"wishlist">("owned");
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  const toggleSeriesExpanded = (id: string) => setExpandedSeries(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const [colSeries,  setColSeries]  = useState<number|"all">("all");
  const [colCategory, setColCategory] = useState<"all"|CategoryType>("all");

  const [dbSearch,   setDbSearch]   = useState("");
  const [dbFilter,   setDbFilter]   = useState<"all"|"owned"|"wishlist"|"missing">("all");
  const [dbSort,     setDbSort]     = useState<"alpha"|"date">("date");
  const [dbSize,     setDbSize]     = useState<"s"|"m"|"l">("s");

  const [confirmFigure, setConfirmFigure] = useState<ConfirmFigure|null>(null);
  const [detailFigureCol, setDetailFigureCol] = useState<{figure:Figure;series:Series;set:FigureSet}|null>(null);
  const [dbSeries,   setDbSeries]   = useState<number|"all">("all");
  const [dbCategory, setDbCategory] = useState<"all"|CategoryType>("all");
  const [dbSelectedSeries, setDbSelectedSeries] = useState<number|null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goBack = () => setDbSelectedSeries(null);

  // Scroll to top when entering/leaving a series
  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [dbSelectedSeries]);
  const [dbActiveCategory, setDbActiveCategory] = useState<CategoryType>("oficial");

  // Favourites — stored in localStorage
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyCollection, setShowMyCollection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { count: pendingPhotosCount, refresh: refreshPendingCount } = usePendingPhotosCount(isAdmin);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNewVersionAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);
  const [showFavPicker, setShowFavPicker] = useState(false);
  const [favPickerCat, setFavPickerCat] = useState<CategoryType>("oficial");
  const [showFilters, setShowFilters] = useState(false);

  const allFigures = (s: Series) => [...s.sets, ...(s.groups??[]).flatMap(g=>g.sets)].flatMap(st=>st.figures);

  // Swap images between any two figures anywhere in data
  const swapFigureImages = (fromId:number, toId:number) => {
    setData(d => {
      let fromImg = "", toImg = "";
      for(const s of d) {
        for(const st of [...s.sets, ...s.groups.flatMap(g=>g.sets)]) {
          for(const f of st.figures) {
            if(f.id===fromId) fromImg = f.image??"";
            if(f.id===toId) toImg = f.image??"";
          }
        }
      }
      return d.map(s=>({...s,
        sets: s.sets.map(st=>({...st, figures: st.figures.map(f=>
          f.id===fromId ? {...f,image:toImg} : f.id===toId ? {...f,image:fromImg} : f
        )})),
        groups: s.groups.map(g=>({...g, sets: g.sets.map(st=>({...st, figures: st.figures.map(f=>
          f.id===fromId ? {...f,image:toImg} : f.id===toId ? {...f,image:fromImg} : f
        )}))}))
      }));
    });
  };
  // Mueve una figura entera (no solo su imagen) a otro set/grupo DENTRO DE LA MISMA FRANQUICIA.
  // Busca la figura en cualquier set (top-level o dentro de un grupo) de esa franquicia,
  // la extrae, y la añade al final del set de destino indicado.
  const moveFigureToSet = (seriesId: number, figureId: number, destSetId: number, destGroupId?: number) => {
    setData(d => d.map(s => {
      if (s.id !== seriesId) return s;
      let moved: Figure | null = null;
      const removeFrom = (sets: FigureSet[]) => sets.map(st => {
        const idx = st.figures.findIndex(f => f.id === figureId);
        if (idx === -1) return st;
        moved = st.figures[idx];
        return { ...st, figures: st.figures.filter(f => f.id !== figureId) };
      });
      const setsAfterRemoval = removeFrom(s.sets);
      const groupsAfterRemoval = s.groups.map(g => ({ ...g, sets: removeFrom(g.sets) }));
      if (!moved) return s; // figura no encontrada en esta franquicia, no tocar nada
      const insertInto = (sets: FigureSet[]) => sets.map(st =>
        st.id === destSetId ? { ...st, figures: [...st.figures, moved as Figure] } : st
      );
      if (destGroupId) {
        return { ...s, sets: setsAfterRemoval, groups: groupsAfterRemoval.map(g => g.id === destGroupId ? { ...g, sets: insertInto(g.sets) } : g) };
      }
      return { ...s, sets: insertInto(setsAfterRemoval), groups: groupsAfterRemoval };
    }));
  };
  const totalAll = data.flatMap(allFigures).length;
  const seriesOwned = (s: Series) => allFlatWithTags.filter(x=>x.series.id===s.id&&(x.originalCategory??x.series.category)===s.category&&owned.has(x.figure.id)).length;
  const seriesTotal = (s: Series) => allFlatWithTags.filter(x=>x.series.id===s.id&&(x.originalCategory??x.series.category)===s.category).length;
  const catOwned = (cat: CategoryType) => data.filter(s=>s.category===cat).flatMap(allFigures).filter(f=>owned.has(f.id)).length;
  const catTotal = (cat: CategoryType) => data.filter(s=>s.category===cat).flatMap(allFigures).length;
  const dbFilteredSeries = data.filter(s=>s.category===dbActiveCategory);
  const dbSeriesObj = dbSelectedSeries ? data.find(s=>s.id===dbSelectedSeries)??null : null;

  type FlatFigure = { figure:Figure; set:FigureSet; series:Series; groupName?:string; originalCategory?:string };
  const allFlat: FlatFigure[] = data.flatMap(series => [
    ...series.sets.flatMap(set => set.figures.map(figure => ({ figure, set, series }))),
    ...(series.groups??[]).flatMap(g => g.sets.flatMap(set => set.figures.map(figure => ({ figure, set, series, groupName: g.name }))))
  ]);

  // Add virtual entries for figures with series tags
  const taggedExtras: FlatFigure[] = allFlat.flatMap(item => {
    if (!item.figure.tags) return [];
    return item.figure.tags.split(",").map(tg=>tg.trim()).filter(Boolean).flatMap(tag => {
      const taggedSeries = data.filter(s=>s.name.toLowerCase()===tag.toLowerCase() && s.id!==item.series.id);
      return taggedSeries.map(s => ({ ...item, series: s, originalCategory: item.series.category }));
    });
  });
  const allFlatWithTags = [...allFlat, ...taggedExtras];

  const applyFilters = (items: FlatFigure[], search: string, seriesF: number|"all", catF: "all"|CategoryType, statusF: string) =>
    items.filter(({figure,series}) => {
      if (catF !== "all" && series.category !== catF) return false;
      if (seriesF !== "all" && series.id !== seriesF && data.find(s=>s.id===seriesF)?.name !== series.name) return false;
      if (statusF === "owned") return owned.has(figure.id);
      if (statusF === "wishlist") return wishlist.has(figure.id) && !owned.has(figure.id);
      if (statusF === "missing") return !owned.has(figure.id) && !wishlist.has(figure.id);
      return true; // "all"
    }).filter(({figure,set:fset,series}) => {
      if (!search.trim()) return true;
      const words = search.toLowerCase().trim().split(/\s+/);
      const combined = `${figure.name} ${series.name} ${fset.name} ${figure.tags??""}`.toLowerCase();
      return words.every(w=>combined.includes(w));
    });

  const applySort = (items: FlatFigure[], sort: "alpha"|"date", search: string = "") => {
    const sorted = [...items].sort((a,b) => sort==="date"
      ? (a.set.releaseDate??"").localeCompare(b.set.releaseDate??"")
      : a.figure.name.localeCompare(b.figure.name));
    if (!search.trim()) return sorted;
    const words = search.toLowerCase().trim().split(/\s+/);
    const nameMatch = (f: FlatFigure) => words.every(w=>f.figure.name.toLowerCase().includes(w));
    return [...sorted.filter(nameMatch), ...sorted.filter(f=>!nameMatch(f))];
  };

  // For search/display: deduplicate by figure.id (show each figure once)
  // For series progress: keep allFlatWithTags (figure can count in multiple series)
  const dedupeByFigureId = (items: FlatFigure[]) => {
    const seen = new Set<number>();
    return items.filter(({figure}) => { if (seen.has(figure.id)) return false; seen.add(figure.id); return true; });
  };

  const colOwned = applySort(dedupeByFigureId(applyFilters(allFlatWithTags, colSearch, colSeries, colCategory, "owned")), colSort, colSearch);
  const colWishlist = applySort(dedupeByFigureId(applyFilters(allFlatWithTags, colSearch, colSeries, colCategory, "wishlist")), colSort, colSearch);
  const dbFigures = applySort(dedupeByFigureId(applyFilters(allFlatWithTags, dbSearch, dbSeries, dbCategory, dbFilter)), dbSort, dbSearch);
  const dbIsSearchMode = dbSearch.trim()!=="" || dbFilter!=="all" || dbSeries!=="all" || dbCategory!=="all";

  const sizeToColumns: Record<string,string> = { s:"repeat(auto-fill,minmax(90px,1fr))", m:"repeat(auto-fill,minmax(130px,1fr))", l:"repeat(auto-fill,minmax(180px,1fr))" };
  const selectStyle: React.CSSProperties = {height:32,padding:"0 6px",fontSize:12,border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,background:"#0196e3",cursor:"pointer",color:"#fff"};
  const uniqSeries = data.filter((s,i,arr)=>arr.findIndex(x=>x.name===s.name)===i);

  const appContent = !ready ? (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:12,color:"var(--text3)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{fontSize:32}}>📦</div>
      <div style={{fontSize:14}}>{t("loading")}</div>
    </div>
  ) : (
    <div style={{fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",height:"100vh",color:"var(--text)",background:"var(--bg)"}}>

      {/* TOP BAR */}
      <div style={{borderBottom:"1px solid var(--border)",padding:"6px 10px",display:"flex",alignItems:"center",gap:4,background:"#0196e3",flexShrink:0,position:"relative",zIndex:100}}>
        <span style={{fontWeight:700,fontSize:15,whiteSpace:"nowrap",color:"#fff"}}>{t("appTitle")}</span>
        <div style={{flex:1}} />
        <span style={{fontSize:11,color:"rgba(255,255,255,0.75)",whiteSpace:"nowrap"}}>{totalAll} WCF</span>
        {/* Language dropdown - flag only */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowLangMenu(m=>!m)}
            style={{padding:"3px 6px",fontSize:11,border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.9)",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
            <img src={LANGUAGES.find(l=>l.code===lang)?.flag} alt={lang} style={{width:18,height:13,objectFit:"cover",borderRadius:2}} />
            ▾
          </button>
          {showLangMenu && <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:500,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",overflow:"hidden",minWidth:120}}>
            {LANGUAGES.map(l=>(
              <div key={l.code} onClick={()=>{setLang(l.code);setShowLangMenu(false);}}
                style={{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:lang===l.code?"var(--bg2)":"transparent",color:"var(--text)",fontSize:13,fontWeight:lang===l.code?600:400}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                onMouseLeave={e=>e.currentTarget.style.background=lang===l.code?"var(--bg2)":"transparent"}>
                <img src={l.flag} alt={l.label} style={{width:20,height:14,objectFit:"cover",borderRadius:2}} />
                {l.code==="es"?"Español":l.code==="en"?"English":l.code==="fr"?"Français":l.code==="vi"?"Tiếng Việt":l.code==="ja"?"日本語":l.code==="zh"?"中文":"ภาษาไทย"}
              </div>
            ))}
          </div>}
        </div>
        <button onClick={()=>setShowFeedback(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title={t("feedbackTitle")}>💬</button>
        <button onClick={()=>setShowChangelog(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title={t("changelogTitle")}>🎉</button>
        {(newsItems.length>0 || newsAllItems.length>0) && (
          <button onClick={()=>setShowNewsHistory(true)} style={{position:"relative",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title={t("newsButtonTitle")}>
            🔔
            {newsItems.some(a=>a.id>lastSeenAnnouncementId) && <span style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:"#ff4d4f",border:"1px solid #fff"}} />}
          </button>
        )}
        {!isInstalled && installPrompt && (
          <button onClick={()=>{ (installPrompt as any).prompt(); }}
            style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title={t("installBtn")}>📲</button>
        )}
        <button onClick={()=>window.open("https://ko-fi.com/wcf_checklist","_blank")}
          style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title="Support WCF Checklist">☕</button>
        {user ? (
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowUserMenu(m=>!m)} title={user.name ?? user.email ?? ""}
              style={{background:"none",border:"none",cursor:"pointer",padding:0,borderRadius:"50%",overflow:"hidden",width:28,height:28,flexShrink:0,position:"relative"}}>
              {user.avatar
                ? <img src={user.avatar} alt={user.name} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover"}} />
                : <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff"}}>{user.name?.[0]??user.email?.[0]??"?"}</div>
              }
              {hasNewCollectionActivity && (
                <span style={{position:"absolute",top:-1,right:-1,width:9,height:9,borderRadius:"50%",background:"#ef4444",border:"1.5px solid var(--bg)"}} />
              )}
            </button>
            {showUserMenu && (
              <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:500,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",overflow:"hidden",minWidth:170,textAlign:"left"}}>
                <div onClick={()=>{setShowUserMenu(false);setShowMyCollection(true);markCollectionActivitySeen();}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left",display:"flex",alignItems:"center",gap:6}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {t("myCollectionMenuItem")}
                  {hasNewCollectionActivity && <span style={{width:7,height:7,borderRadius:"50%",background:"#ef4444",flexShrink:0}} />}
                </div>
                <div onClick={()=>{setShowUserMenu(false);setShowSettings(true);}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {t("settingsMenuItem")}
                </div>
                <div onClick={()=>{setShowUserMenu(false);toggleDark();}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {dark ? "☀️ Light mode" : "🌙 Dark mode"}
                </div>
                {isAdmin && (
                  <div onClick={()=>{setShowUserMenu(false);setShowModeration(true);}}
                    style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span>📸 Photo moderation</span>
                    {pendingPhotosCount > 0 && (
                      <span style={{background:"#dc2626",color:"#fff",fontSize:10,fontWeight:700,borderRadius:9,minWidth:17,height:17,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",lineHeight:1}}>
                        {pendingPhotosCount > 99 ? "99+" : pendingPhotosCount}
                      </span>
                    )}
                  </div>
                )}
                {isAdmin && (
                  <div onClick={()=>{setShowUserMenu(false);setShowAnalytics(true);}}
                    style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left"}}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    📊 Analytics
                  </div>
                )}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={()=>setShowUserMenu(false)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left",textDecoration:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <InstagramIcon size={15} /> Instagram
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" onClick={()=>setShowUserMenu(false)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left",textDecoration:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <FacebookIcon size={15} /> Facebook
                </a>
                <div onClick={()=>{setShowUserMenu(false);signOut();}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  🚪 {t("signOut")}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={()=>setShowLogin(true)}
            style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:14}} title={t("signIn")}>
            👤
          </button>
        )}
      </div>

      {/* INSTALL BANNER */}
      {showInstallBanner && (
        <div style={{background:"#0174b0",padding:"8px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <img src="/icons/icon-72x72.png" alt="WCF" style={{width:28,height:28,borderRadius:6}} />
          <span style={{flex:1,fontSize:12,color:"#fff",fontWeight:500}}>{t("installBanner")}</span>
          <button onClick={()=>{
            if(installPrompt) (installPrompt as any).prompt();
            setShowInstallBanner(false);
          }} style={{background:"#fff",color:"#0174b0",border:"none",borderRadius:6,padding:"5px 10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            {t("installBtn")}
          </button>
          <button onClick={()=>setShowInstallBanner(false)}
            style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:18,cursor:"pointer",padding:0,lineHeight:1}}>×</button>
        </div>
      )}

      {/* FILTER BAR — hidden on stats tab */}
      {activeTab!=="stats" && activeTab!=="community" && <div style={{padding:"8px 12px",borderBottom:"1px solid var(--border)",background:"#0174b0",flexShrink:0}}>
        {/* Search row */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:6,border:"1px solid var(--border)",borderRadius:8,padding:"0 10px",height:32,background:"rgba(255,255,255,0.12)"}}>
            <span style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>🔍</span>
            <input value={activeTab==="collection"?colSearch:dbSearch}
              onChange={e=>activeTab==="collection"?setColSearch(e.target.value):setDbSearch(e.target.value)}
              placeholder={activeTab==="collection"?t("searchCol"):t("searchDb")}
              style={{flex:1,border:"none",background:"transparent",fontSize:12,outline:"none",color:"#fff"}}
              className="search-input" />
            {(activeTab==="collection"?colSearch:dbSearch) && <span onClick={()=>activeTab==="collection"?setColSearch(""):setDbSearch("")} style={{cursor:"pointer",color:"rgba(255,255,255,0.6)",fontSize:14}}>×</span>}
          </div>
          {/* Filter toggle button */}
          {(() => {
            const hasActiveFilters = activeTab==="collection"
              ? colCategory!=="all" || colSeries!=="all" || colSort!=="date" || colSize!=="m"
              : dbCategory!=="all" || dbSeries!=="all" || dbSort!=="date" || dbSize!=="s" || dbFilter!=="all";
            return (
              <button onClick={()=>setShowFilters(f=>!f)}
                style={{height:32,padding:"0 10px",borderRadius:8,border:`1px solid ${hasActiveFilters?"#fcd34d":"rgba(255,255,255,0.3)"}`,background:hasActiveFilters?"rgba(252,211,77,0.2)":"rgba(255,255,255,0.1)",color:hasActiveFilters?"#fcd34d":"rgba(255,255,255,0.8)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",gap:4}}>
                ⚙️{hasActiveFilters&&<span style={{width:6,height:6,borderRadius:"50%",background:"#fcd34d",display:"inline-block"}} />}
              </button>
            );
          })()}
        </div>
        {/* Collapsible filters row */}
        {showFilters && <div style={{display:"flex",gap:4,marginTop:6}}>
          {activeTab==="collection" && <>
            <select value={colCategory} onChange={e=>setColCategory(e.target.value as typeof colCategory)} style={{...selectStyle,fontSize:11}}>
              <option value="all">Categoría</option>
              <option value="oficial">{t("officialBadge")}</option>
              <option value="resina">{t("resinBadge")}</option>
            </select>
            <select value={colSeries} onChange={e=>setColSeries(e.target.value==="all"?"all":Number(e.target.value))} style={{...selectStyle,fontSize:11}}>
              <option value="all">Series</option>
              {uniqSeries.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={colSort} onChange={e=>setColSort(e.target.value as "alpha"|"date")} style={{...selectStyle,fontSize:11}}>
              <option value="date">📅</option>
              <option value="alpha">A/Z</option>
            </select>
            <select value={colSize} onChange={e=>setColSize(e.target.value as "s"|"m"|"l")} style={{...selectStyle,fontSize:11}}>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
            </select>
          </>}
          {activeTab==="database" && <>
            <select value={dbCategory} onChange={e=>setDbCategory(e.target.value as typeof dbCategory)} style={{...selectStyle,fontSize:11}}>
              <option value="all">Categoría</option>
              <option value="oficial">{t("officialBadge")}</option>
              <option value="resina">{t("resinBadge")}</option>
            </select>
            <select value={dbSeries} onChange={e=>setDbSeries(e.target.value==="all"?"all":Number(e.target.value))} style={{...selectStyle,fontSize:11}}>
              <option value="all">Series</option>
              {uniqSeries.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={dbSort} onChange={e=>setDbSort(e.target.value as "alpha"|"date")} style={{...selectStyle,fontSize:11}}>
              <option value="date">📅</option>
              <option value="alpha">A/Z</option>
            </select>
            <select value={dbSize} onChange={e=>setDbSize(e.target.value as "s"|"m"|"l")} style={{...selectStyle,fontSize:11}}>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
            </select>
            <select value={dbFilter} onChange={e=>setDbFilter(e.target.value as typeof dbFilter)} style={{...selectStyle,fontSize:11}}>
              <option value="all">Estado</option>
              <option value="owned">✅</option>
              <option value="wishlist">💛</option>
              <option value="missing">❌</option>
            </select>
          </>}
        </div>}
      </div>}

      {/* NEW VERSION BANNER */}
      {newVersionAvailable && (
        <div onClick={()=>window.location.reload()} style={{background:"#fbd100",padding:"8px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0,cursor:"pointer"}}>
          <span style={{fontSize:16}}>🆕</span>
          <span style={{flex:1,fontSize:11,color:"#5a4a00",fontWeight:600}}>New version available — tap to update</span>
          <span style={{fontSize:11,color:"#5a4a00",fontWeight:700,textDecoration:"underline"}}>Update</span>
        </div>
      )}

      {/* iOS INSTALL BANNER */}
      {showIOSBanner && (
        <div style={{background:"#fbd100",padding:"8px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <span style={{fontSize:16}}>📱</span>
          <span style={{flex:1,fontSize:11,color:"#5a4a00",fontWeight:500}}>{t("iosBanner")}</span>
          <button onClick={()=>{ setShowIOSBanner(false); localStorage.setItem("wcf_ios_banner_dismissed","1"); }}
            style={{background:"none",border:"none",color:"#5a4a00",fontSize:18,cursor:"pointer",padding:0,lineHeight:1,fontWeight:700}}>×</button>
        </div>
      )}

      {/* SERIES DETAIL STICKY HEADER */}
      {activeTab==="database" && dbSeriesObj && !dbIsSearchMode && (
        <div style={{background:"var(--bg)",padding:"10px 16px",borderBottom:"2px solid var(--border)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
            <button onClick={goBack} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--text)"}}>{t("back")}</button>
            {dbSeriesObj.logoHeader ? <img src={dbSeriesObj.logoHeader} alt={dbSeriesObj.name} style={{height:32,maxWidth:140,objectFit:"contain"}} /> : <span style={{fontSize:16,fontWeight:700}}>{dbSeriesObj.emoji} {dbSeriesObj.name}</span>}
            {isAdmin && <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              <Btn small onClick={()=>addGroup(dbSeriesObj.id)} variant="primary">+ Grupo</Btn>
              <Btn small onClick={()=>addSet(dbSeriesObj.id)} variant="primary">{t("newSet")}</Btn>
              <Btn small onClick={()=>setEditSeriesData(dbSeriesObj)}>✏️</Btn>
              <Btn small onClick={()=>{deleteSeries(dbSeriesObj.id);setDbSelectedSeries(null);}} variant="danger">🗑</Btn>
            </div>}
          </div>
          <ProgressBar value={seriesOwned(dbSeriesObj)} total={seriesTotal(dbSeriesObj)} color={dbSeriesObj.color} />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"12px 16px",paddingBottom:70}}>

        {/* ── COLLECTION TAB ── */}
        {activeTab==="collection" && (
          <div>
            {/* Empty state when no figures owned or wishlisted */}
            {colOwned.length===0 && colWishlist.length===0 && !colSearch && (
              <div style={{textAlign:"center",padding:"3rem 1rem",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                <div style={{fontSize:48}}>📦</div>
                <div style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>{t("emptyColTitle")}</div>
                <div style={{fontSize:13,color:"var(--text3)",maxWidth:280,lineHeight:1.6}}>{t("emptyColDesc")}</div>
                <button onClick={()=>setActiveTab("database")}
                  style={{marginTop:8,padding:"10px 20px",borderRadius:10,border:"none",background:"#0196e3",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700}}>
                  {t("emptyColBtn")}
                </button>
              </div>
            )}

            {(colOwned.length>0 || colWishlist.length>0 || colSearch) && (
              <>
                {/* Sub-tabs: Owned / Wishlist */}
                <div style={{display:"flex",gap:8,marginBottom:20}}>
                  <button onClick={()=>setColSubTab("owned")}
                    style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:colSubTab==="owned"?"#0174b0":"var(--bg2)",color:colSubTab==="owned"?"#fff":"var(--text3)",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    {t("myWcfOwnedTab")} <span style={{fontSize:11,opacity:0.85}}>({colOwned.length})</span>
                  </button>
                  <button onClick={()=>setColSubTab("wishlist")}
                    style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:colSubTab==="wishlist"?"#f59e0b":"var(--bg2)",color:colSubTab==="wishlist"?"#fff":"var(--text3)",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    {t("myWcfWishlistTab")} <span style={{fontSize:11,opacity:0.85}}>({colWishlist.length})</span>
                  </button>
                </div>

                {(() => {
                  const activeItems = colSubTab==="owned" ? colOwned : colWishlist;
                  const mode = colSubTab; // "owned" | "wishlist"
                  const emptyMsg = colSubTab==="owned" ? t("noFiguresOwned") : t("wishlistEmpty");

                  if (activeItems.length === 0) {
                    return <div style={{textAlign:"center",padding:"2rem",color:"var(--text4)",fontSize:13}}>{emptyMsg}</div>;
                  }

                  // Agrupamos por NOMBRE de franquicia (no por id interno), para fusionar
                  // en una sola fila las que están registradas por separado como oficial/resina.
                  // Respetamos el orden en que aparecen por primera vez en el catálogo.
                  const bySeriesOrder: string[] = [];
                  const bySeriesMap = new Map<string, { series: Series; items: typeof activeItems }>();
                  for (const item of activeItems) {
                    const key = item.series.name.trim().toLowerCase();
                    if (!bySeriesMap.has(key)) {
                      bySeriesOrder.push(key);
                      bySeriesMap.set(key, { series: item.series, items: [] });
                    }
                    bySeriesMap.get(key)!.items.push(item);
                  }

                  // Ordenamos de más a menos figuras (a igualdad de cantidad, mantenemos el orden del catálogo)
                  const sortedSeriesKeys = [...bySeriesOrder].sort((a, b) => bySeriesMap.get(b)!.items.length - bySeriesMap.get(a)!.items.length);

                  return sortedSeriesKeys.map(sid => {
                    const { series, items } = bySeriesMap.get(sid)!;
                    const isOpen = expandedSeries.has(sid);
                    return (
                      <div key={sid} style={{marginBottom:10,border:"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
                        <div onClick={()=>toggleSeriesExpanded(sid)}
                          style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer",background:"var(--bg2)"}}>
                          <span style={{fontSize:11,color:"var(--text4)",transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.15s",flexShrink:0}}>▶</span>
                          {series.logoHeader
                            ? <img src={series.logoHeader} alt={series.name} style={{height:22,maxWidth:120,objectFit:"contain",objectPosition:"left"}} />
                            : <><span style={{fontSize:18}}>{series.emoji}</span><span style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{series.name}</span></>
                          }
                          <span style={{flex:1}} />
                          <span style={{fontSize:12,color:"var(--text3)",background:"var(--bg)",padding:"2px 9px",borderRadius:10,fontWeight:600,flexShrink:0}}>{items.length}</span>
                        </div>
                        {isOpen && (
                          <div style={{display:"grid",gridTemplateColumns:`repeat(auto-fill, minmax(${colSize==="s"?70:colSize==="m"?95:130}px, 1fr))`,gap:8,padding:12}}>
                            {items.map(({figure,set,series,groupName})=>{
                              const isConfirm = confirmFigure?.figure.id===figure.id;
                              return (
                                <div key={figure.id} style={{position:"relative"}}>
                                  <SearchResultCard figure={figure} series={series} set={set} groupName={groupName}
                                    isOwned={mode==="owned"} isWished={mode==="wishlist"} compact hideIcons
                                    userPhotoCount={figuresWithPhotos[figure.id]??0} userId={user?.id}
                                    onToggle={()=>setConfirmFigure(isConfirm?null:{figure,series,set,mode})}
                                    onToggleWish={()=>setConfirmFigure(isConfirm?null:{figure,series,set,mode})} />
                                  {isConfirm && mode==="owned" && (
                                    <div style={{position:"absolute",inset:0,borderRadius:8,background:"rgba(0,0,0,0.75)",zIndex:10,display:"flex",flexDirection:"column",justifyContent:"center",gap:4,padding:6}}>
                                      <button onClick={e=>{e.stopPropagation();setDetailFigureCol({figure,series,set});setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.9)",color:"#0196e3",cursor:"pointer",fontSize:9,fontWeight:700}}>🔍 Details</button>
                                      <button onClick={e=>{e.stopPropagation();toggleWish(figure.id);toggle(figure.id);setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#fef3c7",color:"#92400e",cursor:"pointer",fontSize:9,fontWeight:700}}>{t("moveToWishlist")}</button>
                                      <button onClick={e=>{e.stopPropagation();toggle(figure.id);setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontSize:9,fontWeight:700}}>{t("removeItem")}</button>
                                      <button onClick={e=>{e.stopPropagation();setConfirmFigure(null);}} style={{padding:"4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer",fontSize:9}}>{t("cancelBtn")}</button>
                                    </div>
                                  )}
                                  {isConfirm && mode==="wishlist" && (
                                    <div style={{position:"absolute",inset:0,borderRadius:8,background:"rgba(0,0,0,0.75)",zIndex:10,display:"flex",flexDirection:"column",justifyContent:"center",gap:4,padding:6}}>
                                      <button onClick={e=>{e.stopPropagation();setDetailFigureCol({figure,series,set});setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.9)",color:"#0196e3",cursor:"pointer",fontSize:9,fontWeight:700}}>🔍 Details</button>
                                      <button onClick={e=>{e.stopPropagation();toggle(figure.id);setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#e6f4fd",color:"#0174b0",cursor:"pointer",fontSize:9,fontWeight:700}}>{t("moveToOwned")}</button>
                                      <button onClick={e=>{e.stopPropagation();toggleWish(figure.id);setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontSize:9,fontWeight:700}}>{t("removeItem")}</button>
                                      <button onClick={e=>{e.stopPropagation();setConfirmFigure(null);}} style={{padding:"4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer",fontSize:9}}>{t("cancelBtn")}</button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </>
            )}
          </div>
        )}

        {/* ── DATABASE TAB ── */}
        {activeTab==="database" && (
          dbIsSearchMode ? (
            // Search results grid
            dbFigures.length===0 ? (
              <div style={{textAlign:"center",padding:"4rem 1rem",color:"var(--text4)",fontSize:14}}>{t("noResults")}</div>
            ) : (
              <div>
                <div style={{fontSize:12,color:"var(--text3)",marginBottom:8}}>{dbFigures.length} figura{dbFigures.length!==1?"s":""}</div>
                <div style={{display:"grid",gridTemplateColumns:sizeToColumns[dbSize],gap:8}}>
                  {dbFigures.map(({figure,set,series,groupName})=>(
                    <SearchResultCard key={figure.id} figure={figure} series={series} set={set} groupName={groupName}
                      isOwned={owned.has(figure.id)} isWished={wishlist.has(figure.id)&&!owned.has(figure.id)}
                      onToggle={()=>toggleWithAuth(figure.id)} onToggleWish={()=>toggleWishWithAuth(figure.id)}
                      communityOwned={communityOwned[figure.id]??0} communityWished={communityWished[figure.id]??0}
                      userId={user?.id} userPhotoCount={figuresWithPhotos[figure.id]??0}
                      onEdit={(f)=>{
                        const seriesObj = data.find(s=>s.id===series.id);
                        const grp = seriesObj?.groups.find(g=>g.sets.some(st=>st.id===set.id));
                        updateFigure(series.id, set.id, figure.id, f, grp?.id);
                      }} />
                  ))}
                </div>
              </div>
            )
          ) : dbSeriesObj ? (
            // Series detail
            <>
              <div style={{marginBottom:12}} />
              {(() => {
                // Build interleaved list of groups and loose sets, sorted by date
                type Item = { type:"group"; group:FigureGroup; date:string } | { type:"set"; set:FigureSet; date:string };
                const items: Item[] = [
                  ...(dbSeriesObj.groups??[]).map(g => ({ type:"group" as const, group:g, date: g.sets[0]?.releaseDate ?? "" })),
                  ...dbSeriesObj.sets.map(s => ({ type:"set" as const, set:s, date: s.releaseDate ?? "" })),
                ];
                const sorted = [...items].sort((a,b) => a.date.localeCompare(b.date));
                const display = sorted.some(i=>i.date) ? sorted : items;
                return display.map((item) => item.type==="group" ? (
                  <GroupCard key={"g"+item.group.id}
                    group={item.group} color={dbSeriesObj.color} owned={owned} wishlist={wishlist} apiKey={apiKey}
                    onToggle={toggleWithAuth} onToggleWish={toggleWishWithAuth}
                    onToggleAll={(ids,markAs)=>requireLogin(()=>ids.forEach(id=>{if(markAs!==owned.has(id))toggle(id);}))}
                    onUpdateGroup={(n,l)=>updateGroup(dbSeriesObj.id,item.group.id,n,l)}
                    onDeleteGroup={()=>deleteGroup(dbSeriesObj.id,item.group.id)}
                    onAddSet={()=>addSet(dbSeriesObj.id,item.group.id)}
                    onUpdateSet={(stid,n,rd,sl)=>updateSet(dbSeriesObj.id,stid,n,rd,sl,item.group.id)}
                    onDeleteSet={(stid)=>deleteSet(dbSeriesObj.id,stid,item.group.id)}
                    onDuplicateSet={(stid)=>duplicateSet(dbSeriesObj.id,stid,item.group.id)}
                    onAddFigure={(stid,f)=>addFigure(dbSeriesObj.id,stid,f,item.group.id)}
                    onAddFigures={(stid,fs)=>addFigures(dbSeriesObj.id,stid,fs,item.group.id)}
                    onReorderFigures={(stid,figs)=>reorderFigures(dbSeriesObj.id,stid,figs,item.group.id)}
                    onReorderSets={(sets)=>reorderSets(dbSeriesObj.id,item.group.id,sets)}
                    onUpdateFigure={(stid,fid,f)=>updateFigure(dbSeriesObj.id,stid,fid,f,item.group.id)}
                    onDeleteFigure={(stid,fid)=>deleteFigure(dbSeriesObj.id,stid,fid,item.group.id)}
                    onSwapCross={(fromId,toId)=>swapFigureImages(fromId,toId)}
                    onMoveFigure={(fid,destSetId,destGroupId)=>moveFigureToSet(dbSeriesObj.id,fid,destSetId,destGroupId)}
                    series={dbSeriesObj}
                    communityOwned={communityOwned} communityWished={communityWished}
                    figuresWithPhotos={figuresWithPhotos} userId={user?.id}
                    cardSize={dbSize}
                  />
                ) : (
                  <SetCard key={"s"+item.set.id}
                    set={item.set} color={dbSeriesObj.color} owned={owned} wishlist={wishlist} apiKey={apiKey}
                    onToggle={toggleWithAuth} onToggleWish={toggleWishWithAuth}
                    onToggleAll={(ids,markAs)=>requireLogin(()=>ids.forEach(id=>{if(markAs!==owned.has(id))toggle(id);}))}
                    onUpdateSet={(n,rd,sl)=>updateSet(dbSeriesObj.id,item.set.id,n,rd,sl)}
                    onDeleteSet={()=>deleteSet(dbSeriesObj.id,item.set.id)}
                    onDuplicate={()=>duplicateSet(dbSeriesObj.id,item.set.id)}
                    onMoveToGroup={(gid)=>moveSetToGroup(dbSeriesObj.id,item.set.id,gid)}
                    groups={dbSeriesObj.groups}
                    series={dbSeriesObj}
                    onAddFigure={(f)=>addFigure(dbSeriesObj.id,item.set.id,f)}
                    onAddFigures={(fs)=>addFigures(dbSeriesObj.id,item.set.id,fs)}
                    onReorderFigures={(_,figs)=>reorderFigures(dbSeriesObj.id,item.set.id,figs)}
                    communityOwned={communityOwned} communityWished={communityWished}
                    figuresWithPhotos={figuresWithPhotos} userId={user?.id}
                    cardSize={dbSize}
                    onUpdateFigure={(fid,f)=>updateFigure(dbSeriesObj.id,item.set.id,fid,f)}
                    onDeleteFigure={(fid)=>deleteFigure(dbSeriesObj.id,item.set.id,fid)}
                    onSwapCross={(fromId,toId)=>swapFigureImages(fromId,toId)}
                    onMoveFigure={(fid,destSetId,destGroupId)=>moveFigureToSet(dbSeriesObj.id,fid,destSetId,destGroupId)}
                  />
                ));
              })()}
              {dbSeriesObj.sets.length===0 && (!dbSeriesObj.groups||dbSeriesObj.groups.length===0) && (
                <div style={{textAlign:"center",padding:"3rem",color:"var(--text4)",fontSize:14}}>{t("noSets1")}<br/>{t("noSets2")}</div>
              )}
              {/* Crossover figures — only shown for oficial series */}
              {dbSeriesObj.category === "oficial" && (() => {
                const crossover = allFlat.filter(({figure, series}) =>
                  series.id !== dbSeriesObj.id &&
                  series.category === "oficial" &&
                  figure.tags?.split(",").map(tg=>tg.trim()).some(tg=>tg.toLowerCase()===dbSeriesObj.name.toLowerCase())
                );
                if (crossover.length === 0) return null;
                return (
                  <div style={{marginTop:24}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingTop:16,borderTop:"2px dashed var(--border)"}}>
                      <span style={{fontSize:14}}>🔀</span>
                      <span style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{t("crossoverTitle")}</span>
                      <span style={{fontSize:11,color:"var(--text4)"}}>({t("crossoverSub")})</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>
                      {crossover.map(({figure, set, series}) => (
                        <div key={figure.id} style={{position:"relative"}}>
                          <SearchResultCard figure={figure} series={series} set={set}
                            isOwned={owned.has(figure.id)} isWished={wishlist.has(figure.id)&&!owned.has(figure.id)}
                            onToggle={()=>toggleWithAuth(figure.id)} onToggleWish={()=>toggleWishWithAuth(figure.id)}
                            communityOwned={communityOwned[figure.id]??0} communityWished={communityWished[figure.id]??0} userId={user?.id} userPhotoCount={figuresWithPhotos[figure.id]??0} />
                          <div style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:9,padding:"2px 5px",borderRadius:4,pointerEvents:"none"}}>
                            {series.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            // Series list
            <>
              <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                {(["oficial","resina"] as CategoryType[]).map(cat=>(
                  <button key={cat} onClick={()=>{setDbActiveCategory(cat);setDbSelectedSeries(null);}}
                    style={{padding:"6px 14px",fontSize:12,fontWeight:dbActiveCategory===cat?700:400,border:"1px solid var(--border)",borderRadius:20,background:dbActiveCategory===cat?"var(--text)":"var(--bg)",color:dbActiveCategory===cat?"var(--bg)":"var(--text3)",cursor:"pointer"}}>
                    {cat==="oficial"?t("official"):t("resin")} <span style={{opacity:0.6,fontSize:10}}>{catOwned(cat)}/{catTotal(cat)}</span>
                  </button>
                ))}
                {isAdmin && <Btn small onClick={()=>setShowAddSeries(true)} variant="primary">{t("newSeries")}</Btn>}
              </div>
              {dbFilteredSeries.length===0
                ? <div style={{textAlign:"center",padding:"3rem",color:"var(--text4)",fontSize:14}}>{t("noSeriesCat1")}</div>
                : <SeriesGrid
                    series={dbFilteredSeries}
                    seriesOwned={seriesOwned}
                    seriesTotal={seriesTotal}
                    onSelect={(s)=>setDbSelectedSeries(s)}
                    onReorder={(from,to)=>{
                      setData(d=>{
                        const all=[...d];
                        const cats=all.filter(s=>s.category===dbActiveCategory);
                        const others=all.filter(s=>s.category!==dbActiveCategory);
                        const [mv]=cats.splice(from,1); cats.splice(to,0,mv);
                        return [...others,...cats];
                      });
                    }}
                  />
              }
            </>
          )
        )}
        {/* ── COMMUNITY TAB ── */}
        {activeTab==="community" && <CommunityTab
          data={data} communityUsers={communityUsers} communityTotal={communityTotal}
          topOwned={topOwned} topWished={topWished} currentUserId={user?.id ?? null}
          currentUserName={user?.name ?? user?.email ?? "?"} currentUserAvatar={user?.avatar}
          onOpenMyCollection={user ? ()=>{setShowMyCollection(true);markCollectionActivitySeen();} : ()=>setShowLogin(true)}
          onRequireLogin={()=>setShowLogin(true)}
        />}
        {/* ── STATS TAB ── */}
        {activeTab==="stats" && <StatsTab
          data={data} owned={owned} wishlist={wishlist} favourites={favourites}
          allFlat={allFlatWithTags} seriesOwned={seriesOwned} seriesTotal={seriesTotal}
          onOpenPicker={()=>setShowFavPicker(true)}
        />}

      </div>

      {/* BOTTOM TABS */}
      <div style={{display:"flex",borderTop:"1px solid var(--border)",background:"#0196e3",flexShrink:0,position:"sticky",bottom:0,zIndex:50}}>
        {([["collection","📦",t("tabCollection")],["database","🗃️",t("tabDatabase")],["community","🌍",t("tabCommunity")],["stats","⭐",t("tabStats")]] as [TabType,string,string][]).map(([tab,icon,label])=>(
          <button key={tab} onClick={()=>setActiveTab(tab as TabType)}
            style={{flex:1,padding:"10px 8px 8px",fontSize:11,fontWeight:500,border:"none",background:"transparent",cursor:"pointer",color:activeTab===tab?"#fff":"rgba(255,255,255,0.5)",borderTop:activeTab===tab?"2px solid #fbd100":"2px solid transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:20}}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {showFavPicker && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:150,display:"flex",alignItems:"flex-end"}}
          onClick={()=>setShowFavPicker(false)}>
          <div style={{background:"var(--bg)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px 16px 0"}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexShrink:0}}>
              <span style={{fontWeight:700,fontSize:16}}>{t("selectFavTitle")}</span>
              <button onClick={()=>setShowFavPicker(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"var(--text3)"}}>×</button>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:12,flexShrink:0}}>
              {(["oficial","resina"] as CategoryType[]).map(cat=>(
                <button key={cat} onClick={()=>setFavPickerCat(cat)}
                  style={{padding:"6px 14px",fontSize:12,fontWeight:favPickerCat===cat?700:400,border:"1px solid var(--border)",borderRadius:20,background:favPickerCat===cat?"var(--text)":"var(--bg)",color:favPickerCat===cat?"var(--bg)":"var(--text3)",cursor:"pointer"}}>
                  {cat==="oficial"?t("officialBadge"):t("resinBadge")}
                </button>
              ))}
            </div>
            <div style={{overflowY:"auto",flex:1,paddingBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
                {data.filter(s=>s.category===favPickerCat).map(s=>{
                  const isFav = favourites.has(s.id);
                  return (
                    <div key={s.id} onClick={()=>toggleFavourite(s.id)}
                      style={{position:"relative",borderRadius:12,overflow:"hidden",cursor:"pointer",aspectRatio:"1",background:s.color+"33",border:isFav?`2px solid #f59e0b`:`1px solid ${s.color}44`,transition:"border 0.15s"}}>
                      {s.bgImage ? <img src={s.bgImage} alt={s.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} /> :
                        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,opacity:0.3}}>{s.emoji}</div>}
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.1) 60%,rgba(0,0,0,0) 100%)"}} />
                      {isFav && <div style={{position:"absolute",top:6,right:6,fontSize:16,zIndex:2}}>⭐</div>}
                      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"6px 8px"}}>
                        {s.logo ? <img src={s.logo} alt={s.name} style={{height:16,maxWidth:"100%",objectFit:"contain",objectPosition:"left",display:"block"}} />
                          : <div style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1.2}}>{s.name}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddSeries && <SeriesModal category={dbActiveCategory} apiKey={apiKey} onSave={(p1,p2,p3,p4,p5)=>{addSeries(p1,p2,p3,p4,p5,dbActiveCategory);setShowAddSeries(false);}} onClose={()=>setShowAddSeries(false)} />}
      {editSeriesData && <SeriesModal category={editSeriesData.category} initial={editSeriesData} apiKey={apiKey} onSave={(p1,p2,p3,p4,p5)=>{updateSeries(editSeriesData.id,p1,p2,p3,p4,p5);setEditSeriesData(null);}} onClose={()=>setEditSeriesData(null)} />}
      {showModeration && <PhotoModerationPanel onClose={()=>{setShowModeration(false);refreshPendingCount();}} data={data} />}
      {showAnalytics && <AdminAnalyticsPanel onClose={()=>setShowAnalytics(false)} data={data} />}
      {showMyCollection && user && (
        <MyCollectionPanel userId={user.id} uploaderName={user.name ?? user.email ?? "?"} uploaderAvatar={user.avatar} onClose={()=>setShowMyCollection(false)} />
      )}
      {showSettings && user && (
        <SettingsModal
          userId={user.id}
          currentName={user.name ?? user.email ?? "?"}
          currentAvatar={user.avatar}
          onSaveName={updateName}
          onSaveAvatar={updateAvatar}
          onClose={()=>setShowSettings(false)}
        />
      )}
      {showFeedback && <FeedbackModal onClose={()=>setShowFeedback(false)} data={isAdmin?data:undefined} userEmail={user?.email} />}
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} onGoogle={signInWithGoogle} onSendCode={signInWithEmail} onVerifyCode={verifyEmailCode} />}
      {user && !user.name && <ChooseNameModal onSave={updateName} />}
      {showOnboarding && <OnboardingModal
        onLogin={()=>{ localStorage.setItem("wcf_onboarded","1"); return signInWithGoogle(); }}
        onSendCode={signInWithEmail}
        onVerifyCode={verifyEmailCode}
        onEmailSuccess={()=>setShowOnboarding(false)}
        onGuest={()=>{ setShowOnboarding(false); localStorage.setItem("wcf_onboarded","1"); }}
      />}
      {detailFigureCol && (
        <FigureDetailModal
          figure={detailFigureCol.figure} set={detailFigureCol.set} series={detailFigureCol.series}
          isOwned={owned.has(detailFigureCol.figure.id)} isWished={wishlist.has(detailFigureCol.figure.id)&&!owned.has(detailFigureCol.figure.id)}
          onToggle={()=>toggleWithAuth(detailFigureCol.figure.id)}
          onToggleWish={()=>toggleWishWithAuth(detailFigureCol.figure.id)}
          onClose={()=>setDetailFigureCol(null)}
          communityOwned={communityOwned[detailFigureCol.figure.id]??0}
          communityWished={communityWished[detailFigureCol.figure.id]??0}
          userId={user?.id}
        />
      )}
    </div>
  );

  const [dragState, setDragState] = useState<{figureId:number;image:string}|null>(null);

  return (
    <LangProvider value={langValue}>
      <UserInfoCtx.Provider value={{email: user?.email ?? null, name: user?.name ?? null, avatar: user?.avatar ?? null}}>
      <AdminCtx.Provider value={isAdmin}>
        <SeriesDataCtx.Provider value={data}>
          <DragCtx.Provider value={{dragging:dragState, setDragging:setDragState}}>
            {appContent}
            {showChangelog && <ChangelogModal onClose={()=>{ localStorage.setItem("wcf_changelog_seen", String(latestId)); setShowChangelog(false); }} />}
            {showNewsModal && <NewsModal favItems={newsItems} allItems={newsAllItems} data={data} onOpenDetail={(figureId)=>{ const ctx = findFigureContext(data, Number(figureId)); if (ctx) setDetailFigureCol(ctx); }} onClose={closeNewsModal} />}
            {showNewsHistory && <NewsModal favItems={newsItems} allItems={newsAllItems} data={data} onOpenDetail={(figureId)=>{ const ctx = findFigureContext(data, Number(figureId)); if (ctx) setDetailFigureCol(ctx); }} onClose={()=>setShowNewsHistory(false)} />}
          </DragCtx.Provider>
        </SeriesDataCtx.Provider>
      </AdminCtx.Provider>
      </UserInfoCtx.Provider>
    </LangProvider>
  );
}

// ============================================================
//  ROOT — decide si mostrar una colección pública (/c/<código>) o la app entera
// ============================================================
export default function App() {
  const [publicShareCode] = useState<string | null>(() => {
    const match = window.location.pathname.match(/^\/c\/([a-zA-Z0-9-]+)\/?$/);
    return match ? match[1] : null;
  });
  if (publicShareCode) return <PublicCollectionPage code={publicShareCode} />;
  return <MainApp />;
}

import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";

// ============================================================
//  CHANGELOG — añade aquí las novedades antes de hacer push
// ============================================================
const CHANGELOG = [
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
  changelogHistory:{ es: "Ver historial completo", en: "Full history",               th: "ประวัติทั้งหมด" , fr: "Historique complet" , vi: "Lịch sử đầy đủ" , ja: "全履歴", zh: "完整历史" },
  changelogClose: { es: "Entendido",              en: "Got it",                      th: "เข้าใจแล้ว" , fr: "Compris" , vi: "Đã hiểu" , ja: "了解", zh: "明白了" },
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
  collectionsTitle:    { es: "🖼️ Colecciones de la comunidad", en: "🖼️ Community collections", th: "🖼️ คอลเลกชันของชุมชน", fr: "🖼️ Collections de la communauté", vi: "🖼️ Bộ sưu tập cộng đồng", ja: "🖼️ コミュニティのコレクション", zh: "🖼️ 社区收藏" },
  noCollectionsYet:    { es: "Aún no hay colecciones compartidas. ¡Sé el primero!", en: "No shared collections yet. Be the first!", th: "ยังไม่มีคอลเลกชันที่แชร์ มาเป็นคนแรกสิ!", fr: "Pas encore de collections partagées. Sois le premier !", vi: "Chưa có bộ sưu tập nào được chia sẻ. Hãy là người đầu tiên!", ja: "まだ共有されたコレクションはありません。最初の投稿者になりましょう！", zh: "还没有人分享收藏，快来当第一个吧！" },
  backToCollections:   { es: "← Colecciones", en: "← Collections", th: "← คอลเลกชัน", fr: "← Collections", vi: "← Bộ sưu tập", ja: "← コレクション", zh: "← 收藏" },
  collectionOf:        { es: (name:string)=>`La colección de ${name}`, en: (name:string)=>`${name}'s collection`, th: (name:string)=>`คอลเลกชันของ ${name}`, fr: (name:string)=>`La collection de ${name}`, vi: (name:string)=>`Bộ sưu tập của ${name}`, ja: (name:string)=>`${name}のコレクション`, zh: (name:string)=>`${name}的收藏` },
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

  const signInWithGoogle = () => supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin }
  });
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (userId) {
      supabase.from("wcf_progress").select("owned,wishlist,favourites").eq("user_id", userId).maybeSingle()
        .then(({ data, error }) => {
          if (error) console.error("Load error:", error);
          if (data) {
            if (data.owned?.length > 0) setOwned(new Set(data.owned));
            if (data.wishlist?.length > 0) setWishlist(new Set(data.wishlist));
            if (data.favourites?.length > 0) setFavourites(new Set(data.favourites));
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

  return { owned, toggle, wishlist, toggleWish, favourites, toggleFavourite, imgbbKey: IMGBB_KEY, ready };
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

function FigureModal({ title, initial, apiKey, onSave, onClose }: { title:string; initial?:Partial<Figure>; apiKey:string; onSave:(f:Omit<Figure,"id">)=>void; onClose:()=>void }) {
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
      <div style={{marginTop:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{if(name.trim()){onSave({name:name.trim(),emoji,image,tags:buildTags(),altImages:altImages.filter(Boolean)});onClose();}}} variant="primary">{t("save")}</Btn>
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
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {dragOver && <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(225,245,238,0.85)",fontSize:24,pointerEvents:"none"}}>🔄</div>}
      {/* Reorder handle */}
      {isAdmin && onReorderStart && hover && (
        <div draggable
          onDragStart={(e)=>{ e.stopPropagation(); e.dataTransfer.setData("wcf_reorder_id", String(figure.id)); e.dataTransfer.effectAllowed="move"; onReorderStart(); }}
          style={{position:"absolute",bottom:4,right:4,zIndex:5,cursor:"grab",fontSize:13,color:"rgba(0,0,0,0.4)",padding:"2px 4px",borderRadius:4,background:"rgba(255,255,255,0.8)",lineHeight:1}}
          title="Reorder">⠿</div>
      )}
      {(hover || isMobileDevice) && <div style={{position:"absolute",top:4,left:4,zIndex:3,display:"flex",gap:4}}>
        {isAdmin && hover && <>
          <button onClick={e=>{e.stopPropagation();onEdit();}} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>✏️</button>
          {onMove && <button onClick={e=>{e.stopPropagation();onMove();}} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}} title="Move to another set">🗂️</button>}
          <button onClick={e=>{e.stopPropagation();onDelete();}} style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>🗑</button>
        </>}
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
  onAddFigure:(f:Omit<Figure,"id">)=>void; onAddFigures:(fs:Omit<Figure,"id">[])=>void; onUpdateFigure:(id:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(id:number)=>void;
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
      {addFigure && <FigureModal title={t("newFigureTitle")} apiKey={apiKey} onSave={f=>{onAddFigure(f);setAddFigure(false);}} onClose={()=>setAddFigure(false)} />}
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
      {editFigure && <FigureModal title={t("editFigureTitle")} initial={editFigure} apiKey={apiKey} onSave={f=>{onUpdateFigure(editFigure.id,f);setEditFigure(null);}} onClose={()=>setEditFigure(null)} />}
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
    {editing && onEdit && <FigureModal title={t("editFigureTitle")} initial={figure} apiKey={IMGBB_KEY} onSave={(f)=>{onEdit(f);setEditing(false);}} onClose={()=>setEditing(false)} />}
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
  onAddFigure:(stid:number,f:Omit<Figure,"id">)=>void; onAddFigures:(stid:number,fs:Omit<Figure,"id">[])=>void; onUpdateFigure:(stid:number,fid:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(stid:number,fid:number)=>void;
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
  const { photos, coverId, loading, reload } = useMyCollectionPhotos(userId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string|null>(null);

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
      await supabase.from("wcf_collection_photos").insert({ user_id: userId, url, uploader_name: uploaderName, uploader_avatar: uploaderAvatar ?? null, approved: false });
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

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:20,width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontWeight:700,fontSize:16}}>🖼️ {t("myCollectionTitle")}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--text3)",lineHeight:1}}>✕</button>
        </div>
        <div style={{fontSize:12,color:"var(--text3)",marginBottom:6}}>{t("myCollectionDesc")}</div>
        <div style={{fontSize:11,color:"var(--text4)",fontWeight:600,marginBottom:16}}>{t("collectionPhotoLimit", approvedCount)}</div>

        {loading ? (
          <div style={{textAlign:"center",padding:"24px 0",color:"var(--text4)",fontSize:12}}>...</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
            {photos.map(p => (
              <div key={p.id} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",background:"var(--bg2)"}}>
                <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:p.approved?1:0.5}} />
                {!p.approved && (
                  <div style={{position:"absolute",top:4,left:4,background:"rgba(0,0,0,0.7)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6}}>
                    {t("pendingReviewLabel")}
                  </div>
                )}
                {p.approved && (
                  <button onClick={()=>handleSetCover(p.id)}
                    style={{position:"absolute",bottom:4,left:4,right:24,background:coverId===p.id?"#0196e3":"rgba(0,0,0,0.6)",color:"#fff",border:"none",borderRadius:6,fontSize:9,fontWeight:700,padding:"3px 4px",cursor:"pointer"}}>
                    {coverId===p.id ? t("isCoverLabel") : t("setAsCover")}
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
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:310,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setConfirmDeleteId(null)}>
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
function CollectionPhotoZoom({ photos, index, onClose, onNav }: { photos: CollectionPhoto[]; index: number; onClose:()=>void; onNav:(i:number)=>void }) {
  const { t } = useTr();
  const photo = photos[index];
  if (!photo) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:420,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <button onClick={e=>{e.stopPropagation();onClose();}}
        style={{position:"absolute",top:16,right:16,zIndex:421,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
        ✕
      </button>
      <div style={{position:"relative",maxWidth:"100%",maxHeight:"90vh"}} onClick={e=>e.stopPropagation()}>
        <img src={photo.url} alt="" style={{display:"block",maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}} />
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
    </div>
  );
}

function UserCollectionView({ userId, name, onBack }: { userId:string; name:string; onBack:()=>void }) {
  const { t } = useTr();
  const { photos, loading } = useUserCollectionGallery(userId);
  const [zoomIndex, setZoomIndex] = useState<number|null>(null);
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
            <div key={p.id} onClick={()=>setZoomIndex(i)} style={{aspectRatio:"1",borderRadius:10,overflow:"hidden",cursor:"pointer",background:"var(--bg2)"}}>
              <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
          ))}
        </div>
      )}
      {zoomIndex !== null && (
        <CollectionPhotoZoom photos={photos} index={zoomIndex} onClose={()=>setZoomIndex(null)} onNav={setZoomIndex} />
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

function CollectionsEntryButton({ onOpenMyCollection }: { onOpenMyCollection:()=>void }) {
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
        <CollectionsDirectoryModal onClose={()=>setShowDirectory(false)} onOpenMyCollection={onOpenMyCollection} />
      )}
    </>
  );
}

function CollectionsDirectoryModal({ onClose, onOpenMyCollection }: { onClose:()=>void; onOpenMyCollection:()=>void }) {
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
            <UserCollectionView userId={viewing.userId} name={viewing.name} onBack={()=>setViewing(null)} />
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

function CommunityTab({ data, communityUsers, communityTotal, topOwned, topWished, currentUserId, onOpenMyCollection }: {
  data: Series[]; communityUsers:number; communityTotal:number;
  topOwned:{id:number;count:number}[]; topWished:{id:number;count:number}[];
  currentUserId?: string|null;
  onOpenMyCollection:()=>void;
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

          <CollectionsEntryButton onOpenMyCollection={onOpenMyCollection} />

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
        <div style={{display:"flex",gap:8,marginTop:16,flexShrink:0}}>
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
function OnboardingModal({ onLogin, onSendCode, onVerifyCode, onEmailSuccess, onGuest }: { onLogin:()=>void; onSendCode:(email:string)=>Promise<{error:unknown}>; onVerifyCode:(email:string,code:string)=>Promise<{error:unknown}>; onEmailSuccess:()=>void; onGuest:()=>void }) {
  const { t } = useTr();

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
        <button onClick={onLogin}
          style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:"#0196e3",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{width:18,height:18}} />
          {t("onboardLogin")}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"var(--border)"}} />
          <div style={{fontSize:11,color:"var(--text4)"}}>{t("orContinueWithEmail")}</div>
          <div style={{flex:1,height:1,background:"var(--border)"}} />
        </div>

        <EmailCodeLogin
          onSendCode={onSendCode}
          onVerifyCode={onVerifyCode}
          onSuccess={()=>{ localStorage.setItem("wcf_onboarded","1"); onEmailSuccess(); }}
          buttonStyle={{width:"100%",padding:"11px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",color:"var(--text)",cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:16}}
        />

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
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    if (!userId) { setPhotos([]); setLoading(false); return; }
    setLoading(true);
    Promise.all([
      supabase.from("wcf_collection_photos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("wcf_collection_settings").select("cover_photo_id").eq("user_id", userId).maybeSingle(),
    ]).then(([photosRes, settingsRes]) => {
      setPhotos(photosRes.data ?? []);
      setCoverId(settingsRes.data?.cover_photo_id ?? null);
      setLoading(false);
    });
  }, [userId]);
  useEffect(() => { reload(); }, [reload]);
  return { photos, coverId, loading, reload };
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
      .order("created_at", { ascending: false })
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

function LoginModal({ onClose, onGoogle, onSendCode, onVerifyCode }: { onClose:()=>void; onGoogle:()=>void; onSendCode:(email:string)=>Promise<{error:unknown}>; onVerifyCode:(email:string,code:string)=>Promise<{error:unknown}> }) {
  const { t } = useTr();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--bg)",borderRadius:16,padding:28,width:"100%",maxWidth:340,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>📦</div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>WCF Checklist</div>
        <div style={{fontSize:13,color:"var(--text3)",marginBottom:24}}>{t("signInToMark")}</div>
        <button onClick={onGoogle}
          style={{width:"100%",padding:"12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{width:18,height:18}} />
          {t("signInGoogle")}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"var(--border)"}} />
          <div style={{fontSize:11,color:"var(--text4)"}}>{t("orContinueWithEmail")}</div>
          <div style={{flex:1,height:1,background:"var(--border)"}} />
        </div>

        <EmailCodeLogin onSendCode={onSendCode} onVerifyCode={onVerifyCode} onSuccess={onClose} />

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



export default function App() {
  const { user, authReady, signInWithGoogle, signInWithEmail, verifyEmailCode, updateName, updateAvatar, signOut } = useAuth();
  const { owned, toggle, wishlist, toggleWish, favourites, toggleFavourite, imgbbKey, ready: ownedReady } = useOwned(user?.id ?? null, user?.name ?? null, user?.email ?? null, user?.avatar ?? null);
  const { data, setData, ready: dataReady } = useData();
  const { figureOwned: communityOwned, figureWished: communityWished, users: communityUsers, totalOwned: communityTotal, topOwned, topWished } = useCommunityStats();
  const [figuresWithPhotos, setFiguresWithPhotos] = useState<Record<number,number>>({});

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
  const addFigure = (sid:number,stid:number,f:Omit<Figure,"id">,gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures:[...st.figures,{...f,id:newId()}]}:st);
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
        <button onClick={toggleDark} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}}>{dark?"☀️":"🌙"}</button>
        <button onClick={()=>setShowFeedback(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title={t("feedbackTitle")}>💬</button>
        <button onClick={()=>setShowChangelog(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title={t("changelogTitle")}>🎉</button>
        {isAdmin && (
          <button onClick={()=>setShowModeration(true)} style={{position:"relative",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}} title="Photo moderation">
            📸
            {pendingPhotosCount > 0 && (
              <span style={{position:"absolute",top:-5,right:-5,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:700,borderRadius:9,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",border:"1.5px solid var(--bg)",lineHeight:1}}>
                {pendingPhotosCount > 99 ? "99+" : pendingPhotosCount}
              </span>
            )}
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
              style={{background:"none",border:"none",cursor:"pointer",padding:0,borderRadius:"50%",overflow:"hidden",width:28,height:28,flexShrink:0}}>
              {user.avatar
                ? <img src={user.avatar} alt={user.name} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover"}} />
                : <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff"}}>{user.name?.[0]??user.email?.[0]??"?"}</div>
              }
            </button>
            {showUserMenu && (
              <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:500,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",overflow:"hidden",minWidth:170}}>
                <div onClick={()=>{setShowUserMenu(false);setShowMyCollection(true);}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {t("myCollectionMenuItem")}
                </div>
                <div onClick={()=>{setShowUserMenu(false);setShowSettings(true);}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",borderTop:"1px solid var(--border)"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {t("settingsMenuItem")}
                </div>
                <div onClick={()=>{setShowUserMenu(false);signOut();}}
                  style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:"var(--text)",whiteSpace:"nowrap",borderTop:"1px solid var(--border)"}}
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
            {/* Owned section */}
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:8,borderBottom:"2px solid #0174b0"}}>
                <span style={{fontSize:16}}>✅</span>
                <span style={{fontSize:15,fontWeight:700,color:"var(--text)"}}>{t("owned")}</span>
                <span style={{fontSize:12,color:"var(--text3)",background:"var(--bg2)",padding:"2px 8px",borderRadius:10}}>{colOwned.length}</span>
              </div>
              {colOwned.length===0 ? (
                <div style={{textAlign:"center",padding:"2rem",color:"var(--text4)",fontSize:13}}>{t("noFiguresOwned")}</div>
              ) : (
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                  {colOwned.map(({figure,set,series,groupName})=>{
                    const isConfirm = confirmFigure?.figure.id===figure.id;
                    return (
                    <div key={figure.id} style={{flexShrink:0,width:colSize==="s"?80:colSize==="m"?110:150,scrollSnapAlign:"start",position:"relative"}}>
                      <SearchResultCard figure={figure} series={series} set={set} groupName={groupName}
                        isOwned={true} isWished={false} compact hideIcons
                        userPhotoCount={figuresWithPhotos[figure.id]??0} userId={user?.id}
                        onToggle={()=>setConfirmFigure(isConfirm?null:{figure,series,set,mode:"owned"})}
                        onToggleWish={()=>setConfirmFigure(isConfirm?null:{figure,series,set,mode:"owned"})} />
                      {isConfirm && (
                        <div style={{position:"absolute",inset:0,borderRadius:8,background:"rgba(0,0,0,0.75)",zIndex:10,display:"flex",flexDirection:"column",justifyContent:"center",gap:4,padding:6}}>
                          <button onClick={e=>{e.stopPropagation();setDetailFigureCol({figure,series,set});setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.9)",color:"#0196e3",cursor:"pointer",fontSize:9,fontWeight:700}}>🔍 Details</button>
                          <button onClick={e=>{e.stopPropagation();toggleWish(figure.id);toggle(figure.id);setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#fef3c7",color:"#92400e",cursor:"pointer",fontSize:9,fontWeight:700}}>{t("moveToWishlist")}</button>
                          <button onClick={e=>{e.stopPropagation();toggle(figure.id);setConfirmFigure(null);}} style={{padding:"5px 4px",borderRadius:6,border:"none",background:"#fee2e2",color:"#dc2626",cursor:"pointer",fontSize:9,fontWeight:700}}>{t("removeItem")}</button>
                          <button onClick={e=>{e.stopPropagation();setConfirmFigure(null);}} style={{padding:"4px",borderRadius:6,border:"none",background:"rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer",fontSize:9}}>{t("cancelBtn")}</button>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wishlist section */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:8,borderBottom:"2px solid #f59e0b"}}>
                <span style={{fontSize:16}}>💛</span>
                <span style={{fontSize:15,fontWeight:700,color:"var(--text)"}}>{t("wishlist")}</span>
                <span style={{fontSize:12,color:"var(--text3)",background:"var(--bg2)",padding:"2px 8px",borderRadius:10}}>{colWishlist.length}</span>
              </div>
              {colWishlist.length===0 ? (
                <div style={{textAlign:"center",padding:"2rem",color:"var(--text4)",fontSize:13}}>{t("wishlistEmpty")}</div>
              ) : (
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                  {colWishlist.map(({figure,set,series,groupName})=>{
                    const isConfirm = confirmFigure?.figure.id===figure.id;
                    return (
                    <div key={figure.id} style={{flexShrink:0,width:colSize==="s"?80:colSize==="m"?110:150,scrollSnapAlign:"start",position:"relative"}}>
                      <SearchResultCard figure={figure} series={series} set={set} groupName={groupName}
                        isOwned={false} isWished={true} compact hideIcons
                        userPhotoCount={figuresWithPhotos[figure.id]??0} userId={user?.id}
                        onToggle={()=>setConfirmFigure(isConfirm?null:{figure,series,set,mode:"wishlist"})}
                        onToggleWish={()=>setConfirmFigure(isConfirm?null:{figure,series,set,mode:"wishlist"})} />
                      {isConfirm && (
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
          onOpenMyCollection={user ? ()=>setShowMyCollection(true) : ()=>setShowLogin(true)}
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
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} onGoogle={()=>{signInWithGoogle();setShowLogin(false);}} onSendCode={signInWithEmail} onVerifyCode={verifyEmailCode} />}
      {user && !user.name && <ChooseNameModal onSave={updateName} />}
      {showOnboarding && <OnboardingModal
        onLogin={()=>{ setShowOnboarding(false); localStorage.setItem("wcf_onboarded","1"); signInWithGoogle(); }}
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
          </DragCtx.Provider>
        </SeriesDataCtx.Provider>
      </AdminCtx.Provider>
      </UserInfoCtx.Provider>
    </LangProvider>
  );
}

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

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
type LangCode = "es" | "en" | "th";
const LANGUAGES: { code: LangCode; flag: string; label: string }[] = [
  { code: "es", flag: "https://flagcdn.com/es.svg", label: "ES" },
  { code: "en", flag: "https://flagcdn.com/gb.svg", label: "EN" },
  { code: "th", flag: "https://flagcdn.com/th.svg", label: "TH" },
];

const T = {
  appTitle:         { es: "WCF Checklist",            en: "WCF Checklist",              th: "WCF Checklist" },
  appSubtitle:      { es: "World Collectable Figure",  en: "World Collectable Figure",   th: "World Collectable Figure" },
  searchPH:         { es: "Buscar figura, serie o set...", en: "Search figure, series or set...", th: "ค้นหาตัวเลข ซีรีส์ หรือชุด..." },
  allCategories:    { es: "Todas las categorías",      en: "All categories",             th: "ทุกหมวดหมู่" },
  official:         { es: "🏷️ Oficiales",              en: "🏷️ Official",                th: "🏷️ ทางการ" },
  resin:            { es: "🎨 Resinas",                en: "🎨 Resin",                   th: "🎨 เรซิน" },
  officialBadge:    { es: "Oficial",                   en: "Official",                   th: "ทางการ" },
  resinBadge:       { es: "Resina",                    en: "Resin",                      th: "เรซิน" },
  seriesLabel:      { es: "Series",                    en: "Series",                     th: "ซีรีส์" },
  newSeries:        { es: "+ Nueva serie",             en: "+ New series",               th: "+ ซีรีส์ใหม่" },
  newSet:           { es: "+ Nuevo set",               en: "+ New set",                  th: "+ ชุดใหม่" },
  noSeries:         { es: "Sin series aún",            en: "No series yet",              th: "ยังไม่มีซีรีส์" },
  noSets1:          { es: "Esta serie no tiene sets aún.", en: "This series has no sets yet.", th: "ซีรีส์นี้ยังไม่มีชุด" },
  noSets2:          { es: "Pulsa \"+ Nuevo set\" para empezar.", en: "Press \"+ New set\" to start.", th: "กด \"+ ชุดใหม่\" เพื่อเริ่มต้น" },
  noSeriesCat1:     { es: "No hay series en esta categoría.", en: "No series in this category.", th: "ไม่มีซีรีส์ในหมวดหมู่นี้" },
  noSeriesCat2:     { es: "Pulsa \"+ Nueva serie\" para empezar.", en: "Press \"+ New series\" to start.", th: "กด \"+ ซีรีส์ใหม่\" เพื่อเริ่มต้น" },
  wishlist:         { es: "Wishlist",                  en: "Wishlist",                   th: "รายการปรารถนา" },
  wishlistEmpty:    { es: "Tu wishlist está vacía",    en: "Your wishlist is empty",      th: "รายการปรารถนาของคุณว่างเปล่า" },
  wishlistHint:     { es: "Pasa el ratón sobre cualquier figura y pulsa 🤍 para añadirla", en: "Hover over any figure and press 🤍 to add it", th: "วางเมาส์เหนือตัวเลขแล้วกด 🤍 เพื่อเพิ่ม" },
  owned:            { es: "Obtenida",                  en: "Owned",                      th: "มีแล้ว" },
  missing:          { es: "Me falta",                  en: "Missing",                    th: "ยังขาด" },
  inWishlist:       { es: "En wishlist",               en: "In wishlist",                th: "ในรายการ" },
  tapToOwn:         { es: "Toca para obtener",         en: "Tap to own",                 th: "แตะเพื่อรับ" },
  complete:         { es: "✓ Completo",                en: "✓ Complete",                 th: "✓ ครบ" },
  markAll:          { es: "Marcar todo",               en: "Mark all",                   th: "ทำเครื่องหมายทั้งหมด" },
  unmarkAll:        { es: "Desmarcar todo",            en: "Unmark all",                 th: "ยกเลิกทั้งหมด" },
  addFigure:        { es: "+ Añadir figura",           en: "+ Add figure",               th: "+ เพิ่มตัวเลข" },
  editSetBtn:       { es: "✏️ Editar set",             en: "✏️ Edit set",                th: "✏️ แก้ไขชุด" },
  deleteSetBtn:     { es: "🗑 Eliminar set",           en: "🗑 Delete set",              th: "🗑 ลบชุด" },
  noResults:        { es: "No se encontraron figuras con esos filtros.", en: "No figures found with those filters.", th: "ไม่พบตัวเลขที่ตรงกับตัวกรองเหล่านั้น" },
  searchResults:    { es: "🔍 Resultados",             en: "🔍 Results",                 th: "🔍 ผลลัพธ์" },
  allSeries:        { es: "Todas las series",          en: "All series",                 th: "ทุกซีรีส์" },
  loading:          { es: "Cargando colección...",     en: "Loading collection...",      th: "กำลังโหลดคอลเลกชัน..." },
  adjustImage:      { es: "Ajustar imagen",            en: "Adjust image",               th: "ปรับรูปภาพ" },
  cropHint:         { es: "Arrastra el recuadro · Esquinas para redimensionar · Slider para zoom", en: "Drag the box · Corners to resize · Slider for zoom", th: "ลากกรอบ · มุมเพื่อปรับขนาด · สไลเดอร์สำหรับซูม" },
  confirmUpload:    { es: "Confirmar y subir",         en: "Confirm & upload",           th: "ยืนยันและอัปโหลด" },
  uploading:        { es: "⏳ Subiendo imagen...",     en: "⏳ Uploading image...",      th: "⏳ กำลังอัปโหลด..." },
  uploadClick:      { es: "📁 Clic para subir imagen", en: "📁 Click to upload image",  th: "📁 คลิกเพื่ออัปโหลดรูป" },
  uploadChange:     { es: "Clic para cambiar",         en: "Click to change",            th: "คลิกเพื่อเปลี่ยน" },
  uploadError:      { es: "Error al subir. Comprueba la API key.", en: "Upload error. Check your API key.", th: "เกิดข้อผิดพลาด ตรวจสอบ API key" },
  noApiKey:         { es: "Añade tu API key de ImgBB en ⚙️ Ajustes", en: "Add your ImgBB API key in ⚙️ Settings", th: "เพิ่ม API key ของ ImgBB ใน ⚙️ การตั้งค่า" },
  apiKeyWarning:    { es: "Añade tu API key de ImgBB en", en: "Add your ImgBB API key in", th: "เพิ่ม API key ของ ImgBB ใน" },
  noImage:          { es: "sin imagen",                en: "no image",                   th: "ไม่มีรูป" },
  zoom:             { es: "🔍 Zoom",                   en: "🔍 Zoom",                    th: "🔍 ซูม" },
  cancel:           { es: "Cancelar",                  en: "Cancel",                     th: "ยกเลิก" },
  save:             { es: "Guardar",                   en: "Save",                       th: "บันทึก" },
  settings:         { es: "Ajustes",                   en: "Settings",                   th: "การตั้งค่า" },
  imgbbKey:         { es: "API Key de ImgBB",          en: "ImgBB API Key",              th: "ImgBB API Key" },
  imgbbHint:        { es: "Consíguela gratis en imgbb.com/api", en: "Get it free at imgbb.com/api", th: "รับได้ฟรีที่ imgbb.com/api" },
  nameLabel:        { es: "Nombre",                    en: "Name",                       th: "ชื่อ" },
  emojiLabel:       { es: "Emoji",                     en: "Emoji",                      th: "อีโมจิ" },
  emojiFallback:    { es: "Emoji (fallback si no hay icono)", en: "Emoji (fallback if no icon)", th: "อีโมจิ (สำรองถ้าไม่มีไอคอน)" },
  colorLabel:       { es: "Color",                     en: "Color",                      th: "สี" },
  figureImage:      { es: "Imagen de la figura",       en: "Figure image",               th: "รูปตัวเลข" },
  sidebarIcon:      { es: "Icono para barra lateral (cuadrado)", en: "Sidebar icon (square)", th: "ไอคอนแถบด้านข้าง" },
  headerLogo:       { es: "Logo para encabezado (sin recorte)", en: "Header logo (no crop)", th: "โลโก้ส่วนหัว (ไม่ตัด)" },
  setNameLabel:     { es: "Nombre del set",            en: "Set name",                   th: "ชื่อชุด" },
  releaseDateLabel: { es: "Fecha de lanzamiento (mes/año)", en: "Release date (month/year)", th: "วันวางจำหน่าย (เดือน/ปี)" },
  setLogoLabel:     { es: "Logo de la serie (ej: Dragon Ball Z)", en: "Series logo (e.g. Dragon Ball Z)", th: "โลโก้ซีรีส์" },
  newFigureTitle:   { es: "Nueva figura",              en: "New figure",                 th: "ตัวเลขใหม่" },
  editFigureTitle:  { es: "Editar figura",             en: "Edit figure",                th: "แก้ไขตัวเลข" },
  editSetTitle:     { es: "Editar set",                en: "Edit set",                   th: "แก้ไขชุด" },
  editSeriesTitle:  { es: "Editar serie",              en: "Edit series",                th: "แก้ไขซีรีส์" },
  months: {
    es: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    th: ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],
  },
  wishlistCount: {
    es: (n: number) => `${n} figura${n !== 1 ? "s" : ""} en tu wishlist`,
    en: (n: number) => `${n} figure${n !== 1 ? "s" : ""} in your wishlist`,
    th: (n: number) => `${n} ตัวเลขในรายการปรารถนา`,
  },
  resultsCount: {
    es: (n: number) => `${n} figura${n !== 1 ? "s" : ""} encontrada${n !== 1 ? "s" : ""}`,
    en: (n: number) => `${n} figure${n !== 1 ? "s" : ""} found`,
    th: (n: number) => `พบ ${n} ตัวเลข`,
  },
  newSeriesTitle: {
    es: (cat: string) => `Nueva serie — ${cat}`,
    en: (cat: string) => `New series — ${cat}`,
    th: (cat: string) => `ซีรีส์ใหม่ — ${cat}`,
  },
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

function useLang() {
  const [lang, setLang] = useState<LangCode>(() => (localStorage.getItem("wcf_lang") as LangCode) ?? "es");
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
interface Figure { id: number; name: string; emoji: string; image?: string; }
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

const SERIES_COLORS = ["#f97316","#8b5cf6","#ef4444","#06b6d4","#eab308","#0F6E56","#e11d48","#0ea5e9","#84cc16","#f43f5e","#b45309","#7c3aed","#0891b2","#dc2626"];
const EMOJIS = ["⭐","🔥","💥","🎯","🐉","☠️","🗡️","💜","🟢","🔵","🟡","🟠","🟣","⚡","💚","🩷","🖤","⚪","🃏","🐗","👒","🦌","💪","🦋","🎭","👑","🌸","🦊","🐺","🏮"];
function newId() { return Date.now() + Math.floor(Math.random() * 1000); }

async function uploadToImgBB(blob: Blob | File, apiKey: string): Promise<string> {
  const fd = new FormData();
  fd.append("image", blob);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Error");
  return (await res.json()).data.url as string;
}

// ============================================================
//  HOOKS
// ============================================================
function useOwned() {
  const [owned, setOwned] = useState<Set<number>>(new Set());
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [imgbbKey, setImgbbKeyState] = useState("");
  const [appLogo, setAppLogoState] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load owned/wishlist from localStorage (per device)
    try {
      const o = JSON.parse(localStorage.getItem("wcf_owned") ?? "[]");
      const w = JSON.parse(localStorage.getItem("wcf_wishlist") ?? "[]");
      setOwned(new Set(o)); setWishlist(new Set(w));
    } catch {}
    // Load app settings (imgbb key, logo) from Supabase — shared/admin only
    sbGet("wcf_owned").then(row => {
      if (row) { setImgbbKeyState(row.imgbb_key ?? ""); setAppLogoState(row.app_logo ?? ""); }
      setReady(true);
    });
  }, []);

  const saveLocal = (o: Set<number>, w: Set<number>) => {
    localStorage.setItem("wcf_owned", JSON.stringify([...o]));
    localStorage.setItem("wcf_wishlist", JSON.stringify([...w]));
  };
  const saveSettings = (key?: string, logo?: string) =>
    sbUpsert("wcf_owned", { imgbb_key: key ?? imgbbKey, app_logo: logo ?? appLogo });

  const toggle = (id: number) => setOwned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); saveLocal(n, wishlist); return n; });
  const toggleWish = (id: number) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); saveLocal(owned, n); return n; });
  const saveImgbbKey = (key: string) => { setImgbbKeyState(key); saveSettings(key); };
  const saveAppLogo = (logo: string) => { setAppLogoState(logo); saveSettings(undefined, logo); };
  return { owned, toggle, wishlist, toggleWish, imgbbKey, saveImgbbKey, appLogo, saveAppLogo, ready };
}

function useData() {
  const [data, setDataState] = useState<Series[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    sbGet("wcf_data").then(row => {
      if (row && Array.isArray(row.data) && row.data.length > 0) {
        // Migrate: ensure every series has groups array
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
function ImageUploader({ apiKey, currentUrl, onUploaded, label, aspectRatio, format="jpeg", freeWidth=false, skipCrop=false }: {
  apiKey:string; currentUrl?:string; onUploaded:(url:string)=>void; label:string; aspectRatio:number|null; format?:"jpeg"|"png"; freeWidth?:boolean; skipCrop?:boolean;
}) {
  const { t } = useTr();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [cropSrc, setCropSrc] = useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!apiKey) { setError(t("noApiKey")); return; }
    if (skipCrop) {
      setUploading(true); setError("");
      uploadToImgBB(file, apiKey).then(url=>onUploaded(url)).catch(()=>setError(t("uploadError"))).finally(()=>setUploading(false));
    } else {
      const r = new FileReader(); r.onload = e => setCropSrc(e.target?.result as string); r.readAsDataURL(file);
    }
  };
  const handleCropConfirm = async (blob: Blob) => {
    setCropSrc(null); setUploading(true); setError("");
    try { onUploaded(await uploadToImgBB(blob, apiKey)); } catch { setError(t("uploadError")); } finally { setUploading(false); }
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
        style={{border:`1.5px dashed ${dragOver?"#0F6E56":"var(--border)"}`,borderRadius:10,padding:12,cursor:uploading?"wait":"pointer",textAlign:"center",background:dragOver?"#E1F5EE":"var(--bg2)",marginBottom:4,transition:"border-color 0.2s, background 0.2s"}}>
        {currentUrl
          ? <div><img src={currentUrl} alt="" style={{maxHeight:80,maxWidth:"100%",borderRadius:6,marginBottom:6,objectFit:"contain"}} /><div style={{fontSize:12,color:"var(--text3)"}}>{uploading ? t("uploading") : t("uploadChange")}</div></div>
          : <div style={{color:dragOver?"#0F6E56":"var(--text4)",fontSize:13}}>{uploading ? t("uploading") : dragOver ? "Suelta la imagen aquí" : t("uploadClick")}</div>
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
  const bg = variant==="primary"?"#1a1a1a":variant==="danger"?"#fee2e2":"#f5f5f3";
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
function FigureModal({ title, initial, apiKey, onSave, onClose }: { title:string; initial?:Partial<Figure>; apiKey:string; onSave:(f:Omit<Figure,"id">)=>void; onClose:()=>void }) {
  const { t } = useTr();
  const [name, setName] = useState(initial?.name??"");
  const [emoji, setEmoji] = useState(initial?.emoji??"⭐");
  const [image, setImage] = useState(initial?.image??"");
  return (
    <Modal title={title} onClose={onClose}>
      <Field label={t("nameLabel")}><Input value={name} onChange={setName} placeholder="Ej: Goku SSJ" /></Field>
      <Field label={t("emojiLabel")}><EmojiPicker value={emoji} onChange={setEmoji} /></Field>
      <ImageUploader apiKey={apiKey} currentUrl={image} onUploaded={setImage} label={t("figureImage")} aspectRatio={1} />
      <div style={{marginTop:20,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{if(name.trim()){onSave({name:name.trim(),emoji,image});onClose();}}} variant="primary">{t("save")}</Btn>
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

function SettingsModal({ apiKey, currentBanner, onSave, onClose }: { apiKey:string; currentBanner:string; onSave:(k:string, b:string)=>void; onClose:()=>void }) {
  const { t } = useTr();
  const [key,setKey]=useState(apiKey);
  const [banner,setBanner]=useState(currentBanner);
  return (
    <Modal title={`⚙️ ${t("settings")}`} onClose={onClose}>
      <Field label={t("imgbbKey")}><Input value={key} onChange={setKey} placeholder="Pega aquí tu API key" /></Field>
      <p style={{fontSize:12,color:"var(--text3)",marginBottom:16}}>{t("imgbbHint")}</p>
      <ImageUploader apiKey={key||apiKey} currentUrl={banner} onUploaded={setBanner} label="Banner de la app (parte superior)" aspectRatio={null} format="png" skipCrop />
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
        <Btn onClick={onClose}>{t("cancel")}</Btn>
        <Btn onClick={()=>{onSave(key.trim(), banner);onClose();}} variant="primary">{t("save")}</Btn>
      </div>
    </Modal>
  );
}

// ============================================================
//  FIGURE CARD
// ============================================================
function FigureCard({ figure, color, isOwned, isWished, onToggle, onToggleWish, onEdit, onDelete }: {
  figure:Figure; color:string; isOwned:boolean; isWished:boolean;
  onToggle:()=>void; onToggleWish:()=>void; onEdit:()=>void; onDelete:()=>void;
}) {
  const { t } = useTr();
  const isAdmin = useAdmin();
  const [imgError,setImgError]=useState(false); const [hover,setHover]=useState(false);
  const isMobileDevice = window.innerWidth < 768;
  const hasImage = !!figure.image && !imgError;
  const statusText = isOwned ? t("owned") : isWished ? t("inWishlist") : t("missing");
  const statusColor = isOwned ? color : isWished ? "#d97706" : "#aaa";
  const dotColor = isOwned ? color : isWished ? "#f59e0b" : "#ccc";
  return (
    <div style={{border:"1px solid "+(isOwned?color:isWished?"#f59e0b":"#e8e8e4"),borderRadius:10,background:isOwned?color+"18":isWished?"#fffbeb":"#fff",overflow:"hidden",position:"relative",transition:"transform 0.15s"}}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {(hover || isMobileDevice) && <div style={{position:"absolute",top:4,left:4,zIndex:3,display:"flex",gap:4}}>
        {isAdmin && hover && <>
          <button onClick={e=>{e.stopPropagation();onEdit();}} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>✏️</button>
          <button onClick={e=>{e.stopPropagation();onDelete();}} style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>🗑</button>
        </>}
        {!isOwned && <button onClick={e=>{e.stopPropagation();onToggleWish();}} style={{background:isWished?"#fef3c7":"rgba(255,255,255,0.85)",border:"1px solid "+(isWished?"#fcd34d":"#e8e8e4"),borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>{isWished?"💛":"🤍"}</button>}
      </div>}
      {isOwned && <div style={{position:"absolute",top:6,right:6,zIndex:2,width:20,height:20,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>✓</div>}
      {isWished && !isOwned && <div style={{position:"absolute",top:6,right:6,zIndex:2,fontSize:14}}>💛</div>}
      <div onClick={onToggle} style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:isOwned?color+"30":isWished?"#fef9c3":"var(--missing-bg)",overflow:"hidden",cursor:"pointer",opacity:isOwned?1:isWished?0.75:0.45,transition:"opacity 0.3s"}}>
        {hasImage ? <img src={figure.image} alt={figure.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover"}} />
          : <div style={{textAlign:"center"}}><div style={{fontSize:36}}>{figure.emoji}</div><div style={{fontSize:10,color:"var(--text4)",marginTop:4}}>{t("noImage")}</div></div>}
      </div>
      <div style={{padding:"8px 10px 10px"}}>
        <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,marginBottom:5}}>{figure.name}</div>
        <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:statusColor,fontWeight:(isOwned||isWished)?600:400,cursor:"pointer"}}>
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
function SetCard({ set, color, owned, wishlist, apiKey, onToggle, onToggleWish, onToggleAll, onUpdateSet, onDeleteSet, onDuplicate, onMoveToGroup, groups, onAddFigure, onUpdateFigure, onDeleteFigure }: {
  set:FigureSet; color:string; owned:Set<number>; wishlist:Set<number>; apiKey:string;
  onToggle:(id:number)=>void; onToggleWish:(id:number)=>void; onToggleAll:(ids:number[],markAs:boolean)=>void;
  onUpdateSet:(n:string,rd:string,sl:string)=>void; onDeleteSet:()=>void; onDuplicate:()=>void;
  onMoveToGroup?:(gid:number)=>void; groups?:FigureGroup[];
  onAddFigure:(f:Omit<Figure,"id">)=>void; onUpdateFigure:(id:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(id:number)=>void;
}) {
  const { t, lang } = useTr();
  const isAdmin = useAdmin();
  const [open,setOpen]=useState(false); const [editSet,setEditSet]=useState(false);
  const [addFigure,setAddFigure]=useState(false); const [bulkAdd,setBulkAdd]=useState(false);
  const [editFigure,setEditFigure]=useState<Figure|null>(null);
  const [showMoveMenu,setShowMoveMenu]=useState(false);
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
            <span style={{fontSize:12,padding:"2px 10px",borderRadius:20,background:complete?"#E1F5EE":"#f0f0ec",color:complete?"#0F6E56":"#888",fontWeight:complete?600:400}}>
              {complete ? t("complete") : `${ownedCount}/${total}`}
            </span>
            <button onClick={e=>{e.stopPropagation();onToggleAll(set.figures.map(f=>f.id),!complete);}}
              style={{fontSize:11,padding:"2px 8px",borderRadius:12,border:"1px solid "+(complete?"#fca5a5":"#0F6E56"),background:complete?"#fee2e2":"#E1F5EE",color:complete?"#dc2626":"#0F6E56",cursor:"pointer",fontWeight:500}}>
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
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(120px, 1fr))",gap:10}}>
          {set.figures.map(f=>(
            <FigureCard key={f.id} figure={f} color={color} isOwned={owned.has(f.id)} isWished={wishlist.has(f.id)}
              onToggle={()=>onToggle(f.id)} onToggleWish={()=>onToggleWish(f.id)} onEdit={()=>setEditFigure(f)} onDelete={()=>onDeleteFigure(f.id)} />
          ))}
        </div>
      </div>}
      {editSet && <SetModal title={t("editSetTitle")} initial={set} apiKey={apiKey} onSave={(n,rd,sl)=>{onUpdateSet(n,rd,sl);setEditSet(false);}} onClose={()=>setEditSet(false)} />}
      {addFigure && <FigureModal title={t("newFigureTitle")} apiKey={apiKey} onSave={f=>{onAddFigure(f);setAddFigure(false);}} onClose={()=>setAddFigure(false)} />}
      {bulkAdd && <BulkAddModal onSave={names=>{names.forEach(name=>onAddFigure({name,emoji:"⭐",image:""}));}} onClose={()=>setBulkAdd(false)} />}
      {editFigure && <FigureModal title={t("editFigureTitle")} initial={editFigure} apiKey={apiKey} onSave={f=>{onUpdateFigure(editFigure.id,f);setEditFigure(null);}} onClose={()=>setEditFigure(null)} />}
    </div>
  );
}

// ============================================================
//  SEARCH RESULT CARD
// ============================================================
function SearchResultCard({ figure, series, set, groupName, isOwned, isWished, onToggle, onToggleWish, compact=false }: { figure:Figure; series:Series; set:FigureSet; groupName?:string; isOwned:boolean; isWished:boolean; onToggle:()=>void; onToggleWish:()=>void; compact?:boolean }) {
  const { t, lang } = useTr();
  const [imgError,setImgError]=useState(false); const hasImage = !!figure.image && !imgError;
  const formatDate = (d?: string) => { if (!d) return null; const [y, m] = d.split("-"); return `${T.months[lang][parseInt(m)-1]} ${y}`; };
  return (
    <div style={{border:"1px solid "+(isOwned?series.color:isWished?"#f59e0b":"var(--border)"),borderRadius:8,background:isOwned?series.color+"18":isWished?"#fffbeb":"var(--card-bg)",overflow:"hidden",transition:"transform 0.15s",position:"relative"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
      {!isOwned && (
        <button onClick={e=>{e.stopPropagation();onToggleWish();}}
          style={{position:"absolute",top:4,left:4,zIndex:3,background:isWished?"#fef3c7":"rgba(255,255,255,0.85)",border:"1px solid "+(isWished?"#fcd34d":"#e8e8e4"),borderRadius:5,padding:"1px 4px",fontSize:11,cursor:"pointer",lineHeight:1}}>
          {isWished?"💛":"🤍"}
        </button>
      )}
      <div onClick={onToggle} style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:isOwned?series.color+"30":"var(--missing-bg)",overflow:"hidden",position:"relative",opacity:isOwned?1:isWished?0.75:0.45,transition:"opacity 0.3s",cursor:"pointer"}}>
        {isOwned && <div style={{position:"absolute",top:4,right:4,zIndex:2,width:16,height:16,borderRadius:"50%",background:series.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>✓</div>}
        {isWished && !isOwned && <div style={{position:"absolute",top:4,right:4,zIndex:2,fontSize:12}}>💛</div>}
        {hasImage ? <img src={figure.image} alt={figure.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover"}} />
          : <div style={{textAlign:"center"}}><div style={{fontSize:compact?24:34}}>{figure.emoji}</div></div>}
      </div>
      <div style={{padding:compact?"4px 6px 6px":"8px 10px 10px"}}>
        {/* Line 1 — series + category tag (always) */}
        <div style={{fontSize:10,color:"var(--text4)",marginBottom:2,display:"flex",alignItems:"center",gap:3,flexWrap:"nowrap",overflow:"hidden"}}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{series.name}</span>
          <span style={{flexShrink:0,padding:"1px 4px",borderRadius:5,fontSize:9,fontWeight:600,background:series.category==="oficial"?"#E1F5EE":"#ede9fe",color:series.category==="oficial"?"#0F6E56":"#7c3aed",whiteSpace:"nowrap"}}>
            {series.category==="oficial" ? t("officialBadge") : t("resinBadge")}
          </span>
        </div>
        {compact ? <>
          {/* Line 2 — figure name, 1 line, shrinking font */}
          <div style={{fontWeight:600,lineHeight:1.3,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontSize:figure.name.length>14?9:figure.name.length>10?10:11}}>{figure.name}</div>
          {/* Line 3 — set name, 1 line */}
          <div style={{fontSize:9,color:"var(--text4)",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{groupName && series.category==="resina" ? `${groupName} ${set.name}` : set.name}</div>
          {/* Line 4 — date only for oficial */}
          {series.category==="oficial" && set.releaseDate && <div style={{fontSize:9,color:"var(--text4)"}}>{formatDate(set.releaseDate)}</div>}
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
function GroupCard({ group, color, owned, wishlist, apiKey, onToggle, onToggleWish, onToggleAll, onUpdateGroup, onDeleteGroup, onAddSet, onUpdateSet, onDeleteSet, onDuplicateSet, onAddFigure, onUpdateFigure, onDeleteFigure, onReorderSets }: {
  group:FigureGroup; color:string; owned:Set<number>; wishlist:Set<number>; apiKey:string;
  onToggle:(id:number)=>void; onToggleWish:(id:number)=>void; onToggleAll:(ids:number[],markAs:boolean)=>void;
  onUpdateGroup:(name:string,logo:string)=>void; onDeleteGroup:()=>void; onAddSet:()=>void;
  onUpdateSet:(stid:number,n:string,rd:string,sl:string)=>void; onDeleteSet:(stid:number)=>void; onDuplicateSet:(stid:number)=>void;
  onAddFigure:(stid:number,f:Omit<Figure,"id">)=>void; onUpdateFigure:(stid:number,fid:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(stid:number,fid:number)=>void;
  onReorderSets:(from:number,to:number)=>void;
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

  return (
    <div style={{marginBottom:16,border:"2px solid var(--border2)",borderRadius:14,overflow:"hidden",background:"var(--bg2)"}}>
      {/* Group header */}
      <div onClick={()=>setOpen(!open)} style={{padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:"var(--bg3)"}}>
        {group.logo && !imgError && <img src={group.logo} alt={group.name} onError={()=>setImgError(true)} style={{height:24,maxWidth:80,objectFit:"contain"}} />}
        <span style={{fontSize:15,fontWeight:700,flex:1,color:"var(--text)"}}>{group.name} <span style={{fontSize:12,color:"var(--text4)",fontWeight:400}}>({group.sets.length} set{group.sets.length!==1?"s":""})</span></span>
        <span style={{fontSize:12,padding:"2px 10px",borderRadius:20,background:complete?"#E1F5EE":"var(--bg)",color:complete?"#0F6E56":"var(--text3)",fontWeight:complete?600:400}}>
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
          <DraggableSetList
            sets={group.sets} color={color} owned={owned} wishlist={wishlist} apiKey={apiKey}
            onToggle={onToggle} onToggleWish={onToggleWish} onToggleAll={onToggleAll}
            onUpdateSet={onUpdateSet} onDeleteSet={onDeleteSet} onDuplicate={onDuplicateSet}
            onAddFigure={onAddFigure} onUpdateFigure={onUpdateFigure} onDeleteFigure={onDeleteFigure}
            onReorder={onReorderSets}
          />
        </div>
      )}
      {editGroup && <GroupModal title="Editar grupo" initial={group} apiKey={apiKey} onSave={(n,l)=>{onUpdateGroup(n,l);setEditGroup(false);}} onClose={()=>setEditGroup(false)} />}
    </div>
  );
}

// ============================================================
//  DRAGGABLE GROUP LIST
// ============================================================
function DraggableGroupList({ groups, color, owned, wishlist, apiKey, onToggle, onToggleWish, onToggleAll, onUpdateGroup, onDeleteGroup, onAddSet, onUpdateSet, onDeleteSet, onDuplicateSet, onAddFigure, onUpdateFigure, onDeleteFigure, onReorderSets, onReorderGroups }: {
  groups:FigureGroup[]; color:string; owned:Set<number>; wishlist:Set<number>; apiKey:string;
  onToggle:(id:number)=>void; onToggleWish:(id:number)=>void; onToggleAll:(ids:number[],markAs:boolean)=>void;
  onUpdateGroup:(gid:number,n:string,l:string)=>void; onDeleteGroup:(gid:number)=>void; onAddSet:(gid:number)=>void;
  onUpdateSet:(gid:number,stid:number,n:string,rd:string,sl:string)=>void; onDeleteSet:(gid:number,stid:number)=>void; onDuplicateSet:(gid:number,stid:number)=>void;
  onAddFigure:(gid:number,stid:number,f:Omit<Figure,"id">)=>void; onUpdateFigure:(gid:number,stid:number,fid:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(gid:number,stid:number,fid:number)=>void;
  onReorderSets:(gid:number,from:number,to:number)=>void; onReorderGroups:(from:number,to:number)=>void;
}) {
  const dragIdx = useRef<number|null>(null);
  const [dragOver, setDragOver] = useState<number|null>(null);

  const longPressTimer3 = useRef<ReturnType<typeof setTimeout>|null>(null);
  const groupTouchIdx = useRef<number|null>(null);
  const handleDragStart = (idx:number) => { dragIdx.current=idx; };
  const handleDragOver = (e:React.DragEvent, idx:number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx:number) => { if(dragIdx.current!==null && dragIdx.current!==idx) onReorderGroups(dragIdx.current,idx); dragIdx.current=null; setDragOver(null); };
  const handleDragEnd = () => { dragIdx.current=null; setDragOver(null); };
  const handleGroupTouchStart = (_e:React.TouchEvent, idx:number) => { longPressTimer3.current=setTimeout(()=>{groupTouchIdx.current=idx;setDragOver(idx);},400); };
  const handleGroupTouchMove = () => { if(longPressTimer3.current){clearTimeout(longPressTimer3.current);longPressTimer3.current=null;} };
  const handleGroupTouchEnd = (e:React.TouchEvent) => {
    if(longPressTimer3.current){clearTimeout(longPressTimer3.current);longPressTimer3.current=null;}
    if(groupTouchIdx.current===null) return;
    const touch2=e.changedTouches[0];
    const els=document.elementsFromPoint(touch2.clientX,touch2.clientY);
    const target=els.find(el=>el.hasAttribute("data-groupidx"));
    if(target){const toIdx=parseInt(target.getAttribute("data-groupidx")!);if(toIdx!==groupTouchIdx.current)onReorderGroups(groupTouchIdx.current,toIdx);}
    groupTouchIdx.current=null;setDragOver(null);
  };

  return (
    <div>
      {groups.map((g, idx) => (
        <div key={g.id}
          data-groupidx={idx}
          draggable
          onDragStart={()=>handleDragStart(idx)}
          onDragOver={e=>handleDragOver(e,idx)}
          onDrop={()=>handleDrop(idx)}
          onDragEnd={handleDragEnd}
          onTouchStart={e=>handleGroupTouchStart(e,idx)}
          onTouchMove={handleGroupTouchMove}
          onTouchEnd={handleGroupTouchEnd}
          style={{opacity:dragIdx.current===idx?0.4:1,outline:dragOver===idx?`2px solid ${color}`:"none",borderRadius:14,transition:"opacity 0.15s,outline 0.1s",marginBottom:16,cursor:"grab"}}>
          <GroupCard
            group={g} color={color} owned={owned} wishlist={wishlist} apiKey={apiKey}
            onToggle={onToggle} onToggleWish={onToggleWish} onToggleAll={onToggleAll}
            onUpdateGroup={(n,l)=>onUpdateGroup(g.id,n,l)}
            onDeleteGroup={()=>onDeleteGroup(g.id)}
            onAddSet={()=>onAddSet(g.id)}
            onUpdateSet={(stid,n,rd,sl)=>onUpdateSet(g.id,stid,n,rd,sl)}
            onDeleteSet={stid=>onDeleteSet(g.id,stid)}
            onDuplicateSet={stid=>onDuplicateSet(g.id,stid)}
            onAddFigure={(stid,f)=>onAddFigure(g.id,stid,f)}
            onUpdateFigure={(stid,fid,f)=>onUpdateFigure(g.id,stid,fid,f)}
            onDeleteFigure={(stid,fid)=>onDeleteFigure(g.id,stid,fid)}
            onReorderSets={(from,to)=>onReorderSets(g.id,from,to)}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================================
//  DRAGGABLE SET LIST
// ============================================================
function DraggableSetList({ sets, color, owned, wishlist, apiKey, onToggle, onToggleWish, onToggleAll, onUpdateSet, onDeleteSet, onDuplicate, onMoveToGroup, groups, onAddFigure, onUpdateFigure, onDeleteFigure, onReorder }: {
  sets: FigureSet[]; color: string; owned: Set<number>; wishlist: Set<number>; apiKey: string;
  onToggle:(id:number)=>void; onToggleWish:(id:number)=>void; onToggleAll:(ids:number[],markAs:boolean)=>void;
  onUpdateSet:(stid:number,n:string,rd:string,sl:string)=>void; onDeleteSet:(stid:number)=>void; onDuplicate:(stid:number)=>void;
  onMoveToGroup?:(stid:number,gid:number)=>void; groups?:FigureGroup[];
  onAddFigure:(stid:number,f:Omit<Figure,"id">)=>void; onUpdateFigure:(stid:number,fid:number,f:Omit<Figure,"id">)=>void; onDeleteFigure:(stid:number,fid:number)=>void;
  onReorder:(from:number,to:number)=>void;
}) {
  const dragIdx = useRef<number|null>(null);
  const [dragOver, setDragOver] = useState<number|null>(null);

  // Touch drag state
  const touchDragIdx = useRef<number|null>(null);
  const touchY = useRef(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const lastReorderTimeSet = useRef(0);

  const handleDragStart = (idx: number) => { dragIdx.current = idx; };
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx: number) => {
    if (dragIdx.current !== null && dragIdx.current !== idx) onReorder(dragIdx.current, idx);
    dragIdx.current = null; setDragOver(null);
  };
  const handleDragEnd = () => { dragIdx.current = null; setDragOver(null); };

  const handleTouchStart = (e: React.TouchEvent, idx: number) => {
    if (Date.now() - lastReorderTimeSet.current < 1000) return;
    touchY.current = e.touches[0].clientY;
    longPressTimer.current = setTimeout(() => { touchDragIdx.current = idx; setDragOver(idx); }, 500);
  };
  const handleTouchMove = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    if (touchDragIdx.current === null) return;
    const touch = e.changedTouches[0];
    const els = document.elementsFromPoint(touch.clientX, touch.clientY);
    const target = els.find(el => el.hasAttribute("data-setidx"));
    if (target) {
      const toIdx = parseInt(target.getAttribute("data-setidx")!);
      if (toIdx !== touchDragIdx.current) { onReorder(touchDragIdx.current, toIdx); lastReorderTimeSet.current = Date.now(); }
    }
    touchDragIdx.current = null; setDragOver(null);
  };

  return (
    <div>
      {sets.map((st, idx) => (
        <div key={st.id}
          data-setidx={idx}
          draggable
          onDragStart={()=>handleDragStart(idx)}
          onDragOver={e=>handleDragOver(e,idx)}
          onDrop={()=>handleDrop(idx)}
          onDragEnd={handleDragEnd}
          onTouchStart={e=>handleTouchStart(e,idx)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            opacity: dragIdx.current===idx ? 0.4 : 1,
            outline: dragOver===idx ? `2px solid ${color}` : "none",
            borderRadius: 12,
            transition: "opacity 0.15s, outline 0.1s",
            cursor: "grab",
          }}
        >
          <SetCard
            set={st} color={color} owned={owned} wishlist={wishlist} apiKey={apiKey}
            onToggle={onToggle} onToggleWish={onToggleWish} onToggleAll={onToggleAll}
            onUpdateSet={(n,rd,sl)=>onUpdateSet(st.id,n,rd,sl)}
            onDeleteSet={()=>onDeleteSet(st.id)}
            onDuplicate={()=>onDuplicate(st.id)}
            onMoveToGroup={onMoveToGroup ? (gid)=>onMoveToGroup(st.id,gid) : undefined}
            groups={groups}
            onAddFigure={f=>onAddFigure(st.id,f)}
            onUpdateFigure={(fid,f)=>onUpdateFigure(st.id,fid,f)}
            onDeleteFigure={fid=>onDeleteFigure(st.id,fid)}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================================
//  APP
// ============================================================
// ============================================================
//  DRAGGABLE SERIES LIST
// ============================================================
function DraggableSeriesList({ series, seriesOwned, seriesTotal, dragLocked, onSelect, onReorder }: {
  series: Series[];
  seriesOwned:(s:Series)=>number; seriesTotal:(s:Series)=>number;
  dragLocked?: boolean;
  onSelect:(sid:number)=>void; onReorder:(from:number,to:number)=>void;
}) {
  const dragIdx = useRef<number|null>(null);
  const [dragOver, setDragOver] = useState<number|null>(null);
  const touchDragIdx = useRef<number|null>(null);

  const handleDragStart = (idx:number) => { dragIdx.current=idx; };
  const handleDragOver = (e:React.DragEvent, idx:number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx:number) => { if(dragIdx.current!==null && dragIdx.current!==idx) onReorder(dragIdx.current,idx); dragIdx.current=null; setDragOver(null); };
  const handleDragEnd = () => { dragIdx.current=null; setDragOver(null); };
  const longPressTimer2 = useRef<ReturnType<typeof setTimeout>|null>(null);
  const handleTouchStart = (_e:React.TouchEvent, idx:number) => {
    if (dragLocked) return;
    longPressTimer2.current = setTimeout(() => { touchDragIdx.current=idx; setDragOver(idx); }, 500);
  };
  const handleTouchMove2 = () => { if(longPressTimer2.current){clearTimeout(longPressTimer2.current);longPressTimer2.current=null;} };
  const handleTouchEnd = (e:React.TouchEvent) => {
    if(longPressTimer2.current){clearTimeout(longPressTimer2.current);longPressTimer2.current=null;}
    if(touchDragIdx.current===null) return;
    const touch2=e.changedTouches[0];
    const els=document.elementsFromPoint(touch2.clientX,touch2.clientY);
    const target=els.find(el=>el.hasAttribute("data-seriesidx"));
    if(target){const toIdx=parseInt(target.getAttribute("data-seriesidx")!);if(toIdx!==touchDragIdx.current){onReorder(touchDragIdx.current,toIdx);}}
    touchDragIdx.current=null;setDragOver(null);
  };

  return (
    <div>
      {series.map((s, idx) => {
        return (
          <div key={s.id}
            data-seriesidx={idx}
            draggable={!dragLocked}
            onDragStart={()=>handleDragStart(idx)}
            onDragOver={e=>handleDragOver(e,idx)}
            onDrop={()=>handleDrop(idx)}
            onDragEnd={handleDragEnd}
            onTouchStart={e=>handleTouchStart(e,idx)}
            onTouchMove={handleTouchMove2}
            onTouchEnd={handleTouchEnd}
            onClick={()=>onSelect(s.id)}
            style={{cursor:"grab",position:"relative",overflow:"hidden",opacity:dragIdx.current===idx?0.4:1,outline:dragOver===idx?"2px solid "+s.color:"none",transition:"opacity 0.15s,outline 0.1s",borderBottom:"1px solid var(--border)"}}>
            {s.bgImage && <img src={s.bgImage} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"right center",pointerEvents:"none"}} />}
            <div style={{position:"relative",padding:"8px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                {!s.bgImage && (s.logo ? <img src={s.logo} alt={s.name} style={{width:22,height:22,borderRadius:4,objectFit:"contain",flexShrink:0}} /> : <span style={{fontSize:15}}>{s.emoji}</span>)}
                <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{s.name}</span>
              </div>
              <div style={{width:"50%"}}>
                <ProgressBar value={seriesOwned(s)} total={seriesTotal(s)} color={s.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
//  APP
// ============================================================
const ADMIN_PASSWORD = "wcf2024admin";

function AdminPrompt({ onSuccess, onClose }: { onSuccess:()=>void; onClose:()=>void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const check = () => {
    if (pwd === ADMIN_PASSWORD) { onSuccess(); onClose(); }
    else { setError(true); setPwd(""); }
  };
  return (
    <Modal title="🔐 Modo admin" onClose={onClose}>
      <p style={{fontSize:13,color:"var(--text3)",marginBottom:12}}>Introduce la contraseña para activar el modo edición.</p>
      <input type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&check()}
        placeholder="Contraseña" autoFocus
        style={{width:"100%",padding:"8px 10px",fontSize:14,border:`1px solid ${error?"#dc2626":"var(--border)"}`,borderRadius:8,outline:"none",boxSizing:"border-box" as const,marginBottom:error?4:0}} />
      {error && <p style={{fontSize:12,color:"#dc2626",marginBottom:0}}>Contraseña incorrecta</p>}
      <div style={{marginTop:16,display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn onClick={check} variant="primary">Entrar</Btn>
      </div>
    </Modal>
  );
}

export default function App() {
  const { owned, toggle, wishlist, toggleWish, imgbbKey, saveImgbbKey, appLogo, saveAppLogo, ready: ownedReady } = useOwned();
  const { data, setData, ready: dataReady } = useData();
  const { lang, setLang, t } = useLang();
  const { dark, toggleDark } = useDarkMode();
  const ready = ownedReady && dataReady;

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("wcf_admin") === "true");
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [editSeriesData, setEditSeriesData] = useState<Series|null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const apiKey = imgbbKey; const saveApiKey = saveImgbbKey;

  const addSeries = (name:string,emoji:string,color:string,logoHeader:string,bgImage:string) => { const s:Series={id:newId(),name,emoji,logoHeader,bgImage,color,category:"oficial",sets:[],groups:[]}; setData(d=>[...d,s]); };
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
  const reorderSets = (sid:number, fromIdx:number, toIdx:number, gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const reorder = (sets:FigureSet[]) => { const arr=[...sets]; const [mv]=arr.splice(fromIdx,1); arr.splice(toIdx,0,mv); return arr; };
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:reorder(g.sets)}:g)};
    return {...s,sets:reorder(s.sets)};
  }));
  // Group mutations
  const addGroup = (sid:number) => setData(d=>d.map(s=>s.id===sid?{...s,groups:[...s.groups,{id:newId(),name:"Nuevo grupo",logo:"",sets:[]}]}:s));
  const updateGroup = (sid:number,gid:number,name:string,logo:string) => setData(d=>d.map(s=>s.id===sid?{...s,groups:s.groups.map(g=>g.id===gid?{...g,name,logo}:g)}:s));
  const deleteGroup = (sid:number,gid:number) => setData(d=>d.map(s=>s.id===sid?{...s,groups:s.groups.filter(g=>g.id!==gid)}:s));
  const reorderGroups = (sid:number,fromIdx:number,toIdx:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s; const groups=[...s.groups]; const [mv]=groups.splice(fromIdx,1); groups.splice(toIdx,0,mv); return {...s,groups}; }));
  const moveSetToGroup = (sid:number, stid:number, gid:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const st = s.sets.find(x=>x.id===stid); if(!st) return s;
    return {...s, sets:s.sets.filter(x=>x.id!==stid), groups:s.groups.map(g=>g.id===gid?{...g,sets:[...g.sets,st]}:g)};
  }));
  const addFigure = (sid:number,stid:number,f:Omit<Figure,"id">,gid?:number) => setData(d=>d.map(s=>{ if(s.id!==sid) return s;
    const upd = (sets:FigureSet[]) => sets.map(st=>st.id===stid?{...st,figures:[...st.figures,{...f,id:newId()}]}:st);
    if(gid) return {...s,groups:s.groups.map(g=>g.id===gid?{...g,sets:upd(g.sets)}:g)};
    return {...s,sets:upd(s.sets)};
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

  const [dragLocked, setDragLocked] = useState(false);
  const [reorderKey, setReorderKey] = useState(0);
  const reorderSeries = (fromIdx:number, toIdx:number) => {
    setData(d=>{ const all=[...d]; const cats=all.filter(s=>s.category===dbActiveCategory); const others=all.filter(s=>s.category!==dbActiveCategory); const [moved]=cats.splice(fromIdx,1); cats.splice(toIdx,0,moved); return [...others,...cats]; });
    setDragLocked(true); setReorderKey(k=>k+1); setTimeout(()=>setDragLocked(false), 1500);
  };

  const langValue = { t, lang };

  // ── Tab state ──────────────────────────────────────────────
  type TabType = "collection" | "database";
  const [activeTab, setActiveTab] = useState<TabType>("collection");

  // ── Filter/sort/size state (independent per tab) ───────────
  const [colSearch,  setColSearch]  = useState("");
  const [colSort,    setColSort]    = useState<"alpha"|"date">("date");
  const [colSize,    setColSize]    = useState<"s"|"m"|"l">("s");
  const [colSeries,  setColSeries]  = useState<number|"all">("all");

  const [dbSearch,   setDbSearch]   = useState("");
  const [dbFilter,   setDbFilter]   = useState<"all"|"owned"|"wishlist"|"missing">("all");
  const [dbSort,     setDbSort]     = useState<"alpha"|"date">("date");
  const [dbSize,     setDbSize]     = useState<"s"|"m"|"l">("s");
  const [dbSeries,   setDbSeries]   = useState<number|"all">("all");
  const [dbCategory, setDbCategory] = useState<"all"|CategoryType>("all");
  const [dbSelectedSeries, setDbSelectedSeries] = useState<number|null>(null);
  const [dbActiveCategory, setDbActiveCategory] = useState<CategoryType>("oficial");

  const allFigures = (s: Series) => [...s.sets, ...(s.groups??[]).flatMap(g=>g.sets)].flatMap(st=>st.figures);
  const totalAll = data.flatMap(allFigures).length;
  const ownedAll = data.flatMap(allFigures).filter(f=>owned.has(f.id)).length;
  const seriesOwned = (s: Series) => allFigures(s).filter(f=>owned.has(f.id)).length;
  const seriesTotal = (s: Series) => allFigures(s).length;
  const catOwned = (cat: CategoryType) => data.filter(s=>s.category===cat).flatMap(allFigures).filter(f=>owned.has(f.id)).length;
  const catTotal = (cat: CategoryType) => data.filter(s=>s.category===cat).flatMap(allFigures).length;
  const dbFilteredSeries = data.filter(s=>s.category===dbActiveCategory);
  const dbSeriesObj = dbSelectedSeries ? data.find(s=>s.id===dbSelectedSeries)??null : null;

  type FlatFigure = { figure:Figure; set:FigureSet; series:Series; groupName?:string };
  const allFlat: FlatFigure[] = data.flatMap(series => [
    ...series.sets.flatMap(set => set.figures.map(figure => ({ figure, set, series }))),
    ...(series.groups??[]).flatMap(g => g.sets.flatMap(set => set.figures.map(figure => ({ figure, set, series, groupName: g.name }))))
  ]);

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
      const combined = `${figure.name} ${series.name} ${fset.name}`.toLowerCase();
      return words.every(w=>combined.includes(w));
    });

  const applySort = (items: FlatFigure[], sort: "alpha"|"date") =>
    [...items].sort((a,b) => sort==="date" ? (a.set.releaseDate??"").localeCompare(b.set.releaseDate??"") : a.figure.name.localeCompare(b.figure.name));

  const colOwned = applySort(
    applyFilters(allFlat, colSearch, colSeries, "all", "owned"), colSort
  );
  const colWishlist = applySort(
    applyFilters(allFlat, colSearch, colSeries, "all", "wishlist"), colSort
  );
  const dbFigures = applySort(applyFilters(allFlat, dbSearch, dbSeries, dbCategory, dbFilter), dbSort);
  const dbIsSearchMode = dbSearch.trim()!=="" || dbFilter!=="all" || dbSeries!=="all" || dbCategory!=="all";

  const sizeToColumns: Record<string,string> = { s:"repeat(auto-fill,minmax(90px,1fr))", m:"repeat(auto-fill,minmax(130px,1fr))", l:"repeat(auto-fill,minmax(180px,1fr))" };
  const selectStyle: React.CSSProperties = {height:32,padding:"0 8px",fontSize:12,border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,background:"rgba(255,255,255,0.12)",cursor:"pointer",color:"#fff"};
  const uniqSeries = data.filter((s,i,arr)=>arr.findIndex(x=>x.name===s.name)===i);

  const appContent = !ready ? (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:12,color:"var(--text3)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{fontSize:32}}>📦</div>
      <div style={{fontSize:14}}>{t("loading")}</div>
    </div>
  ) : (
    <div style={{fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",height:"100vh",color:"var(--text)",background:"var(--bg)"}}>

      {/* TOP BAR */}
      <div style={{borderBottom:"1px solid var(--border)",padding:"8px 12px",display:"flex",alignItems:"center",gap:8,background:"#0a5244",flexShrink:0}}>
        <span style={{fontWeight:700,fontSize:15,whiteSpace:"nowrap",color:"#fff"}}>{t("appTitle")}</span>
        <div style={{flex:1}} />
        <span style={{fontSize:11,color:"rgba(255,255,255,0.7)",whiteSpace:"nowrap"}}>{ownedAll}/{totalAll}</span>
        <div style={{width:60,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:(totalAll?Math.round(ownedAll/totalAll*100):0)+"%",background:"#0F6E56",borderRadius:4}} />
        </div>
        {/* Language dropdown */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowLangMenu(m=>!m)}
            style={{padding:"3px 7px",fontSize:11,border:"1px solid rgba(255,255,255,0.3)",borderRadius:6,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.9)",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
            <img src={LANGUAGES.find(l=>l.code===lang)?.flag} alt={lang} style={{width:14,height:10,objectFit:"cover",borderRadius:1}} />
            {lang.toUpperCase()} ▾
          </button>
          {showLangMenu && <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:200,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",overflow:"hidden",minWidth:120}}>
            {LANGUAGES.map(l=>(
              <div key={l.code} onClick={()=>{setLang(l.code);setShowLangMenu(false);}}
                style={{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:lang===l.code?"var(--bg2)":"transparent",color:"var(--text)",fontSize:13,fontWeight:lang===l.code?600:400}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                onMouseLeave={e=>e.currentTarget.style.background=lang===l.code?"var(--bg2)":"transparent"}>
                <img src={l.flag} alt={l.label} style={{width:20,height:14,objectFit:"cover",borderRadius:2}} />
                {l.code==="es"?"Español":l.code==="en"?"English":"ภาษาไทย"}
              </div>
            ))}
          </div>}
        </div>
        <button onClick={toggleDark} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}}>{dark?"☀️":"🌙"}</button>
        <button onClick={()=>{if(isAdmin){setIsAdmin(false);localStorage.removeItem("wcf_admin");}else setShowAdminPrompt(true);}}
          style={{background:isAdmin?"#fff":"rgba(255,255,255,0.1)",border:"1px solid "+(isAdmin?"#fff":"rgba(255,255,255,0.3)"),borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12,color:isAdmin?"#0a5244":"rgba(255,255,255,0.8)"}}>
          {isAdmin?"🔓":"🔒"}
        </button>
        {isAdmin && <button onClick={()=>setShowSettings(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:7,padding:"4px 7px",cursor:"pointer",fontSize:12}}>⚙️</button>}
      </div>

      {!apiKey && isAdmin && <div style={{background:"#fffbeb",borderBottom:"1px solid #fde68a",padding:"6px 12px",fontSize:11,color:"#92400e",flexShrink:0}}>
        ⚠️ {t("apiKeyWarning")} <strong style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setShowSettings(true)}>{t("settings")}</strong>
      </div>}

      {/* FILTER BAR */}
      <div style={{padding:"8px 12px",borderBottom:"1px solid var(--border)",background:"#0a5244",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
        <div style={{flex:1,minWidth:120,display:"flex",alignItems:"center",gap:6,border:"1px solid var(--border)",borderRadius:8,padding:"0 10px",height:32,background:"rgba(255,255,255,0.12)"}}>
          <span style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>🔍</span>
          <input value={activeTab==="collection"?colSearch:dbSearch}
            onChange={e=>activeTab==="collection"?setColSearch(e.target.value):setDbSearch(e.target.value)}
            placeholder={activeTab==="collection"?"Buscar en mi colección...":"Buscar en el catálogo..."}
            style={{flex:1,border:"none",background:"transparent",fontSize:12,outline:"none",color:"#fff"}} />
          {(activeTab==="collection"?colSearch:dbSearch) && <span onClick={()=>activeTab==="collection"?setColSearch(""):setDbSearch("")} style={{cursor:"pointer",color:"rgba(255,255,255,0.6)",fontSize:14}}>×</span>}
        </div>
        {activeTab==="collection" && <>
          <select value={colSeries} onChange={e=>setColSeries(e.target.value==="all"?"all":Number(e.target.value))} style={selectStyle}>
            <option value="all">{t("allSeries")}</option>
            {uniqSeries.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
          <select value={colSort} onChange={e=>setColSort(e.target.value as "alpha"|"date")} style={selectStyle}>
            <option value="alpha">A-Z</option>
            <option value="date">📅 Fecha</option>
          </select>
          <div style={{display:"flex",gap:2}}>
            {(["s","m","l"] as const).map(sz=>(
              <button key={sz} onClick={()=>setColSize(sz)} style={{width:28,height:32,border:"1px solid var(--border)",borderRadius:6,background:colSize===sz?"#fff":"rgba(255,255,255,0.12)",color:colSize===sz?"#0a5244":"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:10,fontWeight:600}}>{sz.toUpperCase()}</button>
            ))}
          </div>
        </>}
        {activeTab==="database" && <>
          <select value={dbCategory} onChange={e=>setDbCategory(e.target.value as typeof dbCategory)} style={selectStyle}>
            <option value="all">{t("allCategories")}</option>
            <option value="oficial">{t("officialBadge")}</option>
            <option value="resina">{t("resinBadge")}</option>
          </select>
          <select value={dbFilter} onChange={e=>setDbFilter(e.target.value as typeof dbFilter)} style={selectStyle}>
            <option value="all">Todas</option>
            <option value="owned">{t("owned")}</option>
            <option value="wishlist">{t("wishlist")}</option>
            <option value="missing">{t("missing")}</option>
          </select>
          <select value={dbSeries} onChange={e=>setDbSeries(e.target.value==="all"?"all":Number(e.target.value))} style={selectStyle}>
            <option value="all">{t("allSeries")}</option>
            {uniqSeries.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
          <select value={dbSort} onChange={e=>setDbSort(e.target.value as "alpha"|"date")} style={selectStyle}>
            <option value="alpha">A-Z</option>
            <option value="date">📅 Fecha</option>
          </select>
          <div style={{display:"flex",gap:2}}>
            {(["s","m","l"] as const).map(sz=>(
              <button key={sz} onClick={()=>setDbSize(sz)} style={{width:28,height:32,border:"1px solid var(--border)",borderRadius:6,background:dbSize===sz?"#fff":"rgba(255,255,255,0.12)",color:dbSize===sz?"#0a5244":"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:10,fontWeight:600}}>{sz.toUpperCase()}</button>
            ))}
          </div>
        </>}
      </div>

      {/* MAIN CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",paddingBottom:70}}>

        {/* ── COLLECTION TAB ── */}
        {activeTab==="collection" && (
          <div>
            {/* Owned section */}
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:8,borderBottom:"2px solid #0F6E56"}}>
                <span style={{fontSize:16}}>✅</span>
                <span style={{fontSize:15,fontWeight:700,color:"var(--text)"}}>{t("owned")}</span>
                <span style={{fontSize:12,color:"var(--text3)",background:"var(--bg2)",padding:"2px 8px",borderRadius:10}}>{colOwned.length}</span>
              </div>
              {colOwned.length===0 ? (
                <div style={{textAlign:"center",padding:"2rem",color:"var(--text4)",fontSize:13}}>Aún no has marcado ninguna figura.</div>
              ) : (
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                  {colOwned.map(({figure,set,series,groupName})=>(
                    <div key={figure.id} style={{flexShrink:0,width:colSize==="s"?80:colSize==="m"?110:150,scrollSnapAlign:"start"}}>
                      <SearchResultCard figure={figure} series={series} set={set} groupName={groupName}
                        isOwned={true} isWished={false} compact
                        onToggle={()=>toggle(figure.id)} onToggleWish={()=>toggleWish(figure.id)} />
                    </div>
                  ))}
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
                <div style={{textAlign:"center",padding:"2rem",color:"var(--text4)",fontSize:13}}>Tu wishlist está vacía.</div>
              ) : (
                <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                  {colWishlist.map(({figure,set,series,groupName})=>(
                    <div key={figure.id} style={{flexShrink:0,width:colSize==="s"?80:colSize==="m"?110:150,scrollSnapAlign:"start"}}>
                      <SearchResultCard figure={figure} series={series} set={set} groupName={groupName}
                        isOwned={false} isWished={true} compact
                        onToggle={()=>toggle(figure.id)} onToggleWish={()=>toggleWish(figure.id)} />
                    </div>
                  ))}
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
                      onToggle={()=>toggle(figure.id)} onToggleWish={()=>toggleWish(figure.id)} />
                  ))}
                </div>
              </div>
            )
          ) : dbSeriesObj ? (
            // Series detail
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                <button onClick={()=>setDbSelectedSeries(null)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--text)"}}>← Volver</button>
                {dbSeriesObj.logoHeader ? <img src={dbSeriesObj.logoHeader} alt={dbSeriesObj.name} style={{height:32,maxWidth:140,objectFit:"contain"}} /> : <span style={{fontSize:16,fontWeight:700}}>{dbSeriesObj.emoji} {dbSeriesObj.name}</span>}
                {isAdmin && <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  <Btn small onClick={()=>addGroup(dbSeriesObj.id)} variant="primary">+ Grupo</Btn>
                  <Btn small onClick={()=>addSet(dbSeriesObj.id)} variant="primary">{t("newSet")}</Btn>
                  <Btn small onClick={()=>setEditSeriesData(dbSeriesObj)}>✏️</Btn>
                  <Btn small onClick={()=>{deleteSeries(dbSeriesObj.id);setDbSelectedSeries(null);}} variant="danger">🗑</Btn>
                </div>}
              </div>
              <ProgressBar value={seriesOwned(dbSeriesObj)} total={seriesTotal(dbSeriesObj)} color={dbSeriesObj.color} />
              <div style={{marginBottom:16}} />
              {dbSeriesObj.groups && dbSeriesObj.groups.length>0 && (
                <DraggableGroupList
                  groups={dbSeriesObj.groups} color={dbSeriesObj.color} owned={owned} wishlist={wishlist} apiKey={apiKey}
                  onToggle={toggle} onToggleWish={toggleWish}
                  onToggleAll={(ids,markAs)=>ids.forEach(id=>{if(markAs!==owned.has(id))toggle(id);})}
                  onUpdateGroup={(gid,n,l)=>updateGroup(dbSeriesObj.id,gid,n,l)}
                  onDeleteGroup={gid=>deleteGroup(dbSeriesObj.id,gid)}
                  onAddSet={gid=>addSet(dbSeriesObj.id,gid)}
                  onUpdateSet={(gid,stid,n,rd,sl)=>updateSet(dbSeriesObj.id,stid,n,rd,sl,gid)}
                  onDeleteSet={(gid,stid)=>deleteSet(dbSeriesObj.id,stid,gid)}
                  onDuplicateSet={(gid,stid)=>duplicateSet(dbSeriesObj.id,stid,gid)}
                  onAddFigure={(gid,stid,f)=>addFigure(dbSeriesObj.id,stid,f,gid)}
                  onUpdateFigure={(gid,stid,fid,f)=>updateFigure(dbSeriesObj.id,stid,fid,f,gid)}
                  onDeleteFigure={(gid,stid,fid)=>deleteFigure(dbSeriesObj.id,stid,fid,gid)}
                  onReorderSets={(gid,from,to)=>reorderSets(dbSeriesObj.id,from,to,gid)}
                  onReorderGroups={(from,to)=>reorderGroups(dbSeriesObj.id,from,to)}
                />
              )}
              {dbSeriesObj.sets.length>0 && (
                <DraggableSetList
                  sets={dbSeriesObj.sets} color={dbSeriesObj.color} owned={owned} wishlist={wishlist} apiKey={apiKey}
                  onToggle={toggle} onToggleWish={toggleWish}
                  onToggleAll={(ids,markAs)=>ids.forEach(id=>{if(markAs!==owned.has(id))toggle(id);})}
                  onUpdateSet={(stid,n,rd,sl)=>updateSet(dbSeriesObj.id,stid,n,rd,sl)}
                  onDeleteSet={stid=>deleteSet(dbSeriesObj.id,stid)}
                  onDuplicate={stid=>duplicateSet(dbSeriesObj.id,stid)}
                  onMoveToGroup={(stid,gid)=>moveSetToGroup(dbSeriesObj.id,stid,gid)}
                  groups={dbSeriesObj.groups}
                  onAddFigure={(stid,f)=>addFigure(dbSeriesObj.id,stid,f)}
                  onUpdateFigure={(stid,fid,f)=>updateFigure(dbSeriesObj.id,stid,fid,f)}
                  onDeleteFigure={(stid,fid)=>deleteFigure(dbSeriesObj.id,stid,fid)}
                  onReorder={(from,to)=>reorderSets(dbSeriesObj.id,from,to)}
                />
              )}
              {dbSeriesObj.sets.length===0 && (!dbSeriesObj.groups||dbSeriesObj.groups.length===0) && (
                <div style={{textAlign:"center",padding:"3rem",color:"var(--text4)",fontSize:14}}>{t("noSets1")}<br/>{t("noSets2")}</div>
              )}
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
              <DraggableSeriesList
                key={reorderKey}
                series={dbFilteredSeries}
                seriesOwned={seriesOwned}
                seriesTotal={seriesTotal}
                dragLocked={dragLocked}
                onSelect={setDbSelectedSeries}
                onReorder={reorderSeries}
              />
              {dbFilteredSeries.length===0 && <div style={{textAlign:"center",padding:"3rem",color:"var(--text4)",fontSize:14}}>{t("noSeriesCat1")}</div>}
            </>
          )
        )}
      </div>

      {/* BOTTOM TABS */}
      <div style={{display:"flex",borderTop:"1px solid var(--border)",background:"#0a5244",flexShrink:0,position:"sticky",bottom:0}}>
        {([["collection","📦","Colección"],["database","🗃️","Database"]] as [TabType,string,string][]).map(([tab,icon,label])=>(
          <button key={tab} onClick={()=>setActiveTab(tab as TabType)}
            style={{flex:1,padding:"10px 8px 8px",fontSize:11,fontWeight:500,border:"none",background:"transparent",cursor:"pointer",color:activeTab===tab?"#fff":"rgba(255,255,255,0.5)",borderTop:activeTab===tab?"2px solid #fff":"2px solid transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:20}}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* MODALS */}
      {showAddSeries && <SeriesModal category={dbActiveCategory} apiKey={apiKey} onSave={(p1,p2,p3,p4,p5)=>{addSeries(p1,p2,p3,p4,p5);setShowAddSeries(false);}} onClose={()=>setShowAddSeries(false)} />}
      {editSeriesData && <SeriesModal category={editSeriesData.category} initial={editSeriesData} apiKey={apiKey} onSave={(p1,p2,p3,p4,p5)=>{updateSeries(editSeriesData.id,p1,p2,p3,p4,p5);setEditSeriesData(null);}} onClose={()=>setEditSeriesData(null)} />}
      {showSettings && <SettingsModal apiKey={apiKey} currentBanner={appLogo} onSave={(p1,p2)=>{ saveApiKey(p1); saveAppLogo(p2); }} onClose={()=>setShowSettings(false)} />}
    </div>
  );

  return (
    <LangProvider value={langValue}>
      <AdminCtx.Provider value={isAdmin}>
        {appContent}
        {showAdminPrompt && <AdminPrompt onSuccess={()=>{setIsAdmin(true);localStorage.setItem("wcf_admin","true");}} onClose={()=>setShowAdminPrompt(false)} />}
      </AdminCtx.Provider>
    </LangProvider>
  );
}

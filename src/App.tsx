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
    sbGet("wcf_owned").then(row => {
      if (row) { setOwned(new Set(row.owned ?? [])); setWishlist(new Set(row.wishlist ?? [])); setImgbbKeyState(row.imgbb_key ?? ""); setAppLogoState(row.app_logo ?? ""); }
      setReady(true);
    });
  }, []);
  const save = (o: Set<number>, w: Set<number>, key?: string, logo?: string) =>
    sbUpsert("wcf_owned", { owned: [...o], wishlist: [...w], imgbb_key: key ?? imgbbKey, app_logo: logo ?? appLogo });
  const toggle = (id: number) => setOwned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); save(n, wishlist); return n; });
  const toggleWish = (id: number) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); save(owned, n); return n; });
  const saveImgbbKey = (key: string) => { setImgbbKeyState(key); save(owned, wishlist, key); };
  const saveAppLogo = (logo: string) => { setAppLogoState(logo); save(owned, wishlist, undefined, logo); };
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
    // Output matches crop box proportions, max 600px on longest side
    const maxOut = 600;
    const outW = cropBox.w >= cropBox.h ? maxOut : Math.round(maxOut * cropBox.w / cropBox.h);
    const outH = cropBox.h > cropBox.w ? maxOut : Math.round(maxOut * cropBox.h / cropBox.w);
    const canvas = canvasRef.current;
    canvas.width = outW; canvas.height = outH;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
    const scaleW = outW / cropBox.w;
    const scaleH = outH / cropBox.h;
    const destX = (imgPos.x - cropBox.x) * scaleW;
    const destY = (imgPos.y - cropBox.y) * scaleH;
    const destW = imgW * scaleW;
    const destH = imgH * scaleH;
    ctx.drawImage(img, destX, destY, destW, destH);
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
  const [imgError,setImgError]=useState(false); const [hover,setHover]=useState(false);
  const hasImage = !!figure.image && !imgError;
  const statusText = isOwned ? t("owned") : isWished ? t("inWishlist") : t("missing");
  const statusColor = isOwned ? color : isWished ? "#d97706" : "#aaa";
  const dotColor = isOwned ? color : isWished ? "#f59e0b" : "#ccc";
  return (
    <div style={{border:"1px solid "+(isOwned?color:isWished?"#f59e0b":"#e8e8e4"),borderRadius:10,background:isOwned?color+"18":isWished?"#fffbeb":"#fff",overflow:"hidden",position:"relative",transition:"transform 0.15s"}}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {hover && <div style={{position:"absolute",top:4,left:4,zIndex:3,display:"flex",gap:4}}>
        <button onClick={e=>{e.stopPropagation();onEdit();}} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>✏️</button>
        <button onClick={e=>{e.stopPropagation();onDelete();}} style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>🗑</button>
        {!isOwned && <button onClick={e=>{e.stopPropagation();onToggleWish();}} style={{background:isWished?"#fef3c7":"#fff",border:"1px solid "+(isWished?"#fcd34d":"#e8e8e4"),borderRadius:6,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>{isWished?"💛":"🤍"}</button>}
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
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",position:"relative"}}>
          <Btn small onClick={()=>setAddFigure(true)} variant="primary">{t("addFigure")}</Btn>
          <Btn small onClick={()=>setBulkAdd(true)} variant="primary">➕ Añadir varias</Btn>
          <Btn small onClick={()=>setEditSet(true)}>{t("editSetBtn")}</Btn>
          <Btn small onClick={onDuplicate}>📋 Duplicar</Btn>
          {onMoveToGroup && groups && groups.length > 0 && (
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
        </div>
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
function SearchResultCard({ figure, series, set, isOwned, onToggle }: { figure:Figure; series:Series; set:FigureSet; isOwned:boolean; onToggle:()=>void }) {
  const { t, lang } = useTr();
  const [imgError,setImgError]=useState(false); const hasImage = !!figure.image && !imgError;
  const formatDate = (d?: string) => { if (!d) return null; const [y, m] = d.split("-"); return `${T.months[lang][parseInt(m)-1]} ${y}`; };
  return (
    <div onClick={onToggle} style={{border:"1px solid "+(isOwned?series.color:"var(--border)"),borderRadius:10,background:isOwned?series.color+"18":"var(--card-bg)",overflow:"hidden",cursor:"pointer",transition:"transform 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
      <div style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:isOwned?series.color+"30":"var(--missing-bg)",overflow:"hidden",position:"relative",opacity:isOwned?1:0.45,transition:"opacity 0.3s"}}>
        {isOwned && <div style={{position:"absolute",top:6,right:6,zIndex:2,width:20,height:20,borderRadius:"50%",background:series.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>✓</div>}
        {hasImage ? <img src={figure.image} alt={figure.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover"}} />
          : <div style={{textAlign:"center"}}><div style={{fontSize:34}}>{figure.emoji}</div></div>}
      </div>
      <div style={{padding:"8px 10px 10px"}}>
        <div style={{fontSize:11,color:"var(--text4)",marginBottom:2}}>{series.emoji} {series.name}</div>
        <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,marginBottom:3}}>{figure.name}</div>
        <div style={{fontSize:11,color:"var(--text4)",marginBottom:2}}>{set.name}</div>
        {set.releaseDate && <div style={{fontSize:11,color:"var(--text4)",marginBottom:4}}>📅 {formatDate(set.releaseDate)}</div>}
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:isOwned?series.color:"var(--text4)",fontWeight:isOwned?600:400}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:isOwned?series.color:"#ccc",flexShrink:0}} />
          {isOwned ? t("owned") : t("missing")}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  SEARCH RESULTS
// ============================================================
function SearchResults({ query, filterCat, filterSeriesId, data, owned, onToggle }: {
  query:string; filterCat:"all"|CategoryType; filterSeriesId:number|"all"; data:Series[]; owned:Set<number>; onToggle:(id:number)=>void;
}) {
  const { t } = useTr();
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);
  const matches = (text: string) => words.every(w => text.includes(w));
  const results: { figure:Figure; series:Series; set:FigureSet }[] = [];
  data.forEach(series => {
    if (filterCat !== "all" && series.category !== filterCat) return;
    if (filterSeriesId !== "all" && series.id !== filterSeriesId) {
      // Also match other series with the same name (e.g. oficial + resina)
      const selectedSeries = data.find(s=>s.id===filterSeriesId);
      if (!selectedSeries || series.name !== selectedSeries.name) return;
    }
    const allSets = [...series.sets, ...(series.groups??[]).flatMap(g=>g.sets)];
    allSets.forEach(set => set.figures.forEach(figure => {
      const combined = `${figure.name} ${series.name} ${set.name}`.toLowerCase();
      if (!q || matches(combined))
        results.push({ figure, series, set });
    }));
  });
  if (results.length === 0) return <div style={{textAlign:"center",padding:"3rem 1rem",color:"var(--text4)",fontSize:14}}>{t("noResults")}</div>;
  return (
    <div>
      <div style={{fontSize:13,color:"var(--text3)",marginBottom:16}}>{t("resultsCount", results.length)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",gap:12}}>
        {results.map(({ figure, series, set }) => (
          <SearchResultCard key={figure.id} figure={figure} series={series} set={set} isOwned={owned.has(figure.id)} onToggle={()=>onToggle(figure.id)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  WISHLIST CARD
// ============================================================
function WishlistCard({ figure, set, onToggle, onToggleWish }: { figure:Figure; set:FigureSet; onToggle:()=>void; onToggleWish:()=>void }) {
  const { t } = useTr();
  const [imgError,setImgError]=useState(false); const hasImage = !!figure.image && !imgError;
  return (
    <div style={{border:"1px solid #f59e0b",borderRadius:10,background:"#fffbeb",overflow:"hidden",position:"relative"}}>
      <button onClick={onToggleWish} style={{position:"absolute",top:6,right:6,zIndex:2,background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:6,padding:"2px 6px",fontSize:12,cursor:"pointer"}}>💛</button>
      <div onClick={onToggle} style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:"#fef9c3",overflow:"hidden",cursor:"pointer"}}>
        {hasImage ? <img src={figure.image} alt={figure.name} onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover"}} />
          : <div style={{textAlign:"center"}}><div style={{fontSize:34}}>{figure.emoji}</div></div>}
      </div>
      <div style={{padding:"8px 10px 10px"}}>
        <div style={{fontSize:11,color:"var(--text4)",marginBottom:2}}>{set.name}</div>
        <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,marginBottom:5}}>{figure.name}</div>
        <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#d97706",fontWeight:600,cursor:"pointer"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#f59e0b",flexShrink:0}} />{t("tapToOwn")}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  WISHLIST SECTION
// ============================================================
function WishlistSection({ data, wishlist, owned, onToggle, onToggleWish }: { data:Series[]; wishlist:Set<number>; owned:Set<number>; onToggle:(id:number)=>void; onToggleWish:(id:number)=>void }) {
  const { t } = useTr();
  const groups: { series:Series; figures:{ figure:Figure; set:FigureSet }[] }[] = [];
  data.forEach(series => {
    const items: { figure:Figure; set:FigureSet }[] = [];
    const allSets = [...series.sets, ...(series.groups??[]).flatMap(g=>g.sets)];
    allSets.forEach(set => set.figures.forEach(figure => { if (wishlist.has(figure.id) && !owned.has(figure.id)) items.push({ figure, set }); }));
    if (items.length > 0) groups.push({ series, figures: items });
  });
  if (groups.length === 0) return (
    <div style={{textAlign:"center",padding:"4rem 1rem"}}>
      <div style={{fontSize:40,marginBottom:12}}>💛</div>
      <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:6}}>{t("wishlistEmpty")}</div>
      <div style={{fontSize:13,color:"var(--text4)"}}>{t("wishlistHint")}</div>
    </div>
  );
  const total = groups.reduce((acc,g)=>acc+g.figures.length,0);
  return (
    <div>
      <div style={{fontSize:13,color:"var(--text3)",marginBottom:20}}>{t("wishlistCount", total)}</div>
      {groups.map(({ series, figures }) => (
        <div key={series.id} style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            {series.logo ? <img src={series.logo} alt={series.name} style={{width:22,height:22,borderRadius:4,objectFit:"contain"}} /> : <span style={{fontSize:16}}>{series.emoji}</span>}
            <span style={{fontSize:15,fontWeight:600}}>{series.name}</span>
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:12,background:series.category==="oficial"?"#E1F5EE":"#ede9fe",color:series.category==="oficial"?"#0F6E56":"#7c3aed",fontWeight:600}}>
              {series.category==="oficial" ? t("officialBadge") : t("resinBadge")}
            </span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",gap:10}}>
            {figures.map(({ figure, set }) => <WishlistCard key={figure.id} figure={figure} set={set} onToggle={()=>onToggle(figure.id)} onToggleWish={()=>onToggleWish(figure.id)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}


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
          <button onClick={()=>setEditGroup(true)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 7px",fontSize:11,cursor:"pointer",color:"var(--text3)"}}>✏️</button>
          <button onClick={onAddSet} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"2px 7px",fontSize:11,cursor:"pointer",color:"var(--text3)"}}>+ Set</button>
          <button onClick={onDeleteGroup} style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"2px 7px",fontSize:11,cursor:"pointer",color:"#dc2626"}}>🗑</button>
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

  const handleDragStart = (idx:number) => { dragIdx.current=idx; };
  const handleDragOver = (e:React.DragEvent, idx:number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx:number) => { if(dragIdx.current!==null && dragIdx.current!==idx) onReorderGroups(dragIdx.current,idx); dragIdx.current=null; setDragOver(null); };
  const handleDragEnd = () => { dragIdx.current=null; setDragOver(null); };

  return (
    <div>
      {groups.map((g, idx) => (
        <div key={g.id}
          draggable
          onDragStart={()=>handleDragStart(idx)}
          onDragOver={e=>handleDragOver(e,idx)}
          onDrop={()=>handleDrop(idx)}
          onDragEnd={handleDragEnd}
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

  const handleDragStart = (idx: number) => { dragIdx.current = idx; };
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx: number) => {
    if (dragIdx.current !== null && dragIdx.current !== idx) onReorder(dragIdx.current, idx);
    dragIdx.current = null; setDragOver(null);
  };
  const handleDragEnd = () => { dragIdx.current = null; setDragOver(null); };

  const handleTouchStart = (e: React.TouchEvent, idx: number) => {
    touchDragIdx.current = idx; touchY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchDragIdx.current === null) return;
    const touch = e.changedTouches[0];
    const els = document.elementsFromPoint(touch.clientX, touch.clientY);
    const target = els.find(el => el.hasAttribute("data-setidx"));
    if (target) {
      const toIdx = parseInt(target.getAttribute("data-setidx")!);
      if (toIdx !== touchDragIdx.current) onReorder(touchDragIdx.current, toIdx);
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
function DraggableSeriesList({ series, effectiveSelected, showWishlist, seriesOwned, seriesTotal, onSelect, onReorder }: {
  series: Series[]; effectiveSelected: number|null; showWishlist: boolean;
  seriesOwned:(s:Series)=>number; seriesTotal:(s:Series)=>number;
  onSelect:(sid:number)=>void; onReorder:(from:number,to:number)=>void;
}) {
  const dragIdx = useRef<number|null>(null);
  const [dragOver, setDragOver] = useState<number|null>(null);
  const touchDragIdx = useRef<number|null>(null);

  const handleDragStart = (idx:number) => { dragIdx.current=idx; };
  const handleDragOver = (e:React.DragEvent, idx:number) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx:number) => { if(dragIdx.current!==null && dragIdx.current!==idx) onReorder(dragIdx.current,idx); dragIdx.current=null; setDragOver(null); };
  const handleDragEnd = () => { dragIdx.current=null; setDragOver(null); };
  const handleTouchStart = (_e:React.TouchEvent, idx:number) => { touchDragIdx.current=idx; };
  const handleTouchEnd = (e:React.TouchEvent) => {
    if(touchDragIdx.current===null) return;
    const t=e.changedTouches[0];
    const els=document.elementsFromPoint(t.clientX,t.clientY);
    const target=els.find(el=>el.hasAttribute("data-seriesidx"));
    if(target){ const toIdx=parseInt(target.getAttribute("data-seriesidx")!); if(toIdx!==touchDragIdx.current) onReorder(touchDragIdx.current,toIdx); }
    touchDragIdx.current=null; setDragOver(null);
  };

  return (
    <div>
      {series.map((s, idx) => {
        const active = s.id===effectiveSelected && !showWishlist;
        return (
          <div key={s.id}
            data-seriesidx={idx}
            draggable
            onDragStart={()=>handleDragStart(idx)}
            onDragOver={e=>handleDragOver(e,idx)}
            onDrop={()=>handleDrop(idx)}
            onDragEnd={handleDragEnd}
            onTouchStart={e=>handleTouchStart(e,idx)}
            onTouchEnd={handleTouchEnd}
            onClick={()=>onSelect(s.id)}
            style={{cursor:"grab",borderRight:active?"2px solid "+s.color:"2px solid transparent",position:"relative",overflow:"hidden",opacity:dragIdx.current===idx?0.4:1,outline:dragOver===idx?"2px solid "+s.color:"none",transition:"opacity 0.15s,outline 0.1s"}}>
            {/* Background image — higher opacity when active */}
            {s.bgImage && <img src={s.bgImage} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"right center",opacity:active?0.5:0.2,transition:"opacity 0.3s",pointerEvents:"none"}} />}
            <div style={{position:"relative",padding:"8px 12px",background:active?"rgba(0,0,0,0.08)":"transparent"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                {!s.bgImage && (s.logo ? <img src={s.logo} alt={s.name} style={{width:22,height:22,borderRadius:4,objectFit:"contain",flexShrink:0}} /> : <span style={{fontSize:15}}>{s.emoji}</span>)}
                <span style={{fontSize:13,fontWeight:active?600:400,color:active?"var(--text)":"var(--text2)"}}>{s.name}</span>
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
export default function App() {
  const { owned, toggle, wishlist, toggleWish, imgbbKey, saveImgbbKey, appLogo, saveAppLogo, ready: ownedReady } = useOwned();
  const { data, setData, ready: dataReady } = useData();
  const { lang, setLang, t } = useLang();
  const { dark, toggleDark } = useDarkMode();
  const ready = ownedReady && dataReady;

  const [activeCategory, setActiveCategory] = useState<CategoryType>("oficial");
  const [selectedSeries, setSelectedSeries] = useState<number|null>(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [editSeriesData, setEditSeriesData] = useState<Series|null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const apiKey = imgbbKey; const saveApiKey = saveImgbbKey;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [filterCat, setFilterCat] = useState<"all"|CategoryType>("all");
  const [filterSeriesId, setFilterSeriesId] = useState<number|"all">("all");

  const filteredSeries = data.filter(s => s.category === activeCategory);
  const effectiveSelected = selectedSeries && filteredSeries.find(s=>s.id===selectedSeries) ? selectedSeries : filteredSeries[0]?.id ?? null;
  const series = effectiveSelected ? data.find(s=>s.id===effectiveSelected) ?? null : null;
  const isSearchMode = searchActive && (searchQuery.trim() !== "" || filterCat !== "all" || filterSeriesId !== "all");

  const allFigures = (s: Series) => [...s.sets, ...(s.groups??[]).flatMap(g=>g.sets)].flatMap(st=>st.figures);
  const seriesOwned = (s: Series) => allFigures(s).filter(f=>owned.has(f.id)).length;
  const seriesTotal = (s: Series) => allFigures(s).length;
  const catOwned = (cat: CategoryType) => data.filter(s=>s.category===cat).flatMap(allFigures).filter(f=>owned.has(f.id)).length;
  const catTotal = (cat: CategoryType) => data.filter(s=>s.category===cat).flatMap(allFigures).length;
  const totalAll = data.flatMap(allFigures).length;
  const ownedAll = data.flatMap(allFigures).filter(f=>owned.has(f.id)).length;
  const wishlistCount = data.flatMap(allFigures).filter(f=>wishlist.has(f.id)&&!owned.has(f.id)).length;

  const addSeries = (name:string,emoji:string,color:string,logoHeader:string,bgImage:string) => { const s:Series={id:newId(),name,emoji,logoHeader,bgImage,color,category:activeCategory,sets:[],groups:[]}; setData(d=>[...d,s]); setSelectedSeries(s.id); };
  const reorderSeries = (fromIdx:number, toIdx:number) => setData(d=>{ const all=[...d]; const cats=all.filter(s=>s.category===activeCategory); const others=all.filter(s=>s.category!==activeCategory); const [moved]=cats.splice(fromIdx,1); cats.splice(toIdx,0,moved); return [...others,...cats]; });
  const updateSeries = (sid:number,name:string,emoji:string,color:string,logoHeader:string,bgImage:string) => setData(d=>d.map(s=>s.id===sid?{...s,name,emoji,color,logoHeader,bgImage}:s));
  const deleteSeries = (sid:number) => { setData(d=>d.filter(s=>s.id!==sid)); setSelectedSeries(filteredSeries.filter(s=>s.id!==sid)[0]?.id??null); };
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

  const langValue = { t, lang };

  const appContent = !ready ? (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:12,color:"var(--text3)",fontFamily:"system-ui,sans-serif"}}>
        <div style={{fontSize:32}}>📦</div>
        <div style={{fontSize:14}}>{t("loading")}</div>
      </div>
  ) : (
    <div style={{fontFamily:"system-ui, sans-serif",display:"flex",flexDirection:"column",minHeight:"100vh",color:"var(--text)",background:"var(--bg)"}}>

      {/* BANNER — se desplaza con la página */}
      {appLogo && (
        <div style={{width:"100%",height:120,overflow:"hidden",background:"var(--bg3)",flexShrink:0}}>
          <img src={appLogo} alt="banner" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} />
        </div>
      )}

      {/* TOP BAR — sticky, siempre visible */}
      <div style={{position:"sticky",top:0,zIndex:50,borderBottom:"1px solid var(--border)",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,background:"var(--bg)",flexShrink:0}}>
        {!appLogo && <span style={{fontWeight:700,fontSize:15,whiteSpace:"nowrap"}}>{t("appTitle")}</span>}
        <div style={{flex:1,display:"flex",alignItems:"center",gap:6,border:"1px solid var(--border)",borderRadius:8,padding:"0 10px",height:34,background:"var(--bg2)"}}>
          <span style={{color:"var(--text4)",fontSize:14}}>🔍</span>
          <input value={searchQuery} onChange={e=>{setSearchQuery(e.target.value);setSearchActive(true);}} onFocus={()=>setSearchActive(true)}
            placeholder={t("searchPH")} style={{flex:1,border:"none",background:"transparent",fontSize:13,outline:"none",color:"var(--text)"}} />
          {(searchQuery||searchActive) && <span onClick={()=>{setSearchQuery("");setSearchActive(false);setFilterCat("all");setFilterSeriesId("all");}} style={{cursor:"pointer",color:"var(--text4)",fontSize:16,lineHeight:1}}>×</span>}
        </div>
        {searchActive && <>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value as "all"|CategoryType)} style={{height:34,padding:"0 8px",fontSize:12,border:"1px solid var(--border)",borderRadius:8,background:"var(--bg)",cursor:"pointer"}}>
            <option value="all">{t("allCategories")}</option>
            <option value="oficial">{t("officialBadge")}</option>
            <option value="resina">{t("resinBadge")}</option>
          </select>
          <select value={filterSeriesId} onChange={e=>setFilterSeriesId(e.target.value==="all"?"all":Number(e.target.value))} style={{height:34,padding:"0 8px",fontSize:12,border:"1px solid var(--border)",borderRadius:8,background:"var(--bg)",cursor:"pointer"}}>
            <option value="all">{t("allSeries")}</option>
            {data.filter((s,i,arr)=>arr.findIndex(x=>x.name===s.name)===i).map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
        </>}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <span style={{fontSize:12,color:"var(--text3)",whiteSpace:"nowrap"}}>{ownedAll}/{totalAll}</span>
          <div style={{width:70,height:5,background:"#e8e8e4",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:(totalAll?Math.round(ownedAll/totalAll*100):0)+"%",background:"#0F6E56",borderRadius:4,transition:"width 0.4s"}} />
          </div>
          <div style={{display:"flex",gap:2}}>
            {LANGUAGES.map(l=>(
              <button key={l.code} onClick={()=>setLang(l.code)}
                style={{padding:"4px 7px",fontSize:11,border:"1px solid "+(lang===l.code?"#1a1a1a":"#e8e8e4"),borderRadius:6,background:lang===l.code?"#1a1a1a":"transparent",color:lang===l.code?"#fff":"#888",cursor:"pointer",fontWeight:lang===l.code?600:400,display:"flex",alignItems:"center",gap:4}}>
                <img src={l.flag} alt={l.label} style={{width:16,height:11,objectFit:"cover",borderRadius:2}} />
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={toggleDark} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:13}} title={dark?"Modo claro":"Modo oscuro"}>
            {dark ? "☀️" : "🌙"}
          </button>
          <button onClick={()=>setShowSettings(true)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:13}}>⚙️</button>
        </div>
      </div>

      {!apiKey && <div style={{background:"#fffbeb",borderBottom:"1px solid #fde68a",padding:"8px 16px",fontSize:12,color:"#92400e"}}>
        ⚠️ {t("apiKeyWarning")} <strong style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setShowSettings(true)}>{t("settings")}</strong>
      </div>}

      <div style={{display:"flex",flex:1}}>
        {/* SIDEBAR — sticky, se queda fija al hacer scroll */}
        <div style={{width:210,borderRight:"1px solid var(--border)",background:"var(--bg2)",flexShrink:0,display:"flex",flexDirection:"column",position:"sticky",top:57,height:"calc(100vh - 57px)",overflowY:"auto"}}>
          <div style={{padding:"10px 10px 8px",borderBottom:"1px solid var(--border)"}}>
            {(["oficial","resina"] as CategoryType[]).map(cat=>{
              const active = cat===activeCategory && !isSearchMode;
              return (
                <div key={cat} onClick={()=>{setActiveCategory(cat);setSearchActive(false);setSearchQuery("");setFilterCat("all");setFilterSeriesId("all");setSelectedSeries(data.filter(s=>s.category===cat)[0]?.id??null);setShowWishlist(false);}}
                  style={{padding:"8px 10px",borderRadius:8,cursor:"pointer",marginBottom:4,background:active?"var(--bg)":"transparent",border:active?"1px solid var(--border)":"1px solid transparent"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:active?600:400,color:active?"#1a1a1a":"#666"}}>{cat==="oficial" ? t("official") : t("resin")}</span>
                    <span style={{fontSize:11,color:"var(--text4)"}}>{catOwned(cat)}/{catTotal(cat)}</span>
                  </div>
                  <ProgressBar value={catOwned(cat)} total={catTotal(cat)} color={cat==="oficial"?"#0F6E56":"#8b5cf6"} />
                </div>
              );
            })}
          </div>
          {!isSearchMode && <>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text4)",padding:"10px 16px 6px",textTransform:"uppercase",letterSpacing:"0.08em"}}>{t("seriesLabel")}</div>
            <div style={{flex:1,overflowY:"auto"}}>
              {filteredSeries.length===0 && <div style={{padding:"12px 16px",fontSize:13,color:"var(--text4)"}}>{t("noSeries")}</div>}
              <DraggableSeriesList
                series={filteredSeries}
                effectiveSelected={effectiveSelected}
                showWishlist={showWishlist}
                seriesOwned={seriesOwned}
                seriesTotal={seriesTotal}
                onSelect={(sid)=>{setSelectedSeries(sid);setShowWishlist(false);}}
                onReorder={reorderSeries}
              />
            </div>
            <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:8}}>
              <div onClick={()=>{setShowWishlist(true);setSearchActive(false);setSearchQuery("");}}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:showWishlist?"#fef3c7":"transparent",border:showWishlist?"1px solid #fcd34d":"1px solid transparent"}}>
                <span style={{fontSize:16}}>💛</span>
                <span style={{fontSize:13,fontWeight:showWishlist?600:400,color:showWishlist?"#92400e":"#555",flex:1}}>{t("wishlist")}</span>
                {wishlistCount > 0 && <span style={{fontSize:11,background:"#f59e0b",color:"#fff",borderRadius:10,padding:"1px 7px",fontWeight:600}}>{wishlistCount}</span>}
              </div>
              <Btn onClick={()=>setShowAddSeries(true)} variant="primary" small>{t("newSeries")}</Btn>
            </div>
          </>}
        </div>

        {/* MAIN */}
        <div style={{flex:1,padding:"20px 24px",overflowY:"auto",position:"relative"}}>
          <div style={{position:"relative",zIndex:1}}>
          {isSearchMode && (
            <div>
              <div style={{marginBottom:16}}><span style={{fontSize:18,fontWeight:600}}>{t("searchResults")}</span></div>
              <SearchResults query={searchQuery} filterCat={filterCat} filterSeriesId={filterSeriesId} data={data} owned={owned} onToggle={toggle} />
            </div>
          )}
          {!isSearchMode && showWishlist && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <span style={{fontSize:24}}>💛</span>
                <span style={{fontSize:20,fontWeight:600}}>{t("wishlist")}</span>
              </div>
              <WishlistSection data={data} wishlist={wishlist} owned={owned} onToggle={toggle} onToggleWish={toggleWish} />
            </div>
          )}
          {!isSearchMode && !showWishlist && series && (
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                {series.logoHeader ? <img src={series.logoHeader} alt={series.name} style={{height:44,maxWidth:200,objectFit:"contain",flexShrink:0}} />
                  : series.logo ? <img src={series.logo} alt={series.name} style={{width:40,height:40,borderRadius:8,objectFit:"contain",flexShrink:0}} />
                  : <span style={{fontSize:32}}>{series.emoji}</span>}
                {!series.logoHeader && <span style={{fontSize:20,fontWeight:600}}>{series.name}</span>}
                <span style={{fontSize:11,padding:"2px 8px",borderRadius:12,background:series.category==="oficial"?"#E1F5EE":"#ede9fe",color:series.category==="oficial"?"#0F6E56":"#7c3aed",fontWeight:600}}>
                  {series.category==="oficial" ? t("officialBadge") : t("resinBadge")}
                </span>
                <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  <Btn small onClick={()=>addGroup(series.id)} variant="primary">+ Grupo</Btn>
                  <Btn small onClick={()=>addSet(series.id)} variant="primary">{t("newSet")}</Btn>
                  <Btn small onClick={()=>setEditSeriesData(series)}>✏️</Btn>
                  <Btn small onClick={()=>deleteSeries(series.id)} variant="danger">🗑</Btn>
                </div>
              </div>
              <div style={{marginBottom:20}}><ProgressBar value={seriesOwned(series)} total={seriesTotal(series)} color={series.color} /></div>

              {/* Groups — draggable */}
              {series.groups && series.groups.length > 0 && (
                <DraggableGroupList
                  groups={series.groups} color={series.color} owned={owned} wishlist={wishlist} apiKey={apiKey}
                  onToggle={toggle} onToggleWish={toggleWish}
                  onToggleAll={(ids,markAs)=>ids.forEach(id=>{if(markAs!==owned.has(id))toggle(id);})}
                  onUpdateGroup={(gid,n,l)=>updateGroup(series.id,gid,n,l)}
                  onDeleteGroup={gid=>deleteGroup(series.id,gid)}
                  onAddSet={gid=>addSet(series.id,gid)}
                  onUpdateSet={(gid,stid,n,rd,sl)=>updateSet(series.id,stid,n,rd,sl,gid)}
                  onDeleteSet={(gid,stid)=>deleteSet(series.id,stid,gid)}
                  onDuplicateSet={(gid,stid)=>duplicateSet(series.id,stid,gid)}
                  onAddFigure={(gid,stid,f)=>addFigure(series.id,stid,f,gid)}
                  onUpdateFigure={(gid,stid,fid,f)=>updateFigure(series.id,stid,fid,f,gid)}
                  onDeleteFigure={(gid,stid,fid)=>deleteFigure(series.id,stid,fid,gid)}
                  onReorderSets={(gid,from,to)=>reorderSets(series.id,from,to,gid)}
                  onReorderGroups={(from,to)=>reorderGroups(series.id,from,to)}
                />
              )}

              {/* Ungrouped sets */}
              {series.sets.length===0 && (!series.groups || series.groups.length===0) && <div style={{textAlign:"center",padding:"3rem 1rem",color:"var(--text4)",fontSize:14}}>{t("noSets1")}<br/>{t("noSets2")}</div>}
              {series.sets.length > 0 && (
                <DraggableSetList
                  sets={series.sets} color={series.color}
                  owned={owned} wishlist={wishlist} apiKey={apiKey}
                  onToggle={toggle} onToggleWish={toggleWish}
                  onToggleAll={(ids,markAs)=>ids.forEach(id=>{if(markAs!==owned.has(id))toggle(id);})}
                  onUpdateSet={(stid,n,rd,sl)=>updateSet(series.id,stid,n,rd,sl)}
                  onDeleteSet={stid=>deleteSet(series.id,stid)}
                  onDuplicate={stid=>duplicateSet(series.id,stid)}
                  onAddFigure={(stid,f)=>addFigure(series.id,stid,f)}
                  onUpdateFigure={(stid,fid,f)=>updateFigure(series.id,stid,fid,f)}
                  onDeleteFigure={(stid,fid)=>deleteFigure(series.id,stid,fid)}
                  onMoveToGroup={(stid,gid)=>moveSetToGroup(series.id,stid,gid)}
                  groups={series.groups}
                  onReorder={(from,to)=>reorderSets(series.id,from,to)}
                />
              )}
            </>
          )}
          {!isSearchMode && !showWishlist && !series && (
            <div style={{textAlign:"center",padding:"4rem 1rem",color:"var(--text4)",fontSize:14}}>{t("noSeriesCat1")}<br/>{t("noSeriesCat2")}</div>
          )}
          </div>{/* end zIndex:1 wrapper */}
        </div>
      </div>

      {showAddSeries && <SeriesModal category={activeCategory} apiKey={apiKey} onSave={(p1,p2,p3,p4,p5)=>{addSeries(p1,p2,p3,p4,p5);setShowAddSeries(false);}} onClose={()=>setShowAddSeries(false)} />}
      {editSeriesData && <SeriesModal category={editSeriesData.category} initial={editSeriesData} apiKey={apiKey} onSave={(p1,p2,p3,p4,p5)=>{updateSeries(editSeriesData.id,p1,p2,p3,p4,p5);setEditSeriesData(null);}} onClose={()=>setEditSeriesData(null)} />}
      {showSettings && <SettingsModal apiKey={apiKey} currentBanner={appLogo} onSave={(p1,p2)=>{ saveApiKey(p1); saveAppLogo(p2); }} onClose={()=>setShowSettings(false)} />}
    </div>
  );

  return (
    <LangProvider value={langValue}>
      {appContent}
    </LangProvider>
  );
}

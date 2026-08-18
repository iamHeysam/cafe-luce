/* =========================================================
   Café Luce — پنل مدیریت: لایهٔ داده (API)
   -------------------------------------------------
   همهٔ ارتباط با بک‌اند این‌جاست:
   - خواندن:  GET  /api/categories و /api/products
   - نوشتن:   POST / PATCH / DELETE با توکن ورود (Bearer)
   - ورود و مدیریت توکن (localStorage، یک ماه اعتبار)

   رابط با UI از طریق window.LuceApi.
   وقتی توکن منقضی شود (401)، تابع onUnauthorized صدا زده
   می‌شود تا UI پنل را قفل کند.
   ========================================================= */

(() => {
  "use strict";

  const { API_BASE } = LuceConfig;

  const TOKEN_KEY = "luce-panel-token";
  const TOKEN_EXPIRY_KEY = "luce-panel-token-expiry";
  const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // یک ماه

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

  /* ---------- توکن ---------- */
  /* توکن در localStorage می‌ماند تا یک ماه؛ بعد از انقضا پاک و دوباره ورود لازم است */
  function getToken() {
    const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
    if (!expiry || expiry <= Date.now()) {
      clearToken();
      return "";
    }
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + TOKEN_TTL_MS));
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  /* ---------- درخواست به API ---------- */
  /* توکن را خودکار در هدر می‌گذارد و خطا را فارسی می‌کند */
  async function request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options.body) headers["Content-Type"] = "application/json";

    let res;
    try {
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch {
      throw new ApiError("اتصال به سرور برقرار نیست");
    }

    let result = null;
    try {
      result = await res.json();
    } catch {
      /* پاسخ بدون JSON */
    }

    if (res.status === 401) {
      clearToken();
      LuceApi.onUnauthorized?.();
      throw new ApiError(result?.error || "برای این عملیات باید دوباره وارد شوید", 401);
    }
    if (!res.ok) {
      throw new ApiError(result?.error || "خطا در ارتباط با سرور", res.status);
    }
    return result;
  }

  /* ---------- خواندن داده‌ها ---------- */
  /* دسته‌ها و محصولات از API خوانده و به شکل داخلی پنل تبدیل می‌شوند */
  async function loadData() {
    const [categories, products] = await Promise.all([
      request("/api/categories"),
      request("/api/products"),
    ]);

    const items = {};
    categories.forEach((c) => (items[c.id] = []));
    products.forEach((p) => {
      if (p.category && items[p.category.id]) {
        items[p.category.id].push({ id: p.id, name: p.name });
      }
    });

    return {
      categories: categories.map((c) => ({
        id: c.id,
        label: c.name,
        icon: c.icon,
        hidden: c.hidden,
      })),
      items,
    };
  }

  /* ---------- عملیات API ---------- */
  const login = (username, password) =>
    request("/api/login", { method: "POST", body: JSON.stringify({ username, password }) });

  const createCategory = (name, icon) =>
    request("/api/categories", { method: "POST", body: JSON.stringify({ name, icon }) });
  const updateCategory = (id, fields) =>
    request(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
  const removeCategory = (id) => request(`/api/categories/${id}`, { method: "DELETE" });

  const createProduct = (name, category) =>
    request("/api/products", { method: "POST", body: JSON.stringify({ name, category }) });
  const updateProduct = (id, fields) =>
    request(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
  const removeProduct = (id) => request(`/api/products/${id}`, { method: "DELETE" });

  /* ---------- رابط عمومی ---------- */
  window.LuceApi = {
    ApiError,
    getToken,
    saveToken,
    clearToken,
    request,
    login,
    loadData,
    createCategory,
    updateCategory,
    removeCategory,
    createProduct,
    updateProduct,
    removeProduct,
    /* UI این را ست می‌کند تا روی 401 پنل قفل شود */
    onUnauthorized: null,
  };
})();

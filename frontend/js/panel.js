/* =========================================================
   Café Luce — پنل مدیریت منو
   ------------------------------------------------
   مدیریت دسته‌بندی‌ها و آیتم‌های منو (افزودن / ویرایش / حذف).

   لایهٔ داده به بک‌اند وصل است (REST API روی http://localhost:5000):
   - خواندن:  GET  /api/categories و /api/products
   - نوشتن:   POST / PATCH / DELETE با توکن ورود (Bearer)
   همهٔ عملیات تغییر از طریق API انجام می‌شود و مستقیم در MongoDB
   ذخیره می‌شود؛ سایت هم همان داده را نمایش می‌دهد.
   ========================================================= */

(() => {
  "use strict";

  const API_BASE = "http://localhost:5000";
  const TOKEN_KEY = "luce-panel-token";
  const TOKEN_EXPIRY_KEY = "luce-panel-token-expiry";
  const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // یک ماه

  /* ---------- ابزار ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);

  /* ---------- آیکون‌ها — همان ۴ آیکون سایت ---------- */
  const ICONS = {
    espressoHot: `
      <svg class="category__icon category__icon--fill" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 4C3 2.89543 3.89543 2 5 2H17C18.1046 2 19 2.89543 19 4V5.09005C19.3888 5.15136 19.8652 5.25646 20.3511 5.43867C20.9435 5.66081 21.6037 6.01768 22.1224 6.60126C22.6595 7.20549 23 8.00415 23 9C23 9.99585 22.6595 10.7945 22.1224 11.3987C21.6037 11.9823 20.9435 12.3392 20.3511 12.5613C19.8312 12.7563 19.3222 12.863 18.9197 12.9222L18.9186 12.9296C18.8395 13.4569 18.6795 14.1769 18.3494 14.9104C18.0188 15.6451 17.5028 16.4253 16.6968 17.0223C15.8791 17.628 14.8231 18 13.5 18H8.5C7.17691 18 6.12087 17.628 5.30321 17.0223C4.49723 16.4253 3.9812 15.6451 3.65058 14.9104C3.24764 14.015 3.00268 12.9895 3 12.002L3 4ZM19 10.8763V7.12365C19.2094 7.16883 19.4312 7.22971 19.6489 7.31133C20.0565 7.46419 20.3963 7.66982 20.6276 7.92999C20.8405 8.16952 21 8.49585 21 9C21 9.50415 20.8405 9.83049 20.6276 10.07C20.3963 10.3302 20.0565 10.5358 19.6489 10.6887C19.4312 10.7703 19.2094 10.8312 19 10.8763ZM5 11.9973C5.00914 12.7072 5.18467 13.4457 5.47442 14.0896C5.7063 14.6049 6.03403 15.0747 6.49366 15.4152C6.94163 15.747 7.57309 16 8.5 16H13.5C14.4269 16 15.0584 15.747 15.5063 15.4152C15.966 15.0747 16.2937 14.6049 16.5256 14.0896C16.8136 13.4496 16.9975 12.7047 17 11.9974L17 4H5V11.9973Z" />
        <path d="M23 21C23 20.4477 22.5523 20 22 20H2C1.44772 20 1 20.4477 1 21C1 21.5523 1.44772 22 2 22H22C22.5523 22 23 21.5523 23 21Z" />
      </svg>`,
    espressoCold: `
      <svg class="category__icon category__icon--fill category__icon--stroke" viewBox="0 0 392.656 392.656" fill="currentColor" stroke="currentColor"
        stroke-width="10" aria-hidden="true">
        <path d="M132.067,274.271c-4.418,0-8,3.582-8,8v32.409c0,4.418,3.582,8,8,8h32.409c4.418,0,8-3.582,8-8v-32.409c0-4.418-3.582-8-8-8 H132.067z M156.476,306.681h-16.409v-16.409h16.409V306.681z M256.232,0c-29.789,0-54.024,24.236-54.024,54.026v1.015h-64.75 l-2.591-43.791c-0.261-4.411-4.053-7.76-8.458-7.514c-4.411,0.262-7.774,4.048-7.513,8.459l2.535,42.846H90.396 c-2.2,0-4.303,0.906-5.813,2.504c-1.511,1.599-2.297,3.749-2.174,5.945l16.196,287.771v33.395c0,4.418,3.582,8,8,8h133.577 c4.418,0,8-3.582,8-8v-33.395l11.625-206.517c0.249-4.411-3.126-8.188-7.538-8.437c-4.401-0.243-8.188,3.126-8.437,7.538 l-11.212,199.19H114.167l-12.189-216.571h23.678l6.938,117.246c0.261,4.41,4.045,7.754,8.458,7.514 c4.411-0.262,7.774-4.048,7.513-8.459l-6.881-116.301h34.536c4.418,0,8-3.582,8-8s-3.582-8-8-8h-35.483l-2.333-39.425h63.803v1.396 c0,29.79,24.235,54.026,54.024,54.026c29.791,0,54.028-24.236,54.028-54.026V54.026C310.26,24.236,286.023,0,256.232,0z M114.605,359.037h117.577v17.619H114.605V359.037z M101.078,110.466l-2.219-39.425h23.518l2.333,39.425H101.078z M240.201,106.917 c-12.979-6.06-21.993-19.236-21.993-34.479V54.026c0-19.837,15.268-36.174,34.668-37.88c8.04,10.366,7.073,29.669-2.685,41.844 c-7.291,9.096-11.649,21.282-11.958,33.433C238.095,96.919,238.77,102.135,240.201,106.917z M294.26,72.438 c0,19.839-15.271,36.179-34.677,37.88c-8.901-11.217-6.097-30.854,3.093-42.321c10.053-12.543,14.491-32.112,9.617-48.437 c12.964,6.065,21.967,19.235,21.967,34.467V72.438z M192.892,287.157c0.048,0.001,0.095,0.001,0.143,0.001 c2.07,0,4.063-0.803,5.555-2.243l23.323-22.503c1.527-1.473,2.406-3.492,2.444-5.613c0.038-2.122-0.768-4.172-2.241-5.698 l-22.503-23.323c-3.068-3.179-8.132-3.271-11.312-0.202l-23.323,22.502c-1.527,1.473-2.406,3.492-2.444,5.613 c-0.038,2.122,0.768,4.171,2.241,5.698l22.503,23.324C188.751,286.24,190.77,287.119,192.892,287.157z M193.652,244.644 l11.394,11.81l-11.809,11.394l-11.394-11.81L193.652,244.644z" />
      </svg>`,
    frenchPress: `
      <svg class="category__icon category__icon--stroke" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <g transform="translate(4.000000, 4.000000)">
          <g transform="translate(4.000000, 3.352941)">
            <path d="M9,-0.352941176 L-1,-0.352941176 L-1,10.6470588 C-1,11.1993436 -0.776142375,11.6993436 -0.414213562,12.0612724 C-0.0522847498,12.4232012 0.44771525,12.6470588 1,12.6470588 L7,12.6470588 C7.55228475,12.6470588 8.05228475,12.4232012 8.41421356,12.0612724 C8.77614237,11.6993436 9,11.1993436 9,10.6470588 L9,-0.352941176 Z" />
            <path d="M10,2.64705882 L11,2.64705882 C11.5522847,2.64705882 12,3.09477407 12,3.64705882 L12,6.64705882" />
          </g>
          <line x1="3" x2="13" y1="6.23529412" y2="6.23529412" />
          <g stroke-linecap="round" stroke-linejoin="round">
            <line x1="0" x2="3" y1="3" y2="3" />
            <line x1="8" x2="8" y1="1" y2="13" />
            <line x1="7" x2="9" y1="0.5" y2="0.5" />
          </g>
          <line x1="6" x2="10" y1="13" y2="13" />
        </g>
      </svg>`,
    coldGlass: `
      <svg class="category__icon category__icon--fill" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M17,16.833L28,4H4l11,12.833V26h-5v2h12v-2h-5V16.833z M16,14.927L10.92,9h10.16L16,14.927z M23.652,6l-0.857,1H9.206L8.348,6H23.652z" />
      </svg>`,
  };

  /* ---------- داده‌های پیش‌فرض (برای دکمهٔ «بازنشانی») ---------- */
  const DEFAULT_CATEGORIES = [
    { id: "spressoHotBased", label: "بار گرم بر پایه اسپرسو", icon: "espressoHot" },
    { id: "spressoColdBased", label: "بار سرد بر پایه اسپرسو", icon: "espressoCold" },
    { id: "hotDrinks", label: "نوشیدنی گرم و دمنوش", icon: "frenchPress" },
    { id: "coldDrink", label: "نوشیدنی سرد", icon: "coldGlass" },
  ];

  const DEFAULT_ITEMS = {
    spressoHotBased: [
      "اسپرسو سینگل",
      "اسپرسو دبل",
      "ماکیاتو",
      "اسپرسو رومانو",
      "اسپرسو کُن‌پانا",
      "اسپرسو کُن‌کانلا",
      "اسپرسو بوم بُن",
      "امریکانو",
      "لاته",
      "موکا",
      "کارامل ماکیاتو",
      "کاپوچینو",
      "وانیلا لاته",
      "هاتزل لاته",
      "سینامون لاته",
      "لوتوس لاته",
      "دالگونا",
    ],
    spressoColdBased: [
      "ایس امریکانو",
      "ایس لاته",
      "ایس کارامل ماکیاتو",
      "ایس موکا",
      "ایس وانیلا لاته",
      "ایس هاتزل لاته",
      "ایس لوتوس لاته",
      "ایس لاته دورو",
      "ایس لاته منتا",
      "افوگاتو",
    ],
    hotDrinks: ["چای", "هات چاکلت", "تی لاته زعفران پسته", "چای کرک", "چای ماسالا", "انواع دمنوش"],
    coldDrink: [
      "موهيتو كلاسيک",
      "موهيتو فراگولا",
      "موهيتو ويولا",
      "موهيتو كوييک",
      "موهيتو دورو",
      "مارين",
      "جنوا",
      "ورونا",
      "فلورنزا",
      "روما سان ست",
      "ترنتينو",
    ],
  };

  /* ---------- لایهٔ API ---------- */

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

  /* توکن در localStorage می‌ماند تا یک ماه؛ بعد از انقضا پاک و دوباره ورود لازم است */
  const getToken = () => {
    const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
    if (!expiry || expiry <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return "";
    }
    return localStorage.getItem(TOKEN_KEY) || "";
  };

  const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + TOKEN_TTL_MS));
  };

  /* هر درخواست به API — توکن را خودکار در هدر می‌گذارد و خطا را فارسی می‌کند */
  async function api(path, options = {}) {
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
      lockPanel();
      throw new ApiError(result?.error || "برای این عملیات باید دوباره وارد شوید", 401);
    }
    if (!res.ok) {
      throw new ApiError(result?.error || "خطا در ارتباط با سرور", res.status);
    }
    return result;
  }

  /* خواندن دسته‌ها و محصولات از API و تبدیل به شکل داخلی پنل */
  async function loadData() {
    const [categories, products] = await Promise.all([
      api("/api/categories"),
      api("/api/products"),
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
  const createCategory = (name, icon) =>
    api("/api/categories", { method: "POST", body: JSON.stringify({ name, icon }) });
  const updateCategory = (id, fields) =>
    api(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
  const removeCategory = (id) => api(`/api/categories/${id}`, { method: "DELETE" });
  const createProduct = (name, category) =>
    api("/api/products", { method: "POST", body: JSON.stringify({ name, category }) });
  const updateProduct = (id, fields) =>
    api(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
  const removeProduct = (id) => api(`/api/products/${id}`, { method: "DELETE" });

  /* بعد از هر تغییر، داده‌ها دوباره از API خوانده می‌شوند تا همیشه با سایت هماهنگ باشند */
  async function refresh() {
    data = await loadData();
    if (!data.categories.some((c) => c.id === activeCategoryId)) {
      activeCategoryId = data.categories[0]?.id ?? null;
    }
    renderAll();
  }

  async function runOperation(operation, successMessage) {
    try {
      await operation();
      await refresh();
      if (successMessage) toast(successMessage);
    } catch (err) {
      toast(err.message || "خطا در انجام عملیات", "error", 4000);
    }
  }

  /* ---------- ورود به پنل (فقط رمز) ---------- */
  let loginBound = false;

  function lockPanel() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    document.body.classList.add("is-locked");
    bindLoginForm();
  }

  function bindLoginForm() {
    if (loginBound) return;
    loginBound = true;

    const form = $("#login-form");

    /* نمایش/مخفی‌کردن رمز */
    const passwordField = form.querySelector(".password-field");
    const passwordToggle = form.querySelector(".password-toggle");
    const passwordInput = form.querySelector("#login-password");
    passwordToggle.addEventListener("click", () => {
      const show = passwordInput.type === "password";
      passwordInput.type = show ? "text" : "password";
      passwordToggle.classList.toggle("is-visible", show);
      passwordToggle.setAttribute("aria-pressed", String(show));
      passwordToggle.setAttribute("aria-label", show ? "مخفی کردن رمز" : "نمایش رمز");
      passwordInput.focus();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = $("#login-username").value.trim();
      const password = $("#login-password").value;
      if (!username || !password) {
        toast("نام کاربری و رمز را وارد کنید.", "error");
        return;
      }
      try {
        const res = await api("/api/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        saveToken(res.token);
        document.body.classList.remove("is-locked");
        $("#login-username").value = "";
        $("#login-password").value = "";
        toast("خوش آمدید");
      } catch (err) {
        toast(err.message || "نام کاربری یا رمز اشتباه است", "error", 3000);
      }
    });
  }

  /* ---------- وضعیت ---------- */
  let data = null;
  let activeCategoryId = null;

  /* ---------- DOM ---------- */
  const els = {
    tabs: document.querySelectorAll(".tab"),
    tabCategories: $("#tab-categories"),
    tabItems: $("#tab-items"),
    categoryForm: $("#category-form"),
    categoryName: $("#category-name"),
    categorySvg: $("#category-svg"),
    categoryModal: $("#category-modal"),
    openCategoryModal: $("#open-category-modal"),
    categoryList: $("#category-list"),
    itemCategory: $("#item-category"),
    itemCategoryTitle: $("#item-category-title"),
    itemForm: $("#item-form"),
    itemName: $("#item-name"),
    itemList: $("#item-list"),
    exportBtn: $("#export-json"),
    resetBtn: $("#reset-data"),
    toast: $("#toast"),
  };

  const currentCategory = () =>
    data?.categories.find((c) => c.id === activeCategoryId) || null;

  /* ---------- توست ---------- */
  let toastTimer = null;
  function toast(message, type = "ok", duration = 2600) {
    els.toast.textContent = message;
    els.toast.dataset.type = type;
    els.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), duration);
  }

  /* ---------- رندر ---------- */
  /* آیکون یا کلید آیکون آماده است یا SVG خام که مستقیم رندر می‌شود */
  const iconHtml = (icon) => ICONS[icon] || icon || "";

  function actionButton(text, className, danger = false) {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "btn btn--small " + (danger ? "btn--danger" : "btn--ghost") + " " + className;
    b.textContent = text;
    return b;
  }

  function renderCategories() {
    els.categoryList.replaceChildren();

    if (!data.categories.length) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "هنوز دسته‌ای وجود ندارد؛ اولین دسته را از بالا اضافه کنید.";
      els.categoryList.append(empty);
      return;
    }

    data.categories.forEach((category) => {
      const li = document.createElement("li");
      li.className = "list-item" + (category.hidden ? " is-hidden" : "");
      li.dataset.id = category.id;
      li.title = "برای مشاهدهٔ آیتم‌ها کلیک کنید";

      const icon = document.createElement("div");
      icon.className = "list-item__icon";
      icon.innerHTML = iconHtml(category.icon);

      const main = document.createElement("div");
      main.className = "list-item__main";
      const label = document.createElement("span");
      label.className = "list-item__label";
      label.textContent = category.label;
      const meta = document.createElement("span");
      meta.className = "list-item__meta";
      const count = (data.items[category.id] || []).length;
      const hiddenMark = category.hidden ? " · مخفی" : "";
      meta.textContent = (count ? count + " آیتم" : "بدون آیتم") + hiddenMark;
      main.append(label, meta);

      const actions = document.createElement("div");
      actions.className = "list-item__actions";
      actions.append(
        actionButton("ویرایش", "js-edit"),
        actionButton("حذف", "js-delete", true)
      );

      li.append(icon, main, actions);
      els.categoryList.append(li);
    });
  }

  function renderCategorySelect() {
    els.itemCategory.replaceChildren();

    if (!data.categories.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "ابتدا یک دسته بسازید";
      els.itemCategory.append(option);
      els.itemCategory.disabled = true;
      els.itemCategoryTitle.textContent = "";
      return;
    }

    els.itemCategory.disabled = false;
    data.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.label;
      els.itemCategory.append(option);
    });

    if (!activeCategoryId || !data.categories.some((c) => c.id === activeCategoryId)) {
      activeCategoryId = data.categories[0].id;
    }
    els.itemCategory.value = activeCategoryId;
    els.itemCategoryTitle.textContent = currentCategory()?.label ?? "";
  }

  function renderItems() {
    els.itemList.replaceChildren();

    const category = currentCategory();
    if (!category) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "دسته‌ای انتخاب نشده است.";
      els.itemList.append(empty);
      return;
    }

    const items = data.items[category.id] || [];
    if (!items.length) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "این دسته هنوز آیتمی ندارد؛ اولین آیتم را از بالا اضافه کنید.";
      els.itemList.append(empty);
      return;
    }

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-item";
      li.dataset.id = item.id;

      const main = document.createElement("div");
      main.className = "list-item__main";
      const label = document.createElement("span");
      label.className = "list-item__label";
      label.textContent = item.name;
      main.append(label);

      const actions = document.createElement("div");
      actions.className = "list-item__actions";
      actions.append(
        actionButton("ویرایش", "js-edit"),
        actionButton("حذف", "js-delete", true)
      );

      li.append(main, actions);
      els.itemList.append(li);
    });
  }

  function renderAll() {
    renderCategories();
    renderCategorySelect();
    renderItems();
  }

  /* ---------- ویرایش درجا (inline) ---------- */
  function inlineEdit({ container, current, maxLength, onSave, onCancel }) {
    const wrapper = document.createElement("div");
    wrapper.className = "inline-edit";

    const input = document.createElement("input");
    input.className = "input input--inline";
    input.value = current;
    input.maxLength = maxLength;
    input.autocomplete = "off";

    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "btn btn--small btn--primary";
    ok.textContent = "ذخیره";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "btn btn--small btn--ghost";
    cancel.textContent = "انصراف";

    wrapper.append(input, ok, cancel);
    container.replaceWith(wrapper);
    input.focus();
    input.select();

    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      if (save) onSave(input.value.trim());
      else onCancel();
    };

    ok.addEventListener("click", () => finish(true));
    cancel.addEventListener("click", () => finish(false));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finish(true);
      } else if (event.key === "Escape") {
        finish(false);
      }
    });
  }

  /* ---------- عملیات دسته‌ها ---------- */
  function deleteCategory(category) {
    const count = (data.items[category.id] || []).length;
    const message = count
      ? `دستهٔ «${category.label}» همراه با ${count} آیتمش حذف شود؟`
      : `دستهٔ «${category.label}» حذف شود؟`;
    if (!confirm(message)) return;

    runOperation(
      () => removeCategory(category.id),
      `دستهٔ «${category.label}» حذف شد.`
    );
  }

  /* ---------- مودال افزودن دسته ---------- */
  function openCategoryModal() {
    els.categoryModal.hidden = false;
    els.categoryName.focus();
  }

  function closeCategoryModal() {
    els.categoryModal.hidden = true;
    els.categoryName.value = "";
    els.categorySvg.value = "";
  }

  function editCategory(category) {
    const row = els.categoryList.querySelector(`[data-id="${category.id}"]`);
    if (!row) return;
    row.classList.add("is-editing");
    inlineEdit({
      container: row.querySelector(".list-item__label"),
      current: category.label,
      maxLength: 40,
      onSave: (value) => {
        if (!value) {
          toast("نام نمی‌تواند خالی باشد.", "error");
          renderCategories();
          return;
        }
        runOperation(
          () => updateCategory(category.id, { name: value }),
          "نام دسته به‌روزرسانی شد."
        );
      },
      onCancel: renderCategories,
    });
  }

  /* ---------- رویدادها ---------- */
  function bindEvents() {
    /* تب‌ها */
    els.tabs.forEach((tab) =>
      tab.addEventListener("click", () => switchTab(tab.dataset.tab))
    );

    /* باز و بسته‌کردن مودال افزودن دسته */
    els.openCategoryModal.addEventListener("click", openCategoryModal);
    els.categoryModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-modal]")) closeCategoryModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.categoryModal.hidden) {
        closeCategoryModal();
      }
    });

    /* افزودن دسته */
    els.categoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = els.categoryName.value.trim();
      if (!name) {
        toast("نام دسته را وارد کنید.", "error");
        return;
      }
      const svg = els.categorySvg.value.trim();
      if (!svg) {
        toast("کد SVG آیکون را وارد کنید.", "error");
        return;
      }
      if (!/^<svg[\s>][\s\S]*<\/svg>$/i.test(svg)) {
        toast("فقط کد SVG معتبر وارد کنید.", "error");
        return;
      }
      if (data.categories.some((c) => c.label === name)) {
        toast("دسته‌ای با این نام وجود دارد.", "error");
        return;
      }
      closeCategoryModal();
      try {
        const created = await createCategory(name, svg);
        await refresh();
        activeCategoryId = created.id;
        renderAll();
        toast(`دستهٔ «${name}» اضافه شد.`);
      } catch (err) {
        toast(err.message || "خطا در افزودن دسته", "error", 4000);
      }
    });

    /* کلیک روی لیست دسته‌ها */
    els.categoryList.addEventListener("click", (event) => {
      const row = event.target.closest(".list-item");
      if (!row || row.classList.contains("is-editing")) return;
      const category = data.categories.find((c) => c.id === row.dataset.id);
      if (!category) return;

      if (event.target.closest(".js-delete")) {
        deleteCategory(category);
        return;
      }
      if (event.target.closest(".js-edit")) {
        editCategory(category);
        return;
      }
      activeCategoryId = category.id;
      switchTab("items");
    });

    /* تغییر دسته در تب آیتم‌ها */
    els.itemCategory.addEventListener("change", () => {
      activeCategoryId = els.itemCategory.value || null;
      renderItems();
      els.itemCategoryTitle.textContent = currentCategory()?.label ?? "";
    });

    /* افزودن آیتم */
    els.itemForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const category = currentCategory();
      if (!category) {
        toast("ابتدا یک دسته انتخاب کنید.", "error");
        return;
      }
      const name = els.itemName.value.trim();
      if (!name) {
        toast("نام آیتم را وارد کنید.", "error");
        return;
      }
      const items = data.items[category.id] || [];
      if (items.some((i) => i.name === name)) {
        toast("این آیتم قبلاً در این دسته وجود دارد.", "error");
        return;
      }
      runOperation(
        () => createProduct(name, category.id),
        `«${name}» به دستهٔ «${category.label}» اضافه شد.`
      );
      els.itemName.value = "";
      els.itemName.focus();
    });

    /* کلیک روی لیست آیتم‌ها */
    els.itemList.addEventListener("click", (event) => {
      const row = event.target.closest(".list-item");
      if (!row || row.classList.contains("is-editing")) return;
      const category = currentCategory();
      if (!category) return;
      const item = (data.items[category.id] || []).find((i) => i.id === row.dataset.id);
      if (!item) return;

      if (event.target.closest(".js-delete")) {
        if (confirm(`آیتم «${item.name}» حذف شود؟`)) {
          runOperation(
            () => removeProduct(item.id),
            `«${item.name}» حذف شد.`
          );
        }
        return;
      }
      if (event.target.closest(".js-edit")) {
        row.classList.add("is-editing");
        inlineEdit({
          container: row.querySelector(".list-item__label"),
          current: item.name,
          maxLength: 60,
          onSave: (value) => {
            if (!value) {
              toast("نام نمی‌تواند خالی باشد.", "error");
              renderItems();
              return;
            }
            runOperation(
              () => updateProduct(item.id, { name: value }),
              "نام آیتم به‌روزرسانی شد."
            );
          },
          onCancel: renderItems,
        });
      }
    });

    /* خروجی JSON */
    els.exportBtn.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "luce-menu-data.json";
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast("خروجی JSON دانلود شد.");
    });

    /* بازنشانی به پیش‌فرض — حذف همه از API و ساخت دوبارهٔ داده‌های نمونه */
    els.resetBtn.addEventListener("click", async () => {
      if (
        !confirm(
          "همهٔ تغییرات پاک می‌شود و داده‌ها به حالت پیش‌فرض برمی‌گردد. ادامه می‌دهم؟"
        )
      ) {
        return;
      }
      els.resetBtn.disabled = true;
      try {
        for (const c of [...data.categories]) {
          await removeCategory(c.id);
        }
        for (const cat of DEFAULT_CATEGORIES) {
          const created = await createCategory(cat.label, cat.icon);
          for (const name of DEFAULT_ITEMS[cat.id] || []) {
            await createProduct(name, created.id);
          }
        }
        await refresh();
        toast("داده‌ها به حالت پیش‌فرض برگشت.");
      } catch (err) {
        toast(err.message || "خطا در بازنشانی داده‌ها", "error", 4000);
      } finally {
        els.resetBtn.disabled = false;
      }
    });
  }

  function switchTab(name) {
    els.tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    els.tabCategories.hidden = name !== "categories";
    els.tabItems.hidden = name !== "items";
    if (name === "items") renderItems();
  }

  /* ---------- شروع ---------- */
  (async function init() {
    bindEvents();

    if (getToken()) {
      document.body.classList.remove("is-locked");
    } else {
      bindLoginForm();
    }

    try {
      data = await loadData();
      activeCategoryId = data.categories[0]?.id ?? null;
      renderAll();
    } catch (err) {
      toast(err.message || "اتصال به سرور برقرار نیست", "error", 4000);
    }
  })();
})();

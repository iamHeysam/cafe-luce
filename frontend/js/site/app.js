/* =========================================================
   Café Luce — v2
   رندر منو به‌صورت داده‌محور و بدون innerHTML نامطمئن
   -------------------------------------------------
   وابستگی‌ها (به همین ترتیب قبل از این فایل لود می‌شوند):
     js/shared/config.js   → LuceConfig.API_BASE
     js/shared/icons.js    → LuceIcons
     js/site/fallback-data.js → LuceFallback
   ========================================================= */

(() => {
  "use strict";

  /* ---------- اتصال به بک‌اند (API) ----------
     ابتدا دسته‌ها و محصولات از API خوانده می‌شوند؛
     اگر API در دسترس نبود، به دادهٔ ثابت برمی‌گردیم. */

  const { API_BASE } = LuceConfig;

  async function loadFromApi() {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${API_BASE}/api/categories`),
      fetch(`${API_BASE}/api/products`),
    ]);
    if (!categoriesRes.ok || !productsRes.ok) {
      throw new Error("API در دسترس نیست");
    }

    const categories = await categoriesRes.json();
    const products = await productsRes.json();

    // محصولات را به‌تفکیک دسته مرتب می‌کنیم
    const menu = {};
    categories.forEach((c) => {
      menu[c.id] = [];
    });
    products.forEach((p) => {
      if (p.category && menu[p.category.id]) {
        menu[p.category.id].push({ id: p.id, name: p.name, hidden: p.hidden });
      }
    });

    return {
      categories: categories
        .filter((c) => !c.hidden) // دسته‌های مخفی موقت در سایت نمایش داده نمی‌شوند
        .map((c) => ({
          id: c.id,
          label: c.name,
          icon: c.icon,
        })),
      menu,
      fromApi: true,
    };
  }

  function getFallbackData() {
    const menu = {};
    Object.entries(LuceFallback.menu).forEach(([categoryId, names]) => {
      menu[categoryId] = names.map((name) => ({ id: name, name }));
    });
    return { categories: LuceFallback.categories, menu, fromApi: false };
  }

  /* ---------- توابع کمکی ---------- */

  const $ = (selector, root = document) => root.querySelector(selector);

  /* ---------- رندر ---------- */

  const categoriesNav = $("#categories");
  const menuList = $("#menu-list");
  const header = $("#site-header");

  let activeId = null;

  function categoryExample(id) {
    const items = state.menu[id];
    if (!items || items.length === 0) return "";
    const first = items[0];
    const second = items[1] ? items[1] : null;
    return second ? `${first.name}، ${second.name} و ...` : first.name;
  }

  function buildCategoryButtons() {
    state.categories.forEach((category) => {
      const el = document.createElement("div");
      el.className = "category" + (category.id === activeId ? " active" : "");
      el.dataset.category = category.id;

      const right = document.createElement("div");
      right.className = "category__right";

      const title = document.createElement("span");
      title.className = "category__title";
      title.textContent = category.label;

      const example = document.createElement("span");
      example.className = "category__example";
      example.textContent = categoryExample(category.id);

      right.append(title, example);

      const left = document.createElement("div");
      left.className = "category__left";
      /* آیکون یا کلید آیکون‌های آماده است یا SVG خام که مستقیماً رندر می‌شود */
      left.innerHTML = LuceIcons[category.icon] || category.icon || "";

      el.append(right, left);
      categoriesNav.append(el);
    });
  }

  function buildMenu(categoryId) {
    menuList.replaceChildren();

    // محصولات مخفی موقت در سایت نمایش داده نمی‌شوند
    const items = (state.menu[categoryId] ?? []).filter((item) => !item.hidden);

    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.className = "menu-empty";
      empty.textContent = "این بخش به‌زودی تکمیل می‌شود.";
      menuList.append(empty);
      return;
    }

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "menu-item";

      const nameEl = document.createElement("span");
      nameEl.className = "menu-item__name";
      nameEl.textContent = item.name;

      li.append(nameEl);
      menuList.append(li);
    });
  }

  function selectCategory(categoryId) {
    if (categoryId === activeId) return;

    activeId = categoryId;

    categoriesNav.querySelectorAll(".category").forEach((el) => {
      el.classList.toggle("active", el.dataset.category === categoryId);
    });

    buildMenu(categoryId);

    /* اسکرول خودکار به منو: منو با فاصلهٔ ۹۰px (ارتفاع هدر کوچک) از بالای صفحه
       می‌ایستد. اگر هدر هنوز بزرگ است، هنگام اسکرول کوچک می‌شود و محتوا ۳۰px
       جابه‌جا می‌شود؛ این اختلاف را جبران می‌کنیم تا منو همیشه یک‌جا بایستد. */
    requestAnimationFrame(() => {
      const style = getComputedStyle(document.documentElement);
      const base = parseFloat(style.fontSize);
      const shrunkH =
        parseFloat(style.getPropertyValue("--header-h-shrunk")) * base;
      const shrinkShift = Math.max(0, header.offsetHeight - shrunkH);
      const menuTop = menuList.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, menuTop - shrunkH - 10 - shrinkShift),
        behavior: "smooth",
      });
    });
  }

  categoriesNav.addEventListener("click", (event) => {
    const el = event.target.closest(".category");
    if (el) selectCategory(el.dataset.category);
  });

  /* ---------- کوچک‌شدن هدر هنگام اسکرول ---------- */

  const hero = $(".hero");

  /* مرز کوچک‌شدن: وقتی پایین هدر به پایین سکشن hero برسد.
     یعنی scrollY به اندازهٔ (ارتفاع hero منهای ارتفاع هدر) برسد. */
  let heroBottom = 0;
  let bigHeaderH = 0;
  let lastY = window.scrollY;
  let ticking = false;

  /* ارتفاع هدر در حالت بزرگ را از متغیر CSS می‌خوانیم */
  function getBigHeaderHeight() {
    const style = getComputedStyle(document.documentElement);
    const rems = parseFloat(style.getPropertyValue("--header-h")); // ۱۲ (rem)
    const base = parseFloat(style.fontSize); // ۱۰ (px)
    return rems * base;
  }

  function measure() {
    bigHeaderH = getBigHeaderHeight();
    /* اگر هدر در لحظهٔ اندازه‌گیری کوچیک است، اختلاف را جبران می‌کنیم
       تا مرز همیشه بر اساس حالت بزرگ هدر محاسبه شود */
    const shrinkDiff = bigHeaderH - header.offsetHeight;
    heroBottom = hero.offsetTop + hero.offsetHeight + shrinkDiff;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;
      const y = window.scrollY;
      const boundary = heroBottom - bigHeaderH;

      let shouldShrink;
      if (y > lastY) {
        /* اسکرول به پایین: همین که پایین هدر به پایین hero برسد، کوچیک می‌شود */
        shouldShrink = y >= boundary;
      } else {
        /* اسکرول به بالا: به محض رسیدن به خط، بزرگ می‌شود (بدون تأخیر) */
        shouldShrink = y > boundary;
      }

      const isShrunk = header.classList.contains("is-shrunk");
      if (shouldShrink !== isShrunk) {
        header.classList.toggle("is-shrunk", shouldShrink);
      }

      lastY = y;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.visualViewport?.addEventListener("resize", measure);
  if (document.fonts?.ready) {
    document.fonts.ready.then(measure);
  }

  /* ---------- شروع ---------- */

  let state = null;

  (async function init() {
    try {
      state = await loadFromApi();
    } catch {
      state = getFallbackData();
    }

    activeId = state.categories[0]?.id ?? null;

    buildCategoryButtons();
    buildMenu(activeId);
    measure();

    // لودینگ را برمی‌داریم — منو آماده است
    const loading = $("#menu-loading");
    if (loading) loading.remove();
  })();
})();

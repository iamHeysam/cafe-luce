/* =========================================================
   Café Luce — v2
   رندر منو به‌صورت داده‌محور و بدون innerHTML نامطمئن
   ========================================================= */

(() => {
  "use strict";

  /* ---------- داده‌ها ---------- */

  /* دادهٔ ثابت — فقط وقتی API در دسترس نباشد استفاده می‌شود (fallback) */
  const FALLBACK_CATEGORIES = [
    {
      id: "spressoHotBased",
      label: "بار گرم بر پایه اسپرسو",
      icon: "espressoHot",
    },
    {
      id: "spressoColdBased",
      label: "بار سرد بر پایه اسپرسو",
      icon: "espressoCold",
    },
    { id: "hotDrinks", label: "نوشیدنی گرم و دمنوش", icon: "frenchPress" },
    { id: "coldDrink", label: "نوشیدنی سرد", icon: "coldGlass" },
  ];

  const FALLBACK_MENU = {
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

  /* آیکون‌ها — همون SVG های اول نسخهٔ اصلی سایت */
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

  /* ---------- اتصال به بک‌اند (API) ----------
     ابتدا دسته‌ها و محصولات از API خوانده می‌شوند؛
     اگر API در دسترس نبود، به دادهٔ ثابت برمی‌گردیم. */

  // ⚠️ پورت 4000 توسط بک‌اند دیگری اشغال است — بک‌اند ما روی 5000 است
  const API_BASE = "http://localhost:5000";

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
        menu[p.category.id].push({ id: p.id, name: p.name });
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
    Object.entries(FALLBACK_MENU).forEach(([categoryId, names]) => {
      menu[categoryId] = names.map((name) => ({ id: name, name }));
    });
    return { categories: FALLBACK_CATEGORIES, menu, fromApi: false };
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
      left.innerHTML = ICONS[category.icon] || category.icon || "";

      el.append(right, left);
      categoriesNav.append(el);
    });
  }

  function buildMenu(categoryId) {
    menuList.replaceChildren();

    const items = state.menu[categoryId] ?? [];

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
  })();
})();

/* =========================================================
   Café Luce — پنل مدیریت منو: لایهٔ UI
   -------------------------------------------------
   مدیریت دسته‌بندی‌ها و آیتم‌های منو (افزودن / ویرایش / حذف).

   وابستگی‌ها (به همین ترتیب قبل از این فایل لود می‌شوند):
     js/shared/config.js → LuceConfig
     js/shared/icons.js  → LuceIcons
     js/panel/api.js     → LuceApi (لایهٔ داده و توکن)

   همهٔ عملیات تغییر از طریق LuceApi انجام می‌شود و مستقیم در
   MongoDB ذخیره می‌شود؛ سایت هم همان داده را نمایش می‌دهد.
   ========================================================= */

(() => {
  "use strict";

  /* ---------- ابزار ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);

  /* ---------- لایهٔ داده ---------- */
  /* بعد از هر تغییر، داده‌ها دوباره از API خوانده می‌شوند تا همیشه با سایت هماهنگ باشند */
  async function refresh() {
    data = await LuceApi.loadData();
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
      toast(err.message || "خطای سرور", "error", 4000);
    }
  }

  /* ---------- ورود به پنل (فقط رمز) ---------- */
  let loginBound = false;

  function lockPanel() {
    LuceApi.clearToken();
    document.body.classList.add("is-locked");
    bindLoginForm();
  }

  /* اگر توکن در هر درخواستی باطل شد (401)، پنل قفل می‌شود */
  LuceApi.onUnauthorized = lockPanel;

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
        toast("نام کاربری یا رمز خالی است", "error");
        return;
      }
      try {
        const res = await LuceApi.login(username, password);
        LuceApi.saveToken(res.token);
        document.body.classList.remove("is-locked");
        $("#login-username").value = "";
        $("#login-password").value = "";
        toast("با موفقیت وارد شدید");
      } catch (err) {
        toast(err.message || "رمز اشتباه است", "error", 3000);
      }
    });
  }

  /* ---------- وضعیت ---------- */
  let data = null;
  let activeCategoryId = null;
  let editingCategoryId = null; // null = افزودن، غیر null = ویرایش
  let editingItemId = null; // null = افزودن، غیر null = ویرایش

  /* ---------- DOM ---------- */
  const els = {
    tabs: document.querySelectorAll(".tab"),
    tabCategories: $("#tab-categories"),
    tabItems: $("#tab-items"),
    categoryForm: $("#category-form"),
    categoryName: $("#category-name"),
    categorySvg: $("#category-svg"),
    categoryModal: $("#category-modal"),
    categoryModalTitle: $("#category-modal-title"),
    categorySubmitBtn: $("#category-submit-btn"),
    openCategoryModal: $("#open-category-modal"),
    confirmModal: $("#confirm-modal"),
    confirmText: $("#confirm-modal-text"),
    confirmOk: $("#confirm-ok"),
    managerModal: $("#manager-modal"),
    managerForm: $("#manager-form"),
    managerUsername: $("#manager-username"),
    managerPassword: $("#manager-password"),
    managerPasswordConfirm: $("#manager-password-confirm"),
    openManagerModal: $("#add-manager-btn"),
    changePasswordModal: $("#change-password-modal"),
    changePasswordForm: $("#change-password-form"),
    cpCurrent: $("#cp-current"),
    cpNew: $("#cp-new"),
    cpConfirm: $("#cp-confirm"),
    openChangePasswordBtn: $("#change-password-btn"),
    categoryList: $("#category-list"),
    itemCategoryPicker: $("#item-category-picker"),
    itemModal: $("#item-modal"),
    itemModalTitle: $("#item-modal-title"),
    itemSubmitBtn: $("#item-submit-btn"),
    itemForm: $("#item-form"),
    itemName: $("#item-name"),
    openItemModal: $("#open-item-modal"),
    itemList: $("#item-list"),
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
  const iconHtml = (icon) => LuceIcons[icon] || icon || "";

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

  function renderCategoryPicker() {
    els.itemCategoryPicker.replaceChildren();

    if (!data.categories.length) {
      const empty = document.createElement("span");
      empty.className = "empty";
      empty.textContent = "ابتدا یک دسته بسازید";
      els.itemCategoryPicker.append(empty);
      return;
    }

    if (!activeCategoryId || !data.categories.some((c) => c.id === activeCategoryId)) {
      activeCategoryId = data.categories[0].id;
    }

    data.categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "category-picker__btn" + (category.id === activeCategoryId ? " is-active" : "");
      button.dataset.id = category.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(category.id === activeCategoryId));
      button.textContent = category.label;
      els.itemCategoryPicker.append(button);
    });
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
    renderCategoryPicker();
    renderItems();
  }

  /* ---------- مودال افزودن مدیر ---------- */
  function openManagerModal() {
    els.managerModal.hidden = false;
    els.managerUsername.focus();
  }

  function closeManagerModal() {
    els.managerModal.hidden = true;
    els.managerUsername.value = "";
    els.managerPassword.value = "";
    els.managerPasswordConfirm.value = "";
  }

  /* ---------- مودال افزودن/ویرایش آیتم ---------- */
  function openItemModal() {
    if (!currentCategory()) {
      toast("دسته انتخاب نشده", "error");
      return;
    }
    editingItemId = null;
    els.itemModalTitle.textContent = "افزودن آیتم جدید";
    els.itemSubmitBtn.textContent = "افزودن";
    els.itemName.value = "";
    els.itemModal.hidden = false;
    els.itemName.focus();
  }

  function editItem(item) {
    editingItemId = item.id;
    els.itemModalTitle.textContent = "ویرایش آیتم";
    els.itemSubmitBtn.textContent = "ذخیره";
    els.itemName.value = item.name;
    els.itemModal.hidden = false;
    els.itemName.focus();
  }

  function closeItemModal() {
    els.itemModal.hidden = true;
    els.itemName.value = "";
    editingItemId = null;
  }

  /* ---------- مودال تغییر رمز ---------- */
  function openChangePasswordModal() {
    els.changePasswordModal.hidden = false;
    els.cpCurrent.focus();
  }

  function closeChangePasswordModal() {
    els.changePasswordModal.hidden = true;
    els.cpCurrent.value = "";
    els.cpNew.value = "";
    els.cpConfirm.value = "";
  }

  /* ---------- مودال تأیید حذف ---------- */
  let confirmAction = null;

  function openConfirmModal(text, onConfirm) {
    els.confirmText.textContent = text;
    confirmAction = onConfirm;
    els.confirmModal.hidden = false;
  }

  function closeConfirmModal() {
    els.confirmModal.hidden = true;
    confirmAction = null;
  }

  /* ---------- عملیات دسته‌ها ---------- */
  function deleteCategory(category) {
    const count = (data.items[category.id] || []).length;
    const message = count
      ? `از حذف دستهٔ «${category.label}» همراه با ${count} آیتمش مطمئن هستید؟`
      : `از حذف دستهٔ «${category.label}» مطمئن هستید؟`;
    openConfirmModal(message, () => {
      runOperation(
        () => LuceApi.removeCategory(category.id),
        "دسته حذف شد"
      );
    });
  }

  /* ---------- مودال افزودن/ویرایش دسته ---------- */
  function openCategoryModal() {
    editingCategoryId = null;
    els.categoryModalTitle.textContent = "افزودن دستهٔ جدید";
    els.categorySubmitBtn.textContent = "افزودن";
    els.categoryName.value = "";
    els.categorySvg.value = "";
    els.categoryModal.hidden = false;
    els.categoryName.focus();
  }

  function editCategory(category) {
    editingCategoryId = category.id;
    els.categoryModalTitle.textContent = "ویرایش دسته";
    els.categorySubmitBtn.textContent = "ذخیره";
    els.categoryName.value = category.label;
    els.categorySvg.value = LuceIcons[category.icon] || category.icon || "";
    els.categoryModal.hidden = false;
    els.categoryName.focus();
  }

  function closeCategoryModal() {
    els.categoryModal.hidden = true;
    els.categoryName.value = "";
    els.categorySvg.value = "";
    editingCategoryId = null;
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

    /* مودال افزودن مدیر */
    els.openManagerModal.addEventListener("click", openManagerModal);
    els.managerModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-manager]")) closeManagerModal();
    });
    els.managerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = els.managerUsername.value.trim();
      const password = els.managerPassword.value;
      const passwordConfirm = els.managerPasswordConfirm.value;

      if (!username) {
        toast("نام کاربری خالی است", "error");
        return;
      }
      if (!password) {
        toast("رمز خالی است", "error");
        return;
      }
      if (password.length < 6) {
        toast("رمز حداقل ۶ کاراکتر", "error");
        return;
      }
      if (password !== passwordConfirm) {
        toast("تکرار رمز اشتباه است", "error");
        return;
      }

      closeManagerModal();
      try {
        await LuceApi.request("/api/users", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        toast("مدیر افزوده شد");
      } catch (err) {
        toast(err.message || "خطای سرور", "error", 4000);
      }
    });

    /* مودال تغییر رمز */
    els.openChangePasswordBtn.addEventListener("click", openChangePasswordModal);
    els.changePasswordModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-change-password]")) closeChangePasswordModal();
    });
    els.changePasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const currentPassword = els.cpCurrent.value;
      const password = els.cpNew.value;
      const passwordConfirm = els.cpConfirm.value;

      if (!currentPassword) {
        toast("رمز قبلی خالی است", "error");
        return;
      }
      if (!password) {
        toast("رمز جدید خالی است", "error");
        return;
      }
      if (password.length < 6) {
        toast("رمز حداقل ۶ کاراکتر", "error");
        return;
      }
      if (password !== passwordConfirm) {
        toast("تکرار رمز اشتباه است", "error");
        return;
      }

      closeChangePasswordModal();
      try {
        await LuceApi.request("/api/users/me/password", {
          method: "PATCH",
          body: JSON.stringify({ currentPassword, password }),
        });
        lockPanel();
        toast("رمز تغییر کرد؛ دوباره وارد شوید");
      } catch (err) {
        toast(err.message || "خطای سرور", "error", 4000);
      }
    });

    /* مودال تأیید حذف */
    els.confirmModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-confirm]")) closeConfirmModal();
    });
    els.confirmOk.addEventListener("click", () => {
      const action = confirmAction;
      closeConfirmModal();
      if (action) action();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.categoryModal.hidden) {
        closeCategoryModal();
      }
      if (event.key === "Escape" && !els.confirmModal.hidden) {
        closeConfirmModal();
      }
      if (event.key === "Escape" && !els.managerModal.hidden) {
        closeManagerModal();
      }
      if (event.key === "Escape" && !els.changePasswordModal.hidden) {
        closeChangePasswordModal();
      }
      if (event.key === "Escape" && !els.itemModal.hidden) {
        closeItemModal();
      }
    });

    /* افزودن / ویرایش دسته */
    els.categoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = els.categoryName.value.trim();
      if (!name) {
        toast("نام دسته خالی است", "error");
        return;
      }
      const svg = els.categorySvg.value.trim();
      if (!svg) {
        toast("SVG را وارد کنید", "error");
        return;
      }
      if (!/^<svg[\s>][\s\S]*<\/svg>$/i.test(svg)) {
        toast("SVG معتبر نیست", "error");
        return;
      }
      if (data.categories.some((c) => c.id !== editingCategoryId && c.label === name)) {
        toast("این نام تکراری است", "error");
        return;
      }

      const editingId = editingCategoryId;
      closeCategoryModal();
      try {
        if (editingId) {
          await LuceApi.updateCategory(editingId, { name, icon: svg });
          await refresh();
          renderAll();
          toast("دسته ویرایش شد");
        } else {
          const created = await LuceApi.createCategory(name, svg);
          await refresh();
          activeCategoryId = created.id;
          renderAll();
          toast("دسته افزوده شد");
        }
      } catch (err) {
        toast(err.message || "خطای سرور", "error", 4000);
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

    /* انتخاب دسته با کلیک در تب آیتم‌ها */
    els.itemCategoryPicker.addEventListener("click", (event) => {
      const button = event.target.closest(".category-picker__btn");
      if (!button) return;
      activeCategoryId = button.dataset.id;
      renderCategoryPicker();
      renderItems();
    });

    /* مودال افزودن آیتم */
    els.openItemModal.addEventListener("click", openItemModal);
    els.itemModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-item]")) closeItemModal();
    });
    els.itemForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const category = currentCategory();
      if (!category) {
        toast("دسته انتخاب نشده", "error");
        return;
      }
      const name = els.itemName.value.trim();
      if (!name) {
        toast("نام آیتم خالی است", "error");
        return;
      }
      const items = data.items[category.id] || [];
      if (items.some((i) => i.id !== editingItemId && i.name === name)) {
        toast("این آیتم تکراری است", "error");
        return;
      }

      const editingId = editingItemId;
      closeItemModal();
      if (editingId) {
        runOperation(
          () => LuceApi.updateProduct(editingId, { name }),
          "آیتم ویرایش شد"
        );
      } else {
        runOperation(
          () => LuceApi.createProduct(name, category.id),
          "آیتم افزوده شد"
        );
      }
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
        openConfirmModal(`از حذف آیتم «${item.name}» مطمئن هستید؟`, () => {
          runOperation(
            () => LuceApi.removeProduct(item.id),
            "آیتم حذف شد"
          );
        });
        return;
      }
      if (event.target.closest(".js-edit")) {
        editItem(item);
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
    if (name === "items") {
      renderCategoryPicker();
      renderItems();
    }
  }

  /* ---------- شروع ---------- */
  (async function init() {
    bindEvents();

    if (LuceApi.getToken()) {
      document.body.classList.remove("is-locked");
    } else {
      bindLoginForm();
    }

    try {
      data = await LuceApi.loadData();
      activeCategoryId = data.categories[0]?.id ?? null;
      renderAll();
    } catch (err) {
      toast(err.message || "اتصال به سرور برقرار نیست", "error", 4000);
    }
  })();
})();

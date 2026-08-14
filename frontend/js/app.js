const categories = [
  {
    category: "spressoHotBased",
    text: "بار گرم بر پایه اسپرسو",
    svg: `<svg
            class="category__icon category__icon--fill"
            xmlns="http://www.w3.org/2000/svg"
            width="64px"
            height="64px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 4C3 2.89543 3.89543 2 5 2H17C18.1046 2 19 2.89543 19 4V5.09005C19.3888 5.15136 19.8652 5.25646 20.3511 5.43867C20.9435 5.66081 21.6037 6.01768 22.1224 6.60126C22.6595 7.20549 23 8.00415 23 9C23 9.99585 22.6595 10.7945 22.1224 11.3987C21.6037 11.9823 20.9435 12.3392 20.3511 12.5613C19.8312 12.7563 19.3222 12.863 18.9197 12.9222L18.9186 12.9296C18.8395 13.4569 18.6795 14.1769 18.3494 14.9104C18.0188 15.6451 17.5028 16.4253 16.6968 17.0223C15.8791 17.628 14.8231 18 13.5 18H8.5C7.17691 18 6.12087 17.628 5.30321 17.0223C4.49723 16.4253 3.9812 15.6451 3.65058 14.9104C3.24764 14.015 3.00268 12.9895 3 12.002L3 4ZM19 10.8763V7.12365C19.2094 7.16883 19.4312 7.22971 19.6489 7.31133C20.0565 7.46419 20.3963 7.66982 20.6276 7.92999C20.8405 8.16952 21 8.49585 21 9C21 9.50415 20.8405 9.83049 20.6276 10.07C20.3963 10.3302 20.0565 10.5358 19.6489 10.6887C19.4312 10.7703 19.2094 10.8312 19 10.8763ZM5 11.9973C5.00914 12.7072 5.18467 13.4457 5.47442 14.0896C5.7063 14.6049 6.03403 15.0747 6.49366 15.4152C6.94163 15.747 7.57309 16 8.5 16H13.5C14.4269 16 15.0584 15.747 15.5063 15.4152C15.966 15.0747 16.2937 14.6049 16.5256 14.0896C16.8136 13.4496 16.9975 12.7047 17 11.9974L17 4H5V11.9973Z"
              />
              <path
                d="M23 21C23 20.4477 22.5523 20 22 20H2C1.44772 20 1 20.4477 1 21C1 21.5523 1.44772 22 2 22H22C22.5523 22 23 21.5523 23 21Z"
              />
            </g>
          </svg>
          `,
    isActive: true,
  },
  {
    category: "spressoColdBased",
    text: "بار سرد بر پایه اسپرسو",
    svg: ` <svg
            class="category__icon category__icon--fill category__icon--stroke"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            viewBox="0 0 392.656 392.656"
            xml:space="preserve"
            stroke-width="10px"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                d="M132.067,274.271c-4.418,0-8,3.582-8,8v32.409c0,4.418,3.582,8,8,8h32.409c4.418,0,8-3.582,8-8v-32.409c0-4.418-3.582-8-8-8 H132.067z M156.476,306.681h-16.409v-16.409h16.409V306.681z M256.232,0c-29.789,0-54.024,24.236-54.024,54.026v1.015h-64.75 l-2.591-43.791c-0.261-4.411-4.053-7.76-8.458-7.514c-4.411,0.262-7.774,4.048-7.513,8.459l2.535,42.846H90.396 c-2.2,0-4.303,0.906-5.813,2.504c-1.511,1.599-2.297,3.749-2.174,5.945l16.196,287.771v33.395c0,4.418,3.582,8,8,8h133.577 c4.418,0,8-3.582,8-8v-33.395l11.625-206.517c0.249-4.411-3.126-8.188-7.538-8.437c-4.401-0.243-8.188,3.126-8.437,7.538 l-11.212,199.19H114.167l-12.189-216.571h23.678l6.938,117.246c0.261,4.41,4.045,7.754,8.458,7.514 c4.411-0.262,7.774-4.048,7.513-8.459l-6.881-116.301h34.536c4.418,0,8-3.582,8-8s-3.582-8-8-8h-35.483l-2.333-39.425h63.803v1.396 c0,29.79,24.235,54.026,54.024,54.026c29.791,0,54.028-24.236,54.028-54.026V54.026C310.26,24.236,286.023,0,256.232,0z M114.605,359.037h117.577v17.619H114.605V359.037z M101.078,110.466l-2.219-39.425h23.518l2.333,39.425H101.078z M240.201,106.917 c-12.979-6.06-21.993-19.236-21.993-34.479V54.026c0-19.837,15.268-36.174,34.668-37.88c8.04,10.366,7.073,29.669-2.685,41.844 c-7.291,9.096-11.649,21.282-11.958,33.433C238.095,96.919,238.77,102.135,240.201,106.917z M294.26,72.438 c0,19.839-15.271,36.179-34.677,37.88c-8.901-11.217-6.097-30.854,3.093-42.321c10.053-12.543,14.491-32.112,9.617-48.437 c12.964,6.065,21.967,19.235,21.967,34.467V72.438z M192.892,287.157c0.048,0.001,0.095,0.001,0.143,0.001 c2.07,0,4.063-0.803,5.555-2.243l23.323-22.503c1.527-1.473,2.406-3.492,2.444-5.613c0.038-2.122-0.768-4.172-2.241-5.698 l-22.503-23.323c-3.068-3.179-8.132-3.271-11.312-0.202l-23.323,22.502c-1.527,1.473-2.406,3.492-2.444,5.613 c-0.038,2.122,0.768,4.171,2.241,5.698l22.503,23.324C188.751,286.24,190.77,287.119,192.892,287.157z M193.652,244.644 l11.394,11.81l-11.809,11.394l-11.394-11.81L193.652,244.644z"
              />
            </g>
          </svg>`,
    isActive: false,
  },
  {
    category: "hotDrinks",
    text: "نوشیدنی گرم و دمنوش",
    svg: `<svg
            class="category__icon category__icon--fill"
            xmlns="http://www.w3.org/2000/svg"
            width="64px"
            height="64px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 4C3 2.89543 3.89543 2 5 2H17C18.1046 2 19 2.89543 19 4V5.09005C19.3888 5.15136 19.8652 5.25646 20.3511 5.43867C20.9435 5.66081 21.6037 6.01768 22.1224 6.60126C22.6595 7.20549 23 8.00415 23 9C23 9.99585 22.6595 10.7945 22.1224 11.3987C21.6037 11.9823 20.9435 12.3392 20.3511 12.5613C19.8312 12.7563 19.3222 12.863 18.9197 12.9222L18.9186 12.9296C18.8395 13.4569 18.6795 14.1769 18.3494 14.9104C18.0188 15.6451 17.5028 16.4253 16.6968 17.0223C15.8791 17.628 14.8231 18 13.5 18H8.5C7.17691 18 6.12087 17.628 5.30321 17.0223C4.49723 16.4253 3.9812 15.6451 3.65058 14.9104C3.24764 14.015 3.00268 12.9895 3 12.002L3 4ZM19 10.8763V7.12365C19.2094 7.16883 19.4312 7.22971 19.6489 7.31133C20.0565 7.46419 20.3963 7.66982 20.6276 7.92999C20.8405 8.16952 21 8.49585 21 9C21 9.50415 20.8405 9.83049 20.6276 10.07C20.3963 10.3302 20.0565 10.5358 19.6489 10.6887C19.4312 10.7703 19.2094 10.8312 19 10.8763ZM5 11.9973C5.00914 12.7072 5.18467 13.4457 5.47442 14.0896C5.7063 14.6049 6.03403 15.0747 6.49366 15.4152C6.94163 15.747 7.57309 16 8.5 16H13.5C14.4269 16 15.0584 15.747 15.5063 15.4152C15.966 15.0747 16.2937 14.6049 16.5256 14.0896C16.8136 13.4496 16.9975 12.7047 17 11.9974L17 4H5V11.9973Z"
              />
              <path
                d="M23 21C23 20.4477 22.5523 20 22 20H2C1.44772 20 1 20.4477 1 21C1 21.5523 1.44772 22 2 22H22C22.5523 22 23 21.5523 23 21Z"
              />
            </g>
          </svg>
          `,
    isActive: false,
  },
  {
    category: "coldDrink",
    text: "نوشیدنی سرد",
    svg: `<svg
            class="category__icon category__icon--fill"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Uploaded to svgrepo.com"
            width="64px"
            height="64px"
            viewBox="0 0 32 32"
            xml:space="preserve"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                class="linesandangles_een"
                d="M17,16.833L28,4H4l11,12.833V26h-5v2h12v-2h-5V16.833z M16,14.927L10.92,9h10.16L16,14.927z M23.652,6l-0.857,1H9.206L8.348,6H23.652z"
              />
            </g>
          </svg>
`,
    isActive: false,
  },
  {
    category: "dinner",
    text: "شام",
    svg: `<svg
          class="category__icon category__icon--fill"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="none"
          stroke="none"
          stroke-width="0.00512"
          >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#000CCCCCC"
            stroke-width="2.048"
          />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M464,344.063c0-109.308-84.755-199.193-192-207.39V80H240v56.673c-107.245,8.2-192,98.082-192,207.39V377.17H464Zm-32,1.107H80v-1.107c0-97.046,78.953-176,176-176s176,78.953,176,176Z"
              class="ci-primary"
            />
            <rect width="480" height="32" x="16" y="416" class="ci-primary" />
          </g>
        </svg>
        `,
    isActive: false,
  },
];

const menu = {
  spressoHotBased: [
    {
      name: "اسپرسو سینگل",
      price: 1989889,
    },
    {
      name: "اسپرسو دبل",
      price: 1,
    },
    {
      name: "ماکیاتو",
      price: 10,
    },
    {
      name: "اسپرسو رومانو",
      price: 1,
    },
    {
      name: "اسپرسو کُن‌پانا",
      price: 1,
    },
    {
      name: "اسپرسو کُن‌کانلا",
      price: 1,
    },
    {
      name: "اسپرسو بوم بُن",
      price: 1,
    },
    {
      name: "امریکانو",
      price: 1,
    },
    {
      name: "لاته",
      price: 1,
    },
    {
      name: "موکا",
      price: 1,
    },
    {
      name: "کارامل ماکیاتو",
      price: 1,
    },
    {
      name: "کاپوچینو",
      price: 1,
    },
    {
      name: "وانیلا لاته",
      price: 1,
    },
    {
      name: "هاتزل لاته",
      price: 1,
    },
    {
      name: "سینامون لاته",
      price: 1,
    },
    {
      name: "لوتوس لاته",
      price: 1,
    },
    {
      name: "دالگونا",
      price: 1,
    },
  ],
  spressoColdBased: [
    {
      name: "ایس امریکانو",
      price: 1,
    },
    {
      name: "ایس لاته",
      price: 1,
    },
    {
      name: "ایس کارامل ماکیاتو",
      price: 1,
    },
    {
      name: "ایس موکا",
      price: 1,
    },
    {
      name: "ایس وانیلا لاته",
      price: 1,
    },
    {
      name: "ایس هاتزل لاته",
      price: 1,
    },
    {
      name: "ایس لوتوس لاته",
      price: 1,
    },
    {
      name: "ایس لاته دورو",
      price: 1,
    },
    {
      name: "ایس لاته منتا",
      price: 1,
    },
    {
      name: "افوگاتو",
      price: 1,
    },
  ],
  hotDrinks: [
    {
      name: "چای",
      price: 1,
    },
    {
      name: "هات چاکلت",
      price: 1,
    },
    {
      name: "تی لاته زعفران پسته",
      price: 1,
    },
    {
      name: "چای کرک",
      price: 1,
    },
    {
      name: "چای ماسالا",
      price: 1,
    },
    {
      name: "انواع دمنوش",
      price: 1,
    },
  ],
  coldDrink: [
    {
      name: "موهيتو كلاسيک",
      price: 1,
    },
    {
      name: "موهيتو فراگولا ",
      price: 1,
    },
    {
      name: "موهيتو ويولا ",
      price: 1,
    },
    {
      name: "موهيتو كوييک",
      price: 1,
    },
    {
      name: "موهيتو دورو ",
      price: 1,
    },
    {
      name: "مارين ",
      price: 1,
    },
    {
      name: "جنوا ",
      price: 1,
    },
    {
      name: "ورونا ",
      price: 1,
    },
    {
      name: "فلورنزا",
      price: 1,
    },
    {
      name: "روما سان ست ",
      price: 1,
    },
    {
      name: "ترنتينو",
      price: 1,
    },
  ],
  dinner: [
    {
      name: "اسنک چيكن چيلى ",
      price: 1,
    },
    {
      name: "اسنک چيكن لوچه ",
      price: 1,
    },
    {
      name: "ساندويچ لوسيس",
      price: 1,
    },
  ],
};

const menuElem = document.querySelector(".menu");
const categoriesElem = document.querySelector(".categories");

let lastScrollY = window.scrollY;
let isSmall = false;
const EDGE = 80;
const DELTA = 5;

const showCategoties = () => {
  categoriesElem.innerHTML = "";
  let categoryExample = "";

  categories.forEach((category) => {
    categoryExample = category.category;

    categoriesElem.insertAdjacentHTML(
      "beforeend",
      `
      <div class="category ${
        category.isActive ? "active" : ""
      }" data-category="${category.category}">
        <div class="category__right">
          <span class="category__title">${category.text}</span>
          <span class="category__example">${menu[categoryExample][0]?.name}، ${
            menu[categoryExample][1]?.name
          } و ...</span>
        </div>
        <div class="category__left">
          ${category.svg}
        </div>
      </div>
      `,
    );
  });
};

const chooseMenuCategory = (event) => {
  const selectedCategory = event.target.closest(".category");

  if (selectedCategory) {
    document.querySelector(".active").classList.remove("active");
    selectedCategory.classList.add("active");
    showMenu(selectedCategory.dataset.category);
  }
};

const showMenu = (userSelected) => {
  const categorySelected = userSelected;
  let menuArray = "";

  if (menu[categorySelected]) {
    menuArray = menu[categorySelected];
  } else {
    menuArray = menu.spressoHotBased;
  }

  menuElem.innerHTML = "";

  menuArray.forEach((categorySelected) => {
    menuElem.insertAdjacentHTML(
      "beforeend",
      `
      <div class="menu-item">
        <div>
          <span class="menu-item__name">${categorySelected.name}</span>
        </div>
        <span class="menu-item__price">${categorySelected.price.toLocaleString()} تومان</span>
      </div>
      `,
    );
  });
};

categoriesElem.addEventListener("click", chooseMenuCategory);

window.addEventListener(
  "scroll",
  () => {
    const currentY = window.scrollY;

    if (Math.abs(currentY - lastScrollY) < DELTA) return;

    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );

    const viewportHeight = window.innerHeight;

    const atTop = currentY <= EDGE;
    const atBottom = currentY + viewportHeight >= docHeight - EDGE;

    if (atTop || atBottom) {
      lastScrollY = currentY;
      return;
    }

    const scrollingDown = currentY > lastScrollY;

    if (scrollingDown && !isSmall) {
      document.body.classList.add("small");
      isSmall = true;
    }

    if (!scrollingDown && isSmall) {
      document.body.classList.remove("small");
      isSmall = false;
    }

    lastScrollY = currentY;
  },
  { passive: true },
);

window.addEventListener("load", () => {
  showCategoties();
  showMenu();
});

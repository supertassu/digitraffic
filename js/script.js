---
---
/***This is https://jekyllrb.com/docs/front-matter/ Write javascript under this line***/

// Init parallax elements
var parallaxElements;
var footerElement;

// Init translations object
var t = {{ site.t.js | jsonify }};
var pageLang = "fi";

/* Check if DOM is ready */
if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, false);
}

function init() {
  //console.log("DOM ready");

  //Set parallax elements
  parallaxElements = [].slice.call(document.body.querySelectorAll('.parallax'));
  footerElement = document.body.querySelector('footer');

  // Add parallax effect to elements with ".parallax" and to footer
  parallax();

  // Add menu event listeners
  addEventListeners();

  // Add .header--scrolled if landed in the middle of page
  headerScrolled();

  // Get page language for translations
  getPageLanguage();

  // If Service status section exists, get service status
  document.getElementById("service-status-section") ? getServiceStatus("https://status.digitraffic.fi") : '';

  if (typeof loadDatex2 === "function") {
    loadDatex2();
  } else if (typeof loadTWC === "function") {
    loadTWC();
  } else if (typeof loadApiChanges === "function") {
    loadApiChanges(pageLang);
  }

  if (typeof loadApiStatuses === "function") {
    loadApiStatuses(pageLang);
  }
}


/* On scroll actions */
window.onscroll = () => {

  // Add parallax effect
  parallax();

  // Add .header--scrolled when scrolling page, remove when scrolled to top
  headerScrolled();
}

/* Add event listeners for menu, search and language */
function addEventListeners() {
  let menuElement = document.body.querySelector(".header-menu__item--menu");
  let searchElement = document.body.querySelector(".header-menu__item--search");
  let languageElement = document.body.querySelector(".header-menu__item--language");
  let outsideMenu = document.body.querySelector(".content");

  if (menuElement) {
      menuElement.addEventListener("click", toggleMenu);
  }
    if (searchElement) {
      searchElement.addEventListener("click", toggleSearch);
    }
    if (languageElement) {
      languageElement.addEventListener("click", toggleLanguage);
    }
    if (outsideMenu) {
      outsideMenu.addEventListener("click", closeMenuSearchLanguage);
    }
}

// Add .header--scrolled when scrolling page, remove when scrolled to top
function headerScrolled() {
  var headerClasses = document.body.querySelector(".header").classList;
  if (window.scrollY < 40) {
    if (headerClasses.contains("header--scrolled")) {
      headerClasses.remove("header--scrolled");
    }
  } else {
    if (!headerClasses.contains("header--scrolled")) {
      headerClasses.add("header--scrolled");
    }
  }
}

// Toggle menu function
function toggleMenu() {
  const headerClasses = document.body.querySelector(".header").classList;

  // Toggle menu
  if (headerClasses.contains("header--menu-opened")) {
    closeMenu();
  } else {
    // If search or language is opened, close it
    if (headerClasses.contains("header--search-opened")) {
      closeSearchQuick();
    }
    if (headerClasses.contains("header--language-opened")) {
      closeLanguageQuick();
    }
    openMenu();
  }
}

// Toggle search function
function toggleSearch() {
  const headerClasses = document.body.querySelector(".header").classList;

  // Toggle search
  if (headerClasses.contains("header--search-opened")) {
    closeSearch();
  } else {
    // If menu or language is opened, close it
    if (headerClasses.contains("header--menu-opened")) {
      closeMenuQuick();
    }
    if (headerClasses.contains("header--language-opened")) {
      closeLanguageQuick();
    }
    openSearch();
  }
}

// Toggle language menu function
function toggleLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;

  // Toggle search
  if (headerClasses.contains("header--language-opened")) {
    closeLanguage();
  } else {
    // If menu or search is opened, close it
    if (headerClasses.contains("header--menu-opened")) {
      closeMenuQuick();
    }
    if (headerClasses.contains("header--search-opened")) {
      closeSearchQuick();
    }
    openLanguage();
  }
}

// Close menu, search and language
function closeMenuSearchLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;

  if (headerClasses.contains("header--menu-opened")) {
    closeMenu();
  }

  if (headerClasses.contains("header--search-opened")) {
    closeSearch();
  }

  if (headerClasses.contains("header--language-opened")) {
    closeLanguage();
  }
}

// Open menu
function openMenu() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--menu-opening");
  // bodyClasses.add("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.add("header--menu-opened");
    headerClasses.remove("header--menu-opening");
    },
    1
  );
}

// Close menu
function closeMenu() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--menu-closing");
  headerContentWrapperClasses.add("header__content-wrapper--menu-closing");
  headerClasses.remove("header--menu-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.remove("header--menu-closing");
    },
    150
  );
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-closing");
    },
    300
  );
}

// Quickly close menu
function closeMenuQuick() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerContentWrapperClasses.add("header__content-wrapper--menu-switching");
  headerClasses.remove("header--menu-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-switching");
    },
    150
  );
}

// Open search
function openSearch() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--search-opening");
  // bodyClasses.add("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.add("header--search-opened");
    headerClasses.remove("header--search-opening");
    },
    1
  );
  document.body.querySelector("input.search-opened__input-field").focus();
}

// Close search
function closeSearch() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--search-closing");
  headerContentWrapperClasses.add("header__content-wrapper--search-closing");
  headerClasses.remove("header--search-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.remove("header--search-closing");
    },
    150
  );
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--search-closing");
    },
    300
  );
}

// Quickly close search
function closeSearchQuick() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerContentWrapperClasses.add("header__content-wrapper--menu-switching");
  headerClasses.remove("header--search-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-switching");
    },
    150
  );
}

// Open language
function openLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--language-opening");
  // bodyClasses.add("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.add("header--language-opened");
    headerClasses.remove("header--language-opening");
    },
    1
  );
}

// Close language
function closeLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--language-closing");
  headerContentWrapperClasses.add("header__content-wrapper--language-closing");
  headerClasses.remove("header--language-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.remove("header--language-closing");
    },
    150
  );
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--language-closing");
    },
    300
  );
}

// Quickly close language
function closeLanguageQuick() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerContentWrapperClasses.add("header__content-wrapper--menu-switching");
  headerClasses.remove("header--language-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-switching");
    },
    150
  );
}

/* Parallax function for elements with css class ".parallax" */
function parallax() {
  parallaxElements.forEach(element => {
    if (elementInViewport(element)) {
      let elementCenter = (element.getBoundingClientRect().bottom - element.getBoundingClientRect().top) / 2 + element.getBoundingClientRect().top;
      let windowCenter = window.innerHeight / 2;
      let diffFromCenter = elementCenter - windowCenter;
      let translateY = diffFromCenter / 15;
      element.style.transform = "translate3d(0, " + translateY + "px, 1px)";
    }
  });
}

/* Check if a part of element is in viewport */
function elementInViewport(el) {
  var top = el.offsetTop;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    (top + height) > window.pageYOffset
  );
}

// Get page language
function getPageLanguage() {
  let lang = document.getElementsByTagName("html")[0].getAttribute('lang');
  if (lang) {
    pageLang = lang;
  }
}
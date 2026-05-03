let currentLang = localStorage.getItem("lang") || "pl";

/* ============================
   DYNAMICZNE ŁADOWANIE CSS
============================ */
function loadCSS(path) {
  const old = document.getElementById("dynamic-css");
  if (old) old.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = path + "?v=20260501";
  link.id = "dynamic-css";
  document.head.appendChild(link);
}

/* ============================
   ŁADOWANIE JĘZYKA
============================ */
async function loadLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  const res = await fetch(`lang/${lang}.json`);
  const dict = await res.json();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = dict[key] || key;
  });

  generateSidebar(dict.sections);
}

/* ============================
   SIDEBAR
============================ */
function generateSidebar(sections) {
  const toc = document.getElementById("toc");
  toc.innerHTML = "";

  sections.forEach((section) => {
    const div = document.createElement("div");
    div.className = "toc-section";

    const ul = document.createElement("ul");
    ul.className = "toc-sublist";

    const btn = document.createElement("button");
    btn.className = "toc-toggle";
    btn.textContent = section.title;

    btn.onclick = () => {
      ul.classList.toggle("open");
    };

    div.appendChild(btn);

    section.items.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.href = "#";
      a.textContent = item.title;

      a.onclick = (e) => {
        e.preventDefault();
        clearActiveSidebar();
        a.classList.add("active");
        loadContent(item.file);
      };

      li.appendChild(a);
      ul.appendChild(li);
    });

    div.appendChild(ul);
    toc.appendChild(div);
  });
}

/* ============================
   PODŚWIETLANIE
============================ */
function clearActiveSidebar() {
  document
    .querySelectorAll(".toc-sublist a")
    .forEach((el) => el.classList.remove("active"));
}

/* ============================
   TRYB STRONY
============================ */
function setPageMode(mode) {
  document.body.classList.remove("page-index", "page-article");
  document.body.classList.add(mode === "index" ? "page-index" : "page-article");
}

/* ============================
   ŁADOWANIE TREŚCI
============================ */
async function loadContent(file) {
  setPageMode("article");

  const res = await fetch(file);
  const html = await res.text();
  document.getElementById("content-inner").innerHTML = html;

  const cssMap = {
    inman: "content/inman/styl_inman.css",
    gdt: "content/gdt/styl_gdt.css",
    modal_fem: "content/modal_fem/styl_fem.css",
    modal_matlab: "content/modal_matlab/styl_matlab.css",
    modal_hypermesh: "content/modal_hypermesh/styl_hypermesh.css",
    modal_ansys: "content/modal_ansys/styl_ansys.css",
    industry: "content/industry/styl_industry.css",
    projects: "content/projects/styl_projects.css"
  };

  for (const key in cssMap) {
    if (file.includes(key)) {
      loadCSS(cssMap[key]);
      break;
    }
  }

  if (window.MathJax) MathJax.typesetPromise();
}

/* ============================
   PRZYCISKI JĘZYKA
============================ */
function setupLanguageButtons() {
  const buttons = document.querySelectorAll(".lang-btn");

  buttons.forEach((btn) => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

    btn.onclick = () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const lang = btn.dataset.lang;
      loadLanguage(lang);
    };
  });
}

/* ============================
   START
============================ */
setPageMode("index");
loadLanguage(currentLang);
setupLanguageButtons();

/* ============================
   LIGHTBOX
============================ */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("zoomable")) {
    showLightbox(e.target.src);
  }
});

function showLightbox(src) {
  let lb = document.getElementById("lightbox");

  if (!lb) {
    lb = document.createElement("div");
    lb.id = "lightbox";
    document.body.appendChild(lb);

    lb.onclick = () => {
      lb.style.display = "none";
      document.body.style.overflow = "";
    };

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        lb.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  }

  lb.innerHTML = `<img src="${src}" />`;
  lb.style.display = "flex";
  document.body.style.overflow = "hidden";
}

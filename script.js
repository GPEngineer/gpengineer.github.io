let currentLang = localStorage.getItem("lang") || "pl";

/* ============================
   DYNAMICZNE ŁADOWANIE CSS
============================ */
function loadCSS(path) {
  // usuń poprzedni CSS podstrony
  const old = document.getElementById("dynamic-css");
  if (old) old.remove();

  // dodaj nowy
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = path;
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

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = dict[key] || key;
  });

  generateSidebar(dict.sections);
}

/* ============================
   GENEROWANIE SIDEBARU
============================ */
function generateSidebar(sections) {
  const toc = document.getElementById("toc");
  toc.innerHTML = "";

  sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "toc-section";

    const btn = document.createElement("button");
    btn.className = "toc-toggle";
    btn.textContent = section.title;

    const ul = document.createElement("ul");
    ul.className = "toc-sublist";

    btn.onclick = () => {
      ul.style.display = ul.style.display === "block" ? "none" : "block";
    };

    section.items.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = item.title;
      a.onclick = () => loadContent(item.file);
      li.appendChild(a);
      ul.appendChild(li);
    });

    div.appendChild(btn);
    div.appendChild(ul);
    toc.appendChild(div);
  });
}

/* ============================
   ŁADOWANIE TREŚCI PODSTRONY
============================ */
async function loadContent(file) {
  const res = await fetch(file);
  const html = await res.text();

  document.getElementById("content-inner").innerHTML = html;

  /* === ŁADOWANIE CSS PODSTRONY === */
  if (file.includes("inman")) {
    loadCSS("content/inman/styl_inman.css");
  }
  if (file.includes("gdt")) {
    loadCSS("content/gdt/styl_gdt.css");
  }
  if (file.includes("modal_fem")) {
    loadCSS("content/modal_fem/styl_fem.css");
  }
  if (file.includes("modal_matlab")) {
    loadCSS("content/modal_matlab/styl_matlab.css");
  }
  if (file.includes("modal_hypermesh")) {
    loadCSS("content/modal_hypermesh/styl_hypermesh.css");
  }
  if (file.includes("modal_ansys")) {
    loadCSS("content/modal_ansys/styl_ansys.css");
  }
  if (file.includes("industry")) {
    loadCSS("content/industry/styl_industry.css");
  }

  /* === MathJax === */
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

/* ============================
   OBSŁUGA PRZYCISKÓW JĘZYKOWYCH
============================ */
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadLanguage(btn.dataset.lang);
  };
});

/* ============================
   START
============================ */
loadLanguage(currentLang);

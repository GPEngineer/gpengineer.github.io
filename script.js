let currentLang = localStorage.getItem("lang") || "pl";

async function loadLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  const res = await fetch(`lang/${lang}.json`);
  const dict = await res.json();

  // Tłumaczenia interfejsu
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = dict[key] || key;
  });

  // Generowanie sidebaru
  generateSidebar(dict.sections);
}

function generateSidebar(sections) {
  const toc = document.getElementById("toc");
  toc.innerHTML = "";

  sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "toc-section";

    const btn = document.createElement("button");
    btn.className = "toc-toggle";
    btn.textContent = section.title;
    btn.onclick = () => {
      ul.style.display = ul.style.display === "block" ? "none" : "block";
    };

    const ul = document.createElement("ul");
    ul.className = "toc-sublist";

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

async function loadContent(file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById("content-inner").innerHTML = html;
}

// Obsługa przycisków językowych
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadLanguage(btn.dataset.lang);
  };
});

// Start
loadLanguage(currentLang);

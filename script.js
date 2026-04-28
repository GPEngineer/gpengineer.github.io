document.addEventListener("DOMContentLoaded", () => {
    const tocToggles = document.querySelectorAll(".toc-toggle");
    const tocLinks = document.querySelectorAll(".toc-sublist a");
    const contentInner = document.getElementById("content-inner");
    const langButtons = document.querySelectorAll(".lang-btn");

    // Rozwijanie / zwijanie sekcji TOC
    tocToggles.forEach(btn => {
        btn.addEventListener("click", () => {
            const section = btn.getAttribute("data-section");
            const sublist = document.querySelector(`.toc-sublist[data-section="${section}"]`);
            if (!sublist) return;
            const isVisible = sublist.style.display === "block";
            sublist.style.display = isVisible ? "none" : "block";
        });
    });

    // Ładowanie treści
    tocLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const url = link.getAttribute("data-content");
            if (!url) return;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    contentInner.innerHTML = `<h1>Błąd</h1><p>Nie udało się załadować treści: ${url}</p>`;
                    return;
                }
                const html = await response.text();
                contentInner.innerHTML = html;
            } catch (err) {
                contentInner.innerHTML = `<h1>Błąd</h1><p>Wystąpił problem podczas ładowania treści.</p>`;
            }
        });
    });

    // Wybór języka – na razie tylko zaznaczenie aktywnego
    langButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang");
            langButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            console.log("Wybrany język:", lang);
            // tu później można dodać ładowanie plików lang/*.json
        });
    });
});

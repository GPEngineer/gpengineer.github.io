const fs = require("fs");
const path = require("path");

const README_FILE = "README.md";

// Foldery, które mają być uwzględnione
const DIRECTORIES = ["docs", "src", "content"];

// Znaczniki w README
const START_TAG = "<!-- STRUCTURE_START -->";
const END_TAG = "<!-- STRUCTURE_END -->";

// ANSI kolory (ładne w terminalu)
const colors = {
  folder: "\x1b[36m", // cyan
  file: "\x1b[33m", // yellow
  reset: "\x1b[0m",
};

// Generowanie drzewa z linkami
function generateTree(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  let tree = "";

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");
    const fullPath = path.join(dir, item.name).replace(/\\/g, "/");

    if (item.isDirectory()) {
      tree += `${prefix}${pointer}${colors.folder}${item.name}/${colors.reset}\n`;
      tree += generateTree(fullPath, nextPrefix);
    } else {
      tree += `${prefix}${pointer}${colors.file}[${item.name}](${fullPath})${colors.reset}\n`;
    }
  });

  return tree;
}

// Generowanie struktury dla wielu folderów
function generateFullStructure() {
  let output = "";

  DIRECTORIES.forEach((dir) => {
    if (fs.existsSync(dir)) {
      output += `${dir}/\n`;
      output += generateTree(dir, "");
      output += "\n";
    }
  });

  return output;
}

// Wczytaj README
let readme = fs.readFileSync(README_FILE, "utf8");

// Sprawdź znaczniki
if (!readme.includes(START_TAG) || !readme.includes(END_TAG)) {
  console.error("❌ README.md does not contain structure markers.");
  console.error(`Add:\n${START_TAG}\n${END_TAG}`);
  process.exit(1);
}

// Wygeneruj strukturę
const tree = generateFullStructure();

// Sekcja do wstawienia
const newSection = `${START_TAG}\n\n\`\`\`\n${tree}\`\`\`\n\n${END_TAG}`;

// Zamień starą sekcję
const updatedReadme = readme.replace(
  new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, "m"),
  newSection,
);

// Zapisz README
fs.writeFileSync(README_FILE, updatedReadme, "utf8");

console.log("✔ README.md updated with fresh directory structure.");
console.log("✔ ANSI-colored tree printed below:\n");
console.log(tree);

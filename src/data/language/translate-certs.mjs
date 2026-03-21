// scripts/translate-certs.mjs
// ─────────────────────────────────────────────────────────────
// Automatiza a tradução dos títulos de certificados para EN e ES
// usando LibreTranslate (grátis, sem chave de API).
//
// Como usar:
//   1. Adicione o novo certificado em CERTS_SOURCE abaixo
//   2. Rode: node scripts/translate-certs.mjs
//   3. Os arquivos de tradução serão atualizados automaticamente
// ─────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/data/language");

// ─────────────────────────────────────────────────────────────
// ── EDITE AQUI quando adicionar um novo certificado
// issuer (emissor) não é traduzido — é nome de instituição
// ─────────────────────────────────────────────────────────────
const CERTS_SOURCE = [
  { id: "cert-1",  title: "Bootcamp Nexa + AWS - Fundamentos de IA Generativa com BedRock" },
  { id: "cert-2",  title: "Curso de Inglês - Beginner 1-2"                                 },
  { id: "cert-3",  title: "Criando um site simples (HTML, CSS e JavaScript)"                },
  { id: "cert-4",  title: "Imersão Front-end 2° Edição"                                    },
  { id: "cert-5",  title: "Curso de Python"                                                 },
  { id: "cert-6",  title: "Curso de HTML"                                                   },
  { id: "cert-7",  title: "Curso Complementar de Inglês"                                   },
  { id: "cert-8",  title: "Informática Essencial"                                           },
  { id: "cert-9",  title: "Atendente de Farmácia"                                           },
  // ── Adicione novos certificados aqui:
  // { id: "cert-10", title: "Nome do curso em português" },
];
// ─────────────────────────────────────────────────────────────

async function translate(text, targetLang) {
  if (!text || text.trim().length < 3) return text;
  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "pt", target: targetLang, format: "text" }),
    });
    if (!res.ok) { console.warn(`  ⚠ API retornou ${res.status}`); return `TODO: ${text}`; }
    const data = await res.json();
    return data.translatedText || `TODO: ${text}`;
  } catch (err) {
    console.warn(`  ⚠ Erro: ${err.message}`);
    return `TODO: ${text}`;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function updateJson(lang, titles) {
  const fileMap = { pt: "translation.json", en: "translationEN.json", es: "translationES.json" };
  const filePath = path.join(LOCALES_DIR, fileMap[lang]);
  if (!fs.existsSync(filePath)) { console.error(`  ✗ Não encontrado: ${filePath}`); return; }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!data.certs) data.certs = {};
  if (!data.certs.titles) data.certs.titles = {};

  // Atualiza só os títulos — preserva outras chaves (tag, subtitle, close, alt)
  Object.assign(data.certs.titles, titles);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✓ ${fileMap[lang]} atualizado`);
}

async function main() {
  console.log("🌍 Traduzindo certificados...\n");

  // PT — sem API
  console.log("📝 Salvando PT...");
  const ptTitles = Object.fromEntries(CERTS_SOURCE.map((c) => [c.id, c.title]));
  updateJson("pt", ptTitles);
  console.log();

  for (const lang of ["en", "es"]) {
    console.log(`🔄 Traduzindo para ${lang.toUpperCase()}...`);
    const titles = {};

    for (const cert of CERTS_SOURCE) {
      console.log(`  → ${cert.id}: ${cert.title.slice(0, 40)}...`);
      titles[cert.id] = await translate(cert.title, lang);
      await sleep(200);
    }

    updateJson(lang, titles);
    console.log();
  }

  console.log("✅ Certificados traduzidos!");
  console.log("💡 Revise textos com 'TODO:' nos JSONs.\n");
}

main().catch(console.error);

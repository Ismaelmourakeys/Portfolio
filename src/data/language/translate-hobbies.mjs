// scripts/translate-hobbies.mjs
// ─────────────────────────────────────────────────────────────
// Automatiza a tradução dos textos de Hobbies.jsx para EN e ES
// usando LibreTranslate (grátis, sem chave de API).
//
// Como usar:
//   1. Edite HOBBIES_SOURCE abaixo com seus dados em português
//   2. Rode: node scripts/translate-hobbies.mjs
//   3. Os arquivos locales/en/ e locales/es/ serão atualizados
//
// ─────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/data/language");

// ─────────────────────────────────────────────────────────────
// ── EDITE AQUI quando adicionar ou alterar um hobby
// ─────────────────────────────────────────────────────────────
const HOBBIES_SOURCE = [
  {
    id: "tecnologia",
    label: "aprendizado",
    title: "O que venho estudando atualmente?",
    description: "Sigo aprimorando minhas habilidades no desenvolvimento web com HTML, CSS (Tailwind), JavaScript e React, criando projetos para fortalecer minha lógica de programação.",
    tags: ["HTML", "CSS", "JavaScript", "React", "Vitejs", "Tailwind", "Node.js"],
    captions: [
      "Portfólio com React",
      "Contador - Projeto simples para praticar designer e lógica de programação",
      "Projeto de Dark Mode - projeto simples para revisar conceitos",
    ],
  },
  {
    id: "Farmácia",
    label: "experiência profissional",
    title: "Minha Jornada antes do código",
    description: "Após atuar como professor e músico, também tive uma experiência profissional na área da farmácia antes de iniciar minha jornada na programação.",
    tags: ["Farmácia", "Faculdade", "Laboratório", "Trabalho"],
    captions: ["Farmácia", "Laboratório", "Farmácia Magistral", "Farmácia Magistral"],
  },
  {
    id: "musica",
    label: "música",
    title: "Compartilhar minha paixão pela música",
    description: "Alguns lugares que já participei como músico, professor de música e marketing pessoal nas redes sociais.",
    tags: ["Músico", "Teclado", "Eventos", "Projetos", "Aulas"],
    captions: [
      "Evento de igreja",
      "Festividades",
      "Escola de música Opendoors",
      "Aulas de teclado",
      "Gravação da música para portfólio",
      "Marketing Pessoal com vídeos",
    ],
  },
  {
    id: "ETEC",
    label: "Momentos na ETEC",
    title: "Minha experiências na ETEC",
    description: "Alguns momentos que marcaram minha jornada na ETEC, desde projetos acadêmicos até atividades extracurriculares.",
    tags: ["Apresentações", "Projetos", "Visitas técnicas", "Eventos", "Conquistas"],
    captions: [
      "Visita à Amazon",
      "Apresentação - semana de DS",
      "Visita à Fetesp",
      "Apresentação de TCC",
      "Turma da ETEC 3°I",
      "Professor de Design - Antonio (Lobinho)",
      "Professor Alexandre Valezzi (Dom)",
    ],
  },
];
// ─────────────────────────────────────────────────────────────

// ── Função de tradução via LibreTranslate
// Usa a instância pública gratuita em libretranslate.com
async function translate(text, targetLang) {
  // Textos muito curtos ou técnicos (tags) não precisam traduzir
  if (!text || text.trim().length < 3) return text;

  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "pt",
        target: targetLang,
        format: "text",
        // api_key não é necessário para a instância pública
        // mas pode adicionar se tiver uma chave: api_key: "sua-chave"
      }),
    });

    if (!res.ok) {
      console.warn(`  ⚠ LibreTranslate retornou ${res.status} para: "${text.slice(0, 40)}..."`);
      return `TODO: ${text}`; // fallback se a API falhar
    }

    const data = await res.json();
    return data.translatedText || `TODO: ${text}`;
  } catch (err) {
    console.warn(`  ⚠ Erro de rede: ${err.message}`);
    return `TODO: ${text}`;
  }
}

// ── Pausa entre requests para não sobrecarregar a API pública
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Traduz um hobby inteiro para um idioma
async function translateHobby(hobby, lang) {
  console.log(`  Traduzindo hobby "${hobby.id}" para ${lang}...`);

  const [label, title, description] = await Promise.all([
    translate(hobby.label, lang),
    translate(hobby.title, lang),
    translate(hobby.description, lang),
  ]);

  await sleep(300); // pausa entre batches

  // Tags técnicas (HTML, CSS, etc.) não precisam traduzir
  // Tags em português são traduzidas
  const tags = [];
  for (const tag of hobby.tags) {
    // Detecta se é termo técnico (sem espaço, maiúscula ou sigla)
    const isTechnical = /^[A-Z]/.test(tag) || !tag.includes(" ");
    tags.push(isTechnical ? tag : await translate(tag, lang));
    await sleep(100);
  }

  // Captions das mídias
  const captions = [];
  for (const caption of hobby.captions) {
    captions.push(await translate(caption, lang));
    await sleep(150);
  }

  return { label, title, description, tags, captions };
}

// ── Atualiza o JSON de um idioma
function updateJson(lang, items) {
  // Mapeia pt → translation.json, en → translationEN.json, es → translationES.json
  const fileMap = {
    pt: "translation.json",
    en: "translationEN.json",
    es: "translationES.json",
  };

  const filePath = path.join(LOCALES_DIR, fileMap[lang]);

  if (!fs.existsSync(filePath)) {
    console.error(`  ✗ Arquivo não encontrado: ${filePath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Garante que a estrutura existe
  if (!data.hobbies) data.hobbies = {};
  if (!data.hobbies.items) data.hobbies.items = {};

  // Atualiza cada hobby
  items.forEach(({ id, translated }) => {
    data.hobbies.items[id] = translated;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✓ ${fileMap[lang]} atualizado`);
}

// ── Main
async function main() {
  console.log("🌍 Iniciando tradução automática dos Hobbies...\n");

  // Primeiro salva o PT (fonte, sem precisar de API)
  console.log("📝 Salvando português (PT)...");
  const ptItems = HOBBIES_SOURCE.map((h) => ({
    id: h.id,
    translated: {
      label:       h.label,
      title:       h.title,
      description: h.description,
      tags:        h.tags,
      captions:    h.captions,
    },
  }));
  updateJson("pt", ptItems);
  console.log();

  // Traduz para EN e ES
  for (const lang of ["en", "es"]) {
    console.log(`🔄 Traduzindo para ${lang.toUpperCase()}...`);
    const items = [];

    for (const hobby of HOBBIES_SOURCE) {
      const translated = await translateHobby(hobby, lang);
      items.push({ id: hobby.id, translated });
      await sleep(500); // pausa entre hobbies
    }

    updateJson(lang, items);
    console.log();
  }

  console.log("✅ Tradução concluída!");
  console.log("\n💡 Dica: Revise os textos traduzidos nos arquivos JSON.");
  console.log("   Textos marcados com 'TODO:' precisam de tradução manual.\n");
}

main().catch(console.error);

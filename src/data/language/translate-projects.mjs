// scripts/translate-projects.mjs
// ─────────────────────────────────────────────────────────────
// Automatiza a tradução dos projetos para EN e ES
// usando LibreTranslate (grátis, sem chave de API).
//
// Como usar:
//   1. Adicione o novo projeto em PROJECTS_SOURCE abaixo (em português)
//   2. Rode: node scripts/translate-projects.mjs
//   3. Os arquivos de tradução serão atualizados automaticamente
// ─────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/data/language");

// ─────────────────────────────────────────────────────────────
// ── EDITE AQUI quando adicionar ou alterar um projeto
// Campos técnicos (techs, urls, imageSrc, videoSrc, tagColor)
// ficam no Projects.jsx — só textos vêm aqui
// ─────────────────────────────────────────────────────────────
const PROJECTS_SOURCE = [
  {
    id: "mygluco-site",
    tag: "Site Page",                    // tag técnica — não traduz
    title: "Website – MyGluco",
    description: "Landing page para o sistema MyGluco, com foco em usabilidade e experiência do usuário. Apresenta funcionalidades, benefícios e conscientização sobre diabetes.",
    detailsDescription: "Estrutura HTML, estilos com Tailwind via CDN, comportamento com JavaScript e backend/serviços com Firebase.",
  },
  {
    id: "mygluco-app",
    tag: "App Mobile",
    title: "Aplicativo Mobile – MyGluco",
    description: "App mobile para gestão de diabetes: monitore glicose, refeições, atividades e medicamentos com gráficos, relatórios e notificações personalizadas.",
    detailsDescription: "React Native + Firebase para auth e dados. Node.js/NPM para dependências, Expo Go para testes e Figma para os primeiros designs.",
  },
  {
    id: "etec",
    tag: "Acadêmico",
    title: "Projetos em Sala – ETEC",
    description: "Mix de projetos com foco em lógica de programação usando HTML, CSS e JS. Desenvolvidos na ETEC: listas de exercícios, sistemas de login e cadastro.",
    detailsDescription: "Estrutura HTML, estilos CSS e comportamento JavaScript. Foco em lógica de programação, navegação entre páginas, login e armazenamento local.",
  },
  {
    id: "kivy-app",
    tag: "Projeto",
    title: "Aplicação Mobile com Python (Kivy)",
    description: "Sistema criado em Python com framework Kivy. Inclui funcionalidades de login e consulta de dados. Projeto introdutório sobre estrutura de apps mobile.",
    detailsDescription: "Python com framework Kivy para criação de interfaces móveis multiplataforma. Foco em lógica, navegação entre telas e widgets.",
  },
  // ── Adicione novos projetos aqui seguindo o mesmo padrão:
  // {
  //   id: "novo-projeto",
  //   tag: "Tag",           ← não traduz (nome técnico)
  //   title: "Título",
  //   description: "Descrição completa...",
  //   detailsDescription: "Detalhes técnicos...",
  // },
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

function updateJson(lang, items) {
  const fileMap = { pt: "translation.json", en: "translationEN.json", es: "translationES.json" };
  const filePath = path.join(LOCALES_DIR, fileMap[lang]);
  if (!fs.existsSync(filePath)) { console.error(`  ✗ Não encontrado: ${filePath}`); return; }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!data.projects) data.projects = {};
  if (!data.projects.items) data.projects.items = {};

  items.forEach(({ id, translated }) => { data.projects.items[id] = translated; });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✓ ${fileMap[lang]} atualizado`);
}

async function main() {
  console.log("🌍 Traduzindo projetos...\n");

  // Salva PT sem precisar de API
  console.log("📝 Salvando PT...");
  updateJson("pt", PROJECTS_SOURCE.map((p) => ({
    id: p.id,
    translated: { tag: p.tag, title: p.title, description: p.description, detailsDescription: p.detailsDescription },
  })));
  console.log();

  for (const lang of ["en", "es"]) {
    console.log(`🔄 Traduzindo para ${lang.toUpperCase()}...`);
    const items = [];

    for (const project of PROJECTS_SOURCE) {
      console.log(`  → ${project.id}`);
      const [title, description, detailsDescription] = await Promise.all([
        translate(project.title, lang),
        translate(project.description, lang),
        translate(project.detailsDescription, lang),
      ]);
      await sleep(400);
      // tag não traduz — é nome técnico (Site Page, App Mobile, etc.)
      items.push({ id: project.id, translated: { tag: project.tag, title, description, detailsDescription } });
    }

    updateJson(lang, items);
    console.log();
  }

  console.log("✅ Projetos traduzidos!");
  console.log("💡 Revise textos com 'TODO:' nos JSONs.\n");
}

main().catch(console.error);

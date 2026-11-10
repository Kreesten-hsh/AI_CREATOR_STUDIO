#!/usr/bin/env node
/**
 * scripts/generate-access-guide-pdf.js
 * Génération reproductible du modèle de Guide d'Accès PDF client
 * à partir de la source Markdown `docs/guides/GUIDE-ACCES-CLIENT-SOURCE.md`.
 *
 * Produit : `public/downloads/GUIDE-ACCES-CLIENT-MODELE.pdf`
 */

import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceMdPath = path.join(rootDir, 'docs', 'guides', 'GUIDE-ACCES-CLIENT-SOURCE.md');
const outputPdfPath = path.join(rootDir, 'public', 'downloads', 'GUIDE-ACCES-CLIENT-MODELE.pdf');

const REQUIRED_PLACEHOLDERS = [
  '[NOM DE VOTRE APPLICATION]',
  '[DESCRIPTION DE VOTRE APPLICATION]',
  '[VOTRE LIEN NETLIFY]',
  "[VOTRE CODE D'ACCÈS]",
  '[VOTRE EMAIL]',
  '[VOTRE DÉLAI DE RÉPONSE]',
];

const REQUIRED_SECTIONS = [
  '## 1. Présentation du produit',
  '## 2. Lien direct',
  "## 3. Code d'accès",
  '## 4. Utilisation sur ordinateur',
  '## 5. Utilisation sur smartphone et tablette',
  '## 6. Sauvegarde des données',
  '## 7. Export et import JSON',
  '## 8. Dépannage',
  '## 9. Contact',
  '## 10. Mises à jour',
];

function escapeHtml(raw) {
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInlineMarkdown(rawText) {
  const escaped = escapeHtml(rawText);

  // Extract inline code spans first to protect their contents
  const codeSpans = [];
  let processed = escaped.replace(/`([^`]+)`/g, (_match, codeContent) => {
    const index = codeSpans.length;
    const isPlaceholder = /^\[.+\]$/.test(codeContent.trim());
    codeSpans.push(
      isPlaceholder
        ? `<code class="placeholder-code" style="font-family: monospace; font-weight: bold; background-color: #fef3c7; color: #92400e;">${codeContent}</code>`
        : `<code style="font-family: monospace; background-color: #f1f5f9; color: #0f172a;">${codeContent}</code>`
    );
    return `@@CODESPAN_${index}@@`;
  });

  // Markdown links [label](https://...)
  processed = processed.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" style="color: #1d4ed8; text-decoration: underline;">$1</a>'
  );

  // Bold **...**
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic *...*
  processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Highlight customizable bracketed fields [VOTRE ...] / [NOM ...] / [DESCRIPTION ...]
  processed = processed.replace(
    /\[([A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ0-9\s'’_-]{4,})\]/g,
    '<span class="placeholder-tag" style="font-family: monospace; font-weight: bold; background-color: #fef3c7; color: #92400e;">[$1]</span>'
  );

  // Restore code spans
  processed = processed.replace(/@@CODESPAN_(\d+)@@/g, (_match, idx) => codeSpans[Number(idx)]);

  return processed;
}

/**
 * Convertit le Markdown structuré du Guide d'Accès en HTML sémantique propre
 * sans dépendance externe. Supporte : titres (#, ##, ###), paragraphes,
 * citations (>), listes ordonnées et non ordonnées (avec sous-listes),
 * séparateurs (---) et tableaux Markdown (| ... |).
 */
export function convertMarkdownToHtmlBody(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts = [];
  let inSection = false;
  let i = 0;

  const closeOpenSection = () => {
    if (inSection) {
      htmlParts.push('</section>');
      inSection = false;
    }
  };

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      i += 1;
      continue;
    }

    // H1
    if (trimmed.startsWith('# ')) {
      closeOpenSection();
      const titleText = formatInlineMarkdown(trimmed.slice(2).trim());
      htmlParts.push(
        `<header class="doc-header"><p style="font-size: 8pt; font-weight: bold; letter-spacing: 0.06em; text-transform: uppercase; color: #475569; margin: 0 0 2px 0;">MODÈLE À PERSONNALISER • AI CREATOR STUDIO</p><h1 style="font-size: 14.5pt; font-weight: bold; color: #0f172a; margin: 0 0 5px 0;">${titleText}</h1></header>`
      );
      i += 1;
      continue;
    }

    // H2 (opens a cohesive section)
    if (trimmed.startsWith('## ')) {
      closeOpenSection();
      inSection = true;
      const headingRaw = trimmed.slice(3).trim();
      const headingText = formatInlineMarkdown(headingRaw);
      const isPage2Start = headingRaw.startsWith('6.');
      const pageBreakStyle = isPage2Start ? 'page-break-before: always; break-before: page;' : '';
      htmlParts.push(
        `<section class="guide-section" style="break-inside: avoid; page-break-inside: avoid; ${pageBreakStyle}"><h2 style="font-size: 10.5pt; font-weight: bold; color: #0f172a; margin: 6px 0 2px 0; page-break-after: avoid; ${pageBreakStyle}">${headingText}</h2>`
      );
      i += 1;
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      const headingText = formatInlineMarkdown(trimmed.slice(4).trim());
      htmlParts.push(`<h3 style="font-size: 9.5pt; font-weight: bold; color: #1e293b; margin: 4px 0 2px 0;">${headingText}</h3>`);
      i += 1;
      continue;
    }

    // Blockquote (rendered as a clean bordered callout table so both Chrome and LibreOffice render the box)
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      const quoteHtml = quoteLines.map((q) => formatInlineMarkdown(q)).join('<br />');
      htmlParts.push(
        `<table class="creator-notice" width="100%" border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%; border: 1px solid #d97706; background-color: #fffbeb; margin: 4px 0 6px 0;"><tr><td bgcolor="#fffbeb" style="background-color: #fffbeb; color: #78350f; font-size: 8.5pt; line-height: 1.25; border: 1px solid #d97706;">${quoteHtml}</td></tr></table>`
      );
      continue;
    }

    // Markdown Table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith('|') &&
        lines[i].trim().endsWith('|')
      ) {
        tableLines.push(lines[i].trim());
        i += 1;
      }

      if (tableLines.length >= 2) {
        const parseRow = (rowStr) =>
          rowStr
            .slice(1, -1)
            .split('|')
            .map((cell) => cell.trim());

        const headerCells = parseRow(tableLines[0]);
        const bodyRows = tableLines
          .slice(1)
          .filter((row) => !/^\|[\s:|-]+\|$/.test(row))
          .map(parseRow);

        const thead = `<thead><tr>${headerCells
          .map(
            (c) =>
              `<th bgcolor="#f1f5f9" style="background-color: #f1f5f9; font-weight: bold; color: #0f172a; border: 1px solid #94a3b8; padding: 3px 6px; text-align: left;">${formatInlineMarkdown(c)}</th>`
          )
          .join('')}</tr></thead>`;
        const tbody = `<tbody>${bodyRows
          .map(
            (row) =>
              `<tr>${row
                .map(
                  (c) =>
                    `<td style="border: 1px solid #94a3b8; padding: 3px 6px; text-align: left; vertical-align: top;">${formatInlineMarkdown(c)}</td>`
                )
                .join('')}</tr>`
          )
          .join('')}</tbody>`;

        htmlParts.push(
          `<table class="guide-table" width="100%" border="1" cellspacing="0" cellpadding="3" style="border-collapse: collapse; width: 100%; font-size: 8.5pt; margin: 3px 0 4px 0;">${thead}${tbody}</table>`
        );
      }
      continue;
    }

    // Unordered or Ordered Lists (supporting indented sub-bullets and continuation lines)
    if (/^(-|\d+\.)\s+/.test(trimmed)) {
      const isOrdered = /^\d+\.\s+/.test(trimmed);
      const listTag = isOrdered ? 'ol' : 'ul';
      const items = [];

      while (i < lines.length) {
        const currentRaw = lines[i];
        const currentTrim = currentRaw.trim();
        if (!currentTrim) break;

        const isTopBullet = isOrdered
          ? /^\d+\.\s+/.test(currentTrim) && !/^\s{2,}/.test(currentRaw)
          : /^-\s+/.test(currentTrim) && !/^\s{2,}/.test(currentRaw);

        if (isTopBullet) {
          const itemText = currentTrim.replace(/^(-|\d+\.)\s+/, '');
          items.push({ text: [formatInlineMarkdown(itemText)], subItems: [] });
          i += 1;
          continue;
        }

        // Indented sub-bullet
        if (/^\s{2,}-\s+/.test(currentRaw) && items.length > 0) {
          const subText = currentTrim.replace(/^-\s+/, '');
          items[items.length - 1].subItems.push(formatInlineMarkdown(subText));
          i += 1;
          continue;
        }

        // Indented continuation line of current list item
        if (/^\s{2,}\S/.test(currentRaw) && items.length > 0) {
          items[items.length - 1].text.push(formatInlineMarkdown(currentTrim));
          i += 1;
          continue;
        }

        break;
      }

      const listHtml = items
        .map((item) => {
          const mainContent = item.text.join(' ');
          const subHtml =
            item.subItems.length > 0
              ? `<ul class="sub-list" style="margin: 1px 0 1px 14px;">${item.subItems
                  .map((sub) => `<li style="margin-bottom: 1px;">${sub}</li>`)
                  .join('')}</ul>`
              : '';
          return `<li style="margin-bottom: 1px;">${mainContent}${subHtml}</li>`;
        })
        .join('');

      htmlParts.push(`<${listTag} style="margin: 2px 0 3px 16px; padding: 0;">${listHtml}</${listTag}>`);
      continue;
    }

    // Standard Paragraph
    const paragraphLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^(-|\d+\.)\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(formatInlineMarkdown(lines[i].trim()));
      i += 1;
    }
    htmlParts.push(`<p style="margin: 2px 0 3px 0;">${paragraphLines.join(' ')}</p>`);
  }

  closeOpenSection();
  return htmlParts.join('\n');
}

function buildHtmlDocument(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Guide d'Accès Client : Modèle Personnalisable</title>
  <style>
    @page {
      size: A4;
      margin: 10mm 14mm 10mm 14mm;
    }
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: "Liberation Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.26;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .guide-section {
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    h2 {
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
      break-after: avoid;
      page-break-after: avoid;
    }
    .guide-table {
      width: 100%;
      border-collapse: collapse;
      break-inside: avoid;
      page-break-inside: avoid;
    }
  </style>
</head>
<body style="font-family: 'Liberation Sans', Arial, sans-serif; font-size: 9pt; line-height: 1.26; color: #1e293b;">
${bodyHtml}
</body>
</html>`;
}

function findPdfEngine() {
  const chromeCandidates = [
    process.env.CHROME_BIN,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);

  for (const bin of chromeCandidates) {
    try {
      const resolved = execSync(`command -v "${bin}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (resolved && fs.existsSync(resolved)) {
        return { kind: 'chrome', bin: resolved };
      }
    } catch {
      // Continue searching
    }
  }

  try {
    const libreOfficeBin = execSync('command -v libreoffice', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (libreOfficeBin && fs.existsSync(libreOfficeBin)) {
      return { kind: 'libreoffice', bin: libreOfficeBin };
    }
  } catch {
    // Continue
  }

  return null;
}

function validateMarkdownSource(content) {
  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      throw new Error(`Section obligatoire manquante dans GUIDE-ACCES-CLIENT-SOURCE.md : "${section}"`);
    }
  }

  for (const placeholder of REQUIRED_PLACEHOLDERS) {
    if (!content.includes(placeholder)) {
      throw new Error(
        `Champ personnalisable manquant dans GUIDE-ACCES-CLIENT-SOURCE.md : "${placeholder}"`
      );
    }
  }

  if (content.includes('CREATOR2026')) {
    throw new Error(
      'Le modèle GUIDE-ACCES-CLIENT-SOURCE.md ne doit pas imposer CREATOR2026 comme code universel.'
    );
  }
}

function generateAccessGuidePdf() {
  console.log("📄 Génération reproductible du modèle de Guide d'Accès PDF...");

  if (!fs.existsSync(sourceMdPath)) {
    throw new Error(`Fichier source introuvable : ${sourceMdPath}`);
  }

  const markdownContent = fs.readFileSync(sourceMdPath, 'utf-8');
  validateMarkdownSource(markdownContent);

  const engine = findPdfEngine();
  if (!engine) {
    throw new Error(
      'Prérequis manquant : aucun moteur PDF (Chromium / Google Chrome ou LibreOffice) disponible dans lenvironnement.'
    );
  }

  const outputDir = path.dirname(outputPdfPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-creator-guide-pdf-'));
  const tempHtmlPath = path.join(tempDir, 'GUIDE-ACCES-CLIENT-MODELE.html');

  try {
    const htmlBody = convertMarkdownToHtmlBody(markdownContent);
    const fullHtml = buildHtmlDocument(htmlBody);
    fs.writeFileSync(tempHtmlPath, fullHtml, 'utf-8');

    if (fs.existsSync(outputPdfPath)) {
      fs.unlinkSync(outputPdfPath);
    }

    if (engine.kind === 'chrome') {
      execFileSync(
        engine.bin,
        [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--no-pdf-header-footer',
          `--print-to-pdf=${outputPdfPath}`,
          `file://${tempHtmlPath}`,
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] }
      );
    } else {
      const loProfileDir = path.join(tempDir, 'lo-profile');
      execFileSync(
        engine.bin,
        [
          '--headless',
          `-env:UserInstallation=file://${loProfileDir}`,
          '--convert-to',
          'pdf',
          '--outdir',
          tempDir,
          tempHtmlPath,
        ],
        {
          env: { ...process.env, HOME: tempDir },
          stdio: ['ignore', 'pipe', 'pipe'],
        }
      );
      const generatedTempPdf = path.join(tempDir, 'GUIDE-ACCES-CLIENT-MODELE.pdf');
      if (!fs.existsSync(generatedTempPdf)) {
        throw new Error('LibreOffice na pas produit le fichier PDF attendu.');
      }
      fs.copyFileSync(generatedTempPdf, outputPdfPath);
    }

    if (!fs.existsSync(outputPdfPath)) {
      throw new Error('Le fichier PDF na pas été créé.');
    }

    const stat = fs.statSync(outputPdfPath);
    if (stat.size <= 0) {
      throw new Error('Le fichier PDF généré est vide (0 octet).');
    }

    const buffer = fs.readFileSync(outputPdfPath);
    const header = buffer.subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') {
      throw new Error(`En-tête PDF invalide : reçu "${header}", attendu "%PDF-".`);
    }

    console.log('✅ Modèle de Guide d’Accès PDF généré avec succès !');
    console.log(`   - Moteur : ${engine.kind} (${engine.bin})`);
    console.log(`   - Source : ${path.relative(rootDir, sourceMdPath)}`);
    console.log(`   - Sortie : ${path.relative(rootDir, outputPdfPath)}`);
    console.log(`   - Taille : ${stat.size} octets`);
    console.log(`   - En-tête : ${header}`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    generateAccessGuidePdf();
  } catch (err) {
    console.error(`❌ Échec de la génération du Guide d'Accès PDF : ${err.message}`);
    process.exit(1);
  }
}

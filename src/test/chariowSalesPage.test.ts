import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const EXPECTED_PNG_FILES = [
  '00-full-sales-page.png',
  '01-hero-transformation.png',
  '02-mockup-studio-interieur.png',
  '03-storytelling-constat.png',
  '04-piliers-interactivite.png',
  '05-preuve-sociale-retours.png',
  '06-tout-ce-qui-est-inclus.png',
  '07-avant-apres-calculateur.png',
  '08-pour-qui-et-faq.png',
  '09-investissement-14900-fcfa.png',
] as const;

const EXPECTED_SLICES = EXPECTED_PNG_FILES.slice(1).map((name) => name.replace(/\.png$/, ''));

const FORBIDDEN_TECH_TERMS = [
  /index\.html/i,
  /375\s*px/i,
  /\.zip\b/i,
  /SOURCE-FICHE-PRIX\.md/i,
  /web-app/i,
  /application\s+web/i,
  /application\s+interactive/i,
  /\blocalhost\b/i,
] as const;

describe('Page de Vente Officielle Chariow AI CREATOR Studio (Mission 10)', () => {
  const rootDir = process.cwd();
  const htmlPath = path.join(rootDir, 'public', 'demos', 'chariow-sales-page.html');
  const assetsDir = path.join(rootDir, 'public', 'demos', 'assets');
  const downloadsDir = path.join(rootDir, 'public', 'downloads', 'chariow-sales-page');

  it('existe, supprime totalement #preview-toolbar et respecte la colonne 600px, la palette et les polices', () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('id="sales-column"');
    expect(html).toContain('width: 600px;');

    // Palette stricte
    for (const hex of ['#B63131', '#FAF6F0', '#F7E0E2', '#E6A0A8', '#FFFDFC', '#FFD65C', '#171313']) {
      expect(html).toContain(hex);
    }

    // Typographies Google Fonts + chargement local
    for (const font of ['Instrument Serif', 'Gaegu', 'JetBrains Mono', 'Plus Jakarta Sans']) {
      expect(html).toContain(font);
    }

    // Suppression totale du bloc Chariow Sales Kit / #preview-toolbar
    expect(html).not.toContain('id="preview-toolbar"');
    expect(html).not.toContain('Chariow Sales Kit');
    expect(doc.getElementById('preview-toolbar')).toBeNull();
  });

  it('contient exactement les 9 sections data-slice dans l ordre sequentiel attendu', () => {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const column = doc.getElementById('sales-column');
    expect(column).not.toBeNull();

    const sections = Array.from(column!.querySelectorAll(':scope > section[data-slice]'));
    expect(sections).toHaveLength(9);

    const actualSlices = sections.map((sec) => sec.getAttribute('data-slice'));
    expect(actualSlices).toEqual(EXPECTED_SLICES);
  });

  it('integre les 2 vraies captures iPhone avec taille > 0 octet dans les tranches 02 et 07', () => {
    const requiredImages = ['iphone-studio-lesson.jpg', 'iphone-calculator-lock.jpg'] as const;
    for (const imgName of requiredImages) {
      const imgPath = path.join(assetsDir, imgName);
      expect(fs.existsSync(imgPath), `Image manquante : ${imgName}`).toBe(true);

      const buf = fs.readFileSync(imgPath);
      expect(buf.length, `Image vide : ${imgName}`).toBeGreaterThan(0);
      // Signature JPEG valide : FF D8 FF
      expect(buf.subarray(0, 3).toString('hex')).toBe('ffd8ff');
    }

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const slice02 = doc.querySelector('section[data-slice="02-mockup-studio-interieur"]');
    const slice07 = doc.querySelector('section[data-slice="07-avant-apres-calculateur"]');
    expect(slice02).not.toBeNull();
    expect(slice07).not.toBeNull();

    const img02 = slice02!.querySelector('img[src="assets/iphone-studio-lesson.jpg"]');
    const img07 = slice07!.querySelector('img[src="assets/iphone-calculator-lock.jpg"]');
    expect(img02).not.toBeNull();
    expect(img07).not.toBeNull();

    // Les anciens mockups iPhone CSS ont bien ete remplaces
    expect(slice02!.querySelector('.iphone-wrap')).toBeNull();
    expect(slice07!.querySelector('.calc-iphone')).toBeNull();
  });

  it('affiche exactement le tarif de lancement 14 900 FCFA, le prix barre 24 900 FCFA et les 30 premiers', () => {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const text = doc.getElementById('sales-column')?.textContent ?? '';

    expect(text).toContain('14 900 FCFA');
    expect(text).toContain('24 900 FCFA');
    expect(text).toContain('30 premiers');
    expect(text).toContain('3 ventes');
    expect(text).toContain('5 000 FCFA');
    expect(text).toContain('env. 23 €');
    expect(text).toContain('Réserve ta place ci-dessous');
  });

  it('ne contient aucun tiret cadratin, terme interne ou jargon technique banni', () => {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const visibleText = doc.body?.textContent ?? '';

    expect(html).not.toContain('\u2014');
    expect(html.toLowerCase()).not.toContain('&mdash;');

    const forbiddenInternalTerms = [/\bSFM\b/, /\bVDB\b/, /\binvariant\b/i, /\bmarc-v2\b/i];
    for (const pattern of forbiddenInternalTerms) {
      expect(html).not.toMatch(pattern);
    }

    for (const pattern of FORBIDDEN_TECH_TERMS) {
      expect(visibleText, `Terme technique banni trouve dans le texte visible : ${pattern}`).not.toMatch(pattern);
      expect(html, `Terme technique banni trouve dans le HTML : ${pattern}`).not.toMatch(pattern);
    }
  });

  it('dispose des 10 fichiers PNG Retina Ultra-HD valides (89 50 4E 47, largeur physique 1200 px)', () => {
    expect(fs.existsSync(downloadsDir)).toBe(true);

    for (const fileName of EXPECTED_PNG_FILES) {
      const filePath = path.join(downloadsDir, fileName);
      expect(fs.existsSync(filePath), `Fichier manquant : ${fileName}`).toBe(true);

      const buffer = fs.readFileSync(filePath);
      expect(buffer.length).toBeGreaterThan(1024);

      // En-tete PNG valide : 89 50 4E 47 0D 0A 1A 0A
      const signature = buffer.subarray(0, 8).toString('hex');
      expect(signature, `En-tete PNG invalide pour ${fileName}`).toBe('89504e470d0a1a0a');

      // Verification IHDR : largeur physique Retina @2x = 1200 px, hauteur > 0
      const ihdrType = buffer.subarray(12, 16).toString('ascii');
      expect(ihdrType).toBe('IHDR');

      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      expect(width, `Largeur PNG inattendue pour ${fileName}`).toBe(1200);
      expect(height, `Hauteur PNG invalide pour ${fileName}`).toBeGreaterThan(200);
    }
  });

  it('dispose de la vignette carree (1200x1200) et de la banniere horizontale (1404x520) Chariow', () => {
    const expectedCovers = [
      { file: 'chariow-cover-square-1200x1200.png', width: 1200, height: 1200 },
      { file: 'chariow-banner-1404x520.png', width: 1404, height: 520 },
    ] as const;

    for (const cover of expectedCovers) {
      const filePath = path.join(downloadsDir, cover.file);
      expect(fs.existsSync(filePath), `Visuel Chariow manquant : ${cover.file}`).toBe(true);

      const buffer = fs.readFileSync(filePath);
      expect(buffer.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(buffer.subarray(12, 16).toString('ascii')).toBe('IHDR');
      expect(buffer.readUInt32BE(16), `Largeur IHDR inattendue pour ${cover.file}`).toBe(cover.width);
      expect(buffer.readUInt32BE(20), `Hauteur IHDR inattendue pour ${cover.file}`).toBe(cover.height);
    }
  });

  it('genere le Guide d Acces PDF valide sur exactement 1 page A4', () => {
    const pdfPath = path.join(downloadsDir, 'GUIDE-ACCES-MINI-COURS-INTERACTIF-CLAUDE.pdf');
    expect(fs.existsSync(pdfPath)).toBe(true);

    const pdfBuffer = fs.readFileSync(pdfPath);
    expect(pdfBuffer.length).toBeGreaterThan(5000);

    const pdfAscii = pdfBuffer.toString('latin1');
    expect(pdfAscii.startsWith('%PDF-')).toBe(true);

    const countMatches = Array.from(pdfAscii.matchAll(/\/Type\s*\/Pages\b[\s\S]{0,120}?\/Count\s+(\d+)/g));
    const pageCount =
      countMatches.length > 0
        ? Math.max(...countMatches.map((m) => Number.parseInt(m[1], 10)))
        : (pdfAscii.match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;

    expect(pageCount).toBe(1);
  });

  it('fournit la source HTML du Guide d Acces et la fiche Markdown conformes sans jargon ni tiret cadratin', () => {
    const guideHtmlPath = path.join(rootDir, 'docs', 'guides', 'GUIDE-ACCES-MINI-COURS-CLAUDE.html');
    const publishGuidePath = path.join(downloadsDir, 'GUIDE-PUBLICATION-CHARIOW.md');

    expect(fs.existsSync(guideHtmlPath)).toBe(true);
    expect(fs.existsSync(publishGuidePath)).toBe(true);

    const guideHtml = fs.readFileSync(guideHtmlPath, 'utf-8');
    const publishMd = fs.readFileSync(publishGuidePath, 'utf-8');

    expect(publishMd).toContain('14 900 FCFA');
    expect(publishMd).toContain('24 900 FCFA');
    expect(publishMd).toContain('GUIDE-ACCES-MINI-COURS-INTERACTIF-CLAUDE.pdf');
    expect(publishMd).toContain('chariow-cover-square-1200x1200.png');
    expect(publishMd).toContain('chariow-banner-1404x520.png');

    for (const content of [guideHtml, publishMd]) {
      expect(content).toContain('Mini-Cours Interactif Claude');
      expect(content).not.toContain('\u2014');
      expect(content.toLowerCase()).not.toContain('&mdash;');
      for (const pattern of FORBIDDEN_TECH_TERMS) {
        expect(content, `Terme technique banni trouve : ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});

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

describe('Page de Vente Officielle Chariow AI CREATOR Studio', () => {
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

    // Palette stricte V2 : encadrement #F7E0E2 + rupture #F478B8 + rouge brique #B63131
    for (const hex of ['#B63131', '#FAF6F0', '#F7E0E2', '#F478B8', '#E6A0A8', '#FFFDFC', '#FFD65C', '#171313']) {
      expect(html).toContain(hex);
    }

    // Typographies locales dont Caveat en cursive principale
    for (const font of ['Instrument Serif', 'Caveat', 'Gaegu', 'JetBrains Mono', 'Plus Jakarta Sans']) {
      expect(html).toContain(font);
    }
    expect(html).toContain("--font-hand: 'Caveat', 'Gaegu', cursive;");

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

  it('affiche exactement le tarif de lancement honnete 14 900 FCFA et le prix barre 24 900 FCFA sans fausse rarete', () => {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const text = doc.getElementById('sales-column')?.textContent ?? '';

    expect(text).toContain('14 900 FCFA');
    expect(text).toContain('24 900 FCFA');
    expect(text).toContain('Tarif de lancement');
    expect(text).toContain('Mobile Money ou carte bancaire');
    expect(text).toContain('7 500 FCFA');
    expect(text).toContain('2 ventes');
    expect(text).toContain('pour rentabiliser ton investissement');
    expect(text).not.toContain('pour rentrer dans tes frais');
    expect(text).toContain('(Simple repère mathématique, pas une garantie de ventes.)');
    expect(text).not.toMatch(/30\s+premiers/i);
    expect(text).not.toMatch(/30\s+places/i);
    expect(text).not.toContain('Réserve ta place ci-dessous');
    expect(doc.querySelector('.cta-pill')).toBeNull();
  });

  it('applique le design system valide, le positionnement officiel, les 4 avis clients, 3 FAQ et zero grille 3x2', () => {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const column = doc.getElementById('sales-column');
    expect(column).not.toBeNull();
    const text = column!.textContent ?? '';

    // Positionnement officiel validé (Tranche 01, 03, 04)
    expect(text).toContain("Crée le produit digital interactif que ton audience a hâte d'acheter.");
    expect(text).toContain("Pas un énième produit digital qu'on télécharge et qu'on oublie.");
    expect(text).toContain('+ de 1 million de FCFA');
    expect(html).not.toMatch(/10\s*millions/i);
    expect(text).not.toContain('10 000 000 FCFA');
    expect(html).not.toMatch(/b[eê]ta/i);
    expect(text).toContain("C'est mon expérience personnelle et ce n'est pas une garantie de résultats.");
    expect(text).toContain('simplicité.');
    expect(text).toContain('interactivité.');
    expect(text).toContain('résultat immédiat.');
    expect(text).toContain("n'est PAS fait pour toi");

    // Preuves brutes + 4 avis clients en Tranche 05
    const slice05 = doc.querySelector('section[data-slice="05-preuve-sociale-retours"]');
    expect(slice05).not.toBeNull();
    expect(slice05!.querySelector('img[src="../screenshots/module-03/l6-netlify-visibility-subdomain.png"]')).not.toBeNull();
    expect(slice05!.querySelector('img[src="../screenshots/module-03/l7-chariow-post-purchase.png"]')).not.toBeNull();
    expect(slice05!.textContent).toContain('RETOURS CLIENTS');
    const bubbles = slice05!.querySelectorAll('.dm-bubble');
    expect(bubbles).toHaveLength(4);
    expect(bubbles[0].textContent).toContain("Ce cours est le meilleur investissement que j'aie jamais fait.");
    expect(bubbles[1].textContent).toContain("Sérieusement, ce mini-cours est probablement l'une des meilleures formations en ligne que j'aie jamais achetées.");
    expect(bubbles[2].textContent).toContain("C'est tellement bien !!! J'en pleure de joie ! 🥹");
    expect(bubbles[3].textContent).toContain('JE SUIS COMPLÈTEMENT FAN DE TON MINI-COURS !');

    // Bonus 01 & Bonus 02 ("9 ressources marketing" exact)
    expect(text).toContain('commentaires Facebook vers Messenger uniquement');
    expect(text).toContain('9 ressources marketing');
    expect(text).not.toContain('9 ressources de Skills marketing');
    expect(text).toContain("1 prompt universel d'analyse concurrentielle");
    expect(text).toContain('novitckii.com/resources/');
    expect(text).not.toMatch(/9\s+Assistants\s+IA/i);
    expect(text).not.toMatch(/chiffre d'affaires/i);
    expect(text).not.toMatch(/best-seller/i);

    // Exactement 3 questions FAQ en Tranche 08 (FAQ 1 supprimee)
    const slice08 = doc.querySelector('section[data-slice="08-pour-qui-et-faq"]');
    expect(slice08).not.toBeNull();
    expect(slice08!.querySelectorAll('.faq-item')).toHaveLength(3);
    expect(text).not.toContain("Pourquoi le fichier téléchargé sur Chariow ne fait-il qu'une page ?");

    // Zéro SVG double soulignement ni grille 3x2 (viewBox="0 0 34 22")
    expect(html).not.toContain('viewBox="0 0 34 22"');
    expect(html).not.toContain('.grid-badge');
    expect(html).not.toContain('double-underline-svg');
    expect(html).not.toContain('hand-underline-svg');
    expect(doc.querySelector('.slice-01-top svg')).toBeNull();
    expect(doc.querySelector('.studio-hero-card svg')).toBeNull();
    expect(doc.querySelector('.slice-02-bottom svg')).toBeNull();
    expect(doc.querySelector('.slice-09-head svg')).toBeNull();

    // Planchers typographiques mobile rehausses (colonne 600px -> ~340px mobile)
    const minSizes: Array<[RegExp, number]> = [
      [/\.eyebrow\s*\{[^}]*font-size:\s*([\d.]+)px/, 16],
      [/\.slice-04-disclaimer\s*\{[^}]*font-size:\s*([\d.]+)px/, 17.5],
      [/\.proof-item\s*\{[^}]*font-size:\s*([\d.]+)px/, 19],
      [/\.dm-bubble\s*\{[^}]*font-size:\s*([\d.]+)px/, 19],
      [/\.included-desc\s*\{[^}]*font-size:\s*([\d.]+)px/, 18.5],
      [/\.before-doc-lines\s*\{[^}]*font-size:\s*([\d.]+)px/, 17.5],
      [/\.ba-caption\s*\{[^}]*font-size:\s*([\d.]+)px/, 19],
      [/\.faq-a\s*\{[^}]*font-size:\s*([\d.]+)px/, 19.5],
      [/\.slice-09-roi-note\s*\{[^}]*font-size:\s*([\d.]+)px/, 16.5],
      [/\.slice-09-pay\s*\{[^}]*font-size:\s*([\d.]+)px/, 19],
    ];
    for (const [pattern, minPx] of minSizes) {
      const match = html.match(pattern);
      expect(match, `Regle CSS manquante : ${pattern}`).not.toBeNull();
      expect(Number.parseFloat(match![1])).toBeGreaterThanOrEqual(minPx);
    }

    // Zéro excès d'emojis (seul l'emoji 🥹 de l'Avis 3 est autorisé) ni mention d'Excel
    const foundEmojis = text.match(/[\u{1F300}-\u{1FAFF}]/gu) ?? [];
    expect(foundEmojis).toEqual(['🥹']);
    expect(html).not.toMatch(/\bexcel\b/i);
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
      expect(buffer.length, `Fichier >= 2 MB (limite Chariow depassee) pour ${fileName}`).toBeLessThan(2 * 1000 * 1000);

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
      expect(buffer.length, `Visuel >= 2 MB (limite Chariow depassee) pour ${cover.file}`).toBeLessThan(2 * 1000 * 1000);
      expect(buffer.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(buffer.subarray(12, 16).toString('ascii')).toBe('IHDR');
      expect(buffer.readUInt32BE(16), `Largeur IHDR inattendue pour ${cover.file}`).toBe(cover.width);
      expect(buffer.readUInt32BE(20), `Hauteur IHDR inattendue pour ${cover.file}`).toBe(cover.height);
    }
  });

  it('genere le Guide d Acces PDF valide sur exactement 1 page A4 et synchronise avec la source HTML', () => {
    const pdfPath = path.join(downloadsDir, 'Guide-Acces-AI-CREATOR-Studio.pdf');
    const oldPdfPath = path.join(downloadsDir, 'GUIDE-ACCES-MINI-COURS-INTERACTIF-CLAUDE.pdf');
    const guideHtmlPath = path.join(rootDir, 'docs', 'guides', 'GUIDE-ACCES-MINI-COURS-CLAUDE.html');
    expect(fs.existsSync(pdfPath)).toBe(true);
    expect(fs.existsSync(oldPdfPath)).toBe(false);
    expect(fs.existsSync(guideHtmlPath)).toBe(true);

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

    // Vérifie que le PDF généré est plus récent ou concomitant à la mise à jour de GUIDE-ACCES-MINI-COURS-CLAUDE.html
    const pdfStat = fs.statSync(pdfPath);
    const htmlStat = fs.statSync(guideHtmlPath);
    expect(pdfStat.mtimeMs).toBeGreaterThanOrEqual(htmlStat.mtimeMs - 1000);
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
    expect(publishMd).toContain('Guide-Acces-AI-CREATOR-Studio.pdf');
    expect(publishMd).toContain("Guide d'Accès d'une page");
    expect(publishMd).toContain('Texte Court à Coller en Haut de la Fiche Chariow');
    expect(publishMd).toContain('chariow-cover-square-1200x1200.png');
    expect(publishMd).toContain('chariow-banner-1404x520.png');

    // Vérification du Guide d'Accès épuré
    expect(guideHtml).toContain('Ouvre ton espace de formation');
    expect(guideHtml).toContain('Vérifie ta boîte mail (et ton dossier Spams)');
    expect(guideHtml).toContain('Saisis ton e-mail et ton code unique');
    expect(guideHtml).toContain('CONFIRMATION D\'ACHAT • GUIDE D\'ACCÈS IMMÉDIAT');
    expect(guideHtml).not.toContain('class="cta-url-caption"');

    expect(publishMd).toContain('1. OUVRE LA PLATEFORME :');
    expect(publishMd).toContain('https://ai-creator-studio-vtma.netlify.app');
    expect(publishMd).toContain('2. VÉRIFIE TA BOÎTE MAIL (ET TES SPAMS) :');
    expect(publishMd).toContain('3. CONNECTE-TOI À TON ESPACE :');
    expect(publishMd).toContain("adresse e-mail d'achat et ton code à 6 chiffres");
    expect(publishMd).toContain('Se connecter');

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

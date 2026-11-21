#!/usr/bin/env node
/**
 * scripts/generate-solde-ebook-pdf.js
 * Génère l'ebook PDF éditorial complet « Organiser son budget mensuel et atteindre ses objectifs d'épargne »
 * (Éditions SOLDE · Guide Pratique, 20 pages A4) dans
 * `public/downloads/demo-pdfs/SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf`
 * via Google Chrome headless.
 */

import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'downloads', 'demo-pdfs');
const fontsDir = path.join(rootDir, 'public', 'fonts');
const illusDir = path.join(__dirname, 'assets', 'ebook-illustrations');

const OUTPUT_PDF_PATH = path.join(
  outputDir,
  'SOLDE-EBOOK-BUDGET-MENSUEL-OBJECTIFS.pdf'
);

const TOTAL_PAGES = 20;

function findChromeEngine() {
  const candidates = [
    process.env.CHROME_BIN,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);

  for (const bin of candidates) {
    try {
      const resolved = execSync(`command -v "${bin}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (resolved && fs.existsSync(resolved)) {
        return resolved;
      }
    } catch {
      // Continuer la recherche
    }
  }
  throw new Error('Aucun binaire Google Chrome ou Chromium détecté.');
}

function escapeHtml(raw) {
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildFontFaceCss() {
  const fontSpecs = [
    {
      family: 'Instrument Serif',
      file: 'InstrumentSerif-Regular.ttf',
      format: 'truetype',
      weight: '400',
      style: 'normal',
    },
    {
      family: 'Instrument Serif',
      file: 'InstrumentSerif-Italic.ttf',
      format: 'truetype',
      weight: '400',
      style: 'italic',
    },
    {
      family: 'Plus Jakarta Sans',
      file: 'PlusJakartaSans-latin.woff2',
      format: 'woff2',
      weight: '400 800',
      style: 'normal',
    },
    {
      family: 'Plus Jakarta Sans',
      file: 'PlusJakartaSans-latin-ext.woff2',
      format: 'woff2',
      weight: '400 800',
      style: 'normal',
    },
    {
      family: 'JetBrains Mono',
      file: 'JetBrainsMono-Regular.ttf',
      format: 'truetype',
      weight: '400',
      style: 'normal',
    },
    {
      family: 'JetBrains Mono',
      file: 'JetBrainsMono-Bold.ttf',
      format: 'truetype',
      weight: '700',
      style: 'normal',
    },
  ];

  return fontSpecs
    .map((spec) => {
      const absPath = path.join(fontsDir, spec.file);
      if (!fs.existsSync(absPath)) return '';
      const b64 = fs.readFileSync(absPath).toString('base64');
      const mime = spec.format === 'woff2' ? 'font/woff2' : 'font/ttf';
      return `@font-face {
  font-family: '${spec.family}';
  src: url('data:${mime};base64,${b64}') format('${spec.format}');
  font-weight: ${spec.weight};
  font-style: ${spec.style};
  font-display: swap;
}`;
    })
    .filter(Boolean)
    .join('\n');
}

function loadIllustrations() {
  const names = {
    cover: 'cover-editorial.png',
    part1: 'part1-envelopes.png',
    part3: 'part3-compass.png',
    part4: 'part4-horizon.png',
  };
  const out = {};
  for (const [key, filename] of Object.entries(names)) {
    const absPath = path.join(illusDir, filename);
    if (!fs.existsSync(absPath)) {
      throw new Error(`Illustration manquante : ${absPath}`);
    }
    const b64 = fs.readFileSync(absPath).toString('base64');
    out[key] = `data:image/png;base64,${b64}`;
  }
  return out;
}

/**
 * Barre de proportion éditoriale sobre (pour règles et profils).
 */
function editorialProportionBar(segments) {
  const bars = segments
    .filter((s) => s.pct > 0)
    .map(
      (s) =>
        `<div class="ep-seg" style="width:${s.pct}%; background:${s.color};" title="${escapeHtml(s.label)}"></div>`
    )
    .join('');
  const legends = segments
    .map(
      (s) =>
        `<span class="ep-leg-item"><i class="ep-swatch" style="background:${s.color};"></i><strong>${escapeHtml(s.label)}</strong> : ${escapeHtml(s.value)} (${s.pct}&nbsp;%)</span>`
    )
    .join('');

  return `
  <div class="ep-wrap">
    <div class="ep-track">${bars}</div>
    <div class="ep-legend">${legends}</div>
  </div>`;
}

function renderInnerPage({ pageNum, runningTitle, sectionTag, bodyHtml, cream = false }) {
  const padded = String(pageNum).padStart(2, '0');
  return `
  <section class="page inner-page ${cream ? 'is-cream' : ''}">
    <header class="book-head">
      <span class="bh-left">${escapeHtml(runningTitle)}</span>
      <span class="bh-right">${escapeHtml(sectionTag)}</span>
    </header>

    <main class="book-body">
      ${bodyHtml}
    </main>

    <footer class="book-foot">
      <span class="bf-left">Organiser son budget mensuel et atteindre ses objectifs d’épargne</span>
      <span class="bf-right">${padded} / ${TOTAL_PAGES}</span>
    </footer>
  </section>`;
}

function buildPage1Cover(illus) {
  return `
  <section class="page cover-page">
    <div class="cover-frame">
      <div class="cover-top">
        <span class="cover-imprint">ÉDITIONS SOLDE · GUIDE PRATIQUE</span>
        <span class="cover-meta">Édition complète · FCFA &amp; € EUR</span>
      </div>

      <div class="cover-title-block">
        <div class="cover-kicker">MÉTHODE DE FINANCES PERSONNELLES</div>
        <h1>Organiser son budget mensuel et atteindre ses objectifs d’épargne</h1>
        <div class="cover-rule"></div>
        <p class="cover-subtitle">
          La méthode claire en quatre étapes pour répartir vos revenus dès réception, connaître votre
          reste libre quotidien, absorber les imprévus sans entamer votre réserve et financer vos projets concrets.
        </p>
      </div>

      <div class="cover-art-wrap">
        <img src="${illus.cover}" alt="Illustration éditoriale équilibre budgétaire" class="cover-art" />
      </div>

      <div class="cover-bottom">
        <div class="cover-pillars">
          <div class="cp-item">
            <span class="cp-num">I.</span>
            <span>Trois enveloppes &amp; parité FCFA/€</span>
          </div>
          <div class="cp-item">
            <span class="cp-num">II.</span>
            <span>Trois profils modèles commentés</span>
          </div>
          <div class="cp-item">
            <span class="cp-num">III.</span>
            <span>Score /100 &amp; Crash-test imprévus</span>
          </div>
          <div class="cp-item">
            <span class="cp-num">IV.</span>
            <span>Projections 12 mois &amp; Cahier pratique</span>
          </div>
        </div>
        <div class="cover-edition-foot">
          <span>20 pages · Format A4 avec fiches d’exercices imprimables</span>
          <span>Parité de référence : 1 € = 655,957 FCFA</span>
        </div>
      </div>
    </div>
  </section>`;
}

function buildPage2Foreword() {
  return renderInnerPage({
    pageNum: 2,
    runningTitle: 'Éditions SOLDE · Guide Pratique',
    sectionTag: 'AVANT-PROPOS',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">AVANT-PROPOS</div>
        <h2>Pourquoi tout se joue avant le 15 du mois</h2>
      </div>

      <p class="dropcap">
        Gérer son argent au mois le mois ne demande ni tableau complexe, ni formation en comptabilité.
        Pourtant, le même scénario se répète dans la majorité des foyers et chez beaucoup d’indépendants :
        on perçoit son salaire, ses honoraires ou sa bourse en début de mois, on laisse l’ensemble des
        sommes sur un seul support, et l’on ressent une aisance apparente pendant dix à douze jours.
      </p>
      <p>
        Puis les factures tombent, un déplacement imprévu s’ajoute, une sollicitation familiale ou un
        achat non planifié survient. Sans repère clair, la deuxième moitié du mois se transforme en
        gestion défensive, et l’épargne que l’on espérait mettre de côté « s’il reste quelque chose »
        disparaît presque systématiquement.
      </p>
      <p>
        Ce guide part d’un constat simple : le dérapage budgétaire vient rarement d’un manque de
        discipline. Il résulte d’une absence de <strong>cloisonnement préalable</strong> et
        d’<strong>indicateurs lisibles au quotidien</strong>. Lorsque vos charges fixes, votre vie
        courante et votre épargne restent mélangées, chaque dépense semble indolore — jusqu’au moment
        où le solde ne suffit plus.
      </p>

      <blockquote class="editorial-quote">
        « Un bon budget ne vous interdit pas de dépenser : il vous indique avec précision ce que vous
        pouvez dépenser aujourd’hui sans compromettre votre fin de mois ni vos projets à six mois. »
      </blockquote>

      <div class="sub-h">Comment utiliser cet ouvrage en 45 minutes</div>

      <div class="three-step-prose">
        <div class="tsp-box">
          <div class="tsp-idx">01 · Comprendre (10 min)</div>
          <p>Lisez la Partie I pour poser vos trois enveloppes et choisir la règle adaptée à votre niveau de charges.</p>
        </div>
        <div class="tsp-box">
          <div class="tsp-idx">02 · Calibrer (20 min)</div>
          <p>Appuyez-vous sur le modèle le plus proche de votre situation (Particulier, Créateur ou Étudiant) et calculez votre Score sur 100.</p>
        </div>
        <div class="tsp-box">
          <div class="tsp-idx">03 · Appliquer (15 min)</div>
          <p>Remplissez les fiches détachables en fin d’ouvrage (pages 17 à 20) et adoptez le rituel bimensuel de suivi.</p>
        </div>
      </div>

      <div class="imprint-note">
        <strong>Note sur les devises :</strong> Tous les montants présentés dans ce guide sont exprimés en
        francs CFA (FCFA) avec leur équivalent arrondi en euros (€) selon la parité officielle fixe
        <strong>1 € = 655,957 FCFA</strong>. La méthode s’applique à l’identique quelle que soit votre devise principale.
      </div>
    `,
  });
}

function buildPage3Toc() {
  const parts = [
    {
      part: 'PARTIE I · LES FONDATIONS',
      items: [
        ['Chapitre 1.1', 'La méthode des trois enveloppes dès la réception du revenu', '04'],
        ['Chapitre 1.2', 'Trois règles de répartition (50/30/20, 60/20/20, 45/20/35) et choix du modèle', '05'],
        ['Repère pratique', 'Table de conversion rapide FCFA ↔ € EUR (1 € = 655,957 FCFA)', '05'],
      ],
    },
    {
      part: 'PARTIE II · TROIS BUDGETS MODÈLES PRÊTS À ADAPTER',
      items: [
        ['Chapitre 2.0', 'Adapter un budget type à votre situation réelle en quatre étapes', '06'],
        ['Chapitre 2.1', 'Modèle 1 : Profil Particulier (Revenu net : 250 000 FCFA / ~381 €)', '07'],
        ['Chapitre 2.2', 'Modèle 2 : Profil Créateur / Freelance (Revenu estimé : 450 000 FCFA / ~686 €)', '08'],
        ['Chapitre 2.3', 'Modèle 3 : Profil Étudiant (Budget disponible : 100 000 FCFA / ~152 €)', '09'],
      ],
    },
    {
      part: 'PARTIE III · PILOTAGE, SCORE DE SÉRÉNITÉ & CRASH-TEST',
      items: [
        ['Chapitre 3.1', 'Calculer son reste libre mensuel et son budget libre par jour', '10'],
        ['Chapitre 3.2', 'Évaluer objectivement son Score de sérénité financière (/100)', '11'],
        ['Chapitre 3.3', 'Réaliser un Crash-test avant tout achat ou imprévu (+15k, +40k, +80k)', '12'],
        ['Chapitre 3.4', 'Matrice des quatre arbitrages et constitution du fonds de sécurité', '13'],
      ],
    },
    {
      part: 'PARTIE IV · OBJECTIFS CONCRETS, PROJECTIONS & PRÉVENTION',
      items: [
        ['Chapitre 4.1', 'Planifier un objectif prioritaire et calculer sa date d’atteinte', '14'],
        ['Chapitre 4.2', 'Projection de cagnotte cumulée à 3, 6 et 12 mois et accélérateurs', '15'],
        ['Chapitre 4.3', 'Les 7 erreurs silencieuses, plan d’action 30 jours et rituel de 15 minutes', '16'],
      ],
    },
    {
      part: 'CAHIER PRATIQUE DÉTACHABLE (FICHES À REMPLIR)',
      items: [
        ['Fiche 1 / 4', 'Revenus du mois & inventaire des Charges fixes (blocs A et B)', '17'],
        ['Fiche 2 / 4', 'Vie & Plaisirs, Épargne, Reste libre et Budget quotidien (blocs C, D et Solde)', '18'],
        ['Fiche 3 / 4', 'Grille de calcul du Score de sérénité (/100) & Journal de Crash-tests', '19'],
        ['Fiche 4 / 4', 'Feuille de route Objectif prioritaire & Suivi cumulé sur 12 mois', '20'],
      ],
    },
  ];

  const blocksHtml = parts
    .map(
      (grp) => `
      <div class="toc-group">
        <div class="toc-part-title">${escapeHtml(grp.part)}</div>
        ${grp.items
          .map(
            ([code, title, pg]) => `
          <div class="toc-line">
            <span class="tl-code">${escapeHtml(code)}</span>
            <span class="tl-title">${escapeHtml(title)}</span>
            <span class="tl-dots"></span>
            <span class="tl-pg">p. ${escapeHtml(pg)}</span>
          </div>`
          )
          .join('')}
      </div>`
    )
    .join('');

  return renderInnerPage({
    pageNum: 3,
    runningTitle: 'Sommaire général',
    sectionTag: 'TABLE DES MATIÈRES',
    cream: true,
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">TABLE DES MATIÈRES</div>
        <h2>Architecture complète de l’ouvrage</h2>
      </div>
      <div class="toc-container">
        ${blocksHtml}
      </div>
    `,
  });
}

function buildPage4Part1(illus) {
  return renderInnerPage({
    pageNum: 4,
    runningTitle: 'Partie I · La méthode des trois enveloppes',
    sectionTag: 'CHAPITRE 1.1',
    bodyHtml: `
      <div class="part-opener">
        <div class="po-text">
          <div class="part-num">PARTIE I</div>
          <h2>Répartir son revenu en trois grandes enveloppes</h2>
          <p class="lead">
            La principale erreur de début de mois consiste à laisser dans un même pot vos factures
            obligatoires, vos achats du quotidien et l’argent que vous souhaitez économiser.
          </p>
        </div>
        <div class="po-art">
          <img src="${illus.part1}" alt="Illustration des trois enveloppes budgétaires" />
        </div>
      </div>

      <p>
        Pour sortir durablement de l’incertitude financière en fin de mois, vous devez affecter chaque
        franc ou euro dès le jour de sa réception. Cette séparation repose sur trois enveloppes
        hermétiques : chacune possède un rôle exclusif et ne doit pas financer les erreurs d’une autre.
      </p>

      <div class="envelope-list">
        <div class="env-row">
          <div class="env-marker bg-navy">01</div>
          <div class="env-content">
            <div class="env-head">
              <h3>Les Charges fixes (incompressibles)</h3>
              <span class="env-target">Repère sain : ≤ 50 % du revenu</span>
            </div>
            <p>
              Elles regroupent toutes les dépenses prévisibles et indispensables à votre logement,
              votre mobilité et votre activité : loyer, eau, électricité, forfait internet, transport
              régulier, abonnements et outils professionnels. Tant que ces montants ne sont pas
              provisionnés, votre véritable revenu disponible reste inconnu.
            </p>
          </div>
        </div>

        <div class="env-row">
          <div class="env-marker bg-copper">02</div>
          <div class="env-content">
            <div class="env-head">
              <h3>La Vie courante et les Plaisirs (variables)</h3>
              <span class="env-target">Repère sain : 20 % à 30 % du revenu</span>
            </div>
            <p>
              Cette enveloppe couvre l’alimentation, les courses hebdomadaires, les repas pris à
              l’extérieur, les sorties, les sollicitations familiales courantes et les extras. En la
              plafonnant dès le début du mois, vous profitez de vos plaisirs sans arrière-pensée :
              vous savez exactement jusqu’où vous pouvez aller.
            </p>
          </div>
        </div>

        <div class="env-row">
          <div class="env-marker bg-sage">03</div>
          <div class="env-content">
            <div class="env-head">
              <h3>L’Épargne et la Tontine (mise de côté en priorité)</h3>
              <span class="env-target">Repère sain : ≥ 20 % du revenu</span>
            </div>
            <p>
              L’épargne n’est pas un résidu aléatoire de fin de mois : c’est votre première facture
              envers vous-même. Dès l’arrivée de votre revenu, isolez cette part sur un compte dédié,
              un portefeuille séparé ou une tontine rigoureuse destinée à un objectif précis.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

function buildPage5Part1Rules() {
  const conversions = [
    ['10 000 FCFA', '15 €', 'Petit excédent mensuel ou levier d’accélération'],
    ['20 000 FCFA', '30 €', 'Épargne de démarrage (profil étudiant)'],
    ['50 000 FCFA', '76 €', 'Épargne mensuelle standard (20 % sur 250 000 F)'],
    ['90 000 FCFA', '137 €', 'Épargne créateur / freelance (20 % sur 450 000 F)'],
    ['100 000 FCFA', '152 €', 'Budget mensuel type d’un étudiant'],
    ['250 000 FCFA', '381 €', 'Revenu net Particulier · Objectif Setup Vidéo'],
    ['300 000 FCFA', '457 €', 'Fonds de sécurité initial (1 mois de base)'],
    ['450 000 FCFA', '686 €', 'Revenu mensuel estimé Créateur / Freelance'],
    ['500 000 FCFA', '762 €', 'Capital de lancement pour un projet personnel'],
  ];

  return renderInnerPage({
    pageNum: 5,
    runningTitle: 'Partie I · Les trois règles de répartition',
    sectionTag: 'CHAPITRE 1.2',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 1.2</div>
        <h2>Choisir votre règle de répartition et convertir vos repères</h2>
      </div>

      <p>
        Toutes les situations ne permettent pas d’appliquer la même proportion dès le premier mois.
        Selon le poids de votre loyer ou l’urgence de votre objectif, choisissez l’une des trois
        répartitions ci-dessous comme cadre de départ.
      </p>

      <table class="book-table">
        <thead>
          <tr>
            <th style="width:22%;">Règle de répartition</th>
            <th class="num" style="width:13%;">Fixes</th>
            <th class="num" style="width:14%;">Vie &amp; Plaisirs</th>
            <th class="num" style="width:12%;">Épargne</th>
            <th>Pour quelle situation ?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>50 / 30 / 20 · Équilibré</strong></td>
            <td class="num">50&nbsp;%</td>
            <td class="num">30&nbsp;%</td>
            <td class="num text-sage"><strong>20&nbsp;%</strong></td>
            <td>Revenu stable, bon équilibre entre confort quotidien et épargne régulière.</td>
          </tr>
          <tr>
            <td><strong>60 / 20 / 20 · Prudent</strong></td>
            <td class="num">60&nbsp;%</td>
            <td class="num">20&nbsp;%</td>
            <td class="num text-sage"><strong>20&nbsp;%</strong></td>
            <td>Loyer ou charges professionnelles élevés : priorité à la sécurité sans sacrifier l’épargne.</td>
          </tr>
          <tr>
            <td><strong>45 / 20 / 35 · Épargne max</strong></td>
            <td class="num">45&nbsp;%</td>
            <td class="num">20&nbsp;%</td>
            <td class="num text-sage"><strong>35&nbsp;%</strong></td>
            <td>Objectif rapide à financer sur 3 à 6 mois (fonds de sécurité, équipement ou projet).</td>
          </tr>
        </tbody>
      </table>

      <div class="two-col-notes">
        <div class="ed-box">
          <div class="ed-box-title">La règle du « Paiement de soi en premier »</div>
          <p>
            Le jour où votre revenu arrive, transférez d’abord votre enveloppe <strong>Épargne</strong>,
            provisionnez vos <strong>Charges fixes</strong>, et ne laissez accessible au quotidien que
            l’enveloppe <strong>Vie &amp; Plaisirs</strong>.
          </p>
        </div>
        <div class="ed-box">
          <div class="ed-box-title">Comment choisir en cas de doute ?</div>
          <p>
            Si vos charges fixes dépassent 55&nbsp;% de votre revenu, adoptez le mode <strong>Prudent
            (60/20/20)</strong> plutôt que de supprimer votre épargne. Dès qu’elles repassent sous 50&nbsp;%,
            revenez au mode <strong>Équilibré</strong>.
          </p>
        </div>
      </div>

      <div class="sub-h">Conversion rapide : FCFA ↔ € EUR (Parité fixe : 1 € = 655,957 FCFA)</div>
      <p class="small-muted">
        Si vous gérez votre budget en euros, divisez simplement les montants en FCFA par 655,957
        (ou multipliez vos montants en euros par 655,957 pour obtenir l’équivalent en FCFA).
      </p>

      <table class="book-table compact">
        <thead>
          <tr>
            <th style="width:24%;">Montant (FCFA)</th>
            <th style="width:18%;">Équivalent (€)</th>
            <th>Repère d’usage dans cet ouvrage</th>
          </tr>
        </thead>
        <tbody>
          ${conversions
            .map(
              ([fcfa, eur, desc]) => `
            <tr>
              <td class="strong">${escapeHtml(fcfa)}</td>
              <td>${escapeHtml(eur)}</td>
              <td>${escapeHtml(desc)}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `,
  });
}

function buildPage6Part2Overview() {
  return renderInnerPage({
    pageNum: 6,
    runningTitle: 'Partie II · Trois budgets modèles prêts à adapter',
    sectionTag: 'CHAPITRE 2.0',
    cream: true,
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">PARTIE II · MODÈLES DE RÉFÉRENCE</div>
        <h2>Trois budgets modèles réalistes prêts à adapter à votre situation</h2>
      </div>

      <p class="dropcap">
        Selon que vous soyez salarié, créateur indépendant ou étudiant, la structure de vos dépenses
        change profondément. Un indépendant doit intégrer ses outils numériques et sa réserve fiscale
        dans ses charges fixes, tandis qu’un étudiant doit sécuriser un petit matelas malgré un budget serré.
      </p>
      <p>
        Les trois pages suivantes vous présentent trois budgets complets bâtis sur la règle équilibrée,
        déjà testés et calibrés au franc près. Utilisez le modèle le plus proche de votre profil comme
        patron de départ, puis ajustez chaque ligne selon vos montants réels.
      </p>

      <table class="book-table">
        <thead>
          <tr>
            <th>Profil de référence</th>
            <th class="num">Revenu mensuel</th>
            <th class="num">Fixes</th>
            <th class="num">Vie &amp; Plaisirs</th>
            <th class="num">Épargne</th>
            <th class="num">Reste libre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Particulier</strong><br/><span class="small-muted">Salarié ou employé</span></td>
            <td class="num"><strong>250 000 F</strong><br/><span class="small-muted">~381 €</span></td>
            <td class="num">125 000 F<br/><span class="small-muted">50&nbsp;%</span></td>
            <td class="num">65 000 F<br/><span class="small-muted">26&nbsp;%</span></td>
            <td class="num text-sage"><strong>50 000 F</strong><br/><span class="small-muted">20&nbsp;%</span></td>
            <td class="num text-navy"><strong>10 000 F</strong><br/><span class="small-muted">333 F/j</span></td>
          </tr>
          <tr>
            <td><strong>2. Créateur / Freelance</strong><br/><span class="small-muted">Indépendant ou digital</span></td>
            <td class="num"><strong>450 000 F</strong><br/><span class="small-muted">~686 €</span></td>
            <td class="num">225 000 F<br/><span class="small-muted">50&nbsp;%</span></td>
            <td class="num">120 000 F<br/><span class="small-muted">27&nbsp;%</span></td>
            <td class="num text-sage"><strong>90 000 F</strong><br/><span class="small-muted">20&nbsp;%</span></td>
            <td class="num text-navy"><strong>15 000 F</strong><br/><span class="small-muted">500 F/j</span></td>
          </tr>
          <tr>
            <td><strong>3. Étudiant</strong><br/><span class="small-muted">Bourse, job ou aide</span></td>
            <td class="num"><strong>100 000 F</strong><br/><span class="small-muted">~152 €</span></td>
            <td class="num">50 000 F<br/><span class="small-muted">50&nbsp;%</span></td>
            <td class="num">30 000 F<br/><span class="small-muted">30&nbsp;%</span></td>
            <td class="num text-sage"><strong>20 000 F</strong><br/><span class="small-muted">20&nbsp;%</span></td>
            <td class="num"><strong>0 F</strong><br/><span class="small-muted">Calé 100&nbsp;%</span></td>
          </tr>
        </tbody>
      </table>

      <div class="sub-h">Méthode d’adaptation en quatre étapes</div>

      <div class="steps-book-list">
        <div class="sb-item">
          <span class="sb-num">1</span>
          <div>
            <strong>Partez de votre revenu net réel :</strong> ne retenez que les entrées certaines (pour un
            revenu variable, retenez la moyenne basse de vos six derniers mois).
          </div>
        </div>
        <div class="sb-item">
          <span class="sb-num">2</span>
          <div>
            <strong>Inscrivez vos vraies charges fixes :</strong> loyer, énergie, internet, transport et
            abonnements obligatoires. Vérifiez si leur total reste sous la barre des 50&nbsp;%.
          </div>
        </div>
        <div class="sb-item">
          <span class="sb-num">3</span>
          <div>
            <strong>Verrouillez votre enveloppe d’épargne :</strong> fixez 20&nbsp;% (ou 10 à 15&nbsp;% le premier mois
            si vous démarrez avec un budget serré, avec l’objectif d’atteindre 20&nbsp;% sous 90 jours).
          </div>
        </div>
        <div class="sb-item">
          <span class="sb-num">4</span>
          <div>
            <strong>Ajustez les postes de Vie &amp; Plaisirs jusqu’à obtenir un reste libre positif :</strong>
            conserver une petite marge non affectée (3 à 5&nbsp;%) évite qu’un écart mineur ne casse le mois.
          </div>
        </div>
      </div>
    `,
  });
}

function buildPage7ProfileStandard() {
  return renderInnerPage({
    pageNum: 7,
    runningTitle: 'Partie II · Modèle 1 : Particulier',
    sectionTag: 'CHAPITRE 2.1',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 2.1 · PROFIL PARTICULIER</div>
        <h2>Budget d’un salarié à 250 000 FCFA net (~381 €)</h2>
      </div>

      <p>
        Ce premier modèle illustre un budget salarié équilibré. En maintenant les charges fixes exactement
        à <strong>50&nbsp;%</strong> et les dépenses de vie à <strong>26&nbsp;%</strong> au lieu de 30&nbsp;%,
        on dégage une épargne complète de <strong>50 000 FCFA (20&nbsp;%)</strong> ainsi qu’une marge de
        sécurité libre de <strong>10 000 FCFA (333 FCFA/jour)</strong>.
      </p>

      ${editorialProportionBar([
        { label: 'Charges fixes', value: '125 000 F', pct: 50, color: '#1B365D' },
        { label: 'Vie & Plaisirs', value: '65 000 F', pct: 26, color: '#B45A32' },
        { label: 'Épargne', value: '50 000 F', pct: 20, color: '#2E5E4E' },
        { label: 'Marge libre', value: '10 000 F', pct: 4, color: '#C8BEB0' },
      ])}

      <table class="book-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Poste de dépense</th>
            <th class="num">Montant (FCFA)</th>
            <th class="num">Équivalent (€)</th>
            <th class="num">Part</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Charges fixes</td><td>Loyer</td><td class="num">75 000 FCFA</td><td class="num">~114 €</td><td class="num">30&nbsp;%</td></tr>
          <tr><td>Charges fixes</td><td>Eau, Électricité &amp; Internet</td><td class="num">25 000 FCFA</td><td class="num">~38 €</td><td class="num">10&nbsp;%</td></tr>
          <tr><td>Charges fixes</td><td>Transport</td><td class="num">25 000 FCFA</td><td class="num">~38 €</td><td class="num">10&nbsp;%</td></tr>
          <tr><td>Vie &amp; Plaisirs</td><td>Courses &amp; Repas</td><td class="num">45 000 FCFA</td><td class="num">~69 €</td><td class="num">18&nbsp;%</td></tr>
          <tr><td>Vie &amp; Plaisirs</td><td>Sorties &amp; Famille</td><td class="num">20 000 FCFA</td><td class="num">~30 €</td><td class="num">8&nbsp;%</td></tr>
          <tr><td>Épargne &amp; Tontine</td><td>Épargne mensuelle dédiée</td><td class="num text-sage"><strong>50 000 FCFA</strong></td><td class="num">~76 €</td><td class="num">20&nbsp;%</td></tr>
          <tr class="row-summary">
            <td colspan="2">Reste libre disponible ce mois (marge de sécurité)</td>
            <td class="num">10 000 FCFA</td>
            <td class="num">~15 €</td>
            <td class="num">4&nbsp;%</td>
          </tr>
        </tbody>
      </table>

      <div class="two-col-notes">
        <div class="ed-box">
          <div class="ed-box-title">Analyse &amp; Score de sérénité : 100 / 100</div>
          <p>
            Tous les feux sont au vert : le budget n’est pas en déficit (35 pts), les charges fixes ne
            dépassent pas 50&nbsp;% (30 pts) et l’épargne effective atteint 20&nbsp;% (35 pts). Ce coussin de
            10 000 FCFA absorbe les petits aléas sans entamer votre épargne.
          </p>
        </div>
        <div class="ed-box accent-copper">
          <div class="ed-box-title">Comment accélérer votre objectif ?</div>
          <p>
            À 50 000 FCFA par mois, un <strong>Fonds de sécurité de 300 000 FCFA</strong> est constitué en
            <strong>6 mois</strong>. Si aucun imprévu ne consomme vos 10 000 FCFA de marge libre et que
            vous les basculez en fin de mois vers votre épargne, vous atteignez l’objectif en <strong>5 mois</strong>.
          </p>
        </div>
      </div>
    `,
  });
}

function buildPage8ProfileCreator() {
  return renderInnerPage({
    pageNum: 8,
    runningTitle: 'Partie II · Modèle 2 : Créateur / Freelance',
    sectionTag: 'CHAPITRE 2.2',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 2.2 · PROFIL CRÉATEUR / FREELANCE</div>
        <h2>Budget d’un indépendant à 450 000 FCFA estimés (~686 €)</h2>
      </div>

      <p>
        Pour un créateur digital, un consultant ou un travailleur indépendant, la confusion entre
        trésorerie d’activité et argent personnel est le piège le plus fréquent. La connexion fibre,
        les abonnements logiciels et la réserve pour impôts ou frais doivent être traités comme des
        <strong>charges fixes prioritaires</strong> avant de déterminer ce que vous pouvez dépenser.
      </p>

      ${editorialProportionBar([
        { label: 'Fixes & Outils pro', value: '225 000 F', pct: 50, color: '#1B365D' },
        { label: 'Vie & Plaisirs', value: '120 000 F', pct: 27, color: '#B45A32' },
        { label: 'Épargne', value: '90 000 F', pct: 20, color: '#2E5E4E' },
        { label: 'Marge libre', value: '15 000 F', pct: 3, color: '#C8BEB0' },
      ])}

      <table class="book-table compact">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Poste de dépense</th>
            <th class="num">Montant (FCFA)</th>
            <th class="num">Équivalent (€)</th>
            <th class="num">Part</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Fixes &amp; Outils pro</td><td>Loyer &amp; Électricité</td><td class="num">110 000 FCFA</td><td class="num">~168 €</td><td class="num">24&nbsp;%</td></tr>
          <tr><td>Fixes &amp; Outils pro</td><td>Internet Fibre &amp; Data</td><td class="num">35 000 FCFA</td><td class="num">~53 €</td><td class="num">8&nbsp;%</td></tr>
          <tr><td>Fixes &amp; Outils pro</td><td>Outils &amp; Abonnements pro</td><td class="num">35 000 FCFA</td><td class="num">~53 €</td><td class="num">8&nbsp;%</td></tr>
          <tr><td>Fixes &amp; Outils pro</td><td>Réserve impôts / frais</td><td class="num">45 000 FCFA</td><td class="num">~69 €</td><td class="num">10&nbsp;%</td></tr>
          <tr><td>Vie &amp; Plaisirs</td><td>Courses &amp; Repas</td><td class="num">75 000 FCFA</td><td class="num">~114 €</td><td class="num">17&nbsp;%</td></tr>
          <tr><td>Vie &amp; Plaisirs</td><td>Déplacements &amp; Sorties</td><td class="num">45 000 FCFA</td><td class="num">~69 €</td><td class="num">10&nbsp;%</td></tr>
          <tr><td>Épargne &amp; Trésorerie</td><td>Épargne mensuelle</td><td class="num text-sage"><strong>90 000 FCFA</strong></td><td class="num">~137 €</td><td class="num">20&nbsp;%</td></tr>
          <tr class="row-summary">
            <td colspan="2">Reste libre disponible ce mois (soit 500 FCFA / jour)</td>
            <td class="num">15 000 FCFA</td>
            <td class="num">~23 €</td>
            <td class="num">3&nbsp;%</td>
          </tr>
        </tbody>
      </table>

      <div class="ed-box">
        <div class="ed-box-title">La méthode du « mois plancher » face aux revenus irréguliers</div>
        <p>
          Lorsque vos encaissements varient entre 300 000 et 700 000 FCFA selon les contrats, ne
          relevez jamais votre niveau de charges fixes sur la base d’un mois exceptionnel. Calez vos
          dépenses sur votre plancher réaliste (ici 450 000 FCFA). Durant un mois plus élevé,
          orientez 100&nbsp;% du surplus vers deux destinations : votre <strong>trésorerie de lissage</strong>
          (pour couvrir un mois plus calme) et votre <strong>objectif d’équipement</strong> — par exemple, un
          <strong>Setup Vidéo &amp; Micro à 250 000 FCFA</strong> financé en <strong>3 mois</strong> au rythme de 90 000 FCFA/mois.
        </p>
      </div>
    `,
  });
}

function buildPage9ProfileStudent() {
  return renderInnerPage({
    pageNum: 9,
    runningTitle: 'Partie II · Modèle 3 : Étudiant',
    sectionTag: 'CHAPITRE 2.3',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 2.3 · PROFIL ÉTUDIANT</div>
        <h2>Budget d’un étudiant à 100 000 FCFA disponibles (~152 €)</h2>
      </div>

      <p>
        Avec un budget contraint (bourse, aide familiale ou petit job), la tentation est grande de
        penser qu’il est inutile d’épargner « si peu ». C’est exactement l’inverse : mettre de côté
        <strong>20 000 FCFA par mois</strong> vous évite d’être bloqué à la moindre panne de téléphone,
        dépense de rentrée ou frais de santé. Vous construisez l’habitude avant même d’avoir un gros revenu.
      </p>

      ${editorialProportionBar([
        { label: 'Charges essentielles', value: '50 000 F', pct: 50, color: '#1B365D' },
        { label: 'Vie & Plaisirs', value: '30 000 F', pct: 30, color: '#B45A32' },
        { label: 'Épargne de secours', value: '20 000 F', pct: 20, color: '#2E5E4E' },
      ])}

      <table class="book-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Poste de dépense</th>
            <th class="num">Montant (FCFA)</th>
            <th class="num">Équivalent (€)</th>
            <th class="num">Part</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Charges essentielles</td>
            <td>Chambre / Loyer (30 000) · Forfait Internet (10 000) · Transport campus (10 000)</td>
            <td class="num">50 000 FCFA</td>
            <td class="num">~76 €</td>
            <td class="num">50&nbsp;%</td>
          </tr>
          <tr>
            <td>Vie &amp; Plaisirs</td>
            <td>Repas &amp; Courses (25 000) · Sorties &amp; Extras (5 000)</td>
            <td class="num">30 000 FCFA</td>
            <td class="num">~46 €</td>
            <td class="num">30&nbsp;%</td>
          </tr>
          <tr>
            <td>Épargne de secours</td>
            <td>Épargne mensuelle mise de côté dès réception</td>
            <td class="num text-sage"><strong>20 000 FCFA</strong></td>
            <td class="num">~30 €</td>
            <td class="num">20&nbsp;%</td>
          </tr>
          <tr class="row-summary">
            <td colspan="2">Total alloué (budget calé à 100&nbsp;%, reste libre : 0 FCFA)</td>
            <td class="num">100 000 FCFA</td>
            <td class="num">~152 €</td>
            <td class="num">100&nbsp;%</td>
          </tr>
        </tbody>
      </table>

      <div class="two-col-notes">
        <div class="ed-box accent-copper">
          <div class="ed-box-title">Vigilance : 0 FCFA de coussin libre</div>
          <p>
            Ce budget atteint <strong>100/100</strong> sur les ratios, mais il est tendu au franc près.
            S’il survient une sortie imprévue de 5 000 FCFA, vous devez immédiatement la compenser sur
            les repas de la semaine ou reporter l’extra au mois suivant.
          </p>
        </div>
        <div class="ed-box">
          <div class="ed-box-title">L’astuce du découpage en quatre semaines</div>
          <p>
            Divisez vos <strong>25 000 FCFA de repas</strong> en quatre enveloppes hebdomadaires de
            <strong>6 250 FCFA</strong>. À ce rythme d’épargne de 20 000 FCFA/mois, vous financez un
            <strong>Nouveau Téléphone à 150 000 FCFA en 8 mois</strong> (240 000 FCFA cumulés en un an).
          </p>
        </div>
      </div>
    `,
  });
}

function buildPage10Part3Pilot(illus) {
  return renderInnerPage({
    pageNum: 10,
    runningTitle: 'Partie III · Pilotage & Reste libre quotidien',
    sectionTag: 'CHAPITRE 3.1',
    bodyHtml: `
      <div class="part-opener">
        <div class="po-text">
          <div class="part-num">PARTIE III</div>
          <h2>Calculer son reste libre quotidien et piloter son mois</h2>
          <p class="lead">
            Un tableau mensuel reste difficile à interpréter devant une caisse. Traduire votre marge
            en montant disponible par jour vous donne un repère concret à tout moment.
          </p>
        </div>
        <div class="po-art">
          <img src="${illus.part3}" alt="Illustration boussole et équilibre financier" />
        </div>
      </div>

      <div class="formula-book-box">
        <div class="fb-row">
          <span class="fb-lbl">Formule 1 · Reste libre mensuel</span>
          <span class="fb-eq mono">Reste libre mensuel = Revenu net − (Charges fixes + Vie &amp; Plaisirs + Épargne)</span>
        </div>
        <div class="fb-row">
          <span class="fb-lbl">Formule 2 · Budget libre par jour</span>
          <span class="fb-eq mono">Budget libre par jour = Reste libre mensuel ÷ 30</span>
        </div>
      </div>

      <p>
        Si votre reste libre est <strong>positif</strong>, toutes vos charges obligatoires et votre
        épargne sont déjà sécurisées : vous connaissez exactement la marge supplémentaire dont vous
        disposez chaque jour. S’il est <strong>négatif</strong>, votre budget est en déficit avant même
        de commencer : vous devez réduire un poste variable ou ajuster temporairement votre épargne
        avant d’entamer le mois.
      </p>

      <div class="sub-h">Cas pratique : redresser un mois parti en déficit</div>

      <div class="case-compare">
        <div class="cc-panel">
          <div class="cc-head text-copper">1. Plan initial (en déficit)</div>
          <ul>
            <li>Revenu net mensuel : <strong>250 000 FCFA</strong></li>
            <li>Charges fixes totales : <strong>140 000 FCFA</strong> (56&nbsp;%)</li>
            <li>Vie &amp; Plaisirs prévus : <strong>85 000 FCFA</strong> (34&nbsp;%)</li>
            <li>Épargne souhaitée : <strong>50 000 FCFA</strong> (20&nbsp;%)</li>
            <li class="text-copper"><strong>Reste libre : −25 000 FCFA</strong> (épargne amputée de moitié)</li>
          </ul>
        </div>
        <div class="cc-panel">
          <div class="cc-head text-sage">2. Plan ajusté avant le 1<sup>er</sup> du mois</div>
          <ul>
            <li>Allègement forfait &amp; transport : <strong>−10 000 FCFA</strong> (fixes à 130 000 F)</li>
            <li>Plafonnement sorties &amp; repas ext. : <strong>−20 000 FCFA</strong> (vie à 65 000 F)</li>
            <li>Épargne maintenue à 100&nbsp;% : <strong>50 000 FCFA</strong> (20&nbsp;%)</li>
            <li>Total alloué : <strong>245 000 FCFA</strong> (98&nbsp;%)</li>
            <li class="text-sage"><strong>Reste libre : +5 000 FCFA</strong> (soit +167 FCFA / jour)</li>
          </ul>
        </div>
      </div>
    `,
  });
}

function buildPage11Score() {
  return renderInnerPage({
    pageNum: 11,
    runningTitle: 'Partie III · Le Score de sérénité (/100)',
    sectionTag: 'CHAPITRE 3.2',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 3.2</div>
        <h2>Évaluer votre Score de sérénité financière (/100)</h2>
      </div>

      <p>
        Pour mesurer objectivement la solidité de votre budget sans vous fier à une impression vague,
        attribuez-vous une note sur <strong>100 points</strong> à partir de trois critères complémentaires.
        Cette grille met immédiatement en lumière le levier prioritaire à corriger.
      </p>

      <table class="book-table">
        <thead>
          <tr>
            <th style="width:24%;">Critère évalué</th>
            <th class="num" style="width:13%;">Points max</th>
            <th>Condition et méthode de calcul</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Équilibre du mois</strong></td>
            <td class="num"><strong>35 pts</strong></td>
            <td>
              <strong>35 pts</strong> si le Reste libre ≥ 0 FCFA (aucun déficit). Dès que les dépenses
              dépassent le revenu, la note baisse proportionnellement :
              <span class="mono">35 × (1 − 2,5 × |Déficit| ÷ Revenu)</span>.
            </td>
          </tr>
          <tr>
            <td><strong>2. Poids des charges fixes</strong></td>
            <td class="num"><strong>30 pts</strong></td>
            <td>
              <strong>30 pts</strong> si le total des charges fixes ≤ 50&nbsp;% du revenu mensuel.
              Au-delà de 50&nbsp;%, retirez <strong>1,2 point par pourcent supplémentaire</strong>
              (par exemple : 55&nbsp;% → 24 pts ; 60&nbsp;% → 18 pts).
            </td>
          </tr>
          <tr>
            <td><strong>3. Capacité d’épargne réelle</strong></td>
            <td class="num"><strong>35 pts</strong></td>
            <td>
              <strong>35 pts</strong> si l’épargne mensuelle effective ≥ 20&nbsp;% du revenu.
              En dessous de 20&nbsp;%, calcul proportionnel : <span class="mono">(Épargne effective % ÷ 20) × 35</span>.
              <em>Attention : tout déficit mensuel est déduit de votre épargne réelle.</em>
            </td>
          </tr>
          <tr class="row-summary">
            <td>Total Score de sérénité</td>
            <td class="num">100 pts</td>
            <td>70 à 100 : Mois maîtrisé · 45 à 69 : À ajuster · Moins de 45 : Zone fragile</td>
          </tr>
        </tbody>
      </table>

      <div class="sub-h">Comment interpréter votre résultat et agir immédiatement</div>

      <div class="score-zones">
        <div class="sz-card sz-good">
          <div class="sz-head">
            <span class="sz-range">70 à 100 pts</span>
            <span class="sz-lbl">Mois maîtrisé</span>
          </div>
          <p>
            Votre structure budgétaire est saine : l’épargne est protégée et vos charges fixes laissent
            de la souplesse. Concentrez-vous sur la régularité mensuelle et le basculement de vos
            excédents vers votre objectif prioritaire.
          </p>
        </div>

        <div class="sz-card sz-warn">
          <div class="sz-head">
            <span class="sz-range">45 à 69 pts</span>
            <span class="sz-lbl">À ajuster</span>
          </div>
          <p>
            Le mois reste tenable en apparence, mais votre marge de manœuvre est faible : un seul
            imprévu peut vous faire basculer en déficit ou réduire votre épargne sous les 15&nbsp;%.
            Plafonnez un à deux postes variables dès cette semaine.
          </p>
        </div>

        <div class="sz-card sz-bad">
          <div class="sz-head">
            <span class="sz-range">Moins de 45 pts</span>
            <span class="sz-lbl">Zone fragile</span>
          </div>
          <p>
            Votre budget souffre soit d’un déficit structurel, soit de charges fixes trop lourdes
            (&gt; 60&nbsp;%). Priorité absolue : ramener le Reste libre à 0 FCFA ou plus, même en
            abaissant provisoirement l’objectif d’épargne à 10&nbsp;% pendant deux mois.
          </p>
        </div>
      </div>
    `,
  });
}

function buildPage12CrashTest() {
  return renderInnerPage({
    pageNum: 12,
    runningTitle: 'Partie III · Le Crash-test des imprévus',
    sectionTag: 'CHAPITRE 3.3',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 3.3</div>
        <h2>Faire le « Crash-test » avant un achat ou un imprévu</h2>
      </div>

      <p>
        Une réparation de téléphone, une ordonnance, un événement familial ou un achat coup de cœur
        peuvent déséquilibrer tout un mois en quelques minutes. Avant de payer, appliquez le
        <strong>Crash-test</strong> : ajoutez mentalement ou sur papier le montant de l’imprévu
        (+15 000, +40 000 ou +80 000 FCFA) dans vos dépenses courantes et recalculez votre reste libre.
      </p>

      <div class="ed-box accent-copper" style="margin-bottom: 4mm;">
        <div class="ed-box-title">Règle simple avant toute dépense imprévue</div>
        <p>
          Si l’ajout de l’imprévu fait passer votre reste libre en dessous de 0 FCFA, vous savez
          immédiatement que vous devrez compenser sur un autre poste variable ou reporter l’achat
          au mois suivant plutôt que de puiser à l’aveugle dans votre épargne.
        </p>
      </div>

      <div class="sub-h">Simulation chiffrée sur le Profil Particulier (Revenu : 250 000 FCFA)</div>

      <table class="book-table compact">
        <thead>
          <tr>
            <th>Montant testé</th>
            <th class="num">Vie &amp; Plaisirs</th>
            <th class="num">Reste libre</th>
            <th class="num">Épargne réelle</th>
            <th class="num">Score /100</th>
            <th>Diagnostic</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>0 FCFA</strong> (Base)</td>
            <td class="num">65 000 F</td>
            <td class="num text-sage"><strong>+10 000 F</strong></td>
            <td class="num">50 000 F (20&nbsp;%)</td>
            <td class="num text-sage"><strong>100</strong></td>
            <td>Mois maîtrisé</td>
          </tr>
          <tr>
            <td><strong>+15 000 F</strong> (~23 €)</td>
            <td class="num">80 000 F</td>
            <td class="num text-copper"><strong>−5 000 F</strong></td>
            <td class="num">45 000 F (18&nbsp;%)</td>
            <td class="num"><strong>95</strong></td>
            <td>À compenser sur les sorties</td>
          </tr>
          <tr>
            <td><strong>+40 000 F</strong> (~61 €)</td>
            <td class="num">105 000 F</td>
            <td class="num text-copper"><strong>−30 000 F</strong></td>
            <td class="num">20 000 F (8&nbsp;%)</td>
            <td class="num text-copper"><strong>69</strong></td>
            <td>Zone « À ajuster » (−60&nbsp;% épargne)</td>
          </tr>
          <tr>
            <td><strong>+80 000 F</strong> (~122 €)</td>
            <td class="num">145 000 F</td>
            <td class="num text-copper"><strong>−70 000 F</strong></td>
            <td class="num text-copper"><strong>0 F (−20k)</strong></td>
            <td class="num text-copper"><strong>41</strong></td>
            <td>Zone fragile : mois en déficit</td>
          </tr>
        </tbody>
      </table>

      <!-- Graphique éditorial sobre style presse financière -->
      <div class="chart-paper-box">
        <div class="cpb-title">Érosion de votre épargne mensuelle réelle selon l’ampleur de l’imprévu (base : 50 000 FCFA)</div>
        <svg viewBox="0 0 600 135" width="100%" height="128">
          <line x1="155" y1="12" x2="155" y2="122" stroke="#1B1E1C" stroke-width="1" />
          <line x1="325" y1="12" x2="325" y2="122" stroke="#DED8CA" stroke-dasharray="3 3" stroke-width="1" />
          <line x1="495" y1="12" x2="495" y2="122" stroke="#DED8CA" stroke-dasharray="3 3" stroke-width="1" />

          <text x="145" y="32" text-anchor="end" font-size="11" font-weight="600" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Aucun choc (0 F)</text>
          <rect x="155" y="20" width="340" height="16" fill="#2E5E4E" />
          <text x="503" y="32" font-size="10.5" font-weight="700" fill="#2E5E4E" font-family="JetBrains Mono, monospace">50 000 F (100 %)</text>

          <text x="145" y="60" text-anchor="end" font-size="11" font-weight="600" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Choc +15 000 F</text>
          <rect x="155" y="48" width="306" height="16" fill="#1B365D" />
          <text x="469" y="60" font-size="10.5" font-weight="700" fill="#1B365D" font-family="JetBrains Mono, monospace">45 000 F (90 %)</text>

          <text x="145" y="88" text-anchor="end" font-size="11" font-weight="600" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Choc +40 000 F</text>
          <rect x="155" y="76" width="136" height="16" fill="#C48A3A" />
          <text x="299" y="88" font-size="10.5" font-weight="700" fill="#8A5D08" font-family="JetBrains Mono, monospace">20 000 F (40 %)</text>

          <text x="145" y="116" text-anchor="end" font-size="11" font-weight="600" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Choc +80 000 F</text>
          <rect x="155" y="104" width="6" height="16" fill="#B45A32" />
          <text x="170" y="116" font-size="10.5" font-weight="700" fill="#B45A32" font-family="JetBrains Mono, monospace">0 F + déficit réel de 20 000 F</text>
        </svg>
      </div>
    `,
  });
}

function buildPage13Arbitrage() {
  return renderInnerPage({
    pageNum: 13,
    runningTitle: 'Partie III · Matrice d’arbitrage & Fonds de sécurité',
    sectionTag: 'CHAPITRE 3.4',
    cream: true,
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 3.4</div>
        <h2>Matrice des quatre arbitrages et constitution du fonds de sécurité</h2>
      </div>

      <p>
        Lorsque le Crash-test annonce un dépassement, vous disposez toujours de quatre options claires.
        Choisissez celle qui correspond à la nature réelle de la dépense : urgence vitale, besoin
        différable ou simple envie ponctuelle.
      </p>

      <div class="arbitrage-grid">
        <div class="arb-card">
          <div class="arb-num">OPTION 01 · ABSORBER</div>
          <h3>Financer par le Reste libre</h3>
          <p><strong>Cas d’usage :</strong> dépense inférieure ou égale à votre marge libre du mois (ex. jusqu’à 10 000 FCFA).</p>
          <p class="arb-act">Décision : vous réglez la dépense sans modifier votre épargne ni vos charges fixes.</p>
        </div>

        <div class="arb-card">
          <div class="arb-num">OPTION 02 · COMPENSER</div>
          <h3>Réduire Vie &amp; Plaisirs sur le mois</h3>
          <p><strong>Cas d’usage :</strong> dépense imprévue modérée dépassant le Reste libre de 5 000 à 20 000 FCFA.</p>
          <p class="arb-act">Décision : vous mettez en pause les sorties et extras durant 10 à 15 jours pour revenir à l’équilibre.</p>
        </div>

        <div class="arb-card">
          <div class="arb-num">OPTION 03 · LISSER</div>
          <h3>Fractionner sur deux mois</h3>
          <p><strong>Cas d’usage :</strong> équipement, frais de scolarité ou entretien important de 30 000 à 80 000 FCFA.</p>
          <p class="arb-act">Décision : vous provisionnez la moitié ce mois-ci et le solde le mois suivant avant l’achat.</p>
        </div>

        <div class="arb-card">
          <div class="arb-num">OPTION 04 · REPORTER OU SÉCURISER</div>
          <h3>Règle des 72h ou Fonds de sécurité</h3>
          <p><strong>Cas d’usage :</strong> envie non vitale ou urgence majeure dépassant votre capacité mensuelle.</p>
          <p class="arb-act">Décision : envie → délai de 72 heures et report ; urgence vitale → mobilisation du Fonds de sécurité.</p>
        </div>
      </div>

      <div class="ed-box" style="margin-top: 4.5mm;">
        <div class="ed-box-title">Pourquoi le Fonds de sécurité est votre premier objectif prioritaire</div>
        <p>
          Avant même d’acheter du matériel ou de financer un projet personnel, constituez un
          <strong>Fonds de sécurité équivalent à 1 à 3 mois de charges essentielles</strong> (par exemple
          <strong>300 000 FCFA / ~457 €</strong> pour le profil Particulier). Cet amortisseur vous
          protège définitivement contre les chocs à +40 000 ou +80 000 FCFA : vous réglez l’urgence,
          puis vous reconstituez le fonds les mois suivants sans casser votre budget courant.
        </p>
      </div>
    `,
  });
}

function buildPage14Part4Goals(illus) {
  return renderInnerPage({
    pageNum: 14,
    runningTitle: 'Partie IV · Planifier un objectif concret',
    sectionTag: 'CHAPITRE 4.1',
    bodyHtml: `
      <div class="part-opener">
        <div class="po-text">
          <div class="part-num">PARTIE IV</div>
          <h2>Planifier un objectif concret et projeter sa cagnotte</h2>
          <p class="lead">
            Épargner sans raison précise décourage vite. Donner un nom, un montant cible et une
            échéance à votre épargne transforme un effort abstrait en compte à rebours concret.
          </p>
        </div>
        <div class="po-art">
          <img src="${illus.part4}" alt="Illustration progression et horizon d'épargne" />
        </div>
      </div>

      <div class="formula-book-box">
        <div class="fb-row">
          <span class="fb-lbl">Formule du compte à rebours</span>
          <span class="fb-eq mono">Nombre de mois nécessaires = Montant cible de l’objectif ÷ Épargne mensuelle réelle</span>
        </div>
        <div class="fb-note">Arrondissez systématiquement au mois entier supérieur (exemple : 250 000 ÷ 90 000 = 2,77 → 3 mois).</div>
      </div>

      <div class="sub-h">Temps nécessaire selon votre rythme d’épargne mensuelle</div>

      <table class="book-table">
        <thead>
          <tr>
            <th>Exemple d’objectif</th>
            <th class="num">Montant cible</th>
            <th class="num">À 20 000 F/mois<br/><span class="th-muted">(~30 €)</span></th>
            <th class="num">À 50 000 F/mois<br/><span class="th-muted">(~76 €)</span></th>
            <th class="num">À 90 000 F/mois<br/><span class="th-muted">(~137 €)</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Setup Vidéo &amp; Micro</strong></td>
            <td class="num">250 000 FCFA (~381 €)</td>
            <td class="num">13 mois</td>
            <td class="num">5 mois</td>
            <td class="num text-sage"><strong>3 mois</strong></td>
          </tr>
          <tr>
            <td><strong>Fonds de sécurité</strong></td>
            <td class="num">300 000 FCFA (~457 €)</td>
            <td class="num">15 mois</td>
            <td class="num text-sage"><strong>6 mois</strong></td>
            <td class="num">4 mois</td>
          </tr>
          <tr>
            <td><strong>Nouveau Téléphone</strong></td>
            <td class="num">400 000 FCFA (~610 €)</td>
            <td class="num">20 mois</td>
            <td class="num">8 mois</td>
            <td class="num text-sage"><strong>5 mois</strong></td>
          </tr>
          <tr>
            <td><strong>Lancer un Projet</strong></td>
            <td class="num">500 000 FCFA (~762 €)</td>
            <td class="num">25 mois</td>
            <td class="num">10 mois</td>
            <td class="num text-sage"><strong>6 mois</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="ed-box">
        <div class="ed-box-title">La règle de concentration : un objectif prioritaire à la fois</div>
        <p>
          Répartir 50 000 FCFA sur quatre cagnottes différentes donne l’illusion de ne jamais avancer.
          Concentrez l’intégralité de votre épargne mensuelle sur <strong>un seul objectif prioritaire</strong>
          jusqu’à son financement complet, puis basculez sur le suivant.
        </p>
      </div>
    `,
  });
}

function buildPage15Projections() {
  return renderInnerPage({
    pageNum: 15,
    runningTitle: 'Partie IV · Projection de cagnotte cumulée',
    sectionTag: 'CHAPITRE 4.2',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 4.2</div>
        <h2>Projection de cagnotte cumulée à 3, 6 et 12 mois</h2>
      </div>

      <p>
        Même un montant modeste mis de côté avec régularité produit un capital significatif en une
        année. Le tableau et le graphique ci-dessous servent de repères rapides pour mesurer la valeur
        concrète de votre constance mois après mois.
      </p>

      <table class="book-table">
        <thead>
          <tr>
            <th>Épargne mensuelle</th>
            <th class="num">Après 3 mois</th>
            <th class="num">Après 6 mois</th>
            <th class="num">Après 12 mois</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20 000 FCFA / mois</strong> <span class="small-muted">(~30 €)</span></td>
            <td class="num">60 000 FCFA</td>
            <td class="num">120 000 FCFA</td>
            <td class="num"><strong>240 000 FCFA</strong> <span class="small-muted">(~366 €)</span></td>
          </tr>
          <tr>
            <td><strong>50 000 FCFA / mois</strong> <span class="small-muted">(~76 €)</span></td>
            <td class="num">150 000 FCFA</td>
            <td class="num">300 000 FCFA</td>
            <td class="num text-sage"><strong>600 000 FCFA</strong> <span class="small-muted">(~915 €)</span></td>
          </tr>
          <tr>
            <td><strong>90 000 FCFA / mois</strong> <span class="small-muted">(~137 €)</span></td>
            <td class="num">270 000 FCFA</td>
            <td class="num">540 000 FCFA</td>
            <td class="num text-sage"><strong>1 080 000 FCFA</strong> <span class="small-muted">(~1 646 €)</span></td>
          </tr>
          <tr>
            <td><strong>150 000 FCFA / mois</strong> <span class="small-muted">(~229 €)</span></td>
            <td class="num">450 000 FCFA</td>
            <td class="num">900 000 FCFA</td>
            <td class="num text-sage"><strong>1 800 000 FCFA</strong> <span class="small-muted">(~2 744 €)</span></td>
          </tr>
        </tbody>
      </table>

      <div class="chart-paper-box">
        <div class="cpb-title">Trajectoire comparée sur 12 mois (50 000 FCFA vs 90 000 FCFA par mois)</div>
        <svg viewBox="0 0 600 165" width="100%" height="156">
          <line x1="65" y1="132" x2="565" y2="132" stroke="#1B1E1C" stroke-width="1.2" />
          <line x1="65" y1="92" x2="565" y2="92" stroke="#DED8CA" stroke-dasharray="3 3" />
          <line x1="65" y1="52" x2="565" y2="52" stroke="#DED8CA" stroke-dasharray="3 3" />
          <line x1="65" y1="16" x2="565" y2="16" stroke="#DED8CA" stroke-dasharray="3 3" />

          <text x="56" y="135" text-anchor="end" font-size="9.5" fill="#5A605C" font-family="JetBrains Mono, monospace">0</text>
          <text x="56" y="95" text-anchor="end" font-size="9.5" fill="#5A605C" font-family="JetBrains Mono, monospace">360k</text>
          <text x="56" y="55" text-anchor="end" font-size="9.5" fill="#5A605C" font-family="JetBrains Mono, monospace">720k</text>
          <text x="56" y="19" text-anchor="end" font-size="9.5" fill="#5A605C" font-family="JetBrains Mono, monospace">1,08M</text>

          <!-- 3 mois: 150k / 270k -->
          <rect x="115" y="116" width="44" height="16" fill="#1B365D" />
          <rect x="163" y="103" width="44" height="29" fill="#B45A32" />
          <text x="137" y="111" text-anchor="middle" font-size="9" font-weight="700" fill="#1B365D" font-family="JetBrains Mono, monospace">150k</text>
          <text x="185" y="98" text-anchor="middle" font-size="9" font-weight="700" fill="#B45A32" font-family="JetBrains Mono, monospace">270k</text>
          <text x="161" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Après 3 mois</text>

          <!-- 6 mois: 300k / 540k -->
          <rect x="275" y="100" width="44" height="32" fill="#1B365D" />
          <rect x="323" y="74" width="44" height="58" fill="#B45A32" />
          <text x="297" y="95" text-anchor="middle" font-size="9" font-weight="700" fill="#1B365D" font-family="JetBrains Mono, monospace">300k</text>
          <text x="345" y="69" text-anchor="middle" font-size="9" font-weight="700" fill="#B45A32" font-family="JetBrains Mono, monospace">540k</text>
          <text x="321" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Après 6 mois</text>

          <!-- 12 mois: 600k / 1080k -->
          <rect x="435" y="67" width="44" height="65" fill="#1B365D" />
          <rect x="483" y="16" width="44" height="116" fill="#B45A32" />
          <text x="457" y="62" text-anchor="middle" font-size="9" font-weight="700" fill="#1B365D" font-family="JetBrains Mono, monospace">600k</text>
          <text x="505" y="11" text-anchor="middle" font-size="9" font-weight="700" fill="#B45A32" font-family="JetBrains Mono, monospace">1,08M</text>
          <text x="481" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1B1E1C" font-family="Plus Jakarta Sans, sans-serif">Après 12 mois</text>
        </svg>
        <div class="cpb-legend">
          <span><i class="ep-swatch" style="background:#1B365D;"></i> Rythme 50 000 FCFA / mois</span>
          <span><i class="ep-swatch" style="background:#B45A32;"></i> Rythme 90 000 FCFA / mois</span>
        </div>
      </div>

      <div class="ed-box" style="margin-top: 4mm;">
        <div class="ed-box-title">Astuce d’accélération de fin de mois</div>
        <p>
          Dès qu’il vous reste un petit excédent libre en fin de mois (par exemple 10 000 FCFA ou 15 €),
          basculez-le vers votre épargne avant le mois suivant. Ce geste simple fait souvent gagner
          <strong>un à deux mois entiers</strong> sur l’atteinte de votre objectif principal sans effort supplémentaire.
        </p>
      </div>
    `,
  });
}

function buildPage16MistakesAndPlan() {
  const errors = [
    ['Épargner « ce qu’il reste » le 30 du mois', 'Transférez vos 20 % dès le lendemain de l’encaissement.'],
    ['Mélanger frais professionnels et vie personnelle', 'Classez fibre, outils et réserve fiscale dans vos Charges fixes.'],
    ['Ignorer les micro-frais invisibles', 'Commissions de transfert, pass data et cafés pèsent 8 à 12 % du mois.'],
    ['Sous-estimer le poste Courses & Repas', 'Partez de vos dépenses réelles des deux derniers mois avant d’ajuster.'],
    ['Confondre tontine de consommation et épargne', 'Affectez les sommes perçues en tontine à un fonds de sécurité ou un actif.'],
    ['Tout couper d’un coup sans ligne plaisirs', 'Conservez une petite enveloppe « Sorties & Extras » pour tenir dans la durée.'],
    ['Payer un gros achat sans simulation préalable', 'Passez toute dépense > 15 000 FCFA au Crash-test avant de valider.'],
  ];

  return renderInnerPage({
    pageNum: 16,
    runningTitle: 'Partie IV · Erreurs fréquentes & Plan 30 jours',
    sectionTag: 'CHAPITRE 4.3',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CHAPITRE 4.3 · SYNTHÈSE D’ACTION</div>
        <h2>Les 7 erreurs à éviter et votre rituel mensuel de 15 minutes</h2>
      </div>

      <table class="book-table compact">
        <thead>
          <tr>
            <th style="width:6%;">#</th>
            <th style="width:44%;">Erreur fréquente</th>
            <th>Correctif immédiat</th>
          </tr>
        </thead>
        <tbody>
          ${errors
            .map(
              ([err, fix], idx) => `
            <tr>
              <td class="strong text-navy">0${idx + 1}</td>
              <td><strong>${escapeHtml(err)}</strong></td>
              <td>${escapeHtml(fix)}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>

      <div class="sub-h">Plan de mise en place sur 30 jours</div>

      <div class="two-col-notes">
        <div class="ed-box">
          <div class="ed-box-title">Semaines 1 &amp; 2 · Cadrage et séparation</div>
          <p>
            Choisissez votre profil modèle, complétez les fiches 1 et 2 (pages 17–18), isolez votre
            enveloppe d’épargne sur un support dédié et divisez votre enveloppe Courses/Repas en quatre
            budgets hebdomadaires égaux.
          </p>
        </div>
        <div class="ed-box">
          <div class="ed-box-title">Semaines 3 &amp; 4 · Suivi et accélération</div>
          <p>
            Faites un point rapide le 15 du mois pour vérifier le rythme de vos dépenses variables,
            testez chaque achat important au Crash-test, puis transférez votre éventuel excédent le 30
            sur votre feuille de route annuelle.
          </p>
        </div>
      </div>

      <div class="ritual-book">
        <div class="rb-head">Votre rituel permanent en deux rendez-vous (15 minutes par mois)</div>
        <div class="rb-cols">
          <div>
            <strong>1. Le jour de réception du revenu (10 min)</strong>
            <p>Inscrivez votre revenu réel (bloc A), virez immédiatement l’épargne (bloc D) et calculez votre budget libre par jour.</p>
          </div>
          <div>
            <strong>2. Le 15 du mois à mi-parcours (5 min)</strong>
            <p>Vérifiez qu’aucune charge fixe n’a dérapé, contrôlez l’enveloppe Vie &amp; Plaisirs et simulez tout imprévu avant de payer.</p>
          </div>
        </div>
      </div>
    `,
  });
}

function buildPage17Sheet1() {
  return renderInnerPage({
    pageNum: 17,
    runningTitle: 'Cahier Pratique · Fiche 1 / 4',
    sectionTag: 'ANNEXE IMPRIMABLE',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CAHIER PRATIQUE · FICHE 1 / 4</div>
        <h2>Ma fiche budget mensuelle : Revenus &amp; Charges fixes</h2>
      </div>

      <p>
        Imprimez ou recopiez cette fiche en début de mois. Munissez-vous d’une calculatrice, renseignez
        vos montants réels et vérifiez chaque sous-total avant d’engager vos dépenses variables.
      </p>

      <div class="meta-fill-bar">
        <span>Mois : ______________________</span>
        <span>Devise : [ &nbsp; ] FCFA &nbsp; [ &nbsp; ] € EUR</span>
        <span>Règle : [ &nbsp; ] 50/30/20 &nbsp; [ &nbsp; ] 60/20/20 &nbsp; [ &nbsp; ] 45/20/35</span>
      </div>

      <table class="book-table worksheet">
        <thead>
          <tr>
            <th style="width:40%;">Poste budgétaire</th>
            <th style="width:34%;">Détail / Notes</th>
            <th class="num" style="width:26%;">Montant (FCFA ou €)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="row-summary">
            <td>A. Revenu net du mois</td>
            <td class="small-muted">Salaire, prestations, ventes ou bourse</td>
            <td class="write-box"></td>
          </tr>
          <tr><td>1. Loyer / Logement</td><td></td><td class="write-box"></td></tr>
          <tr><td>2. Factures : Eau, Électricité &amp; Internet</td><td></td><td class="write-box"></td></tr>
          <tr><td>3. Transport &amp; Déplacements fixes</td><td></td><td class="write-box"></td></tr>
          <tr><td>4. Outils, Abonnements pro ou Réserve impôts</td><td></td><td class="write-box"></td></tr>
          <tr><td>5. Autre charge fixe obligatoire</td><td></td><td class="write-box"></td></tr>
          <tr class="row-summary">
            <td>B. Sous-total Charges fixes (1 + 2 + 3 + 4 + 5)</td>
            <td>Repère sain : ≤ 50&nbsp;% du revenu A</td>
            <td class="write-box"></td>
          </tr>
        </tbody>
      </table>

      <div class="ed-box" style="margin-top: 5mm;">
        <div class="ed-box-title">Vérification intermédiaire : part de vos charges fixes</div>
        <p style="margin-bottom: 3mm;">
          Calculez : <strong>(Sous-total B ÷ Revenu A) × 100 = __________ %</strong>
        </p>
        <p>
          • Si le résultat est <strong>≤ 50&nbsp;%</strong> : votre base fixe est saine (30/30 points au Score de sérénité).<br/>
          • S’il se situe entre <strong>51&nbsp;% et 60&nbsp;%</strong> : passez temporairement sur la règle 60/20/20 (Prudent).<br/>
          • S’il dépasse <strong>60&nbsp;%</strong> : listez ci-dessous un poste fixe à renégocier ou alléger dans les 60 prochains jours :
        </p>
        <div class="write-lines">
          <div></div>
          <div></div>
        </div>
      </div>
    `,
  });
}

function buildPage18Sheet2() {
  return renderInnerPage({
    pageNum: 18,
    runningTitle: 'Cahier Pratique · Fiche 2 / 4',
    sectionTag: 'ANNEXE IMPRIMABLE',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CAHIER PRATIQUE · FICHE 2 / 4</div>
        <h2>Vie courante, Épargne, Reste libre &amp; Budget quotidien</h2>
      </div>

      <p>
        Reportez votre Revenu net <strong>(A)</strong> et votre Sous-total Charges fixes <strong>(B)</strong>
        de la fiche précédente, puis complétez les enveloppes variables et d’épargne pour calculer
        votre marge disponible par jour.
      </p>

      <table class="book-table worksheet">
        <thead>
          <tr>
            <th style="width:40%;">Poste budgétaire</th>
            <th style="width:34%;">Détail / Notes</th>
            <th class="num" style="width:26%;">Montant (FCFA ou €)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>6. Courses &amp; Repas</td><td></td><td class="write-box"></td></tr>
          <tr><td>7. Sorties, Famille &amp; Extras</td><td></td><td class="write-box"></td></tr>
          <tr><td>8. Imprévu ou achat prévu ce mois</td><td></td><td class="write-box"></td></tr>
          <tr class="row-summary">
            <td>C. Sous-total Vie &amp; Plaisirs (6 + 7 + 8)</td>
            <td>Repère sain : 20&nbsp;% à 30&nbsp;% du revenu A</td>
            <td class="write-box"></td>
          </tr>
          <tr class="row-summary">
            <td>D. Épargne &amp; Tontine du mois</td>
            <td>Repère sain : ≥ 20&nbsp;% du revenu A</td>
            <td class="write-box"></td>
          </tr>
          <tr>
            <td>Total alloué ce mois (B + C + D)</td>
            <td class="small-muted">À comparer avec votre revenu A</td>
            <td class="write-box"></td>
          </tr>
          <tr class="row-summary">
            <td>Reste libre mensuel : A − (B + C + D)</td>
            <td>Doit être ≥ 0 avant de démarrer le mois</td>
            <td class="write-box"></td>
          </tr>
          <tr>
            <td><strong>Budget libre par jour (Reste libre ÷ 30)</strong></td>
            <td class="small-muted">Votre repère quotidien sans toucher à l’épargne</td>
            <td class="write-box"></td>
          </tr>
        </tbody>
      </table>

      <div class="ed-box" style="margin-top: 5mm;">
        <div class="ed-box-title">Décisions et ajustements avant de commencer le mois</div>
        <p class="small-muted" style="margin-bottom: 2mm;">
          Notez ici les montants modifiés si votre Reste libre initial était négatif, ou le montant
          prévu à basculer vers votre objectif en fin de mois :
        </p>
        <div class="write-lines">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `,
  });
}

function buildPage19Sheet3() {
  return renderInnerPage({
    pageNum: 19,
    runningTitle: 'Cahier Pratique · Fiche 3 / 4',
    sectionTag: 'ANNEXE IMPRIMABLE',
    bodyHtml: `
      <div class="editorial-title-block">
        <div class="sec-kicker">CAHIER PRATIQUE · FICHE 3 / 4</div>
        <h2>Score de sérénité (/100) &amp; Journal de Crash-tests</h2>
      </div>

      <div class="sub-h" style="margin-top:0;">1. Auto-évaluation de votre Score de sérénité (/100)</div>

      <table class="book-table worksheet">
        <thead>
          <tr>
            <th style="width:27%;">Critère</th>
            <th style="width:39%;">Règle d’attribution</th>
            <th class="num" style="width:14%;">Barème</th>
            <th class="num" style="width:20%;">Vos points</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Équilibre du mois</strong></td>
            <td>Reste libre ≥ 0 → 35 pts ; sinon réduire selon déficit</td>
            <td class="num">/ 35 pts</td>
            <td class="write-box"></td>
          </tr>
          <tr>
            <td><strong>2. Charges fixes</strong><br/><span class="small-muted">(B ÷ A) × 100 = ____ %</span></td>
            <td>≤ 50&nbsp;% → 30 pts ; sinon 30 − 1,2 × (% − 50)</td>
            <td class="num">/ 30 pts</td>
            <td class="write-box"></td>
          </tr>
          <tr>
            <td><strong>3. Épargne réelle</strong><br/><span class="small-muted">(D ÷ A) × 100 = ____ %</span></td>
            <td>≥ 20&nbsp;% → 35 pts ; sinon (% ÷ 20) × 35</td>
            <td class="num">/ 35 pts</td>
            <td class="write-box"></td>
          </tr>
          <tr class="row-summary">
            <td colspan="2">TOTAL SCORE DE SÉRÉNITÉ DU MOIS</td>
            <td class="num">/ 100 pts</td>
            <td class="write-box"></td>
          </tr>
        </tbody>
      </table>

      <div class="meta-fill-bar" style="margin-top: 3.5mm;">
        <span>[ &nbsp; ] 70 à 100 : Mois maîtrisé</span>
        <span>[ &nbsp; ] 45 à 69 : À ajuster</span>
        <span>[ &nbsp; ] Moins de 45 : Zone fragile</span>
      </div>

      <div class="sub-h">2. Journal papier des Crash-tests (avant toute dépense imprévue)</div>

      <table class="book-table worksheet">
        <thead>
          <tr>
            <th style="width:31%;">Achat ou imprévu envisagé</th>
            <th style="width:17%;">Montant</th>
            <th style="width:24%;">Reste libre après choc</th>
            <th style="width:28%;">Décision (Absorber / Compenser / Reporter)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td></tr>
          <tr><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td></tr>
          <tr><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td></tr>
          <tr><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td></tr>
          <tr><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td><td class="write-tall"></td></tr>
        </tbody>
      </table>
    `,
  });
}

function buildPage20Sheet4() {
  const rows = Array.from({ length: 12 }, (_, idx) => {
    const n = String(idx + 1).padStart(2, '0');
    return `
      <tr>
        <td class="strong">Mois ${n}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="center">[ &nbsp; ]</td>
      </tr>`;
  }).join('');

  return renderInnerPage({
    pageNum: 20,
    runningTitle: 'Cahier Pratique · Fiche 4 / 4',
    sectionTag: 'ANNEXE IMPRIMABLE',
    bodyHtml: `
      <div class="editorial-title-block" style="margin-bottom: 3mm;">
        <div class="sec-kicker">CAHIER PRATIQUE · FICHE 4 / 4</div>
        <h2>Feuille de route Objectif prioritaire &amp; Suivi sur 12 mois</h2>
      </div>

      <table class="book-table worksheet" style="margin-bottom: 4mm;">
        <thead>
          <tr>
            <th style="width:38%;">Mon objectif prioritaire</th>
            <th style="width:22%;">Montant cible</th>
            <th style="width:20%;">Épargne / mois</th>
            <th style="width:20%;">Mois estimés (Cible ÷ D)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="write-tall"></td>
            <td class="write-tall"></td>
            <td class="write-tall"></td>
            <td class="write-tall"></td>
          </tr>
        </tbody>
      </table>

      <table class="book-table worksheet compact">
        <thead>
          <tr>
            <th style="width:12%;">Mois</th>
            <th style="width:21%;">Mois / Année</th>
            <th style="width:21%;">Épargne versée</th>
            <th style="width:20%;">Excédent ajouté</th>
            <th style="width:18%;">Cagnotte cumulée</th>
            <th class="center" style="width:8%;">Validé</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="milestone-bar">
        <div class="mb-title">Paliers de progression atteints (cochez chaque tranche de 10&nbsp;% franchie) :</div>
        <div class="mb-cells">
          <span>10 %</span><span>20 %</span><span>30 %</span><span>40 %</span><span>50 %</span>
          <span>60 %</span><span>70 %</span><span>80 %</span><span>90 %</span><span>100 %</span>
        </div>
      </div>

      <div class="ed-box" style="margin-top: 3.5mm; padding: 3mm 4mm;">
        <div class="ed-box-title" style="margin-bottom: 1mm;">Bilan annuel &amp; prochain objectif prioritaire :</div>
        <div class="write-lines">
          <div></div>
          <div></div>
        </div>
      </div>

      <div class="colophon-book">
        <strong>Éditions SOLDE · Guide Pratique du Budget Mensuel &amp; Objectifs d’Épargne.</strong>
        Réimprimez librement les pages 17 à 20 chaque mois pour suivre l’évolution de vos finances et
        bâtir chacun de vos projets étape par étape.
      </div>
    `,
  });
}

function buildEbookHtml() {
  const fontCss = buildFontFaceCss();
  const illus = loadIllustrations();

  const pages = [
    buildPage1Cover(illus),
    buildPage2Foreword(),
    buildPage3Toc(),
    buildPage4Part1(illus),
    buildPage5Part1Rules(),
    buildPage6Part2Overview(),
    buildPage7ProfileStandard(),
    buildPage8ProfileCreator(),
    buildPage9ProfileStudent(),
    buildPage10Part3Pilot(illus),
    buildPage11Score(),
    buildPage12CrashTest(),
    buildPage13Arbitrage(),
    buildPage14Part4Goals(illus),
    buildPage15Projections(),
    buildPage16MistakesAndPlan(),
    buildPage17Sheet1(),
    buildPage18Sheet2(),
    buildPage19Sheet3(),
    buildPage20Sheet4(),
  ].join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Organiser son budget mensuel et atteindre ses objectifs d'épargne — Éditions SOLDE</title>
  <style>
    ${fontCss}

    :root {
      --paper-cream: #FAF8F3;
      --paper-white: #FFFFFF;
      --ink: #1B1E1C;
      --ink-soft: #464C48;
      --ink-muted: #6C726E;
      --navy: #1B365D;
      --navy-soft: #EEF2F7;
      --copper: #B45A32;
      --copper-soft: #F9EFEA;
      --sage: #2E5E4E;
      --sage-soft: #EDF4F1;
      --rule: #DED8CA;
      --rule-strong: #C2B9A7;
      --font-serif: 'Instrument Serif', Georgia, serif;
      --font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', 'DejaVu Sans Mono', monospace;
    }

    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      font-family: var(--font-sans);
      color: var(--ink);
      background: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .mono {
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums;
    }
    .strong { font-weight: 700; }
    .small-muted { font-size: 8.2pt; color: var(--ink-muted); font-weight: 400; }
    .text-navy { color: var(--navy); }
    .text-copper { color: var(--copper); }
    .text-sage { color: var(--sage); }
    .bg-navy { background: var(--navy); }
    .bg-copper { background: var(--copper); }
    .bg-sage { background: var(--sage); }

    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    /* =========================================================================
       COUVERTURE ÉDITORIALE (PAGE 1)
       ========================================================================= */
    .cover-page {
      background: var(--paper-cream);
      padding: 13mm;
    }

    .cover-frame {
      height: 100%;
      border: 1px solid var(--rule-strong);
      outline: 3px solid var(--paper-cream);
      padding: 10mm 12mm 9mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--rule);
      padding-bottom: 4mm;
      font-size: 8pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--navy);
      font-weight: 700;
    }

    .cover-meta {
      color: var(--ink-muted);
      letter-spacing: 0.06em;
      font-weight: 600;
    }

    .cover-title-block {
      margin-top: 3mm;
    }

    .cover-kicker {
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: var(--copper);
      margin-bottom: 3mm;
    }

    .cover-title-block h1 {
      font-family: var(--font-serif);
      font-size: 38pt;
      font-weight: 400;
      line-height: 1.04;
      color: var(--navy);
      letter-spacing: -0.01em;
    }

    .cover-rule {
      width: 24mm;
      height: 2px;
      background: var(--copper);
      margin: 5mm 0 4.5mm;
    }

    .cover-subtitle {
      font-size: 10.5pt;
      line-height: 1.55;
      color: var(--ink-soft);
      max-width: 146mm;
    }

    .cover-art-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2mm 0;
    }

    .cover-art {
      width: 146mm;
      height: auto;
      display: block;
    }

    .cover-bottom {
      border-top: 1px solid var(--rule);
      padding-top: 4.5mm;
    }

    .cover-pillars {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3mm;
      margin-bottom: 4.5mm;
    }

    .cp-item {
      font-size: 8pt;
      line-height: 1.38;
      color: var(--ink-soft);
      border-left: 1.5px solid var(--rule-strong);
      padding-left: 2.5mm;
    }

    .cp-num {
      display: block;
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 11pt;
      color: var(--copper);
      margin-bottom: 0.5mm;
    }

    .cover-edition-foot {
      display: flex;
      justify-content: space-between;
      font-size: 7.8pt;
      color: var(--ink-muted);
      border-top: 1px solid var(--rule);
      padding-top: 3mm;
    }

    /* =========================================================================
       PAGES INTÉRIEURES DE LIVRE (PAGES 2 À 20)
       ========================================================================= */
    .inner-page {
      background: var(--paper-white);
      padding: 14mm 17mm 14mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .inner-page.is-cream {
      background: var(--paper-cream);
    }

    .book-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 0.8pt solid var(--rule);
      padding-bottom: 2.5mm;
      margin-bottom: 6mm;
      font-size: 8pt;
      color: var(--ink-muted);
      flex-shrink: 0;
    }

    .bh-left {
      font-style: italic;
    }

    .bh-right {
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--navy);
      font-size: 7.5pt;
    }

    .book-body {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
    }

    .book-foot {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-top: 0.8pt solid var(--rule);
      padding-top: 2.5mm;
      margin-top: 5mm;
      font-size: 7.8pt;
      color: var(--ink-muted);
      flex-shrink: 0;
    }

    .bf-right {
      font-weight: 700;
      color: var(--navy);
    }

    /* Titres et prose éditoriale */
    .editorial-title-block {
      margin-bottom: 4.5mm;
    }

    .sec-kicker, .part-num {
      font-size: 7.8pt;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: var(--copper);
      text-transform: uppercase;
      margin-bottom: 1.5mm;
    }

    h2 {
      font-family: var(--font-serif);
      font-size: 24pt;
      font-weight: 400;
      line-height: 1.1;
      color: var(--navy);
      letter-spacing: -0.01em;
    }

    .sub-h {
      font-size: 11pt;
      font-weight: 700;
      color: var(--navy);
      margin-top: 5mm;
      margin-bottom: 2.5mm;
      border-bottom: 0.8pt solid var(--rule);
      padding-bottom: 1.5mm;
    }

    p {
      font-size: 9.7pt;
      line-height: 1.58;
      color: var(--ink-soft);
      margin-bottom: 3mm;
    }

    p.lead {
      font-size: 10pt;
      line-height: 1.55;
      color: var(--ink);
    }

    p.dropcap::first-letter {
      font-family: var(--font-serif);
      font-size: 38pt;
      line-height: 0.85;
      float: left;
      padding-right: 3mm;
      padding-top: 1.5mm;
      color: var(--navy);
    }

    .editorial-quote {
      margin: 4mm 0 5mm;
      padding: 4mm 5.5mm;
      border-left: 2.5px solid var(--copper);
      background: var(--paper-cream);
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 13.5pt;
      line-height: 1.38;
      color: var(--navy);
    }

    .three-step-prose {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4mm;
      margin-bottom: 5mm;
    }

    .tsp-box {
      border: 0.8pt solid var(--rule);
      background: var(--paper-cream);
      padding: 3.5mm;
    }

    .tsp-idx {
      font-size: 8.5pt;
      font-weight: 700;
      color: var(--copper);
      margin-bottom: 1.5mm;
    }

    .tsp-box p {
      font-size: 8.6pt;
      line-height: 1.48;
      margin-bottom: 0;
    }

    .imprint-note {
      margin-top: auto;
      border-top: 0.8pt solid var(--rule);
      padding-top: 3mm;
      font-size: 8.5pt;
      line-height: 1.5;
      color: var(--ink-muted);
    }

    /* Sommaire (Page 3) */
    .toc-container {
      display: flex;
      flex-direction: column;
      gap: 4mm;
    }

    .toc-group {
      border-bottom: 0.8pt solid var(--rule);
      padding-bottom: 3mm;
    }
    .toc-group:last-child { border-bottom: none; }

    .toc-part-title {
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--copper);
      margin-bottom: 2mm;
    }

    .toc-line {
      display: flex;
      align-items: baseline;
      gap: 2.5mm;
      padding: 1.1mm 0;
      font-size: 9pt;
    }

    .tl-code {
      font-weight: 700;
      color: var(--navy);
      min-width: 24mm;
      font-size: 8.5pt;
    }

    .tl-title {
      color: var(--ink);
    }

    .tl-dots {
      flex: 1;
      border-bottom: 1px dotted var(--rule-strong);
      margin: 0 1mm;
    }

    .tl-pg {
      font-weight: 700;
      color: var(--navy);
      font-size: 8.5pt;
    }

    /* Ouverture de partie avec illustration intégrée */
    .part-opener {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 5mm;
      align-items: center;
      background: var(--paper-cream);
      border: 0.8pt solid var(--rule);
      padding: 4.5mm 5mm;
      margin-bottom: 4.5mm;
    }

    .po-text h2 {
      font-size: 21pt;
      margin-bottom: 2.5mm;
    }

    .po-text p.lead {
      font-size: 9.2pt;
      margin-bottom: 0;
    }

    .po-art img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Enveloppes (Page 4) */
    .envelope-list {
      display: flex;
      flex-direction: column;
      gap: 3.5mm;
      margin-top: 2mm;
    }

    .env-row {
      display: grid;
      grid-template-columns: 11mm 1fr;
      gap: 4mm;
      align-items: start;
      border-bottom: 0.8pt solid var(--rule);
      padding-bottom: 3.2mm;
    }
    .env-row:last-child { border-bottom: none; }

    .env-marker {
      width: 11mm;
      height: 11mm;
      color: #FFFFFF;
      font-family: var(--font-serif);
      font-size: 13pt;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .env-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1.2mm;
    }

    .env-head h3 {
      font-size: 10.5pt;
      font-weight: 700;
      color: var(--navy);
    }

    .env-target {
      font-size: 8pt;
      font-weight: 700;
      color: var(--copper);
    }

    .env-content p {
      font-size: 9pt;
      line-height: 1.5;
      margin-bottom: 0;
    }

    /* Tableaux éditoriaux */
    .book-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4mm;
      font-size: 8.8pt;
      border-top: 1.5pt solid var(--navy);
      border-bottom: 1.5pt solid var(--navy);
    }

    .book-table thead th {
      text-align: left;
      font-size: 8.2pt;
      font-weight: 700;
      color: var(--navy);
      background: var(--paper-cream);
      border-bottom: 1pt solid var(--navy);
      padding: 2.5mm 2.8mm;
      vertical-align: bottom;
    }

    .th-muted {
      font-weight: 400;
      font-size: 7.4pt;
      color: var(--ink-muted);
    }

    .book-table tbody td {
      padding: 2.4mm 2.8mm;
      border-bottom: 0.6pt solid var(--rule);
      vertical-align: middle;
      color: var(--ink);
    }

    .book-table.compact tbody td {
      padding: 1.9mm 2.6mm;
      font-size: 8.4pt;
    }

    .book-table tbody tr.row-summary td {
      background: var(--navy-soft);
      font-weight: 700;
      color: var(--navy);
      border-top: 0.8pt solid var(--navy);
    }

    .book-table .num {
      text-align: right;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .book-table .center {
      text-align: center;
    }

    /* Encadrés de livre */
    .two-col-notes {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4mm;
      margin-top: 3mm;
    }

    .ed-box {
      background: var(--paper-cream);
      border: 0.8pt solid var(--rule);
      border-top: 2pt solid var(--navy);
      padding: 3.8mm 4.2mm;
    }
    .ed-box.accent-copper {
      border-top-color: var(--copper);
    }

    .ed-box-title {
      font-size: 9.2pt;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 1.5mm;
    }
    .ed-box.accent-copper .ed-box-title {
      color: var(--copper);
    }

    .ed-box p {
      font-size: 8.7pt;
      line-height: 1.5;
      margin-bottom: 0;
    }

    /* Barre de proportion éditoriale */
    .ep-wrap {
      margin: 2mm 0 4.5mm;
    }
    .ep-track {
      display: flex;
      height: 4.2mm;
      width: 100%;
      border: 0.6pt solid var(--rule-strong);
      overflow: hidden;
    }
    .ep-seg { height: 100%; }
    .ep-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5mm 5mm;
      margin-top: 2mm;
      font-size: 8.2pt;
      color: var(--ink-soft);
    }
    .ep-leg-item {
      display: inline-flex;
      align-items: center;
      gap: 1.5mm;
    }
    .ep-swatch {
      display: inline-block;
      width: 2.6mm;
      height: 2.6mm;
    }

    /* Étapes numérotées (Page 6) */
    .steps-book-list {
      display: flex;
      flex-direction: column;
      gap: 3mm;
    }
    .sb-item {
      display: grid;
      grid-template-columns: 7.5mm 1fr;
      gap: 3mm;
      align-items: start;
      font-size: 9pt;
      line-height: 1.5;
      color: var(--ink-soft);
    }
    .sb-num {
      width: 7.5mm;
      height: 7.5mm;
      border: 1pt solid var(--navy);
      color: var(--navy);
      font-family: var(--font-serif);
      font-size: 11pt;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Formules & Cas comparés (Pages 10, 14) */
    .formula-book-box {
      background: var(--paper-cream);
      border: 0.8pt solid var(--rule);
      border-left: 3pt solid var(--navy);
      padding: 3.5mm 4.5mm;
      margin-bottom: 4mm;
    }
    .fb-row {
      margin-bottom: 2mm;
    }
    .fb-row:last-child { margin-bottom: 0; }
    .fb-lbl {
      display: block;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--copper);
      margin-bottom: 0.5mm;
    }
    .fb-eq {
      font-size: 9.2pt;
      font-weight: 700;
      color: var(--navy);
    }
    .fb-note {
      margin-top: 2mm;
      padding-top: 2mm;
      border-top: 0.6pt solid var(--rule);
      font-size: 8.4pt;
      color: var(--ink-soft);
    }

    .case-compare {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4mm;
    }
    .cc-panel {
      border: 0.8pt solid var(--rule);
      background: var(--paper-cream);
      padding: 3.8mm 4.2mm;
    }
    .cc-head {
      font-size: 9.5pt;
      font-weight: 700;
      margin-bottom: 2mm;
      border-bottom: 0.6pt solid var(--rule);
      padding-bottom: 1.5mm;
    }
    .cc-panel ul {
      padding-left: 4mm;
      font-size: 8.6pt;
      line-height: 1.55;
      color: var(--ink-soft);
    }

    /* Score zones (Page 11) */
    .score-zones {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3.5mm;
    }
    .sz-card {
      border: 0.8pt solid var(--rule);
      border-top-width: 2.5pt;
      background: var(--paper-cream);
      padding: 3.5mm;
    }
    .sz-good { border-top-color: var(--sage); }
    .sz-warn { border-top-color: #C48A3A; }
    .sz-bad { border-top-color: var(--copper); }

    .sz-head {
      margin-bottom: 2mm;
    }
    .sz-range {
      display: block;
      font-size: 8pt;
      font-weight: 700;
      color: var(--ink-muted);
    }
    .sz-lbl {
      font-family: var(--font-serif);
      font-size: 13pt;
      color: var(--navy);
    }
    .sz-card p {
      font-size: 8.4pt;
      line-height: 1.48;
      margin-bottom: 0;
    }

    /* Graphiques éditoriaux sur papier (Pages 12, 15) */
    .chart-paper-box {
      background: var(--paper-cream);
      border: 0.8pt solid var(--rule);
      padding: 3.8mm 4.5mm;
      margin-top: 3mm;
    }
    .cpb-title {
      font-size: 8.8pt;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 2mm;
    }
    .cpb-legend {
      display: flex;
      gap: 6mm;
      margin-top: 1.5mm;
      font-size: 8pt;
      color: var(--ink-soft);
    }
    .cpb-legend span {
      display: inline-flex;
      align-items: center;
      gap: 1.5mm;
    }

    /* Arbitrage (Page 13) */
    .arbitrage-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4mm;
    }
    .arb-card {
      background: #FFFFFF;
      border: 0.8pt solid var(--rule);
      padding: 4mm;
    }
    .arb-num {
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--copper);
      margin-bottom: 1mm;
    }
    .arb-card h3 {
      font-family: var(--font-serif);
      font-size: 14pt;
      font-weight: 400;
      color: var(--navy);
      margin-bottom: 2mm;
    }
    .arb-card p {
      font-size: 8.7pt;
      line-height: 1.48;
      margin-bottom: 2mm;
    }
    .arb-act {
      background: var(--paper-cream);
      border-left: 2pt solid var(--navy);
      padding: 2mm 2.8mm;
      margin-bottom: 0 !important;
      font-size: 8.4pt !important;
      color: var(--ink) !important;
    }

    /* Rituel (Page 16) */
    .ritual-book {
      margin-top: 4mm;
      border: 0.8pt solid var(--navy);
      background: var(--navy-soft);
      padding: 3.8mm 4.5mm;
    }
    .rb-head {
      font-size: 9.5pt;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 2.5mm;
    }
    .rb-cols {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5mm;
      font-size: 8.6pt;
    }
    .rb-cols p {
      font-size: 8.4pt;
      margin-top: 1mm;
      margin-bottom: 0;
    }

    /* Fiches imprimables (Pages 17-20) */
    .meta-fill-bar {
      display: flex;
      justify-content: space-between;
      background: var(--paper-cream);
      border: 0.8pt solid var(--rule);
      padding: 2.8mm 3.8mm;
      margin-bottom: 4mm;
      font-size: 8.6pt;
      font-weight: 600;
      color: var(--navy);
    }

    .worksheet td {
      border-right: 0.6pt solid var(--rule);
    }
    .worksheet td:last-child {
      border-right: none;
    }
    .worksheet .write-box {
      background: #FFFFFF !important;
      height: 9mm;
    }
    .worksheet .write-tall {
      background: #FFFFFF !important;
      height: 12.5mm;
    }

    .write-lines div {
      border-bottom: 0.8pt dashed var(--rule-strong);
      height: 8.5mm;
    }

    .milestone-bar {
      margin-top: 3.5mm;
      border: 0.8pt solid var(--rule);
      background: var(--paper-cream);
      padding: 3mm 3.8mm;
    }
    .mb-title {
      font-size: 8.2pt;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 2mm;
    }
    .mb-cells {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 1.5mm;
    }
    .mb-cells span {
      border: 0.6pt solid var(--rule-strong);
      background: #FFFFFF;
      text-align: center;
      font-size: 7.5pt;
      font-weight: 600;
      color: var(--ink-soft);
      padding: 1.5mm 0;
    }

    .colophon-book {
      margin-top: auto;
      border-top: 0.8pt solid var(--rule);
      padding-top: 3mm;
      font-size: 8.2pt;
      line-height: 1.48;
      color: var(--ink-muted);
    }
  </style>
</head>
<body>
  ${pages}
</body>
</html>`;
}

function renderPdf(chromeBin, htmlContent, outPath, tempDir) {
  const htmlPath = path.join(tempDir, 'solde-ebook.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

  if (fs.existsSync(outPath)) {
    fs.unlinkSync(outPath);
  }

  execFileSync(
    chromeBin,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--no-pdf-header-footer',
      `--print-to-pdf=${outPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  if (!fs.existsSync(outPath)) {
    throw new Error(`Fichier PDF manquant : ${outPath}`);
  }
  const stat = fs.statSync(outPath);
  const header = fs.readFileSync(outPath).subarray(0, 5).toString('ascii');
  if (stat.size <= 0 || header !== '%PDF-') {
    throw new Error(`PDF invalide généré pour ${outPath}`);
  }

  let pages = null;
  try {
    const info = execFileSync('pdfinfo', [outPath], { encoding: 'utf-8' });
    const match = info.match(/Pages:\s+(\d+)/);
    if (match) pages = Number(match[1]);
  } catch {
    // pdfinfo optionnel
  }

  console.log(`✅ ${path.relative(rootDir, outPath)} (${stat.size} octets, ${pages ?? '?'} pages)`);
  return pages;
}

function main() {
  const chromeBin = findChromeEngine();
  fs.mkdirSync(outputDir, { recursive: true });
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'solde-ebook-pdf-'));

  try {
    const html = buildEbookHtml();
    const pages = renderPdf(chromeBin, html, OUTPUT_PDF_PATH, tempDir);
    if (pages !== null && pages !== TOTAL_PAGES) {
      console.warn(`⚠️ Attention : ${pages} pages générées au lieu de ${TOTAL_PAGES} attendues.`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main();

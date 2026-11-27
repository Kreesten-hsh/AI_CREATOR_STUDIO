import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const OUT_PDF = path.join(__dirname, 'Programme-Reset-21-Jours.pdf');
const FONTS_DIR = path.join(REPO_ROOT, 'public/fonts');

function findPlaywright() {
  const npxRoot = path.join(process.env.HOME || '/home/hasashi', '.npm/_npx');
  if (fs.existsSync(npxRoot)) {
    for (const dir of fs.readdirSync(npxRoot)) {
      const candidate = path.join(npxRoot, dir, 'node_modules/playwright-core/index.mjs');
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  const require = createRequire(import.meta.url);
  return require.resolve('playwright-core');
}

function findChromeExecutable() {
  const candidate = path.join(
    REPO_ROOT,
    'video-studio/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell'
  );
  if (fs.existsSync(candidate)) return candidate;
  return undefined;
}

function fontDataUri(filename, mime) {
  const fullPath = path.join(FONTS_DIR, filename);
  if (!fs.existsSync(fullPath)) return '';
  const b64 = fs.readFileSync(fullPath).toString('base64');
  return `data:${mime};base64,${b64}`;
}

const WEEKS = [
  {
    num: 1,
    title: 'Semaine 1 — Alléger & Clarifier',
    subtitle: 'Jours 1 à 7 : réduire le bruit mental et poser un socle quotidien simple.',
    days: [
      { day: 1, title: 'Libérer le matin avant l’écran', theme: 'Hygiène matinale', action: 'Attendez 15 minutes après le réveil avant d’ouvrir votre téléphone. Buvez un verre d’eau et notez votre priorité du jour.' },
      { day: 2, title: 'La règle d’une seule priorité', theme: 'Clarté', action: 'Choisissez une tâche essentielle qui rendra votre journée utile, même si le reste est reporté.' },
      { day: 3, title: 'Audit des notifications', theme: 'Environnement', action: 'Coupez toutes les notifications non humaines (réseaux, promotions, badges) sur votre téléphone.' },
      { day: 4, title: 'Bureau et sac à zéro friction', theme: 'Espace', action: 'Dégagez votre espace de travail en 10 minutes : ne laissez que ce qui sert à la tâche en cours.' },
      { day: 5, title: 'Pause respiratoire 4-4-6', theme: 'Régulation', action: 'Avant la reprise de l’après-midi, pratiquez 3 minutes de respiration lente (4 s inspire, 4 s pause, 6 s expire).' },
      { day: 6, title: 'Vider la charge mentale', theme: 'Organisation', action: 'Écrivez sur papier tout ce qui tourne en boucle dans votre tête, puis classez : faire, planifier ou supprimer.' },
      { day: 7, title: 'Revue calme de la Semaine 1', theme: 'Bilan', action: 'Relisez vos 6 premiers jours : gardez ce qui vous a allégé et simplifiez ce qui a bloqué.' },
    ],
  },
  {
    num: 2,
    title: 'Semaine 2 — Installer le Focus',
    subtitle: 'Jours 8 à 14 : protéger des blocs de travail profond sans interruption.',
    days: [
      { day: 8, title: 'Premier bloc Deep Work 25 min', theme: 'Deep Work', action: 'Téléphone en mode avion dans une autre pièce. Travaillez 25 minutes sur votre priorité unique sans changer d’onglet.' },
      { day: 9, title: 'La règle des 2 minutes', theme: 'Fluidité', action: 'Regroupez les petites tâches rapides sur un créneau dédié de 15 minutes au lieu de hacher votre matinée.' },
      { day: 10, title: 'Mono-tâche volontaire', theme: 'Attention', action: 'Fermez tous les onglets inutiles. Une fenêtre ouverte = une seule intention à la fois.' },
      { day: 11, title: 'Protéger la première heure', theme: 'Rythme', action: 'Consacrez les 60 premières minutes de travail à créer ou avancer, avant de consulter messages et e-mails.' },
      { day: 12, title: 'Bloc approfondi 50 min', theme: 'Deep Work', action: 'Enchaînez 50 minutes de concentration continue suivies de 10 minutes de vraie pause loin des écrans.' },
      { day: 13, title: 'Coupure numérique du soir', theme: 'Sommeil', action: 'Posez le téléphone 45 minutes avant de dormir et remplacez le défilement par 3 lignes de bilan.' },
      { day: 14, title: 'Revue calme de la Semaine 2', theme: 'Bilan', action: 'Comptez vos blocs de focus réussis et repérez l’heure de la journée où votre énergie est la plus haute.' },
    ],
  },
  {
    num: 3,
    title: 'Semaine 3 — Ancrer la Constance',
    subtitle: 'Jours 15 à 21 : transformer l’effort ponctuel en habitude durable.',
    days: [
      { day: 15, title: 'Préparer demain dès ce soir', theme: 'Anticipation', action: 'Écrivez votre priorité absolue du lendemain avant de fermer votre journée pour démarrer sans hésiter.' },
      { day: 16, title: 'Dire non à une dispersion', theme: 'Limites', action: 'Refusez ou reportez une sollicitation non prioritaire pour préserver votre créneau de travail profond.' },
      { day: 17, title: 'Marche sans écouteurs', theme: 'Clarté', action: 'Marchez 15 minutes sans podcast ni musique pour laisser votre esprit digérer et faire émerger vos idées.' },
      { day: 18, title: 'Double bloc de concentration', theme: 'Deep Work', action: 'Réalisez deux blocs de 25 minutes dans la journée sur votre projet le plus important.' },
      { day: 19, title: 'Audit d’énergie réel', theme: 'Énergie', action: 'Notez ce qui a élevé votre énergie cette semaine et ce qui l’a drainée inutilement.' },
      { day: 20, title: 'Rituel de clôture propre', theme: 'Transition', action: 'À heure fixe, rangez votre bureau, cochez vos 3 habitudes et fermez mentalement la journée.' },
      { day: 21, title: 'Bilan final & Système durable', theme: 'Consolidation', action: 'Choisissez les 3 rituels que vous conservez définitivement pour les 90 prochains jours.' },
    ],
  },
];

function renderWeekPage(week, pageNum) {
  const rows = week.days
    .map(
      (d) => `
      <tr>
        <td class="col-day">Jour ${String(d.day).padStart(2, '0')}</td>
        <td class="col-title">
          <strong>${d.title}</strong>
          <div class="theme-tag">${d.theme}</div>
        </td>
        <td class="col-action">${d.action}</td>
        <td class="col-check"><span class="box"></span></td>
      </tr>`
    )
    .join('');

  return `
  <section class="page">
    <div class="page-head">
      <span>Programme Reset 21 Jours</span>
      <span>Semaine ${week.num} / 3</span>
    </div>
    <h2>${week.title}</h2>
    <p class="lead">${week.subtitle}</p>
    <table class="days-table">
      <thead>
        <tr>
          <th style="width: 13%">Jour</th>
          <th style="width: 29%">Micro-défi</th>
          <th style="width: 50%">Consigne pratique du jour</th>
          <th style="width: 8%; text-align:center;">Fait</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="callout">
      <strong>Point d’attention — Semaine ${week.num} :</strong>
      Ne cherchez pas la perfection absolue. Si une journée dérape, ne recommencez pas à zéro : reprenez simplement au jour suivant en gardant une seule priorité réalisable.
    </div>
    <div class="page-foot">
      <span>Guide pratique — Méthode Reset 21 Jours</span>
      <span>Page ${pageNum} / 10</span>
    </div>
  </section>`;
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Programme Reset 21 Jours — Guide Pratique</title>
<style>
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('${fontDataUri('PlusJakartaSans-latin.woff2', 'font/woff2')}') format('woff2');
    font-weight: 400 800;
    font-style: normal;
  }
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('${fontDataUri('JetBrainsMono-Regular.ttf', 'font/ttf')}') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #334155;
    background: #FFFFFF;
    font-size: 10.5pt;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 18mm 18mm 16mm;
    position: relative;
    page-break-after: always;
    overflow: hidden;
    background: #FFFFFF;
  }
  .page:last-child { page-break-after: auto; }
  .page-head {
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #64748B;
    border-bottom: 1px solid #CBD5E1;
    padding-bottom: 6px;
    margin-bottom: 16px;
  }
  .page-foot {
    position: absolute;
    left: 18mm;
    right: 18mm;
    bottom: 12mm;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #64748B;
    border-top: 1px solid #E2E8F0;
    padding-top: 6px;
  }
  /* Cover (Classic neutral ebook look) */
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24mm 20mm 18mm;
  }
  .cover-top {
    border-top: 4px solid #2C3E50;
    padding-top: 18px;
  }
  .cover-kicker {
    font-size: 9.5pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #475569;
    font-weight: 700;
    margin-bottom: 14px;
  }
  .cover h1 {
    font-size: 32pt;
    line-height: 1.12;
    color: #1E293B;
    font-weight: 800;
    margin-bottom: 16px;
  }
  .cover-sub {
    font-size: 13pt;
    color: #475569;
    max-width: 140mm;
    line-height: 1.5;
  }
  .cover-box {
    background: #F8FAFC;
    border: 1px solid #CBD5E1;
    border-left: 4px solid #2C3E50;
    padding: 18px 20px;
    margin: 24px 0;
  }
  .cover-box h3 {
    font-size: 11pt;
    color: #1E293B;
    margin-bottom: 10px;
  }
  .cover-box ul {
    padding-left: 18px;
    color: #334155;
    font-size: 10pt;
  }
  .cover-box li { margin-bottom: 6px; }
  .cover-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    border-top: 1px solid #CBD5E1;
    border-bottom: 1px solid #CBD5E1;
    padding: 14px 0;
    margin-top: 16px;
  }
  .cover-meta div strong {
    display: block;
    font-size: 12pt;
    color: #2C3E50;
  }
  .cover-meta div span {
    font-size: 8.5pt;
    color: #64748B;
  }
  .cover-bottom {
    font-size: 9pt;
    color: #64748B;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #E2E8F0;
    padding-top: 10px;
  }
  h2 {
    font-size: 17pt;
    color: #2C3E50;
    font-weight: 800;
    margin-bottom: 6px;
  }
  h3 {
    font-size: 11.5pt;
    color: #1E293B;
    font-weight: 700;
    margin: 14px 0 6px;
  }
  .lead {
    color: #475569;
    font-size: 10pt;
    margin-bottom: 14px;
  }
  .toc-list {
    list-style: none;
    margin-bottom: 18px;
    border: 1px solid #E2E8F0;
    padding: 12px 16px;
    background: #F8FAFC;
  }
  .toc-list li {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px dashed #CBD5E1;
    font-size: 9.8pt;
  }
  .toc-list li:last-child { border-bottom: none; }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 12px 0 16px;
  }
  .pillar {
    border: 1px solid #CBD5E1;
    padding: 12px;
    background: #FFFFFF;
  }
  .pillar-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    color: #2C3E50;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .pillar h4 {
    font-size: 10.5pt;
    color: #1E293B;
    margin-bottom: 5px;
  }
  .pillar p { font-size: 9pt; color: #475569; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 9.2pt;
  }
  th {
    background: #2C3E50;
    color: #FFFFFF;
    text-align: left;
    padding: 7px 8px;
    font-weight: 700;
    font-size: 8.8pt;
  }
  td {
    border: 1px solid #CBD5E1;
    padding: 8px 8px;
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #F8FAFC; }
  .col-day {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: #2C3E50;
    white-space: nowrap;
  }
  .theme-tag {
    font-size: 8pt;
    color: #64748B;
    margin-top: 2px;
  }
  .col-check { text-align: center; vertical-align: middle; }
  .box {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1.5px solid #475569;
    background: #FFFFFF;
  }
  .callout {
    margin-top: 14px;
    padding: 11px 14px;
    background: #F1F5F9;
    border-left: 3px solid #2C3E50;
    font-size: 9.2pt;
    color: #334155;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 10px;
  }
  .card-plain {
    border: 1px solid #CBD5E1;
    padding: 12px 14px;
    background: #F8FAFC;
  }
  .card-plain ul { padding-left: 16px; font-size: 9.2pt; margin-top: 6px; }
  .card-plain li { margin-bottom: 5px; }
  .tracker-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin: 12px 0 18px;
  }
  .tracker-cell {
    border: 1px solid #94A3B8;
    height: 24mm;
    padding: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 8.5pt;
  }
  .tracker-cell strong {
    font-family: 'JetBrains Mono', monospace;
    color: #2C3E50;
  }
  .write-line {
    border-bottom: 1px solid #CBD5E1;
    height: 26px;
    margin-bottom: 6px;
  }
  .sheet-block {
    border: 1px solid #CBD5E1;
    padding: 12px 14px;
    margin-bottom: 14px;
  }
</style>
</head>
<body>

  <!-- PAGE 1 : COUVERTURE CLASSIQUE -->
  <section class="page cover">
    <div class="cover-top">
      <div class="cover-kicker">Cahier Pratique · Développement Personnel & Organisation</div>
      <h1>Programme Reset<br />21 Jours</h1>
      <p class="cover-sub">Retrouver de la clarté mentale, structurer ses journées autour d’une priorité réelle et installer des habitudes stables sans surcharge.</p>

      <div class="cover-box">
        <h3>Ce que contient ce guide pratique :</h3>
        <ul>
          <li>La méthode quotidienne <strong>1-3-1</strong> (1 priorité absolue, 3 habitudes socles, 1 bilan rapide).</li>
          <li>Les <strong>21 micro-défis progressifs</strong> répartis en 3 semaines (Alléger, Installer le Focus, Ancrer).</li>
          <li>Le protocole <strong>Deep Work</strong> (blocs de 15, 25 et 50 min) et la pause respiratoire <strong>4-4-6</strong>.</li>
          <li><strong>3 fiches imprimables</strong> pour suivre vos 21 jours, votre journal du soir et votre niveau d’énergie.</li>
        </ul>
      </div>

      <div class="cover-meta">
        <div><strong>21 jours</strong><span>Parcours progressif en 3 semaines</span></div>
        <div><strong>15 à 50 min</strong><span>Blocs de concentration modulables</span></div>
        <div><strong>3 fiches</strong><span>Suivi papier imprimable inclus</span></div>
      </div>
    </div>

    <div class="cover-bottom">
      <span>Édition Classique — Guide A4 Imprimable</span>
      <span>10 pages</span>
    </div>
  </section>

  <!-- PAGE 2 : SOMMAIRE & LES 3 PILIERS -->
  <section class="page">
    <div class="page-head">
      <span>Programme Reset 21 Jours</span>
      <span>Sommaire & Méthode</span>
    </div>
    <h2>Sommaire du programme</h2>
    <p class="lead">Un cadre simple à suivre jour après jour pour remplacer la dispersion par un rythme calme et régulier.</p>

    <ul class="toc-list">
      <li><span>1. Les 3 piliers de la méthode quotidienne</span><strong>Page 2</strong></li>
      <li><span>2. Semaine 1 (J1 à J7) — Alléger & Clarifier</span><strong>Page 3</strong></li>
      <li><span>3. Semaine 2 (J8 à J14) — Installer le Focus</span><strong>Page 4</strong></li>
      <li><span>4. Semaine 3 (J15 à J21) — Ancrer la Constance</span><strong>Page 5</strong></li>
      <li><span>5. Protocole Deep Work — Sessions 15, 25 et 50 minutes</span><strong>Page 6</strong></li>
      <li><span>6. Guide de Respiration 4-4-6 & Coupure des distractions</span><strong>Page 7</strong></li>
      <li><span>7. Fiche Imprimable 1 — Grille de suivi 21 jours</span><strong>Page 8</strong></li>
      <li><span>8. Fiche Imprimable 2 — Méthode 1-3-1 & Journal du soir</span><strong>Page 9</strong></li>
      <li><span>9. Fiche Imprimable 3 — Suivi d’énergie hebdomadaire</span><strong>Page 10</strong></li>
    </ul>

    <h3>Les 3 piliers quotidiens (Méthode 1-3-1)</h3>
    <div class="grid-3">
      <div class="pillar">
        <div class="pillar-num">PILIER 01</div>
        <h4>1 Priorité absolue</h4>
        <p>Chaque matin, définissez une seule action décisive. Tant qu’elle n’est pas lancée, les tâches secondaires attendent.</p>
      </div>
      <div class="pillar">
        <div class="pillar-num">PILIER 02</div>
        <h4>3 Habitudes socles</h4>
        <p>Trois gestes courts et non négociables : 15 min sans écran au réveil, 1 bloc de focus profond, 3 lignes de bilan le soir.</p>
      </div>
      <div class="pillar">
        <div class="pillar-num">PILIER 03</div>
        <h4>1 Bilan en 3 lignes</h4>
        <p>Le soir, notez une avancée, une chose à lâcher et l’intention de demain. En 2 minutes, l’esprit ferme la journée.</p>
      </div>
    </div>

    <div class="callout">
      <strong>Mode d’emploi :</strong> Imprimez les pages 8 à 10 ou utilisez un carnet dédié. Consacrez 5 minutes le matin à définir votre priorité, réalisez un bloc de concentration dans la journée, puis cochez votre progression le soir.
    </div>

    <div class="page-foot">
      <span>Guide pratique — Méthode Reset 21 Jours</span>
      <span>Page 2 / 10</span>
    </div>
  </section>

  <!-- PAGES 3, 4, 5 : SEMAINES 1, 2, 3 -->
  ${renderWeekPage(WEEKS[0], 3)}
  ${renderWeekPage(WEEKS[1], 4)}
  ${renderWeekPage(WEEKS[2], 5)}

  <!-- PAGE 6 : PROTOCOLE DEEP WORK -->
  <section class="page">
    <div class="page-head">
      <span>Programme Reset 21 Jours</span>
      <span>Protocole Deep Work</span>
    </div>
    <h2>Protocole Deep Work : travailler sans hacher son attention</h2>
    <p class="lead">Un bloc de travail profond repose sur trois règles simples : une tâche précise, zéro notification et une durée bornée à l’avance.</p>

    <table>
      <thead>
        <tr>
          <th style="width: 18%">Format</th>
          <th style="width: 22%">Rythme</th>
          <th style="width: 35%">Quand l’utiliser</th>
          <th style="width: 25%">Pause recommandée</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-day">Sprint 15 min</td>
          <td>15 min effort</td>
          <td>Jours de faible énergie ou démarrage d’une tâche intimidante.</td>
          <td>3 min debout, sans écran</td>
        </tr>
        <tr>
          <td class="col-day">Standard 25 min</td>
          <td>25 min effort / 5 min pause</td>
          <td>Rythme principal des Semaines 1 et 2 pour avancer régulièrement.</td>
          <td>5 min respiration ou eau</td>
        </tr>
        <tr>
          <td class="col-day">Approfondi 50 min</td>
          <td>50 min effort / 10 min pause</td>
          <td>Rédaction, création ou réflexion stratégique dès la Semaine 2.</td>
          <td>10 min marche ou étirement</td>
        </tr>
      </tbody>
    </table>

    <div class="two-col">
      <div class="card-plain">
        <h3>Avant de lancer le minuteur</h3>
        <ul>
          <li>Écrivez l’objectif exact du bloc en une phrase claire.</li>
          <li>Activez le mode avion ou posez le téléphone hors de vue.</li>
          <li>Fermez la messagerie et tous les onglets sans rapport.</li>
          <li>Gardez une feuille libre à côté pour noter toute idée parasite.</li>
        </ul>
      </div>
      <div class="card-plain">
        <h3>À la fin du bloc</h3>
        <ul>
          <li>Arrêtez dès la fin du temps prévu pour garder de l’élan.</li>
          <li>Cochez le bloc réalisé sur votre fiche de suivi.</li>
          <li>Levez-vous et regardez au loin pendant la pause.</li>
          <li>Évitez les réseaux sociaux pendant les 5 à 10 minutes de repos.</li>
        </ul>
      </div>
    </div>

    <div class="callout">
      <strong>Règle de continuité :</strong> Un seul bloc de 25 minutes tenu chaque jour pendant 21 jours représente près de 9 heures de travail concentré sans distraction.
    </div>

    <div class="page-foot">
      <span>Guide pratique — Méthode Reset 21 Jours</span>
      <span>Page 6 / 10</span>
    </div>
  </section>

  <!-- PAGE 7 : RESPIRATION 4-4-6 & DISTRACTIONS -->
  <section class="page">
    <div class="page-head">
      <span>Programme Reset 21 Jours</span>
      <span>Respiration & Calme</span>
    </div>
    <h2>Pause respiratoire 4-4-6 & Hygiène attentionnelle</h2>
    <p class="lead">Avant un bloc important ou lors d’un pic de dispersion, trois minutes de respiration lente suffisent à faire redescendre la pression.</p>

    <div class="grid-3">
      <div class="pillar">
        <div class="pillar-num">PHASE 01</div>
        <h4>Inspirer — 4 secondes</h4>
        <p>Inspirez calmement par le nez en relâchant les épaules et la mâchoire.</p>
      </div>
      <div class="pillar">
        <div class="pillar-num">PHASE 02</div>
        <h4>Retenir — 4 secondes</h4>
        <p>Maintenez l’air sans tension pendant quatre secondes pleines.</p>
      </div>
      <div class="pillar">
        <div class="pillar-num">PHASE 03</div>
        <h4>Expirer — 6 secondes</h4>
        <p>Expirez lentement et régulièrement. L’expiration plus longue favorise l’apaisement.</p>
      </div>
    </div>

    <h3>Plan anti-distractions en 4 gestes concrets</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 28%">Source de dispersion</th>
          <th style="width: 42%">Action concrète à appliquer</th>
          <th style="width: 30%">Moment clé</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Téléphone au réveil</strong></td>
          <td>Charger le téléphone hors de portée du lit ; utiliser un réveil simple.</td>
          <td>15 premières minutes du matin</td>
        </tr>
        <tr>
          <td><strong>Notifications continues</strong></td>
          <td>Garder uniquement appels directs et messages urgents autorisés.</td>
          <td>Dès le Jour 3 du programme</td>
        </tr>
        <tr>
          <td><strong>Multitâche d’onglets</strong></td>
          <td>Une seule fenêtre active durant chaque bloc de 25 ou 50 minutes.</td>
          <td>Pendant les sessions Deep Work</td>
        </tr>
        <tr>
          <td><strong>Défilement tardif</strong></td>
          <td>Remplacer les 30 dernières minutes d’écran par le bilan en 3 lignes.</td>
          <td>45 minutes avant le coucher</td>
        </tr>
      </tbody>
    </table>

    <div class="callout">
      <strong>Pratique recommandée :</strong> Enchaînez 10 à 12 cycles de respiration 4-4-6 (environ 3 minutes) dès que vous sentez votre esprit s’éparpiller.
    </div>

    <div class="page-foot">
      <span>Guide pratique — Méthode Reset 21 Jours</span>
      <span>Page 7 / 10</span>
    </div>
  </section>

  <!-- PAGE 8 : FICHE IMPRIMABLE 1 — GRILLE 21 JOURS -->
  <section class="page">
    <div class="page-head">
      <span>Fiche Imprimable 01</span>
      <span>Grille de Suivi 21 Jours</span>
    </div>
    <h2>Grille de suivi — Parcours 21 Jours</h2>
    <p class="lead">Cochez chaque case le soir dès que votre micro-défi et votre priorité du jour sont réalisés. Notez votre niveau d’énergie de 1 à 5.</p>

    <div class="tracker-grid">
      ${Array.from({ length: 21 }, (_, i) => `
        <div class="tracker-cell">
          <div><strong>J${String(i + 1).padStart(2, '0')}</strong></div>
          <div style="font-size:7.5pt; color:#64748B;">Énergie : ___ / 5</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:7.5pt; color:#64748B;">Validé</span>
            <span class="box" style="width:12px; height:12px;"></span>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="sheet-block">
      <h3>Mon objectif principal sur ces 21 jours</h3>
      <div class="write-line"></div>
      <div class="write-line"></div>
    </div>

    <div class="page-foot">
      <span>Fiche détachable — Programme Reset 21 Jours</span>
      <span>Page 8 / 10</span>
    </div>
  </section>

  <!-- PAGE 9 : FICHE IMPRIMABLE 2 — MÉTHODE 1-3-1 & JOURNAL DU SOIR -->
  <section class="page">
    <div class="page-head">
      <span>Fiche Imprimable 02</span>
      <span>Méthode 1-3-1 & Bilan du Soir</span>
    </div>
    <h2>Fiche quotidienne — Méthode 1-3-1</h2>
    <p class="lead">Date : ______ / ______ / ________ &nbsp;&nbsp;&nbsp;&nbsp; Jour du parcours : J____ / 21</p>

    <div class="sheet-block">
      <h3>1 · Ma priorité absolue du jour</h3>
      <div class="write-line"></div>
      <div class="write-line"></div>
    </div>

    <div class="sheet-block">
      <h3>3 · Mes trois habitudes socles</h3>
      <p style="margin: 8px 0;"><span class="box" style="vertical-align:middle; margin-right:8px;"></span> 15 minutes sans écran au réveil</p>
      <p style="margin: 8px 0;"><span class="box" style="vertical-align:middle; margin-right:8px;"></span> 1 bloc de Deep Work (15, 25 ou 50 min) sans interruption</p>
      <p style="margin: 8px 0;"><span class="box" style="vertical-align:middle; margin-right:8px;"></span> 3 lignes de bilan du soir avant le coucher</p>
    </div>

    <div class="sheet-block">
      <h3>1 · Journal du soir (3 lignes de clarté)</h3>
      <p style="font-size:9pt; color:#475569; margin-top:6px;">Une avancée dont je suis satisfait aujourd’hui :</p>
      <div class="write-line"></div>
      <p style="font-size:9pt; color:#475569; margin-top:8px;">Ce que je choisis de lâcher pour alléger mon esprit :</p>
      <div class="write-line"></div>
      <p style="font-size:9pt; color:#475569; margin-top:8px;">Mon intention claire pour demain matin :</p>
      <div class="write-line"></div>
    </div>

    <div class="page-foot">
      <span>Fiche détachable — Programme Reset 21 Jours</span>
      <span>Page 9 / 10</span>
    </div>
  </section>

  <!-- PAGE 10 : FICHE IMPRIMABLE 3 — SUIVI D'ÉNERGIE & BILAN FINAL -->
  <section class="page">
    <div class="page-head">
      <span>Fiche Imprimable 03</span>
      <span>Suivi d’Énergie & Bilan Final</span>
    </div>
    <h2>Revue hebdomadaire d’énergie & Bilan 21 jours</h2>
    <p class="lead">Notez chaque fin de semaine votre constance réelle, vos minutes de focus et votre niveau d’énergie moyen (de 1 à 5).</p>

    <table>
      <thead>
        <tr>
          <th style="width: 20%">Semaine</th>
          <th style="width: 20%">Jours validés</th>
          <th style="width: 22%">Blocs Deep Work</th>
          <th style="width: 18%">Énergie moy.</th>
          <th style="width: 20%">Ajustement clé</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-day">Semaine 1 (J1–J7)</td>
          <td>____ / 7</td>
          <td>____ blocs</td>
          <td>____ / 5</td>
          <td></td>
        </tr>
        <tr>
          <td class="col-day">Semaine 2 (J8–J14)</td>
          <td>____ / 7</td>
          <td>____ blocs</td>
          <td>____ / 5</td>
          <td></td>
        </tr>
        <tr>
          <td class="col-day">Semaine 3 (J15–J21)</td>
          <td>____ / 7</td>
          <td>____ blocs</td>
          <td>____ / 5</td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <div class="sheet-block" style="margin-top: 18px;">
      <h3>Bilan au Jour 21 — Les 3 habitudes que je conserve</h3>
      <p style="font-size:9pt; color:#475569; margin-top:6px;">1.</p>
      <div class="write-line"></div>
      <p style="font-size:9pt; color:#475569; margin-top:6px;">2.</p>
      <div class="write-line"></div>
      <p style="font-size:9pt; color:#475569; margin-top:6px;">3.</p>
      <div class="write-line"></div>
    </div>

    <div class="callout">
      <strong>Suite du parcours :</strong> Conservez votre rythme 1-3-1 sur un nouveau cycle de 21 jours en gardant une seule priorité décisive chaque matin.
    </div>

    <div class="page-foot">
      <span>Fiche détachable — Programme Reset 21 Jours</span>
      <span>Page 10 / 10</span>
    </div>
  </section>

</body>
</html>`;

async function main() {
  const pwPath = findPlaywright();
  const { chromium } = await import(pwPath);
  const executablePath = findChromeExecutable();
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({
      path: OUT_PDF,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });
    const stat = fs.statSync(OUT_PDF);
    console.log(`Generated ${OUT_PDF} (${(stat.size / 1024).toFixed(1)} KB)`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

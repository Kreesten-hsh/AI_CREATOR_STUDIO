import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const OUT_PDF = path.join(__dirname, 'Programme-Sport-Maison-30-Jours.pdf');
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

const WORKOUTS = [
  {
    id: 'full-body',
    title: 'Full Body Fondation',
    category: 'Full Body',
    intensity: 'Modérée',
    duration: { debutant: '18 min', intermediaire: '24 min', avance: '30 min' },
    rounds: { debutant: '2 tours', intermediaire: '3 tours', avance: '4 tours' },
    restBetween: { debutant: '30 s', intermediaire: '20 s', avance: '15 s' },
    goal: 'Renforcer l’ensemble du corps au poids du corps et ancrer les postures de base.',
    exercises: [
      { name: 'Squat poids du corps', deb: '30 s (10 reps)', inter: '40 s (15 reps)', av: '45 s (18 reps)', cue: 'Pieds largeur d’épaules, poitrine ouverte, genoux alignés sur les orteils.' },
      { name: 'Pompes contrôlées', deb: '30 s (genoux)', inter: '40 s (classiques)', av: '45 s (tempo 3-1-1)', cue: 'Corps gainé en ligne droite, coudes à 45°, descente maîtrisée.' },
      { name: 'Fentes arrière alternées', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Grand pas en arrière, genou avant au-dessus de la cheville, buste droit.' },
      { name: 'Pont fessier au sol', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Talons près des fessiers, montez le bassin sans cambrer le bas du dos.' },
      { name: 'Planche avant-bras', deb: '25 s', inter: '40 s', av: '50 s', cue: 'Coudes sous les épaules, fessiers engagés, regard vers le tapis.' },
      { name: 'Jumping jacks maîtrisés', deb: '30 s (sans saut)', inter: '40 s', av: '45 s', cue: 'Réception souple sur l’avant-pied, épaules basses, rythme régulier.' },
    ],
  },
  {
    id: 'hiit-cardio',
    title: 'HIIT Cardio',
    category: 'Cardio / HIIT',
    intensity: 'Élevée',
    duration: { debutant: '16 min', intermediaire: '22 min', avance: '28 min' },
    rounds: { debutant: '2 tours', intermediaire: '3 tours', avance: '4 tours' },
    restBetween: { debutant: '30 s', intermediaire: '20 s', avance: '15 s' },
    goal: 'Développer l’endurance cardiovasculaire et le rythme cardiaque par intervalles courts.',
    exercises: [
      { name: 'Montées de genoux', deb: '25 s (marche active)', inter: '35 s', av: '45 s', cue: 'Genoux à hauteur de hanches, bras actifs, buste tonique.' },
      { name: 'Squat dynamique', deb: '25 s', inter: '35 s', av: '45 s (sauté)', cue: 'Descendez à parallèle, gardez la tension sans verrouiller les genoux.' },
      { name: 'Mountain climbers', deb: '25 s (lent)', inter: '35 s', av: '45 s (rapide)', cue: 'Mains sous les épaules, bassin stable, ramenez les genoux sous la poitrine.' },
      { name: 'Burpees adaptés', deb: '25 s (sans saut)', inter: '35 s (avec saut)', av: '45 s (pompe + saut)', cue: 'Mains au sol, passage en planche contrôlé, extension complète.' },
      { name: 'Fentes dynamiques', deb: '25 s (alternées)', inter: '35 s', av: '45 s (sautées)', cue: 'Amortissez chaque réception sur la pointe puis le talon.' },
      { name: 'Gainage commando', deb: '25 s (genoux)', inter: '35 s', av: '45 s', cue: 'Passez des avant-bras aux mains en limitant la rotation du bassin.' },
    ],
  },
  {
    id: 'core-abs',
    title: 'Abdos & Gainage',
    category: 'Sangle abdominale',
    intensity: 'Modérée',
    duration: { debutant: '14 min', intermediaire: '18 min', avance: '24 min' },
    rounds: { debutant: '2 tours', intermediaire: '3 tours', avance: '4 tours' },
    restBetween: { debutant: '25 s', intermediaire: '20 s', avance: '15 s' },
    goal: 'Stabiliser le tronc, protéger le bas du dos et renforcer la sangle profonde.',
    exercises: [
      { name: 'Dead bug contrôlé', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Bas du dos plaqué au sol, tendez bras et jambe opposés en expirant.' },
      { name: 'Planche avant-bras', deb: '25 s', inter: '40 s', av: '55 s', cue: 'Alignement tête-bassin-talons, respiration régulière.' },
      { name: 'Planche latérale alternée', deb: '25 s (genou sol)', inter: '40 s', av: '50 s', cue: 'Coude sous l’épaule, hanches hautes, changez de côté à mi-temps.' },
      { name: 'Mountain climbers lents', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Genou vers le coude opposé en contrôlant le souffle.' },
      { name: 'Hollow hold adapté', deb: '20 s (genoux pliés)', inter: '35 s', av: '45 s (jambes tendues)', cue: 'Épaules décollées, lombaires collées au tapis.' },
    ],
  },
  {
    id: 'upper-body',
    title: 'Haut du Corps',
    category: 'Force haut du corps',
    intensity: 'Soutenue',
    duration: { debutant: '16 min', intermediaire: '20 min', avance: '26 min' },
    rounds: { debutant: '2 tours', intermediaire: '3 tours', avance: '4 tours' },
    restBetween: { debutant: '30 s', intermediaire: '25 s', avance: '20 s' },
    goal: 'Renforcer pectoraux, épaules, triceps et muscles posturaux du dos sans matériel.',
    exercises: [
      { name: 'Pompes classiques', deb: '30 s (genoux)', inter: '40 s', av: '45 s (diamant)', cue: 'Mains sous la ligne des épaules, descente contrôlée jusqu’à 2 cm du sol.' },
      { name: 'Pompes piquées (épaules)', deb: '25 s (incliné)', inter: '35 s', av: '45 s', cue: 'Hanches hautes en V inversé, descendez le sommet du crâne entre les mains.' },
      { name: 'Superman dos au sol', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Allongé sur le ventre, décollez buste et bras en resserrant les omoplates.' },
      { name: 'Dips sur chaise stable ou sol', deb: '25 s (genoux pliés)', inter: '35 s', av: '45 s (jambes tendues)', cue: 'Doigts vers l’avant, fléchissez les coudes vers l’arrière sans hausser les épaules.' },
      { name: 'Planche touche-épaule', deb: '30 s (genoux)', inter: '40 s', av: '45 s', cue: 'Pieds écartés pour la stabilité, touchez l’épaule opposée sans basculer.' },
    ],
  },
  {
    id: 'lower-body',
    title: 'Jambes & Fessiers',
    category: 'Force bas du corps',
    intensity: 'Soutenue',
    duration: { debutant: '16 min', intermediaire: '22 min', avance: '28 min' },
    rounds: { debutant: '2 tours', intermediaire: '3 tours', avance: '4 tours' },
    restBetween: { debutant: '30 s', intermediaire: '25 s', avance: '20 s' },
    goal: 'Développer la force des quadriceps, ischio-jambiers et fessiers avec contrôle.',
    exercises: [
      { name: 'Squat tempo 3-1-1', deb: '30 s', inter: '40 s', av: '50 s', cue: 'Descente lente en 3 secondes, pause 1 seconde en bas, remontée franche.' },
      { name: 'Fentes avant alternées', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Buste vertical, poussez sur le talon avant pour revenir en position.' },
      { name: 'Pont fessier unilatéral', deb: '30 s (2 pieds)', inter: '40 s (alterné)', av: '50 s (1 jambe)', cue: 'Contraction volontaire 1 seconde en haut, bassin horizontal.' },
      { name: 'Squat sumo', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Pieds largement écartés, pointes vers l’extérieur, genoux ouverts.' },
      { name: 'Chaise murale isométrique', deb: '30 s', inter: '45 s', av: '60 s', cue: 'Dos plaqué au mur, cuisses parallèles au sol, genoux à 90°.' },
    ],
  },
  {
    id: 'express-15',
    title: 'Express 15 min',
    category: 'Circuit rapide',
    intensity: 'Modérée',
    duration: { debutant: '12 min', intermediaire: '15 min', avance: '18 min' },
    rounds: { debutant: '2 tours', intermediaire: '3 tours', avance: '4 tours' },
    restBetween: { debutant: '25 s', intermediaire: '15 s', avance: '15 s' },
    goal: 'Maintenir la régularité les jours chargés grâce à un circuit complet sans pause longue.',
    exercises: [
      { name: 'Squat rythme fluide', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Enchaînez des répétitions propres sans précipiter la descente.' },
      { name: 'Pompes adaptées', deb: '30 s (genoux)', inter: '40 s', av: '45 s', cue: 'Gainez la sangle abdominale du début à la fin.' },
      { name: 'Fentes arrière alternées', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Poids réparti sur la jambe avant, regard loin devant.' },
      { name: 'Mountain climbers', deb: '30 s', inter: '40 s', av: '45 s', cue: 'Rythme soutenu tout en gardant les hanches basses.' },
      { name: 'Planche avant-bras', deb: '25 s', inter: '35 s', av: '45 s', cue: 'Terminez le tour sur une posture irréprochable.' },
    ],
  },
  {
    id: 'mobility',
    title: 'Mobilité Active',
    category: 'Mobilité & Récupération active',
    intensity: 'Douce',
    duration: { debutant: '12 min', intermediaire: '15 min', avance: '18 min' },
    rounds: { debutant: '2 tours', intermediaire: '2 tours', avance: '3 tours' },
    restBetween: { debutant: '15 s', intermediaire: '15 s', avance: '10 s' },
    goal: 'Libérer les hanches, le dos et les épaules pour prévenir les raideurs.',
    exercises: [
      { name: 'Chat-Vache vertébral', deb: '40 s', inter: '45 s', av: '50 s', cue: 'À quatre pattes, alternez dos rond et dos creux sur la respiration.' },
      { name: 'Ouverture de hanche (fente basse)', deb: '40 s', inter: '45 s', av: '50 s', cue: 'Fente basse, ouvrez le bras vers le plafond en suivant la main.' },
      { name: 'Rotation thoracique au sol', deb: '40 s', inter: '45 s', av: '50 s', cue: 'Allongé sur le côté, genou maintenu au sol, ouvrez l’épaule opposée.' },
      { name: 'Squat profond maintenu', deb: '30 s', inter: '40 s', av: '50 s', cue: 'Talons ancrés, coudes contre l’intérieur des genoux.' },
      { name: 'Étirement ischio-jambiers actif', deb: '40 s', inter: '45 s', av: '50 s', cue: 'Jambe tendue devant, buste long sans arrondir les lombaires.' },
    ],
  },
  {
    id: 'recovery',
    title: 'Récupération',
    category: 'Retour au calme',
    intensity: 'Douce',
    duration: { debutant: '10 min', intermediaire: '12 min', avance: '15 min' },
    rounds: { debutant: '2 tours', intermediaire: '2 tours', avance: '2 tours' },
    restBetween: { debutant: '10 s', intermediaire: '10 s', avance: '10 s' },
    goal: 'Relâcher les tensions musculaires et abaisser le rythme cardiaque en douceur.',
    exercises: [
      { name: 'Posture de l’enfant respirée', deb: '45 s', inter: '50 s', av: '60 s', cue: 'Fessiers vers les talons, bras allongés, relâchez les épaules.' },
      { name: 'Étirement psoas genou au sol', deb: '45 s', inter: '50 s', av: '60 s', cue: 'Avancez doucement le bassin en gardant les abdos légèrement rentrés.' },
      { name: 'Torsion allongée douce', deb: '45 s', inter: '50 s', av: '60 s', cue: 'Sur le dos, laissez tomber les genoux d’un côté, épaules au sol.' },
      { name: 'Respiration cohérence 4-6', deb: '60 s', inter: '75 s', av: '90 s', cue: 'Inspirez 4 s par le nez, expirez lentement 6 s par la bouche.' },
    ],
  },
];

const SCHEDULE_30_DAYS = [
  // Semaine 1 — Fondations & Technique
  { day: 1, week: 1, type: 'Entraînement', label: 'Full Body Fondation' },
  { day: 2, week: 1, type: 'Entraînement', label: 'Abdos & Gainage' },
  { day: 3, week: 1, type: 'Récupération active', label: 'Mobilité Active' },
  { day: 4, week: 1, type: 'Entraînement', label: 'Haut du Corps' },
  { day: 5, week: 1, type: 'Entraînement', label: 'Jambes & Fessiers' },
  { day: 6, week: 1, type: 'Entraînement', label: 'Express 15 min' },
  { day: 7, week: 1, type: 'Repos complet', label: 'Repos complet (marche légère & hydratation)' },
  // Semaine 2 — Rythme & Endurance
  { day: 8, week: 2, type: 'Entraînement', label: 'Full Body Fondation' },
  { day: 9, week: 2, type: 'Entraînement', label: 'HIIT Cardio' },
  { day: 10, week: 2, type: 'Récupération active', label: 'Récupération' },
  { day: 11, week: 2, type: 'Entraînement', label: 'Haut du Corps' },
  { day: 12, week: 2, type: 'Entraînement', label: 'Jambes & Fessiers' },
  { day: 13, week: 2, type: 'Entraînement', label: 'Abdos & Gainage' },
  { day: 14, week: 2, type: 'Repos complet', label: 'Repos complet' },
  // Semaine 3 — Intensité & Volume
  { day: 15, week: 3, type: 'Entraînement', label: 'Full Body Fondation' },
  { day: 16, week: 3, type: 'Entraînement', label: 'HIIT Cardio' },
  { day: 17, week: 3, type: 'Récupération active', label: 'Mobilité Active' },
  { day: 18, week: 3, type: 'Entraînement', label: 'Haut du Corps' },
  { day: 19, week: 3, type: 'Entraînement', label: 'Jambes & Fessiers' },
  { day: 20, week: 3, type: 'Entraînement', label: 'HIIT Cardio' },
  { day: 21, week: 3, type: 'Repos complet', label: 'Repos complet' },
  // Semaine 4 — Pic & Consolidation (J22 à J30)
  { day: 22, week: 4, type: 'Entraînement', label: 'Full Body Fondation' },
  { day: 23, week: 4, type: 'Entraînement', label: 'Abdos & Gainage' },
  { day: 24, week: 4, type: 'Entraînement', label: 'HIIT Cardio' },
  { day: 25, week: 4, type: 'Récupération active', label: 'Récupération' },
  { day: 26, week: 4, type: 'Entraînement', label: 'Haut du Corps' },
  { day: 27, week: 4, type: 'Entraînement', label: 'Jambes & Fessiers' },
  { day: 28, week: 4, type: 'Repos complet', label: 'Repos complet' },
  { day: 29, week: 4, type: 'Récupération active', label: 'Mobilité Active' },
  { day: 30, week: 4, type: 'Entraînement', label: 'Full Body Fondation (Bilan Jour 30)' },
];

function renderWorkoutBlock(w, index, compact = false) {
  const rows = w.exercises
    .map(
      (ex, i) => `
      <tr>
        <td class="col-num">${i + 1}</td>
        <td>
          <div class="ex-name">${ex.name}</div>
          <div class="ex-cue">${ex.cue}</div>
        </td>
        <td class="col-lvl">${ex.deb}</td>
        <td class="col-lvl">${ex.inter}</td>
        <td class="col-lvl">${ex.av}</td>
      </tr>`
    )
    .join('');

  return `
    <section class="workout-block ${compact ? 'compact' : ''}">
      <div class="workout-head">
        <div>
          <div class="workout-kicker">Séance ${String(index + 1).padStart(2, '0')} — ${w.category}</div>
          <h2 class="workout-title">${w.title}</h2>
        </div>
        <div class="workout-meta">
          <span><strong>Intensité :</strong> ${w.intensity}</span>
          <span><strong>Volume :</strong> ${w.rounds.debutant} / ${w.rounds.intermediaire} / ${w.rounds.avance}</span>
          <span><strong>Repos :</strong> ${w.restBetween.debutant} / ${w.restBetween.intermediaire} / ${w.restBetween.avance}</span>
        </div>
      </div>
      <p class="workout-goal">${w.goal}</p>
      <table class="ex-table">
        <thead>
          <tr>
            <th style="width:28px">#</th>
            <th>Exercice &amp; repère d’exécution</th>
            <th style="width:94px">Débutant</th>
            <th style="width:94px">Intermédiaire</th>
            <th style="width:94px">Avancé</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function buildHtml() {
  const pjsLatin = fontDataUri('PlusJakartaSans-latin.woff2', 'font/woff2');
  const pjsExt = fontDataUri('PlusJakartaSans-latin-ext.woff2', 'font/woff2');

  const weekMeta = [
    { w: 1, title: 'Semaine 1 — Fondations & Technique (J1 à J7)' },
    { w: 2, title: 'Semaine 2 — Rythme & Endurance (J8 à J14)' },
    { w: 3, title: 'Semaine 3 — Intensité & Volume (J15 à J21)' },
    { w: 4, title: 'Semaine 4 — Pic & Consolidation (J22 à J30)' },
  ];

  const scheduleTables = weekMeta
    .map((wm) => {
      const days = SCHEDULE_30_DAYS.filter((d) => d.week === wm.w);
      const rows = days
        .map(
          (d) => `
          <tr class="${d.type === 'Repos complet' ? 'row-rest' : d.type === 'Récupération active' ? 'row-rec' : ''}">
            <td class="col-day">Jour ${String(d.day).padStart(2, '0')}</td>
            <td class="col-type">${d.type}</td>
            <td>${d.label}</td>
          </tr>`
        )
        .join('');
      return `
        <div class="week-block">
          <div class="week-title">${wm.title}</div>
          <table class="sched-table">
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    })
    .join('');

  const trackerRows = Array.from({ length: 15 }, (_, idx) => {
    const d1 = SCHEDULE_30_DAYS[idx];
    const d2 = SCHEDULE_30_DAYS[idx + 15];
    return `
      <tr>
        <td class="tr-day">J${String(d1.day).padStart(2, '0')}</td>
        <td class="tr-lbl">${d1.label.split(' (')[0]}</td>
        <td class="tr-box"><span class="check-sq"></span></td>
        <td class="tr-feel">F / S / I</td>
        <td class="tr-sep"></td>
        <td class="tr-day">J${String(d2.day).padStart(2, '0')}</td>
        <td class="tr-lbl">${d2.label.split(' (')[0]}</td>
        <td class="tr-box"><span class="check-sq"></span></td>
        <td class="tr-feel">F / S / I</td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Programme Sport Maison — 30 Jours Sans Matériel</title>
<style>
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('${pjsLatin}') format('woff2');
    font-weight: 400 800;
    font-style: normal;
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('${pjsExt}') format('woff2');
    font-weight: 400 800;
    font-style: normal;
  }
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: #334155;
    background: #FFFFFF;
    font-size: 10pt;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 18mm 18mm 16mm 18mm;
    background: #FFFFFF;
    position: relative;
    page-break-after: always;
    break-after: page;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  /* Cover Page */
  .cover-page {
    padding: 0;
    justify-content: space-between;
  }
  .cover-band {
    background: #1E3A5F;
    color: #FFFFFF;
    padding: 28mm 20mm 22mm 20mm;
  }
  .cover-tag {
    display: inline-block;
    border: 1px solid rgba(255,255,255,0.4);
    padding: 4px 12px;
    font-size: 9pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 18px;
    border-radius: 3px;
  }
  .cover-title {
    font-size: 30pt;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 14px;
    color: #FFFFFF;
  }
  .cover-sub {
    font-size: 12pt;
    font-weight: 400;
    line-height: 1.5;
    color: #E2E8F0;
    max-width: 155mm;
  }
  .cover-body {
    padding: 18mm 20mm;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cover-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .cover-stat {
    border: 1px solid #CBD5E1;
    background: #F8FAFC;
    padding: 14px;
    border-radius: 4px;
  }
  .cover-stat-val {
    font-size: 18pt;
    font-weight: 800;
    color: #1E3A5F;
    margin-bottom: 4px;
  }
  .cover-stat-lbl {
    font-size: 8.5pt;
    color: #475569;
  }
  .cover-box {
    border-left: 4px solid #1E3A5F;
    background: #F8FAFC;
    padding: 16px 18px;
    margin-bottom: 20px;
  }
  .cover-box h3 {
    font-size: 11pt;
    color: #1E3A5F;
    margin-bottom: 8px;
  }
  .cover-box ul {
    padding-left: 16px;
    color: #334155;
    font-size: 9.5pt;
  }
  .cover-box li {
    margin-bottom: 5px;
  }
  .cover-footer {
    border-top: 1px solid #CBD5E1;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #64748B;
  }

  /* Inner Page Header & Footer */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid #1E3A5F;
    padding-bottom: 6px;
    margin-bottom: 14px;
  }
  .page-header-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #1E3A5F;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .page-header-sub {
    font-size: 8.5pt;
    color: #64748B;
  }
  .page-footer {
    margin-top: auto;
    border-top: 1px solid #CBD5E1;
    padding-top: 7px;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #64748B;
  }

  h1.sec-h1 {
    font-size: 18pt;
    font-weight: 800;
    color: #1E3A5F;
    margin-bottom: 10px;
  }
  h2.sec-h2 {
    font-size: 12pt;
    font-weight: 700;
    color: #1E3A5F;
    margin: 14px 0 8px 0;
  }
  p.lead {
    font-size: 9.5pt;
    color: #475569;
    margin-bottom: 12px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
  }
  th, td {
    border: 1px solid #CBD5E1;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #F1F5F9;
    color: #1E3A5F;
    font-weight: 700;
    font-size: 8pt;
  }

  /* TOC & Rules */
  .toc-list {
    list-style: none;
    border: 1px solid #CBD5E1;
    border-radius: 4px;
    margin-bottom: 14px;
  }
  .toc-list li {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;
    border-bottom: 1px solid #E2E8F0;
    font-size: 9pt;
  }
  .toc-list li:last-child { border-bottom: none; }
  .toc-pg {
    font-weight: 700;
    color: #1E3A5F;
  }
  .rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
  .rule-card {
    border: 1px solid #CBD5E1;
    background: #F8FAFC;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 8.5pt;
  }
  .rule-card strong {
    display: block;
    color: #1E3A5F;
    margin-bottom: 4px;
  }

  /* Workout Block */
  .workout-block {
    margin-bottom: 14px;
  }
  .workout-block.compact {
    margin-bottom: 12px;
  }
  .workout-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: #F8FAFC;
    border: 1px solid #CBD5E1;
    border-left: 4px solid #1E3A5F;
    padding: 8px 12px;
    margin-bottom: 6px;
  }
  .workout-kicker {
    font-size: 7.5pt;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .workout-title {
    font-size: 13pt;
    font-weight: 800;
    color: #1E3A5F;
  }
  .workout-meta {
    text-align: right;
    font-size: 7.8pt;
    color: #334155;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .workout-goal {
    font-size: 8.5pt;
    color: #475569;
    margin-bottom: 6px;
  }
  .ex-table td {
    padding: 5px 7px;
  }
  .workout-block.compact .ex-table td {
    padding: 4px 6px;
    font-size: 8pt;
  }
  .col-num {
    text-align: center;
    font-weight: 700;
    color: #1E3A5F;
  }
  .ex-name {
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 1px;
  }
  .ex-cue {
    font-size: 7.6pt;
    color: #475569;
  }
  .col-lvl {
    font-size: 7.8pt;
    color: #1E293B;
  }
  .note-strip {
    margin-top: 8px;
    padding: 8px 12px;
    border: 1px solid #CBD5E1;
    background: #F8FAFC;
    font-size: 8.2pt;
    color: #334155;
  }

  /* 30-day schedule */
  .weeks-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .week-title {
    background: #1E3A5F;
    color: #FFFFFF;
    font-size: 8.2pt;
    font-weight: 700;
    padding: 5px 8px;
  }
  .sched-table td {
    padding: 4px 6px;
    font-size: 7.8pt;
  }
  .col-day {
    width: 48px;
    font-weight: 700;
    color: #1E3A5F;
  }
  .col-type {
    width: 96px;
    font-weight: 600;
    color: #475569;
  }
  .row-rest td {
    background: #F8FAFC;
    color: #64748B;
  }
  .row-rec td {
    background: #F1F5F9;
  }

  /* Printable Tracker Page 10 */
  .tracker-table th, .tracker-table td {
    padding: 4.5px 5px;
    font-size: 7.8pt;
  }
  .tr-day { width: 32px; font-weight: 700; color: #1E3A5F; text-align: center; }
  .tr-lbl { font-size: 7.6pt; }
  .tr-box { width: 32px; text-align: center; }
  .tr-feel { width: 52px; text-align: center; color: #64748B; font-size: 7.2pt; }
  .tr-sep { width: 8px; border-top: none; border-bottom: none; background: #FFFFFF; }
  .check-sq {
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 1.3px solid #1E3A5F;
    border-radius: 2px;
    vertical-align: middle;
  }
  .bilan-box {
    margin-top: 12px;
    border: 1px solid #CBD5E1;
    padding: 10px 12px;
    background: #F8FAFC;
  }
  .bilan-box h3 {
    font-size: 9.5pt;
    color: #1E3A5F;
    margin-bottom: 8px;
  }
  .write-line {
    border-bottom: 1px dashed #94A3B8;
    height: 18px;
    margin-bottom: 6px;
  }
</style>
</head>
<body>

  <!-- PAGE 1 : COUVERTURE CLASSIQUE -->
  <div class="page cover-page">
    <div class="cover-band">
      <div class="cover-tag">Guide Pratique d’Entraînement à Domicile</div>
      <h1 class="cover-title">Programme Sport Maison<br/>30 Jours Sans Matériel</h1>
      <p class="cover-sub">Guide complet d’entraînement au poids du corps : 4 semaines progressives, 8 séances types et suivi papier.</p>
    </div>
    <div class="cover-body">
      <div>
        <div class="cover-grid">
          <div class="cover-stat">
            <div class="cover-stat-val">30 jours</div>
            <div class="cover-stat-lbl">Progression structurée sur 4 semaines avec jours de repos</div>
          </div>
          <div class="cover-stat">
            <div class="cover-stat-val">8 séances</div>
            <div class="cover-stat-lbl">Full Body, HIIT Cardio, Abdos, Haut, Jambes, Mobilité &amp; Récup</div>
          </div>
          <div class="cover-stat">
            <div class="cover-stat-val">3 niveaux</div>
            <div class="cover-stat-lbl">Adaptations Débutant, Intermédiaire et Avancé</div>
          </div>
        </div>
        <div class="cover-box">
          <h3>Ce que contient ce guide imprimable</h3>
          <ul>
            <li>Un protocole d’échauffement rapide (4 minutes) et les règles de progression sécurisées.</li>
            <li>8 séances complètes au poids du corps avec repères de placement pour chaque exercice.</li>
            <li>Un planning calendrier de 30 jours alternant entraînement, récupération active et repos complet.</li>
            <li>Une fiche papier de suivi à cocher pour noter votre régularité et votre ressenti d’effort.</li>
          </ul>
        </div>
      </div>
      <div class="cover-footer">
        <span>Édition Guide Maison — Format A4 Imprimable</span>
        <span>Sans matériel • 10 pages</span>
      </div>
    </div>
  </div>

  <!-- PAGE 2 : SOMMAIRE & RÈGLES DE PROGRESSION -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Programme Sport Maison — 30 Jours</span>
      <span class="page-header-sub">Sommaire &amp; Méthode</span>
    </div>
    <h1 class="sec-h1">Sommaire &amp; Règles de Progression</h1>
    <ul class="toc-list">
      <li><span>1. Protocole d’échauffement et adaptation par niveau</span><span class="toc-pg">Page 2</span></li>
      <li><span>2. Séance 01 : Full Body Fondation</span><span class="toc-pg">Page 3</span></li>
      <li><span>3. Séance 02 : HIIT Cardio</span><span class="toc-pg">Page 4</span></li>
      <li><span>4. Séance 03 : Abdos &amp; Gainage &amp; Séance 04 : Haut du Corps</span><span class="toc-pg">Page 5</span></li>
      <li><span>5. Séance 05 : Jambes &amp; Fessiers &amp; Séance 06 : Express 15 min</span><span class="toc-pg">Page 6</span></li>
      <li><span>6. Séance 07 : Mobilité Active</span><span class="toc-pg">Page 7</span></li>
      <li><span>7. Séance 08 : Récupération</span><span class="toc-pg">Page 8</span></li>
      <li><span>8. Planning calendrier des 30 jours (Semaines 1 à 4)</span><span class="toc-pg">Page 9</span></li>
      <li><span>9. Fiche papier de suivi à cocher (J1 à J30)</span><span class="toc-pg">Page 10</span></li>
    </ul>

    <h2 class="sec-h2">Échauffement obligatoire avant chaque séance (4 minutes)</h2>
    <div class="rules-grid">
      <div class="rule-card">
        <strong>1. Mobilité articulaire (2 min)</strong>
        Cercles d’épaules (30 s), rotations de hanches (30 s), flexions douces de genoux (30 s), rotations de chevilles et poignets (30 s).
      </div>
      <div class="rule-card">
        <strong>2. Montée en température (2 min)</strong>
        Marche active sur place ou montées de genoux douces (45 s), 10 squats lents (45 s), 30 s de gainage sur les genoux ou les mains.
      </div>
    </div>

    <h2 class="sec-h2">Tableau d’adaptation selon votre niveau</h2>
    <table>
      <thead>
        <tr>
          <th>Niveau</th>
          <th>Tours / Séries</th>
          <th>Temps d’effort</th>
          <th>Repos entre exercices</th>
          <th>Repos entre tours</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Débutant</strong></td>
          <td>2 tours complets</td>
          <td>25 à 30 secondes</td>
          <td>25 à 30 secondes</td>
          <td>90 secondes</td>
        </tr>
        <tr>
          <td><strong>Intermédiaire</strong></td>
          <td>3 tours complets</td>
          <td>35 à 40 secondes</td>
          <td>20 secondes</td>
          <td>60 secondes</td>
        </tr>
        <tr>
          <td><strong>Avancé</strong></td>
          <td>4 tours complets</td>
          <td>45 à 50 secondes</td>
          <td>15 secondes</td>
          <td>45 secondes</td>
        </tr>
      </tbody>
    </table>

    <div class="note-strip">
      <strong>Règle de sécurité :</strong> Privilégiez toujours la qualité du mouvement sur la vitesse. Si votre posture se dégrade (dos qui creuse en planche, genoux qui rentrent en squat), passez à la variante simplifiée ou prenez 10 secondes de repos supplémentaire.
    </div>

    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 2 / 10</span>
    </div>
  </div>

  <!-- PAGE 3 : SÉANCE 01 FULL BODY FONDATION -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Les 8 Séances Types</span>
      <span class="page-header-sub">Séance 01</span>
    </div>
    ${renderWorkoutBlock(WORKOUTS[0], 0, false)}
    <div class="note-strip">
      <strong>Conseil de réalisation :</strong> Enchaînez les 6 exercices dans l’ordre pour former 1 tour complet. Prenez 60 à 90 secondes de pause à la fin du tour avant de repartir. Gardez une bouteille d’eau et un tapis à portée de main.
    </div>
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 3 / 10</span>
    </div>
  </div>

  <!-- PAGE 4 : SÉANCE 02 HIIT CARDIO -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Les 8 Séances Types</span>
      <span class="page-header-sub">Séance 02</span>
    </div>
    ${renderWorkoutBlock(WORKOUTS[1], 1, false)}
    <div class="note-strip">
      <strong>Gestion de l’essoufflement :</strong> Pendant la phase de repos entre deux exercices, restez debout en marchant calmement et inspirez profondément par le nez. Évitez de vous asseoir brusquement.
    </div>
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 4 / 10</span>
    </div>
  </div>

  <!-- PAGE 5 : SÉANCE 03 ABDOS & GAINAGE + SÉANCE 04 HAUT DU CORPS -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Les 8 Séances Types</span>
      <span class="page-header-sub">Séances 03 &amp; 04</span>
    </div>
    ${renderWorkoutBlock(WORKOUTS[2], 2, true)}
    ${renderWorkoutBlock(WORKOUTS[3], 3, true)}
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 5 / 10</span>
    </div>
  </div>

  <!-- PAGE 6 : SÉANCE 05 JAMBES & FESSIERS + SÉANCE 06 EXPRESS 15 MIN -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Les 8 Séances Types</span>
      <span class="page-header-sub">Séances 05 &amp; 06</span>
    </div>
    ${renderWorkoutBlock(WORKOUTS[4], 4, true)}
    ${renderWorkoutBlock(WORKOUTS[5], 5, true)}
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 6 / 10</span>
    </div>
  </div>

  <!-- PAGE 7 : SÉANCE 07 MOBILITÉ ACTIVE -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Les 8 Séances Types</span>
      <span class="page-header-sub">Séance 07</span>
    </div>
    ${renderWorkoutBlock(WORKOUTS[6], 6, false)}
    <div class="note-strip">
      <strong>Quand pratiquer la Mobilité Active :</strong> Programmée en milieu de semaine (Jours 3, 17 et 29), cette séance facilite la récupération articulaire sans fatigue nerveuse. Ne forcez jamais jusqu’à la douleur aiguë.
    </div>
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 7 / 10</span>
    </div>
  </div>

  <!-- PAGE 8 : SÉANCE 08 RÉCUPÉRATION -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Les 8 Séances Types</span>
      <span class="page-header-sub">Séance 08</span>
    </div>
    ${renderWorkoutBlock(WORKOUTS[7], 7, false)}
    <div class="note-strip">
      <strong>Rôle de la récupération :</strong> Les progrès musculaires et cardiovasculaires se construisent pendant les phases de repos. Combinez cette séance (Jours 10 et 25) avec 7 à 8 heures de sommeil et une hydratation régulière.
    </div>
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 8 / 10</span>
    </div>
  </div>

  <!-- PAGE 9 : PLANNING CALENDRIER 30 JOURS -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Planning Calendrier 30 Jours</span>
      <span class="page-header-sub">Semaines 1 à 4</span>
    </div>
    <h1 class="sec-h1">Votre Progression sur 30 Jours</h1>
    <p class="lead">Chaque semaine alterne séances de renforcement, cardio, récupération active et 1 jour de repos complet pour permettre l’adaptation sans surmenage.</p>
    <div class="weeks-grid">
      ${scheduleTables}
    </div>
    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 9 / 10</span>
    </div>
  </div>

  <!-- PAGE 10 : FICHE PAPIER DE SUIVI À COCHER -->
  <div class="page">
    <div class="page-header">
      <span class="page-header-title">Suivi Papier Imprimable</span>
      <span class="page-header-sub">Jours 1 à 30</span>
    </div>
    <h1 class="sec-h1">Fiche de Suivi Quotidien</h1>
    <p class="lead">Cochez chaque journée terminée et entourez votre ressenti d’effort : <strong>F</strong> (Facile), <strong>S</strong> (Solide), <strong>I</strong> (Intense).</p>
    <table class="tracker-table">
      <thead>
        <tr>
          <th>Jour</th>
          <th>Séance prévue</th>
          <th>Fait</th>
          <th>Ressenti</th>
          <th class="tr-sep"></th>
          <th>Jour</th>
          <th>Séance prévue</th>
          <th>Fait</th>
          <th>Ressenti</th>
        </tr>
      </thead>
      <tbody>
        ${trackerRows}
      </tbody>
    </table>

    <div class="bilan-box">
      <h3>Bilan de fin de programme (Jour 30)</h3>
      <p style="font-size:8pt;color:#475569;margin-bottom:6px;">Niveau de départ : ____________ &nbsp;&nbsp; Niveau atteint : ____________ &nbsp;&nbsp; Total séances validées : _____ / 30</p>
      <div class="write-line"></div>
      <div class="write-line"></div>
    </div>

    <div class="page-footer">
      <span>Programme Sport Maison — 30 Jours Sans Matériel</span>
      <span>Page 10 / 10</span>
    </div>
  </div>

</body>
</html>`;
}

async function main() {
  const pwPath = findPlaywright();
  const { chromium } = await import(pwPath);
  const executablePath = findChromeExecutable();

  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(buildHtml(), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: OUT_PDF,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
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

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../..');
const PHOTOS_DIR = path.join(__dirname, 'assets/photos');
const FONTS_DIR = path.join(ROOT, 'public/fonts');
const OUT_PDF = path.join(__dirname, 'Mijote-Recettes-Express.pdf');

function findPlaywrightCore() {
  const npxDir = path.join(os.homedir(), '.npm', '_npx');
  if (fs.existsSync(npxDir)) {
    for (const entry of fs.readdirSync(npxDir)) {
      const candidate = path.join(npxDir, entry, 'node_modules', 'playwright-core', 'index.mjs');
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  const local = path.join(ROOT, 'node_modules', 'playwright-core', 'index.mjs');
  if (fs.existsSync(local)) return local;
  throw new Error('playwright-core introuvable dans ~/.npm/_npx ou node_modules');
}

function findChromiumBinary() {
  const candidates = [
    path.join(ROOT, 'video-studio/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell'),
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Binaire Chromium headless introuvable');
}

function toDataUri(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function formatQty(rawQty, unit) {
  let q = rawQty;
  let u = unit;
  if (u === 'g' && q >= 1000) { q /= 1000; u = 'kg'; }
  else if (u === 'ml' && q >= 1000) { q /= 1000; u = 'L'; }
  const rounded = Math.round(q * 4) / 4;
  let numStr;
  if (Math.abs(rounded - 0.5) < 0.01) numStr = '½';
  else if (Math.abs(rounded - 0.25) < 0.01) numStr = '¼';
  else if (Math.abs(rounded - 0.75) < 0.01) numStr = '¾';
  else if (Math.abs(rounded - Math.round(rounded)) < 0.01) numStr = String(Math.round(rounded));
  else numStr = String(Number(rounded.toFixed(1))).replace('.', ',');
  if (u === 'pièce' && rounded > 1) u = 'pièces';
  if (u === 'pièces' && rounded <= 1) u = 'pièce';
  return `${numStr} ${u}`;
}

const RECIPES = [
  {
    id: 'yassa', page: 3, fullPage: true,
    title: 'Poulet Yassa express aux oignons caramélisés',
    shortTitle: 'Poulet Yassa express',
    photoFile: 'yassa.jpg', time: 25, kcal: 520, difficulty: 'Facile',
    kicker: 'Signature du soir · Épicé',
    tip: 'Ne surchargez pas la poêle au moment de saisir le poulet : une belle croûte dorée parfume toute la sauce aux oignons.',
    ingredients: [
      { name: 'Hauts de cuisse de poulet désossés', qty: 320, unit: 'g', aisle: 'Viandes & Poissons' },
      { name: 'Oignons jaunes', qty: 2, unit: 'pièces', aisle: 'Fruits & Légumes' },
      { name: 'Citron jaune', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Riz jasmin', qty: 160, unit: 'g', aisle: 'Épicerie' },
      { name: 'Moutarde de Dijon', qty: 1.5, unit: 'c. à s.', aisle: 'Épicerie' },
      { name: 'Olives vertes dénoyautées', qty: 50, unit: 'g', aisle: 'Épicerie' },
      { name: 'Persil plat frais', qty: 0.5, unit: 'bouquet', aisle: 'Fruits & Légumes' },
      { name: 'Huile d’olive', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' }
    ],
    steps: [
      'Rincez le riz jasmin et faites-le cuire 10 minutes à couvert dans une casserole d’eau bouillante salée.',
      'Émincez finement les oignons. Mélangez le poulet avec le jus de citron, la moutarde et une pointe de piment doux.',
      'Saisissez le poulet 4 minutes dans une poêle chaude huilée jusqu’à belle coloration, puis réservez sur une assiette.',
      'Faites fondre les oignons 7 minutes dans les sucs, remettez le poulet, les olives et 4 c. à s. d’eau. Laissez mijoter 5 minutes et servez sur le riz avec du persil.'
    ]
  },
  {
    id: 'poke-saumon', page: 4, fullPage: true,
    title: 'Bowl saumon avocat & riz vinaigré',
    shortTitle: 'Bowl saumon avocat',
    photoFile: 'poke-saumon.jpg', time: 15, kcal: 490, difficulty: 'Facile',
    kicker: 'Express 15 min · Protéiné',
    tip: 'Laissez tiédir le riz 2 minutes avant de dresser pour garder le saumon frais et l’avocat bien fondant.',
    ingredients: [
      { name: 'Pavé de saumon frais qualité sushi', qty: 260, unit: 'g', aisle: 'Viandes & Poissons' },
      { name: 'Riz jasmin', qty: 160, unit: 'g', aisle: 'Épicerie' },
      { name: 'Avocat mûr', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Concombre', qty: 0.5, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Edamame écossés', qty: 100, unit: 'g', aisle: 'Frais' },
      { name: 'Sauce soja salée', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' },
      { name: 'Graines de sésame', qty: 1, unit: 'c. à s.', aisle: 'Épicerie' },
      { name: 'Citron vert', qty: 0.5, unit: 'pièce', aisle: 'Fruits & Légumes' }
    ],
    steps: [
      'Faites cuire le riz rincé dans 1,5 fois son volume d’eau à couvert pendant 10 minutes, puis assaisonnez d’un filet de citron vert.',
      'Coupez le saumon en cubes réguliers de 2 cm et enrobez-les de sauce soja et de la moitié des graines de sésame.',
      'Tranchez l’avocat en éventail, taillez le concombre en rubans fins à l’économe et réchauffez les edamame 1 minute.',
      'Dressez le riz au fond de deux bols, disposez chaque garniture en quartiers nets et terminez avec le reste de sésame.'
    ]
  },
  {
    id: 'pates-tomate', page: 5, fullPage: true,
    title: 'Rigatoni crémeux tomates rôties & burrata',
    shortTitle: 'Rigatoni & burrata',
    photoFile: 'pates-tomate.jpg', time: 20, kcal: 540, difficulty: 'Facile',
    kicker: 'Dîner réconfort · Végé',
    tip: 'L’eau de cuisson riche en amidon émulsionne naturellement les tomates rôties : nul besoin de crème.',
    ingredients: [
      { name: 'Rigatoni', qty: 200, unit: 'g', aisle: 'Épicerie' },
      { name: 'Tomates cerises', qty: 300, unit: 'g', aisle: 'Fruits & Légumes' },
      { name: 'Burrata fraîche', qty: 1, unit: 'pièce', aisle: 'Frais' },
      { name: 'Gousses d’ail', qty: 2, unit: 'pièces', aisle: 'Fruits & Légumes' },
      { name: 'Basilic frais', qty: 0.5, unit: 'bouquet', aisle: 'Fruits & Légumes' },
      { name: 'Huile d’olive', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' }
    ],
    steps: [
      'Cuisez les rigatoni al dente dans un grand volume d’eau bouillante salée en conservant une demi-louche d’eau de cuisson.',
      'Faites confire les tomates cerises entières 6 minutes à feu vif avec l’huile d’olive et l’ail écrasé jusqu’à ce qu’elles éclatent.',
      'Ajoutez les pâtes égouttées et 4 c. à s. d’eau de cuisson dans la poêle. Mélangez vivement 1 minute pour napper chaque tube.',
      'Servez dans deux assiettes creuses, déchirez la burrata fraîche au centre, ajoutez les feuilles de basilic et du poivre concassé.'
    ]
  },
  {
    id: 'curry-lentilles', page: 6, fullPage: true,
    title: 'Dahl de lentilles corail au lait de coco',
    shortTitle: 'Dahl lentilles coco',
    photoFile: 'curry-lentilles.jpg', time: 25, kcal: 430, difficulty: 'Facile',
    kicker: 'Cosy & parfumé · Végé',
    tip: 'Torréfier le curry 30 secondes avec l’oignon avant d’ajouter le liquide réveille instantanément toutes les épices.',
    ingredients: [
      { name: 'Lentilles corail', qty: 180, unit: 'g', aisle: 'Épicerie' },
      { name: 'Lait de coco', qty: 200, unit: 'ml', aisle: 'Épicerie' },
      { name: 'Tomates concassées', qty: 200, unit: 'g', aisle: 'Épicerie' },
      { name: 'Oignons jaunes', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Gousses d’ail', qty: 2, unit: 'pièces', aisle: 'Fruits & Légumes' },
      { name: 'Poudre de curry doux', qty: 2, unit: 'c. à c.', aisle: 'Épicerie' },
      { name: 'Coriandre fraîche', qty: 0.5, unit: 'bouquet', aisle: 'Fruits & Légumes' },
      { name: 'Pains naan', qty: 2, unit: 'pièces', aisle: 'Épicerie' }
    ],
    steps: [
      'Rincez les lentilles corail à l’eau claire. Faites revenir l’oignon et l’ail hachés 3 minutes avec le curry doux.',
      'Ajoutez les lentilles, les tomates concassées, le lait de coco et 250 ml d’eau. Laissez mijoter 15 minutes à couvert.',
      'Réchauffez les pains naan 2 minutes à la poêle sèche pendant que le dahl devient crémeux.',
      'Ajustez le sel, ajoutez un trait de lait de coco et la coriandre fraîche puis servez bien chaud avec les naans.'
    ]
  },
  {
    id: 'riz-saute', page: 7, fullPage: true,
    title: 'Riz sauté crevettes, gingembre & sésame',
    shortTitle: 'Riz sauté crevettes',
    photoFile: 'riz-saute.jpg', time: 15, kcal: 470, difficulty: 'Facile',
    kicker: 'Wok minute · Protéiné',
    tip: 'Saisissez toujours les crevettes en premier et retirez-les dès qu’elles rosissent pour qu’elles restent juteuses.',
    ingredients: [
      { name: 'Crevettes décortiquées', qty: 240, unit: 'g', aisle: 'Viandes & Poissons' },
      { name: 'Riz jasmin', qty: 180, unit: 'g', aisle: 'Épicerie' },
      { name: 'Œufs frais', qty: 2, unit: 'pièces', aisle: 'Frais' },
      { name: 'Carotte', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Cébette (oignon nouveau)', qty: 2, unit: 'tiges', aisle: 'Fruits & Légumes' },
      { name: 'Sauce soja salée', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' },
      { name: 'Graines de sésame', qty: 1, unit: 'c. à s.', aisle: 'Épicerie' },
      { name: 'Citron vert', qty: 0.5, unit: 'pièce', aisle: 'Fruits & Légumes' }
    ],
    steps: [
      'Taillez la carotte en petits dés et ciselez la cébette. Saisissez les crevettes 2 minutes dans un wok bien chaud, puis réservez.',
      'Faites sauter les dés de carotte 2 minutes dans le même wok, puis poussez sur le bord pour brouiller les œufs rapidement.',
      'Ajoutez le riz, la sauce soja et les crevettes. Faites sauter 3 minutes à feu vif sans cesser de remuer.',
      'Hors du feu, parsemez de cébette fraîche, de graines de sésame et servez avec un quartier de citron vert.'
    ]
  },
  {
    id: 'poisson-grille', page: 8, fullPage: true,
    title: 'Pavé de dorade grillée, patates douces & citron vert',
    shortTitle: 'Dorade & patates douces',
    photoFile: 'poisson-grille.jpg', time: 25, kcal: 450, difficulty: 'Moyen',
    kicker: 'Bistrot frais · Protéiné',
    tip: 'Séchez soigneusement la peau du poisson au papier absorbant et appuyez 10 secondes à la spatule pour un croustillant parfait.',
    ingredients: [
      { name: 'Filets de dorade avec peau', qty: 280, unit: 'g', aisle: 'Viandes & Poissons' },
      { name: 'Patate douce', qty: 320, unit: 'g', aisle: 'Fruits & Légumes' },
      { name: 'Haricots verts fins', qty: 180, unit: 'g', aisle: 'Fruits & Légumes' },
      { name: 'Citron vert', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Persil plat frais', qty: 0.5, unit: 'bouquet', aisle: 'Fruits & Légumes' },
      { name: 'Huile d’olive', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' }
    ],
    steps: [
      'Coupez la patate douce en petits cubes de 1,5 cm et rôtissez-les 12 minutes à la poêle chaude avec 1 c. à s. d’huile d’olive.',
      'Ajoutez les haricots verts équeutés pour les 5 dernières minutes avec un trait d’eau pour les garder croquants et vert vif.',
      'Posez les filets de dorade côté peau dans une poêle chaude huilée pendant 4 minutes sans les déplacer.',
      'Retournez 1 minute hors du feu, dressez avec les légumes rôtis, le persil frais et le demi-citron vert grillé.'
    ]
  },
  {
    id: 'shakshuka', page: 9, fullPage: false,
    title: 'Shakshuka aux poivrons doux & feta',
    shortTitle: 'Shakshuka & feta',
    photoFile: 'shakshuka.jpg', time: 15, kcal: 380, difficulty: 'Facile',
    kicker: '15 min · Végé · Épicé',
    ingredients: [
      { name: 'Œufs frais', qty: 4, unit: 'pièces', aisle: 'Frais' },
      { name: 'Poivron rouge', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Tomates concassées', qty: 400, unit: 'g', aisle: 'Épicerie' },
      { name: 'Feta', qty: 80, unit: 'g', aisle: 'Frais' },
      { name: 'Oignons jaunes', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Cumin moulu', qty: 1, unit: 'c. à c.', aisle: 'Épicerie' },
      { name: 'Coriandre fraîche', qty: 0.5, unit: 'bouquet', aisle: 'Fruits & Légumes' },
      { name: 'Pain au levain', qty: 2, unit: 'tranches', aisle: 'Épicerie' }
    ],
    steps: [
      'Faites revenir l’oignon émincé et le poivron en dés 4 min avec le cumin.',
      'Versez les tomates concassées et laissez réduire 5 min à feu moyen.',
      'Creusez 4 puits, cassez les œufs, couvrez 4 min pour garder les jaunes coulants.',
      'Émiettez la feta, ajoutez la coriandre et servez avec le pain grillé.'
    ]
  },
  {
    id: 'wrap-poulet', page: 9, fullPage: false,
    title: 'Wraps croustillants poulet grillé & sauce yaourt',
    shortTitle: 'Wraps poulet grillé',
    photoFile: 'wrap-poulet.jpg', time: 15, kcal: 460, difficulty: 'Facile',
    kicker: '15 min · Protéiné',
    ingredients: [
      { name: 'Blanc de poulet', qty: 260, unit: 'g', aisle: 'Viandes & Poissons' },
      { name: 'Grandes tortillas de blé', qty: 2, unit: 'pièces', aisle: 'Épicerie' },
      { name: 'Yaourt grec', qty: 100, unit: 'g', aisle: 'Frais' },
      { name: 'Laitue romaine', qty: 0.5, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Tomates mûres', qty: 2, unit: 'pièces', aisle: 'Fruits & Légumes' },
      { name: 'Oignon rouge', qty: 0.5, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Citron jaune', qty: 0.5, unit: 'pièce', aisle: 'Fruits & Légumes' }
    ],
    steps: [
      'Saisissez le poulet émincé et épicé 5 min à feu vif jusqu’à coloration.',
      'Mélangez le yaourt grec avec du jus de citron, sel, poivre et herbes.',
      'Garnissez les tortillas de sauce, laitue, tomates, oignon rouge et poulet chaud.',
      'Roulez serré et toastez 2 min à la poêle sèche pliure vers le bas.'
    ]
  },
  {
    id: 'salade-avocat', page: 10, fullPage: false,
    title: 'Salade tiède halloumi grillé, avocat & agrumes',
    shortTitle: 'Salade halloumi & avocat',
    photoFile: 'salade-avocat.jpg', time: 15, kcal: 410, difficulty: 'Facile',
    kicker: '15 min · Végé',
    ingredients: [
      { name: 'Fromage halloumi', qty: 200, unit: 'g', aisle: 'Frais' },
      { name: 'Avocat mûr', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Orange ou pamplemousse', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Roquette fraîche', qty: 80, unit: 'g', aisle: 'Fruits & Légumes' },
      { name: 'Graines de courge', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' },
      { name: 'Huile d’olive', qty: 2, unit: 'c. à s.', aisle: 'Épicerie' }
    ],
    steps: [
      'Pelez l’agrume à vif, récupérez le jus et fouettez-le avec l’huile d’olive.',
      'Grillez les tranches de halloumi 2 min par face dans une poêle bien chaude.',
      'Disposez la roquette, les tranches d’avocat et les suprêmes d’agrumes.',
      'Ajoutez le halloumi doré, la vinaigrette et les graines de courge.'
    ]
  },
  {
    id: 'veloute-potiron', page: 10, fullPage: false,
    title: 'Velouté rôti de potimarron, noisettes & ricotta',
    shortTitle: 'Velouté potimarron & ricotta',
    photoFile: 'veloute-potiron.jpg', time: 25, kcal: 360, difficulty: 'Facile',
    kicker: 'Ce soir · Végé',
    ingredients: [
      { name: 'Potimarron', qty: 500, unit: 'g', aisle: 'Fruits & Légumes' },
      { name: 'Ricotta fraîche', qty: 90, unit: 'g', aisle: 'Frais' },
      { name: 'Noisettes torréfiées', qty: 30, unit: 'g', aisle: 'Épicerie' },
      { name: 'Oignons jaunes', qty: 1, unit: 'pièce', aisle: 'Fruits & Légumes' },
      { name: 'Bouillon de légumes', qty: 450, unit: 'ml', aisle: 'Épicerie' },
      { name: 'Huile d’olive', qty: 1, unit: 'c. à s.', aisle: 'Épicerie' }
    ],
    steps: [
      'Coupez le potimarron lavé (avec la peau) en dés et faites revenir 3 min avec l’oignon.',
      'Couvrez de bouillon chaud et laissez mijoter 15 min à couvert.',
      'Concassez les noisettes torréfiées et détendez la ricotta avec une pincée de sel.',
      'Mixez finement, servez avec la ricotta, les noisettes et un filet d’huile d’olive.'
    ]
  }
];

const WEEK = [
  { day: 'Lundi', lunch: 'poke-saumon', dinner: 'yassa' },
  { day: 'Mardi', lunch: 'wrap-poulet', dinner: 'pates-tomate' },
  { day: 'Mercredi', lunch: 'salade-avocat', dinner: 'curry-lentilles' },
  { day: 'Jeudi', lunch: 'riz-saute', dinner: 'poisson-grille' },
  { day: 'Vendredi', lunch: 'shakshuka', dinner: 'veloute-potiron' },
  { day: 'Samedi', lunch: 'poke-saumon', dinner: 'pates-tomate' },
  { day: 'Dimanche', lunch: 'wrap-poulet', dinner: 'yassa' }
];

const AISLES = ['Fruits & Légumes', 'Viandes & Poissons', 'Frais', 'Épicerie'];

function byId(id) {
  return RECIPES.find(r => r.id === id);
}

function buildGroceries() {
  const map = new Map();
  for (const row of WEEK) {
    for (const rid of [row.lunch, row.dinner]) {
      const r = byId(rid);
      for (const ing of r.ingredients) {
        const key = `${ing.name.toLowerCase()}__${ing.unit.toLowerCase()}`;
        if (!map.has(key)) map.set(key, { name: ing.name, unit: ing.unit, aisle: ing.aisle, qty: 0 });
        map.get(key).qty += ing.qty;
      }
    }
  }
  const grouped = {};
  for (const a of AISLES) grouped[a] = [];
  for (const item of map.values()) grouped[item.aisle].push(item);
  for (const a of AISLES) grouped[a].sort((x, y) => x.name.localeCompare(y.name, 'fr'));
  return grouped;
}

function buildHtml() {
  const fontJakartaLatin = toDataUri(path.join(FONTS_DIR, 'PlusJakartaSans-latin.woff2'), 'font/woff2');
  const fontJakartaExt = toDataUri(path.join(FONTS_DIR, 'PlusJakartaSans-latin-ext.woff2'), 'font/woff2');
  const fontSerif = toDataUri(path.join(FONTS_DIR, 'InstrumentSerif-Regular.ttf'), 'font/ttf');
  const fontSerifItalic = toDataUri(path.join(FONTS_DIR, 'InstrumentSerif-Italic.ttf'), 'font/ttf');

  const photos = {};
  for (const r of RECIPES) {
    photos[r.id] = toDataUri(path.join(PHOTOS_DIR, r.photoFile), 'image/jpeg');
  }

  const groceries = buildGroceries();

  const fullPagesHtml = RECIPES.filter(r => r.fullPage).map(r => `
    <section class="page recipe-full-page">
      <div class="rf-hero">
        <img src="${photos[r.id]}" alt="${esc(r.title)}">
        <div class="rf-hero-badge">${esc(r.kicker)}</div>
      </div>
      <div class="rf-body">
        <div class="rf-head">
          <h2 class="rf-title">${esc(r.title)}</h2>
          <div class="rf-metrics">
            <span>${r.time} min</span>
            <span>·</span>
            <span>${r.kcal} kcal</span>
            <span>·</span>
            <span>2 personnes</span>
            <span>·</span>
            <span>${esc(r.difficulty)}</span>
          </div>
        </div>
        <div class="rf-cols">
          <div class="rf-ing-box">
            <h3>Ingrédients</h3>
            <ul>
              ${r.ingredients.map(i => `<li><span>${esc(i.name)}</span><strong>${esc(formatQty(i.qty, i.unit))}</strong></li>`).join('')}
            </ul>
          </div>
          <div class="rf-steps-col">
            <h3>Préparation</h3>
            <ol class="rf-steps">
              ${r.steps.map((s, idx) => `<li><span class="step-dot">${idx + 1}</span><p>${esc(s)}</p></li>`).join('')}
            </ol>
            <div class="rf-tip">
              <strong>Astuce Mijote</strong>
              <p>${esc(r.tip)}</p>
            </div>
          </div>
        </div>
      </div>
      <footer class="page-foot">
        <span>Mijote · Recettes express du quotidien</span>
        <span>${String(r.page).padStart(2, '0')}</span>
      </footer>
    </section>
  `).join('');

  const splitPairs = [
    { page: 9, items: [byId('shakshuka'), byId('wrap-poulet')] },
    { page: 10, items: [byId('salade-avocat'), byId('veloute-potiron')] }
  ];

  const splitPagesHtml = splitPairs.map(pair => `
    <section class="page split-page">
      <header class="subpage-head">
        <span class="kicker-orange">Fiches express</span>
        <span class="subpage-meta">Prêtes en 15 à 25 minutes · Pour 2 personnes</span>
      </header>
      <div class="split-stack">
        ${pair.items.map(r => `
          <article class="split-recipe">
            <div class="split-photo">
              <img src="${photos[r.id]}" alt="${esc(r.title)}">
              <span class="split-pill">${r.time} min</span>
            </div>
            <div class="split-content">
              <span class="split-kicker">${esc(r.kicker)}</span>
              <h2 class="split-title">${esc(r.title)}</h2>
              <div class="split-meta">${r.kcal} kcal · ${esc(r.difficulty)} · 2 pers.</div>
              <div class="split-inner">
                <div class="split-ings">
                  <h4>Ingrédients</h4>
                  <ul>
                    ${r.ingredients.map(i => `<li><span>${esc(i.name)}</span><strong>${esc(formatQty(i.qty, i.unit))}</strong></li>`).join('')}
                  </ul>
                </div>
                <div class="split-steps">
                  <h4>Étapes</h4>
                  <ol>
                    ${r.steps.map((s, idx) => `<li><span>${idx + 1}</span><p>${esc(s)}</p></li>`).join('')}
                  </ol>
                </div>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
      <footer class="page-foot">
        <span>Mijote · Recettes express du quotidien</span>
        <span>${String(pair.page).padStart(2, '0')}</span>
      </footer>
    </section>
  `).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Mijote — 10 recettes express du quotidien</title>
<style>
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('${fontJakartaLatin}') format('woff2');
    font-weight: 400 800;
    font-style: normal;
  }
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('${fontJakartaExt}') format('woff2');
    font-weight: 400 800;
    font-style: normal;
  }
  @font-face {
    font-family: 'Instrument Serif';
    src: url('${fontSerif}') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Instrument Serif';
    src: url('${fontSerifItalic}') format('truetype');
    font-weight: 400;
    font-style: italic;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #FFFFFF;
    color: #111111;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    position: relative;
    overflow: hidden;
    background: #FFFFFF;
    page-break-after: always;
    break-after: page;
  }
  .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  /* PAGE 1: COVER */
  .cover-page {
    display: flex;
    flex-direction: column;
  }
  .cover-photo-wrap {
    position: relative;
    width: 210mm;
    height: 205mm;
    overflow: hidden;
  }
  .cover-photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cover-top-tag {
    position: absolute;
    top: 14mm;
    left: 16mm;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: #111111;
    font-size: 9.5pt;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .cover-band {
    flex: 1;
    background: #FFFFFF;
    padding: 11mm 16mm 12mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cover-brand-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 1px solid rgba(17, 17, 17, 0.09);
    padding-bottom: 5mm;
  }
  .cover-brand {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 62pt;
    line-height: 0.9;
    letter-spacing: -0.02em;
    margin: 0;
    color: #111111;
  }
  .cover-issue {
    font-size: 9.5pt;
    font-weight: 700;
    color: #FF5A1F;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cover-title-block h2 {
    margin: 5mm 0 2.5mm;
    font-size: 20pt;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.16;
    color: #111111;
  }
  .cover-title-block p {
    margin: 0;
    font-size: 11.5pt;
    font-weight: 500;
    color: #6E6E73;
  }
  .cover-footer {
    display: flex;
    justify-content: space-between;
    font-size: 9pt;
    font-weight: 600;
    color: #6E6E73;
  }

  /* COMMON FOOTER */
  .page-foot {
    position: absolute;
    left: 16mm;
    right: 16mm;
    bottom: 9mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.5pt;
    font-weight: 600;
    color: #8E8E93;
    border-top: 1px solid rgba(17, 17, 17, 0.07);
    padding-top: 3mm;
    font-variant-numeric: tabular-nums;
  }

  /* PAGE 2: TOC & METHOD */
  .toc-page {
    padding: 16mm 16mm 18mm;
    display: flex;
    flex-direction: column;
  }
  .kicker-orange {
    font-size: 8.5pt;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #FF5A1F;
  }
  .mag-h1 {
    margin: 2mm 0 2mm;
    font-size: 26pt;
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.08;
  }
  .mag-lead {
    margin: 0 0 8mm;
    font-size: 10.5pt;
    color: #6E6E73;
    max-width: 145mm;
    line-height: 1.45;
  }
  .toc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4.5mm 6mm;
  }
  .toc-item {
    display: flex;
    align-items: center;
    gap: 3.5mm;
    padding: 2.5mm;
    border-radius: 12px;
    border: 1px solid rgba(17, 17, 17, 0.07);
  }
  .toc-item img {
    width: 17mm;
    height: 17mm;
    border-radius: 9px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .toc-info { flex: 1; min-width: 0; }
  .toc-name {
    font-size: 9.8pt;
    font-weight: 700;
    line-height: 1.22;
    margin-bottom: 1mm;
  }
  .toc-meta {
    font-size: 8.2pt;
    color: #6E6E73;
    font-weight: 600;
  }
  .toc-pg {
    font-size: 10pt;
    font-weight: 800;
    color: #FF5A1F;
    padding-right: 1.5mm;
    font-variant-numeric: tabular-nums;
  }
  .method-box {
    margin-top: auto;
    background: #F5F5F7;
    border-radius: 16px;
    padding: 6.5mm 7mm;
  }
  .method-box h2 {
    margin: 0 0 4mm;
    font-size: 13pt;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .method-cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5mm;
  }
  .method-step strong {
    display: block;
    font-size: 9.2pt;
    font-weight: 800;
    color: #111111;
    margin-bottom: 1.5mm;
  }
  .method-step p {
    margin: 0;
    font-size: 8.6pt;
    line-height: 1.45;
    color: #55555A;
  }

  /* PAGES 3-8: FULL PAGE RECIPES */
  .recipe-full-page {
    padding: 12mm 16mm 18mm;
  }
  .rf-hero {
    position: relative;
    width: 100%;
    height: 112mm;
    border-radius: 16px;
    overflow: hidden;
  }
  .rf-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .rf-hero-badge {
    position: absolute;
    top: 5mm;
    left: 5mm;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(17, 17, 17, 0.72);
    color: #FFFFFF;
    font-size: 8.5pt;
    font-weight: 700;
  }
  .rf-body {
    margin-top: 6mm;
  }
  .rf-title {
    margin: 0;
    font-size: 21pt;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.12;
  }
  .rf-metrics {
    display: flex;
    gap: 2.5mm;
    margin-top: 2.5mm;
    font-size: 9.5pt;
    font-weight: 700;
    color: #FF5A1F;
    font-variant-numeric: tabular-nums;
  }
  .rf-cols {
    display: grid;
    grid-template-columns: 64mm 1fr;
    gap: 7mm;
    margin-top: 6mm;
  }
  .rf-ing-box {
    background: #F5F5F7;
    border-radius: 14px;
    padding: 5mm 5.5mm;
    align-self: start;
  }
  .rf-ing-box h3, .rf-steps-col h3 {
    margin: 0 0 3.5mm;
    font-size: 11pt;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .rf-ing-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .rf-ing-box li {
    display: flex;
    justify-content: space-between;
    gap: 3mm;
    padding: 2.1mm 0;
    border-bottom: 1px solid rgba(17, 17, 17, 0.06);
    font-size: 8.7pt;
    line-height: 1.3;
  }
  .rf-ing-box li:last-child { border-bottom: none; }
  .rf-ing-box li strong {
    font-weight: 700;
    color: #111111;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .rf-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 3.5mm;
  }
  .rf-steps li {
    display: flex;
    gap: 3mm;
    align-items: flex-start;
  }
  .step-dot {
    width: 6mm;
    height: 6mm;
    border-radius: 999px;
    background: #FF5A1F;
    color: #FFFFFF;
    font-size: 8.5pt;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.4mm;
  }
  .rf-steps p {
    margin: 0;
    font-size: 9.3pt;
    line-height: 1.46;
    color: #222226;
  }
  .rf-tip {
    margin-top: 5mm;
    padding: 3.8mm 4.5mm;
    border-radius: 12px;
    background: #FFF0EA;
    border-left: 3px solid #FF5A1F;
  }
  .rf-tip strong {
    display: block;
    font-size: 8.4pt;
    font-weight: 800;
    color: #E04812;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 1mm;
  }
  .rf-tip p {
    margin: 0;
    font-size: 8.7pt;
    line-height: 1.4;
    color: #3A251D;
  }

  /* PAGES 9-10: SPLIT 2-PER-PAGE EXPRESS */
  .split-page {
    padding: 13mm 16mm 18mm;
  }
  .subpage-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid rgba(17, 17, 17, 0.08);
    padding-bottom: 3mm;
    margin-bottom: 6mm;
  }
  .subpage-meta {
    font-size: 8.8pt;
    font-weight: 600;
    color: #6E6E73;
  }
  .split-stack {
    display: flex;
    flex-direction: column;
    gap: 8mm;
  }
  .split-recipe {
    display: grid;
    grid-template-columns: 58mm 1fr;
    gap: 6mm;
    padding-bottom: 7mm;
    border-bottom: 1px solid rgba(17, 17, 17, 0.08);
  }
  .split-recipe:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .split-photo {
    position: relative;
    height: 114mm;
    border-radius: 14px;
    overflow: hidden;
  }
  .split-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .split-pill {
    position: absolute;
    top: 3.5mm;
    left: 3.5mm;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(17, 17, 17, 0.72);
    color: #FFFFFF;
    font-size: 8pt;
    font-weight: 700;
  }
  .split-kicker {
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #FF5A1F;
  }
  .split-title {
    margin: 1mm 0 1.2mm;
    font-size: 14.5pt;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.16;
  }
  .split-meta {
    font-size: 8.6pt;
    font-weight: 600;
    color: #6E6E73;
    margin-bottom: 3.5mm;
  }
  .split-inner {
    display: grid;
    grid-template-columns: 46mm 1fr;
    gap: 4.5mm;
  }
  .split-ings {
    background: #F5F5F7;
    border-radius: 11px;
    padding: 3.5mm 4mm;
    align-self: start;
  }
  .split-ings h4, .split-steps h4 {
    margin: 0 0 2.5mm;
    font-size: 9.2pt;
    font-weight: 800;
  }
  .split-ings ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .split-ings li {
    display: flex;
    justify-content: space-between;
    gap: 2mm;
    font-size: 7.7pt;
    padding: 1.4mm 0;
    border-bottom: 1px solid rgba(17, 17, 17, 0.06);
  }
  .split-ings li:last-child { border-bottom: none; }
  .split-ings strong { white-space: nowrap; }
  .split-steps ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2.5mm;
  }
  .split-steps li {
    display: flex;
    gap: 2.2mm;
    align-items: flex-start;
  }
  .split-steps li span {
    width: 4.8mm;
    height: 4.8mm;
    border-radius: 999px;
    background: #111111;
    color: #FFFFFF;
    font-size: 7.5pt;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.4mm;
  }
  .split-steps p {
    margin: 0;
    font-size: 8.2pt;
    line-height: 1.38;
    color: #222226;
  }

  /* PAGE 11: WEEKLY PLANNER */
  .planner-page {
    padding: 16mm 16mm 18mm;
    display: flex;
    flex-direction: column;
  }
  .week-table {
    display: flex;
    flex-direction: column;
    gap: 3.4mm;
  }
  .week-day-row {
    display: grid;
    grid-template-columns: 26mm 1fr 1fr;
    gap: 4mm;
    align-items: center;
    padding: 3.2mm 4mm;
    border-radius: 13px;
    background: #F5F5F7;
  }
  .week-day-name {
    font-size: 10.5pt;
    font-weight: 800;
    color: #111111;
  }
  .week-slot {
    display: flex;
    align-items: center;
    gap: 3mm;
    background: #FFFFFF;
    padding: 2.2mm 3mm;
    border-radius: 10px;
  }
  .week-slot img {
    width: 11.5mm;
    height: 11.5mm;
    border-radius: 7px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .week-slot-lbl {
    display: block;
    font-size: 7.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #FF5A1F;
  }
  .week-slot-name {
    font-size: 8.6pt;
    font-weight: 700;
    line-height: 1.2;
  }
  .notes-box {
    margin-top: auto;
    border: 1.5px dashed rgba(17, 17, 17, 0.16);
    border-radius: 14px;
    padding: 5mm 6mm;
    height: 44mm;
  }
  .notes-box h3 {
    margin: 0 0 2mm;
    font-size: 10pt;
    font-weight: 800;
  }
  .notes-lines {
    display: flex;
    flex-direction: column;
    gap: 7mm;
    margin-top: 5mm;
  }
  .notes-lines span {
    display: block;
    border-bottom: 1px solid rgba(17, 17, 17, 0.1);
  }

  /* PAGE 12: PRINTABLE GROCERY LIST */
  .grocery-page {
    padding: 15mm 16mm 18mm;
  }
  .aisles-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5.5mm;
  }
  .aisle-card {
    background: #F5F5F7;
    border-radius: 14px;
    padding: 4.5mm 5mm;
    align-self: start;
  }
  .aisle-card h3 {
    margin: 0 0 3mm;
    font-size: 10.5pt;
    font-weight: 800;
    color: #111111;
    display: flex;
    justify-content: space-between;
  }
  .aisle-card h3 span {
    color: #FF5A1F;
    font-size: 8.5pt;
  }
  .aisle-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .aisle-list li {
    display: flex;
    align-items: center;
    gap: 2.5mm;
    padding: 1.55mm 0;
    border-bottom: 1px solid rgba(17, 17, 17, 0.06);
    font-size: 8.2pt;
  }
  .aisle-list li:last-child { border-bottom: none; }
  .print-check {
    width: 3.4mm;
    height: 3.4mm;
    border-radius: 999px;
    border: 1.3px solid #9A9AA0;
    background: #FFFFFF;
    flex-shrink: 0;
  }
  .aisle-item-name { flex: 1; font-weight: 600; }
  .aisle-item-qty {
    color: #6E6E73;
    font-weight: 700;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .colophon {
    margin-top: 6mm;
    text-align: center;
    font-size: 8.5pt;
    color: #6E6E73;
  }
  .colophon strong {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 14pt;
    font-weight: 400;
    color: #111111;
    margin-right: 4px;
  }
</style>
</head>
<body>
  <!-- PAGE 1 : COUVERTURE MAGAZINE PLEIN CADRE -->
  <section class="page cover-page">
    <div class="cover-photo-wrap">
      <img src="${photos.yassa}" alt="Poulet Yassa express aux oignons caramélisés">
      <div class="cover-top-tag">Carnet culinaire express</div>
    </div>
    <div class="cover-band">
      <div class="cover-brand-row">
        <h1 class="cover-brand">Mijote</h1>
        <span class="cover-issue">10 recettes · 12 pages</span>
      </div>
      <div class="cover-title-block">
        <h2>10 recettes express du quotidien — Prêtes en 15 à 25 minutes</h2>
        <p>Cuisine fraîche, rapide et gourmande pour toute la semaine, avec semainier et liste de courses prête à imprimer.</p>
      </div>
      <div class="cover-footer">
        <span>Quantités calibrées pour 2 personnes</span>
        <span>Édition Cuisine du Quotidien</span>
      </div>
    </div>
  </section>

  <!-- PAGE 2 : SOMMAIRE ILLUSTRÉ & MÉTHODE EXPRESS -->
  <section class="page toc-page">
    <span class="kicker-orange">Sommaire illustré</span>
    <h1 class="mag-h1">10 plats rapides à cuisiner cette semaine</h1>
    <p class="mag-lead">Cinq assiettes prêtes en 15 minutes pour les midis pressés, cinq dîners chaleureux de 20 à 25 minutes, pensés pour partager des ingrédients communs sans gaspillage.</p>

    <div class="toc-grid">
      ${RECIPES.map(r => `
        <div class="toc-item">
          <img src="${photos[r.id]}" alt="${esc(r.shortTitle)}">
          <div class="toc-info">
            <div class="toc-name">${esc(r.shortTitle)}</div>
            <div class="toc-meta">${r.time} min · ${r.kcal} kcal · ${esc(r.difficulty)}</div>
          </div>
          <span class="toc-pg">${String(r.page).padStart(2, '0')}</span>
        </div>
      `).join('')}
    </div>

    <div class="method-box">
      <h2>La méthode Mijote en 3 habitudes simples</h2>
      <div class="method-cols">
        <div class="method-step">
          <strong>1. Alterner 15 min &amp; 25 min</strong>
          <p>Gardez les bowls, wraps et salades tièdes pour le midi et réservez les plats mijotés rapides pour le soir.</p>
        </div>
        <div class="method-step">
          <strong>2. Faire une seule liste</strong>
          <p>Les 10 recettes réutilisent les mêmes essentiels (citron, avocat, herbes, riz, huile d’olive) pour des courses fluides.</p>
        </div>
        <div class="method-step">
          <strong>3. Cuisiner sans précipitation</strong>
          <p>Préparez vos légumes et herbes en 4 minutes avant d’allumer le feu : chaque plat s’enchaîne ensuite sans stress.</p>
        </div>
      </div>
    </div>

    <footer class="page-foot">
      <span>Mijote · Recettes express du quotidien</span>
      <span>02</span>
    </footer>
  </section>

  <!-- PAGES 3 À 8 : 6 RECETTES SIGNATURE PLEINE PAGE -->
  ${fullPagesHtml}

  <!-- PAGES 9 À 10 : 4 RECETTES EXPRESS EN DOUBLE FICHE -->
  ${splitPagesHtml}

  <!-- PAGE 11 : SEMAINIER TYPE -->
  <section class="page planner-page">
    <span class="kicker-orange">Organisation de la semaine</span>
    <h1 class="mag-h1">Semainier type prêt à suivre</h1>
    <p class="mag-lead">Sept jours variés associant déjeuners prêts en 15 minutes et dîners gourmands, équilibrés entre volaille, poisson et plats végétariens.</p>

    <div class="week-table">
      ${WEEK.map(row => {
        const l = byId(row.lunch);
        const d = byId(row.dinner);
        return `
          <div class="week-day-row">
            <div class="week-day-name">${esc(row.day)}</div>
            <div class="week-slot">
              <img src="${photos[l.id]}" alt="${esc(l.shortTitle)}">
              <div>
                <span class="week-slot-lbl">Déjeuner · ${l.time} min</span>
                <div class="week-slot-name">${esc(l.shortTitle)}</div>
              </div>
            </div>
            <div class="week-slot">
              <img src="${photos[d.id]}" alt="${esc(d.shortTitle)}">
              <div>
                <span class="week-slot-lbl">Dîner · ${d.time} min</span>
                <div class="week-slot-name">${esc(d.shortTitle)}</div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="notes-box">
      <h3>Notes de la semaine &amp; envies</h3>
      <div class="notes-lines">
        <span></span><span></span><span></span>
      </div>
    </div>

    <footer class="page-foot">
      <span>Mijote · Recettes express du quotidien</span>
      <span>11</span>
    </footer>
  </section>

  <!-- PAGE 12 : LISTE DE COURSES IMPRIMABLE -->
  <section class="page grocery-page">
    <span class="kicker-orange">Courses de la semaine</span>
    <h1 class="mag-h1">Liste de courses imprimable</h1>
    <p class="mag-lead">Quantités fusionnées pour le semainier complet (base 2 personnes), classées par rayon pour gagner du temps en magasin.</p>

    <div class="aisles-grid">
      ${AISLES.map(aisle => `
        <div class="aisle-card">
          <h3>${esc(aisle)} <span>${groceries[aisle].length}</span></h3>
          <ul class="aisle-list">
            ${groceries[aisle].map(item => `
              <li>
                <span class="print-check"></span>
                <span class="aisle-item-name">${esc(item.name)}</span>
                <span class="aisle-item-qty">${esc(formatQty(item.qty, item.unit))}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <div class="colophon">
      <strong>Mijote</strong> — 10 recettes express du quotidien · Bonne cuisine !
    </div>

    <footer class="page-foot">
      <span>Mijote · Recettes express du quotidien</span>
      <span>12</span>
    </footer>
  </section>
</body>
</html>`;
}

async function main() {
  const pwPath = findPlaywrightCore();
  const chromePath = findChromiumBinary();
  const { chromium } = await import(pathToFileURL(pwPath).href);

  const html = buildHtml();
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: OUT_PDF,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
    const kb = (fs.statSync(OUT_PDF).size / 1024).toFixed(1);
    console.log(`PDF généré : ${OUT_PDF} (${kb} KB)`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

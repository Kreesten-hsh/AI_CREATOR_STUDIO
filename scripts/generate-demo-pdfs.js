#!/usr/bin/env node
/**
 * scripts/generate-demo-pdfs.js
 * Génère 2 vrais ebooks PDF A4 réalistes (8 à 10 pages chacun) dans `public/downloads/demo-pdfs/`
 * via Google Chrome / Chromium headless (sans Lorem Ipsum ni mention caricaturale).
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

const EBOOK_PDF_PATH = path.join(
  outputDir,
  '01-EBOOK-CREER-PRODUIT-DIGITAL-AVEC-CLAUDE.pdf'
);
const PROMPTS_PDF_PATH = path.join(
  outputDir,
  '02-PACK-50-PROMPTS-CREATEURS-IA.pdf'
);

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

function buildEbookHtml() {
  const chapters = [
    {
      num: 'Chapitre 1',
      title: 'Trouver son idée et valider une problématique rentable',
      intro:
        'La réussite d’un produit digital repose avant tout sur la précision du problème qu’il résout. Trop de créateurs commencent par rédiger un guide complet autour d’un thème très général, sans vérifier au préalable si une audience est réellement prête à payer pour obtenir une réponse claire et structurée.',
      sections: [
        {
          heading: '1.1 Identifier une douleur précise plutôt qu’un sujet large',
          paragraphs: [
            'Un lecteur n’achète pas un document numérique pour accumuler de la théorie générale que l’on retrouve gratuitement sur Internet. Il investit dans un guide pratique parce qu’il souhaite gagner du temps, éviter des erreurs coûteuses ou suivre un chemin balisé du point A au point B.',
            'Pour formuler une bonne promesse éditoriale, il convient donc de partir d’une question concrète posée régulièrement par votre audience : comment rédiger son premier devis sans sous-estimer ses tarifs, comment structurer une semaine de prospection sur LinkedIn, ou encore comment organiser sa comptabilité d’indépendant en moins de trente minutes par semaine.',
          ],
          bullets: [
            'Lister les dix questions qui reviennent le plus souvent dans vos messages privés ou commentaires.',
            'Écarter les sujets purement descriptifs au profit d’un résultat mesurable en quelques jours.',
            'Vérifier que votre lecteur cible possède déjà un besoin immédiat ou récurrent.',
            'Formuler le titre provisoire autour de la transformation promise plutôt que du format du fichier.',
          ],
        },
        {
          heading: '1.2 Valider l’intérêt avant de rédiger des dizaines de pages',
          paragraphs: [
            'Avant d’investir plusieurs heures dans la rédaction complète d’un guide, il est recommandé de tester l’appétit du marché avec une validation légère. Une publication éducative dédiée au sujet, un sondage auprès de vos abonnés actifs ou une mini-étude de cas partagée gratuitement permettent d’observer les réactions réelles.',
            'Si plusieurs personnes vous demandent comment approfondir la méthode ou réclament un modèle prêt à l’emploi, vous disposez d’un signal fiable. À l’inverse, un sujet qui ne suscite aucune question mérite souvent d’être reformulé sous un angle plus concret.',
          ],
          callout:
            'Règle pratique : un bon sujet de guide doit pouvoir s’expliquer en une seule phrase simple : « Aider [cible précise] à obtenir [résultat concret] sans [contrainte principale] ».',
        },
        {
          heading: '1.3 Définir le périmètre et le tarif d’entrée',
          paragraphs: [
            'Une erreur fréquente chez les créateurs débutants consiste à vouloir tout enseigner dans un seul ouvrage de cent pages. En pratique, un guide numérique focalisé sur un résultat précis se lit beaucoup plus facilement et génère davantage de passages à l’action qu’une encyclopédie indigeste.',
            'Fixez un périmètre réaliste : votre lecteur doit pouvoir parcourir l’ensemble du document en une heure et appliquer les premières étapes dès la fin de sa lecture. Ce positionnement pragmatique justifie un prix d’entrée accessible tout en créant une forte satisfaction client.',
          ],
          bullets: [
            'Délimiter clairement ce que le guide couvre et ce qu’il laisse volontairement de côté.',
            'Comparer les tarifs des guides similaires sur votre thématique pour situer votre offre.',
            'Prévoir un objectif de lecture réaliste (entre 30 et 60 minutes au total).',
          ],
        },
      ],
    },
    {
      num: 'Chapitre 2',
      title: 'Structurer son contenu pédagogique avec l’IA',
      intro:
        'Une fois la problématique validée, l’intelligence artificielle devient un assistant éditorial particulièrement efficace pour organiser vos idées, éviter les oublis logiques et maintenir une progression pédagogique cohérente du début à la fin du document.',
      sections: [
        {
          heading: '2.1 Construire le squelette du guide avant de rédiger',
          paragraphs: [
            'L’erreur la plus fréquente lors de l’utilisation d’un assistant conversationnel consiste à demander directement la rédaction complète d’un ebook en une seule requête. Ce raccourci produit presque toujours des textes répétitifs, superficiels et déconnectés de votre expérience réelle.',
            'La méthode fiable consiste à travailler en deux temps : d’abord établir un plan détaillé chapitre par chapitre en précisant le niveau de départ du lecteur, puis rédiger chaque sous-partie individuellement en injectant vos propres exemples, chiffres et retours de terrain.',
          ],
          bullets: [
            'Définir 4 à 6 chapitres maximum afin de garder un rythme de lecture fluide et digeste.',
            'Attribuer à chaque chapitre un objectif unique et un livrable ou exercice concret.',
            'Fournir à Claude ou ChatGPT vos notes brutes, extraits d’appels clients ou plans de cours existants.',
            'Imposer des consignes de style claires : phrases directes, exemples chiffrés, absence de jargon inutile.',
          ],
        },
        {
          heading: '2.2 Enrichir le texte avec votre expertise et votre voix',
          paragraphs: [
            'Un guide numérique acquiert sa valeur lorsqu’il reflète une véritable pratique professionnelle. Après chaque génération de brouillon, relisez attentivement les paragraphes pour remplacer les formulations génériques par des cas vécus, des erreurs fréquentes observées chez vos clients et des recommandations actionnables.',
            'Prenez également le temps d’ajouter des transitions naturelles entre les chapitres. Le lecteur doit sentir une continuité logique : chaque section répond à une question soulevée dans la section précédente et prépare l’étape suivante.',
          ],
          callout:
            'Astuce de relecture : supprimez systématiquement les phrases d’introduction vagues (« Dans le monde actuel… ») et démarrez chaque sous-partie par une idée forte ou une règle concrète.',
        },
        {
          heading: '2.3 Intégrer des modèles et exercices d’application',
          paragraphs: [
            'Pour éviter que votre guide reste purement théorique, insérez à la fin de chaque chapitre un modèle prêt à adapter ou une courte série de questions d’auto-évaluation. Ce type de structure encourage le lecteur à mettre en pratique vos conseils immédiatement plutôt que de refermer le fichier sans agir.',
            'Vous pouvez demander à Claude ou ChatGPT de transformer chacun de vos concepts en fiche d’application simple : situation de départ, étapes à suivre dans l’ordre, points de vigilance et critère permettant de savoir que l’étape est réussie.',
          ],
          bullets: [
            'Ajouter un récapitulatif d’actions numérotées à la fin de chaque grand chapitre.',
            'Inclure deux à trois exemples réels ou scénarios chiffrés pour illustrer les principes.',
            'Relire l’ensemble à voix haute pour vérifier la fluidité et la cohérence du vocabulaire.',
          ],
        },
      ],
    },
    {
      num: 'Chapitre 3',
      title: 'Mettre en page son guide PDF proprement',
      intro:
        'La présentation visuelle d’un ebook influence directement la perception de sérieux et la facilité de lecture. Même si le contenu est pertinent, un document mal aligné ou compact décourage rapidement l’acheteur dès les premières pages.',
      sections: [
        {
          heading: '3.1 Choisir une hiérarchie typographique lisible',
          paragraphs: [
            'Pour un guide destiné à être lu sur ordinateur, tablette ou smartphone, la simplicité reste votre meilleure alliée. Limitez-vous à deux familles de polices complémentaires : une police sobre pour les titres et sous-titres, et une police confortable pour le corps du texte avec un interlignage suffisant.',
            'Veillez à conserver des marges généreuses tout autour de la page A4. L’œil du lecteur a besoin d’espace blanc pour respirer entre les paragraphes, les listes à puces et les encadrés récapitulatifs.',
          ],
          bullets: [
            'Utiliser un corps de texte entre 10,5 pt et 11,5 pt avec un interlignage d’environ 1,5.',
            'Limiter les paragraphes à quatre ou cinq lignes afin d’éviter les blocs visuellement compacts.',
            'Insérer un encadré de synthèse ou une liste d’actions à la fin de chaque grand chapitre.',
            'Numéroter toutes les pages et vérifier que les titres ne restent jamais isolés en bas de page.',
          ],
        },
        {
          heading: '3.2 Finaliser la couverture, le sommaire et l’export',
          paragraphs: [
            'La première page doit poser le cadre dès l’ouverture : un titre lisible, un sous-titre explicite, le nom de l’auteur ou du studio et un sommaire clair permettant de repérer immédiatement la progression du guide.',
            'Avant l’exportation finale en PDF, effectuez une relecture complète en mode aperçu page par page. Vérifiez les sauts de page, la cohérence des puces, l’orthographe des titres et le poids total du fichier afin qu’il reste rapide à télécharger sur connexion mobile.',
          ],
          callout:
            'Contrôle avant mise en ligne : ouvrez votre PDF final sur téléphone et sur ordinateur pour vous assurer que les marges et la taille des caractères restent confortables sur petit écran.',
        },
        {
          heading: '3.3 Soigner les détails qui inspirent confiance',
          paragraphs: [
            'Avant de diffuser votre document auprès des premiers acheteurs, prenez dix minutes pour vérifier les détails de finition : homogénéité des titres, alignement des listes, orthographe soignée et cohérence des numéros de chapitres entre le sommaire et le corps du texte.',
            'Pensez également à nommer votre fichier PDF de manière claire et professionnelle (sans « final_v3_copie.pdf »). Un nom propre facilite le classement sur l’appareil de votre client lorsqu’il le télécharge après paiement.',
          ],
          bullets: [
            'Vérifier la pagination complète et l’absence de titres orphelins en bas de page.',
            'Exporter le document avec une compression modérée afin de garder un fichier léger.',
            'Tester l’ouverture du PDF dans un navigateur web ainsi que sur lecteur mobile.',
          ],
        },
      ],
    },
    {
      num: 'Chapitre 4',
      title: 'Mettre en vente sur Chariow et lancer ses premières ventes',
      intro:
        'Une fois votre document PDF exporté et vérifié, il ne reste plus qu’à le rendre accessible à l’achat dans des conditions fluides pour vos clients. La plateforme Chariow permet d’héberger le fichier, d’encaisser les paiements en toute simplicité et d’envoyer automatiquement le produit après commande.',
      sections: [
        {
          heading: '4.1 Rédiger une fiche produit claire et orientée bénéfices',
          paragraphs: [
            'La page de vente n’a pas besoin d’être interminable pour convaincre. Elle doit répondre rapidement aux quatre questions que se pose tout acheteur : à qui s’adresse ce guide, quel problème précis résout-il, que contient exactement le sommaire et comment reçoit-on le fichier après le paiement.',
            'Soignez la vignette carrée ainsi que les visuels d’aperçu en montrant deux ou trois pages intérieures du sommaire. Cette transparence rassure immédiatement le visiteur sur le sérieux de votre document.',
          ],
          bullets: [
            'Rédiger un titre explicite incluant le bénéfice principal du guide.',
            'Détailler le contenu chapitre par chapitre avec des puces concrètes.',
            'Préciser le format (PDF téléchargeable immédiatement) et le nombre de pages.',
            'Fixer un tarif cohérent avec la valeur pratique apportée et les standards de votre marché.',
          ],
        },
        {
          heading: '4.2 Configurer la livraison et orchestrer le lancement',
          paragraphs: [
            'Dans les paramètres du produit sur Chariow, importez votre fichier PDF définitif et effectuez un test d’achat ou de prévisualisation pour vérifier l’email de confirmation reçu par le client. La livraison instantanée supprime toute friction après le paiement.',
            'Pour générer vos premières ventes, préparez une séquence de contenus simples sur sept jours : un constat partagé par votre audience, les coulisses de la création du guide, un extrait concret d’un chapitre, puis l’ouverture officielle avec un appel à l’action direct en commentaire ou en lien.',
          ],
          callout:
            'Prochaine étape : mesurez les questions posées par vos premiers lecteurs durant la semaine de lancement afin d’enrichir la future version de votre ressource.',
        },
        {
          heading: '4.3 Recueillir des retours et améliorer la version suivante',
          paragraphs: [
            'Les premiers acheteurs constituent votre meilleure source d’amélioration. Quelques jours après la livraison automatique sur Chariow, envoyez un court message pour demander quel chapitre leur a été le plus utile et quel point mériterait un exemple supplémentaire.',
            'Ces retours concrets vous permettront ensuite de mettre à jour votre document en ajoutant les précisions demandées, d’alimenter vos futurs contenus de présentation avec de vrais avis clients et d’augmenter progressivement la conversion de votre page de vente.',
          ],
          bullets: [
            'Noter chaque question récurrente pour l’intégrer à la section FAQ de votre fiche produit.',
            'Mettre à jour le fichier PDF sur Chariow dès qu’une amélioration majeure est prête.',
            'Préparer une courte séquence de contenus récurrents renvoyant vers votre boutique.',
          ],
        },
      ],
    },
  ];

  const tocItems = chapters
    .map(
      (ch, idx) => `
      <div class="toc-row">
        <span class="toc-label">${escapeHtml(ch.num)} — ${escapeHtml(ch.title)}</span>
        <span class="toc-dots"></span>
        <span class="toc-page">${idx * 2 + 2}</span>
      </div>`
    )
    .join('');

  const chaptersHtml = chapters
    .map(
      (ch, idx) => `
      <section class="chapter ${idx > 0 ? 'page-break' : ''}">
        <div class="chapter-kicker">${escapeHtml(ch.num.toUpperCase())}</div>
        <h2>${escapeHtml(ch.title)}</h2>
        <p class="chapter-intro">${escapeHtml(ch.intro)}</p>
        ${ch.sections
          .map(
            (sec) => `
          <div class="subsection">
            <h3>${escapeHtml(sec.heading)}</h3>
            ${sec.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            ${
              sec.bullets
                ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
                : ''
            }
            ${
              sec.callout
                ? `<div class="callout">${escapeHtml(sec.callout)}</div>`
                : ''
            }
          </div>`
          )
          .join('')}
      </section>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Guide Pratique : Créer et vendre un produit digital étape par étape avec l'IA</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 16mm 16mm 16mm;
      @bottom-center {
        content: "Page " counter(page) " sur " counter(pages);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9.5pt;
        color: #64748b;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14.5pt;
      line-height: 1.48;
      color: #0f172a;
      background: #ffffff;
    }
    .doc-header {
      border-top: 5px solid #1e293b;
      border-bottom: 2px solid #cbd5e1;
      padding: 4mm 0 4.5mm 0;
      margin-bottom: 5mm;
    }
    .edition-tag {
      font-size: 10pt;
      font-weight: bold;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 2.5mm;
    }
    h1 {
      font-size: 21pt;
      line-height: 1.18;
      color: #0f172a;
      margin: 0 0 3mm 0;
    }
    .cover-subtitle {
      font-size: 12.5pt;
      line-height: 1.42;
      color: #334155;
      margin: 0;
    }
    .toc-box {
      border: 1.5px solid #94a3b8;
      background: #f8fafc;
      padding: 4mm 5.5mm;
      border-radius: 4px;
      margin-bottom: 5.5mm;
    }
    .toc-title {
      font-size: 11.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0f172a;
      margin: 0 0 2.5mm 0;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 1.5mm;
    }
    .toc-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 1.8mm;
      font-size: 11pt;
      color: #1e293b;
    }
    .toc-dots {
      flex: 1;
      border-bottom: 1px dotted #94a3b8;
    }
    .toc-page {
      font-weight: bold;
      color: #0f172a;
    }
    .page-break {
      page-break-before: always;
    }
    .chapter-kicker {
      font-size: 10.5pt;
      font-weight: bold;
      letter-spacing: 0.1em;
      color: #475569;
      margin-bottom: 1.5mm;
    }
    h2 {
      font-size: 17.5pt;
      line-height: 1.22;
      color: #0f172a;
      margin: 0 0 3.5mm 0;
      padding-bottom: 2mm;
      border-bottom: 2px solid #cbd5e1;
    }
    .chapter-intro {
      font-size: 13.5pt;
      font-style: italic;
      color: #1e293b;
      margin: 0 0 4.5mm 0;
    }
    .subsection {
      margin-bottom: 5.5mm;
    }
    h3 {
      font-size: 15pt;
      color: #0f172a;
      margin: 3.5mm 0 2mm 0;
      break-after: avoid;
    }
    p {
      margin: 0 0 3mm 0;
      font-size: 13.8pt;
      line-height: 1.46;
      color: #1e293b;
      text-align: left;
    }
    ul {
      margin: 2mm 0 4mm 4mm;
      padding-left: 4mm;
    }
    li {
      margin-bottom: 1.8mm;
      font-size: 13.2pt;
      line-height: 1.42;
      color: #1e293b;
    }
    .callout {
      margin-top: 3.5mm;
      padding: 3.5mm 4.5mm;
      background: #f1f5f9;
      border-left: 4px solid #334155;
      font-size: 12.5pt;
      line-height: 1.45;
      color: #0f172a;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="edition-tag">Guide Pratique • Édition 2026 • Format PDF</div>
    <h1>Créer et vendre un produit digital étape par étape avec l'IA</h1>
    <p class="cover-subtitle">
      Méthode structurée pour identifier une idée rentable, rédiger un contenu clair avec l'IA, mettre en page son guide PDF et lancer ses premières ventes.
    </p>
  </div>
  <div class="toc-box">
    <div class="toc-title">Sommaire du guide</div>
    ${tocItems}
  </div>
  ${chaptersHtml}
</body>
</html>`;
}

function buildPromptsHtml() {
  const categories = [
    {
      name: 'Catégorie 1 : Trouver une niche et un positionnement rentable',
      prompts: [
        {
          title: 'Identifier 10 problèmes urgents dans une thématique',
          text: 'Agis comme un stratège marketing spécialisé dans les produits numériques. Mon domaine d’expertise est [TON DOMAINE]. Liste 10 problèmes spécifiques, urgents et mesurables que rencontrent mes clients potentiels au quotidien, et précise pour chacun ce qui les empêche d’avancer seuls.',
        },
        {
          title: 'Définir un profil de lecteur idéal ultra-précis',
          text: 'À partir de cette idée de produit [IDÉE], dresse le portrait détaillé du lecteur idéal : niveau d’expérience actuel, blocages concrets, erreurs déjà essayées, vocabulaire exact utilisé pour décrire son problème et résultat recherché en moins de 14 jours.',
        },
        {
          title: 'Analyser les lacunes des guides gratuits existants',
          text: 'Voici les sujets les plus traités gratuitement dans ma niche : [LISTE]. Explique pourquoi un lecteur reste bloqué après avoir consommé ces contenus gratuits et propose 5 angles pratiques qui justifient un produit payant.',
        },
        {
          title: 'Formuler 5 promesses claires sans exagération',
          text: 'Rédige 5 formulations de promesse de valeur pour un produit numérique sur [SUJET]. Chaque phrase doit contenir la cible, le bénéfice concret obtenu et le gain de temps ou d’effort, sans aucune formule sensationnaliste.',
        },
        {
          title: 'Choisir le meilleur format pour une problématique donnée',
          text: 'Compare 3 formats possibles pour répondre à ce besoin précis : [BESOIN]. Évalue pour chacun la facilité d’exécution par l’acheteur, la valeur perçue et le positionnement tarifaire conseillé.',
        },
        {
          title: 'Tester une idée avec 3 questions d’audience',
          text: 'Propose 3 questions simples et directes à poser en story ou par email à ma communauté sur [SUJET] afin de vérifier s’il existe une demande réelle avant de créer le produit.',
        },
        {
          title: 'Trouver un angle différenciant face à la concurrence',
          text: 'Les concurrents sur [THÈME] vendent tous des guides théoriques longs. Propose 4 axes de différenciation basés sur la rapidité de mise en œuvre, des modèles prêts à l’emploi ou une méthode simplifiée.',
        },
        {
          title: 'Valider le niveau de maturité d’une micro-niche',
          text: 'Évalue le potentiel commercial de la micro-niche suivante : [MICRO-NICHE]. Indique les signaux d’achat les plus fréquents, les objections prévisibles et le panier moyen réaliste.',
        },
        {
          title: 'Transformer une compétence métier en mini-offre',
          text: 'Voici ce que je fais au quotidien pour mes clients : [COMPÉTENCE]. Découpe cette compétence en 3 mini-produits numériques autonomes qu’un débutant pourrait appliquer seul en un week-end.',
        },
        {
          title: 'Rédiger un positionnement en deux phrases',
          text: 'Synthétise mon positionnement de créateur dans le domaine [DOMAINE] en deux phrases simples destinées à ma bio et à l’en-tête de ma boutique en ligne.',
        },
      ],
    },
    {
      name: 'Catégorie 2 : Structurer une offre digitale et son contenu',
      prompts: [
        {
          title: 'Bâtir un sommaire logique en 4 étapes progressives',
          text: 'Construis le plan détaillé d’un guide pratique sur [SUJET] organisé en 4 chapitres progressifs. Pour chaque chapitre, indique l’objectif pédagogique, 3 sous-sections et un exercice d’application.',
        },
        {
          title: 'Transformer un sommaire en fiche de valeur perçue',
          text: 'Voici le sommaire brut de mon futur produit : [PLAN]. Reformule chaque titre de module et de chapitre pour mettre en avant le résultat concret obtenu par l’acheteur.',
        },
        {
          title: 'Créer une checklist récapitulative de fin de chapitre',
          text: 'À partir du texte suivant [TEXTE DU CHAPITRE], extrais une liste de vérification actionnable en 6 points courts que le lecteur peut cocher étape par étape.',
        },
        {
          title: 'Concevoir 3 bonus complémentaires pertinents',
          text: 'Pour accompagner mon offre principale sur [SUJET], suggère 3 bonus rapides à consommer (modèle, tableau, fiche mémo) qui lèvent chacun une objection fréquente à l’achat.',
        },
        {
          title: 'Simplifier un concept technique pour des débutants',
          text: 'Réécris l’explication suivante [TEXTE TECHNIQUE] pour qu’elle soit immédiatement compréhensible par une personne sans prérequis technique, en utilisant une analogie concrète du quotidien.',
        },
        {
          title: 'Définir une grille tarifaire cohérente',
          text: 'Mon produit répond au problème suivant : [PROBLÈME] et permet d’économiser [TEMPS OU ARGENT]. Propose 3 paliers de prix possibles avec les arguments qui justifient chacun.',
        },
        {
          title: 'Rédiger une étude de cas structurée avant/après',
          text: 'Transforme ces notes brutes [NOTES] en une étude de cas claire de 250 mots suivant la structure : situation initiale, blocage rencontré, méthode appliquée et résultat concret obtenu.',
        },
        {
          title: 'Éliminer les redondances d’un brouillon existant',
          text: 'Analyse ce texte [BROUILLON] et signale les passages répétitifs, les paragraphes purement théoriques et les endroits où un exemple concret devrait remplacer une explication abstraite.',
        },
        {
          title: 'Créer un glossaire pratique de 10 termes essentiels',
          text: 'Identifie les 10 notions clés indispensables pour comprendre [SUJET] et rédige pour chacune une définition simple en deux phrases maximum.',
        },
        {
          title: 'Préparer une feuille de route sur 7 jours',
          text: 'Découpe l’application complète de ma méthode [MÉTHODE] en un plan d’action réaliste sur 7 jours, à raison de 30 minutes de travail par jour.',
        },
      ],
    },
    {
      name: 'Catégorie 3 : Rédiger une page de vente persuasive',
      prompts: [
        {
          title: 'Écrire 5 titres principaux orientés résultat',
          text: 'Propose 5 titres d’accroche pour la section haute de ma page de vente sur [PRODUIT]. Chaque titre doit capter l’attention en moins de 3 secondes en nommant le bénéfice principal.',
        },
        {
          title: 'Formuler le bloc constat et douleur actuelle',
          text: 'Rédige un paragraphe d’ouverture empathique décrivant la frustration quotidienne de [CIBLE] qui essaie de [OBJECTIF] sans méthode claire, sans tomber dans le mélodrame.',
        },
        {
          title: 'Présenter les bénéfices sous forme de puces claires',
          text: 'Transforme cette liste de fonctionnalités [LISTE] en 6 puces orientées bénéfices concrets commençant chacune par un verbe d’action.',
        },
        {
          title: 'Rédiger une section FAQ répondant aux 6 vraies objections',
          text: 'Identifie les 6 freins psychologiques principaux avant l’achat de [PRODUIT] (temps, niveau requis, budget, compatibilité) et rédige des réponses rassurantes, directes et honnêtes.',
        },
        {
          title: 'Créer un encadré comparatif avant / après',
          text: 'Rédige deux colonnes courtes opposant la méthode traditionnelle coûteuse en temps sur [SUJET] et l’approche guidée proposée dans mon produit.',
        },
        {
          title: 'Écrire une section « Pour qui / Pas pour qui »',
          text: 'Rédige deux listes de 4 points chacune pour qualifier les visiteurs sur ma page de vente : qui tirera un profit maximal de [PRODUIT] et qui devrait s’abstenir.',
        },
        {
          title: 'Mettre en valeur un tarif accessible sans dévaloriser l’offre',
          text: 'Rédige le paragraphe qui introduit le prix de [PRIX] pour mon produit [NOM], en le comparant rationnellement au coût de l’inaction ou d’une prestation individuelle.',
        },
        {
          title: 'Formuler 5 appels à l’action directs pour le bouton d’achat',
          text: 'Propose 5 textes courts (2 à 5 mots) pour les boutons de commande de ma page de vente, clairs et rassurants.',
        },
        {
          title: 'Rédiger une présentation crédible du créateur en 120 mots',
          text: 'À partir de mon parcours [PARCOURS], rédige une courte biographie centrée sur la légitimité pratique et les résultats obtenus, sans vantardise.',
        },
        {
          title: 'Relire et fluidifier une page de vente complète',
          text: 'Relis cette page de vente [TEXTE], repère les phrases trop longues, renforce la clarté des transitions et assure une tonalité professionnelle et chaleureuse.',
        },
      ],
    },
    {
      name: 'Catégorie 4 : Scripts vidéos courts et hooks organiques',
      prompts: [
        {
          title: 'Générer 10 accroches vidéo de moins de 10 mots',
          text: 'Écris 10 phrases d’accroche percutantes pour démarrer une vidéo verticale sur [SUJET]. Les phrases doivent provoquer une curiosité immédiate dès la première seconde.',
        },
        {
          title: 'Structurer un script court de 35 secondes',
          text: 'Rédige un script parlé naturel de 80 à 95 mots pour une vidéo courte sur [IDÉE], structuré en : accroche directe, contraste problème/solution, preuve concrète et appel à commenter un mot-clé.',
        },
        {
          title: 'Transformer un conseil écrit en scénario démonstratif',
          text: 'Voici un conseil tiré de mon produit : [CONSEIL]. Transforme-le en script vidéo en indiquant ce que le spectateur doit voir à l’écran à chaque phrase prononcée.',
        },
        {
          title: 'Créer une série de 5 vidéos sur les erreurs fréquentes',
          text: 'Propose 5 idées de vidéos courtes démontant chacune une idée reçue répandue dans la niche [NICHE], avec l’angle visuel associé.',
        },
        {
          title: 'Rédiger un appel à l’action commentaire DM naturel',
          text: 'Propose 5 fins de vidéos naturelles invitant le spectateur à commenter le mot-clé [MOT-CLÉ] pour recevoir le lien en message privé.',
        },
        {
          title: 'Adapter un script vidéo en carrousel LinkedIn ou Instagram',
          text: 'Découpe ce script vidéo [SCRIPT] en 7 diapositives courtes pour un carrousel : couverture choc, 5 slides pédagogiques aérées et dernière slide d’appel à l’action.',
        },
        {
          title: 'Rendre un script plus oral et humain',
          text: 'Réécris ce texte [TEXTE] pour qu’il sonne comme une explication orale spontanée face caméra ou en voix off, avec des phrases courtes et des respirations naturelles.',
        },
        {
          title: 'Trouver 5 angles coulisses et démonstration produit',
          text: 'Suggère 5 formats courts montrant l’intérieur de mon produit [NOM] en action sans donner l’impression de faire une publicité classique.',
        },
        {
          title: 'Rédiger une légende courte optimisée pour l’enregistrement',
          text: 'Écris une description courte (3 lignes maximum) accompagnant ma vidéo sur [SUJET] pour inciter les abonnés à enregistrer la publication et à commenter.',
        },
        {
          title: 'Analyser un hook faible et proposer 3 variantes fortes',
          text: 'Voici mon accroche actuelle : [ACCROCHE]. Explique pourquoi elle risque de perdre l’attention au démarrage et propose 3 alternatives plus directes.',
        },
      ],
    },
    {
      name: 'Catégorie 5 : Séquences d’emails de lancement et conversion',
      prompts: [
        {
          title: 'Rédiger l’email d’ouverture de lancement (Jour 1)',
          text: 'Écris un email clair et personnel annonçant l’ouverture de mon produit [NOM]. Mets l’accent sur le problème précis qu’il résout et termine par un lien unique vers la page de présentation.',
        },
        {
          title: 'Écrire un email pédagogique basé sur une erreur courante',
          text: 'Rédige un email de valeur racontant une erreur fréquente observée sur [SUJET], explique comment l’éviter en 3 étapes et fais le lien naturel vers mon offre.',
        },
        {
          title: 'Structurer un email étude de cas client',
          text: 'Transforme ce retour client [TÉMOIGNAGE] en email narratif montrant le chemin parcouru entre la difficulté initiale et le résultat obtenu grâce à la méthode.',
        },
        {
          title: 'Rédiger un email dédié aux questions fréquentes',
          text: 'Écris un email court répondant directement aux 3 questions les plus posées depuis le début du lancement de [PRODUIT], sur un ton transparent et posé.',
        },
        {
          title: 'Écrire l’email de dernier rappel avant fermeture',
          text: 'Rédige un email de rappel sobre pour les dernières heures de l’offre de lancement de [PRODUIT], en résumant l’essentiel de ce qui est inclus sans pression artificielle.',
        },
        {
          title: 'Trouver 10 objets d’emails à fort taux d’ouverture',
          text: 'Propose 10 objets d’emails courts (moins de 45 caractères) adaptés à ma campagne sur [SUJET], mêlant curiosité, clarté et bénéfice concret.',
        },
        {
          title: 'Rédiger un message de bienvenue après achat',
          text: 'Écris le message automatique envoyé juste après l’achat de [PRODUIT] : remerciement chaleureux, rappel de l’accès au fichier et conseil pour démarrer dès aujourd’hui.',
        },
        {
          title: 'Relancer les personnes ayant cliqué sans acheter',
          text: 'Rédige un email court adressé aux personnes qui ont visité la page de [PRODUIT] sans finaliser leur commande, en les invitant à répondre s’ils ont une question précise.',
        },
        {
          title: 'Demander un retour d’expérience 5 jours après achat',
          text: 'Écris un email bref envoyé cinq jours après la commande pour prendre des nouvelles de la progression du client et recueillir un avis honnête.',
        },
        {
          title: 'Synthétiser les enseignements d’une campagne email',
          text: 'Voici les statistiques de mes 5 emails de lancement [STATS]. Identifie les objets et appels à l’action les plus efficaces et propose 3 axes d’amélioration pour la prochaine campagne.',
        },
      ],
    },
  ];

  let promptIndex = 0;
  const sectionsHtml = categories
    .map((cat, catIdx) => {
      const cards = cat.prompts
        .map((pr) => {
          promptIndex += 1;
          return `
          <div class="prompt-card">
            <div class="prompt-header">
              <span class="prompt-num">Prompt #${promptIndex}</span>
              <span class="prompt-title">${escapeHtml(pr.title)}</span>
            </div>
            <div class="prompt-body">${escapeHtml(pr.text)}</div>
          </div>`;
        })
        .join('');

      return `
      <section class="category-section ${catIdx > 0 ? 'cat-break' : ''}">
        <h2>${escapeHtml(cat.name)}</h2>
        ${cards}
      </section>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Pack de 50 Prompts ChatGPT & Claude pour Créateurs de Contenu & Infopreneurs</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 15mm 15mm 15mm;
      @bottom-center {
        content: "Pack 50 Prompts • Page " counter(page) " sur " counter(pages);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13pt;
      line-height: 1.44;
      color: #0f172a;
      background: #ffffff;
    }
    .doc-banner {
      background: #f1f5f9;
      border: 1.5px solid #94a3b8;
      border-top: 5px solid #1e293b;
      padding: 5.5mm 6mm;
      margin-bottom: 5mm;
    }
    .doc-kicker {
      font-size: 9.5pt;
      font-weight: bold;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 2mm;
    }
    h1 {
      font-size: 20pt;
      line-height: 1.2;
      color: #0f172a;
      margin: 0 0 2.5mm 0;
    }
    .doc-sub {
      font-size: 12pt;
      color: #334155;
      margin: 0;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 5mm;
      font-size: 11.5pt;
    }
    .summary-table th, .summary-table td {
      border: 1px solid #94a3b8;
      padding: 2.5mm 3.5mm;
      text-align: left;
    }
    .summary-table th {
      background: #e2e8f0;
      color: #0f172a;
      font-weight: bold;
    }
    .cat-break {
      margin-top: 4mm;
    }
    h2 {
      font-size: 15pt;
      color: #0f172a;
      background: #f8fafc;
      border-left: 5px solid #334155;
      padding: 2.5mm 4mm;
      margin: 4mm 0 4mm 0;
      break-after: avoid;
    }
    .prompt-card {
      border: 1.5px solid #94a3b8;
      border-radius: 4px;
      margin-bottom: 4.5mm;
      background: #ffffff;
      break-inside: avoid;
    }
    .prompt-header {
      background: #f1f5f9;
      border-bottom: 1px solid #cbd5e1;
      padding: 2.5mm 3.5mm;
      display: flex;
      align-items: center;
      gap: 3mm;
    }
    .prompt-num {
      font-size: 10pt;
      font-weight: bold;
      background: #1e293b;
      color: #ffffff;
      padding: 1mm 2.5mm;
      border-radius: 2px;
      white-space: nowrap;
    }
    .prompt-title {
      font-weight: bold;
      font-size: 12.5pt;
      color: #0f172a;
    }
    .prompt-body {
      padding: 3.2mm 4mm;
      font-family: "Courier New", Courier, monospace;
      font-size: 11pt;
      line-height: 1.44;
      color: #1e293b;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div class="doc-banner">
    <div class="doc-kicker">Bibliothèque Statique Copier-Coller • 50 Modèles</div>
    <h1>Pack de 50 Prompts ChatGPT & Claude pour Créateurs de Contenu & Infopreneurs</h1>
    <p class="doc-sub">Recueil de requêtes prêtes à copier-coller pour trouver votre niche, structurer une offre, rédiger une page de vente, préparer des scripts vidéos et lancer vos campagnes email.</p>
  </div>

  <table class="summary-table">
    <thead>
      <tr>
        <th>Section</th>
        <th>Thématique couverte</th>
        <th>Plage de prompts</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>01</td><td>Niche & positionnement</td><td>Prompt #1 à Prompt #10</td></tr>
      <tr><td>02</td><td>Structure d’offre & pédagogie</td><td>Prompt #11 à Prompt #20</td></tr>
      <tr><td>03</td><td>Page de vente & objections</td><td>Prompt #21 à Prompt #30</td></tr>
      <tr><td>04</td><td>Scripts vidéos courts & hooks</td><td>Prompt #31 à Prompt #40</td></tr>
      <tr><td>05</td><td>Emails de lancement & conversion</td><td>Prompt #41 à Prompt #50</td></tr>
    </tbody>
  </table>

  ${sectionsHtml}
</body>
</html>`;
}

function renderPdf(chromeBin, htmlContent, outPath, tempDir, slug) {
  const htmlPath = path.join(tempDir, `${slug}.html`);
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
}

function main() {
  const chromeBin = findChromeEngine();
  fs.mkdirSync(outputDir, { recursive: true });
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-creator-demo-pdfs-'));

  try {
    renderPdf(chromeBin, buildEbookHtml(), EBOOK_PDF_PATH, tempDir, 'ebook');
    renderPdf(chromeBin, buildPromptsHtml(), PROMPTS_PDF_PATH, tempDir, 'prompts');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main();

import type { Day, ProfileVariableKey } from '../../types/course';

export interface DayBlueprint {
  dayNumber: number;
  sprintId: 'sprint-1' | 'sprint-2' | 'sprint-3' | 'sprint-4' | 'sprint-5';
  title: string;
  italicTitleWord: string;
  objective: string;
  deliverableSummary: string;
  deliverableTarget: 'claude-artifact' | 'html-app' | 'sales-copy' | 'automation-json';
  stepSubtitles: [string, string, string, string];
  focusVariable?: ProfileVariableKey;
  promptGoal: string;
}

export function buildDayFromBlueprint(bp: DayBlueprint): Day {
  const padded = String(bp.dayNumber).padStart(2, '0');
  const dayId = `day-${padded}`;

  return {
    id: dayId,
    dayNumber: bp.dayNumber,
    sprintId: bp.sprintId,
    title: bp.title,
    italicTitleWord: bp.italicTitleWord,
    objective: bp.objective,
    deliverableSummary: bp.deliverableSummary,
    isSkeletonPlaceholder: true,
    steps: [
      {
        id: `${dayId}-step-1`,
        type: 'concept',
        number: 1,
        title: 'Comprendre',
        subtitle: bp.stepSubtitles[0],
        completionLabel: `Valider l'étape 1 : Comprendre`,
        blocks: [
          {
            id: `${dayId}-concept-callout`,
            type: 'callout',
            variant: 'important',
            title: `Structure pédagogique : Leçon ${padded}`,
            content: `Ce module est structuré pour la thématique "${bp.title}". Les contenus éditoriaux s'injectent directement dans cette architecture sans modifier les composants React.`,
          },
          {
            id: `${dayId}-concept-prose`,
            type: 'prose',
            eyebrow: `LEÇON ${padded} : COMPRENDRE LES FONDATIONS`,
            title: bp.title,
            highlightPill: bp.objective,
            paragraphs: [
              `Objectif prioritaire : ${bp.objective}`,
              `Livrable du module : ${bp.deliverableSummary}`,
            ],
            bullets: [
              `Analysez le cadre stratégique de la Leçon ${padded}.`,
              'Vérifiez les variables de votre profil avant de générer le prompt Claude à l\'étape 2.',
              'Privilégiez des rendus portables et autonomes (Claude Artifacts ou applications HTML/CSS/JS monoblocs).',
            ],
          },
          {
            id: `${dayId}-concept-video`,
            type: 'video',
            title: `Briefing vidéo : Leçon ${padded}`,
            description: `Espace vidéo réservé pour la Leçon ${padded} : ${bp.title}.`,
            duration: '05:00',
            posterLabel: `LEÇON ${padded} : ${bp.title}`,
            keyTakeaways: [
              bp.objective,
              `Focus livrable : ${bp.deliverableSummary}`,
            ],
          },
          {
            id: `${dayId}-concept-quiz`,
            type: 'quiz',
            title: `Validation des acquis : Leçon ${padded}`,
            description: 'Vérification rapide avant de passer au générateur de Prompt Claude.',
            questions: [
              {
                id: `${dayId}-q1`,
                question: `Quel est l'objectif prioritaire de la Leçon ${padded} (${bp.title}) ?`,
                options: [
                  bp.deliverableSummary,
                  'Laisser le texte brut sans mise en forme',
                  'Configurer une base de données payante',
                ],
                correctIndex: 0,
                explanation: `La Leçon ${padded} consolide directement votre livrable : ${bp.deliverableSummary}`,
              },
            ],
          },
        ],
      },
      {
        id: `${dayId}-step-2`,
        type: 'prompt',
        number: 2,
        title: 'Prompt Claude',
        subtitle: bp.stepSubtitles[1],
        completionLabel: `Valider l'étape 2 : Prompt Claude`,
        blocks: [
          {
            id: `${dayId}-prompt-builder`,
            type: 'prompt-builder',
            title: `Générateur de Prompt Claude : Leçon ${padded}`,
            description: `Les variables enregistrées dans votre studio s'injectent automatiquement ci-dessous pour la Leçon ${padded}. Ajustez chaque champ pour personnaliser le résultat.`,
            deliverableTarget: bp.deliverableTarget,
            fields: [
              {
                key: 'business',
                label: 'Activité / Niche ({{business}})',
                placeholder: 'ex. Studio de création indépendant ou conseil spécialisé',
                profileBinding: 'business',
              },
              {
                key: 'targetAudience',
                label: 'Audience cible ({{targetAudience}})',
                placeholder: 'ex. Professionnels actifs en quête d\'un résultat concret',
                profileBinding: 'targetAudience',
              },
              {
                key: 'productType',
                label: 'Type de produit ({{productType}})',
                placeholder: 'ex. Starter Kit interactif',
                profileBinding: 'productType',
              },
              {
                key: 'brandStyle',
                label: 'Direction visuelle ({{brandStyle}})',
                placeholder: 'ex. Néo-Brutaliste Éditorial',
                profileBinding: 'brandStyle',
              },
              {
                key: 'mainObjective',
                label: 'Objectif principal ({{mainObjective}})',
                placeholder: 'ex. Publier une expérience interactive à fort impact',
                profileBinding: 'mainObjective',
              },
            ],
            template: `Tu es mon Architecte Produit Senior et Ingénieur Claude Artifacts pour la Leçon ${padded} (${bp.title}).

VARIABLES DE CONTEXTE :
- Activité / Niche : {{business}}
- Audience cible : {{targetAudience}}
- Format du produit digital : {{productType}}
- Direction visuelle et style : {{brandStyle}}
- Objectif principal : {{mainObjective}}

OBJECTIF DE LA LEÇON ${padded} :
${bp.promptGoal}

FORMAT DU LIVRABLE ATTENDU :
Génère un livrable structuré et immédiatement exploitable (${bp.deliverableSummary}) en respectant scrupuleusement l'esthétique {{brandStyle}}.`,
          },
          {
            id: `${dayId}-prompt-tip`,
            type: 'callout',
            variant: 'tip',
            title: 'Conseil d\'itération avec Claude',
            content:
              'Après avoir collé le prompt compilé dans Claude, demandez-lui d\'évaluer la clarté et le contraste visuel de son rendu avant de finaliser.',
          },
        ],
      },
      {
        id: `${dayId}-step-3`,
        type: 'example',
        number: 3,
        title: 'Exemple guidé',
        subtitle: bp.stepSubtitles[2],
        completionLabel: `Valider l'étape 3 : Exemple guidé`,
        blocks: [
          {
            id: `${dayId}-example-prose`,
            type: 'prose',
            eyebrow: `LEÇON ${padded} : EXEMPLE GUIDÉ`,
            title: 'Structure de référence et anatomie du livrable',
            italicAccent: 'Modèle',
            paragraphs: [
              `Voici la structure de référence type pour la Leçon ${padded} (${bp.title}). Elle illustre la disposition et la hiérarchie attendues pour votre livrable.`,
            ],
          },
          {
            id: `${dayId}-example-copy`,
            type: 'copy',
            title: `Extrait type : Leçon ${padded}`,
            label: `LECON-${padded}-MODELE.TXT`,
            content: `// LEÇON ${padded} : ${bp.title}
// Module : ${bp.sprintId.toUpperCase()}
// Livrable : ${bp.deliverableSummary}
// Objectif : ${bp.objective}

[STRUCTURE DE RÉFÉRENCE]
1. Accroche percutante alignée avec {{targetAudience}}
2. Spécification du module interactif ou composant
3. Étape de vérification concrète`,
            notes: 'Copiez ce schéma structurel si vous souhaitez soumettre un cadre rigoureux à Claude.',
          },
          {
            id: `${dayId}-example-resources`,
            type: 'resource',
            title: `Ressources associées : Leçon ${padded}`,
            description: 'Modèles de référence et fiches pratiques téléchargeables pour cette leçon.',
            resources: [
              {
                id: `${dayId}-res-1`,
                title: `Fiche de spécification : Leçon ${padded}`,
                category: 'template',
                description: `Cahier des charges structuré en Markdown pour ${bp.deliverableSummary}.`,
                format: 'MD / TXT',
                downloadFilename: `lecon-${padded}-spec.md`,
                downloadContent: `# Leçon ${padded} : ${bp.title}\n\n## Objectif\n${bp.objective}\n\n## Livrable\n${bp.deliverableSummary}\n`,
              },
            ],
          },
        ],
      },
      {
        id: `${dayId}-step-4`,
        type: 'your-turn',
        number: 4,
        title: 'À vous de jouer',
        subtitle: bp.stepSubtitles[3],
        completionLabel: `Valider le livrable de la Leçon ${padded}`,
        blocks: [
          {
            id: `${dayId}-your-turn-exercise`,
            type: 'text-exercise',
            title: `Espace de travail pratique : Leçon ${padded}`,
            instructions: `Consignez ci-dessous vos notes de travail, le résumé de votre Claude Artifact ou vos décisions clés pour "${bp.deliverableSummary}". Vos données sont enregistrées automatiquement.`,
            placeholder: `Saisissez vos notes de livrable pour la Leçon ${padded} ou collez la structure générée ici...`,
            maxLength: 2000,
            profileBinding: bp.focusVariable,
          },
          {
            id: `${dayId}-your-turn-checklist`,
            type: 'checklist',
            title: `Vérification de fin de leçon : Leçon ${padded}`,
            description: 'Cochez chaque critère avant de valider définitivement la leçon.',
            items: [
              {
                id: `${dayId}-chk-1`,
                label: `Compréhension du concept et de l'objectif de la Leçon ${padded}`,
              },
              {
                id: `${dayId}-chk-2`,
                label: 'Génération et personnalisation du livrable avec le générateur de prompt',
              },
              {
                id: `${dayId}-chk-3`,
                label: `Enregistrement des notes de livrable pour : ${bp.deliverableSummary}`,
              },
            ],
          },
        ],
      },
    ],
  };
}

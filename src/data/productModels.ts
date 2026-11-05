/**
 * Modèles de produits interactifs de départ pour l'apprenant.
 * 4 modèles structurés + 1 modèle libre sur-mesure.
 */

export interface ProductModelBrief {
  title: string;
  promise: string;
  userInputs: string;
  userOutputs: string;
}

export interface ProductModel {
  id: string;
  name: string;
  shortDescription: string;
  forDocument: string;
  defaultFeatures: string[];
  prefilledBrief: ProductModelBrief;
  promptFragment: string;
}

export const PRODUCT_MODELS: readonly ProductModel[] = [
  {
    id: 'interactive-calculator',
    name: 'Calculateur interactif',
    shortDescription: 'Transforme des règles chiffrées ou une grille tarifaire en outil d’estimation instantané.',
    forDocument: 'Tableau Excel, grille de chiffrage, méthode financière, barème de devis ou règles de calcul logique.',
    defaultFeatures: [
      'Champs de saisie réactifs (curseurs et entrées numériques)',
      'Calcul instantané côté client sans latence ni rechargement',
      'Tableau de bord de 3 KPIs clés avec jauges de progression',
      'Règles d’alertes et seuils personnalisés selon les résultats',
    ],
    prefilledBrief: {
      title: 'Simulateur interactif de rentabilité et dimensionnement',
      promise: 'Permettre à votre utilisateur de calculer son résultat instantanément en saisissant ses variables clés.',
      userInputs: 'Tarif journalier ou forfait, volume mensuel estimé, charges récurrentes, objectif de marge nette.',
      userOutputs: 'Bénéfice mensuel estimé, seuil de rentabilité en jours de travail, taux horaire réel calculé.',
    },
    promptFragment:
      '[FRAGMENT PROVISOIRE - MISSION C / TEST CLAUDE] : Construis une application React autonome de type Calculateur Interactif. Implémente une interface réactive avec curseurs de réglage et entrées numériques, une logique de calcul instantanée et sans rechargement, un bloc de résultats mettant en valeur 3 KPIs critiques avec jauges de performance, et des alertes contextuelles selon les seuils saisis.',
  },
  {
    id: 'journey-hub',
    name: 'Hub de parcours',
    shortDescription: 'Organise une formation ou une méthode pas-à-pas en étapes progressives avec suivi d’avancement.',
    forDocument: 'Syllabus de formation, programme d’onboarding, méthode pas-à-pas, feuille de route opérationnelle.',
    defaultFeatures: [
      'Arborescence modulaire avec jalons séquentiels',
      'Suivi d’avancement visuel et déblocage progressif des étapes',
      'Fiches récapitulatives avec livrables et actions prioritaires',
      'Checklist interactive mémorisée localement sur l’appareil',
    ],
    prefilledBrief: {
      title: 'Hub de parcours et feuille de route guidée',
      promise: 'Guider l’utilisateur pas à pas dans l’exécution ordonnée d’une méthode complète avec validation d’étapes.',
      userInputs: 'Sélection du module en cours, validation des jalons accomplis, notes personnelles par étape.',
      userOutputs: 'Pourcentage d’avancement global, jalon suivant recommandé, attestation de fin de parcours.',
    },
    promptFragment:
      '[FRAGMENT PROVISOIRE - MISSION C / TEST CLAUDE] : Construis une application React autonome de type Hub de Parcours. Conçois une arborescence de jalons avec états d’accomplissement (à faire, en cours, validé), une barre de navigation par modules, des panneaux de contenu structurés par étape avec checklists de validation, et une persistance locale de l’état d’avancement.',
  },
  {
    id: 'daily-guide',
    name: 'Guide quotidien',
    shortDescription: 'Découpe un plan d’action en micro-actions journalières courtes avec suivi de régularité.',
    forDocument: 'Défi 30 jours, plan d’action quotidien, rituel d’exercices, routine opérationnelle, carnet de bord.',
    defaultFeatures: [
      'Sélecteur de timeline (J1 à J7 ou J30) avec indicateur du jour actif',
      'Fiche de mission du jour avec consigne concrète de 15 minutes',
      'Champ de réflexion et journal de bord personnel',
      'Compteur de régularité (streak de jours consécutifs validés)',
    ],
    prefilledBrief: {
      title: 'Guide d’action quotidien et carnet de bord',
      promise: 'Fournir chaque matin une action ciblée en moins de 15 minutes et maintenir la constance d’exécution.',
      userInputs: 'Date ou jour actif sélectionné, validation de la tâche du jour, saisie d’une note courte.',
      userOutputs: 'Série en cours (streak de jours consécutifs), taux d’assiduité, historique des réflexions enregistrées.',
    },
    promptFragment:
      '[FRAGMENT PROVISOIRE - MISSION C / TEST CLAUDE] : Construis une application React autonome de type Guide Quotidien (Daily Guide). Intègre un sélecteur de timeline avec navigation entre les journées, une carte de mission quotidienne épurée avec minuteur ou checklist d’action rapide, un champ de journal de bord personnel et un indicateur de régularité (streak).',
  },
  {
    id: 'interactive-brand-page',
    name: 'Page de marque interactive',
    shortDescription: 'Met en scène son univers professionnel et oriente le visiteur vers l’offre adaptée en 2 clics.',
    forDocument: 'Catalogue de services, charte de marque, portfolio, manifesto, offre d’accompagnement sur-mesure.',
    defaultFeatures: [
      'Hero immersif avec promesse client claire',
      'Configurateur de profil ou de besoin en 2 questions interactives',
      'Vitrine dynamique affichant la solution recommandée',
      'Bouton d’action direct qualifié selon le profil visiteur',
    ],
    prefilledBrief: {
      title: 'Page de marque interactive et configurateur d’offre',
      promise: 'Qualifier instantanément le visiteur et l’orienter vers la solution exactement calibrée pour sa situation.',
      userInputs: 'Sélection du profil visiteur (solo, PME, particulier), choix de l’urgence ou de l’objectif numéro 1.',
      userOutputs: 'Synthèse personnalisée de la solution recommandée, proposition d’accompagnement et contact qualifié.',
    },
    promptFragment:
      '[FRAGMENT PROVISOIRE - MISSION C / TEST CLAUDE] : Construis une Page de Marque Interactive haut de gamme en React. Conçois une section hero percutante, un sélecteur de persona ou de besoin guidant l’utilisateur en temps réel vers le module recommandé, des cartes de propositions de valeur interactives et un bouton de passage à l’action contextuel.',
  },
  {
    id: 'custom-architecture',
    name: 'Choix libre (architecture personnalisée)',
    shortDescription: 'Concevez une architecture sur-mesure combinant plusieurs mécanismes interactifs adaptés à votre document.',
    forDocument: 'Document hybride, méthode complexe ou concept propriétaire ne rentrant pas dans les 4 formats classiques.',
    defaultFeatures: [
      'Architecture sur-mesure définie par l’apprenant',
      'Combinaison libre de composants interactifs',
      'Workflow adapté à votre matière de départ',
      'Zéro contrainte de format imposé',
    ],
    prefilledBrief: {
      title: 'Outil interactif sur-mesure',
      promise: 'Résoudre un problème spécifique grâce à une architecture adaptée sur-mesure à votre matière.',
      userInputs: 'Paramètres personnalisés définis dans votre brief fonctionnel.',
      userOutputs: 'Résultats, recommandations ou livrables sur-mesure adaptés à votre cas d’usage.',
    },
    promptFragment:
      '[FRAGMENT PROVISOIRE - MISSION C / TEST CLAUDE] : Construis une application interactive sur-mesure répondant fidèlement aux exigences spécifiques formulées dans le brief fonctionnel de l’apprenant. Veille à une architecture claire, modulaire et hautement utilisable.',
  },
] as const;

export function getProductModelById(id: string): ProductModel | undefined {
  return PRODUCT_MODELS.find((m) => m.id === id);
}

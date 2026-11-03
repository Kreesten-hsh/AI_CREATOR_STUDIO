import type { BonusItem } from '../../types/navigation';

export const BONUSES: BonusItem[] = [
  {
    id: 'bonus-01',
    orderNumber: 'Bonus 01',
    title: 'VIDÉOS SANS VISAGE',
    subtitle: 'Création de vidéos d\'autorité sans montrer votre visage',
    duration: '45 min de pratique',
    deliverable: 'Système complet de scripts & formats courts viraux',
    description:
      'Générez des scripts percutants avec Claude, associez-les à des visuels b-roll premium et automatisez la production de Reels et TikToks éducatifs à haute valeur perçue.',
    keyTopics: [
      'Structure des accroches de 3 secondes qui retiennent l\'attention',
      'Prompt Claude pour formater des scripts minute par minute',
      'Sources de b-roll cinématiques et banques de textures gratuites',
      'Sous-titrage dynamique et habillage audio sans outils complexes',
    ],
  },
  {
    id: 'bonus-02',
    orderNumber: 'Bonus 02',
    title: 'AUTOMATISATIONS COMMERCIALES',
    subtitle: 'ManyChat, n8n et livraison instantanée des accès',
    duration: '60 min d\'implémentation',
    deliverable: 'Tunnel automatisé DM vers lien de produit interactif',
    description:
      'Connectez vos réseaux sociaux à votre outil interactif : déclenchez la livraison automatique en message privé dès qu\'un utilisateur commente un mot-clé précis.',
    keyTopics: [
      'Configuration d\'un mot-clé déclencheur ManyChat sur Instagram',
      'Webhook n8n ou Zapier pour enregistrer le lead dans votre base',
      'Envoi d\'un lien magique personnalisé vers le Hub interactif',
      'Séquence de relance douce à J+2 pour inciter à la pratique',
    ],
  },
  {
    id: 'bonus-03',
    orderNumber: 'Bonus 03',
    title: 'BIBLIOTHÈQUE MARKETING',
    subtitle: 'Prompts de vente, templates d\'accroches & emails de lancement',
    duration: 'Prêt à l\'emploi',
    deliverable: 'Pack de 25 prompts d\'acquisition & conversion',
    description:
      'Toutes les formules d\'écriture nécessaires pour vendre votre produit digital : angles d\'attaque psychologiques, preuves de concept et argumentaires sans agressivité commerciale.',
    keyTopics: [
      'Générateur de promesse irrésistible en 3 lignes',
      'Structure de page de vente en 6 sections néo-brutalistes',
      'Séquence de 3 emails d\'annonce à votre liste',
      'Réponses toutes faites aux objections fréquentes sur le digital',
    ],
  },
];

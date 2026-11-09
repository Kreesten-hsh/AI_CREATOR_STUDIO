import type { BonusItem } from '../../types/navigation';
import { BONUS_MANYCHAT_LESSONS, BONUS_MANYCHAT_META } from '../bonuses/bonus-manychat';
import { BONUS_MARKETING_DATA } from '../bonuses/bonus-marketing';

export const BONUSES: BonusItem[] = [
  {
    id: 'bonus-manychat',
    orderNumber: 'Bonus 01',
    title: 'LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE',
    subtitle: BONUS_MANYCHAT_META.subtitle,
    duration: BONUS_MANYCHAT_META.duration,
    deliverable: '',
    description: BONUS_MANYCHAT_META.description,
    keyTopics: BONUS_MANYCHAT_META.keyTopics,
    blocks: [],
    lessons: BONUS_MANYCHAT_LESSONS,
  },
  {
    id: 'bonus-marketing',
    orderNumber: 'Bonus 02',
    title: BONUS_MARKETING_DATA.header.title,
    subtitle: BONUS_MARKETING_DATA.header.subtitle,
    duration: '9 Skills + 1 Prompt',
    deliverable: '9 Skills originaux en téléchargement direct + prompt de recherche concurrentielle',
    description: BONUS_MARKETING_DATA.header.description,
    keyTopics: [
      'Psychologie d’achat',
      'Stratégie de prix',
      'Copywriting anti-slop',
      'Optimisation de profils',
      'Engagement & DM',
    ],
    blocks: [],
  },
];

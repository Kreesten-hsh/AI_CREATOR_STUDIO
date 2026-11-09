import type { BonusItem } from '../../types/navigation';
import { BONUS_MANYCHAT_LESSONS, BONUS_MANYCHAT_META } from '../bonuses/bonus-manychat';

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
    title: 'MARKETING LIBRARY',
    subtitle: '',
    duration: '',
    deliverable: '',
    description: '',
    keyTopics: [],
    blocks: [],
  },
];


/**
 * Badge Definitions
 * 
 * Defines all available badges and their requirements.
 */

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: '🌟 Top Donor',
    name: 'Top Donor',
    description: 'Awarded after completing 10 successful donations',
    emoji: '🌟',
    requirement: 'Complete 10 donations',
  },
  {
    id: '🎁 Monthly Hero',
    name: 'Monthly Hero',
    description: 'Awarded for making a donation in the current month',
    emoji: '🎁',
    requirement: 'Make a donation this month',
  },
  {
    id: '🤝 Community Helper',
    name: 'Community Helper',
    description: 'Awarded after helping 5 unique receivers',
    emoji: '🤝',
    requirement: 'Help 5 unique receivers',
  },
];


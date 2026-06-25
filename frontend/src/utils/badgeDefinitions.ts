<<<<<<< HEAD
=======
/**
 * Badge Definitions
 * 
 * Defines all available badges and their requirements.
 */

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
<<<<<<< HEAD
  { id: '🚀 First Step',        name: 'First Step',        emoji: '🚀', description: 'Completed your very first donation',             requirement: 'Complete 1 donation' },
  { id: '🎁 Monthly Hero',      name: 'Monthly Hero',      emoji: '🎁', description: 'Made a donation in the current month',           requirement: 'Donate this month' },
  { id: '🤝 Community Helper',  name: 'Community Helper',  emoji: '🤝', description: 'Helped 5 unique receivers',                      requirement: 'Help 5 unique receivers' },
  { id: '🌟 Top Donor',         name: 'Top Donor',         emoji: '🌟', description: 'Completed 10 successful donations',              requirement: 'Complete 10 donations' },
  { id: '🩸 Blood Guardian',    name: 'Blood Guardian',    emoji: '🩸', description: 'Donated blood at least once',                    requirement: 'Complete 1 blood donation' },
  { id: '🔥 Streak Master',     name: 'Streak Master',     emoji: '🔥', description: 'Donated in 3 consecutive months',                requirement: 'Donate 3 months in a row' },
  { id: '🏆 Verified Champion', name: 'Verified Champion', emoji: '🏆', description: 'Completed 5 verified donations',                 requirement: 'Complete 5 verified donations' },
  { id: '🌍 City Hero',         name: 'City Hero',         emoji: '🌍', description: 'Helped receivers across 3 different locations',  requirement: 'Help 3 receivers in different locations' },
];
=======
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

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c

/**
 * Badge Service
 * 
 * Handles badge assignment and point calculation logic.
 */

import User from '../models/User.model';
import Donation from '../models/Donation.model';
import Match from '../models/Match.model';
import { Op } from 'sequelize';

export type BadgeType = '🌟 Top Donor' | '🎁 Monthly Hero' | '🤝 Community Helper';

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  emoji: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: '🌟 Top Donor',
    name: 'Top Donor',
    description: 'Awarded after completing 10 successful donations',
    emoji: '🌟',
  },
  {
    id: '🎁 Monthly Hero',
    name: 'Monthly Hero',
    description: 'Awarded for making a donation in the current month',
    emoji: '🎁',
  },
  {
    id: '🤝 Community Helper',
    name: 'Community Helper',
    description: 'Awarded after helping 5 unique receivers',
    emoji: '🤝',
  },
];

/**
 * Calculate points for a completed donation
 */
export const calculateDonationPoints = (donation: Donation): number => {
  let points = 10; // Base points for completing a donation
  
  // Bonus points based on category
  const categoryPoints: Record<string, number> = {
    'Money': 15,
    'Food': 10,
    'Clothes': 8,
    'Blood': 20,
    'Other': 10,
  };
  
  points += categoryPoints[donation.category] || 10;
  
  // Bonus for verified donations
  if (donation.isVerified) {
    points += 5;
  }
  
  return points;
};

/**
 * Check and award "🌟 Top Donor" badge (10 completed donations)
 */
const checkTopDonorBadge = async (userId: number): Promise<BadgeType | null> => {
  const completedCount = await Donation.count({
    where: {
      donorId: userId,
      status: 'Completed',
    },
  });
  
  if (completedCount >= 10) {
    return '🌟 Top Donor';
  }
  return null;
};

/**
 * Check and award "🎁 Monthly Hero" badge (donation in current month)
 */
const checkMonthlyHeroBadge = async (userId: number): Promise<BadgeType | null> => {
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  
  const hasDonationThisMonth = await Donation.count({
    where: {
      donorId: userId,
      createdAt: {
        [Op.gte]: thisMonthStart,
      },
    },
  }) > 0;
  
  if (hasDonationThisMonth) {
    return '🎁 Monthly Hero';
  }
  return null;
};

/**
 * Check and award "🤝 Community Helper" badge (5 unique receivers)
 */
const checkCommunityHelperBadge = async (userId: number): Promise<BadgeType | null> => {
  const matches = await Match.findAll({
    where: {
      donorId: userId,
      status: 'Confirmed',
    },
    attributes: ['receiverId'],
    raw: true,
  });
  
  const uniqueReceivers = new Set(matches.map((m: any) => m.receiverId)).size;
  
  if (uniqueReceivers >= 5) {
    return '🤝 Community Helper';
  }
  return null;
};

/**
 * Check all badges and award new ones
 * Returns array of newly awarded badges
 */
export const checkAndAwardBadges = async (userId: number): Promise<BadgeType[]> => {
  const user = await User.findByPk(userId);
  if (!user) {
    return [];
  }
  
  const currentBadges = (user.badges || []) as BadgeType[];
  const newBadges: BadgeType[] = [];
  
  // Check each badge type
  const badgeChecks = [
    checkTopDonorBadge(userId),
    checkMonthlyHeroBadge(userId),
    checkCommunityHelperBadge(userId),
  ];
  
  const badgeResults = await Promise.all(badgeChecks);
  
  for (const badge of badgeResults) {
    if (badge && !currentBadges.includes(badge)) {
      newBadges.push(badge);
      currentBadges.push(badge);
    }
  }
  
  // Update user badges if new ones were awarded
  if (newBadges.length > 0) {
    user.badges = currentBadges;
    await user.save();
  }
  
  return newBadges;
};

/**
 * Update user points and badges when a donation is completed
 */
export const onDonationCompleted = async (donation: Donation): Promise<void> => {
  const user = await User.findByPk(donation.donorId);
  if (!user) {
    return;
  }
  
  // Calculate and add points
  const pointsEarned = calculateDonationPoints(donation);
  user.points = (user.points || 0) + pointsEarned;
  
  // Check and award badges
  const newBadges = await checkAndAwardBadges(donation.donorId);
  
  await user.save();
  
  // Log badge awards
  if (newBadges.length > 0) {
    console.log(`[Badges] User ${user.id} (${user.name}) earned badges: ${newBadges.join(', ')}`);
  }
  
  console.log(`[Points] User ${user.id} (${user.name}) earned ${pointsEarned} points (Total: ${user.points})`);
};


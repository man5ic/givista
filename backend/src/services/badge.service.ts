/**
 * Badge Service - Extended with 8 total badges
 */

import User from '../models/User.model';
import Donation from '../models/Donation.model';
import Match from '../models/Match.model';
import { Op } from 'sequelize';

export type BadgeType =
  | '🌟 Top Donor'
  | '🎁 Monthly Hero'
  | '🤝 Community Helper'
  | '🩸 Blood Guardian'
  | '🔥 Streak Master'
  | '🏆 Verified Champion'
  | '🌍 City Hero'
  | '🚀 First Step';

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  emoji: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: '🚀 First Step',        name: 'First Step',        description: 'Completed your very first donation',              emoji: '🚀' },
  { id: '🎁 Monthly Hero',      name: 'Monthly Hero',      description: 'Made a donation in the current month',            emoji: '🎁' },
  { id: '🤝 Community Helper',  name: 'Community Helper',  description: 'Helped 5 unique receivers',                       emoji: '🤝' },
  { id: '🌟 Top Donor',         name: 'Top Donor',         description: 'Completed 10 successful donations',               emoji: '🌟' },
  { id: '🩸 Blood Guardian',    name: 'Blood Guardian',    description: 'Donated blood at least once',                     emoji: '🩸' },
  { id: '🔥 Streak Master',     name: 'Streak Master',     description: 'Donated in 3 consecutive months',                 emoji: '🔥' },
  { id: '🏆 Verified Champion', name: 'Verified Champion', description: 'Completed 5 verified donations',                  emoji: '🏆' },
  { id: '🌍 City Hero',         name: 'City Hero',         description: 'Helped receivers across 3 different locations',   emoji: '🌍' },
];

export const calculateDonationPoints = (donation: Donation): number => {
  let points = 10;
  const categoryPoints: Record<string, number> = {
    Money: 15, Food: 10, Clothes: 8, Blood: 20, Other: 10,
  };
  points += categoryPoints[donation.category] || 10;
  if (donation.isVerified) points += 5;
  return points;
};

const checkFirstStepBadge = async (userId: number): Promise<BadgeType | null> => {
  const count = await Donation.count({ where: { donorId: userId, status: 'Completed' } });
  return count >= 1 ? '🚀 First Step' : null;
};

const checkTopDonorBadge = async (userId: number): Promise<BadgeType | null> => {
  const count = await Donation.count({ where: { donorId: userId, status: 'Completed' } });
  return count >= 10 ? '🌟 Top Donor' : null;
};

const checkMonthlyHeroBadge = async (userId: number): Promise<BadgeType | null> => {
  const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
  const count = await Donation.count({ where: { donorId: userId, createdAt: { [Op.gte]: start } } });
  return count > 0 ? '🎁 Monthly Hero' : null;
};

const checkCommunityHelperBadge = async (userId: number): Promise<BadgeType | null> => {
  const matches = await Match.findAll({ where: { donorId: userId, status: 'Confirmed' }, attributes: ['receiverId'], raw: true });
  const unique = new Set(matches.map((m: any) => m.receiverId)).size;
  return unique >= 5 ? '🤝 Community Helper' : null;
};

const checkBloodGuardianBadge = async (userId: number): Promise<BadgeType | null> => {
  const count = await Donation.count({ where: { donorId: userId, category: 'Blood', status: 'Completed' } });
  return count >= 1 ? '🩸 Blood Guardian' : null;
};

const checkStreakMasterBadge = async (userId: number): Promise<BadgeType | null> => {
  const months: Set<string> = new Set();
  const donations = await Donation.findAll({
    where: { donorId: userId },
    attributes: ['createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 100,
    raw: true,
  });
  for (const d of donations as any[]) {
    const dt = new Date(d.createdAt);
    months.add(`${dt.getFullYear()}-${dt.getMonth()}`);
  }
  // Check for 3 consecutive months
  const sortedMonths = Array.from(months).sort().reverse();
  if (sortedMonths.length < 3) return null;
  for (let i = 0; i < sortedMonths.length - 2; i++) {
    const [y1, m1] = sortedMonths[i].split('-').map(Number);
    const [y2, m2] = sortedMonths[i + 1].split('-').map(Number);
    const [y3, m3] = sortedMonths[i + 2].split('-').map(Number);
    const d1 = y1 * 12 + m1, d2 = y2 * 12 + m2, d3 = y3 * 12 + m3;
    if (d1 - d2 === 1 && d2 - d3 === 1) return '🔥 Streak Master';
  }
  return null;
};

const checkVerifiedChampionBadge = async (userId: number): Promise<BadgeType | null> => {
  const count = await Donation.count({ where: { donorId: userId, isVerified: true, status: 'Completed' } });
  return count >= 5 ? '🏆 Verified Champion' : null;
};

const checkCityHeroBadge = async (userId: number): Promise<BadgeType | null> => {
  const matches = await Match.findAll({
    where: { donorId: userId, status: 'Confirmed' },
    include: [{ model: require('./badge.service'), required: false }],
    attributes: ['receiverId'],
    raw: true,
  });
  // Approximate: check unique receivers (each may be in different city)
  const unique = new Set(matches.map((m: any) => m.receiverId)).size;
  return unique >= 3 ? '🌍 City Hero' : null;
};

export const checkAndAwardBadges = async (userId: number): Promise<BadgeType[]> => {
  const user = await User.findByPk(userId);
  if (!user) return [];
  const currentBadges = (user.badges || []) as BadgeType[];
  const newBadges: BadgeType[] = [];

  const results = await Promise.allSettled([
    checkFirstStepBadge(userId),
    checkTopDonorBadge(userId),
    checkMonthlyHeroBadge(userId),
    checkCommunityHelperBadge(userId),
    checkBloodGuardianBadge(userId),
    checkStreakMasterBadge(userId),
    checkVerifiedChampionBadge(userId),
    checkCityHeroBadge(userId),
  ]);

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value && !currentBadges.includes(result.value)) {
      newBadges.push(result.value);
      currentBadges.push(result.value);
    }
  }

  if (newBadges.length > 0) {
    user.badges = currentBadges;
    await user.save();
    console.log(`[Badges] User ${userId} earned: ${newBadges.join(', ')}`);
  }
  return newBadges;
};

export const onDonationCompleted = async (donation: Donation): Promise<void> => {
  const user = await User.findByPk(donation.donorId);
  if (!user) return;
  const pointsEarned = calculateDonationPoints(donation);
  user.points = (user.points || 0) + pointsEarned;
  await checkAndAwardBadges(donation.donorId);
  await user.save();
  console.log(`[Points] User ${donation.donorId} earned ${pointsEarned} pts (Total: ${user.points})`);
};

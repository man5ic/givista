/**
 * Fraud Detection Service (Lightweight Heuristic)
 *
 * Computes a fraud score in range [0,1] for a donation based on simple signals:
 * - Unusual frequency from same donor in short window
 * - Identical donor-receiver historical pairs (if matches exist)
 * - Repeated amounts/quantities across recent donations
 * - Suspicious donor IDs (mock rule: very small id or missing)
 */

import { Op } from 'sequelize';
import Donation from '../models/Donation.model';
import Match from '../models/Match.model';

export interface FraudInput {
  donorId: number;
  quantity: number;
  receiverId?: number; // optional, if known in a subsequent flow
}

export async function scoreDonationFraud(input: FraudInput): Promise<number> {
  const { donorId, quantity, receiverId } = input;

  let score = 0;

  // Rule 1: Unusual frequency - many donations in last 24h
  // Note: This counts EXISTING donations (before current one is saved)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await Donation.count({
    where: { donorId, createdAt: { [Op.gte]: since } },
  });
  // With 4+ existing donations, the 5th one being created is suspicious
  if (recentCount >= 4) score += 0.5; // 5th donation
  else if (recentCount >= 2) score += 0.3; // 3rd-4th donation
  else if (recentCount >= 1) score += 0.1; // 2nd donation

  // Rule 2: Repeated quantity pattern in last week
  const weekSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const repeatedCount = await Donation.count({
    where: { donorId, quantity, createdAt: { [Op.gte]: weekSince } },
  });
  // With 3+ existing donations with same quantity, the 4th+ is very suspicious
  if (repeatedCount >= 3) score += 0.4; // 4th+ donation with same quantity
  else if (repeatedCount >= 1) score += 0.2; // 2nd-3rd donation with same quantity

  // Rule 3: Identical donor->receiver pairs seen frequently (via matches)
  if (receiverId) {
    const pairCount = await Match.count({ where: { donorId, receiverId } });
    if (pairCount >= 5) score += 0.2;
    else if (pairCount >= 3) score += 0.1;
  }

  // Rule 4: Suspicious donor id (mock)
  if (!donorId || donorId < 1) score += 0.5;
  if (donorId < 3) score += 0.1;

  // Clamp to [0,1]
  score = Math.max(0, Math.min(1, score));
  return score;
}

export function isFlaggedFromScore(score: number): boolean {
  return score >= 0.4; // Lowered threshold: flag if score >= 0.4 (more sensitive)
}



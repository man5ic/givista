/**
 * Request Expiry Service
 * Auto-expires requests older than EXPIRY_DAYS days
 * Run this on a schedule (e.g. daily cron)
 */
import { Op } from 'sequelize';
import Request from '../models/Request.model';

const EXPIRY_DAYS = parseInt(process.env.REQUEST_EXPIRY_DAYS || '30');

export const expireOldRequests = async (): Promise<number> => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - EXPIRY_DAYS);

  const [count] = await Request.update(
    { status: 'Expired' },
    {
      where: {
        status: 'Open',
        createdAt: { [Op.lt]: cutoff },
      },
    }
  );

  if (count > 0) {
    console.log(`[Expiry] Expired ${count} old requests (older than ${EXPIRY_DAYS} days)`);
  }
  return count;
};

export const startExpiryScheduler = () => {
  // Run immediately on startup, then every 24 hours
  expireOldRequests();
  setInterval(expireOldRequests, 24 * 60 * 60 * 1000);
  console.log(`[Expiry] Scheduler started — requests expire after ${EXPIRY_DAYS} days`);
};

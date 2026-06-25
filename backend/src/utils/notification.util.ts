/**
 * Notification Utilities
 * 
 * Helper functions for sending notifications (email/SMS).
 * Currently uses mock implementations with hooks for production integration.
 */

/**
 * Send donation verification notification to donor
 * 
 * @param email - Donor's email address
 * @param donorName - Donor's name
 * @param donationTitle - Title of the donation
 * @param status - 'approved' or 'rejected'
 * @param remarks - Optional remarks from verifier
 */
export const sendDonationVerificationNotification = async (
  email: string,
  donorName: string,
  donationTitle: string,
  status: 'approved' | 'rejected',
  remarks?: string | null
): Promise<void> => {
  // Mock implementation - in production, use actual email service
  const statusText = status === 'approved' ? 'APPROVED ✅' : 'REJECTED ❌';
  const remarksText = remarks ? `\nRemarks: ${remarks}` : '';
  
  console.log(`\n📧 DONATION VERIFICATION NOTIFICATION`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`To: ${email}`);
  console.log(`Subject: Your donation "${donationTitle}" has been ${statusText}`);
  console.log(`\nHello ${donorName},`);
  console.log(`Your donation "${donationTitle}" has been ${statusText}`);
  console.log(`${remarksText}`);
  console.log(`\nThank you for your contribution to Givista.`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
};

/**
 * Send donation status change notification to donor
 */
export const sendDonationStatusNotification = async (
  email: string,
  donorName: string,
  donationTitle: string,
  status: 'Pending' | 'Matched' | 'Dispatched' | 'Received' | 'Completed' | 'Cancelled',
  remarks?: string | null
): Promise<void> => {
  const statusText = status.toUpperCase();
  const remarksText = remarks ? `\nRemarks: ${remarks}` : '';

  console.log(`\n📧 DONATION STATUS UPDATE`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`To: ${email}`);
  console.log(`Subject: Your donation "${donationTitle}" status: ${statusText}`);
  console.log(`\nHello ${donorName},`);
  console.log(`The status of your donation "${donationTitle}" is now: ${statusText}`);
  console.log(`${remarksText}`);
  console.log(`\nThank you for your contribution to Givista.`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
};

/**
 * Send SMS notification (optional, for future use)
 */
export const sendSMSNotification = async (
  phone: string,
  message: string
): Promise<void> => {
  // Mock implementation - in production, use Twilio or similar
  console.log(`📱 SMS to ${phone}: ${message}`);
  
  // Example using Twilio:
  // const client = twilio(accountSid, authToken);
  // await client.messages.create({
  //   body: message,
  //   to: phone,
  //   from: twilioPhoneNumber
  // });
};


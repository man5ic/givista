/**
 * OTP Utilities
 * 
 * Helper functions for generating and validating OTP codes.
 */

/**
 * Generate a random 6-digit OTP
 * @returns 6-digit OTP string
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if OTP is expired
 * @param expiresAt - Expiration date
 * @returns True if expired
 */
export const isOTPExpired = (expiresAt: Date): boolean => {
  return new Date() > new Date(expiresAt);
};

/**
 * Generate OTP expiration time (10 minutes from now)
 * @returns Expiration date
 */
export const getOTPExpiration = (): Date => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry
  return expiresAt;
};

/**
 * Send OTP via email (mock implementation)
 * In production, use a service like SendGrid, AWS SES, etc.
 * @param email - Recipient email
 * @param otp - OTP code
 */
export const sendEmailOTP = async (email: string, otp: string): Promise<void> => {
  // Mock implementation - in production, use actual email service
  console.log(`📧 Sending OTP to ${email}: ${otp}`);
  console.log(`(In production, this would send an actual email)`);
  
  // Example using nodemailer or similar:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Givista Verification Code',
  //   html: `Your verification code is: <strong>${otp}</strong><br>Valid for 10 minutes.`
  // });
};

/**
 * Send OTP via SMS (mock implementation)
 * In production, use a service like Twilio, AWS SNS, etc.
 * @param phone - Recipient phone number
 * @param otp - OTP code
 */
export const sendSMSOTP = async (phone: string, otp: string): Promise<void> => {
  // Mock implementation - in production, use actual SMS service
  console.log(`📱 Sending OTP to ${phone}: ${otp}`);
  console.log(`(In production, this would send an actual SMS)`);
  
  // Example using Twilio:
  // const client = twilio(accountSid, authToken);
  // await client.messages.create({
  //   body: `Your Givista verification code is: ${otp}. Valid for 10 minutes.`,
  //   to: phone,
  //   from: twilioPhoneNumber
  // });
};


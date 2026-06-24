// Enums for clarity and type safety
export type UserRole = 'Donor' | 'Receiver' | 'Admin';
export type DonationStatus = 'Pending' | 'Matched' | 'Dispatched' | 'Received' | 'Completed' | 'Cancelled';
export type RequestStatus = 'Open' | 'Fulfilled' | 'Expired';
export type ItemCategory = 'Money' | 'Food' | 'Clothes' | 'Blood' | 'Other';

// --- Core Data Models ---

// 1. User Interface
export interface IUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  location: string; // e.g., City, State or Address
  photo_url?: string;
  isVerified?: boolean;
  verificationType?: 'email' | 'phone' | 'id' | null;
  kycDocument?: string | null;
  phone?: string | null;
  badges?: string[];
  points?: number;
  showEmail?: boolean;
  showPhone?: boolean;
  showLocation?: boolean;
  allowLeaderboardVisibility?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. Donation Interface (Created by Donor)
export interface IDonation {
  id: number;
  donorId: number;
  title: string;
  category: ItemCategory;
  quantity: number; // e.g., amount of money, quantity of clothes
  description: string;
  status: DonationStatus;
  photo_url?: string;
  isVerified?: boolean;
  verifiedBy?: number | null;
  verificationStatus?: 'Pending' | 'Approved' | 'Rejected' | null;
  verificationDate?: string | null;
  verificationRemarks?: string | null;
  matchedAt?: string | null;
  dispatchedAt?: string | null;
  receivedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  donor?: IUser;
  verifier?: IUser;
}

// 3. Request Interface (Created by Receiver)
export interface IRequest {
  id: number;
  receiverId: number;
  title: string;
  description: string;
  category: ItemCategory;
  urgency: 'Low' | 'Medium' | 'High';
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

// 4. Recommendation Interface (From AI Service)
export interface IRecommendation {
  id: number;
  donorId: number;
  receiverId: number;
  score: number; // A matching score (e.g., 0.0 to 1.0)
  match_details: string; // Explanation from AI (e.g., "Category match, high urgency")
}

// 5. Message Interface
export interface IMessage {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt: string;
}

// 6. Verification Interface
export interface IVerification {
  id: number;
  userId: number;
  type: 'email' | 'phone' | 'id';
  status: 'pending' | 'approved' | 'rejected' | 'verified';
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

// --- API Response Interfaces (for structured error handling) ---

// Generic structure for data returned by the backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: number;
    details: string;
  }
}
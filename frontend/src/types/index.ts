export interface User {
  _id: any;
  role: string;
  createdAt: any;
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  verificationDocuments: {
    type: 'aadhar' | 'license' | 'voter_id';
    number: string;
    verified: boolean;
  }[];
  rating: number;
  reviews: Review[];
  onlineStatus: 'online' | 'offline' | 'away';
  lastSeen: string;
}

export interface Listing {
  _id(_id: any): import("react").Key | null | undefined;
  user?: {
    _id: string;
    name: string;
    avatar: string;
    rating: string;
  };
  id: string;
  userId: string;
  source: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  vehicle: {
    type: string;
    model: string;
    registrationNumber: string;
    verified: boolean;
  };
  capacity: {
    weight: number;
    volume: number;
  };
  acceptsFragile: boolean;
  acceptedCategories: string[];
  price: number;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  identificationPhoto: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

export interface Parcel {
  id: string;
  senderId: string;
  carrierId: string;
  source: string;
  destination: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  category: string;
  isFragile: boolean;
  requiresDeliveryBy: string;
  status: 'pending' | 'accepted' | 'in-transit' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingUpdates: TrackingUpdate[];
}

export interface TrackingUpdate {
  id: string;
  parcelId: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorId: string;
  targetId: string;
  tripId?: string;
  parcelId?: string;
  photos?: string[];
}

export interface Message {
  timestamp: any;
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'location';
  metadata?: {
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
  };
}

export interface Chat {
  id?: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
    verificationStatus: string;
    onlineStatus?: 'online' | 'offline' | 'away';
  };
  lastMessage: Message;
  unreadCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'request' | 'status_update' | 'system' | 'verification';
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  documentType: 'aadhar' | 'license' | 'voter_id';
  documentNumber: string;
  documentImage: string;
  selfieImage: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}
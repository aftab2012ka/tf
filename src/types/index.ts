export interface AdmissionApplication {
  id: string;
  applicationId: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  age: string;
  qualification: string;
  course: string;
  address: string;
  mobile: string;
  email: string;
  language: string;
  message?: string;
  status: 'New' | 'Reviewing' | 'Approved' | 'Rejected' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface SeeratParticipant {
  id: string;
  registrationId: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  age: string;
  qualification: string;
  study: string;
  marriageStatus: 'Unmarried' | 'Married' | 'Other';
  address: string;
  mobile: string;
  language: string;
  paymentMode: 'UPI' | 'Cash' | 'Other';
  paymentReference?: string;
  status: 'Registered' | 'Payment Pending' | 'Confirmed' | 'Attended' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  mediaType: 'photo' | 'video';
  title: string;
  caption: string;
  category: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  date: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonationSettingsData {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  upiId: string;
  qrImageUrl: string;
  contactInfo: string;
  updatedAt?: string;
}

export interface SiteSettingsData {
  foundationName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  logoUrl?: string;
  footerText?: string;
  updatedAt?: string;
}

export interface CourseData {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  overview: string;
  modules: string[];
  icon: string;
  eligibility: string;
}

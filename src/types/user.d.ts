
declare type UserVerificationStatus = 'verified' | 'unverified';

interface User {
  id: string;
  email: string;
  displayName: string;
  verificationStatus: UserVerificationStatus;
  university: string | null;
  bio?: string;
  profilePicture?: string;
  joinedAt?: string;
  interests?: string[];
  photos?: string[];
}


declare type UserVerificationStatus = 'verified' | 'unverified';

interface User {
  id: string;
  email: string;
  displayName: string;
  verificationStatus: UserVerificationStatus;
  university: string | null;
}

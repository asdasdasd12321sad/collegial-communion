
declare type UserVerificationStatus = 'verified' | 'unverified';
declare type BlockStatus = 'active' | 'blocked' | 'deleted';
declare type AuthProvider = 'email' | 'google' | 'microsoft' | 'apple';

interface User {
  id: string;
  email?: string;
  displayName?: string;
  verificationStatus?: UserVerificationStatus;
  university?: string | null;
  bio?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  interests?: string[];
  photos?: string[];
  authProvider?: AuthProvider;
  blockStatus?: BlockStatus;
  lastLogin?: string;
}

// Post interface types
interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorUniversity?: string;
  createdAt: string;
  commentCount: number;
  hasImage?: boolean;
  imageUrl?: string;
  topic?: string;
  authorId?: string;
}

interface Reaction {
  like: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

interface ConfessionPost extends Post {
  reactions: Reaction;
}

interface CommunityPost extends Post {
  authorUniversity?: string;
}

interface PaginationParams {
  page: number;
  pageSize: number;
  filter?: string;
  sort?: string;
}

// Tab types for profile
type ProfileTab = 'photos' | 'interests' | 'about';

// Settings section types
interface SettingItem {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingItem[];
}

// Auth context type
interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  setDisplayName: (displayName: string) => Promise<void>;
}

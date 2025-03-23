
declare type UserVerificationStatus = 'verified' | 'unverified';

interface User {
  id: string;
  email?: string;
  displayName?: string;
  verificationStatus?: UserVerificationStatus;
  university?: string | null;
  bio?: string;
  profilePicture?: string;
  joinedAt?: string;
  interests?: string[];
  photos?: string[];
}

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

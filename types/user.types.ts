export interface UserPublic {
  _id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  website: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: string;
}

export interface UserWithFollow extends UserPublic {
  isFollowing: boolean;
  isFollowedBy: boolean;
}

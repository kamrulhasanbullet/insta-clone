export const APP_CONSTANTS = {
  MAX_POST_CAPTION_LENGTH: 2200,
  MAX_BIO_LENGTH: 150,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_FULLNAME_LENGTH: 60,
  COMMENTS_PER_PAGE: 20,
  NOTIFICATIONS_PER_PAGE: 20,
  POSTS_PER_PAGE: 12,
  SEARCH_MIN_LENGTH: 2,
  POLL_INTERVAL_MS: 30000, // 30 seconds
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CREATE_POST: "/post/create",
  EXPLORE: "/explore",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
} as const;

export const CLOUDINARY = {
  AVATAR_FOLDER: "instagram_clone/avatars",
  POST_FOLDER: "instagram_clone/posts",
} as const;

export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ACCEPTED_TYPES: "image/jpeg,image/png,image/webp",
} as const;

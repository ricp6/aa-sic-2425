export interface User {
  id: number
  email: string,
  name: string,
  userType: 'USER' | 'OWNER', // should match the discriminator column
  unreadNotificationCount: number,
  favoriteTrackIds: number[],
  token: string,
  refreshToken: string,
}

export interface TokenResponse {
  accessToken: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  totalSessions: number;
  victories: number;
  tracksVisited: number;
  favoriteTracks: string[];
  profilePicture?: string;
}

export interface SimpleUser {
  id: number,
  username: string,
  email: string,
  userType: 'USER' | 'OWNER',
}
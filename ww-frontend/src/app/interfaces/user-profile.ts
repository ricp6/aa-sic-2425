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

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
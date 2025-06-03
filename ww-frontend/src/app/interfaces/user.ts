export interface User {
    id: number,
    name: string,
    email: string,
    profilePicture?: string,
    notifications?: Notification[],
    user_type: 'USER' | 'OWNER'; // should match the discriminator column
}
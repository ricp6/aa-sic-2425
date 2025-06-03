export interface User {
    id: number,
    email: string,
    name: string,
    userType: 'USER' | 'OWNER'; // should match the discriminator column
}
export interface Track {
    id: number,
    name: string,
    address: string,
    slotPrice: number,
    slotDuration: number,
    email: string,
    phoneNumber: string,
    images: string[],
    isAvailable: boolean,
    ownerId: number,
}

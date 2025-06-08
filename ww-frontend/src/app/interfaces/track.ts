export interface SimpleTrack {
    id: number,
    name: string,
    address: string,
    image: string,
    isAvailable: boolean
}

export interface TrackWithRecords extends SimpleTrack {
    personalRecord?: string | null;
    trackRecord?: string | null;
}

export interface Records {
    trackId: number;
    personalRecord?: string | null;
    trackRecord?: string | null;
}

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

export interface DaySchedule {
    id: number,
    dia: string,
    openingTime: string,
    closingTime: string
}

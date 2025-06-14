// Enum for DayOfWeek if you want strong typing on the frontend
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface SimpleTrack {
    id: number,
    name: string,
    address: string,
    image: string,
    available: boolean
}

export interface TrackWithRecords extends SimpleTrack {
    personalRecord?: number | null;
    trackRecord?: number | null;
}


export interface RecordsDTO {
    id: number;
    personalRecord?: number | null;
    trackRecord?: number | null;
}
export interface FilterDTO {
  trackId: number;
  maxKarts?: number | null;
  notOpen?:  DayOfWeek[] | null;
}

export interface DaySchedule {
    // Note: The backend DayScheduleDTO does NOT have an 'id'.
    // If you need it, you'd have to add it to the backend DTO and map it.
    // Based on your DaySchedule DTO, it's just these fields:
    day: DayOfWeek; // Using the enum for better type safety
    openingTime: string; // Keep as string for LocalTime (e.g., "15:00:00")
    closingTime: string; // Keep as string for LocalTime (e.g., "22:00:00")
}

export interface TrackRanking {
    driverName: string;
    date: string; // Use string for LocalDate (e.g., "2023-10-26")
    kartNumber: string;
    lapTime: number; // Corresponds to Double in Java
}

// This interface mirrors your Java TrackDetailsResponseDTO
export interface TrackDetails {
    id: number;
    name: string;
    address: string;
    slotPrice: number; // Corresponds to BigDecimal in Java
    slotDuration: number;
    email: string;
    phoneNumber: string;
    images: string[];
    isAvailable: boolean;
    ownerId: number;

    // --- NEW FIELDS from TrackDetailsResponseDTO ---
    availableKartsCount: number;
    schedule: DaySchedule[]; // Array of DaySchedule objects
    rankings: TrackRanking[]; // Array of TrackRanking objects
}

export interface Session {
  id: number;
  trackName: string;
  date: string;
  startTime: string;
  endTime: string;
  numParticipants: number;
  position: number;
  personalRecord: string;
  trackImage: string;
}
  
export interface Classification {
  driverName: string;
  kartNumber: number;
  totalLaps: number;
  averageLapTime: number;
  bestLapTime: number;
  finalPosition: number;
  driverPicture: string;
}

export interface SessionDetails {
  id: number;
  trackName: string;
  date: string;
  sessionDuration: string
  classifications: Classification[];
}


export interface User {
  id: number;
  name: string;
  profilePic?: string;
}

export interface Kart {
  id: number;
  number: string;
}

// Interface para um Participante
export interface Participant {
  id: number;
  user: User;
  kart: Kart;
}

export interface Classification {
  id: number;
  position: number;
  averageTime: string;
  bestLapTime: string;
  participant: Participant;
}

export interface SessionDetail {
  id: number;
  trackId: number;
  date: string;
  startTime: string;
  endTime: string;
  kartsUsed: number;
  totalCost: number;
  classifications: Classification[];
}


export interface PodiumEntry {
  position: number;
  driverName: string;
  profilePic: string;
}

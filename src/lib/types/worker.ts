export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string; // Comma-separated tags
  AvailableSlots: number[] | string; // Array of phase numbers or string like "[1,3,5]"
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number | string; // Allow string for flexibility in parsing
}
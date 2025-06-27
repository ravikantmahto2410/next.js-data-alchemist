export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string; // Comma-separated tags
  PreferredPhases: number[] | string; // Can be a range like "1-3" or array [1, 3, 5]
  MaxConcurrent: number;
}
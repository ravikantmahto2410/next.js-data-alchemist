export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number; // Integer 1-5
  RequestedTaskIDs: string; // Comma-separated TaskIDs
  GroupTag: string;
  AttributesJSON: string; // JSON string
}
// lib/types.ts
export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs?: string; // Optional string
  GroupTag?: string;
  AttributesJSON?: string;
}
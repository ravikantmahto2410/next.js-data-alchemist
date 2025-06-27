// lib/parsers/aiParser.ts
import { Client, Worker, Task } from '../types';

const headerMappings = {
  client: {
    ClientID: ['client id', 'id_client', 'clientid'],
    ClientName: ['name', 'client name'],
    // Add more mappings
  },
  // Similar for workers and tasks
};

export function mapHeaders(headers: string[], entityType: 'client' | 'worker' | 'task'): string[] {
  return headers.map((header) => {
    for (const [standardHeader, aliases] of Object.entries(headerMappings[entityType])) {
      if (aliases.includes(header.toLowerCase().replace(/\s/g, ''))) {
        return standardHeader;
      }
    }
    return header;
  });
}
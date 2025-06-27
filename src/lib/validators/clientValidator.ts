
import { Client } from '../types/client';

export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export function validateClients(clients: Client[], taskIds: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>()

  clients.forEach((client, index) => {
    // a. Missing required columns
    if (!client.ClientID) errors.push({ rowIndex: index, field: 'ClientID', message: 'Missing ClientID' });
    if (!client.ClientName) errors.push({ rowIndex: index, field: 'ClientName', message: 'Missing ClientName' });
    if (!client.PriorityLevel) errors.push({ rowIndex: index, field: 'PriorityLevel', message: 'Missing PriorityLevel' });
    // b. Duplicate IDs
    if (client.ClientID) {
      if (seenIds.has(client.ClientID)) {
        errors.push({ rowIndex: index, field: 'ClientID', message: 'Duplicate ClientID' });
      } else {
        seenIds.add(client.ClientID);
      }
    }
    // d. Out-of-range PriorityLevel
    if (client.PriorityLevel && (client.PriorityLevel < 1 || client.PriorityLevel > 5)) {
      errors.push({ rowIndex: index, field: 'PriorityLevel', message: 'PriorityLevel must be 1-5' });
    }
    if (client.AttributesJSON) {
      try {
        JSON.parse(client.AttributesJSON);
      } catch {
        errors.push({ rowIndex: index, field: 'AttributesJSON', message: 'Invalid JSON' });
      }
    }


    if (client.RequestedTaskIDs) {
      const requestedIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
      requestedIds.forEach(id => {
        if (id && !taskIds.includes(id)) {
          errors.push({ rowIndex: index, field: 'RequestedTaskIDs', message: `Task ${id} not found` });
        }
      });
    }
  });

  return errors;
}
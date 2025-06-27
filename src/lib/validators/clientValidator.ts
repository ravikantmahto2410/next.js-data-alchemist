
import { Client } from '../types';

export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export function validateClients(clients: Client[], tasks: string[]): ValidationError[] {
  const errors: ValidationError[] = [];

  clients.forEach((client, index) => {
    // a. Missing required columns
    if (!client.ClientID) errors.push({ rowIndex: index, field: 'ClientID', message: 'Missing ClientID' });
    // b. Duplicate IDs
    if (clients.filter(c => c.ClientID === client.ClientID).length > 1) {
      errors.push({ rowIndex: index, field: 'ClientID', message: 'Duplicate ClientID' });
    }
    // d. Out-of-range PriorityLevel
    if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
      errors.push({ rowIndex: index, field: 'PriorityLevel', message: 'PriorityLevel must be 1-5' });
    }
    // f. Unknown references
    const taskIds = client.RequestedTaskIDs.split(',');
    taskIds.forEach(id => {
      if (!tasks.includes(id)) {
        errors.push({ rowIndex: index, field: 'RequestedTaskIDs', message: `Task ${id} not found` });
      }
    });
    // e. Broken JSON
    try {
      JSON.parse(client.AttributesJSON);
    } catch {
      errors.push({ rowIndex: index, field: 'AttributesJSON', message: 'Invalid JSON' });
    }
  });

  return errors;
}
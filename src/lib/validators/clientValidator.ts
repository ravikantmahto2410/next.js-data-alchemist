// lib/validators/clientValidator.ts
import { Client, ValidationError } from '@/lib/types';

export function validateClients(clients: Client[], validTaskIds: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const clientIds = new Set<string>();

  clients.forEach((client, index) => {
    if (!client.ClientID) {
      errors.push({ rowIndex: index, field: 'ClientID', message: 'Missing ClientID' });
    } else if (clientIds.has(client.ClientID)) {
      errors.push({
        rowIndex: index,
        field: 'ClientID',
        message: `Duplicate ClientID: ${client.ClientID}`,
      });
    } else {
      clientIds.add(client.ClientID);
    }

    if (client.RequestedTaskIDs) {
      const taskIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
      taskIds.forEach(id => {
        if (!validTaskIds.includes(id)) {
          errors.push({
            rowIndex: index,
            field: 'RequestedTaskIDs',
            message: `Task ${id} not found`,
          });
        }
      });
    }

    if (client.AttributesJSON) {
      try {
        JSON.parse(client.AttributesJSON);
      } catch {
        errors.push({
          rowIndex: index,
          field: 'AttributesJSON',
          message: 'Invalid JSON in AttributesJSON',
        });
      }
    }
  });

  return errors;
}
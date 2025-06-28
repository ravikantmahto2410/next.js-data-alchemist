// lib/validators/clientValidator.ts
export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export const validateClients = (clients: any[], taskIds?: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  clients.forEach((client, index) => {
    if (!client.ClientID) {
      errors.push({ rowIndex: index, field: 'ClientID', message: 'ClientID is required' });
    }
    // Optional: Add validation using taskIds if provided
    if (taskIds && client.RequestedTaskIDs) {
      const requestedIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
      const invalidIds = requestedIds.filter(id => !taskIds.includes(id));
      if (invalidIds.length > 0) {
        errors.push({ rowIndex: index, field: 'RequestedTaskIDs', message: `Invalid task IDs: ${invalidIds.join(', ')}` });
      }
    }
  });
  return errors;
};
// lib/validators/clientValidator.ts
export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export const validateClients = (clients: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  clients.forEach((client, index) => {
    if (!client.ClientID) {
      errors.push({ rowIndex: index, field: 'ClientID', message: 'ClientID is required' });
    }
  });
  return errors;
};
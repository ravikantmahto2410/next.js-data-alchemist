// tests/validators/clientValidator.test.ts
import { validateClients } from '@/lib/validators/clientValidator';

describe('Client Validator', () => {
  it('detects missing ClientID', () => {
    const clients = [{ ClientName: 'Test', PriorityLevel: 3 }];
    const errors = validateClients(clients, []);
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'ClientID', message: 'Missing ClientID' })
    );
  });

  it('detects duplicate ClientID', () => {
    const clients = [
      { ClientID: 'C1', ClientName: 'Test1', PriorityLevel: 3 },
      { ClientID: 'C1', ClientName: 'Test2', PriorityLevel: 4 },
    ];
    const errors = validateClients(clients, []);
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'ClientID', message: 'Duplicate ClientID' })
    );
  });
});
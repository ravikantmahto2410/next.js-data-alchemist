// lib/validators/workerValidator.ts
import { Worker } from '../types/worker';
import { Task } from '../types/task';
import { ValidationError } from './clientValidator';

export function validateWorkers(workers: Worker[], tasks: Task[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  workers.forEach((worker, index) => {
    // a. Missing required columns
    if (!worker.WorkerID) errors.push({ rowIndex: index, field: 'WorkerID', message: 'Missing WorkerID' });
    if (!worker.WorkerName) errors.push({ rowIndex: index, field: 'WorkerName', message: 'Missing WorkerName' });

    // b. Duplicate IDs
    if (worker.WorkerID) {
      if (seenIds.has(worker.WorkerID)) {
        errors.push({ rowIndex: index, field: 'WorkerID', message: 'Duplicate WorkerID' });
      } else {
        seenIds.add(worker.WorkerID);
      }
    }

    // c. Malformed lists (AvailableSlots)
    if (worker.AvailableSlots) {
      let slots: number[];
      if (typeof worker.AvailableSlots === 'string') {
        try {
          slots = JSON.parse(worker.AvailableSlots.replace(/\[|\]/g, '')).map(Number);
        } catch {
          errors.push({ rowIndex: index, field: 'AvailableSlots', message: 'Invalid AvailableSlots format' });
          return;
        }
      } else {
        slots = worker.AvailableSlots;
      }
      if (slots.some(slot => isNaN(slot) || slot < 1)) {
        errors.push({ rowIndex: index, field: 'AvailableSlots', message: 'AvailableSlots must contain positive integers' });
      }
    }

    // i. Overloaded workers (check if MaxLoadPerPhase is reasonable)
    if (worker.MaxLoadPerPhase < 0) {
      errors.push({ rowIndex: index, field: 'MaxLoadPerPhase', message: 'MaxLoadPerPhase must be non-negative' });
    }
  });

  return errors;
}
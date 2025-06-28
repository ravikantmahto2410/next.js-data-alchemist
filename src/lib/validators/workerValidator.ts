import { Worker, Task, ValidationError } from '@/lib/types';

export function validateWorkers(workers: Worker[], tasks: Task[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const workerIds = new Set<string>();

  workers.forEach((worker, index) => {
    if (!worker.WorkerID) {
      errors.push({ rowIndex: index, field: 'WorkerID', message: 'Missing WorkerID' });
    } else if (workerIds.has(worker.WorkerID)) {
      errors.push({
        rowIndex: index,
        field: 'WorkerID',
        message: `Duplicate WorkerID: ${worker.WorkerID}`,
      });
    } else {
      workerIds.add(worker.WorkerID);
    }

    if (!worker.Skills) {
      errors.push({ rowIndex: index, field: 'Skills', message: 'Missing Skills' });
    }

    if (worker.AvailableSlots && typeof worker.AvailableSlots === 'string') {
      const slots = worker.AvailableSlots.split(',').map((slot: string) => slot.trim());
      if (!slots.every((slot: string) => !isNaN(Number(slot)) && Number(slot) > 0)) {
        errors.push({
          rowIndex: index,
          field: 'AvailableSlots',
          message: 'AvailableSlots must be comma-separated positive integers (e.g., 1,3,5)',
        });
      }
    } else if (!worker.AvailableSlots) {
      errors.push({
        rowIndex: index,
        field: 'AvailableSlots',
        message: 'AvailableSlots is required',
      });
    }

    if (!worker.MaxLoadPerPhase || isNaN(Number(worker.MaxLoadPerPhase)) || Number(worker.MaxLoadPerPhase) <= 0) {
      errors.push({
        rowIndex: index,
        field: 'MaxLoadPerPhase',
        message: 'MaxLoadPerPhase must be a positive number',
      });
    }
  });

  return errors;
}
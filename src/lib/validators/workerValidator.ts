// lib/validators/workerValidator.ts
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

    if (worker.Skills) {
      const workerSkills = worker.Skills.split(',').map(s => s.trim());
      tasks.forEach(task => {
        const requiredSkills = task.RequiredSkills.split(',').map(s => s.trim());
        if (!requiredSkills.every(skill => workerSkills.includes(skill))) {
          errors.push({
            rowIndex: index,
            field: 'Skills',
            message: `Worker ${worker.WorkerID} lacks required skills for task ${task.TaskID}`,
          });
        }
      });
    }

    if (worker.AvailableSlots) {
      const slots = worker.AvailableSlots.toString().split(',').map(s => s.trim());
      if (!slots.every(slot => /^\d+$/.test(slot) && parseInt(slot, 10) > 0)) {
        errors.push({
          rowIndex: index,
          field: 'AvailableSlots',
          message: 'AvailableSlots must be comma-separated positive integers (e.g., 1,3,5)',
        });
      }
    } else {
      errors.push({
        rowIndex: index,
        field: 'AvailableSlots',
        message: 'AvailableSlots is required',
      });
    }
  });

  return errors;
}
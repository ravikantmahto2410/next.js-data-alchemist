// lib/validators/taskValidator.ts
import { Task } from '../types/task';
import { Worker } from '../types/worker';
import { ValidationError } from './clientValidator';

export function validateTasks(tasks: Task[], workers: Worker[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  tasks.forEach((task, index) => {
    // a. Missing required columns
    if (!task.TaskID) errors.push({ rowIndex: index, field: 'TaskID', message: 'Missing TaskID' });
    if (!task.TaskName) errors.push({ rowIndex: index, field: 'TaskName', message: 'Missing TaskName' });

    // b. Duplicate IDs
    if (task.TaskID && seenIds.has(task.TaskID)) {
      errors.push({ rowIndex: index, field: 'TaskID', message: 'Duplicate TaskID' });
    } else if (task.TaskID) {
      seenIds.add(task.TaskID);
    }

    // d. Out-of-range values
    if (task.Duration < 1) errors.push({ rowIndex: index, field: 'Duration', message: 'Duration must be >= 1' });
    if (task.MaxConcurrent < 1) errors.push({ rowIndex: index, field: 'MaxConcurrent', message: 'MaxConcurrent must be >= 1' });

    // k. Skill-coverage matrix
    if (task.RequiredSkills) {
      const requiredSkills = task.RequiredSkills.split(',').map(s => s.trim());
      const hasSkills = workers.some(w => {
        const workerSkills = w.Skills.split(',').map(s => s.trim());
        return requiredSkills.every(s => workerSkills.includes(s));
      });
      if (!hasSkills) {
        errors.push({ rowIndex: index, field: 'RequiredSkills', message: 'No worker has all required skills' });
      }
    }
  });

  return errors;
}
// lib/validators/taskValidator.ts
import { Task, Worker, ValidationError } from '@/lib/types';

export function validateTasks(tasks: Task[], workers: Worker[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  tasks.forEach((task, index) => {
    if (!task.TaskID) {
      errors.push({ rowIndex: index, field: 'TaskID', message: 'Missing TaskID' });
    }
    if (!task.TaskName) {
      errors.push({ rowIndex: index, field: 'TaskName', message: 'Missing TaskName' });
    }
    if (!task.PreferredPhases) {
      errors.push({ rowIndex: index, field: 'PreferredPhases', message: 'PreferredPhases is required' });
    }

    if (task.TaskID && seenIds.has(task.TaskID)) {
      errors.push({ rowIndex: index, field: 'TaskID', message: `Duplicate TaskID: ${task.TaskID}` });
    } else if (task.TaskID) {
      seenIds.add(task.TaskID);
    }

    if (task.Duration && (isNaN(Number(task.Duration)) || Number(task.Duration) < 1)) {
      errors.push({ rowIndex: index, field: 'Duration', message: 'Duration must be a positive integer' });
    }
    if (task.MaxConcurrent && (isNaN(Number(task.MaxConcurrent)) || Number(task.MaxConcurrent) < 1)) {
      errors.push({ rowIndex: index, field: 'MaxConcurrent', message: 'MaxConcurrent must be a positive integer' });
    }

    if (task.RequiredSkills) {
      const requiredSkills = task.RequiredSkills.split(',').map(s => s.trim());
      const hasSkills = workers.some(w => {
        const workerSkills = w.Skills.split(',').map(s => s.trim());
        return requiredSkills.every(s => workerSkills.includes(s));
      });
      if (!hasSkills) {
        errors.push({
          rowIndex: index,
          field: 'RequiredSkills',
          message: `No worker has required skills for task ${task.TaskID}`,
        });
      }
    }

    if (task.PreferredPhases) {
      if (!/^\[\d+(,\d+)*\]$|^\d+-\d+$/.test(task.PreferredPhases)) {
        errors.push({
          rowIndex: index,
          field: 'PreferredPhases',
          message: 'PreferredPhases must be a list (e.g., [1,2,3]) or range (e.g., 1-3)',
        });
      } else if (task.PreferredPhases.match(/^\d+-\d+$/)) {
        const [start, end] = task.PreferredPhases.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start >= end) {
          errors.push({
            rowIndex: index,
            field: 'PreferredPhases',
            message: 'Range start must be a number less than end (e.g., 1-3)',
          });
        }
      } else if (task.PreferredPhases.match(/^\[\d+(,\d+)*\]$/)) {
        const phases = task.PreferredPhases
          .slice(1, -1)
          .split(',')
          .map(s => s.trim());
        if (!phases.every(phase => /^\d+$/.test(phase) && parseInt(phase, 10) > 0)) {
          errors.push({
            rowIndex: index,
            field: 'PreferredPhases',
            message: 'PreferredPhases list must contain positive integers (e.g., [1,2,3])',
          });
        }
      }
    }
  });

  return errors;
}
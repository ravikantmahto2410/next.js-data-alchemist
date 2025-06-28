// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { validateClients, validateWorkers, validateTasks } from '@/lib/validators';
import { Client, Worker, Task, ValidationError } from '@/lib/types';

export default function Dashboard() {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleDataParsed = ({ clients, workers, tasks }: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => {
    const taskIds = tasks.map(task => task.TaskID);
    const clientErrors = validateClients(clients, taskIds);
    const workerErrors = validateWorkers(workers, tasks);
    const taskErrors = validateTasks(tasks, workers);
    setValidationErrors([...clientErrors, ...workerErrors, ...taskErrors]);
  };

  return (
    <div className="p-6">
      <h1>Data Alchemist Dashboard</h1>
      <FileUpload onDataParsed={handleDataParsed} />
      <div>
        <h2>Validation Results</h2>
        {validationErrors.length > 0 ? (
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>
                Row {error.rowIndex + 1}, {error.field}: {error.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No validation errors</p>
        )}
      </div>
    </div>
  );
}
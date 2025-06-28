// components/FileUpload.tsx
'use client';

import { useRef } from 'react';
import Papa from 'papaparse';
import { Client, Worker, Task } from '@/lib/types';

interface FileUploadProps {
  onDataParsed: (data: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => void;
}

export default function FileUpload({ onDataParsed }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const parseFile = (file: File) => {
      return new Promise<any[]>((resolve) => {
        Papa.parse(file, {
          complete: (result) => {
            resolve(result.data as any[]);
          },
          header: true,
          skipEmptyLines: true,
        });
      });
    };

    const clientsFile = Array.from(files).find(f => f.name.toLowerCase().includes('clients'));
    const workersFile = Array.from(files).find(f => f.name.toLowerCase().includes('workers'));
    const tasksFile = Array.from(files).find(f => f.name.toLowerCase().includes('tasks'));

    Promise.all([
      clientsFile ? parseFile(clientsFile) : Promise.resolve([]),
      workersFile ? parseFile(workersFile) : Promise.resolve([]),
      tasksFile ? parseFile(tasksFile) : Promise.resolve([]),
    ]).then(([clients, workers, tasks]) => {
      onDataParsed({ clients, workers, tasks });
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  return (
    <div className="p-4">
      <label className="block mb-2">Upload CSV Files (Clients, Workers, Tasks)</label>
      <input
        type="file"
        multiple
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="border p-2"
      />
    </div>
  );
}
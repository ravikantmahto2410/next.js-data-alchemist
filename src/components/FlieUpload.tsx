// components/FileUpload.tsx
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
    if (!files) return;

    const parseFile = (file: File, type: 'clients' | 'workers' | 'tasks') => {
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

    Promise.all([
      files[0] ? parseFile(files[0], 'clients') : Promise.resolve([]),
      files[1] ? parseFile(files[1], 'workers') : Promise.resolve([]),
      files[2] ? parseFile(files[2], 'tasks') : Promise.resolve([]),
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
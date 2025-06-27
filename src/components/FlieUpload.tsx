// components/FileUpload.tsx
import { useState } from 'react';
import Papa from 'papaparse'
import * as XLSX from 'xlsx';
import { Client, Worker, Task } from '@/lib/types';

interface FileUploadProps {
  onDataParsed: (data: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => void;
}

export default function FileUpload({ onDataParsed }: FileUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const parsedData = { clients: [], workers: [], tasks: [] };

    for (const file of Array.from(files)) {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          complete: (result) => {
            const data = result.data as any[];
            const entityType = file.name.includes('clients') ? 'clients' : file.name.includes('workers') ? 'workers' : 'tasks';
            parsedData[entityType] = data;
          },
          header: true,
          skipEmptyLines: true,
        });
      } else if (file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const workbook = XLSX.read(event.target?.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet);
          const entityType = file.name.includes('clients') ? 'clients' : file.name.includes('workers') ? 'workers' : 'tasks';
          parsedData[entityType] = data;
        };
        reader.readAsBinaryString(file);
      }
    }

    onDataParsed(parsedData);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".csv,.xlsx"
        multiple
        onChange={handleFileChange}
        className="border p-2"
      />
    </div>
  );
}
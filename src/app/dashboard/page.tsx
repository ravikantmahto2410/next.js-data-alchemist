'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { validateClients, validateWorkers, validateTasks } from '@/lib/validators';
import { Client, Worker, Task, ValidationError } from '@/lib/types';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const SearchBar = () => (
  <div className="p-4">
    <input
      type="text"
      placeholder="Search tasks (e.g., Duration > 1)"
      className="border p-2 w-full rounded"
    />
  </div>
);

const RuleInput = () => (
  <div className="p-4">
    <input
      type="text"
      placeholder="Add rule (e.g., Tasks T1 and T2 must run together)"
      className="border p-2 w-full rounded"
    />
  </div>
);

const Sliders = () => (
  <div className="p-4">
    <div className="mb-4">
      <label className="block mb-1">PriorityLevel</label>
      <input type="range" min="1" max="5" defaultValue="3" className="w-full" />
    </div>
    <div className="mb-4">
      <label className="block mb-1">Fulfillment</label>
      <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
    </div>
    <div className="mb-4">
      <label className="block mb-1">Fairness</label>
      <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
    </div>
  </div>
);

const ExportButton = ({ disabled }: { disabled: boolean }) => (
  <div className="p-4">
    <button
      disabled={disabled}
      className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
    >
      Export Data
    </button>
  </div>
);

export default function Dashboard() {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleDataParsed = ({ clients, workers, tasks }: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => {
    console.log('Parsed Clients:', clients);
    console.log('Parsed Workers:', workers);
    console.log('Parsed Tasks:', tasks);
    const taskIds = tasks.map(task => task.TaskID).filter(Boolean);
    const clientErrors = validateClients(clients, taskIds);
    const workerErrors = validateWorkers(workers, tasks);
    const taskErrors = validateTasks(tasks, workers);
    setValidationErrors([...clientErrors, ...workerErrors, ...taskErrors]);
    setClients(clients);
    setWorkers(workers);
    setTasks(tasks);
  };

  const columnDefs: ColDef<Client>[] = [
    { headerName: 'Client ID', field: 'ClientID', sortable: true, filter: true, editable: true, minWidth: 100 },
    { headerName: 'Client Name', field: 'ClientName', sortable: true, filter: true, editable: true, minWidth: 150 },
    { headerName: 'Priority Level', field: 'PriorityLevel', sortable: true, filter: true, editable: true, minWidth: 120 },
    { headerName: 'Requested Tasks', field: 'RequestedTaskIDs', sortable: true, filter: true, editable: true, minWidth: 150 },
    { headerName: 'Group Tag', field: 'GroupTag', sortable: true, filter: true, editable: true, minWidth: 120 },
    { headerName: 'Attributes', field: 'AttributesJSON', sortable: true, filter: true, editable: true, minWidth: 200 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Alchemist Dashboard</h1>
      <FileUpload onDataParsed={handleDataParsed} />
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Validation Results</h2>
        {validationErrors.length > 0 ? (
          <ul className="list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-600">
                Row {error.rowIndex + 1}, {error.field}: {error.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600">No validation errors</p>
        )}
      </div>
      <SearchBar />
      <RuleInput />
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Grid</h2>
        {clients.length === 0 ? (
          <p className="text-gray-600">No client data available. Please upload clients.csv.</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={clients}
              columnDefs={columnDefs}
              defaultColDef={{ resizable: true, sortable: true, filter: true }}
              domLayout="autoHeight"
              pagination={true}
              paginationPageSize={10}
              editType="fullRow"
              onCellValueChanged={(event) => {
                console.log('Cell Edited:', event.data);
                setClients([...clients]);
              }}
              onGridReady={(params) => {
                console.log('Grid Ready, Row Data:', clients);
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        )}
      </div>
      <Sliders />
      <ExportButton disabled={validationErrors.length > 0} />
    </div>
  );
}

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Client, Worker, Task } from '@/lib/types';

interface DataGridProps {
  data: Client[] | Worker[] | Task[];
  entityType: 'client' | 'worker' | 'task';
  onCellEdit: (row: any, field: string, newValue: any) => void;
}

export default function DataGrid({ data, entityType, onCellEdit }: DataGridProps) {
  const columnDefs = entityType === 'task' ? [
    { field: 'TaskID', editable: true },
    { field: 'TaskName', editable: true },
    { field: 'Category', editable: true },
    { field: 'Duration', editable: true },
    { field: 'RequiredSkills', editable: true },
    { field: 'PreferredPhases', editable: true },
    { field: 'MaxConcurrent', editable: true },
  ] : entityType === 'client' ? [
    { field: 'ClientID', editable: true },
    { field: 'ClientName', editable: true },
    { field: 'PriorityLevel', editable: true },
    { field: 'RequestedTaskIDs', editable: true },
    { field: 'GroupTag', editable: true },
    { field: 'AttributesJSON', editable: true },
  ] : [
    { field: 'WorkerID', editable: true },
    { field: 'WorkerName', editable: true },
    { field: 'Skills', editable: true },
    { field: 'AvailableSlots', editable: true },
    { field: 'MaxLoadPerPhase', editable: true },
    { field: 'WorkerGroup', editable: true },
    { field: 'QualificationLevel', editable: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        onCellValueChanged={(event) => onCellEdit(event.data, event.colDef.field, event.newValue)}
      />
    </div>
  );
}
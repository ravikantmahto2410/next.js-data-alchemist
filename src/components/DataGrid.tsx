// components/DataGrid.tsx
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
  const columnDefs = entityType === 'client'
    ? [
        { field: 'ClientID', editable: true },
        { field: 'ClientName', editable: true },
        { field: 'PriorityLevel', editable: true },
        // Add other fields
      ]
    : // Define for workers and tasks similarly

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
'use client';

import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; // Import modules
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Client, Worker, Task } from '@/lib/types';
import { ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { useRef, useEffect } from 'react';
import { useDataStore } from '@/lib/store';

// Register the module
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridProps {
  entityType: 'client' | 'worker' | 'task';
  onCellEdit: (row: any, field: string, newValue: any) => void;
}

export default function DataGrid({ entityType, onCellEdit }: DataGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const { validatedData } = useDataStore();

  const rowData = entityType === 'client'
    ? validatedData.clients
    : entityType === 'worker'
    ? validatedData.workers
    : validatedData.tasks;

  useEffect(() => {
    console.log(`DataGrid rowData for ${entityType}:`, rowData);
    if (!rowData || rowData.length === 0) {
      console.warn(`No ${entityType} data available in validatedData.`);
    }
  }, [rowData, entityType]);

  const columnDefs: ColDef[] = entityType === 'task'
    ? [
        { field: 'TaskID', editable: true, type: 'string' },
        { field: 'TaskName', editable: true, type: 'string' },
        { field: 'Category', editable: true, type: 'string' },
        { field: 'Duration', editable: true, type: 'number' },
        { field: 'RequiredSkills', editable: true, type: 'string' },
        { field: 'PreferredPhases', editable: true, type: 'string' },
        { field: 'MaxConcurrent', editable: true, type: 'number' },
      ]
    : entityType === 'client'
    ? [
        { field: 'ClientID', editable: true, type: 'string' },
        { field: 'ClientName', editable: true, type: 'string' },
        { field: 'PriorityLevel', editable: true, type: 'number' },
        { field: 'RequestedTaskIDs', editable: true, type: 'string' },
        { field: 'GroupTag', editable: true, type: 'string' },
        { field: 'AttributesJSON', editable: true, type: 'string' },
      ]
    : [
        { field: 'WorkerID', editable: true, type: 'string' },
        { field: 'WorkerName', editable: true, type: 'string' },
        { field: 'Skills', editable: true, type: 'string' },
        { field: 'AvailableSlots', editable: true, type: 'number' },
        { field: 'MaxLoadPerPhase', editable: true, type: 'number' },
        { field: 'WorkerGroup', editable: true, type: 'string' },
        { field: 'QualificationLevel', editable: true, type: 'number' },
      ];

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    if (event.colDef.field && event.data && event.newValue !== undefined) {
      onCellEdit(event.data, event.colDef.field, event.newValue);
      console.log(`Cell edited: ${event.colDef.field} = ${event.newValue}`, event.data);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData || []}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        domLayout="normal"
        defaultColDef={{ sortable: true, filter: true }}
      />
    </div>
  );
}
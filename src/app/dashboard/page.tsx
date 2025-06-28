// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useDataStore } from '@/lib/store';
import FileUpload from '@/components/FileUpload';
import DataGrid from '@/components/DataGrid';
import SearchBar from '@/components/SearchBar';
import RuleInput from '@/components/RuleInput';
import PrioritizationSliders from '@/components/PrioritizationSliders';
import ValidationPanel from '@/components/ValidationPanel';
import { Client, Worker, Task, Rule, ValidationError } from '@/lib/types';
import { validateClients, validateWorkers, validateTasks } from '@/lib/validators';

export default function Dashboard() {
  const { clients, workers, tasks, filteredTasks, rules, setData, setFilteredTasks, addRule } = useDataStore();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({
    PriorityLevel: 0.5,
    Fulfillment: 0.3,
    Fairness: 0.2,
  });

  const handleDataParsed = (data: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => {
    const clientErrors = validateClients(data.clients, data.tasks.map(t => t.TaskID));
    const workerErrors = validateWorkers(data.workers, data.tasks);
    const taskErrors = validateTasks(data.tasks, data.workers);
    setValidationErrors([...clientErrors, ...workerErrors, ...taskErrors]);
    setData(data);
  };

  const handleSearch = (filteredTasks: Task[]) => {
    setFilteredTasks(filteredTasks);
  };

  const handleAddRule = (rule: Rule) => {
    addRule(rule);
  };

  const handleCellEdit = (row: any, field: string, newValue: any) => {
    const updatedTasks = tasks.map(t =>
      t.TaskID === row.TaskID ? { ...t, [field]: newValue } : t
    );
    setData({ clients, workers, tasks: updatedTasks });
    const taskErrors = validateTasks(updatedTasks, workers);
    setValidationErrors([...validateClients(clients, updatedTasks.map(t => t.TaskID)), ...validateWorkers(workers, updatedTasks), ...taskErrors]);
  };

  const handleExport = async () => {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clients, workers, tasks, rules, weights }),
    });
    const { clients: clientCsv, workers: workerCsv, tasks: taskCsv, rules: rulesJson } = await response.json();

    const download = (content: string, fileName: string, contentType: string) => {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    };

    download(clientCsv, 'clients.csv', 'text/csv');
    download(workerCsv, 'workers.csv', 'text/csv');
    download(taskCsv, 'tasks.csv', 'text/csv');
    download(rulesJson, 'rules.json', 'application/json');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Alchemist Dashboard</h1>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Upload Data</h2>
        <FileUpload onDataParsed={handleDataParsed} />
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Validation Results</h2>
        <ValidationPanel errors={validationErrors} />
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Tasks</h2>
        <SearchBar tasks={tasks} onSearch={handleSearch} />
        <DataGrid data={filteredTasks} entityType="task" onCellEdit={handleCellEdit} />
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Business Rules</h2>
        <RuleInput onAddRule={handleAddRule} />
        <div className="mt-4">
          <h3 className="text-lg mb-2">Current Rules</h3>
          {rules.length === 0 ? (
            <p className="text-gray-500">No rules added yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {rules.map((rule, index) => (
                <li key={index} className="mb-2">
                  {rule.type === 'coRun' && `Co-run: Tasks ${rule.tasks?.join(', ')}`}
                  {rule.type === 'slotRestriction' && `Slot Restriction: ${rule.group} needs at least ${rule.minCommonSlots} common slots`}
                  {rule.type === 'loadLimit' && `Load Limit: ${rule.group} max ${rule.maxSlotsPerPhase} slots per phase`}
                  {rule.type === 'phaseWindow' && `Phase Window: Task ${rule.tasks?.[0]} in phases ${rule.phases}`}
                  {rule.type === 'patternMatch' && `Pattern Match: Regex ${rule.regex}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Prioritization</h2>
        <PrioritizationSliders onUpdate={setWeights} />
      </section>
      <section className="mb-6">
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          disabled={validationErrors.length > 0}
        >
          Export Data and Rules
        </button>
        {validationErrors.length > 0 && (
          <p className="text-red-500 mt-2">Resolve all validation errors before exporting.</p>
        )}
      </section>
    </div>
  );
}
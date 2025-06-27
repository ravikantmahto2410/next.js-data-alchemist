// lib/store.ts
import { create } from 'zustand';
import { Client, Worker, Task, Rule } from './types';

interface DataState {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  filteredTasks: Task[];
  rules: Rule[];
  setData: (data: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => void;
  setFilteredTasks: (tasks: Task[]) => void;
  addRule: (rule: Rule) => void;
}

export const useDataStore = create<DataState>((set) => ({
  clients: [],
  workers: [],
  tasks: [],
  filteredTasks: [],
  rules: [],
  setData: (data) => set({ clients: data.clients, workers: data.workers, tasks: data.tasks, filteredTasks: data.tasks }),
  setFilteredTasks: (tasks) => set({ filteredTasks: tasks }),
  addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
}));
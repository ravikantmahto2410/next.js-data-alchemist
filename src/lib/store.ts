import { create } from 'zustand';
import { Client, Worker, Task, Rule } from './types';
import { validateData } from '../lib/ai/validateData';
// import { validateData } from '@/lib/ai/validate'; // Should now resolve

interface DataState {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  filteredTasks: Task[];
  rules: Rule[];
  validatedData: { clients: Client[]; workers: Worker[]; tasks: Task[] };
  setData: (data: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => void;
  setFilteredTasks: (tasks: Task[]) => void;
  addRule: (rule: Rule) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  clients: [],
  workers: [],
  tasks: [],
  filteredTasks: [],
  rules: [],
  validatedData: { clients: [], workers: [], tasks: [] },
  setData: (data) => {
    const { clients, workers, tasks } = data;
    const validated = validateData(clients, workers, tasks, get().rules);
    set({ clients, workers, tasks, filteredTasks: tasks, validatedData: validated });
  },
  setFilteredTasks: (tasks) => set({ filteredTasks: tasks }),
  addRule: (rule) => {
    set((state) => {
      const rules = [...state.rules, rule];
      const validated = validateData(state.clients, state.workers, state.tasks, rules);
      return { rules, validatedData: validated };
    });
  },
}));
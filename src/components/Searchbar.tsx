// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { parseQuery } from '@/lib/ai/naturalLanguage';
import { Task } from '@/lib/types/task';

interface SearchBarProps {
  tasks: Task[];
  onSearch: (filteredTasks: Task[]) => void;
}

export default function SearchBar({ tasks, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const filteredTasks = parseQuery(query, tasks);
    onSearch(filteredTasks);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., Tasks with Duration > 1 and phase 2"
        className="border p-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="ml-2 bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>
    </div>
  );
}
// components/PrioritizationSliders.tsx
import { useState, useEffect } from 'react';

interface PrioritizationSlidersProps {
  onUpdate: (weights: Record<string, number>) => void;
}

export default function PrioritizationSliders({ onUpdate }: PrioritizationSlidersProps) {
  const [weights, setWeights] = useState({
    PriorityLevel: 0.5,
    Fulfillment: 0.3,
    Fairness: 0.2,
  });

  useEffect(() => {
    // Normalize weights to sum to 1
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const normalized = Object.fromEntries(
      Object.entries(weights).map(([key, value]) => [key, value / total])
    );
    onUpdate(normalized);
  }, [weights, onUpdate]);

  const handleChange = (key: string, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4">
      {Object.keys(weights).map(key => (
        <div key={key} className="mb-4">
          <label className="block mb-1 capitalize">{key}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={weights[key as keyof typeof weights]}
            onChange={e => handleChange(key, parseFloat(e.target.value))}
            className="w-full"
          />
          <span>{weights[key as keyof typeof weights].toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}
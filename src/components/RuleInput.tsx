'use client';

import { useState } from 'react';
import { parseRule } from '@/lib/ai/naturalLanguage';
import { Rule, CoRunRule, SlotRestrictionRule, LoadLimitRule, PhaseWindowRule } from '@/lib/types/rule';
import { useDataStore } from '@/lib/store';

interface RuleInputProps {
  onAddRule: (rule: Rule) => void;
}

// Helper function to create a rule with type safety
const createRule = (type: string, params: {
  taskIds: string[];
  group: string;
  minCommonSlots: number | null;
  maxSlotsPerPhase: number | null;
  phases: string | null;
}): Rule | null => {
  switch (type) {
    case 'coRun':
      return { type: 'coRun', tasks: params.taskIds } as CoRunRule;
    case 'slotRestriction':
      if (!params.group || params.minCommonSlots === null) return null;
      return { type: 'slotRestriction', group: params.group, minCommonSlots: params.minCommonSlots } as SlotRestrictionRule;
    case 'loadLimit':
      if (!params.group || params.maxSlotsPerPhase === null) return null;
      return { type: 'loadLimit', group: params.group, maxSlotsPerPhase: params.maxSlotsPerPhase } as LoadLimitRule;
    case 'phaseWindow':
      if (params.taskIds.length === 0 || !params.phases) return null;
      return { type: 'phaseWindow', tasks: params.taskIds, phases: params.phases } as PhaseWindowRule;
    default:
      return null;
  }
};

export default function RuleInput({ onAddRule }: RuleInputProps) {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [ruleType, setRuleType] = useState<string>('coRun');
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [group, setGroup] = useState('');
  const [minCommonSlots, setMinCommonSlots] = useState<number | null>(null);
  const [maxSlotsPerPhase, setMaxSlotsPerPhase] = useState<number | null>(null);
  const [phases, setPhases] = useState<string | null>(null);
  const { tasks } = useDataStore();

  const handleAddManualRule = () => {
    const ruleParams = {
      taskIds,
      group,
      minCommonSlots,
      maxSlotsPerPhase,
      phases,
    };
    const rule = createRule(ruleType, ruleParams);
    if (!rule) {
      alert('Missing required fields for the selected rule type.');
      return;
    }
    // Type guard to check if rule has tasks property
    let invalidTasks: string[] = [];
    if ('tasks' in rule) {
      invalidTasks = rule.tasks.filter((taskId: string) => !tasks.some(t => t.TaskID === taskId));
    }
    if (invalidTasks.length > 0) {
      alert(`Invalid Task IDs: ${invalidTasks.join(', ')}`);
      return;
    }
    onAddRule(rule);
  };

  const handleAddNaturalLanguageRule = () => {
    const rule = parseRule(naturalLanguageQuery);
    if (rule) {
      // Type guard for natural language rule
      let invalidTasks: string[] = [];
      if ('tasks' in rule) {
        invalidTasks = rule.tasks.filter((taskId: string) => !tasks.some(t => t.TaskID === taskId));
      }
      if (invalidTasks.length > 0) {
        alert(`Invalid Task IDs: ${invalidTasks.join(', ')}`);
        return;
      }
      onAddRule(rule);
      setNaturalLanguageQuery('');
    } else {
      alert('Invalid rule format. Try something like "Tasks T1 and T2 must run together".');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Add Rule</h2>
      <div className="mb-4">
        <label className="block mb-1">Rule Type</label>
        <select
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="coRun">Co-run</option>
          <option value="slotRestriction">Slot Restriction</option>
          <option value="loadLimit">Load Limit</option>
          <option value="phaseWindow">Phase Window</option>
        </select>
        {ruleType === 'coRun' && (
          <input
            type="text"
            placeholder="Task IDs (comma-separated)"
            onChange={(e) => setTaskIds(e.target.value.split(',').map(id => id.trim()))}
            className="border p-2 w-full mt-2"
          />
        )}
        {ruleType === 'slotRestriction' && (
          <>
            <input
              type="text"
              placeholder="Group (e.g., Sales)"
              onChange={(e) => setGroup(e.target.value)}
              className="border p-2 w-full mt-2"
            />
            <input
              type="number"
              placeholder="Min Common Slots"
              onChange={(e) => setMinCommonSlots(parseInt(e.target.value) || null)}
              className="border p-2 w-full mt-2"
            />
          </>
        )}
        {ruleType === 'loadLimit' && (
          <>
            <input
              type="text"
              placeholder="Group (e.g., Dev)"
              onChange={(e) => setGroup(e.target.value)}
              className="border p-2 w-full mt-2"
            />
            <input
              type="number"
              placeholder="Max Slots Per Phase"
              onChange={(e) => setMaxSlotsPerPhase(parseInt(e.target.value) || null)}
              className="border p-2 w-full mt-2"
            />
          </>
        )}
        {ruleType === 'phaseWindow' && (
          <>
            <input
              type="text"
              placeholder="Task IDs (comma-separated)"
              onChange={(e) => setTaskIds(e.target.value.split(',').map(id => id.trim()))}
              className="border p-2 w-full mt-2"
            />
            <input
              type="text"
              placeholder="Phases (e.g., 1-3)"
              onChange={(e) => setPhases(e.target.value || null)}
              className="border p-2 w-full mt-2"
            />
          </>
        )}
        <button
          onClick={handleAddManualRule}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          Add Manual Rule
        </button>
      </div>
      <div>
        <label className="block mb-1">Natural Language Rule</label>
        <input
          type="text"
          value={naturalLanguageQuery}
          onChange={(e) => setNaturalLanguageQuery(e.target.value)}
          placeholder="e.g., Tasks T1 and T2 must run together"
          className="border p-2 w-full"
        />
        <button
          onClick={handleAddNaturalLanguageRule}
          className="mt-2 bg-green-500 text-white p-2 rounded"
        >
          Add Natural Language Rule
        </button>
      </div>
    </div>
  );
}
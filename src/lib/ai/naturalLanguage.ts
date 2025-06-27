
import { Task } from '../types/task';
import { Rule } from '../types/rule';

// Utility to normalize PreferredPhases to an array of numbers
function normalizePhases(phases: number[] | string): number[] {
  if (typeof phases === 'string') {
    if (phases.includes('-')) {
      const [start, end] = phases.split('-').map(Number);
      if (isNaN(start) || isNaN(end)) return [];
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    try {
      return JSON.parse(phases.replace(/\[|\]/g, '')).map(Number);
    } catch {
      return [];
    }
  }
  return phases;
}

export function parseQuery(query: string, tasks: Task[]): Task[] {
  if (!query.trim()) return tasks;

  return tasks.filter(task => {
    const normalizedPhases = normalizePhases(task.PreferredPhases);

    const durationMatch = query.match(/Duration > (\d+)/i);
    if (durationMatch && task.Duration <= parseInt(durationMatch[1])) {
      return false;
    }

    const phaseMatch = query.match(/phase (\d+)/i);
    if (phaseMatch && !normalizedPhases.includes(parseInt(phaseMatch[1]))) {
      return false;
    }

    return true;
  });
}

export function parseRule(query: string): Rule | null {
    query = query.toLowerCase().trim();
    if (!query) return null;
  // Co-run rule: "Tasks T1 and T2 must run together"
  const coRunMatch = query.match(/tasks (\w+) and (\w+) must run together/i);
  if (coRunMatch) {
    return {
      type: 'coRun',
      tasks: [coRunMatch[1], coRunMatch[2]],
    };
  }

    // Slot-restriction rule: "ClientGroup Sales needs at least 2 common slots"
    const slotRestrictionMatch = query.match(/(clientgroup|workergroup) (\w+) needs at least (\d+) common slots/i);
    if (slotRestrictionMatch) {
        return {
        type: 'slotRestriction',
        group: slotRestrictionMatch[2],
        minCommonSlots: parseInt(slotRestrictionMatch[3]),
        };
    }

  // Load-limit rule: "WorkerGroup Dev max 3 slots per phase"
    const loadLimitMatch = query.match(/workergroup (\w+) max (\d+) slots per phase/i);
    if (loadLimitMatch) {
        return {
        type: 'loadLimit',
        group: loadLimitMatch[1],
        maxSlotsPerPhase: parseInt(loadLimitMatch[2]),
        };
    }

  // Phase-window rule: "Task T1 in phases 1 to 3"
  const phaseWindowMatch = query.match(/task (\w+) in phases (\d+) to (\d+)/i);
  if (phaseWindowMatch) {
    const start = parseInt(phaseWindowMatch[2]);
    const end = parseInt(phaseWindowMatch[3]);
    return {
      type: 'phaseWindow',
      tasks: [phaseWindowMatch[1]],
      phases: `${start}-${end}`,
    };
  } 

  // Pattern-match rule (simplified): "Tasks matching regex ^T\d+"
    const patternMatch = query.match(/tasks matching regex ([\w\d\^\$]+)/i);
    if (patternMatch) {
        return {
        type: 'patternMatch',
        regex: patternMatch[1],
        };
    }

    return null;
}
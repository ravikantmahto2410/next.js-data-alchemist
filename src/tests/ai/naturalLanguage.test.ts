// lib/ai/naturalLanguage.ts
import { Rule } from '@/lib/types';

export function parseRule(query: string): Rule | null {
  if (!query || typeof query !== 'string') return null;
  query = query.toLowerCase().trim();

  // Co-run rule: "Tasks T1 and T2 must run together"
  const coRunMatch = query.match(/tasks (\w+) and (\w+) must run together/i);
  if (coRunMatch) {
    return {
      type: 'coRun',
      tasks: [coRunMatch[1].toUpperCase(), coRunMatch[2].toUpperCase()],
    };
  }

  // Slot-restriction rule: "ClientGroup Sales needs at least 2 common slots"
  const slotRestrictionMatch = query.match(/clientgroup (\w+) needs at least (\d+) common slots/i);
  if (slotRestrictionMatch) {
    return {
      type: 'slotRestriction',
      group: slotRestrictionMatch[1],
      minCommonSlots: parseInt(slotRestrictionMatch[2], 10),
    };
  }

  // Invalid rule
  return null;
}

export function parseQuery(query: string, tasks: any[]): any[] {
  if (!query || typeof query !== 'string') return tasks;
  query = query.toLowerCase().trim();

  // Example: "Tasks with Duration > 1"
  if (query.includes('duration >')) {
    const match = query.match(/duration > (\d+)/i);
    if (match) {
      const duration = parseInt(match[1], 10);
      return tasks.filter((task) => task.Duration > duration);
    }
  }

  return tasks;
}
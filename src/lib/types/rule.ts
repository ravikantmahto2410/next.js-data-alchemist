// lib/types/rule.ts
export interface CoRunRule {
  type: 'coRun';
  tasks: string[];
}

export interface SlotRestrictionRule {
  type: 'slotRestriction';
  group: string;
  minCommonSlots: number;
}

export interface LoadLimitRule {
  type: 'loadLimit';
  group: string;
  maxSlotsPerPhase: number;
}

export interface PhaseWindowRule {
  type: 'phaseWindow';
  tasks: string[];
  phases: string;
}

export type Rule = CoRunRule | SlotRestrictionRule | LoadLimitRule | PhaseWindowRule;
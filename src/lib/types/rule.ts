// lib/types/rule.ts
export interface Rule {
  type: string; // e.g., "coRun", "slotRestriction"
  tasks?: string[]; // For coRun rules (e.g., ["T1", "T2"])
  group?: string; // For slotRestriction rules (e.g., "Sales")
  minCommonSlots?: number; // For slotRestriction rules (e.g., 2)
}
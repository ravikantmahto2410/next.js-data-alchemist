export interface Rule {
  type: 'coRun' | 'slotRestriction' | 'loadLimit' | 'phaseWindow' | 'patternMatch' | 'precedenceOverride';
  tasks?: string[]; // For coRun
  group?: string; // For slotRestriction, loadLimit
  minCommonSlots?: number; // For slotRestriction
  maxSlotsPerPhase?: number; // For loadLimit
  phases?: number[] | string; // For phaseWindow
  regex?: string; // For patternMatch
  priority?: number; // For precedenceOverride
}
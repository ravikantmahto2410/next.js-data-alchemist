/
import { parseRule } from '@/lib/ai/naturalLanguage';

describe('parseRule', () => {
  it('parses co-run rule', () => {
    expect(parseRule('Tasks T1 and T2 must run together')).toEqual({
      type: 'coRun',
      tasks: ['T1', 'T2'],
    });
  });

  it('parses slot-restriction rule', () => {
    expect(parseRule('ClientGroup Sales needs at least 2 common slots')).toEqual({
      type: 'slotRestriction',
      group: 'Sales',
      minCommonSlots: 2,
    });
  });

  it('returns null for invalid rule', () => {
    expect(parseRule('Invalid rule')).toBeNull();
  });
});
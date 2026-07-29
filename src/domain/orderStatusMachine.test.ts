import { describe, expect, test } from 'bun:test';
import {
  canTransition,
  getAvailableActions,
  getNextStatus,
  isFinalStatus,
} from './orderStatusMachine';

describe('orderStatusMachine', () => {
  test('follows the happy path New → Acknowledged → In Progress → Completed', () => {
    expect(getNextStatus('New', 'acknowledge')).toBe('Acknowledged');
    expect(getNextStatus('Acknowledged', 'start')).toBe('In Progress');
    expect(getNextStatus('In Progress', 'complete')).toBe('Completed');
  });

  test('allows cancel from every non-final state', () => {
    expect(canTransition('New', 'cancel')).toBe(true);
    expect(canTransition('Acknowledged', 'cancel')).toBe(true);
    expect(canTransition('In Progress', 'cancel')).toBe(true);
  });

  test('rejects illegal transitions', () => {
    expect(getNextStatus('New', 'complete')).toBeNull();
    expect(getNextStatus('Completed', 'acknowledge')).toBeNull();
    expect(canTransition('Cancelled', 'start')).toBe(false);
  });

  test('final statuses expose no actions', () => {
    expect(isFinalStatus('Completed')).toBe(true);
    expect(isFinalStatus('Cancelled')).toBe(true);
    expect(getAvailableActions('Completed')).toHaveLength(0);
    expect(getAvailableActions('Cancelled')).toHaveLength(0);
  });

  test('marks cancel as destructive', () => {
    const cancel = getAvailableActions('New').find((a) => a.action === 'cancel');
    expect(cancel?.destructive).toBe(true);
  });
});

import { BaseScheduler, Stack } from '@v/stack-runner';
import { BrowserSchedulerStrategyType } from '@v/stack-runner/src/lib/scheduler/models/runner.interface';



export const REACTION_RUNNER = (type: BrowserSchedulerStrategyType) => new BaseScheduler(type);
export const STACK = () => {
  if (typeof REACTION_RUNNER === 'function') {
    return new Stack(REACTION_RUNNER('sync'), true);
  }
  return new Stack(REACTION_RUNNER, true);
};
export const getStack = () => {
  if (typeof STACK === 'function') {
    return STACK();
  }
  return STACK;
};

import { BaseScheduler, Stack } from '@v/stack-runner';
import { BrowserSchedulerStrategyType } from '@v/stack-runner/src/lib/scheduler/models/runner.interface';



export const REACTION_RUNNER = (type: BrowserSchedulerStrategyType) => new BaseScheduler(type);

export const STACK = () => {
  let stack: Stack;
  if (stack) {
    return stack;
  }
  if (typeof REACTION_RUNNER === 'function') {
    stack = new Stack(REACTION_RUNNER('sync'), true);
    return stack;
  }
  stack = new Stack(REACTION_RUNNER, true);
  return stack;
};

export const STACK_ITEM = () => {
  if (typeof STACK === 'function') {
    return STACK();
  }
  return STACK;
};

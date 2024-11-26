import { BaseScheduler, Stack } from '@v/stack-runner';
import { BrowserSchedulerStrategyType } from '@v/stack-runner/src/lib/scheduler/models/runner.interface';


export let stackItem: Stack;
export const createRunner = (type: BrowserSchedulerStrategyType) => new BaseScheduler(type);

export const provideStackRunner = (type: BrowserSchedulerStrategyType) => {
  const runner = createRunner(type);
  stackItem = new Stack(runner, true);
}

import { ReactionFnInterface } from '../models/reaction-fn.interface';
import { GlobalReactorInterface, ReactorStateInterface, XReactor } from './models/reactions.interface';
import { TaskInterface } from '@v/stack-runner';
import { ReactorOptionsInterface } from './models/reactor-options.interface';
import { detectChanges } from '../change-detector/change-detector';
import { getStack } from '../models/reaction-parameters';




let globalReactorEffect: GlobalReactorInterface | null = { cbFn: null };

// const runner = new BaseScheduler('sync');
// const stack: Stack = new Stack(runner, true);

export const reactor = <T>(v: T, options?: ReactorOptionsInterface): XReactor<T> => {
  let value = v;
  let taskItem: TaskInterface | null = null;
  const state: ReactorStateInterface = {
    reactionsList: []
  };


  const reactorFn = () => {
    // add reaction if not exist equal item in reactionsList
    if (globalReactorEffect &&
      !state.reactionsList.some(reaction =>
        reaction.cbFn === globalReactorEffect?.cbFn)) {
      state.reactionsList.push(globalReactorEffect);
    }

    return value;
  };
  reactorFn.set = (v: T) => {
    const isChanged = detectChanges(value, v);
    if (!isChanged) {
      return;
    }
    value = v;
    state.reactionsList.forEach((context) => {

      if (context.isRunning) {
        return;
      }
      context.deep = context.deep + 1;

      if (taskItem) {
        context.deep = 0;
        getStack().remove(taskItem);
        taskItem = null;
      }

      // check recursive call limit
      if (context.deep <= (options?.deep || 100)) {
        taskItem = getStack().add(context.cbFn, () => {
          if (taskItem) {
            taskItem = null;
          }
        });
      }
    });
  };

  reactorFn.destroy = () => {
    state.reactionsList = [];
  };

  return reactorFn as XReactor<T>;
};


export const reaction = (fn: ReactionFnInterface): void => {
  const reactionFn = () => {
    let globalReactor: GlobalReactorInterface | null = { cbFn: fn, isRunning: false, deep: 0 };
    globalReactorEffect = globalReactor;
    globalReactor.isRunning = true;
    getStack().add(fn);
    globalReactor.isRunning = false;
    globalReactorEffect = null;
    globalReactor = null;

  };
  return reactionFn();
};

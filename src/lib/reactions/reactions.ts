import { ReactionFnInterface } from '../models/reaction-fn.interface';
import { GlobalReactorInterface, ReactorStateInterface, XReactor } from './models/reactions.interface';
import { BaseScheduler, Stack, TaskInterface } from '@v/stack-runner';
import { ReactorOptionsInterface } from './models/reactor-options.interface';
import { STACK_ITEM } from '../models/reaction-parameters';




let globalReactorEffect: GlobalReactorInterface | null = { cbFn: null };

const runner = new BaseScheduler('sync');
const stack: Stack = new Stack(runner, true);

export const reactor = <T>(v: T, options?: ReactorOptionsInterface): XReactor<T> => {
  let value = v;
  let task: TaskInterface | null = null;
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
    STACK_ITEM().stop();
    value = v;
    state.reactionsList.forEach((context) => {

      if (context.isRunning) {
        return;
      }
      if (task) {
        context.deep = 0;
        STACK_ITEM().remove(task);
      }
      context.deep = context.deep + 1;
      // check recursive call limit
      if (context.deep <= (options?.deep || 100)) {
        task = STACK_ITEM().add(context.cbFn);
      }
    });
    STACK_ITEM().run();
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
    STACK_ITEM().add(fn);
    globalReactor.isRunning = false;
    globalReactorEffect = null;
    globalReactor = null;

  };
  return reactionFn();
};

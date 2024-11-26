import { ReactionFnInterface } from '../models/reaction-fn.interface';
import { GlobalReactorInterface, ReactorStateInterface, XReactor } from './models/reactions.interface';
import { TaskInterface } from '@v/stack-runner';
import { ReactorOptionsInterface } from './models/reactor-options.interface';
import { isWaitUpdate, pushToWaitedUpdate, removeToWaitedUpdate, toPlannedUpdate } from './manager-task';


export interface ReactionModel<T> {
  value: T;
  setTask?: TaskInterface;
  state: ReactorStateInterface;
  context?: GlobalReactorInterface;
}


let globalReactorEffect: GlobalReactorInterface | null = {
  cbFn: null,
  nextUpdateReactions: [],
  planned: false
};

export const reactor = <T>(v: T, options?: ReactorOptionsInterface): XReactor<T> => {

  const reaction: ReactionModel<T> = {
    value: v,
    setTask: null,
    state: {
      reactionsList: []
    }
  };


  const reactorFn = () => {
    // add reaction if not exist equal item in reactionsList
    if (globalReactorEffect &&
      !reaction.state.reactionsList.some(reaction =>
        reaction.cbFn === globalReactorEffect?.cbFn)) {
      reaction.state.reactionsList.push(globalReactorEffect);
    }

    return reaction.value;
  };
  reactorFn.set = (v: T) => {
    reaction.value = v;
    reaction.state.reactionsList.forEach((context) => {
      if (context.isRunning) {
        return;
      }

      if (reaction.setTask) {
        context.deep = 0;
        removeToWaitedUpdate(context, context.cbFn);
      }

      context.deep = context.deep + 1;
      // check recursive call limit
      if (!isWaitUpdate(context, context.cbFn) && context.deep <= (options?.deep || 100)) {
        pushToWaitedUpdate(context, context.cbFn);
      }
      toPlannedUpdate(context);
    });

  };

  reactorFn.destroy = () => {
    reaction.state.reactionsList = [];
  };

  return reactorFn as XReactor<T>;
};


export const reaction = (fn: ReactionFnInterface): void => {
  const reactionFn = () => {
    let globalReactor: GlobalReactorInterface | null = {
      cbFn: fn,
      isRunning: false, deep: 0,
      nextUpdateReactions: [],
      planned: false
    };
    globalReactorEffect = globalReactor;
    globalReactor.isRunning = true;
    fn();
    globalReactor.isRunning = false;
    globalReactorEffect = null;
    globalReactor = null;

  };
  return reactionFn();
};

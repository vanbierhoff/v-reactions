import { ReactionFnInterface } from '../models/reaction-fn.interface';
import { GlobalReactorInterface, ReactorStateInterface, XReactor } from './models/reactions.interface';
import { TaskInterface } from '@v/stack-runner';
import { ReactorOptionsInterface } from './models/reactor-options.interface';
import { isWaitUpdate, plannedUpdateCreate, pushToWaitedUpdate, toPlannedUpdate } from './manager-task';

let idFn = 0;


export interface ReactionModel<T> {
  value: T;
  setTask?: TaskInterface;
  state: ReactorStateInterface;
  context?: GlobalReactorInterface;
}


let globalReactorEffect: GlobalReactorInterface | null = {
  cbFn: null,
  cbId: 0,
  nextUpdateReactions: [],
  planned: false
};

export const reactor = <T>(v: T, options?: ReactorOptionsInterface): XReactor<T> => {

  let reaction: ReactionModel<T> = {
    value: v,
    setTask: null,
    state: {
      reactionsList: []
    }
  };


  const reactorFn = () => {
    if (globalReactorEffect && !reaction.state.reactionsList.some(item => item.cbId === globalReactorEffect.cbId)) {
      reaction.state.reactionsList.push(globalReactorEffect);
    }

    return reaction.value;
  };
  reactorFn.set = (v: T) => {
    reaction.value = v;

    reaction.state.reactionsList.forEach((context) => {
      // restrict set value during run effect / computed
      if (context.isRunning) {
        return;
      }

      context.deep = context.deep + 1;
      // check recursive call limit
      if (!isWaitUpdate(context, context.cbId, context.cbFn) &&
        context.deep <= (options?.deep || 100)) {
        pushToWaitedUpdate(context, context.cbId, context.cbFn);
      }

      plannedUpdateCreate()(context);
    });

  };

  reactorFn.destroy = () => {
    reaction.state.reactionsList = [];
    reaction = undefined as any;
  };

  return reactorFn as XReactor<T>;
};


export const reaction = (fn: ReactionFnInterface): void => {

  const reactionFn = () => {
    idFn += 1;

    let globalReactor: GlobalReactorInterface | null = {
      cbFn: fn,
      cbId: idFn,
      isRunning: false,
      deep: 0,
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

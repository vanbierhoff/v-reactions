import { ReactionFnInterface } from '../models/reaction-fn.interface';
import { GlobalReactorInterface, ReactorStateInterface, XReactor } from './models/reactions.interface';
import { BaseScheduler, Stack } from '@v/stack-runner';




let globalReactorEffect: GlobalReactorInterface | null = {cbFn: null};

const runner = new BaseScheduler('sync');
const stack: Stack = new Stack(runner, true);

export const reactor = <T>(v: T, options?: any): XReactor<T> => {
    let value = v;
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
        value = v;
        state.reactionsList.forEach((context) => {
            // todo вынести deep в options
            if (context.isRunning && context.deep >= 100) {
                return;
            }
            context.deep = context.deep + 1;
            stack.add(context.cbFn);
        });
    };

    return reactorFn as XReactor<T>;
};


export const reaction = (fn: ReactionFnInterface): GlobalReactorInterface => {
    const reactionFn = () => {
        const globalReactor: GlobalReactorInterface = {cbFn: fn, isRunning: false, deep: 0};
        globalReactorEffect = globalReactor;
        globalReactor.isRunning = true;
        stack.add(fn);
        globalReactor.isRunning = false;
        globalReactorEffect = null;
        return globalReactor;
    };
    return reactionFn();
};


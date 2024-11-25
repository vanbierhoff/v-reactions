import { ReactionFnInterface } from '../../models/reaction-fn.interface';


export type ReactorFn<T> = (() => T);

export interface XReactor<T> extends ReactorFn<T> {
    set(v: T): void;
    destroy(): void;

}

export interface GlobalReactorInterface {
    cbFn: ReactionFnInterface;
    isRunning?: boolean;
    deep?: number;
}

export interface ReactorStateInterface {
    reactionsList: Array<GlobalReactorInterface>;
}

import { ReactionFnInterface, UnionReactionFnInterface } from '../../models/reaction-fn.interface';


export type ReactorFn<T> = (() => T);

export interface XReactor<T> extends ReactorFn<T> {
  set(v: T): void;

  destroy(): void;

}

export interface GlobalReactorInterface {
  cbFn: ReactionFnInterface;
  cbId: number;
  isRunning?: boolean;
  deep?: number;
  planned: boolean;
  nextUpdateReactions?: Array<{
    fn: UnionReactionFnInterface,
    id: number
  }>;
}

export interface ReactorStateInterface {
  reactionsList: Array<GlobalReactorInterface>;
}

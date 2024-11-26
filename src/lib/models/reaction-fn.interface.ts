export type ReactionFnInterface = () => void;
export type ReactionComputedFnInterface<T = unknown> = () => T;

export type UnionReactionFnInterface<T = unknown> = ReactionFnInterface | ReactionComputedFnInterface<T>

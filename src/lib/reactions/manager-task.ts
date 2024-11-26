import {
  GlobalReactorInterface,
  stackItem,
  UnionReactionFnInterface
} from '@v-reactions/source';



export const isWaitUpdate = (context: GlobalReactorInterface, fn: UnionReactionFnInterface) => {
  return context.nextUpdateReactions.includes(fn);
};


export const pushToWaitedUpdate = (context: GlobalReactorInterface, fn: UnionReactionFnInterface) => {
  context.nextUpdateReactions.push(fn);
};

export const removeToWaitedUpdate = (context: GlobalReactorInterface, fn: UnionReactionFnInterface) => {
  context.nextUpdateReactions = context.nextUpdateReactions
    .filter(item => item !== fn);
};

const plannedUpdateCreate = () => {
  let plannedCounter = 0;
  return (context: GlobalReactorInterface) => {
    if (context.planned) {
      return;
    }
    context.planned = true;
    context.nextUpdateReactions.forEach((fn) => {
      plannedCounter += 1;
      stackItem.add(fn, () => {
        plannedCounter -= 1;
        if (plannedCounter === 0) {
          context.planned = false;
        }
      });
    });
  };
};

export const toPlannedUpdate = plannedUpdateCreate();

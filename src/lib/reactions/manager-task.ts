import {
  GlobalReactorInterface,
  stackItem,
  UnionReactionFnInterface
} from '@v-reactions/source';



export const isWaitUpdate = (context: GlobalReactorInterface, id: number, fn: UnionReactionFnInterface) => {
  return context.nextUpdateReactions.some(item => item.id === id);
};


export const pushToWaitedUpdate = (context: GlobalReactorInterface, id: number, fn: UnionReactionFnInterface) => {
  context.nextUpdateReactions.push({ id, fn });
};

export const removeToWaitedUpdate = (context: GlobalReactorInterface, id: number, fn: UnionReactionFnInterface) => {
  context.nextUpdateReactions = context.nextUpdateReactions
    .filter(item => item.id !== id);
};

export const plannedUpdateCreate = () => {
  let plannedCounter = 0;
  return (context: GlobalReactorInterface) => {
    if (context.planned) {
      return;
    }
    context.planned = true;
    context.nextUpdateReactions.forEach((item) => {
      plannedCounter += 1;
      stackItem.add(item.fn, () => {
        plannedCounter -= 1;
        if (plannedCounter === 0) {
          context.planned = false;
        }
      });
    });
  };
};

export const toPlannedUpdate = plannedUpdateCreate();

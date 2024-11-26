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
  let taskLen = 0;
  return (context: GlobalReactorInterface) => {
    if (context.planned) {
      return;
    }
    context.planned = true;
    taskLen = context.nextUpdateReactions.length;
    context.nextUpdateReactions.forEach((item, i) => {
      stackItem.add(item.fn, () => {
        if (taskLen === i+1) {
          context.planned = false;
        }
      });
    });
  };
};

export const toPlannedUpdate = plannedUpdateCreate();

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
  return (context: GlobalReactorInterface) => {
    if (context.planned) {
      return;
    }
    context.planned = true;
    const task = () => {
      context.nextUpdateReactions.forEach((item, i) => {
        item.fn();
      });
    };
    stackItem.add(task, () => {
      context.planned = false;
      context.nextUpdateReactions = [];
    });

  };
};

export const toPlannedUpdate = plannedUpdateCreate();

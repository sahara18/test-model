import channel from 'utils/channel';
import {Action} from 'utils/types';

/*
* Decorator to mark model 'key' field, used to make model actionTypes relatively:
* e.g. 'Todos/main/setCompleted', where 'main' is the key
* */
export const key: PropertyDecorator = (target, key) => {
  // @ts-ignore
  target.key = key;
};

/*
* Decorator to mark model 'action' method, which is
* - getting autobinded
* - getting toString returning actionType
* */
// @ts-ignore
export const action: MethodDecorator = (target, key, descriptor) => {
  let fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new TypeError(`@action decorator can only be applied to methods, not ${typeof fn}`);
  }

  // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.
  let definingProperty = false;

  return {
    configurable: true,
    get() {
      // @ts-ignore // eslint-disable-next-line no-prototype-builtins
      if (definingProperty || this === target.prototype || this.hasOwnProperty(key) ||
        typeof fn !== 'function') {
        return fn;
      }

      // @ts-ignore
      const actionType = [target.constructor.name, this[this.key], key]
        .filter(Boolean)
        .join('/');
      const boundFn = (...args: any[]) => {
        channel.emit(actionType, {
          type: actionType,
          payload: args,
        } as Action);
        // @ts-ignore
        return fn.apply(this, args);
      };
      boundFn.toString = () => actionType;

      definingProperty = true;
      Object.defineProperty(this, key, {
        configurable: true,
        get() {
          return boundFn;
        },
        set(value) {
          fn = value;
          delete this[key];
        }
      });
      definingProperty = false;

      return boundFn;
    },
    set(value) {
      fn = value;
    }
  };
};

/* eslint-disable no-param-reassign */
// @ts-ignore
// export const model: ClassDecorator = (target) => {
//   // @ts-ignore
//   return class extends target {
//     constructor(...args: any[]) {
//       super(...args);
//       // @ts-ignore
//       // console.log('model', this, this.login);
//     }
//   };
// };

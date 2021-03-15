import {Action, CallReturnType, FnDefault, PromiseResolveType} from 'utils/types';
import {isPromise} from 'utils/assert';
import channel from 'utils/channel';
import {Observable} from 'utils/observable';

export const runSaga = async (it: Iterator<any, any, any>): Promise<void> => {
  let nextValue = undefined;

  while (true) {
    const {value, done} = it.next(nextValue);

    nextValue = isPromise(value)
      ? await value
      : undefined;

    if (done) break;
  }
};

export function get<T>(ob: Observable<T>): Promise<T> {
  return Promise.resolve(ob.get());
}

export function call<Fn extends FnDefault>(fn: Fn, ...args: Parameters<Fn>): ReturnType<Fn>;
export function call<Fn extends Promise<any>>(fn: Fn): PromiseResolveType<Fn>;
export function call<Fn>(
  fn: Fn,
  ...args: Fn extends FnDefault ? Parameters<Fn> : any[]
): Promise<CallReturnType<Fn>> {
  if (isPromise(fn)) return fn;

  // @ts-ignore
  return Promise.resolve(fn(...args));
}

export function take<Fn extends FnDefault>(
  fn: Fn,
): Promise<Action<Parameters<Fn>>> {
  return call(new Promise<ReturnType<Fn>>((resolve) => {
    channel.on(fn.toString(), resolve);
  }));
}

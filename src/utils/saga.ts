import {Action, CallReturnType, Func, GeneratorReturnType, ResolveType, Saga} from 'utils/types';
import {isPromise} from 'utils/assert';
import channel from 'utils/channel';
import {Observable} from 'utils/observable';

const running = new Map();

export const runSaga = (...sagas: Saga[]): void => {
  for (const saga of sagas) {
    const it = saga();
    running.set(saga, it);

    // eslint-disable-next-line no-loop-func
    (async () => {
      let nextValue = undefined;
      while (true) {
        const {value, done} = it.next(nextValue);
        nextValue = isPromise(value) ? await value : undefined;
        if (done) break;
      }
    })();
  }
};

export function get<T>(ob: Observable<T>): Promise<T> {
  return Promise.resolve(ob.get());
}

export function call<Fn extends Func>(fn: Fn, ...args: Parameters<Fn>): ReturnType<Fn>;
export function call<Fn extends Promise<any>>(fn: Fn): ResolveType<Fn>;
export function call<Fn extends Saga>(fn: Fn): ReturnType<GeneratorReturnType<Fn>>;
export function call<Fn extends Function>(
  fn: Fn,
  ...args: Fn extends Func ? Parameters<Fn> : any[]
): Promise<CallReturnType<Fn>> {
  if (isPromise(fn)) return fn;
  return Promise.resolve(fn(...args));
}

export function take<Fn extends Func>(fn: Fn): Promise<Action<Parameters<Fn>>> {
  return call(new Promise<ReturnType<Fn>>((resolve) => {
    channel.on(fn.toString(), resolve);
  }));
}

export function cancel<Fn extends Saga>(fn: Fn): void {
  const it = running.get(fn);
  it?.return();
}

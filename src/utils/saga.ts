import {Action, CallReturnType, Func, ResolveType, Saga, SagaIterator, SagaReturnType} from 'utils/types';
import {isSaga, isPromise} from 'utils/assert';
import channel from 'utils/channel';
import {Observable} from 'utils/observable';

const running = new Map<Saga<any>, SagaIterator<any>>();

const runSingleSaga = async <T>(it: SagaIterator<T>, saga: Saga<T>): Promise<T> => {
  running.set(saga, it);

  let nextValue = undefined;
  while (true) {
    const {value, done} = it.next(nextValue);
    nextValue = isPromise(value) ? await value : undefined;

    if (done) {
      running.delete(saga);
      return value;
    }
  }
}

export const runSaga = (...sagas: Saga[]): void => {
  for (const saga of sagas) {
    const it = saga();
    runSingleSaga(it, saga);
  }
};

export function get<T>(ob: Observable<T>): Promise<T> {
  return Promise.resolve(ob.get());
}

export function call<Fn extends Func>(fn: Fn, ...args: Parameters<Fn>): Promise<ReturnType<Fn>>;
export function call<Fn extends Promise<any>>(fn: Fn): Promise<ResolveType<Fn>>;
export function call<Fn extends Saga>(fn: Fn): Promise<SagaReturnType<Fn>>;
export function call<Fn extends Function>(
  fn: Fn,
  ...args: Fn extends Func ? Parameters<Fn> : any[]
): Promise<CallReturnType<Fn>> {
  if (isPromise(fn)) return fn;
  const result = fn(...args);
  if (isSaga(result)) {
    // @ts-ignore
    return runSingleSaga<SagaReturnType<Fn>>(result, fn);
  }
  return Promise.resolve(result);
}

export function take<Fn extends Func>(fn: Fn): Promise<Action<Parameters<Fn>>> {
  return call(new Promise<ReturnType<Fn>>((resolve) => {
    channel.on(fn.toString(), resolve);
  }));
}

export function cancel<Fn extends Saga>(fn: Fn): void {
  const it = running.get(fn);
  if (it) {
    it.return(undefined);
    running.delete(fn);
  }
}

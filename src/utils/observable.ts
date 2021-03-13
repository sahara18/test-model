import {useEffect, useState} from 'react';
import {toJS} from 'utils/immutable';

export class Observable<T> {
  private value: T;
  private subscribers: Function[] = [];

  constructor(value: T) {
    this.value = value;
  }

  get() {
    return this.value;
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value;
      for (const fn of this.subscribers) {
        fn(value);
      }
    }
    return this.value;
  }

  update(updater: (value: T) => T) {
    this.set(updater(this.value));
  }

  on(fn: Function) {
    this.subscribers.push(fn);
  }

  off(fn: Function) {
    const index = this.subscribers.findIndex((f) => f === fn);
    this.subscribers.splice(index, 1);
  }

  toJSON() {
    return toJS(this.get());
  }
}

export const useObservable = <T>(observable: Observable<T>): T => {
  const [value, setValue] = useState<T>(observable.get());

  useEffect(() => {
    observable.on(setValue);
    return () => observable.off(setValue);
  }, [observable, setValue]);

  return value;
};

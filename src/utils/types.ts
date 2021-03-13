import {Effects} from 'utils/saga';

export interface Action<P = any, T = string> {
  type: T;
  payload: P;
}

export type Saga<T = void> = Generator<Effect, Effect | T>;

export interface EffectTake {
  type: Effects.TAKE;
  payload: string;
}

export type Effect =
  | EffectTake;

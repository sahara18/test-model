import {Effect, EffectTake} from 'utils/types';
import channel from './channel';

export enum Effects {
  TAKE = 'effect/TAKE',
}

const effectDispatched = (effectType: string) => (
  new Promise((resolve) => {
    channel.on(effectType, resolve);
  })
);

export const runSaga = async <T>(it: Iterator<Effect, Effect | T, any>): Promise<void> => {
  let nextValue = undefined;

  while (true) {
    const {value: effect, done} = it.next(nextValue);

    if (effect && 'type' in effect) {
      switch (effect.type) {
        case Effects.TAKE:
          nextValue = await effectDispatched(effect.payload);
          break;
      }
    }

    if (done) break;
  }
};

export const take = (fn: Function): EffectTake => ({
  type: Effects.TAKE,
  payload: fn.toString(),
});

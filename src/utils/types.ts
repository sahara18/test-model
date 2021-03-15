export type FnDefault = (...args: any) => any;
export type PromiseResolveType<Fn> = Fn extends PromiseLike<infer U> ? U : Fn;
export type GeneratorYieldType<Fn> = Fn extends Generator<infer U> ? U : Fn;
export type GeneratorReturnType<Fn> = Fn extends Generator<any, infer U> ? U : Fn;
export type GeneratorNextType<Fn> = Fn extends Generator<any, any, infer U> ? U : Fn;

export type CallReturnType<Fn> =
  Fn extends PromiseLike<any> ? PromiseResolveType<Fn> :
    Fn extends Generator ? GeneratorReturnType<Fn> :
      Fn extends FnDefault ? ReturnType<Fn> :
        unknown;

export interface Action<P = any, T = string> {
  type: T;
  payload: P;
}

export type Saga<T = void> = Generator<Promise<any> | void, Promise<Action> | T, Promise<any>>;

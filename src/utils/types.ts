export type Func = (...args: any) => any;
export type ResolveType<Fn> = Fn extends PromiseLike<infer U> ? U : Fn;
export type GeneratorYieldType<Fn> = Fn extends Generator<infer U> ? U : Fn;
export type GeneratorReturnType<Fn> = Fn extends Generator<any, infer U> ? U : Fn;
export type GeneratorNextType<Fn> = Fn extends Generator<any, any, infer U> ? U : Fn;

export interface Action<P = any, T = string> {
  type: T;
  payload: P;
}

export type SagaIterator<T = void> = Generator<Promise<any> | void, Promise<Action> | T, Promise<any>>;
export type SagaIteratorReturnType<Fn> = Fn extends SagaIterator<infer U> ? U : Fn;

export type Saga<T = void, P extends any[] = any[]> = (...args: P) => SagaIterator<T>;
export type SagaReturnType<Fn> = Fn extends Saga<infer U> ? U : Fn;

export type CallReturnType<Fn> =
  Fn extends PromiseLike<any> ? ResolveType<Fn> :
    // Fn extends Saga ? SagaReturnType<Fn> :
      Fn extends Func ? ReturnType<Fn> :
        unknown;

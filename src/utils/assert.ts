export const isPromise = (fn: any): fn is Promise<any> => (
  fn && (fn as Promise<any>).then !== undefined
);

export const isSaga = (fn: any): boolean => (
  fn && fn[Symbol.toStringTag] === 'Generator'
);

const sampleGenerator = function* sample(): Generator {};
export const isGenerator = (fn: any): boolean => (
  fn && fn.constructor === sampleGenerator.constructor
);

export const isPromise = (fn: any): fn is Promise<any> => (
  fn && (fn as Promise<any>).then !== undefined
);

const sampleGenerator = function* sample(): Generator {};
export const isGenerator = (fn: Function): boolean => (
  fn.constructor === sampleGenerator.constructor
);

function isPromise(fn: any): fn is Promise<any> {
  return (fn as Promise<any>).then !== undefined;
}

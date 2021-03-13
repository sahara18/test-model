import {isImmutable} from 'immutable';

export const toJS = (obj: any) => isImmutable(obj) ? obj.toJS() : obj;

import {EventEmitter} from 'events';

// TODO defaultMaxListeners is awful
export const createChannel = (): EventEmitter => new EventEmitter();

export default createChannel();

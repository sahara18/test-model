import {EventEmitter} from 'events';

export const createChannel = (): EventEmitter => new EventEmitter();

export default createChannel();
